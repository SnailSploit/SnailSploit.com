/* Tools index — 10 tools, no individual detail pages per scope */
const SS_T = window.SS_DATA;

const TOOL_META = {
  "Burp MCP Toolkit":     { stack: "TypeScript / MCP",  status: "stable",  href: "https://github.com/SnailSploit/burp-mcp-toolkit",
    long: "Model Context Protocol bridge for Burp Suite. Lets an LLM-powered analysis layer reason over live Burp traffic, with prompt-injection and tool-poisoning testing baked in. Designed for operators who already live in Burp and want to bring agentic analysis into the existing workflow rather than around it." },
  "SnailHunter":          { stack: "Python · LLM",       status: "stable",  href: "https://github.com/SnailSploit/snailhunter",
    long: "AI-augmented bug bounty automation. Runs traditional security scanning in parallel with LLM analysis — the LLM triages, ranks, and writes the candidate report; the scanner provides the ground truth. Built for the boring 90% of recon so you can spend your time on the interesting 10%." },
  "KubeRoast":            { stack: "Go",                 status: "stable",  href: "https://github.com/SnailSploit/kuberoast",
    long: "Red-team Kubernetes scanner. Walks the cluster from an unprivileged service account perspective, enumerates misconfigurations and attack paths (RBAC bindings, mountable secrets, hostPath escapes, kubelet exposures), and emits a graph of how to escalate. Pairs with the AATMF Toolkit's container chapter." },
  "Xposure":              { stack: "Python · async",     status: "beta",    href: "https://github.com/SnailSploit/xposure",
    long: "Autonomous credential intelligence platform for attack-surface recon. Continuously crawls public sources, correlates leaked credentials with target organizations, and surfaces the small subset that actually validates. Designed to feed an offensive program — not a generic threat-feed firehose." },
  "SnailSploit Recon":    { stack: "Chrome MV3",         status: "stable",  href: "https://github.com/SnailSploit/snailsploit-recon",
    long: "Passive recon extension. Surfaces security headers, IP intel, fingerprinted technologies, and CPE→CVE enrichment as you browse. Zero active probes — everything is read from the response you already received. Ideal for sales-engineer-style recon during scoping calls." },
  "SnailPath":            { stack: "Python · HTTP/2",    status: "stable",  href: "https://github.com/SnailSploit/snailpath",
    long: "Async directory and route discovery. HTTP/2 native. Soft-404 suppression learned per-target. Mines JS bundles and source maps for endpoints that wordlists will never find. Built to replace the gobuster step in our recon pipeline." },
  "ZenFlood":             { stack: "Python",             status: "stable",  href: "https://github.com/SnailSploit/zenflood",
    long: "Modernized Slowloris. Low-bandwidth stress testing for HTTP/1.1 and HTTP/2. Useful for testing how a service degrades under realistic adversarial load — single laptop, no botnet, no plausible deniability problems." },
  "SnailObfuscator":      { stack: "AST-based · multi",  status: "beta",    href: "https://github.com/SnailSploit/snailobfuscator",
    long: "Structurally-aware code obfuscation engine. Operates on the AST, not strings — preserves semantics across renames, control-flow flattening, and constant unfolding. Built for offensive payload work and adversarial-evaluation research, not for shipping production code." },
  "Awesome-Snail-OSINT":  { stack: "list",               status: "rolling", href: "https://github.com/SnailSploit/awesome-snail-osint",
    long: "Curated OSINT resource collection for offensive recon. Opinionated, maintained, pruned. Not the maximalist 'awesome-everything' list — only the sources that consistently turn up actionable intelligence on real engagements." },
};

const ToolRow = ({ t, i }) => {
  const m = TOOL_META[t.name] || {};
  return (
    <a href={m.href || "#"} target={m.href ? "_blank" : undefined} rel="noreferrer" style={{
      display: "grid", gridTemplateColumns: "60px 220px 1fr 120px 120px", gap: 20,
      padding: "28px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)",
      alignItems: "start", textDecoration: "none", color: "inherit",
    }}>
      <Mono color="var(--signal-2)" size={12}>0{i+1}</Mono>
      <div>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em", color: "var(--fg)" }}>{t.name}</div>
        <Mono color="var(--fg-3)" size={11} style={{ display: "block", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.14em" }}>{t.desc}</Mono>
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--fg-2)", textWrap: "pretty" }}>{m.long}</p>
      <Mono color="var(--fg-2)" size={12}>{m.stack}</Mono>
      <div style={{ textAlign: "right" }}>
        <Pill color={m.status === "stable" ? "var(--fg)" : m.status === "beta" ? "var(--signal-2)" : "var(--fg-2)"}>{m.status}</Pill>
      </div>
    </a>
  );
};

const ToolsPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="tools" />
    <HeroFrame
      eyebrow={<>offensive tools<br/>open source<br/>9 projects</>}
      title={<>offensive<br/><span style={{color:"var(--fg-3)"}}>tooling.</span></>}
      meta={<>9 repos<br/>github.com/SnailSploit<br/>updated continuously</>}
      lede={<>Tools we build because the work needs them. <span style={{color:"var(--fg-2)"}}>Some bridge new substrate (Burp ↔ MCP, Kubernetes attack paths, agent recon). Some are sharper takes on commodity primitives (SnailPath replaces the gobuster step; ZenFlood is the modern Slowloris). All open source, all in active use on real engagements, all aligned to the same operating principle: structured, repeatable, reportable.</span></>}
      cta={<><CTA primary href="https://github.com/SnailSploit">all repos →</CTA><CTA href="#index">browse the index →</CTA></>}
    />

    <Section id="index" label="01 · the index"
      hint="Sorted by use in the offensive lifecycle: recon → discovery → analysis → post-exploit → research."
      title="10 tools.">
      <div>
        {SS_T.tools.map((t, i) => <ToolRow key={t.name} t={t} i={i} />)}
      </div>
      <div style={{ marginTop: 48, padding: "24px 0", borderTop: "1px dashed var(--line)", fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)", lineHeight: 1.7 }}>
        Detail pages for individual tools are intentionally not built — the README in each repo is the source of truth and stays in sync with the code. Click any row above to land in the corresponding repo.
      </div>
    </Section>

    <Section id="philosophy" sink label="02 · philosophy"
      hint="Why these specifically — not whatever the meta is doing this quarter."
      title="how we pick what to build.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {[
          ["The work needs it", "Every tool here exists because an engagement hit a wall that an existing tool couldn't get through. None of them are speculative."],
          ["It's structurally novel", "If a good tool already exists for the job, we use that one. We only ship a new tool when the existing options have a structural limitation — wrong protocol, wrong threat model, wrong abstraction."],
          ["It plays nice with the frameworks", "Every tool produces output that maps cleanly back to AATMF / SEF / P.R.O.M.P.T tactics. Reports stay consistent across the whole stack."],
          ["It's small enough to read", "We'd rather ship 9 sharp tools you can read end-to-end than 1 monolithic platform you have to take on faith."],
        ].map(([q, a], i) => (
          <div key={i} style={{ padding: "24px 0", borderTop: i < 2 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>{q}</div>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </div>
    </Section>

    <SiteFooter section="tools" />
  </div>
);

Object.assign(window, { ToolsPage });
