# GHSA Submission Pack — 2026-06

Consolidated, submission-ready pack assembled from the multi-archive verification run.
Every finding here was reproduced by **building the real target and executing the
PoC** (no static-trace confirmations); corrections from that run are folded into each
report. See [`VERIFICATION-SUMMARY.md`](./VERIFICATION-SUMMARY.md) for the full
environment + recalibration matrix.

This directory is committed to git but excluded from the published site via
`.pages-ignore` (it is a working/submission pack, not a website page).

## Roster — 13 submittable, 4 dead

Paste-ready GHSA form fields for the GHSA-routable findings are in
[`GHSA-EXPORTS.md`](./GHSA-EXPORTS.md).

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
| dex transitive SSO trust bypass (reproduced + negative control) | [ghsa-dex-transitive-sso.md](./ghsa-dex-transitive-sso.md) | Medium | 6.8 |

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
| go-task `if`/`status`/`precondition` shell injection | [ghsa-gotask-if-shell-injection.md](./ghsa-gotask-if-shell-injection.md) | Medium | 5.5 | only a vuln when an untrusted *variable source* feeds a trusted Taskfile |

† **Reconstructed report** — pocketbase #334 was reproduced by execution in the
verification run and its markdown was rewritten from the transcript; the source
anchors have since been **re-confirmed against the v0.39.4 tree** (commit `507ecb26`),
so it is now fully anchored.

### Dead — do NOT submit

See [`DEAD-LEADS.md`](./DEAD-LEADS.md): **#337 mattermost** (working-as-intended —
withdrawn after locking v11.8.2 anchors; the unscoped search is intentional and
plugin-only), **#339 FFmpeg** (static-trace, withdrawn), **#336 Grafana**
(working-as-intended), **#335 unidoc** (no reachable sink).

## Submission routing (verified against each project's SECURITY.md)

| Finding | Vendor channel | Where to send |
|---|---|---|
| #340 gitea | **EMAIL** | security@gitea.io |
| #342 jellyfin | **EMAIL** | security@jellyfin.org (subject `[Jellyfin Security]`) |
| #334 pocketbase | **EMAIL** | support@pocketbase.io |
| #341 pandoc | **EMAIL** | jgm@berkeley.edu |
| #343 nuxt | EMAIL-alt (GHSA preferred) | security@nuxtjs.org · GHSA: https://github.com/nuxt/nuxt/security/advisories/new |
| go-task ×3 | EMAIL-alt (GHSA equal) | task@taskfile.dev · GHSA: https://github.com/go-task/task/security/advisories/new |
| picklescan | **GHSA** | https://github.com/mmaitre314/picklescan/security/advisories/new |
| #338 ImageMagick | **GHSA** | https://github.com/ImageMagick/ImageMagick/security/advisories/new |
| typst | GHSA / maintainer (no SECURITY.md) | https://github.com/typst/typst/security/advisories/new |
| dive | GHSA / maintainer (no SECURITY.md) | https://github.com/wagoodman/dive/security/advisories/new |
| dex transitive SSO | EMAIL (then GHSA) | cncf-dex-maintainers@lists.cncf.io · GHSA: https://github.com/dexidp/dex/security/advisories/new |

Gmail drafts were prepared for the email-channel vendors (gitea, jellyfin, pocketbase,
pandoc, nuxt, go-task-combined, dex). The pure-GHSA items (picklescan, ImageMagick,
typst, dive) are submitted via each repo's "Report a vulnerability" form (no automated
submission — done by hand on GitHub); see `GHSA-EXPORTS.md` for the field values.

### Informational / non-security (from the 2026-06-27 dex/authelia session)

- **dex — `redirect_uri` double URL-decode** (CWE-175, Low): genuine double-decode
  confirmed at `oauth2.go:483`, but **not exploitable** (exact-match redirect
  validation). Bundled as a secondary note inside the dex advisory, not a standalone
  advisory.
- **authelia — missing `resp.Body.Close` in `getSectorIdentifierURICache`** (CWE-404):
  **not a security issue** (admin-controlled URL, startup-only leak). File as a regular
  GitHub issue/PR with Authelia's required AI-disclosure — not GHSA. Not carried in this
  pack as a finding.

## Notes

- #342 (jellyfin) and #343 (nuxt) were executed and shipped separately from the four
  source archives; included here for a single consolidated roster.
- Counts: **13 submittable** (8 Tier-1 + 4 Tier-2 + 1 Tier-3), **4 dead**, **17 total**
  security findings evaluated, plus 2 informational/non-security items (dex
  double-decode, authelia body-close). (#337 mattermost moved to dead after anchor
  confirmation; dex transitive SSO added after runtime reproduction with a negative
  control.)
