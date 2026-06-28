# GHSA Submission Pack — 2026-06

Consolidated, submission-ready pack assembled from the multi-archive verification run.
Every finding here was reproduced by **building the real target and executing the
PoC** (no static-trace confirmations); corrections from that run are folded into each
report. See [`VERIFICATION-SUMMARY.md`](./VERIFICATION-SUMMARY.md) for the full
environment + recalibration matrix.

This directory is committed to git but excluded from the published site via
`.pages-ignore` (it is a working/submission pack, not a website page).

## Roster — 13 submittable, 3 dead

### Tier 1 — submit as-is (clean reproduction, anchors verified)

| Finding | File | Severity | CVSS |
|---|---|---|---|
| picklescan deny-list evasion → RCE (×3 + `-m` exit bug) | [ghsa-picklescan-denylist-bypass.md](./ghsa-picklescan-denylist-bypass.md) | Medium | 6.1 |
| #338 ImageMagick coder-policy EPS bypass | [ghsa-338-imagemagick-eps-policy-bypass.md](./ghsa-338-imagemagick-eps-policy-bypass.md) | High | 7.2 |
| #340 gitea Actions token cache bypass | [ghsa-340-gitea-token-cache-bypass.md](./ghsa-340-gitea-token-cache-bypass.md) | High | 7.1 |
| #343 nuxt island-teleport `</template>` XSS | [ghsa-343-nuxt-island-teleport-xss.md](./ghsa-343-nuxt-island-teleport-xss.md) | High | 7.5 |
| #342 jellyfin RemoteImages SSRF | [ghsa-342-jellyfin-remoteimage-ssrf.md](./ghsa-342-jellyfin-remoteimage-ssrf.md) | Medium | 6.8 |
| typst `typst init` template.path traversal | [ghsa-typst-init-path-traversal.md](./ghsa-typst-init-path-traversal.md) | Medium | 5.5 |
| #334 pocketbase JSVM `$http.send` SSRF † | [ghsa-334-pocketbase-jsvm-ssrf.md](./ghsa-334-pocketbase-jsvm-ssrf.md) | Medium | 6.8 |

### Tier 2 — submit after the noted fix (already applied in-file)

| Finding | File | Severity | CVSS | Fix applied |
|---|---|---|---|---|
| #341 pandoc wkhtmltopdf local file read | [ghsa-341-pandoc-wkhtmltopdf-file-read.md](./ghsa-341-pandoc-wkhtmltopdf-file-read.md) | Medium | 6.5 | payload swapped — `file:///etc/passwd` fails (`?page=N`); use extensioned target / iframe footer |
| go-task git cache poisoning | [ghsa-gotask-git-cache-poisoning.md](./ghsa-gotask-git-cache-poisoning.md) | Medium | 5.0 | reframed as local TOCTOU; path is `os.TempDir()` not `/tmp` |
| dive tar path traversal (Ctrl+E extract) | [ghsa-dive-tar-path-traversal.md](./ghsa-dive-tar-path-traversal.md) | Medium | 4.4 | recalibrated 7.1→4.4; constraints documented |
| go-task env exfil via Sprig `env`/`expandenv` | [ghsa-gotask-env-exfil.md](./ghsa-gotask-env-exfil.md) | Medium | 6.5 | dropped `S:C` scope change |

### Tier 3 — borderline (submit only with the stated framing / your call)

| Finding | File | Severity | CVSS | Why borderline |
|---|---|---|---|---|
| #337 mattermost SearchPostsInTeam membership bypass † | [ghsa-337-mattermost-search-membership-bypass.md](./ghsa-337-mattermost-search-membership-bypass.md) | High base / Tier-3 | 7.7 | anchors exact, but proof is query-builder reproduction — no live-DB runtime retrieval |
| go-task `if`/`status`/`precondition` shell injection | [ghsa-gotask-if-shell-injection.md](./ghsa-gotask-if-shell-injection.md) | Medium | 5.5 | only a vuln when an untrusted *variable source* feeds a trusted Taskfile |

† **Reconstructed reports** — reproduced by execution in the verification run, but the
markdown was rewritten here from the transcript. pocketbase #334 has symbol-level
anchors that need a final line-number pass against v0.39.4 before formal submission;
mattermost #337's anchors are exact but its runtime proof is incomplete (see file).

### Dead — do NOT submit

See [`DEAD-LEADS.md`](./DEAD-LEADS.md): **#339 FFmpeg** (static-trace, withdrawn),
**#336 Grafana** (working-as-intended), **#335 unidoc** (no reachable sink).

## Notes

- #342 (jellyfin) and #343 (nuxt) were executed and shipped separately from the four
  source archives; included here for a single consolidated roster.
- Counts: **13 submittable** (7 Tier-1 + 4 Tier-2 + 2 Tier-3), **3 dead**, **16 total**
  findings evaluated.
