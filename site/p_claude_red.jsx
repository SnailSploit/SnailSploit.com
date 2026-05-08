/* Claude-Red */
const ClaudeRedPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="frameworks" />
    <HeroFrame
      eyebrow={<>claude-red<br/>skills library<br/>mit license</>}
      title={<>claude-red.<br/><span style={{color:"var(--fg-3)"}}>38 offensive skills.</span></>}
      meta={<>38 SKILL.md files<br/>9 categories<br/>Claude Skills system</>}
      lede={<>A curated library of offensive-security skills for the Claude Skills system. <span style={{color:"var(--fg-2)"}}>SQLi, shellcode, EDR evasion, exploit dev — 38 SKILL.md files spanning the work an offensive operator actually does. Drop-in capabilities for agent harnesses that need real adversarial coverage. Each skill is small, sharp, and reads in under a minute.</span></>}
      cta={<><CTA primary href="https://github.com/SnailSploit/claude-red">github →</CTA><CTA href="#categories">browse categories →</CTA></>}
    />

    <Section id="categories" label="01 · categories"
      hint="Nine categories, 38 skills. Names are self-describing — no marketing, just craft."
      title="9 categories.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--line-hi)", borderLeft: "1px solid var(--line-hi)" }}>
        {[
          ["Web exploitation",      6, "SQLi · SSRF · CSRF · path traversal · prototype pollution · XSS chains"],
          ["Binary exploitation",   5, "Stack overflows · heap shaping · ROP · format strings · ret2libc"],
          ["Shellcode & payloads",  4, "x86_64 / arm64 / msf-compatible · staged · stageless · custom encoders"],
          ["EDR evasion",           4, "Direct syscalls · unhooking · AMSI bypass · ETW patching"],
          ["Network & C2",          5, "C2 channel design · DNS tunneling · ICMP exfil · domain fronting · jitter"],
          ["Cloud & container",     4, "K8s breakouts · IMDS abuse · IAM enumeration · privesc paths"],
          ["AD & windows",          3, "Kerberoasting · DCsync · BloodHound triage"],
          ["Linux post-ex",         3, "Persistence · privesc · lateral · log evasion"],
          ["Recon & osint",         4, "Subdomain · CT · cloud bucket discovery · code-search recon"],
        ].map(([cat, n, sample], i) => (
          <div key={i} style={{ padding: "28px", borderRight: "1px solid var(--line-hi)", borderBottom: "1px solid var(--line-hi)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.012em" }}>{cat}</div>
              <Mono color="var(--signal-2)" size={12}>{n} skills</Mono>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{sample}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section id="format" sink label="02 · format"
      hint="Why each skill is a single file, why it's that short, why it's not a script."
      title="one skill, one file.">
      <ArticleProse>
        <p>Each skill is a single SKILL.md file. The file is short — usually 80 to 200 lines — because skills aren't scripts. They are operating instructions for an agent that will write the script, in context, against a target the agent has in front of it.</p>
        <p>The skill describes when to apply the technique, what to look for, what the expected indicators of success are, and what to do if it doesn't land. It does not pre-bake the exploit, because the exploit only makes sense in context. Pre-baking is what makes the average "AI security skill" library brittle the moment the target deviates from the demo.</p>
        <p>This is also why Claude-Red is small. 38 skills, not 380. Most "more" is filler — and a skill an operator can't memorize the shape of is a skill the operator won't reach for.</p>
      </ArticleProse>
    </Section>

    <Section id="usage" label="03 · usage"
      hint="How to wire a Claude-Red skill into an agent harness in three steps."
      title="how to use it.">
      <pre style={{ margin: 0, padding: "32px", background: "var(--bg)", border: "1px solid var(--line-hi)", fontFamily: "var(--f-mono)", fontSize: 14, lineHeight: 1.8, color: "var(--fg-2)", whiteSpace: "pre-wrap", maxWidth: 760 }}>
{`# 1. clone
$ git clone https://github.com/SnailSploit/claude-red

# 2. point your skills loader at it
$ export CLAUDE_SKILLS_DIR=$PWD/claude-red/skills

# 3. drop into a harness
The agent now has 38 new tools available, all reachable through
the standard SKILL.md discovery path. No code changes required.`}
      </pre>
    </Section>

    <SiteFooter section="frameworks / claude-red" />
  </div>
);

Object.assign(window, { ClaudeRedPage });
