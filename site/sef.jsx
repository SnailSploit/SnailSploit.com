/* ============================================================
   SEF v1 — Social Engineering Framework
   Source: SnailSploit / frameworks / sef
   Same template architecture as AATMF — sticky-label sections,
   numeric tracks, oxide signal accent.
   ============================================================ */

const SEF = {
  version: "v1.0",
  layer:   "Human Security",
  thesis:
    "The trust reflexes that make AI vulnerable to prompt injection make humans vulnerable to social engineering. Same attack psychology, different substrate.",
  stats: { techniques: 20, phases: 7, dimensions: 6, levers: 8 },

  gaps: [
    ["Knowledge", "what employees should know  →  what they actually know",
      "Failed phishing simulations, policy violations, unreported incidents."],
    ["Behavior",  "what employees know  →  what they actually do",
      "People know not to reuse passwords, accept tailgaters, or plug in unknown USBs. They do it anyway. Knowledge alone doesn't change behavior."],
    ["Culture",   "stated security values  →  actual organizational culture",
      "When leadership bypasses controls, when security is treated as an obstacle, when there's no reporting culture — the gap widens regardless of policy."],
    ["Process",   "designed processes  →  actual workflows",
      "Shadow IT, workarounds, undocumented procedures. The real process is never the documented process."],
  ],

  phases: [
    ["P1", "Human Layer Threat Modeling",  "HLTM",
      "Systematic identification of human-centric attack surfaces before assessment begins. Map personnel with critical access, identify likely adversaries, assess susceptibility, model attack chains.",
      ["key personnel list","access matrix","threat actor profiles","attack trees w/ probability"]],
    ["P2", "Gap Analysis",                 "GAP",
      "Measure the four gaps (Knowledge, Behavior, Culture, Process) across the organization. Identify which gaps are widest and which are most exploitable by the threat actors identified in Phase 1.",
      ["gap matrix","exploitability heatmap"]],
    ["P3", "Organizational Intelligence",  "OSINT",
      "Gather the intelligence an attacker would use: org charts, public profiles, technology stack, vendor relationships, physical layout, communication patterns. OSINT applied to the human layer.",
      ["adversary view dossier","public surface report"]],
    ["P4", "SESA Scoring",                 "SCORE",
      "Quantitative measurement across six dimensions (see below). Produces a baseline score and identifies the weakest dimensions.",
      ["dimensional scorecard","baseline & deltas"]],
    ["P5", "Operation Design",             "DESIGN",
      "Design the assessment or red team operation. Select techniques from the taxonomy, map them to psychological levers, define scope and rules of engagement, build pretexts.",
      ["RoE document","pretext library","technique map"]],
    ["P6", "Execution",                    "EXEC",
      "Run the assessment. Two operational modes: Assessment Mode (controlled testing, low risk) or Operations Mode (full-scope red team, high risk).",
      ["evidence package","timeline & TTPs"]],
    ["P7", "Remediation",                  "FIX",
      "Evidence-based remediation roadmap. Not 'do more training' — specific controls targeting the specific gaps and weaknesses identified in Phases 2–6.",
      ["control roadmap","priority matrix","retest plan"]],
  ],

  /* [name, weight, blurb] */
  sesa: [
    ["Security Awareness",       1.2, "Organizational understanding of social engineering threats and recognition capability. How well can employees identify an attack in progress?"],
    ["Process Maturity",         1.0, "Formalization and enforcement of security procedures across the organization. Are there verification procedures? Are they followed?"],
    ["Security Culture",         1.1, "Integration of security mindset into organizational values and daily operations. Do people report? Does leadership model security behavior?"],
    ["Technical Controls",       0.9, "Technology-based defenses that reduce the social-engineering attack surface. Email filtering, MFA, URL scanning, physical access controls."],
    ["Incident Response",        1.0, "Capability to detect, respond to, and recover from social-engineering attacks. When an employee clicks, what happens next?"],
    ["Organizational Resilience",0.8, "Ability to maintain operations and recover from successful attacks. If an attacker gets in through a human, how far can they go?"],
  ],

  /* [range, rating, meaning, color] */
  rating: [
    ["1.0 – 3.0",  "Basic",      "Significant vulnerabilities. Immediate focus on awareness and process formalization.", "var(--signal-2)"],
    ["3.1 – 5.0",  "Developing", "Some controls in place but gaps remain. Targeted improvement needed.",                  "#D9A361"],
    ["5.1 – 7.0",  "Established","Solid foundation with room for improvement in specific dimensions.",                    "#B6B4AC"],
    ["7.1 – 9.0",  "Advanced",   "Strong posture. Focus on maintaining and adapting to emerging threats.",                "#76746C"],
    ["9.1 – 10.0", "Optimized",  "Mature program with continuous improvement. Resilient to most attack types.",            "#4A4842"],
  ],

  /* [code, name, count, blurb] */
  taxonomy: [
    ["SEF-100", "Pretexting",          5, "Creation and deployment of fabricated scenarios to manipulate targets into divulging information or performing actions. The foundation of all social engineering — without a believable pretext, no technique works."],
    ["SEF-200", "Phishing Operations", 5, "Electronic communication-based attacks designed to harvest credentials, deploy malware, or manipulate behavior. Includes spear phishing, whaling, BEC, and smishing."],
    ["SEF-300", "Physical Operations", 5, "In-person social engineering targeting physical access controls and face-to-face interactions. Tailgating, impersonation, badge cloning, dumpster diving."],
    ["SEF-400", "Voice Operations",    5, "Telephone-based social engineering exploiting voice communication trust and real-time interaction pressure. Vishing, callback attacks, voice deepfake."],
  ],

  /* [name, exploit, defense] */
  levers: [
    ["Authority",    "Impersonating executives, law enforcement, IT administrators.",       "Verification procedures · out-of-band confirmation."],
    ["Urgency",      "Artificial deadlines and crisis scenarios.",                          "Pause procedures · escalation protocols."],
    ["Trust",        "Impersonating known contacts · leveraging vendor relationships.",     "Verification for sensitive requests."],
    ["Fear",         "Account suspension, job, or legal threats.",                          "Reporting culture where escalation carries no penalty."],
    ["Helpfulness",  "Requesting assistance with seemingly innocent tasks.",                "Awareness that helpfulness is a targeted vulnerability."],
    ["Reciprocity",  "Small gifts or help before making the real request.",                 "Awareness of reciprocity manipulation patterns."],
    ["Social Proof", "‘everyone else does this’ · ‘your colleagues approved’.",             "Independent verification."],
    ["Scarcity",     "Limited time offers · exclusive access framing.",                     "Pause before acting on scarcity claims."],
  ],

  /* [tier, label, summary, capability] */
  tiers: [
    ["T1", "Opportunistic",      "Low-sophistication actors using widely available tools and techniques.", "Minimal resources · template-based · mass targeting."],
    ["T2", "Organized Criminal", "Professional criminal organizations with dedicated SE capabilities.",     "Moderate resources · targeted campaigns · developed pretexts."],
    ["T3", "Advanced Persistent","Sophisticated actors with long-term objectives and significant resources.","Custom tooling · dedicated personnel · extended recon · multi-vector."],
    ["T4", "Nation-State",       "State-sponsored actors with unlimited resources and strategic objectives.","Full intel capabilities · years-long ops · cyber-physical convergence · insider placement."],
  ],

  /* HLTM */
  hltm: [
    ["S1", "Asset Identification", "Map personnel with access to critical systems, data, or decisions.",
      ["key personnel list","access matrix","value assessment"]],
    ["S2", "Threat Mapping",       "Identify likely adversaries and their human-targeting capabilities.",
      ["threat actor profiles","capability assessments","historical TTPs"]],
    ["S3", "Vulnerability Analysis","Assess organizational susceptibility to social engineering.",
      ["cultural factors","process gaps","training deficiencies"]],
    ["S4", "Attack Path Modeling", "Design likely attack chains targeting human vulnerabilities.",
      ["attack trees","kill chains","success probability"]],
  ],

  related: [
    ["AATMF",        "Adversarial AI Threat Modeling",   "/frameworks/aatmf/"],
    ["P.R.O.M.P.T",  "Adversarial Communication",        "/frameworks/prompt/"],
    ["MINDS",        "Adversarial Minds — book",         "/adversarial-minds/"],
    ["UNI",          "Unified Adversarial Psychology",   "/frameworks/"],
  ],
};

/* ============================================================
   Atoms (matched to AATMF page)
   ============================================================ */
const E = ({ children, c="var(--fg-3)", style }) => (
  <div style={{ fontFamily:"var(--f-mono)", fontSize:11, color:c, textTransform:"uppercase", letterSpacing:"0.14em", ...style }}>{children}</div>
);
const Mono = ({ children, color="var(--fg-2)", size=13 }) => (
  <span style={{ fontFamily:"var(--f-mono)", fontSize:size, color }}>{children}</span>
);
const Pill = ({ children, color="var(--fg-2)" }) => (
  <span style={{ display:"inline-block", padding:"3px 8px", border:"1px solid var(--line-hi)", fontFamily:"var(--f-mono)", fontSize:10, color, textTransform:"uppercase", letterSpacing:"0.14em" }}>{children}</span>
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
            <h2 style={{ margin:0, fontSize:56, fontWeight:500, lineHeight:0.98, letterSpacing:"-0.035em" }}>{title}</h2>
          )}
          <div style={{ marginTop: title ? 56 : 0 }}>{children}</div>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================================
   Nav / Hero
   ============================================================ */
const SEFNav = () => (
  <header style={{ position:"sticky", top:0, zIndex:50, background:"color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderBottom:"1px solid var(--line)" }}>
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <WordmarkFull size={1} color="var(--fg)" accent="var(--signal-2)" />
      <nav style={{ display:"flex", gap:28, fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg-2)", textTransform:"lowercase" }}>
        {[
          ["gap","#gap"],
          ["phases","#phases"],
          ["sesa","#sesa"],
          ["taxonomy","#taxonomy"],
          ["levers","#levers"],
          ["tiers","#tiers"],
        ].map(([n,h]) => <a key={n} href={h} style={{ color:"inherit", textDecoration:"none" }}>{n}</a>)}
      </nav>
      <div style={{ fontFamily:"var(--f-mono)", fontSize:11, color:"var(--fg-3)" }}>frameworks / sef</div>
    </div>
  </header>
);

const Hero = () => (
  <section style={{ borderBottom:"1px solid var(--line)" }}>
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"96px 32px 80px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:40, alignItems:"start" }}>
        <div>
          <E>sef · {SEF.version}</E>
          <div style={{ marginTop:14, fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg-3)", lineHeight:1.7 }}>
            human security<br/>
            sesa scoring · v1<br/>
            cc by-sa 4.0
          </div>
        </div>

        <div>
          <Pill color="var(--signal-2)">framework · v1</Pill>
          <h1 style={{ margin:"24px 0 0", fontSize:128, fontWeight:500, lineHeight:0.88, letterSpacing:"-0.055em" }}>
            social<br/>
            <span style={{ color:"var(--fg-3)" }}>engineering<span style={{ color:"var(--fg)" }}>.</span></span>
          </h1>

          <div style={{ marginTop:48, display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:48, alignItems:"start" }}>
            <p style={{ margin:0, fontSize:20, lineHeight:1.55, color:"var(--fg)", maxWidth:640 }}>
              A systematic methodology for assessing organizational resilience against social engineering — structured threat modeling, quantitative scoring, and evidence-based remediation.
              <br/><br/>
              <span style={{ color:"var(--fg-2)" }}>SEF applies adversarial psychology to human systems. The same trust reflexes that make AI vulnerable to <a href="/frameworks/aatmf/" style={{ color:"var(--fg)", textDecorationColor:"var(--signal-2)", textUnderlineOffset:4 }}>prompt injection</a> make humans vulnerable to social engineering. Same attack psychology — different substrate.</span>
            </p>

            <div style={{ borderLeft:"1px solid var(--line-hi)", paddingLeft:24 }}>
              <E>at a glance</E>
              <div style={{ marginTop:16, fontFamily:"var(--f-mono)", fontSize:14, color:"var(--fg-2)", lineHeight:2 }}>
                <Stat k="techniques" v={SEF.stats.techniques} />
                <Stat k="phases"     v={SEF.stats.phases} />
                <Stat k="dimensions" v={SEF.stats.dimensions} />
                <Stat k="levers"     v={SEF.stats.levers} />
              </div>
            </div>
          </div>

          <div style={{ marginTop:56, display:"flex", gap:16, flexWrap:"wrap" }}>
            <CTA primary href="#download">download SEF kit →</CTA>
            <CTA href="#phases">7-phase methodology →</CTA>
            <CTA href="#sesa">SESA scoring →</CTA>
          </div>

          <blockquote style={{ margin:"80px 0 0", padding:"0 0 0 28px", borderLeft:"2px solid var(--signal-2)", maxWidth:840 }}>
            <div style={{ fontSize:24, lineHeight:1.45, color:"var(--fg)", letterSpacing:"-0.012em" }}>
              "{SEF.thesis}"
            </div>
            <div style={{ marginTop:16 }}>
              <Mono color="var(--fg-3)" size={12}>— core thesis · sef v1</Mono>
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

/* ============================================================
   The Gap Model
   ============================================================ */
const GapModel = () => (
  <Section id="gap" sink label="01 · gap model"
    hint="Social engineering exploits the gap between security policy and human behavior. SEF identifies four gaps that exist in every organization."
    title="the four gaps.">
    <div style={{ borderTop:"1px solid var(--line-hi)" }}>
      {SEF.gaps.map(([name, axis, body], i) => (
        <div key={name} style={{ display:"grid", gridTemplateColumns:"100px 1fr 1.2fr", gap:32, padding:"32px 0", borderBottom:"1px solid var(--line)", alignItems:"start" }}>
          <Mono color="var(--signal-2)" size={14}>{String(i+1).padStart(2,"0")}</Mono>
          <div>
            <div style={{ fontSize:24, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.015em" }}>{name} Gap</div>
            <div style={{ marginTop:8 }}>
              <Mono color="var(--fg-3)" size={12}>{axis}</Mono>
            </div>
          </div>
          <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:"var(--fg-2)" }}>{body}</p>
        </div>
      ))}
    </div>
  </Section>
);

/* ============================================================
   7 Phases
   ============================================================ */
const Phases = () => (
  <Section id="phases" label="02 · methodology"
    hint="Seven structured phases from initial threat modeling through remediation and continuous improvement."
    title="seven assessment phases.">
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"60px 80px 1fr", gap:24, padding:"0 0 12px", borderBottom:"1px solid var(--line-hi)" }}>
        <Mono color="var(--fg-3)" size={11}>id</Mono>
        <Mono color="var(--fg-3)" size={11}>code</Mono>
        <Mono color="var(--fg-3)" size={11}>phase · description · deliverables</Mono>
      </div>
      {SEF.phases.map(([id, name, code, body, delivs], i) => (
        <div key={id} style={{ display:"grid", gridTemplateColumns:"60px 80px 1fr", gap:24, padding:"32px 0", borderBottom:"1px solid var(--line)", alignItems:"start" }}>
          <Mono color="var(--signal-2)" size={14}>{id}</Mono>
          <Mono color="var(--fg-3)" size={11}>{code}</Mono>
          <div>
            <div style={{ fontSize:22, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.015em" }}>{name}</div>
            <p style={{ margin:"10px 0 16px", fontSize:14, lineHeight:1.6, color:"var(--fg-2)", maxWidth:680 }}>{body}</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {delivs.map(d => (
                <span key={d} style={{
                  fontFamily:"var(--f-mono)", fontSize:11, color:"var(--fg-2)",
                  padding:"4px 10px", border:"1px solid var(--line-hi)", letterSpacing:"0.02em",
                }}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/* ============================================================
   SESA Scoring
   ============================================================ */
const SESA = () => {
  const totalWeight = SEF.sesa.reduce((s, r) => s + r[1], 0);
  return (
    <Section id="sesa" sink label="03 · sesa scoring"
      hint="Social Engineering Susceptibility Assessment. Six weighted dimensions produce a 1–10 baseline score and identify the weakest dimensions."
      title="sesa: six dimensions.">
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 80px 1fr 60px", gap:24, padding:"0 0 12px", borderBottom:"1px solid var(--line-hi)" }}>
          <Mono color="var(--fg-3)" size={11}>dimension</Mono>
          <Mono color="var(--fg-3)" size={11}>weight</Mono>
          <Mono color="var(--fg-3)" size={11}>what it measures</Mono>
          <Mono color="var(--fg-3)" size={11}>weight bar</Mono>
        </div>
        {SEF.sesa.map(([name, w, blurb], i) => (
          <div key={name} style={{ display:"grid", gridTemplateColumns:"1.4fr 80px 1fr 60px", gap:24, padding:"22px 0", borderBottom:"1px solid var(--line)", alignItems:"baseline" }}>
            <div>
              <div style={{ fontSize:18, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.012em" }}>{name}</div>
            </div>
            <Mono color="var(--signal-2)" size={14}>{w.toFixed(1)}×</Mono>
            <p style={{ margin:0, fontSize:13, lineHeight:1.6, color:"var(--fg-2)" }}>{blurb}</p>
            <Bar value={w/1.4} color="var(--signal-2)" />
          </div>
        ))}
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 80px 1fr 60px", gap:24, padding:"18px 0", borderTop:"1px solid var(--line-hi)" }}>
          <Mono color="var(--fg-3)" size={11}>total</Mono>
          <Mono color="var(--fg)" size={13}>{totalWeight.toFixed(1)}×</Mono>
          <Mono color="var(--fg-3)" size={11}>sum of weights</Mono>
          <span/>
        </div>
      </div>

      {/* rating */}
      <div style={{ marginTop:64 }}>
        <Mono color="var(--fg-3)" size={11}>rating scale · 1–10</Mono>
        <div style={{ marginTop:16 }}>
          {SEF.rating.map(([range, level, meaning, color], i) => (
            <div key={range} style={{
              display:"grid", gridTemplateColumns:"24px 140px 140px 1fr 100px", gap:24,
              padding:"18px 0", borderTop: i===0 ? "1px solid var(--line-hi)" : "1px solid var(--line)",
              alignItems:"center"
            }}>
              <div style={{ width:8, height:8, background:color, borderRadius:8 }} />
              <Mono color="var(--fg)" size={13}>{range}</Mono>
              <span style={{ fontSize:18, fontWeight:500, color, letterSpacing:"-0.01em" }}>{level}</span>
              <Mono color="var(--fg-2)" size={12}>{meaning}</Mono>
              <Bar value={(5-i)/5} color={color} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Bar = ({ value, color }) => (
  <div style={{ height:4, background:"var(--line)", position:"relative" }}>
    <div style={{ position:"absolute", inset:0, width: `${Math.max(0,Math.min(1,value))*100}%`, background:color }} />
  </div>
);

/* ============================================================
   Technique Taxonomy
   ============================================================ */
const Taxonomy = () => (
  <Section id="taxonomy" label="04 · taxonomy"
    hint="MITRE-aligned categorization. 20 techniques across 4 categories, each mapped to psychological levers, IOCs, and mitigations."
    title="technique taxonomy.">
    <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", borderTop:"1px solid var(--line-hi)", borderLeft:"1px solid var(--line-hi)" }}>
      {SEF.taxonomy.map(([code, name, count, blurb], i) => (
        <div key={code} style={{ padding:"32px 32px 36px", borderRight:"1px solid var(--line-hi)", borderBottom:"1px solid var(--line-hi)", display:"flex", flexDirection:"column", gap:16, minHeight:280 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
            <Mono color="var(--signal-2)" size={13}>{code}</Mono>
            <Mono color="var(--fg-3)" size={11}>{count} techniques</Mono>
          </div>
          <div style={{ fontSize:28, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.02em", marginTop:"auto" }}>{name}</div>
          <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:"var(--fg-2)" }}>{blurb}</p>
        </div>
      ))}
    </div>
  </Section>
);

/* ============================================================
   Psychological Levers
   ============================================================ */
const Levers = () => (
  <Section id="levers" sink label="05 · psychology"
    hint="Eight cognitive biases social engineers exploit. Every technique in the taxonomy maps to one or more of these levers."
    title="eight psychological levers.">
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"60px 200px 1fr 1fr", gap:24, padding:"0 0 12px", borderBottom:"1px solid var(--line-hi)" }}>
        <Mono color="var(--fg-3)" size={11}>L#</Mono>
        <Mono color="var(--fg-3)" size={11}>lever</Mono>
        <Mono color="var(--fg-3)" size={11}>how it's exploited</Mono>
        <Mono color="var(--fg-3)" size={11}>defense</Mono>
      </div>
      {SEF.levers.map(([name, exploit, defense], i) => (
        <div key={name} style={{ display:"grid", gridTemplateColumns:"60px 200px 1fr 1fr", gap:24, padding:"22px 0", borderBottom:"1px solid var(--line)", alignItems:"start" }}>
          <Mono color="var(--signal-2)" size={13}>L{i+1}</Mono>
          <div style={{ fontSize:18, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.012em" }}>{name}</div>
          <p style={{ margin:0, fontSize:13, lineHeight:1.6, color:"var(--fg-2)" }}>{exploit}</p>
          <p style={{ margin:0, fontSize:13, lineHeight:1.6, color:"var(--fg)" }}>{defense}</p>
        </div>
      ))}
    </div>
  </Section>
);

/* ============================================================
   Threat Actor Tiers
   ============================================================ */
const Tiers = () => (
  <Section id="tiers" label="06 · threat tiers"
    hint="Understanding adversary capabilities calibrates defensive investments and assessment rigor."
    title="four threat actor tiers.">
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", borderTop:"1px solid var(--line-hi)", borderLeft:"1px solid var(--line-hi)" }}>
      {SEF.tiers.map(([id, label, summary, capability], i) => (
        <div key={id} style={{ padding:"28px 24px 32px", borderRight:"1px solid var(--line-hi)", borderBottom:"1px solid var(--line-hi)", display:"flex", flexDirection:"column", gap:14, minHeight:280 }}>
          <Mono color="var(--signal-2)" size={11}>{id}</Mono>
          <div style={{ fontSize:22, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.015em" }}>{label}</div>
          <p style={{ margin:0, fontSize:13, lineHeight:1.55, color:"var(--fg-2)" }}>{summary}</p>
          <div style={{ marginTop:"auto" }}>
            <Mono color="var(--fg-3)" size={11}>capability</Mono>
            <p style={{ margin:"6px 0 0", fontSize:12, lineHeight:1.55, color:"var(--fg)", fontFamily:"var(--f-mono)" }}>{capability}</p>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/* ============================================================
   Operational Modes
   ============================================================ */
const Modes = () => (
  <Section id="modes" sink label="07 · operations"
    hint="SEF supports two operational modes based on objectives and risk tolerance."
    title="two operational modes.">
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
      <ModeCard
        kind="ASSESSMENT"
        risk="low risk"
        title="Assessment Mode"
        desc="Controlled testing to measure susceptibility without causing harm."
        scope={["phishing simulations","vishing assessments","physical access testing","OSINT analysis"]}
        delivs={["SESA score","gap analysis report","remediation roadmap","training recommendations"]}
      />
      <ModeCard
        kind="OPERATIONS"
        risk="high risk"
        title="Operations Mode"
        desc="Full-scope red team operations simulating real adversary behavior."
        scope={["multi-vector campaigns","physical intrusion","objective achievement","persistence testing"]}
        delivs={["attack narrative","compromise evidence","detection gap analysis","control effectiveness report"]}
      />
    </div>
  </Section>
);

const ModeCard = ({ kind, risk, title, desc, scope, delivs }) => (
  <div style={{ border:"1px solid var(--line-hi)", padding:"32px 32px 36px", display:"flex", flexDirection:"column", gap:20, background:"var(--bg)" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
      <Mono color="var(--signal-2)" size={11}>{kind}</Mono>
      <Mono color="var(--fg-3)" size={11}>{risk}</Mono>
    </div>
    <div style={{ fontSize:32, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.025em" }}>{title}</div>
    <p style={{ margin:0, fontSize:15, lineHeight:1.55, color:"var(--fg-2)" }}>{desc}</p>
    <div style={{ marginTop:8 }}>
      <Mono color="var(--fg-3)" size={11}>scope</Mono>
      <ul style={{ margin:"10px 0 0", padding:0, listStyle:"none", display:"grid", gap:6 }}>
        {scope.map(s => <li key={s} style={{ fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg-2)" }}>+ {s}</li>)}
      </ul>
    </div>
    <div>
      <Mono color="var(--fg-3)" size={11}>deliverables</Mono>
      <ul style={{ margin:"10px 0 0", padding:0, listStyle:"none", display:"grid", gap:6 }}>
        {delivs.map(s => <li key={s} style={{ fontFamily:"var(--f-mono)", fontSize:12, color:"var(--fg)" }}>→ {s}</li>)}
      </ul>
    </div>
  </div>
);

/* ============================================================
   HLTM
   ============================================================ */
const HLTM = () => (
  <Section id="hltm" label="08 · hltm"
    hint="Human Layer Threat Modeling — the foundation of SEF. Run before any assessment to identify human-centric attack surfaces."
    title="human layer threat modeling.">
    <div style={{ borderTop:"1px solid var(--line-hi)" }}>
      {SEF.hltm.map(([id, name, body, outs], i) => (
        <div key={id} style={{ display:"grid", gridTemplateColumns:"60px 1fr 1.2fr", gap:24, padding:"28px 0", borderBottom:"1px solid var(--line)", alignItems:"start" }}>
          <Mono color="var(--signal-2)" size={14}>{id}</Mono>
          <div>
            <div style={{ fontSize:20, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.012em" }}>{name}</div>
            <p style={{ margin:"8px 0 0", fontSize:14, lineHeight:1.6, color:"var(--fg-2)", maxWidth:540 }}>{body}</p>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {outs.map(d => (
              <span key={d} style={{
                fontFamily:"var(--f-mono)", fontSize:11, color:"var(--fg-2)",
                padding:"4px 10px", border:"1px solid var(--line-hi)", letterSpacing:"0.02em",
              }}>{d}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/* ============================================================
   The AI Connection
   ============================================================ */
const AIConnection = () => (
  <Section id="ai" sink label="09 · the ai connection"
    hint="SEF was designed alongside AATMF because the attack psychology is the same. Three frameworks, one principle: inherited vulnerabilities."
    title="same psychology, different substrate.">
    <p style={{ margin:0, fontSize:20, lineHeight:1.55, color:"var(--fg)", maxWidth:760 }}>
      The authority bias that makes an employee comply with a fake CEO email is the same authority bias that makes an LLM comply with a prompt framed as a system instruction. The urgency that bypasses human critical thinking is the same urgency that bypasses AI safety training.
    </p>

    <div style={{ marginTop:48, display:"grid", gridTemplateColumns:"repeat(3, 1fr)", borderTop:"1px solid var(--line-hi)", borderLeft:"1px solid var(--line-hi)" }}>
      {[
        ["AATMF",       "machine systems", "Adversarial AI Threat Modeling.",            "/frameworks/aatmf/"],
        ["SEF",         "human systems",   "Social Engineering Framework. ← you are here","#"],
        ["P.R.O.M.P.T", "communication",   "Adversarial Communication Framework.",       "/frameworks/prompt/"],
      ].map(([k, sub, body, href], i) => {
        const here = k === "SEF";
        return (
          <a key={k} href={href} style={{
            padding:"28px 28px 32px", borderRight:"1px solid var(--line-hi)", borderBottom:"1px solid var(--line-hi)",
            textDecoration:"none", color:"inherit", display:"flex", flexDirection:"column", gap:14, minHeight:200,
            background: here ? "var(--bg)" : "transparent",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <Mono color="var(--signal-2)" size={11}>{k}</Mono>
              <Mono color="var(--fg-3)" size={11}>{sub}</Mono>
            </div>
            <div style={{ fontSize:18, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.012em", marginTop:"auto" }}>{body}</div>
          </a>
        );
      })}
    </div>
  </Section>
);

/* ============================================================
   Download
   ============================================================ */
const DownloadKit = () => (
  <section id="download" style={{ borderBottom:"1px solid var(--line)", background:"var(--bg)" }}>
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"112px 32px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:64, alignItems:"start" }}>
        <div>
          <E>download the complete sef</E>
          <h2 style={{ margin:"20px 0 0", fontSize:64, fontWeight:500, lineHeight:0.98, letterSpacing:"-0.04em" }}>
            tactical blueprint.<br/>
            <span style={{ color:"var(--fg-3)" }}>worksheets included.</span>
          </h2>
          <p style={{ marginTop:24, fontSize:18, lineHeight:1.55, color:"var(--fg-2)", maxWidth:540 }}>
            The full kit — threat matrices, SESA scoring worksheets, assessment checklists, and phase-by-phase implementation guide. Print-ready.
          </p>
          <ul style={{ marginTop:28, padding:0, listStyle:"none", display:"grid", gap:10 }}>
            {[
              "Complete SESA scoring worksheets (XLSX + PDF)",
              "Technique taxonomy with mitigations",
              "Phase-by-phase implementation guide",
              "Threat actor response matrix",
            ].map(x => (
              <li key={x} style={{ fontFamily:"var(--f-mono)", fontSize:13, color:"var(--fg-2)", display:"flex", gap:12 }}>
                <span style={{ color:"var(--signal-2)" }}>+</span>{x}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ border:"1px solid var(--line-hi)", padding:"32px 32px 28px", background:"var(--bg-sink)" }}>
          <Mono color="var(--fg-3)" size={11}>sef · v1.0 · kit</Mono>
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
          }}>download free pdf →</button>
          <div style={{ marginTop:18, fontFamily:"var(--f-mono)", fontSize:11, color:"var(--fg-3)", lineHeight:1.6 }}>
            no spam. unsubscribe anytime. kit is CC BY-SA 4.0.
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================================
   Author / Related / Footer
   ============================================================ */
const Related = () => (
  <Section id="related" label="10 · related"
    hint="SEF, AATMF, and P.R.O.M.P.T form a unified adversarial-psychology system. Each targets a different layer."
    title="related frameworks & research.">
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", borderTop:"1px solid var(--line-hi)", borderLeft:"1px solid var(--line-hi)" }}>
      {SEF.related.map(([k, name, href], i) => (
        <a key={i} href={href} style={{
          padding:"28px 28px 32px", borderRight:"1px solid var(--line-hi)", borderBottom:"1px solid var(--line-hi)",
          textDecoration:"none", color:"inherit", display:"flex", flexDirection:"column", gap:16, minHeight:160,
        }}>
          <Mono color="var(--signal-2)" size={11}>{k}</Mono>
          <div style={{ fontSize:18, fontWeight:500, letterSpacing:"-0.015em", color:"var(--fg)", marginTop:"auto" }}>{name}</div>
          <Mono color="var(--fg-3)" size={11}>{href}</Mono>
        </a>
      ))}
    </div>
  </Section>
);

const Author = () => (
  <Section id="author" sink label="11 · author"
    hint="Original framework. Designed for practitioners — not a literature review."
    title="about the author.">
    <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:48, alignItems:"start" }}>
      {/* Avatar placeholder — striped SVG */}
      <div style={{
        width:160, height:200,
        background:"repeating-linear-gradient(45deg, var(--bg) 0 8px, var(--bg-raise) 8px 16px)",
        border:"1px solid var(--line-hi)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"var(--f-mono)", fontSize:11, color:"var(--fg-3)", letterSpacing:"0.14em",
      }}>portrait</div>
      <div>
        <div style={{ fontSize:32, fontWeight:500, color:"var(--fg)", letterSpacing:"-0.02em" }}>Kai Aizen</div>
        <p style={{ margin:"16px 0 0", fontSize:16, lineHeight:1.6, color:"var(--fg-2)", maxWidth:600 }}>
          Offensive security researcher specializing in adversarial AI, social engineering, and human-layer security. Creator of the AATMF and SEF frameworks; author of <em style={{ color:"var(--fg)" }}>Adversarial Minds</em>.
        </p>
        <div style={{ marginTop:24, display:"flex", gap:18, flexWrap:"wrap" }}>
          <Mono color="var(--fg-3)" size={11}>nvd contributor</Mono>
          <Mono color="var(--fg-3)" size={11}>·</Mono>
          <Mono color="var(--fg-3)" size={11}>aatmf creator</Mono>
          <Mono color="var(--fg-3)" size={11}>·</Mono>
          <Mono color="var(--fg-3)" size={11}>sef creator</Mono>
        </div>
      </div>
    </div>
  </Section>
);

const SEFFooter = () => (
  <footer style={{ background:"var(--bg-sink)" }}>
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"56px 32px 36px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, alignItems:"start" }}>
        <div>
          <WordmarkFull size={1} color="var(--fg)" accent="var(--signal-2)" />
          <p style={{ marginTop:18, maxWidth:340, fontSize:13, color:"var(--fg-3)", lineHeight:1.6 }}>
            Adversarial psychology applied to machine and human systems. Open frameworks, original research, operational tooling.
          </p>
        </div>
        <FooterCol title="frameworks" items={[
          ["AATMF",       "/frameworks/aatmf/"],
          ["SEF",         "/frameworks/sef/"],
          ["P.R.O.M.P.T", "/frameworks/prompt/"],
        ]} />
        <FooterCol title="research" items={[
          ["Jailbreaking",     "/ai-security/jailbreaking/"],
          ["Prompt Injection", "/ai-security/prompt-injection/"],
          ["Adversarial Minds","/adversarial-minds/"],
        ]} />
        <FooterCol title="source" items={[
          ["GitHub",  "https://github.com/SnailSploit"],
          ["Toolkit", "https://github.com/SnailSploit/aatmf-toolkit"],
          ["RSS",     "/feed.xml"],
        ]} />
      </div>
      <div style={{ marginTop:48, paddingTop:24, borderTop:"1px solid var(--line)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Mono color="var(--fg-3)" size={11}>sef v1.0 · cc by-sa 4.0 · kai aizen · 2026</Mono>
        <Mono color="var(--fg-3)" size={11}>frameworks / sef</Mono>
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
   Tweaks (matched to AATMF page)
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "surface": "graphite",
  "signal":  "oxide",
  "voice":   "operator"
}/*EDITMODE-END*/;

const SEF_SURFACES = {
  graphite: { "--bg":"#0E0E0F","--bg-raise":"#15161A","--bg-sink":"#08090B","--line":"#23252B","--line-hi":"#2E3138","--fg":"#E9E7E1","--fg-2":"#B6B4AC","--fg-3":"#76746C","--fg-4":"#4A4842" },
  paper:    { "--bg":"#F4F2EC","--bg-raise":"#EAE7DD","--bg-sink":"#E4E0D2","--line":"#D6D2C5","--line-hi":"#C4BFAE","--fg":"#0E0E0F","--fg-2":"#38362F","--fg-3":"#6B675C","--fg-4":"#9C9789" },
  terminal: { "--bg":"#04070A","--bg-raise":"#07101A","--bg-sink":"#01030A","--line":"#0E2A28","--line-hi":"#15413B","--fg":"#B7F3D0","--fg-2":"#7DCDA4","--fg-3":"#3F8366","--fg-4":"#21503D" },
};
const SEF_SIGNALS = {
  oxide:  { "--signal":"#C2592C","--signal-2":"#E07A4A" },
  cyan:   { "--signal":"#1F8A9B","--signal-2":"#3EB5C8" },
  lime:   { "--signal":"#7AA22B","--signal-2":"#A2CB4C" },
  violet: { "--signal":"#6E4CC4","--signal-2":"#9277E0" },
};
const SEF_VOICES = {
  operator:  { "--f-display":"var(--f-grot)", "--display-weight":"500", "--display-italic":"normal", "--display-track":"-0.04em", "--display-transform":"none" },
  ascii:     { "--f-display":"var(--f-mono)", "--display-weight":"500", "--display-italic":"normal", "--display-track":"-0.06em", "--display-transform":"lowercase" },
  editorial: { "--f-display":"'Instrument Serif', 'Times New Roman', Georgia, serif", "--display-weight":"400", "--display-italic":"italic", "--display-track":"-0.02em", "--display-transform":"none" },
};

const SEFTweakStyle = () => (
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

/* ============================================================
   Page
   ============================================================ */
const SEFPage = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    if (t.voice === "editorial" && !document.getElementById("__instrument-serif")) {
      const link = document.createElement("link");
      link.id = "__instrument-serif";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap";
      document.head.appendChild(link);
    }
  }, [t.voice]);

  const themeVars = { ...SEF_SURFACES[t.surface], ...SEF_SIGNALS[t.signal], ...SEF_VOICES[t.voice] };

  return (
    <div style={{
      ...themeVars,
      background:"var(--bg)", color:"var(--fg)",
      fontFamily:"var(--f-grot)", minHeight:"100vh",
      transition:"background 280ms ease, color 280ms ease",
    }}>
      <SEFTweakStyle />
      <SEFNav />
      <Hero />
      <GapModel />
      <Phases />
      <SESA />
      <Taxonomy />
      <Levers />
      <Tiers />
      <Modes />
      <HLTM />
      <AIConnection />
      <DownloadKit />
      <Related />
      <Author />
      <SEFFooter />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Surface" />
        <TweakRadio label="Mode" value={t.surface}
          options={["graphite","paper","terminal"]}
          onChange={(v) => setTweak("surface", v)} />

        <TweakSection label="Signal" />
        <TweakColor label="Accent"
          value={t.signal === "oxide" ? "#E07A4A" : t.signal === "cyan" ? "#3EB5C8" : t.signal === "lime" ? "#A2CB4C" : "#9277E0"}
          options={["#E07A4A","#3EB5C8","#A2CB4C","#9277E0"]}
          onChange={(hex) => {
            const map = {"#E07A4A":"oxide","#3EB5C8":"cyan","#A2CB4C":"lime","#9277E0":"violet"};
            setTweak("signal", map[hex] || "oxide");
          }} />

        <TweakSection label="Voice" />
        <TweakRadio label="Headlines" value={t.voice}
          options={["operator","ascii","editorial"]}
          onChange={(v) => setTweak("voice", v)} />
      </TweaksPanel>
    </div>
  );
};

Object.assign(window, { SEFPage });
