/* Contact */
const ContactPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav />
    <HeroFrame
      eyebrow={<>contact<br/>encrypted preferred<br/>2026</>}
      title={<>contact.<br/><span style={{color:"var(--fg-3)"}}>signal &gt; email.</span></>}
      meta={<>response: 1–3 business days<br/>Signal preferred for sensitive<br/>PGP available on request</>}
      lede={<>For research collaboration, advisories, engagement scoping, press, or speaking. <span style={{color:"var(--fg-2)"}}>Sensitive topics — vulnerability reports, embargoed coordination, anything you wouldn't put on a postcard — should come over Signal or PGP-encrypted email. Everything else is fine in plaintext.</span></>}
    />

    <Section id="channels" label="01 · channels" hint="Pick the lowest-friction channel for your topic. Signal is fastest."
      title="how to reach me.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 0 }}>
        {[
          { name: "Signal", value: "@snailsploit.42", note: "Preferred for vulnerability reports and anything sensitive. Disappearing messages on by default." },
          { name: "Email (encrypted)", value: "kai@snailsploit.com", note: "PGP key fingerprint on request. Use PGP for anything you wouldn't put on a postcard." },
          { name: "X / Twitter DMs", value: "@SnailSploit", note: "Open. Fine for introductions and non-sensitive coordination. Don't put findings here." },
          { name: "LinkedIn", value: "linkedin.com/in/kaiaizen", note: "For engagement scoping and professional outreach. Slow channel — assume 3–5 days." },
        ].map((c, i) => (
          <div key={c.name} style={{ padding: "28px 0", borderTop: i < 2 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
            <Mono color="var(--signal-2)" size={11}>{c.name}</Mono>
            <div style={{ marginTop: 10, fontSize: 22, fontWeight: 500, color: "var(--fg)", fontFamily: "var(--f-mono)", letterSpacing: "-0.005em" }}>{c.value}</div>
            <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.55 }}>{c.note}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section id="form" sink label="02 · contact form" hint="A normal form for everyone else. Goes to the same inbox."
      title="or just send a message.">
      <form onSubmit={(e) => { e.preventDefault(); alert("Demo form. Use Signal or email for real."); }} style={{ maxWidth: 640 }}>
        {[
          ["name",    "name",    "text",     "your name"],
          ["org",     "org",     "text",     "organization (optional)"],
          ["email",   "email",   "email",    "you@somewhere.com"],
          ["topic",   "topic",   "text",     "research collaboration / engagement / press / other"],
        ].map(([id, label, type, ph]) => (
          <div key={id} style={{ marginBottom: 24 }}>
            <Mono color="var(--fg-3)" size={11} style={{ display: "block", marginBottom: 6 }}>{label}</Mono>
            <input type={type} placeholder={ph} style={{
              width: "100%", padding: "14px 0", background: "transparent",
              border: "none", borderBottom: "1px solid var(--line-hi)",
              fontFamily: "var(--f-mono)", fontSize: 15, color: "var(--fg)", outline: "none",
            }} />
          </div>
        ))}
        <div style={{ marginBottom: 24 }}>
          <Mono color="var(--fg-3)" size={11} style={{ display: "block", marginBottom: 6 }}>message</Mono>
          <textarea rows={6} placeholder="What's on your mind? If this is a vulnerability report, please use Signal or PGP." style={{
            width: "100%", padding: "14px 0", background: "transparent",
            border: "none", borderBottom: "1px solid var(--line-hi)",
            fontFamily: "var(--f-mono)", fontSize: 15, color: "var(--fg)",
            outline: "none", resize: "vertical",
          }} />
        </div>
        <button type="submit" style={{
          padding: "16px 28px", background: "var(--signal-2)", border: "none",
          fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--bg)",
          letterSpacing: "0.04em", cursor: "pointer", textTransform: "lowercase",
        }}>send →</button>
      </form>
    </Section>

    <Section id="response" label="03 · response" hint="What to expect after you hit send. No mystery."
      title="what happens next.">
      <ArticleProse>
        <p>If your message is a vulnerability report, you should hear back within one business day with a tracking handle and a request for any clarification I need before I can reproduce. Coordinated disclosure proceeds from there on the standard timeline.</p>
        <p>If it's an engagement inquiry, expect a reply within three business days with either a scoping call slot or a polite "not the right fit." I take a small number of engagements and decline more than I accept; the bar isn't budget, it's whether the work is interesting and the customer is going to act on the findings.</p>
        <p>If it's press, speaking, or collaboration, the response time depends on what's already in the queue, but you'll always get a real reply.</p>
      </ArticleProse>
    </Section>

    <SiteFooter section="contact" />
  </div>
);

Object.assign(window, { ContactPage });
