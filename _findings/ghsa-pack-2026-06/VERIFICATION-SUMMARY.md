# PoC Verification Summary

All findings were re-tested by building each target from source and executing the
PoCs against the real code — no static-trace confirmations. Results below, with
the corrections folded into the rewritten advisories in this folder.

## Environment

- macOS (darwin/arm64), CPython 3.14.6, Go 1.24.5, rustc/cargo 1.93.1, Docker 28.3.2
- picklescan 1.0.4 installed from PyPI into a clean venv
- go-task built from source @ `3dcaa7db` (v3.51.1 nightly tip)
- typst built from source @ `c98e9103` (v0.15.0)
- dive built/tested from source @ `d6c69194` (master, post-v0.13.1)

## Results

| # | Finding | Verdict | CVSS (was → now) |
|---|---------|---------|-------------------|
| 1 | picklescan deny-list bypass (3 vectors + `-m` exit bug) | **Reproduced** | 6.1 → 6.1 (Medium), unchanged |
| 2 | go-task — env exfil via Sprig `env`/`expandenv` | **Reproduced** | 7.4 → 6.5 (Medium) |
| 3 | go-task — git cache poisoning (predictable temp path) | **Reproduced (offline)** | 7.3 → 5.0 (Medium), reframed as local TOCTOU |
| 4 | go-task — template→shell injection via `if` | **Reproduced** | 6.3 → 5.5 (Medium), threat-model narrowed |
| 5 | typst — `template.path` absolute/`..` traversal in `typst init` | **Reproduced E2E** | 5.5 → 5.5 (Medium), unchanged |
| 6 | dive — tar path traversal in `extractInner` | **Reproduced (real fn)** | 7.1 → 4.4 (Medium) |

## Key corrections applied

**go-task git cache poisoning (#3) — two material errors in the original draft:**
1. The cache path is **`os.TempDir()/task-git-repos/...`**, not a hardcoded `/tmp/...`.
   On macOS that resolves to `/var/folders/.../T/`. The original `/tmp/...` claim is
   only correct on Linux (where `TMPDIR` is usually unset). Verified:
   `taskfile/node_git.go:131` uses `filepath.Join(os.TempDir(), "task-git-repos", cacheKey)`.
2. `taskfile/reader.go:252` runs `defer CleanGitCache()`, which `os.RemoveAll`s the
   cache dir after every run. The cache is **not durable** between runs, so this is a
   **local TOCTOU plant**, not persistent poisoning. Reproduced offline (network
   denied via `sandbox-exec`) — the planted `.git` was trusted with zero integrity
   check and zero network, proving the no-verification gap. Severity recalibrated to
   AC:H to reflect the race.

**dive tar traversal (#6) — path + severity:**
- In-repo path is `dive/dive/image/docker/image_archive.go` (nested module dir), not
  `dive/image/docker/...`. `extractInner` is at line 337 (accurate). `getFileList`'s
  safe `path.Clean` is at line 233 (accurate).
- Reproduced by calling dive's **real** `extractInner` and the exported
  `ExtractFromImage` (the Ctrl+E backend) from a same-package Go test — both wrote a
  sentinel file outside the working dir. Two real constraints lower difficulty from
  the draft's claim: (a) the traversal entry name must start with the selected node's
  path (`strings.HasPrefix(name, target)`), and (b) `os.MkdirAll` walks literal `..`
  so a benign sibling entry must pre-create the prefix dir. Also, the extract path
  reads an **uncompressed** layer `.tar` (no gzip), unlike the analysis path. Net:
  CVSS 7.1 overstated AC/UI; recalibrated to Medium (~4.4).

**typst (#5):** anchors exact at v0.15.0 (`init.rs:80`, copy at 85–88, `package.rs:83`
`path: EcoString`, `validate()` at 157–183 checks only name/version/compiler). Added
the `..` relative-traversal variant (also reproduced) and clarified impact is
victim-initiated local file/dir disclosure, not RCE.

**go-task env exfil (#2):** reproduced verbatim. Dropped the `S:C` scope change
(the env belongs to the same host/user authority running task) → Medium.

**go-task `if` injection (#4):** reproduced. Narrowed the threat model honestly — if
the attacker controls the Taskfile they already have execution via `cmds`. This is a
vulnerability only when an **untrusted variable source** (env var, CI variable,
remote-include var, `.env`) flows into a shell-executed field (`if`,
`preconditions[].sh`, `status[]`) of an otherwise-trusted Taskfile.

**picklescan 7z zip-slip:** investigated, **not exploitable** with the pinned
py7zr 0.22.0 (its writer/extractor reject `..`/absolute member names post
CVE-2022-44900). `scan_7z_bytes` genuinely lacks its own containment, so it is a
latent defense-in-depth gap that would re-open against an older/unpinned py7zr —
documented as such, not shipped as a live finding.

## Anchors re-confirmed in installed picklescan 1.0.4

- `scanner.py:150` `"types": {"CodeType"}` — only CodeType blocked (FunctionType absent)
- `scanner.py:159` `"_io": {"FileIO"}` — only `_io.FileIO` blocked (the `io.FileIO` alias absent)
- `scanner.py:182` `"code": {"InteractiveInterpreter.runcode"}` — only runcode blocked (`InteractiveConsole.push` absent)
- `scanner.py:426/428` Innocuous/Suspicious branches do **not** increment `issues_count`
- `scanner.py:431` `infected_files = 1 if issues_count > 0 else 0`
- `cli.py:114` `return 0 if scan_result.issues_count == 0 else 1`
- `__main__.py:3` `main()` called without `sys.exit(...)` → `python -m picklescan` always exits 0
