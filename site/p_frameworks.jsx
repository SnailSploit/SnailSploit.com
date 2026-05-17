/* Frameworks index */
const SS_FW = window.SS_DATA;

const FRAMEWORK_INDEX = [
 { key: "AATMF", name: "AATMF v3", sub: "Adversarial AI Threat Modeling Framework", href: "/aatmf",
 desc: "20 tactics. 240 techniques. 2,152+ procedures. The structured catalog for AI red teaming — mapped to MITRE ATLAS, NIST AI RMF, and the EU AI Act.",
 stats: [["tactics","15"],["techniques","240"],["procedures","2,152+"],["license","CC BY-SA 4.0"]],
 tier: "flagship" },
 { key: "SEF", name: "SEF v2", sub: "Social Engineering Framework", href: "/sef",
 desc: "Adversarial psychology applied to humans. The other half of every attack chain — what AATMF does for models, SEF does for the people around them.",
 stats: [["volumes","6"],["tactics","12"],["techniques","180+"],["license","CC BY-SA 4.0"]],
 tier: "flagship" },
 { key: "PROMPT", name: "P.R.O.M.P.T", sub: "Adversarial Communication Framework", href: "/prompt",
 desc: "Premise · Role · Output · Modulation · Persona · Tactics. A six-stage compositional grammar for adversarial prompts — generative, not just a checklist.",
 stats: [["stages","6"],["compositions","∞"],["coverage","T1–T4"],["license","CC BY-SA 4.0"]],
 tier: "flagship" },
 { key: "TOOLKIT", name: "AATMF Toolkit", sub: "Python CLI for Systematic LLM Safety Testing", href: "/toolkit",
 desc: "Three-layer eval pipeline. Defense fingerprinting. Decay tracking. Attack-chain planning. Runs every AATMF procedure against any LLM endpoint — emits AATMF-R-scored reports.",
 stats: [["language","Python"],["procedures","2,152+"],["targets","any LLM"],["license","Apache 2.0"]],
 tier: "tooling" },
 { key: "PLAYBOOK", name: "LLM Red Teamer's Playbook", sub: "Diagnostic Methodology", href: "/playbook",
 desc: "Five defense layers, sequenced: input filters → alignment → identity → output → agentic trust. Diagnose which layer caught you and pivot — not a list of jailbreaks but a routing logic.",
 stats: [["layers","5"],["decision tree","yes"],["format","field manual"],["license","CC BY-SA 4.0"]],
 tier: "tooling" },
 { key: "CLAUDE-RED", name: "Claude-Red", sub: "Offensive Security Skills Library", href: "/claude-red",
 desc: "38 SKILL.md files curated for the Claude skills system — SQLi, shellcode, EDR evasion, exploit dev. Drop-in offensive capabilities for agent harnesses that need real adversarial coverage.",
 stats: [["skills","38"],["categories","9"],["target","Claude Skills"],["license","MIT"]],
 tier: "tooling" },
];

const FwCard = ({ f }) => (
 <a href={f.href} style={{
 display: "block", padding: "32px 32px 28px",
 borderRight: "1px solid var(--line-hi)", borderBottom: "1px solid var(--line-hi)",
 textDecoration: "none", color: "inherit",
 background: f.tier === "flagship" ? "var(--bg-raise)" : "transparent",
 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
 <Mono color="var(--signal-2)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}>{f.key}</Mono>
 <Mono color="var(--fg-3)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>{f.tier}</Mono>
 </div>
 <div style={{ marginTop: 18, fontSize: 32, fontWeight: 500, letterSpacing: "-0.025em", color: "var(--fg)" }}>{f.name}</div>
 <Mono color="var(--fg-3)" size={13} style={{ display: "block", marginTop: 4 }}>{f.sub}</Mono>
 <p style={{ margin: "20px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--fg-2)", textWrap: "pretty" }}>{f.desc}</p>
 <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingTop: 18, borderTop: "1px dashed var(--line)" }}>
 {f.stats.map(([k,v]) => (
 <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 12 }}>
 <span style={{ color: "var(--fg-3)" }}>{k}</span>
 <span style={{ color: "var(--fg)" }}>{v}</span>
 </div>
 ))}
 </div>
 <div style={{ marginTop: 24, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--signal-2)" }}>open framework →</div>
 </a>
);

const FrameworksPage = () => {
 const flagship = FRAMEWORK_INDEX.filter(f => f.tier === "flagship");
 const tooling = FRAMEWORK_INDEX.filter(f => f.tier === "tooling");
 return (
 <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
 <SiteNav active="frameworks" />
 <HeroFrame
 eyebrow={<>frameworks<br/>open source<br/>cc by-sa 4.0</>}
 title={<>frameworks &<br/><span style={{color:"var(--fg-3)"}}>tooling.</span></>}
 meta={<>6 frameworks<br/>2,500+ procedures<br/>updated 2026.05</>}
 lede={<>Six open frameworks for adversarial AI work. <span style={{color:"var(--fg-2)"}}>Three are flagship reference systems — AATMF, SEF, P.R.O.M.P.T. Three are operator tools — the AATMF Toolkit, the LLM Red Teamer's Playbook, and Claude-Red. All open. All extensible. All with the same goal: a structured language for breaking AI systems and the humans around them.</span></>}
 cta={<><CTA primary href="https://github.com/SnailSploit">all repos on github →</CTA><CTA href="#flagship">jump to flagship →</CTA></>}
 />

 <Section id="flagship" label="01 · flagship" hint="The three reference frameworks. Every AI red team engagement we run starts here."
 title="reference frameworks.">
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--line-hi)", borderLeft: "1px solid var(--line-hi)" }}>
 {flagship.map(f => <FwCard key={f.key} f={f} />)}
 <div style={{ padding: "32px 32px 28px", borderRight: "1px solid var(--line-hi)", borderBottom: "1px solid var(--line-hi)", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--bg-sink)" }}>
 <Mono color="var(--fg-3)" size={11} style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}>system</Mono>
 <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.3, color: "var(--fg)", letterSpacing: "-0.015em" }}>AATMF + SEF + P.R.O.M.P.T compose a single system. AATMF maps the machine attack surface. SEF maps the human one. P.R.O.M.P.T is the grammar that operates inside both.</div>
 <Mono color="var(--fg-3)" size={12} style={{ display: "block", marginTop: 24 }}>same attack. different substrate.</Mono>
 </div>
 </div>
 </Section>

 <Section id="tooling" sink label="02 · tooling" hint="Three operator-grade tools. Built for the work, not for the slide deck."
 title="operator tooling.">
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--line-hi)", borderLeft: "1px solid var(--line-hi)" }}>
 {tooling.map(f => <FwCard key={f.key} f={f} />)}
 </div>
 </Section>

 <Section id="how" label="03 · how they fit"
 hint="One layer at a time. None of these is a silver bullet — together they cover the surface."
 title="how the pieces fit.">
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
 {[
 ["You're scoping an AI red team engagement", "Start with AATMF. Use the 20 tactics as a coverage checklist. Score everything with AATMF-R. Map the report to whatever standard the customer cares about."],
 ["You're attacking the humans, not the model", "SEF. AATMF will tell you the attack surface; SEF will tell you which lever to pull. They're designed to be used together."],
 ["You need a prompt that actually works", "P.R.O.M.P.T. Compose, don't list. Six stages: premise, role, output, modulation, persona, tactics. The grammar of every prompt that beats alignment."],
 ["You want to automate the whole loop", "AATMF Toolkit. Python CLI. Drop in your endpoint, pick procedures, get an AATMF-R-scored report."],
 ["You hit a wall and don't know which layer caught you", "LLM Red Teamer's Playbook. Five-layer decision tree: input filters → alignment → identity → output → agentic. Tells you where to pivot."],
 ["You're building an agent harness for offensive work", "Claude-Red. 38 skills. Drop-in offensive capabilities — no need to re-derive every primitive from scratch."],
 ].map(([q, a], i) => (
 <div key={i} style={{ padding: "24px 0", borderTop: i < 2 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
 <div style={{ fontSize: 18, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>{q}</div>
 <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{a}</p>
 </div>
 ))}
 </div>
 </Section>

 <SiteFooter section="frameworks" />
 </div>
 );
};

Object.assign(window, { FrameworksPage });
