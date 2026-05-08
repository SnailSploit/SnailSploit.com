/* CVEs index — full disclosure list, no individual writeup pages */
const SS_C = window.SS_DATA;

const SevDot = ({ s }) => {
  const c = s === "crit" ? "var(--signal-2)" : s === "high" ? "var(--signal-2)" : "var(--fg-2)";
  return <span style={{ display: "inline-block", width: 6, height: 6, background: c, marginRight: 8, verticalAlign: "middle" }} />;
};

const CVERow = ({ r, top }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "180px 1.2fr 1.5fr 60px 80px",
    gap: 16, padding: "14px 0",
    borderTop: top ? "1px solid var(--line-hi)" : "1px solid var(--line)",
    fontFamily: "var(--f-mono)", fontSize: 13, alignItems: "baseline",
  }}>
    <span style={{ color: "var(--fg)" }}>{r.id}</span>
    <span style={{ color: "var(--fg-2)" }}>
      {r.target}{r.lang && <span style={{ color: "var(--fg-3)" }}> · {r.lang}</span>}
    </span>
    <span style={{ color: "var(--fg-3)" }}>{r.type}</span>
    <span style={{
      textAlign: "right",
      color: r.severity === "crit" || r.severity === "high" ? "var(--signal-2)" : "var(--fg)",
      fontVariantNumeric: "tabular-nums",
    }}>{r.score}</span>
    <span style={{
      textAlign: "right", textTransform: "uppercase", fontSize: 10,
      letterSpacing: "0.08em", color: "var(--fg-3)",
    }}>
      <SevDot s={r.severity} />{r.severity === "crit" ? "crit" : r.severity}
    </span>
  </div>
);

const CVEGroup = ({ title, count, items }) => (
  <div style={{ marginTop: 56 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
      <Eyebrow c="var(--fg)">{title}</Eyebrow>
      <Mono color="var(--fg-3)" size={11}>{count} {count === 1 ? "cve" : "cves"}</Mono>
    </div>
    {items.map((r, i) => <CVERow key={r.id} r={r} top={i === 0} />)}
  </div>
);

const CVEsPage = () => {
  const total = SS_C.cves.container.length + SS_C.cves.apache.length + SS_C.cves.crossLang.length + SS_C.cves.wordpress.length;
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
      <SiteNav active="cves" />
      <HeroFrame
        eyebrow={<>cves<br/>disclosed<br/>2025–2026</>}
        title={<>{SS_C.stats.cveCount} cves<br/><span style={{color:"var(--fg-3)"}}>disclosed.</span></>}
        meta={<>23 published · MITRE/NVD<br/>+ vendor-side TelSender removal<br/>updated 2026.05</>}
        lede={<>The full disclosure ledger. <span style={{color:"var(--fg-2)"}}>Container & cluster infrastructure, Apache foundation, cross-language OSS, and the WordPress plugin ecosystem. Sorted by blast radius — critical and high first within each group. Every entry references a coordinated disclosure with the upstream maintainers.</span></>}
        cta={<><CTA primary href="/advisories">ghsa advisories →</CTA><CTA href="/kernel">kernel patches →</CTA></>}
      />

      <Section id="ledger" label={`01 · ledger · ${total}`}
        hint="Coordinated disclosure with each upstream. Embargo-respected. References are linked from each NVD record."
        title="full ledger.">
        <CVEGroup title="container & cluster infrastructure" count={SS_C.cves.container.length} items={SS_C.cves.container} />
        <CVEGroup title="apache foundation" count={SS_C.cves.apache.length} items={SS_C.cves.apache} />
        <CVEGroup title="cross-language oss" count={SS_C.cves.crossLang.length} items={SS_C.cves.crossLang} />
        <CVEGroup title="wordpress plugin ecosystem" count={SS_C.cves.wordpress.length} items={SS_C.cves.wordpress} />
        <div style={{ marginTop: 48, paddingTop: 16, borderTop: "1px dashed var(--line)", fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)", lineHeight: 1.7 }}>
          {SS_C.cves.note}<br/>
          Detail pages for individual CVEs are intentionally not built — the NVD record is canonical, and we don't want to become a stale mirror. For deep dives on specific findings, see the writeups in <a href="/research" style={{ color: "var(--fg-2)" }}>research</a> or the upstream commit linked from NVD.
        </div>
      </Section>

      <Section id="how" sink label="02 · how" hint="The boring bits that matter. Coordinated disclosure, not opportunism."
        title="disclosure protocol.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {[
            ["Coordination first", "Every CVE here was reported privately to the maintainer first. Public disclosure timed to the patch — not the maintainer's convenience, but the patch."],
            ["NVD canonical", "We don't maintain a parallel writeup database. The NVD record is canonical. We link to it, not around it."],
            ["No bug bounty pressure", "These are reported because they need to be reported, not because someone is paying. Means the bar for what gets disclosed isn't economic."],
            ["Upstream credit", "Maintainers get credit in the patch and the writeup. We don't take credit for fixes we didn't write."],
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "24px 0", borderTop: i < 2 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>{t}</div>
              <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <SiteFooter section="cves" />
    </div>
  );
};

Object.assign(window, { CVEsPage });
