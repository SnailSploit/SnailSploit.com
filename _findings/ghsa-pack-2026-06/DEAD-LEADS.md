# Dead leads — investigated and withdrawn (do NOT submit)

Four findings from the verification run were tested against real targets and **do not
hold up**. They are recorded here so they are not re-opened or accidentally
re-submitted.

## #337 — mattermost: `SearchPostsInTeam` membership "bypass" — **WITHDRAWN (working-as-intended)**

- **Verdict:** reclassified from Tier-3 borderline to a non-finding after locking
  anchors at **v11.8.2**. The unscoped search is **intentional** — `App.SearchPostsInTeam`
  (`post.go:2135`) deliberately sets `SearchWithoutUserId = true`; it's a team-wide
  method. The **user-facing** path (`SearchPostsForUser`, API4) IS membership-scoped.
- **Why it's not a vuln:** the unscoped method is reachable only via the plugin API
  (`plugin_api.go:569`), and Mattermost plugins are trusted server-side code with
  direct DB access — no privilege boundary is crossed. A scoped sibling
  (`SearchPostsInTeamForUser`) exists for plugins that want per-user scoping.
- **Action:** see [`WITHDRAWN-337-mattermost-search.md`](./WITHDRAWN-337-mattermost-search.md).
  Docs/hardening note at most. Do not submit.

## #339 — FFmpeg: bitstream-filter `NEW_EXTRADATA` strip — **WITHDRAW (false finding)**

- **Verdict:** never reproduced at runtime. The finding's own run-log shows the side
  data is **present after the bitstream filter** (`NEW_EXTRADATA AFTER BSF: PRESENT`)
  and that the tested build (7.1.1) does **not** strip it.
- **Why it's wrong:** the code path it flagged is an **intentional, documented fix**
  ("Fix mixed bitstream format") whose SPS/PPS is re-emitted in-band; the `VULNERABLE`
  verdict was a hardcoded constant in the harness, i.e. a **static trace**, not an
  execution result.
- **Rule violated:** "real PoCs only — no static-trace confirmations."
- **Action:** pull. Do not submit.

## #336 — Grafana: SQL macro injection — **WORKING AS INTENDED**

- **Verdict:** the injection "executes," but the macro argument originates from the
  **same `rawSql`** the caller already submitted. No privilege boundary is crossed.
- **Why it's not a vuln:** Grafana documents raw-SQL-by-query-users as **by design**;
  a user who can write `rawSql` can already run that SQL. There is no escalation.
- **Action:** a vendor closes this. Do not submit.

## #335 — unidoc: `.rels` path traversal — **NO SINK**

- **Verdict:** the PoC proves only that an un-normalised string reaches a callback.
- **Why it's not a vuln:** downstream `path.Clean` confines the value to an
  **in-archive map key**. No file operation, no panic, no cross-part confusion is
  attributable to the traversal. There is no reachable sink.
- **Action:** hardening note at most. Do not submit as a security finding.
