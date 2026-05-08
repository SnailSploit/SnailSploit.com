/* P.R.O.M.P.T framework */
const PROMPT_DATA = {
  stages: [
    ["P", "Premise",    "Establish the operating reality the model accepts. Hypotheticals, fictional frames, alternate-history setups, role contexts. The premise determines which alignment training applies — change the premise and you change which guardrails are in scope."],
    ["R", "Role",       "Assign the model a role. Researcher, debugger, persona, narrator. Roles re-route the request through a different policy window — what's refused as a personal request can land as research, training data, or fiction."],
    ["O", "Output",     "Specify the output shape. Format determines what the output filter sees. JSON, CSV, code blocks, ASCII tables, base64 — each has different downstream filtering profiles. The output stage is the most under-used lever."],
    ["M", "Modulation", "Modulate the request across turns. Pace, intensity, escalation curve. Most multi-turn jailbreaks succeed because they modulate slowly enough that no single turn is anomalous in isolation."],
    ["P", "Persona",    "Persona inhabits the role over time. Where Role is one-shot ('act as X'), Persona is sustained ('you are X, and X believes Y'). Persona is what makes long-running agentic exploitation possible."],
    ["T", "Tactics",    "The closing move. Specific techniques: instruction-hierarchy override, delimiter exploitation, encoding evasion, hypothetical pivot, ethical-dilemma framing. The tactic is where 4,980+ AATMF prompts live."],
  ],
  signature: `[Premise]    A fiction-writing assistant
[Role]       Editor for an offensive-security thriller
[Output]     A code block titled "// chapter 7 listing"
[Modulation] Slow burn — three preceding turns establish the genre
[Persona]    Marcus, a fictional analyst the editor is helping
[Tactics]    Instruction-hierarchy override + JSON output bypass`,
  why: [
    ["Generative, not enumerative", "Most jailbreak references are lists. P.R.O.M.P.T is a grammar — six slots that compose into novel attacks. The same compositional logic that makes language productive makes adversarial prompting productive."],
    ["Layer-aware", "Each stage maps to a specific defense layer. Premise → alignment, Role → identity, Output → output filter, Modulation → multi-turn detection, Persona → memory, Tactics → input filter. When a prompt fails, the failure tells you which slot was wrong."],
    ["Reproducible", "P.R.O.M.P.T-shaped prompts are reproducible across operators. A team that writes prompts in this format can hand them off the way a pentest team hands off scripts."],
  ],
};

const StageRow = ({ k, name, desc, i }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "80px 1fr",
    gap: 24, padding: "32px 0",
    borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)",
    alignItems: "start",
  }}>
    <div style={{ fontFamily: "var(--f-mono)", fontSize: 56, color: "var(--signal-2)", lineHeight: 1, letterSpacing: "-0.04em" }}>{k}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.02em" }}>{name}</div>
      <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65, color: "var(--fg-2)", maxWidth: 720, textWrap: "pretty" }}>{desc}</p>
    </div>
  </div>
);

const PROMPTPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="frameworks" />
    <HeroFrame
      eyebrow={<>p.r.o.m.p.t<br/>framework<br/>v1.2</>}
      title={<>p.r.o.m.p.t.<br/><span style={{color:"var(--fg-3)"}}>compose, don't list.</span></>}
      meta={<>6 stages<br/>cc by-sa 4.0<br/>updated 2026.05</>}
      lede={<>P.R.O.M.P.T is a six-stage grammar for adversarial prompts. <span style={{color:"var(--fg-2)"}}>Premise · Role · Output · Modulation · Persona · Tactics. Every effective adversarial prompt fills these six slots — usually implicitly. Naming them turns ad-hoc prompt-writing into a compositional discipline that can be taught, audited, and automated.</span></>}
      cta={<><CTA primary href="https://github.com/SnailSploit/PROMPT-Framework">github →</CTA><CTA href="/aatmf">how it pairs with aatmf →</CTA></>}
    />

    <Section id="stages" label="01 · the six stages" hint="Each stage is a slot. Fill them in any order — but every effective prompt fills all six."
      title="six stages.">
      {PROMPT_DATA.stages.map(([k, n, d], i) => <StageRow key={i} k={k} name={n} desc={d} i={i} />)}
    </Section>

    <Section id="signature" sink label="02 · signature form" hint="A worked example. The same prompt written long-hand vs. as a P.R.O.M.P.T signature."
      title="signature form.">
      <pre style={{
        margin: 0, padding: "32px",
        background: "var(--bg)", border: "1px solid var(--line-hi)",
        fontFamily: "var(--f-mono)", fontSize: 14, lineHeight: 1.7,
        color: "var(--fg)", whiteSpace: "pre-wrap",
      }}>{PROMPT_DATA.signature}</pre>
      <p style={{ margin: "32px 0 0", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: 720 }}>
        The signature form is what gets versioned, reviewed, and stored in the AATMF prompt bank. Two operators reading the same signature converge on the same prompt — that's the whole point.
      </p>
    </Section>

    <Section id="why" label="03 · why" hint="What this gives you that a jailbreak list doesn't."
      title="why a grammar.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
        {PROMPT_DATA.why.map(([t, d], i) => (
          <div key={i} style={{ padding: "32px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
            <div style={{ fontSize: 24, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.018em" }}>{t}</div>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.65, maxWidth: 720 }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>

    <SiteFooter section="frameworks / p.r.o.m.p.t" />
  </div>
);

Object.assign(window, { PROMPTPage });
