/* About */
const SS_AB = window.SS_DATA;

const AboutPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="about" />
    <HeroFrame
      eyebrow={<>about<br/>kai aizen<br/>independent</>}
      title={<>kai aizen.<br/><span style={{color:"var(--fg-3)"}}>operator.</span></>}
      meta={<>independent<br/>offensive security · ai<br/>since 2018</>}
      lede={<>{SS_AB.identity.bio}</>}
      cta={<><CTA primary href="/contact">get in touch →</CTA><CTA href="/frameworks">frameworks →</CTA></>}
    />

    <Section id="bio" label="01 · bio" hint="The short version. Long version is in Adversarial Minds."
      title="background.">
      <ArticleProse>
        <p>I work at the intersection of offensive security and AI. The shorthand: same attack, different substrate. The techniques that compromise human reasoning compromise machine reasoning for related reasons, and the techniques that compromise machine systems often start with a human in the loop.</p>
        <p>Career path is unusual: ten years on the systems side (Linux kernel, Kubernetes, container runtimes, OSS supply chain), then a hard pivot into adversarial AI when it became clear the same operating mode applied. The frameworks — AATMF, SEF, P.R.O.M.P.T — are the artifact of that pivot. They are how I operate; publishing them is how I keep them honest.</p>
        <p>Day-to-day: original research, frameworks, tooling, and a small number of high-trust engagements with organizations that need adversarial coverage at the model layer. I don't do volume. I do the work that needs doing.</p>
      </ArticleProse>

      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720 }}>
        {[
          ["role", SS_AB.identity.role],
          ["scope", "Linux kernel · Kubernetes · container runtimes · OSS · LLMs"],
          ["frameworks", "AATMF · SEF · P.R.O.M.P.T"],
          ["author", "Adversarial Minds"],
          ["contributing", "Hakin9 · MITRE/NVD · Linux kernel mainline"],
          ["location", "independent · remote"],
        ].map(([k, v]) => <FootnoteRow key={k} k={k} v={v} />)}
      </div>
    </Section>

    <Section id="creds" sink label="02 · receipts"
      hint="The work, not the titles. Numbers refresh as patches ship and CVEs publish."
      title="receipts.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: "1px solid var(--line-hi)", borderLeft: "1px solid var(--line-hi)" }}>
        {[
          ["5", "Linux kernel mainline patches", "/kernel"],
          ["23", "CVEs disclosed", "/cves"],
          ["6", "GHSA advisories", "/advisories"],
          ["3", "open frameworks", "/frameworks"],
          ["9", "open-source tools", "/tools"],
          ["7", "research articles", "/research"],
        ].map(([n, label, href], i) => (
          <a key={i} href={href} style={{ padding: "32px 28px", borderRight: "1px solid var(--line-hi)", borderBottom: "1px solid var(--line-hi)", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 64, fontWeight: 500, color: "var(--signal-2)", letterSpacing: "-0.04em", lineHeight: 1 }}>{n}</div>
            <Mono color="var(--fg-2)" size={13} style={{ marginTop: "auto" }}>{label}</Mono>
            <Mono color="var(--fg-3)" size={11} style={{ display: "block" }}>open →</Mono>
          </a>
        ))}
      </div>
    </Section>

    <Section id="principles" label="03 · principles"
      hint="The non-negotiable bits. Mostly about what I won't do."
      title="how I work.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {[
          ["Coordinated disclosure, always", "Every CVE, every advisory, every framework citation goes through the maintainer first. No public 0-days for clout. No vendor-side surprises that put users at risk in the disclosure window."],
          ["Open frameworks", "AATMF, SEF, and P.R.O.M.P.T are CC BY-SA. The toolkit is Apache 2.0. If a method is worth using, it's worth being public."],
          ["No volume engagements", "Customer engagements are small in number and high in trust. If you're shopping for the cheapest red team you can find, this isn't the right shop."],
          ["No security theater", "Findings are operational or they don't ship. Reports describe attack mechanics that reproduce, scored on a published rubric (AATMF-R), mapped to standards your compliance team already uses."],
          ["Independent", "No corporate parent. No platform incentives. Research direction is set by what's interesting and operationally useful, not by what generates leads for a sales team."],
          ["The work is the product", "I'd rather publish one piece that lands than ten that don't. The blog is sparse on purpose."],
        ].map(([t, d], i) => (
          <div key={i} style={{ padding: "24px 0", borderTop: i < 2 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>{t}</div>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>

    <SiteFooter section="about" />
  </div>
);

Object.assign(window, { AboutPage });
