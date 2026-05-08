/* Shared article scaffolding for the 7 research pieces */

const ArticleHero = ({ track, date, title, dek, venue, readtime }) => (
  <section style={{ borderBottom: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "96px 32px 80px" }}>
      <Crumb trail={[["snailsploit", "/"], ["research", "/research"], [track, null]]} />
      <h1 style={{ margin: "32px 0 0", fontSize: 72, fontWeight: 500, lineHeight: 1.0, letterSpacing: "-0.04em", textWrap: "balance" }}>{title}</h1>
      <p style={{ margin: "32px 0 0", fontSize: 22, lineHeight: 1.5, color: "var(--fg-2)", maxWidth: 720, textWrap: "pretty" }}>{dek}</p>
      <div style={{ marginTop: 40, display: "flex", gap: 24, paddingTop: 20, borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
        <Mono color="var(--fg-3)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>by kai aizen</Mono>
        <Mono color="var(--fg-3)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>{date}</Mono>
        <Mono color="var(--fg-3)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>{venue}</Mono>
        <Mono color="var(--fg-3)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>{readtime}</Mono>
      </div>
    </div>
  </section>
);

const ArticleBody = ({ children }) => (
  <section style={{ borderBottom: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "80px 32px" }}>
      <article style={{ maxWidth: 720, margin: "0 auto", fontSize: 18, lineHeight: 1.75, color: "var(--fg-2)", textWrap: "pretty" }}>{children}</article>
    </div>
  </section>
);

const H2 = ({ children }) => <h2 style={{ marginTop: 64, marginBottom: 16, fontSize: 36, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.025em", lineHeight: 1.15 }}>{children}</h2>;
const H3 = ({ children }) => <h3 style={{ marginTop: 40, marginBottom: 12, fontSize: 22, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.012em" }}>{children}</h3>;
const P  = ({ children }) => <p style={{ margin: "0 0 20px" }}>{children}</p>;
const Pull = ({ children }) => (
  <blockquote style={{ margin: "40px 0", padding: "0 0 0 24px", borderLeft: "2px solid var(--signal-2)", fontSize: 24, lineHeight: 1.45, color: "var(--fg)", letterSpacing: "-0.012em" }}>{children}</blockquote>
);
const Code = ({ children }) => (
  <pre style={{ margin: "24px 0", padding: "20px 24px", background: "var(--bg-sink)", border: "1px solid var(--line-hi)", fontFamily: "var(--f-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--fg)", whiteSpace: "pre-wrap", overflowX: "auto" }}>{children}</pre>
);
const InlineCode = ({ children }) => <code style={{ fontFamily: "var(--f-mono)", fontSize: "0.92em", color: "var(--fg)", background: "var(--bg-sink)", padding: "2px 6px", border: "1px solid var(--line)" }}>{children}</code>;
const Aside = ({ children, label = "note" }) => (
  <aside style={{ margin: "32px 0", padding: "20px 24px", border: "1px solid var(--line-hi)", background: "var(--bg-raise)" }}>
    <Mono color="var(--signal-2)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}</Mono>
    <div style={{ marginTop: 8, fontSize: 16, color: "var(--fg-2)", lineHeight: 1.65 }}>{children}</div>
  </aside>
);
const Stepped = ({ steps }) => (
  <ol style={{ margin: "24px 0", padding: 0, listStyle: "none", counterReset: "step" }}>
    {steps.map((s, i) => (
      <li key={i} style={{ counterIncrement: "step", display: "grid", gridTemplateColumns: "60px 1fr", gap: 16, padding: "16px 0", borderTop: "1px solid var(--line)" }}>
        <Mono color="var(--signal-2)" size={14}>0{i+1}</Mono>
        <span style={{ color: "var(--fg-2)", lineHeight: 1.65 }}>{s}</span>
      </li>
    ))}
  </ol>
);

const ArticleFootnote = ({ items }) => (
  <section style={{ borderBottom: "1px solid var(--line)", background: "var(--bg-sink)" }}>
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "64px 32px" }}>
      <Mono color="var(--fg-3)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>references & related</Mono>
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {items.map(([t, h], i) => (
          <a key={i} href={h} style={{ padding: "16px 20px", border: "1px solid var(--line-hi)", textDecoration: "none", color: "var(--fg-2)", fontFamily: "var(--f-mono)", fontSize: 13 }}>{t} →</a>
        ))}
      </div>
    </div>
  </section>
);

Object.assign(window, { ArticleHero, ArticleBody, H2, H3, P, Pull, Code, InlineCode, Aside, Stepped, ArticleFootnote });
