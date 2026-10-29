/* Claude-Red */
const claudeRedCategories = [
  [
    "web",
    "Web application",
    16,
    [
      "offensive-business-logic",
      "offensive-deserialization",
      "offensive-file-upload"
    ]
  ],
  [
    "auth",
    "Authentication & identity",
    2,
    [
      "offensive-jwt",
      "offensive-oauth"
    ]
  ],
  [
    "active-directory",
    "Active Directory",
    2,
    [
      "offensive-active-directory",
      "offensive-netexec"
    ]
  ],
  [
    "wireless",
    "Wireless",
    14,
    [
      "offensive-bluetooth-ble",
      "offensive-bluetooth-classic",
      "offensive-deauth-disassoc"
    ]
  ],
  [
    "cloud",
    "Cloud",
    1,
    [
      "offensive-cloud"
    ]
  ],
  [
    "mobile",
    "Mobile",
    1,
    [
      "offensive-mobile"
    ]
  ],
  [
    "iot",
    "IoT & embedded",
    1,
    [
      "offensive-iot"
    ]
  ],
  [
    "infrastructure",
    "Infrastructure & red team",
    7,
    [
      "offensive-advanced-redteam",
      "offensive-edr-evasion",
      "offensive-initial-access"
    ]
  ],
  [
    "exploit-dev",
    "Exploit development",
    6,
    [
      "offensive-basic-exploitation",
      "offensive-crash-analysis",
      "offensive-exploit-dev-course"
    ]
  ],
  [
    "fuzzing",
    "Fuzzing & vulnerability research",
    4,
    [
      "offensive-bug-identification",
      "offensive-fuzzing",
      "offensive-fuzzing-course"
    ]
  ],
  [
    "recon",
    "Reconnaissance",
    2,
    [
      "offensive-osint",
      "offensive-osint-methodology"
    ]
  ],
  [
    "api",
    "API security",
    2,
    [
      "offensive-api-abuse",
      "offensive-api-security"
    ]
  ],
  [
    "container",
    "Containers & Kubernetes",
    2,
    [
      "offensive-container-escape",
      "offensive-k8s-attacks"
    ]
  ],
  [
    "cicd",
    "CI/CD & pipelines",
    2,
    [
      "offensive-cicd-pipeline",
      "offensive-cicd-secrets"
    ]
  ],
  [
    "crypto",
    "Cryptography",
    2,
    [
      "offensive-crypto-attacks",
      "offensive-tls-attacks"
    ]
  ],
  [
    "privesc",
    "Privilege escalation",
    2,
    [
      "offensive-linux-privesc",
      "offensive-windows-privesc"
    ]
  ],
  [
    "post-exploitation",
    "Post-exploitation",
    3,
    [
      "offensive-data-exfiltration",
      "offensive-lateral-movement",
      "offensive-persistence"
    ]
  ],
  [
    "forensics",
    "Forensics & C2",
    2,
    [
      "offensive-anti-forensics",
      "offensive-c2-frameworks"
    ]
  ],
  [
    "supply-chain",
    "Supply chain",
    2,
    [
      "offensive-dependency-confusion",
      "offensive-supply-chain"
    ]
  ],
  [
    "social-engineering",
    "Social engineering",
    2,
    [
      "offensive-phishing",
      "offensive-social-engineering"
    ]
  ],
  [
    "network",
    "Network attacks",
    1,
    [
      "offensive-network-attacks"
    ]
  ],
  [
    "ai",
    "AI security",
    1,
    [
      "offensive-ai-security"
    ]
  ],
  [
    "utility",
    "Utility",
    2,
    [
      "offensive-fast-checking",
      "offensive-reporting"
    ]
  ]
];

const ClaudeRedPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="frameworks" />
    <HeroFrame
      eyebrow={<>claude-red<br/>skills library<br/>mit license</>}
      title={<>Claude-Red.<br/><span style={{color:"var(--fg-3)"}}>79 Offensive Skills.</span></>}
      meta={<>79 SKILL.md files<br/>23 categories<br/>Claude Skills system</>}
      lede={<>A curated library of offensive-security skills for the Claude Skills system. <span style={{color:"var(--fg-2)"}}>79 SKILL.md files across 23 categories, covering web, wireless, cloud, exploit development, AI security and more. Explore the source and installation options on GitHub.</span></>}
      cta={<><CTA primary href="https://github.com/SnailSploit/claude-red">github →</CTA><CTA href="#categories">browse categories →</CTA></>}
    />
    <Section id="categories" label="01 · categories" hint="23 categories, 79 skills. Select a category to browse its source on GitHub." title="23 categories.">
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))",gap:0,borderTop:"1px solid var(--line-hi)",borderLeft:"1px solid var(--line-hi)"}}>
        {claudeRedCategories.map(([slug, cat, n, samples]) => (
          <a key={slug} href={"https://github.com/SnailSploit/Claude-Red/tree/main/Skills/" + slug} style={{display:"block",padding:"24px",borderRight:"1px solid var(--line-hi)",borderBottom:"1px solid var(--line-hi)",textDecoration:"none",color:"inherit"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"baseline"}}>
              <span style={{fontSize:18,fontWeight:500,color:"var(--fg)"}}>{cat}</span>
              <Mono color="var(--signal-2)" size={12}>{n} {n === 1 ? "skill" : "skills"}</Mono>
            </div>
            <p style={{margin:"10px 0 0",fontSize:12,color:"var(--fg-2)",lineHeight:1.7,overflowWrap:"anywhere"}}>{samples.join(" · ")}</p>
          </a>
        ))}
      </div>
    </Section>
    <Section id="format" sink label="02 · format" title="Skills in plain Markdown.">
      <ArticleProse>
        <p>Each skill has a SKILL.md file containing focused offensive-security guidance. The repository groups skills by subject under <code>Skills/</code>, so you can browse the files directly or use them with a compatible skills workflow.</p>
        <p>Consult the repository for the current skill catalog, installation options and license. Apply the material only within an authorized testing scope.</p>
      </ArticleProse>
    </Section>
    <Section id="usage" label="03 · usage" title="How to use it.">
      <ArticleProse><p>Clone the repository and browse its case-sensitive <code>Skills/</code> directory. The installer can list the available categories; see the README for installation options.</p></ArticleProse>
      <pre style={{margin:"32px 0 0",padding:"32px",background:"var(--bg)",border:"1px solid var(--line-hi)",fontFamily:"var(--f-mono)",fontSize:14,lineHeight:1.8,color:"var(--fg-2)",whiteSpace:"pre-wrap",maxWidth:760}}>{"git clone https://github.com/SnailSploit/claude-red\ncd claude-red\n./install.sh --list"}</pre>
      <p><a href="https://github.com/SnailSploit/Claude-Red#quickstart" style={{color:"var(--signal-2)"}}>View the GitHub quickstart →</a></p>
    </Section>
    <Section label="credits" title="Credits">
      <ArticleProse><p>Original Checklists: <a href="/team/sahar-shlichove">Sahar Shlichove</a> — the offensive checklist collection many of these skills are based on.</p></ArticleProse>
    </Section>
    <SiteFooter section="frameworks / claude-red" />
  </div>
);
Object.assign(window, { ClaudeRedPage });
