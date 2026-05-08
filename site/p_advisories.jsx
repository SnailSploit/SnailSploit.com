/* Advisories index */
const SS_A = window.SS_DATA;

const AdvRow = ({ a, i }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "240px 1fr 100px",
    gap: 24, padding: "28px 0",
    borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)",
    alignItems: "start",
  }}>
    <div>
      <Mono color="var(--fg)" size={13}>{a.id}</Mono>
      <Mono color={a.score === "—" ? "var(--fg-4)" : "var(--signal-2)"} size={11} style={{ display: "block", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.14em" }}>{a.score} · {a.severity}</Mono>
    </div>
    <div>
      <div style={{ fontSize: 20, fontWeight: 500, color: a.target === "pending" ? "var(--fg-3)" : "var(--fg)", letterSpacing: "-0.012em" }}>{a.target}</div>
      <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.55 }}>{a.type}</p>
    </div>
    <Mono color="var(--fg-3)" size={11} style={{ textAlign: "right", textTransform: "uppercase", letterSpacing: "0.14em" }}>{a.target === "pending" ? "embargo" : "published"}</Mono>
  </div>
);

const AdvisoriesPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="cves" />
    <HeroFrame
      eyebrow={<>ghsa<br/>github advisories<br/>2026</>}
      title={<>security<br/><span style={{color:"var(--fg-3)"}}>advisories.</span></>}
      meta={<>6 advisories · 2 published<br/>4 under embargo<br/>updated 2026.05</>}
      lede={<>GitHub Security Advisories filed and tracked. <span style={{color:"var(--fg-2)"}}>Two are public. Four are under coordinated-disclosure embargo and will appear here when the upstream patch ships. Each advisory cross-references its CVE record where one exists, and the upstream commit when there is one.</span></>}
      cta={<><CTA primary href="/cves">cve ledger →</CTA><CTA href="https://github.com/advisories?query=author%3ASnailSploit">github advisories →</CTA></>}
    />

    <Section id="ledger" label="01 · ledger" hint="Two published, four pending. The pending entries become rows when the patch ships."
      title="advisory ledger.">
      {SS_A.advisories.map((a, i) => <AdvRow key={i} a={a} i={i} />)}
    </Section>

    <Section id="protocol" sink label="02 · protocol"
      hint="Why some entries are dashed-out. The slow path is the right path."
      title="why we wait.">
      <ArticleProse>
        <p>An advisory under embargo is not a finding being hidden. It is a finding being held until the people who use the affected software can update without becoming targets in the window between disclosure and patch.</p>
        <p>For each pending row above, there is an open coordination channel with the upstream maintainer, an agreed disclosure date tied to the patch ship date, and — where the maintainer is unresponsive — a hard fallback at 90 days. The dashed entry is not the absence of work; it's the presence of patience.</p>
        <p>Once published, the row populates with the full advisory ID, the CVSS score, the affected versions, and the patch reference. Subscribe to the GitHub advisories feed if you want to be notified the moment that happens.</p>
      </ArticleProse>
    </Section>

    <SiteFooter section="advisories" />
  </div>
);

Object.assign(window, { AdvisoriesPage });
