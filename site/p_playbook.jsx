/* LLM Red Teamer's Playbook */
const PlaybookPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="frameworks" />
    <HeroFrame
      eyebrow={<>playbook<br/>llm red team<br/>v1</>}
      title={<>llm red teamer's<br/><span style={{color:"var(--fg-3)"}}>playbook.</span></>}
      meta={<>5 defense layers<br/>decision tree<br/>field-manual format</>}
      lede={<>A diagnostic methodology for bypassing LLM defenses. <span style={{color:"var(--fg-2)"}}>Not a list of jailbreaks — a routing logic. Five defense layers, sequenced. When a prompt fails, the failure mode tells you which layer caught you, which tells you where to pivot. Stop guessing. Start diagnosing.</span></>}
      cta={<><CTA primary href="https://github.com/SnailSploit/playbook">github →</CTA><CTA href="/prompt">prompt grammar →</CTA></>}
    />

    <Section id="layers" label="01 · five layers"
      hint="Sequenced. Each layer is a different question, each catches a different failure mode."
      title="five defense layers.">
      <div>
        {[
          ["L1", "Input filters", "Static or learned classifiers on the incoming prompt. Cheapest layer to test against — cheapest layer to bypass. Encoding tricks, character substitution, multilingual pivots, delimiter exploitation. If your prompt is rejected without ever reaching the model, you're at L1."],
          ["L2", "Alignment training", "RLHF and constitutional training baked into the weights. The hard layer — can't be patched without retraining. Bypassed via premise re-framing, role assignment, hypothetical pivots. If the model produces a polite refusal that pattern-matches the training data, you're at L2."],
          ["L3", "Identity & system prompt", "The system-prompt layer that defines who the model thinks it is. Bypassed via instruction-hierarchy override, role-injection, persona overwrites. If the model breaks character or admits to being a different system, you've moved past L3."],
          ["L4", "Output filtering", "Classifiers on the model's output before it reaches the user. Bypassed via output-shape manipulation — code blocks, JSON, base64, ASCII art, structured data. If the model generates the content but it gets redacted before delivery, you're at L4."],
          ["L5", "Agentic trust", "The boundary that decides whether the model's outputs become tool calls. Bypassed via tool poisoning, MCP injection, context-window flooding of trust signals. Only relevant for agents — and the most consequential layer when it is."],
        ].map(([k, n, d], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 240px 1fr", gap: 24, padding: "32px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)", alignItems: "start" }}>
            <Mono color="var(--signal-2)" size={14}>{k}</Mono>
            <div style={{ fontSize: 22, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.015em" }}>{n}</div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--fg-2)", textWrap: "pretty" }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section id="tree" sink label="02 · decision tree"
      hint="Read the failure. The failure tells you the layer. The layer tells you the pivot."
      title="how to read a failure.">
      <pre style={{ margin: 0, padding: "32px", background: "var(--bg)", border: "1px solid var(--line-hi)", fontFamily: "var(--f-mono)", fontSize: 13, lineHeight: 1.8, color: "var(--fg-2)", whiteSpace: "pre", overflowX: "auto" }}>
{`prompt rejected before model response?
├─ yes → L1 input filter
│         pivot: encoding · pad · multilingual · delimiter
│
└─ no, model responded — what kind?
   ├─ polite refusal w/ training-pattern phrasing → L2 alignment
   │   pivot: re-frame premise · role re-assignment · hypothetical
   │
   ├─ "I am [role from system prompt], I cannot..." → L3 identity
   │   pivot: instruction-hierarchy override · persona overwrite
   │
   ├─ partial output, then truncated/redacted → L4 output filter
   │   pivot: output shape · code block · JSON · base64 · ASCII
   │
   └─ output landed but tool call refused → L5 agentic trust
       pivot: MCP poisoning · context flooding · tool delegation`}
      </pre>
    </Section>

    <Section id="format" label="03 · format" hint="Field manual, not website. Why the playbook is structured this way."
      title="why a field manual.">
      <ArticleProse>
        <p>The Playbook is a field manual because the work is field work. The manual is short, indexed, and printable — designed to live next to the operator, not in a tab that closes when the engagement starts.</p>
        <p>Each layer chapter ends with a flow chart, a decision rubric, and three reproducible procedures. The procedures are intentionally generic — not "this prompt for this model on this date" but "this shape of prompt, against any model that exhibits this defense profile." Specifics decay. Shapes don't.</p>
      </ArticleProse>
    </Section>

    <SiteFooter section="frameworks / playbook" />
  </div>
);

Object.assign(window, { PlaybookPage });
