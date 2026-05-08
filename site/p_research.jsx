/* Research index — links into 7 full article pages */
const SS_R = window.SS_DATA;

const ARTICLE_META = [
  { title: "Self-Replicating Memory Worm",
    href: "/memory-worm",
    slug: "memory-worm",
    track: "agentic · memory",
    venue: "snailsploit.com · Hakin9",
    date: "2026.04",
    pull: "An adversarial prompt that survives across sessions and propagates via long-term memory writes — the AI-worm primitive." },
  { title: "Memory Injection Through Nested Skills",
    href: "/memory-injection",
    slug: "memory-injection",
    track: "agentic · skills",
    venue: "snailsploit.com",
    date: "2026.03",
    pull: "Skill injection plus memory poisoning equals a self-healing autonomous implant. Validated against DVWA and Juice Shop in an agent harness." },
  { title: "ChatGPT Canvas DNS Exfiltration",
    href: "/canvas-dns",
    slug: "canvas-dns",
    track: "exfiltration",
    venue: "snailsploit.com · Medium",
    date: "2026.02",
    pull: "DNS exfiltration via rendered Canvas content — triggers lookups without ever issuing an outbound HTTP request the policy layer can see." },
  { title: "ChatGPT Sandbox: Pickle RCE + DNS Chain",
    href: "/pickle-rce",
    slug: "pickle-rce",
    track: "sandbox escape",
    venue: "snailsploit.com · Hakin9",
    date: "2026.01",
    pull: "Pickle deserialization RCE chained with DNS exfiltration to escape the Code Interpreter sandbox." },
  { title: "MCP vs A2A: Attack Surface",
    href: "/mcp-vs-a2a",
    slug: "mcp-vs-a2a",
    track: "protocols · agentic",
    venue: "snailsploit.com",
    date: "2025.12",
    pull: "Comparative threat model for the two emerging agent-coordination protocols. Where they diverge in trust boundaries — and where the new attack surface lives." },
  { title: "The 30% Blind Spot — LLM Safety Judges",
    href: "/blind-spot",
    slug: "blind-spot",
    track: "evaluation",
    venue: "snailsploit.com",
    date: "2025.11",
    pull: "Empirical study showing LLM-as-judge safety classifiers miss roughly 30% of adversarial output classes — and which classes specifically." },
  { title: "Adversarial Prompting: Complete Guide",
    href: "/adversarial-guide",
    slug: "adversarial-prompting",
    track: "foundations",
    venue: "snailsploit.com · book chapter",
    date: "2025.10",
    pull: "End-to-end methodology covering direct, indirect, multi-turn, and agentic prompt injection. The reference reader for AATMF T1–T4." },
];

const ResearchRow = ({ a, i }) => (
  <a href={a.href} style={{
    display: "grid", gridTemplateColumns: "80px 1.4fr 1fr 100px", gap: 24,
    padding: "32px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)",
    alignItems: "start", textDecoration: "none", color: "inherit",
  }}>
    <Mono color="var(--fg-3)" size={12}>{a.date}</Mono>
    <div>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.018em", color: "var(--fg)", lineHeight: 1.2 }}>{a.title}</div>
      <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: 620, textWrap: "pretty" }}>{a.pull}</p>
      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Pill color="var(--signal-2)">{a.track}</Pill>
        <Pill color="var(--fg-3)">{a.venue}</Pill>
      </div>
    </div>
    <div />
    <Mono color="var(--signal-2)" size={13} style={{ textAlign: "right" }}>read →</Mono>
  </a>
);

const ResearchPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="research" />
    <HeroFrame
      eyebrow={<>research<br/>ai security<br/>2025–2026</>}
      title={<>research &<br/><span style={{color:"var(--fg-3)"}}>writeups.</span></>}
      meta={<>7 articles<br/>snailsploit.com · Hakin9 · Medium<br/>updated 2026.05</>}
      lede={<>Original research on adversarial AI. <span style={{color:"var(--fg-2)"}}>Each piece is operational — the goal is reproducible attack mechanics, not vibes. Tracks span memory & agents, sandbox escape, exfiltration, evaluation gaps, and the foundations layer that ties them together. Most appear first here, then in Hakin9 or Medium.</span></>}
      cta={<><CTA primary href="#index">browse all →</CTA><CTA href="https://github.com/SnailSploit">source on github →</CTA></>}
    />

    <Section id="index" label="01 · all articles" hint="Reverse chronological. Click any title for the full piece."
      title="research index.">
      <div>
        {ARTICLE_META.map((a, i) => <ResearchRow key={a.slug} a={a} i={i} />)}
      </div>
    </Section>

    <Section id="tracks" sink label="02 · tracks" hint="The four research tracks the work clusters into."
      title="research tracks.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {[
          ["Agentic & memory", "Persistence, propagation, and self-healing in agent systems. The frontier where prompt injection meets implant theory."],
          ["Sandbox escape & exfiltration", "Concrete escapes from production sandboxes (Code Interpreter, Canvas) and the side-channel exfil paths that survive policy layers."],
          ["Protocols & coordination", "MCP, A2A, and the inter-agent coordination protocols that just landed. New trust boundaries → new attack surface."],
          ["Evaluation & foundations", "What the safety stack actually catches vs. what it misses. The reference layer that ties direct, indirect, multi-turn, and agentic prompt injection into a single methodology."],
        ].map(([t, d], i) => (
          <div key={i} style={{ padding: "24px 0", borderTop: i < 2 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.012em" }}>{t}</div>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>

    <SiteFooter section="research" />
  </div>
);

Object.assign(window, { ResearchPage });
