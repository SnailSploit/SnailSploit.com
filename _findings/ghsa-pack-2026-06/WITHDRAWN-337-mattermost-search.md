# WITHDRAWN — mattermost SearchPostsInTeam "membership bypass" is working-as-intended

**Package**: github.com/mattermost/mattermost
**Status**: **WITHDRAWN — do not submit.** Reclassified from Tier-3 borderline to a
non-finding after locking exact anchors at **v11.8.2** (commit
`f4e6ebaf057b1d59bb735ee51f849624cf25b24d`).

## Why it was withdrawn

The earlier draft claimed `SearchPostsInTeam` returns posts from channels the caller
is not a member of. Confirming the anchors against the real v11.8.2 tree shows the
unscoped behaviour is **deliberate and reachable only by trusted server-side code** —
there is no privilege boundary crossing. The user-facing search path is correctly
membership-scoped.

### What the source actually shows (anchors confirmed at v11.8.2)

The store's channel-membership predicate is **conditional**, gated by a flag:

```go
// server/channels/store/sqlstore/post_store.go:2259-2280  (func search, defined at :2160)
inQuery := s.getSubQueryBuilder().Select("Id").From("Channels, ChannelMembers").Where("Id = ChannelId")
...
if !params.SearchWithoutUserId {                              // :2267
    inQuery = inQuery.Where("ChannelMembers.UserId = ?", userId)   // :2268  ← membership filter
}
```

- **User-facing path is scoped (NOT vulnerable):** `App.SearchPostsForUser`
  (`server/channels/app/post.go:2139`) passes the real `userID` (`:2174`) and never
  sets `SearchWithoutUserId`, so the `ChannelMembers.UserId` filter applies. This is
  the API4 search that ordinary authenticated users hit.

- **The unscoped method is intentional and team-wide:** `App.SearchPostsInTeam`
  (`server/channels/app/post.go:2129-2137`) **explicitly** sets
  `params.SearchWithoutUserId = true` (`:2135`) and passes an empty userID. It is, by
  name and by construction, a team-wide search — not a per-user one. The only
  post-query filter (`filterInaccessiblePosts`, `post_helpers.go:144`) is a
  data-retention time boundary, not a membership check.

- **Only trusted callers reach it:** the unscoped method is exposed through the
  **plugin API** `PluginAPI.SearchPostsInTeam` (`server/channels/app/plugin_api.go:569`;
  interface `server/public/plugin/api.go:543-548`, which takes no acting-user
  context). Mattermost plugins are **server-side trusted code with direct database
  access** — they cross no authorization boundary by calling a team-wide search. A
  membership-scoped sibling, `PluginAPI.SearchPostsInTeamForUser`
  (`plugin_api.go:577`), exists for plugins that want per-user scoping.

### Verdict

No under-privileged actor can use this to read channels they aren't in: the
user-facing path is scoped, and the unscoped path is an intentional team-wide method
available only to trusted plugins/internal callers that already have full data access.
This is **working-as-intended**, analogous to the Grafana raw-SQL case — a vendor
would close it. Withdrawn.

> If a future threat model treats untrusted/sandboxed plugins as adversaries, the
> relevant hardening would be to document `SearchPostsInTeam` as team-wide and steer
> membership-sensitive plugins to `SearchPostsInTeamForUser` — a docs/hardening note,
> not a security advisory.
