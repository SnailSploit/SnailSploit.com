# dexidp/dex: transitive SSO session trust bypass in findSSOSession

**Package**: github.com/dexidp/dex
**Ecosystem**: Go
**Affected versions**: all versions providing the `sessions` SSO feature (`ssoSharedWith`); confirmed on `master` @ `5d04dfbfb1e6897da64872217ff24ad9b31f270b` (2026-06-24)
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:N/AC:H/PR:L/UI:N/S:C/C:H/I:N/A:N` — **6.8**
**CWE**: CWE-863 (Incorrect Authorization)

> **Provenance — reproduced at runtime (with a negative control).** Built dex from
> source (master `5d04dfbf`, go1.25.8) and ran the PoC test: `TestSSO_TransitiveTrustChain`
> **PASSED** (A→B→C chain completes). A **negative control** — identical setup but with
> client-B sharing with nobody — produced `okBC=false`, proving the pass is not vacuous:
> C is reachable only because B's SSO-derived state plus B's `SSOSharedWith:["client-c"]`
> authorizes the second hop. All cited symbols were confirmed to exist in the tested
> tree; anchors below are exact.

## Summary

When dex is configured with session-based SSO (the `sessions` block) and inter-client
sharing via `ssoSharedWith`, the SSO trust relationship is **transitive**, contrary to
the code's own "unidirectional" comment. If client A shares with B and B shares with C,
a user who authenticates only to A is silently SSO-authenticated into C — even though A
never authorized C. The root cause is that `findSSOSession` treats an SSO-*derived*
client state as an eligible SSO *source* on subsequent requests, identically to a
directly-authenticated state.

## Root cause (anchors confirmed at `5d04dfbf`)

`findSSOSession` (`server/session.go:348`) iterates **every** active, non-expired entry
in `session.ClientStates` (`session.go:351`) and, for each, loads that source client and
honors its `SSOSharedWith` policy (`session.go:356-365`). It does **not** distinguish a
directly-authenticated `ClientAuthState` from one minted by a prior SSO hop.

When a target client is SSO'd in, `trySessionLoginWithSession` (`server/session.go:374`)
writes a fresh `ClientAuthState{Active: true, ...}` into `ClientStates`
(`session.go:402-406`) that is **byte-for-byte indistinguishable** from a direct-auth
state. On the next request that SSO-derived state is therefore an eligible SSO source,
and its own `SSOSharedWith` list is followed — producing the transitive chain.

Supporting anchors:
- `clientSharesSessionWith` (`server/session.go:314`) — carries the "SSO sharing is
  unidirectional" comment that the implementation contradicts.
- `Client.SSOSharedWith` (`storage/storage.go:205`); config `ssoSharedWith` /
  `SSOSharedWithDefault` (`cmd/dex/config.go:692`, `serve.go:830`, consumed at
  `session.go:319`).
- `getValidAuthSession` (`server/session.go:218`).

## Proof of Concept (drop-in Go test, executed)

`dex-transitive-sso-poc_test.go` into `server/`, then:

```
go test -run TestSSO_TransitiveTrustChain -v ./server/
```

Configuration under test — A trusts only B, B trusts only C, A does **not** trust C:

```yaml
staticClients:
  - id: client-a   ssoSharedWith: ["client-b"]   # only trusts B
  - id: client-b   ssoSharedWith: ["client-c"]   # only trusts C
  - id: client-c   ssoSharedWith: []             # trusts nobody
sessions: { cookieName: dex-session, absoluteLifetime: 24h, validIfNotUsedFor: 1h }
```

Observed:

```
=== RUN   TestSSO_TransitiveTrustChain
    BUG CONFIRMED: Transitive SSO chain A→B→C succeeded.
    Client C was authenticated via B's SSO-derived session state,
    even though Client A (the auth origin) never shared with C.
--- PASS: TestSSO_TransitiveTrustChain (0.00s)
ok  github.com/dexidp/dex/server
```

**Negative control:** identical setup but `client-b ssoSharedWith: []` → `okBC=false`
(C denied). This confirms C's access is caused specifically by the transitive hop, not
by any ambient session validity.

## Amplification

- `ssoSharedWith: ["*"]` anywhere in the chain extends it to **all** registered clients.
- `ssoSharedWithDefault: "all"` puts every client into transitive chains by default.
- No depth bound: A→B→C→D→… all succeed.

## Impact

Users authenticated to a high-trust client are silently authenticated into untrusted
downstream clients they never authorized. The high-trust client's admin cannot prevent
it — their `ssoSharedWith` controls only the *direct* hop, not transitive propagation.
In multi-tenant deployments a chain spanning tenants enables cross-tenant
authentication. (`S:C` reflects crossing the originating client's trust boundary;
`C:H` is identity/authentication exposure; no integrity/availability impact.)

## Remediation

Track SSO provenance and refuse SSO-derived states as sources. Add an `SSOSource` field
to `ClientAuthState` (empty = direct auth) and skip non-empty entries in
`findSSOSession`:

```go
for sourceClientID, state := range session.ClientStates {
    if !state.Active || now.After(state.ExpiresAt) { continue }
    if state.SSOSource != "" { continue } // skip SSO-derived states — prevents transitivity
    // ... existing lookup
}
```

Alternatively, carry an `SSODepth` counter (direct=0, SSO=source+1) and reject beyond a
configurable limit (default 1). A regression test should cover A→B→C (the existing
`TestSSO_Unidirectional` at `session_test.go` only covers one hop).

---

## Secondary (Low) — double URL-decode of `redirect_uri`

**CWE-175 · Low · not independently exploitable.** Bundled here because it ships in the
same component; the upstream disclosure covers both.

`server/oauth2.go` calls `r.ParseForm()` (`:479`), which populates `r.Form` with values
Go's net/http has **already URL-decoded once**; line `:483` then applies a **second**
decode:

```go
479: if err := r.ParseForm(); err != nil { ... }
482: q := r.Form
483: redirectURI, err := url.QueryUnescape(q.Get("redirect_uri"))   // second decode
```

Only `redirect_uri` is double-decoded — the adjacent `client_id`/`state` (`:488-489`)
use `q.Get(...)` directly. It is **not** exploitable for redirect bypass
(`validateRedirectURI` does exact-string matching), but it creates a normalization
differential with the token-exchange endpoint (which single-decodes), so URIs containing
literal `%25` can mismatch. **Fix:** drop the extra `url.QueryUnescape` —
`redirectURI := q.Get("redirect_uri")`.
