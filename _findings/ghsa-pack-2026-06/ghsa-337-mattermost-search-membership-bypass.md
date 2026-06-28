# mattermost/mattermost: SearchPostsInTeam returns posts from channels the caller is not a member of

**Package**: github.com/mattermost/mattermost
**Ecosystem**: Go
**Affected versions**: confirmed against source at the cited commit (anchors below)
**Patched versions**: none
**Severity**: Medium (borderline — see provenance)
**CVSS 3.1**: `AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:N/A:N` — **7.7** (base; carried in the verification matrix as ~7.5). Held at **Tier 3 / borderline** on proof-depth, not score.
**CWE**: CWE-862 (Missing Authorization)

> **Provenance — reconstructed report + honest limitation.** The SQL divergence and
> the full call chain were **confirmed against the real Mattermost source** at the
> cited commit (anchors are exact). However, the only thing *executed* was a
> re-implemented query builder reproducing the unscoped SQL shape — there was **no
> live-DB runtime retrieval of a private post**. This is genuinely submittable but
> would be airtight only after running the integration test against a real Postgres
> instance and observing a private post cross the boundary. Treat as borderline until
> that runtime proof exists.

## Summary

`SearchPostsInTeam` (and the plugin API surface that reaches it) builds its search
query scoped to the team but **does not constrain results to channels the requesting
user is a member of**, and no downstream membership re-check filters the returned
posts. A caller — notably via the unscoped plugin API — can retrieve message content
from private channels and DMs within the team that they have no membership in.

## Affected code (anchors confirmed against real source)

- `store/sqlstore/post_store.go:2267` — the search query builder. The `WHERE` clause
  scopes by team (and search terms) but does not join/filter on channel membership for
  the requesting user.
- `app/post.go:2154` — the app-layer call into the store search; it forwards the
  search without injecting a per-user channel-membership constraint.
- The **plugin API** path reaches this search **unscoped** (no acting-user membership
  context), and there is **no downstream membership re-check** on the returned posts
  before they are handed back to the caller.

The divergence is from the membership-aware retrieval paths elsewhere in the codebase
(normal channel post fetches re-check membership); this search path omits that check.

## Proof of Concept (what was actually executed)

A standalone Go harness re-implemented the `post_store.go:2267` query builder with the
same conditions and confirmed the generated SQL **lacks any `ChannelMembers`
join/filter for the requesting user** — i.e. the query, as built, will return posts
from channels the user is not a member of. The full call chain
(`plugin API → app/post.go:2154 → post_store.go:2267`, with no membership re-check on
the way back) was traced against the real source at the cited commit.

```
# Executed: query-builder reproduction
built SQL for SearchPostsInTeam(team, terms) →
  WHERE Posts.TeamId = ? AND <search terms>            ← scoped to TEAM only
  (no JOIN ChannelMembers ON ... AND ChannelMembers.UserId = <caller>)
RESULT: query returns posts regardless of caller channel membership
```

**Not yet executed (required to make it airtight):** seed Postgres with a private
channel the test user is *not* in, post a secret message there, call
`SearchPostsInTeam`/the plugin API as that user, and assert the secret message is
returned.

## Impact

Disclosure of private-channel and DM message content within a team to a user who is
not a member of those channels — a confidentiality / broken-access-control breach
across the channel-membership trust boundary. Highest exposure via the plugin API,
which reaches the search without the acting user's membership scope.

## Mitigation

Constrain the search to the requesting user's channel memberships at the store layer
(join `ChannelMembers` on `ChannelId AND UserId = :requestingUser`), or apply a
membership re-check filter on the returned post set before responding. Ensure the
plugin API path supplies and enforces the acting user's membership scope rather than
running unscoped.
