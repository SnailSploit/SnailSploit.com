/* Writing index — book, magazine, blog */
const WritingPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="writing" />
    <HeroFrame
      eyebrow={<>writing<br/>books · articles<br/>2024–2026</>}
      title={<>writing &<br/><span style={{color:"var(--fg-3)"}}>publishing.</span></>}
      meta={<>1 book<br/>Hakin9 · contributing author<br/>snailsploit.com · monthly</>}
      lede={<>The long-form work. <span style={{color:"var(--fg-2)"}}>One book on adversarial AI, an ongoing column at Hakin9, and the research blog that feeds both. Writing is how the operational findings become a methodology — and how the methodology survives the people who derived it.</span></>}
      cta={<><CTA primary href="#book">adversarial minds →</CTA><CTA href="/research">research index →</CTA></>}
    />

    <Section id="book" label="01 · book"
      hint="The reference text for adversarial AI work. Long-form. Paper-first."
      title="adversarial minds.">
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 48, alignItems: "start" }}>
        <div style={{ aspectRatio: "2/3", background: "var(--bg-sink)", border: "1px solid var(--line-hi)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Mono color="var(--signal-2)" size={11}>kai aizen</Mono>
            <div style={{ marginTop: 18, fontSize: 28, lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.025em", color: "var(--fg)" }}>adversarial<br/>minds.</div>
          </div>
          <Mono color="var(--fg-3)" size={10}>2026 · snailsploit press</Mono>
        </div>
        <div>
          <ArticleProse>
            <p>Adversarial Minds is the book version of the methodology that lives across AATMF, SEF, and P.R.O.M.P.T. Long-form, opinionated, written for operators who already know the technical primitives and want the synthesis layer.</p>
            <p>The book argues a single thesis: that the techniques that work against humans — premise framing, role assignment, modulation of stakes, persona manipulation, tactical pressure — work against AI systems for the same reason. Both are pattern-completing systems trained on the same corpus of human persuasion. Same attack. Different substrate.</p>
            <p>Each chapter pairs a psychological mechanism with the AI-system attack it explains, and ends with a procedure that can be reproduced on a current frontier model. The companion appendix maps every chapter back to a specific AATMF technique ID.</p>
          </ArticleProse>
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 480 }}>
            <FootnoteRow k="format" v="paperback · ebook" />
            <FootnoteRow k="length" v="~360 pages" />
            <FootnoteRow k="status" v="in writing · 2026" />
            <FootnoteRow k="preorder" v="snailsploit.com/book" />
          </div>
          <div style={{ marginTop: 32 }}>
            <a href="/adversarial-minds" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", fontFamily: "var(--f-mono)", fontSize: 13, textDecoration: "none", border: "1px solid var(--signal-2)", color: "var(--signal-2)" }}>read the book page →</a>
          </div>
        </div>
      </div>
    </Section>

    <Section id="hakin9" sink label="02 · hakin9"
      hint="Contributing author since 2024. The column covers practical adversarial AI work for the magazine's offensive-security audience."
      title="hakin9 column.">
      <div>
        {[
          ["The 30% Blind Spot — LLM Safety Judges", "2026.03", "Where LLM-as-judge classifiers fail and why."],
          ["Self-Replicating Memory Worm", "2026.04", "An adversarial prompt that survives across sessions."],
          ["Pickle RCE in the ChatGPT Sandbox", "2026.01", "Sandbox escape via deserialization plus DNS exfil."],
          ["Adversarial Prompting: A Field Manual", "2025.10", "Direct, indirect, multi-turn, and agentic injection — one taxonomy."],
        ].map(([t, d, p], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 24, padding: "24px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
            <Mono color="var(--fg-3)" size={12}>{d}</Mono>
            <div style={{ fontSize: 20, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.012em" }}>{t}</div>
            <Mono color="var(--fg-2)" size={13} style={{ lineHeight: 1.6 }}>{p}</Mono>
          </div>
        ))}
      </div>
    </Section>

    <Section id="blog" label="03 · blog"
      hint="snailsploit.com is the upstream for everything else. Long-form posts hit the blog before they become magazine articles or book chapters."
      title="blog & feed.">
      <ArticleProse>
        <p>The blog is the working journal. Most posts there eventually become something more polished — an article, a chapter, a framework section — but the first draft lives on the site. Subscribe to the RSS feed if you want the firehose; pick the magazine column if you want the curated version.</p>
      </ArticleProse>
      <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <CTA primary href="/research">research index →</CTA>
        <CTA href="/feed.xml">rss feed →</CTA>
      </div>
    </Section>

    <SiteFooter section="writing" />
  </div>
);

Object.assign(window, { WritingPage });
