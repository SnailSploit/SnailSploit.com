/* ============================================================
 AATMF v3 — Framework page (full content build)
 Source: github.com/SnailSploit/AATMF-Adversarial-AI-Threat-Modeling-Framework
 ============================================================ */

const AATMF = {
 version: "v3",
 license: "CC BY-SA 4.0",
 atlas: "MITRE ATLAS v4.6.0",
 thesis:
 "AI systems are vulnerable to social engineering because they were trained to respond like humans. This is the first technology where human manipulation techniques directly translate to technical exploitation.",
 stats: { tactics: 15, techniques: 240, procedures: "2,152+", prompts: "4,980+" },

 quickStart: [
 ["Understand the framework", "Introduction & Architecture", "/frameworks/aatmf/foundations/"],
 ["Run an AI red team assessment", "Red Team Operations & Checklists", "/frameworks/aatmf/operations/"],
 ["Defend my AI system", "Blue Team Defense & Mitigations", "/frameworks/aatmf/defense/"],
 ["Respond to an AI incident", "Incident Response Playbooks", "/frameworks/aatmf/incident-response/"],
 ["Map to compliance", "· MITRE · NIST · EU AI Act", "/frameworks/aatmf/governance/"],
 ["Browse attack techniques", "Complete Attack Catalog (240 techniques)", "/frameworks/aatmf/catalog/"],
 ["Deploy detection signatures", "YARA & Sigma Signatures Library", "/frameworks/aatmf/signatures/"],
 ],

 shifts: [
 ["Policy Puppetry bypasses every frontier model", "Jailbreaking is now a commodity"],
 ["Reasoning models autonomously jailbreak others — 97% ASR", "AI-vs-AI attacks are real"],
 ["GTG-1002 — first state-sponsored AI-orchestrated cyberattack", "Agentic AI is weaponized"],
 ["MCP tool poisoning — 84% ASR on production agents", "Tool ecosystems are attack surfaces"],
 ["250 poisoned documents backdoor any model — any size", "Training poisoning is trivially cheap"],
 ["PoisonedRAG — 90% ASR with 5 injected texts", "RAG security is fundamentally broken"],
 ["Deepfake fraud tripled to $1.1 billion in 2025", "Real-world harm at scale"],
 ],

 /* [id, name, group, techCount, procCount, blurb, links?] */
 tactics: [
 ["T1", "Prompt & Context Subversion", "core", 16, 76,
 "Manipulate model instructions and context. System prompt extraction, instruction hierarchy override, context window flooding, and delimiter exploitation. The foundational tactic — most attacks start here.",
 [["prompt injection", "/ai-security/prompt-injection/"]]],
 ["T2", "Semantic & Linguistic Evasion", "core", 20, 161,
 "Bypass filters through language manipulation. Encoding tricks, character substitution, multilingual pivots, homoglyph attacks, and obfuscation chains. The arms race between input filters and the creativity of natural language.",
 [["LLM jailbreaking", "/ai-security/jailbreaking/"]]],
 ["T3", "Reasoning & Constraint Exploitation", "core", 19, 178,
 "Exploit logical reasoning and constraints. Hypothetical framing, roleplay escalation, ethical dilemma construction, chain-of-thought manipulation, and recursive reasoning loops. Turns the model's own reasoning capabilities against its safety training.",
 []],
 ["T4", "Multi-Turn & Memory Manipulation", "core", 16, 147,
 "Leverage conversation history and memory. Context poisoning across turns, memory injection, conversation state manipulation, and persistent backdoor establishment. Particularly dangerous in agents with long-term memory.",
 [["memory manipulation", "/ai-security/jailbreaking/memory-manipulation-attacks/"]]],
 ["T5", "Model & API Exploitation", "core", 16, 142,
 "Attack model interfaces and APIs. Parameter manipulation, token budget exhaustion, embedding space attacks, logit bias exploitation, and model fingerprinting. The technical attack surface beneath the natural language interface.",
 []],
 ["T6", "Training & Feedback Poisoning", "core", 15, 141,
 "Corrupt training data and feedback loops. RLHF manipulation, preference poisoning, data injection during fine-tuning, and reward hacking. 250 poisoned documents can backdoor any model regardless of size.",
 []],
 ["T7", "Output Manipulation & Exfiltration", "core", 15, 146,
 "Manipulate outputs and extract data. Steganographic encoding in responses, structured data leakage, gradual extraction through benign-looking queries, and output format exploitation.",
 []],
 ["T8", "External Deception & Misinformation", "core", 15, 150,
 "Generate deceptive content at scale. Deepfake text generation, authority impersonation, citation fabrication, and automated disinformation pipelines. Deepfake fraud tripled to $1.1 billion in 2025.",
 []],
 ["T9", "Multimodal & Cross-Channel Attacks", "advanced", 17, 147,
 "Attack across modalities. Image-embedded prompts, audio adversarial examples, cross-modal injection, and OCR exploitation. The attack surface expands every time a model gains a new input type.",
 []],
 ["T10", "Integrity & Confidentiality Breach", "advanced", 15, 147,
 "Extract data and breach integrity. Training data extraction, membership inference, model inversion, and PII recovery from fine-tuned models. What the model learned, an attacker can sometimes unlearn.",
 []],
 ["T11", "Agentic & Orchestrator Exploitation", "advanced", 16, 160,
 "Attack autonomous agents and orchestrators. MCP tool poisoning (84% ASR on production agents), agent-to-agent manipulation, orchestrator confusion, and autonomous goal hijacking. The fastest-growing attack surface.",
 [["MCP security analysis", "/ai-security/mcp-vs-a2a-attack-surface/"]]],
 ["T12", "RAG & Knowledge Base Manipulation", "advanced", 15, 149,
 "Poison retrieval systems. Document injection, embedding collision, knowledge base backdoors, and retrieval ranking manipulation. PoisonedRAG hits 90% ASR with 5 injected texts.",
 []],
 ["T13", "AI Supply Chain & Artifact Trust", "infra", 15, 150,
 "Compromise the model supply chain. Model repository poisoning, adapter backdoors, quantization attacks, and dependency confusion in ML pipelines.",
 []],
 ["T14", "Infrastructure & Economic Warfare", "infra", 15, 150,
 "Attack AI infrastructure. Compute denial, API abuse for economic damage, model serving disruption, and resource exhaustion attacks.",
 []],
 ["T15", "Human Workflow Exploitation", "infra", 15, 108,
 "Manipulate human reviewers and workflows. RLHF annotator manipulation, red team exhaustion, compliance theater exploitation, and safety review bypass through procedural gaming.",
 [["human workflow exploitation (SEF)", "/frameworks/sef/"]]],
 ],

 riskFactors: [
 ["L", "Likelihood", "1–5", "Probability of successful exploitation"],
 ["I", "Impact", "1–5", "Severity of successful attack"],
 ["E", "Exploitability", "1–5", "Ease of execution — skill, resources, access"],
 ["D", "Detectability", "1–5", "Difficulty of detection — 5 means nearly invisible"],
 ["R", "Recoverability", "1–5", "Effort to recover — 5 means irrecoverable"],
 ["C", "Cost factor", "0.5–2.0", "Economic impact multiplier"],
 ],

 ratingScale: [
 ["250+", "Critical", "var(--signal-2)"],
 ["200–249", "High", "#D9A361"],
 ["150–199", "Medium", "#B6B4AC"],
 ["100–149", "Low", "#76746C"],
 ["0–99", "Informational", "#4A4842"],
 ],

 /* [aatmf, atlas, ] */
 mapping: [
 ["T1 Prompt & Context Subversion", "AML.T0051 LLM Prompt Injection", "LLM01 · LLM02 · LLM03 · LLM04 · LLM06 · LLM07 · LLM08 · LLM10"],
 ["T2 Semantic & Linguistic Evasion", "AML.T0054 LLM Jailbreak", "LLM01"],
 ["T3 Reasoning & Constraint Exploitation", "AML.T0054.001–003", "LLM01"],
 ["T4 Multi-Turn & Memory Manipulation", "AML.T0056 LLM Meta Prompt Extraction", "LLM07"],
 ["T5 Model & API Exploitation", "AML.T0044 Full ML Model Access", "—"],
 ["T6 Training & Feedback Poisoning", "AML.T0020 Poison Training Data", "LLM04"],
 ["T7 Output Manipulation & Exfiltration", "AML.T0024.002 Exfil via Inference API", "LLM02 · LLM05"],
 ["T8 External Deception & Misinformation", "AML.T0048 Societal Harm", "LLM05 · LLM09"],
 ["T9 Multimodal & Cross-Channel Attacks", "AML.T0051 cross-modal variants", "LLM01"],
 ["T10 Integrity & Confidentiality Breach", "AML.T0024 Exfil via Cyber Means", "LLM02"],
 ["T11 Agentic & Orchestrator Exploitation", "AML.T0057 LLM Agent Abuse", "LLM06"],
 ["T12 RAG & Knowledge Base Manipulation", "AML.T0058 RAG Poisoning", "LLM04 · LLM08"],
 ["T13 AI Supply Chain & Artifact Trust", "AML.T0010 ML Supply Chain Compromise", "LLM03"],
 ["T14 Infrastructure & Economic Warfare", "AML.T0029 Denial of ML Service", "LLM10"],
 ["T15 Human Workflow Exploitation", "AML.T0048.004 Reputational Harm", "—"],
 ],

 volumes: [
 ["I", "Framework Foundations", "Methodology, risk assessment (AATMF-R v3), and framework architecture. Start here to understand structure, scoring, and how tactics chain together."],
 ["II", "Core Attack Tactics · T1–T8", "Prompt subversion, semantic evasion, reasoning exploitation, memory manipulation, API attacks, training poisoning, output exfiltration, and deception."],
 ["III", "Advanced Attack Tactics · T9–T12", "Multimodal attacks, integrity breaches, agentic exploitation, and RAG manipulation. The attack surface that emerged as models gained tools, memory, and autonomy."],
 ["IV", "Infrastructure & Human · T13–T15", "Supply chain compromise, infrastructure warfare, and human workflow exploitation. Tactics that target the systems and people around the model, not the model itself."],
 ["V", "Implementation & Operations", "Detection engineering, mitigation strategies, incident response playbooks, and red/blue team operations. How to operationalize AATMF."],
 ["VI", "Governance & Compliance", "Risk management framework, compliance mapping to / MITRE / NIST / EU AI Act, and training programs."],
 ["VII", "Appendices & Resources", "Complete catalog of all 240 techniques, detection signatures (YARA / Sigma / MCP), assessment templates, case studies, and glossary."],
 ],

 related: [
 ["SEF", "Social Engineering Framework", "/frameworks/sef/"],
 ["P.R.O.M.P.T", "Adversarial Communication", "/frameworks/prompt/"],
 ["LLM", "Jailbreaking Research", "/ai-security/jailbreaking/"],
 ["INJ", "Prompt Injection Research", "/ai-security/prompt-injection/"],
 ["TC-21", "Gateway Layer Attacks", "/ai-security/ai-gateway-threat-model/"],
 ["TOOLKIT", "AATMF Python CLI", "https://github.com/SnailSploit/aatmf-toolkit"],
 ],

 citation: `@misc{aizen2026aatmf,
 title = {AATMF v3: Adversarial AI Threat Modeling Framework},
 author = {Aizen, Kai},
 year = {2026},
 url = {https://github.com/snailsploit/aatmf},
 note = {20 tactics, 240 techniques, 2,152+ procedures}
}`,
};

/* ============================================================
 Atoms
 ============================================================ */
const E = ({ children, c="var(--fg-3)", style }) => (
 <div style={{ fontFamily:"var(--f-mono)", fontSize:11, color:c, textTransform:"uppercase", letterSpacing:"0.14em",...style }}>{children}</div>
);

const Section = ({ children, sink, id, label, title, hint }) => (
 <section id={id} style={{ borderBottom:"1px solid var(--line)", background: sink ? "var(--bg-sink)" : "transparent" }}>
 <div style={{ maxWidth:1280, margin:"0 auto", padding:"112px 32px" }}>
 <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:40, alignItems:"start" }}>
 <div style={{ position:"sticky", top:96, alignSelf:"start" }}>
 <E>{label}</E>
 {hint && <div style={{ marginTop:14, fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg-3)", lineHeight:1.55 }}>{hint}</div>}
 </div>
 <div>
 {title && (
 <h2 style={{ margin:0, fontSize:56, fontWeight:500, lineHeight:0.98, letterSpacing:"-0.035em" }}>
 {title}
 </h2>
 )}
 <div style={{ marginTop: title ? 56 : 0 }}>{children}</div>
 </div>
 </div>
 </div>
 </section>
);

const Pill = ({ children, color="var(--fg-2)" }) => (
 <span style={{ display:"inline-block", padding:"3px 8px", border:"1px solid var(--line-hi)", fontFamily:"var(--f-mono)", fontSize:10, color, textTransform:"uppercase", letterSpacing:"0.14em" }}>{children}</span>
);

const Mono = ({ children, color="var(--fg-2)", size=13 }) => (
 <span style={{ fontFamily:"var(--f-mono)", fontSize:size, color }}>{children}</span>
);

/* ============================================================
 Header / Hero
 ============================================================ */
const AATMFNav = () => (
 <header style={{ position:"sticky", top:0, zIndex:50, background:"color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderBottom:"1px solid var(--line)" }}>
 <div style={{ maxWidth:1280, margin:"0 auto", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
 <WordmarkFull size={1} color="var(--fg)" accent="var(--signal-2)" />
 <nav style={{ display:"flex", gap:28, fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg-2)", textTransform:"lowercase" }}>
 {[
 ["start","#start"],
 ["tactics","#tactics"],
 ["risk","#risk"],
 ["mapping","#mapping"],
 ["volumes","#volumes"],
 ["cite","#cite"],
 ].map(([n,h]) => <a key={n} href={h} style={{ color:"inherit", textDecoration:"none" }}>{n}</a>)}
 </nav>
 <div style={{ fontFamily:"var(--f-mono)", fontSize:11, color:"var(--fg-3)" }}>frameworks / aatmf</div>
 </div>
 </header>
);

const Hero = () => (
 <section style={{ borderBottom:"1px solid var(--line)", position:"relative" }}>
 <div style={{ maxWidth:1280, margin:"0 auto", padding:"96px 32px 80px" }}>
 <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:40, alignItems:"start" }}>
 <div>
 <E>aatmf · {AATMF.version}</E>
 <div style={{ marginTop:14, fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg-3)", lineHeight:1.7 }}>
 cc by-sa 4.0<br/>
 mitre atlas v4.6.0<br/>
 updated 2026-05-01
 </div>
 </div>

 <div>
 <Pill color="var(--signal-2)">framework · v3</Pill>
 <h1 style={{ margin:"24px 0 0", fontSize:128, fontWeight:500, lineHeight:0.88, letterSpacing:"-0.055em" }}>
 adversarial AI<br/>
 <span style={{ color:"var(--fg-3)" }}>threat&nbsp;modeling.</span>
 </h1>

 <div style={{ marginTop:48, display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:48, alignItems:"start" }}>
 <p style={{ margin:0, fontSize:20, lineHeight:1.55, color:"var(--fg)", maxWidth:640 }}>
 AATMF applies adversarial psychology to machine systems. It does for AI what MITRE ATT&amp;CK does for enterprise networks — a common language, complete taxonomy, and actionable procedures for{" "}
 <a href="#" style={{ color:"var(--fg)", textDecorationColor:"var(--signal-2)", textUnderlineOffset:4 }}>AI red teaming</a>, threat modeling, and defense.
 <br/><br/>
 <span style={{ color:"var(--fg-2)" }}>Traditional cybersecurity frameworks miss the attack surfaces unique to AI: prompt injection, training data poisoning, model extraction, agentic exploitation, RAG manipulation, and the human feedback loops that shape model behavior. AATMF fills that gap with a structured approach to LLM security testing.</span>
 </p>

 <div style={{ borderLeft:"1px solid var(--line-hi)", paddingLeft:24 }}>
 <E>at a glance</E>
 <div style={{ marginTop:16, fontFamily:"var(--f-mono)", fontSize:14, color:"var(--fg-2)", lineHeight:2 }}>
 <Stat k="tactics" v={AATMF.stats.tactics} />
 <Stat k="techniques" v={AATMF.stats.techniques} />
 <Stat k="procedures" v={AATMF.stats.procedures} />
 <Stat k="prompts" v={AATMF.stats.prompts} />
 </div>
 </div>
 </div>

 {/* CTAs */}
 <div style={{ marginTop:56, display:"flex", gap:16, flexWrap:"wrap" }}>
 <CTA primary href="https://github.com/SnailSploit/AATMF-Adversarial-AI-Threat-Modeling-Framework">view on github →</CTA>
 <CTA href="/frameworks/aatmf/prompt-bank/">open prompt bank →</CTA>
 <CTA href="#start">quick start →</CTA>
 </div>

 {/* Thesis */}
 <blockquote style={{ margin:"80px 0 0", padding:"0 0 0 28px", borderLeft:"2px solid var(--signal-2)", maxWidth:840 }}>
 <div style={{ fontSize:24, lineHeight:1.45, color:"var(--fg)", letterSpacing:"-0.012em" }}>
 "{AATMF.thesis}"
 </div>
 <div style={{ marginTop:16 }}>
 <Mono color="var(--fg-3)" size={12}>— core thesis · aatmf v3</Mono>
 </div>
 </blockquote>
 </div>
 </div>
 </div>
 </section>
);

const Stat = ({ k, v }) => (
 <div style={{ display:"flex", justifyContent:"space-between", borderBottom:"1px dashed var(--line)", padding:"4px 0" }}>
 <span style={{ color:"var(--fg-3)" }}>{k}</span>
 <span style={{ color:"var(--fg)", fontVariantNumeric:"tabular-nums" }}>{v}</span>
 </div>
);

const CTA = ({ children, primary, href }) => (
 <a href={href} style={{
 display:"inline-flex", alignItems:"center", gap:10,
 padding:"14px 22px",
 fontFamily:"var(--f-mono)", fontSize:13, letterSpacing:"0.02em",
 textDecoration:"none",
 border:"1px solid " + (primary ? "var(--signal-2)" : "var(--line-hi)"),
 background: primary ? "var(--signal-2)" : "transparent",
 color: primary ? "var(--bg)" : "var(--fg)",
 }}>{children}</a>
);

/* ============================================================
 Quick Start
 ============================================================ */
const QuickStart = () => (
 <Section id="start" sink label="00 · quick start"
 hint="Pick the path that matches your task. Every link drops into operational material — checklists, playbooks, signature libraries."
 title="quick start: ai red team paths.">
 <div style={{ borderTop:"1px solid var(--line-hi)" }}>
 {AATMF.quickStart.map(([want, dest, href], i) => (
 <a key={i} href={href} style={{
 display:"grid", gridTemplateColumns:"32px 1fr 1.2fr 32px", gap:20,
 padding:"22px 0", borderBottom:"1px solid var(--line)",
 alignItems:"baseline", textDecoration:"none", color:"inherit"
 }}>
 <Mono color="var(--fg-3)" size={12}>{String(i+1).padStart(2,"0")}</Mono>
 <span style={{ fontSize:20, fontWeight:500, letterSpacing:"-0.012em", color:"var(--fg)" }}>{want}</span>
 <Mono color="var(--fg-2)">{dest}</Mono>
 <Mono color="var(--signal-2)" size={14}>→</Mono>
 </a>
 ))}
 </div>
 </Section>
);

/* ============================================================
 Why v3
 ============================================================ */
const Why = () => (
 <Section id="why" label="01 · why v3"
 hint="The threat surface shifted in 2025–2026. Every tactic updated. New operational volumes. Namespaced IDs eliminate prior collisions."
 title="the threat surface shifted.">
 <div>
 <div style={{ display:"grid", gridTemplateColumns:"160px 1.4fr 1fr", gap:24, padding:"0 0 12px", borderBottom:"1px solid var(--line-hi)" }}>
 <Mono color="var(--fg-3)" size={11}>year</Mono>
 <Mono color="var(--fg-3)" size={11}>what happened</Mono>
 <Mono color="var(--fg-3)" size={11}>what it means</Mono>
 </div>
 {AATMF.shifts.map(([dev,impact],i) => (
 <div key={i} style={{ display:"grid", gridTemplateColumns:"160px 1.4fr 1fr", gap:24, padding:"22px 0", borderBottom:"1px solid var(--line)", alignItems:"baseline" }}>
 <Mono color="var(--fg-3)" size={12}>{2025 + (i > 3 ? 1 : 0)} · 0{i+1}</Mono>
 <span style={{ fontSize:16, lineHeight:1.5, color:"var(--fg)" }}>{dev}</span>
 <Mono color="var(--signal-2)" size={13}>{impact}</Mono>
 </div>
 ))}
 </div>
 </Section>
);

/* ============================================================
 The 20 tactics
 ============================================================ */
const TacticGroupHeader = ({ k, label }) => (
 <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 80px 80px", gap:20, padding:"32px 0 12px", borderBottom:"1px solid var(--line-hi)" }}>
 <Mono color="var(--fg-3)" size={11}>{k}</Mono>
 <Mono color="var(--fg-3)" size={11}>{label}</Mono>
 <Mono color="var(--fg-3)" size={11} >tech</Mono>
 <Mono color="var(--fg-3)" size={11} >proc</Mono>
 </div>
);

const TacticRow = ({ row }) => {
 const [id, name, tech, proc, blurb, links] = row;
 return (
 <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 80px 80px", gap:20, padding:"24px 0", borderBottom:"1px solid var(--line)", alignItems:"start" }}>
 <Mono color="var(--signal-2)" size={14}>{id}</Mono>
 <div>
 <div style={{ fontSize:22, fontWeight:500, letterSpacing:"-0.015em", color:"var(--fg)" }}>{name}</div>
 <p style={{ margin:"10px 0 0", fontSize:14, lineHeight:1.6, color:"var(--fg-2)", maxWidth:680 }}>
 {blurb}
 </p>
 {links && links.length > 0 && (
 <div style={{ marginTop:14, display:"flex", gap:18, flexWrap:"wrap" }}>
 {links.map(([t,h],i) => (
 <a key={i} href={h} style={{ fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg-2)", textDecoration:"none", borderBottom:"1px dashed var(--line-hi)", paddingBottom:2 }}>↗ {t}</a>
 ))}
 </div>
 )}
 </div>
 <Mono color="var(--fg)" size={13}>{tech}</Mono>
 <Mono color="var(--fg)" size={13}>{proc}</Mono>
 </div>
 );
};

const Tactics = () => {
 const core = AATMF.tactics.filter(t => t[2] === "core");
 const advanced = AATMF.tactics.filter(t => t[2] === "advanced");
 const infra = AATMF.tactics.filter(t => t[2] === "infra");
 const sumTech = AATMF.tactics.reduce((s,t) => s + t[3], 0);
 const sumProc = AATMF.tactics.reduce((s,t) => s + t[4], 0);
 return (
 <Section id="tactics" sink label="02 · the 20 tactics"
 hint="Three groupings: core model-level attacks, advanced attack surface (multimodal, agentic, RAG), and the systems-and-people layer around the model."
 title="15 ai attack tactics.">

 <TacticGroupHeader k="core · t1–t8" label="direct model-level attacks" />
 {core.map((row,i) => <TacticRow key={row[0]} row={row} />)}

 <TacticGroupHeader k="advanced · t9–t12" label="tools, memory, autonomy" />
 {advanced.map((row,i) => <TacticRow key={row[0]} row={row} />)}

 <TacticGroupHeader k="infra & human · t13–t15" label="systems and people around the model" />
 {infra.map((row,i) => <TacticRow key={row[0]} row={row} />)}

 <div style={{ marginTop:32, display:"grid", gridTemplateColumns:"60px 1fr 80px 80px", gap:20, padding:"18px 0", borderTop:"1px solid var(--line-hi)" }}>
 <Mono color="var(--fg-3)" size={11}>total</Mono>
 <Mono color="var(--fg)" >20 tactics</Mono>
 <Mono color="var(--signal-2)">{sumTech}</Mono>
 <Mono color="var(--signal-2)">{sumProc.toLocaleString()}</Mono>
 </div>
 </Section>
 );
};

/* ============================================================
 Risk Scoring (AATMF-R v3)
 ============================================================ */
const RiskScoring = () => (
 <Section id="risk" label="03 · risk scoring"
 hint="AATMF-R v3 scores every technique on six factors. The result is a comparable risk number across tactics, organizations, and time."
 title="ai risk scoring · aatmf-r v3.">

 {/* formula */}
 <div style={{
 padding:"28px 32px",
 background:"var(--bg-sink)",
 border:"1px solid var(--line-hi)",
 borderLeft:"2px solid var(--signal-2)",
 }}>
 <Mono color="var(--fg-3)" size={11}>formula</Mono>
 <div style={{ marginTop:12, fontFamily:"var(--f-mono)", fontSize:24, color:"var(--fg)", letterSpacing:"-0.005em" }}>
 Risk &nbsp;=&nbsp; (L × I × E) / 6 &nbsp;×&nbsp; (D / 6) &nbsp;×&nbsp; R &nbsp;×&nbsp; C
 </div>
 </div>

 {/* factor grid */}
 <div style={{ marginTop:48 }}>
 <Mono color="var(--fg-3)" size={11}>six factors</Mono>
 <div style={{ marginTop:16, display:"grid", gridTemplateColumns:"repeat(3, 1fr)", borderTop:"1px solid var(--line-hi)", borderLeft:"1px solid var(--line-hi)" }}>
 {AATMF.riskFactors.map(([k,l,r,desc]) => (
 <div key={k} style={{ padding:"24px 26px", borderRight:"1px solid var(--line-hi)", borderBottom:"1px solid var(--line-hi)" }}>
 <div style={{ display:"flex", alignItems:"baseline", gap:12 }}>
 <div style={{ fontFamily:"var(--f-mono)", fontSize:36, color:"var(--signal-2)", lineHeight:1 }}>{k}</div>
 <Mono color="var(--fg-3)" size={11}>{r}</Mono>
 </div>
 <div style={{ marginTop:12, fontSize:18, fontWeight:500, color:"var(--fg)" }}>{l}</div>
 <p style={{ margin:"8px 0 0", fontSize:13, color:"var(--fg-2)", lineHeight:1.55 }}>{desc}</p>
 </div>
 ))}
 </div>
 </div>

 {/* rating scale */}
 <div style={{ marginTop:64 }}>
 <Mono color="var(--fg-3)" size={11}>rating scale</Mono>
 <div style={{ marginTop:16 }}>
 {AATMF.ratingScale.map(([range, level, color], i) => (
 <div key={range} style={{
 display:"grid", gridTemplateColumns:"24px 160px 1fr 120px", gap:24,
 padding:"18px 0", borderTop: i===0 ? "1px solid var(--line-hi)" : "1px solid var(--line)",
 alignItems:"center"
 }}>
 <div style={{ width:8, height:8, background:color, borderRadius:8 }} />
 <Mono color="var(--fg)" size={14}>{range}</Mono>
 <span style={{ fontSize:18, fontWeight:500, color, letterSpacing:"-0.01em" }}>{level}</span>
 <Bar value={(5-i)/5} color={color} />
 </div>
 ))}
 </div>
 </div>

 <div style={{ marginTop:48 }}>
 <CTA href="/frameworks/aatmf/foundations/">try the interactive calculator →</CTA>
 </div>
 </Section>
);

const Bar = ({ value, color }) => (
 <div style={{ height:4, background:"var(--line)", position:"relative" }}>
 <div style={{ position:"absolute", inset:0, width: `${value*100}%`, background:color }} />
 </div>
);

/* ============================================================
 Architecture
 ============================================================ */
const Architecture = () => (
 <Section id="architecture" sink label="04 · architecture"
 hint="Hierarchy and ID system. v3 namespacing eliminates the 43 ID collisions present in earlier versions."
 title="framework architecture.">

 <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:48, alignItems:"start" }}>
 <pre style={{
 margin:0, padding:"28px 32px",
 background:"var(--bg)", border:"1px solid var(--line-hi)",
 fontFamily:"var(--f-mono)", fontSize:13, lineHeight:1.7, color:"var(--fg-2)",
 whiteSpace:"pre",
 overflowX:"auto",
 }}>
{`AATMF v3
├── 15 Tactics
│ ├── 240 Techniques
│ │ ├── 2,152+ Attack Procedures
│ │ │ └── 4,980+ Prompts
│ │ ├── Detection Patterns
│ │ └── Mitigation Controls
│ └── Risk Scoring (AATMF-R v3)
└── Supporting Infrastructure
 ├── Detection Signatures YARA · Sigma · MCP
 ├── Response Playbooks
 ├── Assessment Templates
 └── Compliance Mappings · ATLAS · NIST · EU AI Act`}
 </pre>

 <div>
 <div style={{ fontSize:22, fontWeight:500, letterSpacing:"-0.015em", color:"var(--fg)" }}>namespaced id system</div>
 <p style={{ margin:"12px 0 24px", fontSize:14, lineHeight:1.6, color:"var(--fg-2)" }}>
 Every technique and procedure now declares its parent tactic in the identifier. Tactic membership is visible at a glance; cross-version migrations are unambiguous.
 </p>
 <div style={{ borderTop:"1px solid var(--line-hi)" }}>
 {[
 ["T{n}-AT-{seq:03d}", "Technique ID", "T1-AT-001 · T11-AT-016"],
 ["T{n}-AP-{seq}{L}", "Attack Procedure","T1-AP-001A · T3-AP-010B"],
 ].map(([pat, name, ex]) => (
 <div key={pat} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, padding:"18px 0", borderBottom:"1px solid var(--line)" }}>
 <div>
 <Mono color="var(--signal-2)" size={13}>{pat}</Mono>
 <div style={{ marginTop:6, fontSize:13, color:"var(--fg)" }}>{name}</div>
 </div>
 <Mono color="var(--fg-3)" size={12}>{ex}</Mono>
 </div>
 ))}
 </div>
 </div>
 </div>
 </Section>
);

/* ============================================================
 Cross-framework mapping
 ============================================================ */
const Mapping = () => (
 <Section id="mapping" label="05 · cross-framework"
 hint="AATMF maps directly to the standards enterprises already use. Additional mappings: Agentic Top 10 (Dec 2025), NIST AI RMF / IR 8596, EU AI Act risk categories, CWE / CVE."
 title="cross-framework mapping: mitre atlas, nist.">

 <div>
 <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1.2fr 1.4fr", gap:24, padding:"0 0 12px", borderBottom:"1px solid var(--line-hi)" }}>
 <Mono color="var(--fg-3)" size={11}>aatmf tactic</Mono>
 <Mono color="var(--fg-3)" size={11}>mitre atlas</Mono>
 <Mono color="var(--fg-3)" size={11}></Mono>
 </div>
 {AATMF.mapping.map(([t,a,o], i) => (
 <div key={t} style={{ display:"grid", gridTemplateColumns:"1.4fr 1.2fr 1.4fr", gap:24, padding:"16px 0", borderBottom:"1px solid var(--line)", alignItems:"baseline" }}>
 <span style={{ fontSize:14, color:"var(--fg)", fontFamily:"var(--f-mono)" }}>{t}</span>
 <Mono color="var(--fg-2)" size={12}>{a}</Mono>
 <Mono color={o === "—" ? "var(--fg-4)" : "var(--signal-2)"} size={12}>{o}</Mono>
 </div>
 ))}
 </div>

 <div style={{ marginTop:48 }}>
 <CTA href="/frameworks/aatmf/governance/">full compliance mapping →</CTA>
 </div>
 </Section>
);

/* ============================================================
 Volumes
 ============================================================ */
const Volumes = () => (
 <Section id="volumes" sink label="06 · documentation"
 hint="Seven volumes. Read sequentially or jump to the operational material in V — the rest is reference."
 title="aatmf documentation: 7 volumes.">
 <div style={{ borderTop:"1px solid var(--line-hi)" }}>
 {AATMF.volumes.map(([n, t, sub], i) => (
 <div key={n} style={{ display:"grid", gridTemplateColumns:"80px 1fr 2fr 32px", gap:24, padding:"32px 0", borderBottom:"1px solid var(--line)", alignItems:"start" }}>
 <Mono color="var(--signal-2)" size={28} >{n}</Mono>
 <div style={{ fontSize:22, fontWeight:500, letterSpacing:"-0.015em", color:"var(--fg)" }}>{t}</div>
 <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:"var(--fg-2)", maxWidth:640 }}>{sub}</p>
 <Mono color="var(--fg-3)" size={14}>→</Mono>
 </div>
 ))}
 </div>
 <div style={{ marginTop:32, fontSize:13, color:"var(--fg-2)", lineHeight:1.6 }}>
 For automated testing, see the <a href="https://github.com/SnailSploit/aatmf-toolkit" style={{ color:"var(--fg)", textDecorationColor:"var(--signal-2)", textUnderlineOffset:4 }}>AATMF Toolkit</a> — a Python CLI that runs procedures against any LLM endpoint and emits AATMF-R-scored reports.
 </div>
 </Section>
);

/* ============================================================
 Starter pack CTA
 ============================================================ */
const StarterPack = () => (
 <section style={{ borderBottom:"1px solid var(--line)", background:"var(--bg)" }}>
 <div style={{ maxWidth:1280, margin:"0 auto", padding:"112px 32px" }}>
 <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:64, alignItems:"start" }}>
 <div>
 <E>get the red-card starter pack</E>
 <h2 style={{ margin:"20px 0 0", fontSize:64, fontWeight:500, lineHeight:0.98, letterSpacing:"-0.04em" }}>
 10 ready-to-run<br/>red team scenarios.
 </h2>
 <p style={{ marginTop:24, fontSize:18, lineHeight:1.55, color:"var(--fg-2)", maxWidth:540 }}>
 Evaluation scenarios for testing AI systems against common attack vectors. YAML templates drop straight into CI/CD. Mapped to and MITRE ATLAS so the output reads in your existing review process.
 </p>
 <ul style={{ marginTop:28, padding:0, listStyle:"none", display:"grid", gap:10 }}>
 {[
 "10 ready-to-run red team scenarios",
 "YAML templates for CI/CD pipelines",
 "Risk scoring worksheets (AATMF-R v3)",
 "Mapped to and MITRE ATLAS",
 ].map(x => (
 <li key={x} style={{ fontFamily:"var(--f-mono)", fontSize:13, color:"var(--fg-2)", display:"flex", gap:12 }}>
 <span style={{ color:"var(--signal-2)" }}>+</span>{x}
 </li>
 ))}
 </ul>
 </div>

 <div style={{ border:"1px solid var(--line-hi)", padding:"32px 32px 28px", background:"var(--bg-sink)" }}>
 <Mono color="var(--fg-3)" size={11}>aatmf · red-card · starter v3</Mono>
 <div style={{ marginTop:28, fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>email</div>
 <input
 type="email"
 placeholder="operator@your-org.com"
 style={{
 marginTop:8, width:"100%", padding:"16px 0",
 background:"transparent", border:"none",
 borderBottom:"1px solid var(--line-hi)",
 fontFamily:"var(--f-mono)", fontSize:15, color:"var(--fg)",
 outline:"none",
 }}
 />
 <button style={{
 marginTop:24, width:"100%", padding:"16px 22px",
 background:"var(--signal-2)", border:"none",
 fontFamily:"var(--f-mono)", fontSize:13, color:"var(--bg)",
 letterSpacing:"0.04em", cursor:"pointer", textTransform:"lowercase",
 }}>download free →</button>
 <div style={{ marginTop:18, fontFamily:"var(--f-mono)", fontSize:11, color:"var(--fg-3)", lineHeight:1.6 }}>
 no spam. unsubscribe anytime. starter pack is CC BY-SA 4.0.
 </div>
 </div>
 </div>
 </div>
 </section>
);

/* ============================================================
 Related
 ============================================================ */
const Related = () => (
 <Section id="related" label="07 · related"
 hint="AATMF sits inside a unified adversarial-psychology system. Each related framework targets a different layer."
 title="related frameworks & research.">
 <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:0, borderTop:"1px solid var(--line-hi)", borderLeft:"1px solid var(--line-hi)" }}>
 {AATMF.related.map(([k, name, href], i) => (
 <a key={i} href={href} style={{
 padding:"28px 28px 32px", borderRight:"1px solid var(--line-hi)", borderBottom:"1px solid var(--line-hi)",
 textDecoration:"none", color:"inherit", display:"flex", flexDirection:"column", gap:16, minHeight:160,
 }}>
 <Mono color="var(--signal-2)" size={11}>{k}</Mono>
 <div style={{ fontSize:20, fontWeight:500, letterSpacing:"-0.015em", color:"var(--fg)", marginTop:"auto" }}>{name}</div>
 <Mono color="var(--fg-3)" size={11}>{href}</Mono>
 </a>
 ))}
 </div>
 </Section>
);

/* ============================================================
 Cite
 ============================================================ */
const Cite = () => (
 <Section id="cite" sink label="08 · cite"
 hint="License is CC BY-SA 4.0. Use, modify, and share with attribution. The framework is open source — pull requests welcome."
 title="citation & source.">
 <pre style={{ margin:0, padding:"28px 32px", background:"var(--bg)", border:"1px solid var(--line-hi)",
 fontFamily:"var(--f-mono)", fontSize:13, color:"var(--fg-2)", lineHeight:1.7,
 whiteSpace:"pre-wrap", maxWidth:760
 }}>{AATMF.citation}</pre>

 <div style={{ marginTop:32, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, maxWidth:760 }}>
 <div>
 <Mono color="var(--fg-3)" size={11}>license</Mono>
 <div style={{ marginTop:8, fontSize:14, color:"var(--fg)" }}>{AATMF.license}</div>
 </div>
 <div>
 <Mono color="var(--fg-3)" size={11}>source</Mono>
 <div style={{ marginTop:8 }}>
 <a href="https://github.com/SnailSploit/AATMF-Adversarial-AI-Threat-Modeling-Framework" style={{ fontFamily:"var(--f-mono)", fontSize:13, color:"var(--fg)", textDecoration:"none", borderBottom:"1px solid var(--signal-2)" }}>
 github.com/SnailSploit/AATMF
 </a>
 </div>
 </div>
 </div>

 <div style={{ marginTop:48, fontSize:13, color:"var(--fg-3)", fontFamily:"var(--f-mono)" }}>
 creator of aatmf · author of <em style={{ color:"var(--fg-2)", fontStyle:"normal" }}>adversarial minds</em> · nvd contributor
 </div>
 </Section>
);

/* ============================================================
 Footer
 ============================================================ */
const AATMFFooter = () => (
 <footer style={{ background:"var(--bg-sink)" }}>
 <div style={{ maxWidth:1280, margin:"0 auto", padding:"56px 32px 36px" }}>
 <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, alignItems:"start" }}>
 <div>
 <WordmarkFull size={1} color="var(--fg)" accent="var(--signal-2)" />
 <p style={{ marginTop:18, maxWidth:340, fontSize:13, color:"var(--fg-3)", lineHeight:1.6 }}>
 Adversarial psychology applied to machine systems. Open frameworks, original research, operational tooling.
 </p>
 </div>
 <FooterCol title="frameworks" items={[
 ["AATMF", "/frameworks/aatmf/"],
 ["SEF", "/frameworks/sef/"],
 ["P.R.O.M.P.T", "/frameworks/prompt/"],
 ]} />
 <FooterCol title="research" items={[
 ["Jailbreaking", "/ai-security/jailbreaking/"],
 ["Prompt Injection", "/ai-security/prompt-injection/"],
 ["Gateway TC-21", "/ai-security/ai-gateway-threat-model/"],
 ]} />
 <FooterCol title="source" items={[
 ["GitHub", "https://github.com/SnailSploit"],
 ["Toolkit", "https://github.com/SnailSploit/aatmf-toolkit"],
 ["RSS", "/feed.xml"],
 ]} />
 </div>
 <div style={{ marginTop:48, paddingTop:24, borderTop:"1px solid var(--line)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
 <Mono color="var(--fg-3)" size={11}>aatmf v3 · cc by-sa 4.0 · kai aizen · 2026</Mono>
 <Mono color="var(--fg-3)" size={11}>frameworks / aatmf</Mono>
 </div>
 </div>
 </footer>
);

const FooterCol = ({ title, items }) => (
 <div>
 <Mono color="var(--fg-3)" size={11}>{title}</Mono>
 <div style={{ marginTop:14, display:"grid", gap:8 }}>
 {items.map(([t,h]) => (
 <a key={t} href={h} style={{ fontSize:13, color:"var(--fg-2)", textDecoration:"none" }}>{t}</a>
 ))}
 </div>
 </div>
);

/* ============================================================
 Tweaks
 Three expressive controls that reshape feel, not pixels:
 - surface : graphite (default dark) | paper (warm light mirror) | terminal (CRT green-on-black)
 - signal : oxide | cyan | lime | violet — same chroma family, hue swap
 - voice : operator (grotesk) | ascii (mono headlines) | editorial (serif italic)
 ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
 "surface": "graphite",
 "signal": "oxide",
 "voice": "operator"
}/*EDITMODE-END*/;

const SURFACES = {
 graphite: {
 "--bg":"#0E0E0F","--bg-raise":"#15161A","--bg-sink":"#08090B",
 "--line":"#23252B","--line-hi":"#2E3138",
 "--fg":"#E9E7E1","--fg-2":"#B6B4AC","--fg-3":"#76746C","--fg-4":"#4A4842",
 },
 paper: {
 "--bg":"#F4F2EC","--bg-raise":"#EAE7DD","--bg-sink":"#E4E0D2",
 "--line":"#D6D2C5","--line-hi":"#C4BFAE",
 "--fg":"#0E0E0F","--fg-2":"#38362F","--fg-3":"#6B675C","--fg-4":"#9C9789",
 },
 terminal: {
 "--bg":"#04070A","--bg-raise":"#07101A","--bg-sink":"#01030A",
 "--line":"#0E2A28","--line-hi":"#15413B",
 "--fg":"#B7F3D0","--fg-2":"#7DCDA4","--fg-3":"#3F8366","--fg-4":"#21503D",
 },
};

const SIGNALS = {
 oxide: { "--signal":"#C2592C", "--signal-2":"#E07A4A" },
 cyan: { "--signal":"#1F8A9B", "--signal-2":"#3EB5C8" },
 lime: { "--signal":"#7AA22B", "--signal-2":"#A2CB4C" },
 violet: { "--signal":"#6E4CC4", "--signal-2":"#9277E0" },
};

const VOICES = {
 operator: {
 "--f-display":"var(--f-grot)",
 "--display-weight":"500",
 "--display-italic":"normal",
 "--display-track":"-0.04em",
 "--display-transform":"none",
 },
 ascii: {
 "--f-display":"var(--f-mono)",
 "--display-weight":"500",
 "--display-italic":"normal",
 "--display-track":"-0.06em",
 "--display-transform":"lowercase",
 },
 editorial: {
 "--f-display":"'Instrument Serif', 'Times New Roman', Georgia, serif",
 "--display-weight":"400",
 "--display-italic":"italic",
 "--display-track":"-0.02em",
 "--display-transform":"none",
 },
};

const TweakStyleInjector = () => (
 <style>{`
 h1, h2 {
 font-family: var(--f-display) !important;
 font-weight: var(--display-weight) !important;
 font-style: var(--display-italic) !important;
 letter-spacing: var(--display-track) !important;
 text-transform: var(--display-transform) !important;
 }
 `}</style>
);

const AATMFPage = () => {
 const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

 // Load Instrument Serif on demand for editorial voice
 React.useEffect(() => {
 if (t.voice === "editorial" && !document.getElementById("__instrument-serif")) {
 const link = document.createElement("link");
 link.id = "__instrument-serif";
 link.rel = "stylesheet";
 link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap";
 document.head.appendChild(link);
 }
 }, [t.voice]);

 const themeVars = {...SURFACES[t.surface],...SIGNALS[t.signal],...VOICES[t.voice],
 };

 return (
 <div style={{...themeVars,
 background:"var(--bg)", color:"var(--fg)",
 fontFamily:"var(--f-grot)", minHeight:"100vh",
 transition:"background 280ms ease, color 280ms ease",
 }}>
 <TweakStyleInjector />
 <AATMFNav />
 <Hero />
 <QuickStart />
 <Why />
 <Tactics />
 <RiskScoring />
 <Architecture />
 <Mapping />
 <Volumes />
 <StarterPack />
 <Related />
 <Cite />
 <AATMFFooter />

 <TweaksPanel title="Tweaks">
 <TweakSection label="Surface" />
 <TweakRadio
 label="Mode"
 value={t.surface}
 options={["graphite","paper","terminal"]}
 onChange={(v) => setTweak("surface", v)}
 />

 <TweakSection label="Signal" />
 <TweakColor
 label="Accent"
 value={t.signal === "oxide" ? "#E07A4A" : t.signal === "cyan" ? "#3EB5C8" : t.signal === "lime" ? "#A2CB4C" : "#9277E0"}
 options={["#E07A4A","#3EB5C8","#A2CB4C","#9277E0"]}
 onChange={(hex) => {
 const map = {"#E07A4A":"oxide","#3EB5C8":"cyan","#A2CB4C":"lime","#9277E0":"violet"};
 setTweak("signal", map[hex] || "oxide");
 }}
 />

 <TweakSection label="Voice" />
 <TweakRadio
 label="Headlines"
 value={t.voice}
 options={["operator","ascii","editorial"]}
 onChange={(v) => setTweak("voice", v)}
 />
 </TweaksPanel>
 </div>
 );
};

Object.assign(window, { AATMFPage });
