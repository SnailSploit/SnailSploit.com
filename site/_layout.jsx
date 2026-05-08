/* ============================================================
   Shared layout — used by every page.
   Exports: SiteNav, SiteFooter, Section, Eyebrow, Pill, Mono, CTA, Stat,
            HeroFrame, FootnoteRow, Crumb, ArticleProse, Sticky.
   ============================================================ */

const NAV_LINKS = [
  ["about",      "/about"],
  ["services",   "/services"],
  ["frameworks", "/frameworks"],
  ["research",   "/research"],
  ["tools",      "/tools"],
  ["writing",    "/writing"],
];

const Eyebrow = ({ children, c = "var(--fg-3)", style }) => (
  <div style={{
    fontFamily: "var(--f-mono)", fontSize: 11, color: c,
    textTransform: "uppercase", letterSpacing: "0.14em", ...style
  }}>{children}</div>
);

const Mono = ({ children, color = "var(--fg-2)", size = 13, style }) => (
  <span style={{ fontFamily: "var(--f-mono)", fontSize: size, color, ...style }}>{children}</span>
);

const Pill = ({ children, color = "var(--fg-2)", border = "var(--line-hi)" }) => (
  <span style={{
    display: "inline-block", padding: "3px 8px", border: `1px solid ${border}`,
    fontFamily: "var(--f-mono)", fontSize: 10, color,
    textTransform: "uppercase", letterSpacing: "0.14em",
  }}>{children}</span>
);

const Sticky = ({ children }) => (
  <div style={{ position: "sticky", top: 96, alignSelf: "start" }}>
    <Eyebrow>{children}</Eyebrow>
  </div>
);

const Section = ({ id, sink, label, title, hint, children, narrow }) => (
  <section id={id} style={{
    borderBottom: "1px solid var(--line)",
    background: sink ? "var(--bg-sink)" : "transparent",
  }}>
    <div style={{ maxWidth: narrow ? 1080 : 1280, margin: "0 auto", padding: "112px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 40, alignItems: "start" }}>
        <div style={{ position: "sticky", top: 96, alignSelf: "start" }}>
          {label && <Eyebrow>{label}</Eyebrow>}
          {hint && (
            <div style={{
              marginTop: 14, fontFamily: "var(--f-mono)", fontSize: 12,
              color: "var(--fg-3)", lineHeight: 1.55,
            }}>{hint}</div>
          )}
        </div>
        <div>
          {title && (
            <h2 style={{
              margin: 0, fontSize: 56, fontWeight: 500,
              lineHeight: 0.98, letterSpacing: "-0.035em",
            }}>{title}</h2>
          )}
          <div style={{ marginTop: title ? 56 : 0 }}>{children}</div>
        </div>
      </div>
    </div>
  </section>
);

const Stat = ({ k, v }) => (
  <div style={{
    display: "flex", justifyContent: "space-between",
    borderBottom: "1px dashed var(--line)", padding: "4px 0",
  }}>
    <span style={{ color: "var(--fg-3)" }}>{k}</span>
    <span style={{ color: "var(--fg)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
  </div>
);

const CTA = ({ children, primary, href, target }) => (
  <a href={href} target={target} style={{
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: "14px 22px",
    fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: "0.02em",
    textDecoration: "none",
    border: "1px solid " + (primary ? "var(--signal-2)" : "var(--line-hi)"),
    background: primary ? "var(--signal-2)" : "transparent",
    color: primary ? "var(--bg)" : "var(--fg)",
  }}>{children}</a>
);

const Crumb = ({ trail }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
    {trail.map(([t, h], i) => (
      <React.Fragment key={i}>
        {i > 0 && <Mono color="var(--fg-4)" size={11}>/</Mono>}
        {h ? (
          <a href={h} style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.14em" }}>{t}</a>
        ) : (
          <Mono color="var(--fg)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>{t}</Mono>
        )}
      </React.Fragment>
    ))}
  </div>
);

const SiteNav = ({ active }) => (
  <header style={{
    position: "sticky", top: 0, zIndex: 50,
    background: "color-mix(in srgb, var(--bg) 88%, transparent)",
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--line)",
  }}>
    <div style={{
      maxWidth: 1280, margin: "0 auto", padding: "16px 32px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <a href="/" style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
        {typeof WordmarkFull !== "undefined"
          ? <WordmarkFull size={1} color="var(--fg)" accent="var(--signal-2)" />
          : <span style={{ fontFamily: "var(--f-mono)", fontSize: 14, letterSpacing: "0.04em" }}>snailsploit</span>}
      </a>
      <nav style={{
        display: "flex", gap: 28, fontFamily: "var(--f-mono)",
        fontSize: 12, color: "var(--fg-2)", textTransform: "lowercase",
      }}>
        {NAV_LINKS.map(([n, h]) => (
          <a key={n} href={h} style={{
            color: active === n ? "var(--fg)" : "inherit",
            textDecoration: "none",
            borderBottom: active === n ? "1px solid var(--signal-2)" : "1px solid transparent",
            paddingBottom: 2,
          }}>{n}</a>
        ))}
      </nav>
      <div style={{
        display: "flex", gap: 16, alignItems: "center",
        fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)",
      }}>
        <span>⌘K</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, background: "var(--signal-2)", borderRadius: 999 }} /> live
        </span>
      </div>
    </div>
  </header>
);

const FooterCol = ({ title, items }) => (
  <div>
    <Mono color="var(--fg-3)" size={11}>{title}</Mono>
    <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
      {items.map(([t, h]) => (
        <a key={t} href={h} style={{ fontSize: 13, color: "var(--fg-2)", textDecoration: "none" }}>{t}</a>
      ))}
    </div>
  </div>
);

const SiteFooter = ({ section }) => (
  <footer style={{ background: "var(--bg-sink)" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px 36px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 32, alignItems: "start",
      }}>
        <div>
          {typeof WordmarkFull !== "undefined"
            ? <WordmarkFull size={1} color="var(--fg)" accent="var(--signal-2)" />
            : <span style={{ fontFamily: "var(--f-mono)", fontSize: 14 }}>snailsploit</span>}
          <p style={{ marginTop: 18, maxWidth: 360, fontSize: 13, color: "var(--fg-3)", lineHeight: 1.6 }}>
            Adversarial psychology applied to machine systems. Open frameworks, original research, operational tooling.
          </p>
          <div style={{ marginTop: 18, display: "flex", gap: 14, fontFamily: "var(--f-mono)", fontSize: 12 }}>
            <a href="https://github.com/SnailSploit" style={{ color: "var(--fg-2)", textDecoration: "none" }}>github</a>
            <a href="https://x.com/SnailSploit" style={{ color: "var(--fg-2)", textDecoration: "none" }}>x</a>
            <a href="https://linkedin.com/in/kaiaizen" style={{ color: "var(--fg-2)", textDecoration: "none" }}>linkedin</a>
            <a href="/contact" style={{ color: "var(--fg-2)", textDecoration: "none" }}>contact</a>
          </div>
        </div>
        <FooterCol title="frameworks" items={[
          ["AATMF",        "/aatmf"],
          ["SEF",          "/sef"],
          ["P.R.O.M.P.T",  "/prompt"],
          ["Claude-Red",   "/claude-red"],
        ]} />
        <FooterCol title="research" items={[
          ["AI Security",  "/research"],
          ["Linux Kernel", "/kernel"],
          ["CVEs",         "/cves"],
          ["Advisories",   "/advisories"],
        ]} />
        <FooterCol title="more" items={[
          ["Services",     "/services"],
          ["Tools",        "/tools"],
          ["Writing",      "/writing"],
          ["Contact",      "/contact"],
        ]} />
      </div>
      <div style={{
        marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Mono color="var(--fg-3)" size={11}>© 2026 kai aizen · same attack. different substrate.</Mono>
        <Mono color="var(--fg-3)" size={11}>{section || "snailsploit"}</Mono>
      </div>
    </div>
  </footer>
);

const HeroFrame = ({ eyebrow, title, lede, meta, cta }) => (
  <section style={{ borderBottom: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 32px 80px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 40, alignItems: "start" }}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          {meta && (
            <div style={{
              marginTop: 14, fontFamily: "var(--f-mono)", fontSize: 12,
              color: "var(--fg-3)", lineHeight: 1.7,
            }}>{meta}</div>
          )}
        </div>
        <div>
          <h1 style={{
            margin: 0, fontSize: 128, fontWeight: 500,
            lineHeight: 0.88, letterSpacing: "-0.055em",
          }}>{title}</h1>
          {lede && (
            <p style={{
              margin: "48px 0 0", fontSize: 20, lineHeight: 1.55,
              color: "var(--fg)", maxWidth: 720, textWrap: "pretty",
            }}>{lede}</p>
          )}
          {cta && <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>{cta}</div>}
        </div>
      </div>
    </div>
  </section>
);

const ArticleProse = ({ children }) => (
  <div className="prose" style={{
    fontSize: 17, lineHeight: 1.7, color: "var(--fg-2)",
    maxWidth: 720, textWrap: "pretty",
  }}>{children}</div>
);

const FootnoteRow = ({ k, v }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "120px 1fr", gap: 16,
    padding: "14px 0", borderTop: "1px solid var(--line)",
    fontFamily: "var(--f-mono)", fontSize: 13,
  }}>
    <span style={{ color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 11 }}>{k}</span>
    <span style={{ color: "var(--fg)" }}>{v}</span>
  </div>
);

Object.assign(window, {
  Eyebrow, Mono, Pill, Sticky, Section, Stat, CTA, Crumb,
  SiteNav, SiteFooter, FooterCol, HeroFrame, ArticleProse, FootnoteRow,
});
