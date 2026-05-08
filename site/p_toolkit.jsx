/* AATMF Toolkit detail page */
const ToolkitPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="frameworks" />
    <HeroFrame
      eyebrow={<>aatmf toolkit<br/>python · cli<br/>apache 2.0</>}
      title={<>aatmf<br/><span style={{color:"var(--fg-3)"}}>toolkit.</span></>}
      meta={<>Python 3.11+<br/>2,152+ procedures<br/>any LLM endpoint</>}
      lede={<>The Python CLI that operationalizes AATMF. <span style={{color:"var(--fg-2)"}}>Three-layer evaluation pipeline, defense fingerprinting, decay tracking, attack-chain planning. Drops in a target endpoint, picks procedures by tactic or risk score, and emits an AATMF-R-scored report. Built for the team that wants to run AATMF as a continuous control, not as a one-off engagement.</span></>}
      cta={<><CTA primary href="https://github.com/SnailSploit/aatmf-toolkit">github →</CTA><CTA href="/aatmf">aatmf framework →</CTA></>}
    />

    <Section id="pipeline" label="01 · pipeline" hint="Three layers. Each layer answers a different question."
      title="three-layer eval pipeline.">
      <div>
        {[
          ["L1", "Defense fingerprinting", "What defenses is this endpoint actually running? Probe set runs against the target before any real attack — input filters, alignment training, output classifier, agentic boundary, rate limit. Output: a profile that determines which procedures are worth running and which would burn budget."],
          ["L2", "Procedure execution", "AATMF procedures run against the profiled endpoint. Skip procedures the L1 profile says will be no-ops; prioritize procedures the profile says will land. Each procedure's success/failure is logged, not just summarized."],
          ["L3", "AATMF-R scoring + report", "Every result scored on the six AATMF-R factors (L · I · E · D · R · C). Report exports to JSON, Markdown, and a slide-ready PDF. Mappings to OWASP LLM Top 10, MITRE ATLAS, NIST AI RMF, and EU AI Act emit alongside the raw scores."],
        ].map(([k, n, d], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 240px 1fr", gap: 24, padding: "32px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)", alignItems: "start" }}>
            <Mono color="var(--signal-2)" size={14}>{k}</Mono>
            <div style={{ fontSize: 22, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.015em" }}>{n}</div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--fg-2)", textWrap: "pretty" }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section id="install" sink label="02 · install" hint="Standard pip install. Works against any LLM that responds to HTTP."
      title="install & first run.">
      <pre style={{ margin: 0, padding: "28px 32px", background: "var(--bg)", border: "1px solid var(--line-hi)", fontFamily: "var(--f-mono)", fontSize: 14, lineHeight: 1.8, color: "var(--fg-2)", whiteSpace: "pre-wrap", maxWidth: 760 }}>
{`# install
$ pip install aatmf-toolkit

# fingerprint a target
$ aatmf fingerprint --endpoint https://api.example.com/v1/chat

# run a tactic
$ aatmf run --tactic T11 --endpoint https://api.example.com/v1/chat \\
    --report report.md

# run the full battery, scored
$ aatmf run --all --endpoint <url> --output report.json --format aatmf-r`}
      </pre>
    </Section>

    <Section id="features" label="03 · features" hint="The capabilities that distinguish this from a prompt-list runner."
      title="what's inside.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--line-hi)", borderLeft: "1px solid var(--line-hi)" }}>
        {[
          ["Defense fingerprinting", "Identify the actual defenses on a target before attacking. Skip the procedures that will obviously fail."],
          ["Decay tracking", "Re-run a baseline against the same endpoint over time. Detect when a defense regresses — a CI signal, not a one-shot evaluation."],
          ["Attack-chain planner", "Compose multi-turn procedures into chains. The planner picks turn ordering that maximizes downstream landing rate."],
          ["Pluggable procedures", "Drop a YAML file in /procedures and it runs. Custom procedures version alongside the toolkit."],
          ["Headless or interactive", "CI mode for scheduled runs. Interactive mode for triage and one-off investigation."],
          ["Compliance export", "OWASP LLM Top 10 · MITRE ATLAS · NIST AI RMF · EU AI Act mappings emit automatically with each report."],
        ].map(([t, d], i) => (
          <div key={i} style={{ padding: "28px 28px", borderRight: "1px solid var(--line-hi)", borderBottom: "1px solid var(--line-hi)" }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>{t}</div>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>

    <SiteFooter section="frameworks / aatmf toolkit" />
  </div>
);

Object.assign(window, { ToolkitPage });
