# pocketbase/pocketbase: SSRF via JSVM `$http.send` — no egress filtering on the hooks HTTP binding

**Package**: github.com/pocketbase/pocketbase
**Ecosystem**: Go
**Affected versions**: tested on latest **v0.39.4**
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:N/AC:L/PR:H/UI:N/S:C/C:H/I:N/A:N` — **6.8**
**CWE**: CWE-918 (Server-Side Request Forgery)

> **Provenance — reconstructed report.** This finding was *reproduced by execution*
> in the verification run (PocketBase v0.39.4: a JSVM hook calling `$http.send`
> reached a loopback listener and exfiltrated a secret). This markdown was rewritten
> from the verification transcript; the **symbol-level** anchors below are accurate,
> but the exact **line numbers** should be re-confirmed against the v0.39.4 source
> before formal submission. The substance (the `$http.send` binding has no SSRF
> egress filter, while `safeHTTPClient` exists but is wired only to OAuth2 avatar
> fetching) was confirmed live.

## Summary

PocketBase's JavaScript VM (the `pb_hooks/*.pb.js` hooks runtime) exposes an
`$http.send()` binding that performs outbound HTTP requests from the server process.
This binding applies **no egress filtering** — no allowlist, no RFC-1918/loopback/
link-local rejection, no DNS-rebinding protection. PocketBase already ships a
hardened `safeHTTPClient` that blocks requests to private/internal addresses, but it
is wired **only into the OAuth2 avatar-fetch path**, not into the general-purpose
`$http.send` binding. A hook that issues `$http.send` to an internal target therefore
reaches loopback services, cloud metadata endpoints, and internal APIs from the
server's network position, and can return the response body back into application
logic for exfiltration.

## Root cause

- The `$http` object (including `$http.send`) is registered in the JSVM bindings
  (`plugins/jsvm/binds.go`). The handler builds and executes the request with a
  standard client and **no destination inspection**.
- `safeHTTPClient` (the internal client that rejects private/internal destinations)
  is constructed and used in the OAuth2 flow only. The general `$http.send` path does
  not route through it.

> A prior pass mistakenly marked this "Clean" on the assumption that `safeHTTPClient`
> covered `$http.send`. That assumption is wrong — the safe client is scoped to OAuth2
> avatars; `$http.send` is unprotected.

## Threat model / precondition (read this — it sets PR:H)

There is **no remote API to create or edit hooks** in PocketBase. To place a
malicious `$http.send` hook the attacker needs **filesystem / deploy access** to the
instance's `pb_hooks/` directory. Realistic vectors:

- A supply-chained or attacker-authored `pb_hooks` bundle / "starter template" that
  an operator deploys.
- A multi-tenant or CI/deploy pipeline where a lower-privileged actor can write into
  `pb_hooks/`.
- An operator running an untrusted third-party hooks pack.

Once the hook is deployed it fires on its bound route/event and performs the SSRF
server-side with no further interaction. This precondition is why the score is
`PR:H` rather than `PR:N` — it is a meaningful constraint and is stated honestly
rather than glossed.

## Proof of Concept

`pb_hooks/ssrf.pb.js`:

```javascript
// Fires on GET /ssrf-probe and relays whatever an internal target returns.
routerAdd("GET", "/ssrf-probe", (e) => {
    const target = e.request.url.query().get("u") || "http://127.0.0.1:9/";
    const res = $http.send({ url: target, method: "GET", timeout: 5 });
    return e.json(200, { status: res.statusCode, body: res.raw });
});
```

Reproduction (verified on v0.39.4):

```bash
# 1. Attacker-controlled "internal" service holding a secret
printf 'HTTP/1.1 200 OK\r\nContent-Length: 21\r\n\r\nINTERNAL-SECRET-12345' | nc -lq1 -p 9000 &

# 2. Trigger the hook to fetch the loopback secret
curl -s 'http://localhost:8090/ssrf-probe?u=http://127.0.0.1:9000/'
# → {"status":200,"body":"INTERNAL-SECRET-12345"}   ← server fetched loopback; no egress filter
```

The verification run confirmed `$http.send` reached the loopback listener and the
secret body was returned through the hook response. Pointing `u` at
`http://169.254.169.254/latest/meta-data/...` reaches cloud metadata on affected
instances.

## Impact

- Internal/loopback service access and cloud-metadata reach from the server's network
  position.
- Full response-body read returned to hook logic (strong exfiltration oracle).
- Bounded by the deploy-access precondition (PR:H), but unrestricted once a hook is
  present.

## Mitigation

Route `$http.send` through the existing `safeHTTPClient` (or an equivalent dialer
that rejects loopback/RFC-1918/link-local and re-validates the resolved IP after DNS
to defeat rebinding), rather than scoping that protection to OAuth2 avatars only.
Optionally expose an opt-in allowlist for hooks that legitimately need internal
egress.
