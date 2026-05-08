/* ============================================================
   Home B — Operator dashboard
   Hero on entry, then a dense grid: instrument-like.
   ============================================================ */

const SSD = (window.SS_DATA);

const DEyebrow = ({ children, color = "var(--fg-3)" }) => (
  <div style={{
    fontFamily: "var(--f-mono)", fontSize: 11, color,
    textTransform: "uppercase", letterSpacing: "0.14em",
  }}>{children}</div>
);

const Panel = ({ title, sub, span = 1, children, accent }) => (
  <div style={{
    gridColumn: `span ${span}`,
    border: "1px solid var(--line)", background: "var(--bg-raise)",
    display: "flex", flexDirection: "column", minHeight: 0,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
      <DEyebrow color={accent || "var(--fg-2)"}>{title}</DEyebrow>
      {sub && <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>{sub}</span>}
    </div>
    <div style={{ padding: 18, flex: 1, overflow: "hidden" }}>{children}</div>
  </div>
);

const DashHeader = () => (
  <header style={{ borderBottom: "1px solid var(--line)", background: "var(--bg-sink)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr auto", gap: 0, alignItems: "stretch" }}>
      <div style={{ padding: "14px 20px", borderRight: "1px solid var(--line)", display: "flex", alignItems: "center" }}>
        <WordmarkFull size={0.95} color="var(--fg)" accent="var(--signal-2)" />
      </div>
      <div style={{ padding: "14px 20px", display: "flex", gap: 28, alignItems: "center", fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-2)" }}>
        <span>frameworks</span><span>tools</span><span>cve</span><span>kernel</span><span>writing</span><span>about</span>
      </div>
      <div style={{ padding: "14px 20px", borderLeft: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 16, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, background: "var(--signal-2)", borderRadius: 999 }} />
          live
        </span>
        <span>shell.001</span>
        <span>2026.05.07</span>
      </div>
    </div>
  </header>
);

const DashHero = () => (
  <section style={{ borderBottom: "1px solid var(--line)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 320px", gap: 0, alignItems: "stretch", minHeight: 360 }}>
      <div style={{ padding: 24, borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <DEyebrow>{SSD.identity.name.toLowerCase()}</DEyebrow>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-2)", lineHeight: 1.6 }}>
          {SSD.identity.role.split(" · ").map((r, i) => <div key={i}>{r.toLowerCase()}</div>)}
        </div>
      </div>
      <div style={{ padding: "48px 32px", borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 96, fontWeight: 500, lineHeight: 0.92, letterSpacing: "-0.045em" }}>
          same attack.<br/>
          <span style={{ color: "var(--fg-3)" }}>different substrate.</span>
        </div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-2)", marginTop: 24, maxWidth: 640, lineHeight: 1.6 }}>
          {SSD.identity.bio}
        </div>
      </div>
      <div style={{ padding: 24, display: "grid", gridTemplateRows: "repeat(4, 1fr)", gap: 0 }}>
        {[
          [SSD.stats.cveCount,        "cve"],
          [SSD.stats.frameworkCount,  "frameworks"],
          [SSD.stats.toolCount,       "tools"],
          ["k+", "kernel · upstream"],
        ].map(([n, l], i) => (
          <div key={l} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingBottom: 8, borderTop: i > 0 ? "1px solid var(--line)" : "none", paddingTop: i > 0 ? 16 : 0,
          }}>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 56, fontWeight: 500, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>{n}</span>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DashGrid = () => (
  <section style={{ borderBottom: "1px solid var(--line)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>

      {/* CVE — wide */}
      <Panel title="cve · published" sub={`${SSD.stats.cveCount} total`} span={2}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[...SSD.cves.container, ...SSD.cves.apache, ...SSD.cves.crossLang, ...SSD.cves.wordpress].slice(0, 6).map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "150px 1fr 60px 50px", gap: 12,
              padding: "8px 0", borderTop: i === 0 ? "none" : "1px dashed var(--line)",
              fontFamily: "var(--f-mono)", fontSize: 12,
            }}>
              <span style={{ color: "var(--fg)" }}>{r.id}</span>
              <span style={{ color: "var(--fg-2)" }}>{r.target} <span style={{ color: "var(--fg-3)" }}>· {r.type.toLowerCase()}</span></span>
              <span style={{ color: r.severity === "high" ? "var(--signal-2)" : "var(--fg)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.score}</span>
              <span style={{ color: "var(--fg-3)", textAlign: "right", textTransform: "uppercase", fontSize: 10, letterSpacing: "0.08em" }}>{r.severity}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Frameworks */}
      <Panel title="frameworks" sub={`${SSD.stats.frameworkCount} active`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SSD.frameworks.map((f, i) => (
            <div key={i} style={{ paddingBottom: 14, borderBottom: i < SSD.frameworks.length - 1 ? "1px dashed var(--line)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{f.name}</span>
                {f.tag && <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--signal-2)", letterSpacing: "0.1em" }}>● {f.tag}</span>}
              </div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)", marginTop: 4, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Kernel */}
      <Panel title="kernel · upstream" accent="var(--signal-2)">
        <div style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.015em" }}>io_uring/zcrx race condition</div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)", marginTop: 12, lineHeight: 1.6 }}>
          <div><span style={{ color: "var(--fg-2)" }}>{SSD.kernel[0].subsystem}</span></div>
          <div style={{ marginTop: 4 }}>{SSD.kernel[0].vuln.toLowerCase()}</div>
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, color: "var(--signal-2)" }}>
            <span style={{ width: 6, height: 6, background: "currentColor" }} />
            {SSD.kernel[0].status.toLowerCase()}
          </div>
        </div>
      </Panel>

      {/* Tools */}
      <Panel title="offensive tools" sub={`${SSD.stats.toolCount} repos`} span={2}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
          {SSD.tools.map((t, i) => (
            <div key={i} style={{
              padding: "10px 0",
              borderTop: i < 2 ? "none" : "1px dashed var(--line)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)", marginTop: 3, lineHeight: 1.5 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Writing */}
      <Panel title="writing" sub="latest">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {SSD.aiResearch.slice(0, 5).map((w, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", gap: 10,
              padding: "8px 0", borderTop: i === 0 ? "none" : "1px dashed var(--line)",
              fontFamily: "var(--f-mono)", fontSize: 11,
            }}>
              <span style={{ color: "var(--fg-2)" }}>{w.title}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Identity / contact */}
      <Panel title="contact">
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-2)", lineHeight: 1.7 }}>
          <div><span style={{ color: "var(--fg-3)" }}>site &nbsp;&nbsp;</span>{SSD.identity.links.site}</div>
          <div><span style={{ color: "var(--fg-3)" }}>also &nbsp;&nbsp;</span>{SSD.identity.links.jailbreakChef}</div>
          <div><span style={{ color: "var(--fg-3)" }}>git &nbsp;&nbsp;&nbsp;</span>{SSD.identity.links.github}</div>
          <div><span style={{ color: "var(--fg-3)" }}>li &nbsp;&nbsp;&nbsp;&nbsp;</span>{SSD.identity.links.linkedin}</div>
          <div style={{ marginTop: 12, color: "var(--fg)" }}>kai@snailsploit.com</div>
        </div>
      </Panel>

    </div>
  </section>
);

const DashFooter = () => (
  <footer style={{ background: "var(--bg-sink)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr auto", gap: 0 }}>
      <div style={{ padding: "16px 20px", borderRight: "1px solid var(--line)" }}>
        <DEyebrow>shell.001 · 2026</DEyebrow>
      </div>
      <div style={{ padding: "16px 20px", fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>
        same attack. different substrate.
      </div>
      <div style={{ padding: "16px 20px", borderLeft: "1px solid var(--line)", fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>
        © kai aizen
      </div>
    </div>
  </footer>
);

const DashPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <DashHeader />
    <DashHero />
    <DashGrid />
    <DashFooter />
  </div>
);

Object.assign(window, { DashPage });
