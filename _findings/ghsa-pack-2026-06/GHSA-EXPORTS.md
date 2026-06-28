# GHSA Exports — paste-ready fields for GitHub "Report a vulnerability"

Structured field values for every **GHSA-routable** finding in this pack, formatted to
the GitHub draft-advisory form (Ecosystem / Package / Affected / Patched / Severity /
CWE / Description). For each one, the **Description** field = paste the body of the
referenced `ghsa-*.md` report in this folder.

Ecosystem values use GitHub's dropdown vocabulary (npm, Go, PyPI, Rust, NuGet, … or
"Other" where no package registry applies). "Request CVE ID later" should be left
checked unless you already hold a CVE.

Email-channel findings (gitea, jellyfin, pocketbase, pandoc) are **not** listed here —
their SECURITY.md routes them to email (Gmail drafts already prepared). nuxt and
go-task accept GHSA (preferred/equal per policy) and are included below.

---

## 1. picklescan — deny-list evasion → RCE
- **Title:** picklescan deny-list evasion lets malicious pickles pass as clean (RCE)
- **CVE:** request later
- **Ecosystem:** PyPI
- **Package name:** `picklescan`
- **Affected versions:** `<= 1.0.4`
- **Patched versions:** None
- **Severity (CVSS v3.1):** `AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H` — **6.1** (Medium)
- **Weaknesses (CWE):** CWE-693, CWE-184
- **Description:** paste `ghsa-picklescan-denylist-bypass.md`

## 2. ImageMagick — coder policy `pattern="PS"` does not block EPS family
- **Title:** `policy.xml` `domain="coder" pattern="PS"` fails to block EPS/EPSF/EPSI/EPI — Ghostscript executes
- **CVE:** request later
- **Ecosystem:** Other (C library; no package registry — distributed via OS packages/source)
- **Package name:** `ImageMagick`
- **Affected versions:** 7.x through `7.1.2-26` (latest tested); 6.x likely affected
- **Patched versions:** None
- **Severity (CVSS v3.1):** `AV:N/AC:L/PR:N/UI:N/S:C/C:L/I:L/A:N` — **7.2** (High)
- **Weaknesses (CWE):** CWE-284, CWE-863
- **Description:** paste `ghsa-338-imagemagick-eps-policy-bypass.md`

## 3. typst — `typst init` template.path traversal
- **Title:** `typst init` copies an arbitrary directory via unvalidated `template.path`
- **CVE:** request later
- **Ecosystem:** Rust (crates.io)
- **Package name:** `typst-cli`
- **Affected versions:** `<= 0.15.0` (present in earlier versions with the same `scaffold_project`)
- **Patched versions:** None
- **Severity (CVSS v3.1):** `AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N` — **5.5** (Medium)
- **Weaknesses (CWE):** CWE-22
- **Description:** paste `ghsa-typst-init-path-traversal.md`

## 4. dive — tar path traversal in `extractInner` (Ctrl+E extract)
- **Title:** Path traversal in `extractInner` writes files outside the target on Extract (Ctrl+E)
- **CVE:** request later
- **Ecosystem:** Go
- **Package name:** `github.com/wagoodman/dive`
- **Affected versions:** `<= 0.13.1` and current `master` (tested at `d6c69194`)
- **Patched versions:** None
- **Severity (CVSS v3.1):** `AV:L/AC:H/PR:N/UI:R/S:U/C:N/I:H/A:N` — **4.4** (Medium)
- **Weaknesses (CWE):** CWE-22
- **Description:** paste `ghsa-dive-tar-path-traversal.md`

## 5. nuxt — XSS via unescaped `</template>` in streaming island teleports
- **Title:** XSS via unescaped `</template>` in streaming island teleports
- **CVE:** request later
- **Ecosystem:** npm
- **Package name:** `nuxt`
- **Affected versions:** `>= 4.0.0` (with `experimental.ssrStreaming.enabled: true`); unpatched as of 4.3.1
- **Patched versions:** None
- **Severity (CVSS v3.1):** `AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:H/A:N` — **7.5** (High)
- **Weaknesses (CWE):** CWE-79
- **Description:** paste `ghsa-343-nuxt-island-teleport-xss.md`
- **Note:** nuxt's policy prefers the GitHub Security tab; this is the primary channel for this finding (Gmail draft to `security@nuxtjs.org` is the documented alternative).

## 6. go-task — remote Taskfiles read host env vars via Sprig `env`/`expandenv`
- **Title:** Remote Taskfiles can read host environment variables via Sprig `env`/`expandenv`
- **CVE:** request later
- **Ecosystem:** Go
- **Package name:** `github.com/go-task/task`
- **Affected versions:** all versions with remote Taskfile includes (`<= 3.51.1`, tested at `3dcaa7db`)
- **Patched versions:** None
- **Severity (CVSS v3.1):** `AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N` — **6.5** (Medium)
- **Weaknesses (CWE):** CWE-200
- **Description:** paste `ghsa-gotask-env-exfil.md`

## 7. go-task — git-include cache: predictable temp path, no integrity check (local TOCTOU)
- **Title:** git-include cache uses a predictable temp path with no integrity check
- **CVE:** request later
- **Ecosystem:** Go
- **Package name:** `github.com/go-task/task`
- **Affected versions:** all versions with git-based remote includes (`<= 3.51.1`, tested at `3dcaa7db`)
- **Patched versions:** None
- **Severity (CVSS v3.1):** `AV:L/AC:H/PR:L/UI:R/S:U/C:H/I:H/A:N` — **5.0** (Medium)
- **Weaknesses (CWE):** CWE-377, CWE-345
- **Description:** paste `ghsa-gotask-git-cache-poisoning.md`

## 8. go-task — untrusted variable values flow unescaped into shell-executed `if`/`status`/`precondition`
- **Title:** Untrusted variable values flow unescaped into shell-executed `if`/`status`/`precondition` fields
- **CVE:** request later
- **Ecosystem:** Go
- **Package name:** `github.com/go-task/task`
- **Affected versions:** all versions (`<= 3.51.1`, tested at `3dcaa7db`)
- **Patched versions:** None
- **Severity (CVSS v3.1):** `AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N` — **5.5** (Medium)
- **Weaknesses (CWE):** CWE-78
- **Description:** paste `ghsa-gotask-if-shell-injection.md`
- **Note:** submit only with the narrowed threat model (vuln only when an untrusted variable source feeds an otherwise-trusted Taskfile).

---

### Submission grouping note
The three go-task items (#6–#8) are distinct vulnerabilities → three separate GHSA
drafts on `go-task/task`, even though the prepared Gmail draft bundles them into one
email. Pick one channel per item (don't double-report the same finding via both email
and GHSA).
