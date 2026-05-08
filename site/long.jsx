/* ============================================================
   Home A — Long-form scroll
   IA mirrors live snailsploit.com nav; content from README (v2026.05).
   ============================================================ */

const SS = window.SS_DATA;

const Eyebrow = ({ children, color = "var(--fg-3)" }) => (
  <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color, textTransform: "uppercase", letterSpacing: "0.14em" }}>{children}</div>
);
const Sticky = ({ children }) => (
  <div style={{ position: "sticky", top: 96, alignSelf: "start" }}><Eyebrow>{children}</Eyebrow></div>
);
const Section = ({ id, sink, children }) => (
  <section id={id} style={{ borderBottom: "1px solid var(--line)", background: sink ? "var(--bg-sink)" : "transparent" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 32px", display: "grid", gridTemplateColumns: "180px 1fr", gap: 40, alignItems: "start" }}>{children}</div>
  </section>
);
const SevDot = ({ s }) => {
  const c = s === "crit" ? "var(--signal-2)" : s === "high" ? "var(--signal-2)" : "var(--fg-2)";
  return <span style={{ display: "inline-block", width: 6, height: 6, background: c, marginRight: 8, verticalAlign: "middle" }} />;
};

const LongNav = () => (
  <header style={{ position: "sticky", top: 0, zIndex: 50, background: "color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <WordmarkFull size={1} color="var(--fg)" accent="var(--signal-2)" />
      <nav style={{ display: "flex", gap: 28, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-2)" }}>
        {["about","frameworks","research","ai security","tools","writing"].map(n => <a key={n} href={`#${n.replace(" ","-")}`} style={{ color: "inherit", textDecoration: "none" }}>{n}</a>)}
      </nav>
      <div style={{ display: "flex", gap: 16, alignItems: "center", fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>
        <span>⌘K</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 6, height: 6, background: "var(--signal-2)", borderRadius: 999 }} /> live</span>
      </div>
    </div>
  </header>
);

const LongHero = () => (
  <section style={{ borderBottom: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 32px 80px", display: "grid", gridTemplateColumns: "180px 1fr 280px", gap: 40, alignItems: "start" }}>
      <Eyebrow>{SS.identity.name.toLowerCase()}<br/>independent<br/>2026.05</Eyebrow>
      <div>
        <div style={{ fontSize: 132, fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.05em" }}>
          same attack.<br/><span style={{ color: "var(--fg-3)" }}>different substrate.</span>
        </div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 14, color: "var(--fg-2)", marginTop: 32, maxWidth: 720, lineHeight: 1.65 }}>{SS.identity.bio}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 36, flexWrap: "wrap" }}>
          {SS.identity.badges.map(b => (
            <span key={b.label} style={{ fontFamily: "var(--f-mono)", fontSize: 11, padding: "6px 10px", border: "1px solid var(--line-hi)", color: "var(--fg)" }}>
              <span style={{ color: "var(--fg-3)" }}>{b.label}</span> · {b.value}
            </span>
          ))}
        </div>
      </div>
      <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 24, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-2)", lineHeight: 1.7 }}>
        <Eyebrow>shell.001</Eyebrow>
        <div style={{ marginTop: 16 }}>
          {Object.entries(SS.identity.links).map(([k,v]) => (
            <div key={k}><span style={{ color: "var(--fg-3)", display: "inline-block", width: 56 }}>{k}</span><span style={{ color: "var(--fg)" }}>{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const LongAbout = () => {
  const lines = [
    ["role",     "independent offensive security researcher"],
    ["scope",    "linux kernel · k8s · container runtimes · oss · llms"],
    ["frameworks", "AATMF · P.R.O.M.P.T · SEF"],
    ["author",   "Adversarial Minds · Hakin9 contributing"],
    ["contributor", "MITRE / NVD · Linux kernel mainline"],
  ];
  return (
    <Section id="about">
      <Sticky>01 · about</Sticky>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", gap: 32, paddingBottom: 24, borderBottom: "1px solid var(--line-hi)" }}>
          <div style={{ fontSize: 88, fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.045em" }}>about.</div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.14em", paddingBottom: 12 }}>
            kai aizen · {new Date().getFullYear()}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, marginTop: 56, alignItems: "start" }}>
          <div style={{ position: "relative", paddingLeft: 24, borderLeft: "2px solid var(--signal-2)" }}>
            <div style={{ fontFamily: "var(--f-grot)", fontSize: 22, color: "var(--fg)", lineHeight: 1.5, letterSpacing: "-0.015em", textWrap: "pretty" }}>
              {SS.identity.bio}
            </div>
            <div style={{ marginTop: 24, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)", letterSpacing: "0.04em" }}>
              — same attack. different substrate.
            </div>
          </div>

          <dl style={{ margin: 0, padding: 0, fontFamily: "var(--f-mono)", fontSize: 13 }}>
            {lines.map(([k, v], i) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 16, padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                <dt style={{ color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 11 }}>{k}</dt>
                <dd style={{ margin: 0, color: "var(--fg)", lineHeight: 1.5 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
};

const LongFrameworks = () => (
  <Section id="frameworks" sink>
    <Sticky>03 · frameworks</Sticky>
    <div>
      <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.035em" }}>frameworks & tooling.</div>
      <div style={{ marginTop: 48 }}>
        {SS.frameworks.map((f,i) => (
          <div key={f.name} style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, padding: "28px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)", alignItems: "baseline" }}>
            <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>{f.name}</span>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6 }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

const LongKernel = () => (
  <Section id="research">
    <Sticky>05 · linux kernel</Sticky>
    <div>
      <Eyebrow>5 mainline patches · merged via standard maintainer process</Eyebrow>
      <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.035em", marginTop: 12 }}>kernel contributions.</div>
      <div style={{ marginTop: 48 }}>
        {SS.kernel.map((k,i) => (
          <div key={k.subsystem} style={{ display: "grid", gridTemplateColumns: "200px 1fr 280px", gap: 24, padding: "20px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)", fontFamily: "var(--f-mono)", fontSize: 13 }}>
            <span style={{ color: "var(--fg)" }}>{k.subsystem}</span>
            <span style={{ color: "var(--fg-2)" }}>{k.vuln}</span>
            <span style={{ color: "var(--fg-3)", textAlign: "right" }}>{k.status}</span>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

const CVERow = ({ r, top }) => (
  <div style={{ display: "grid", gridTemplateColumns: "180px 1.2fr 1.5fr 60px 60px", gap: 16, padding: "12px 0", borderTop: top ? "1px solid var(--line-hi)" : "1px solid var(--line)", fontFamily: "var(--f-mono)", fontSize: 13 }}>
    <span style={{ color: "var(--fg)" }}>{r.id}</span>
    <span style={{ color: "var(--fg-2)" }}>{r.target}{r.lang && <span style={{ color: "var(--fg-3)" }}> · {r.lang}</span>}</span>
    <span style={{ color: "var(--fg-3)" }}>{r.type}</span>
    <span style={{ textAlign: "right", color: r.severity === "crit" || r.severity === "high" ? "var(--signal-2)" : "var(--fg)", fontVariantNumeric: "tabular-nums" }}>{r.score}</span>
    <span style={{ textAlign: "right", textTransform: "uppercase", fontSize: 10, letterSpacing: "0.08em", color: "var(--fg-3)", paddingTop: 2 }}>{r.severity === "crit" ? "crit" : r.severity}</span>
  </div>
);

const CVEGroup = ({ title, count, items }) => (
  <div style={{ marginTop: 48 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
      <Eyebrow color="var(--fg)">{title}</Eyebrow>
      <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>{count}</span>
    </div>
    {items.map((r,i) => <CVERow key={r.id} r={r} top={i === 0} />)}
  </div>
);

const LongCVEs = () => (
  <Section id="cves" sink>
    <Sticky>06 · cves</Sticky>
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.035em" }}>{SS.stats.cveCount} cves disclosed.</div>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)" }}>sorted by blast radius</span>
      </div>
      <CVEGroup title="container & cluster infrastructure" count="1" items={SS.cves.container} />
      <CVEGroup title="apache foundation" count="2" items={SS.cves.apache} />
      <CVEGroup title="cross-language oss" count="5" items={SS.cves.crossLang} />
      <CVEGroup title="wordpress plugin ecosystem" count="15" items={SS.cves.wordpress} />
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)", marginTop: 32, paddingTop: 16, borderTop: "1px dashed var(--line)" }}>{SS.cves.note}</div>
    </div>
  </Section>
);

const LongAdvisories = () => (
  <Section id="advisories">
    <Sticky>07 · advisories</Sticky>
    <div>
      <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.035em" }}>security advisories.</div>
      <div style={{ marginTop: 48 }}>
        {SS.advisories.map((a,i) => (
          <div key={i} style={{ padding: "24px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg)" }}>{a.id}</span>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--signal-2)" }}>{a.score} · {a.severity}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 500, marginTop: 8, letterSpacing: "-0.01em" }}>{a.target}</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-2)", marginTop: 6, lineHeight: 1.55 }}>{a.type}</div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

const LongAI = () => (
  <Section id="ai-security" sink>
    <Sticky>02 · ai security research</Sticky>
    <div>
      <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.035em" }}>ai security research.</div>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-3)", marginTop: 12 }}>published at snailsploit.com, hakin9 magazine, medium.</div>
      <div style={{ marginTop: 48 }}>
        {SS.aiResearch.map((r,i) => (
          <div key={r.title} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32, padding: "24px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)", alignItems: "baseline" }}>
            <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.015em" }}>{r.title}</span>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6 }}>{r.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

const LongTools = () => (
  <Section id="tools">
    <Sticky>04 · offensive tools</Sticky>
    <div>
      <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.035em" }}>offensive tools.</div>
      <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--line-hi)" }}>
        {SS.tools.map((t,i) => (
          <div key={t.name} style={{ padding: "24px 24px 24px 0", borderBottom: "1px solid var(--line)", borderRight: i % 2 === 0 ? "1px solid var(--line)" : "none", paddingLeft: i % 2 === 1 ? 24 : 0 }}>
            <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.015em" }}>{t.name}</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-2)", marginTop: 8, lineHeight: 1.6 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

const LongFooter = () => (
  <footer style={{ background: "var(--bg-sink)" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <WordmarkFull size={0.85} color="var(--fg)" accent="var(--signal-2)" />
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>© 2026 kai aizen · same attack. different substrate.</div>
    </div>
  </footer>
);

const LongPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <LongNav />
    <LongHero />
    <LongAbout />
    <LongAI />
    <LongFrameworks />
    <LongTools />
    <LongKernel />
    <LongCVEs />
    <LongAdvisories />
    <LongFooter />
  </div>
);

Object.assign(window, { LongPage });
