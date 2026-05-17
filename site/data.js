/* Source of truth: github.com/SnailSploit README. Verified 2026.05. */

window.SS_DATA = {
  identity: {
    name: "Kai Aizen",
    handle: "snailsploit",
    role: "Independent offensive security researcher",
    location: "independent",
    tagline: "Same attack. Different substrate.",
    bio: "I break production systems — Linux kernel, Kubernetes, container runtimes, OSS libraries, and the LLMs increasingly woven through them — then publish the methodology. Frameworks for structured adversarial-AI red teaming. Tooling for systematic vulnerability discovery. Books and articles for the human layer.",
    creds: ["Creator of AATMF / P.R.O.M.P.T / SEF", "Author of Adversarial Minds", "Hakin9 contributing author", "Linux kernel contributor"],
    links: {
      site: "snailsploit.com",
      jailbreakChef: "thejailbreakchef.com",
      linkedin: "linkedin.com/in/kaiaizen",
      x: "x.com/SnailSploit",
      github: "github.com/SnailSploit",
    },
    badges: [
      { label: "Linux Kernel", value: "5 mainline patches" },
      { label: "CVEs", value: "30 published" },
      { label: "GHSA", value: "2 advisories" },
      { label: "Hakin9", value: "Contributing author" },
      { label: "MITRE/NVD", value: "Contributor" },
    ],
  },

  kernel: [
    { subsystem: "io_uring/zcrx", vuln: "user_ref race → double-free → OOB write", cve: "CVE-2026-43121", status: "Mainline 7.0-rc1 · backports 6.18.16 + 6.19.6" },
    { subsystem: "net/tipc", vuln: "tipc_mon_peer_up UAF vs bearer teardown", status: "Mainline" },
    { subsystem: "Bluetooth", vuln: "hci_conn UAF in create_big_sync / create_big_complete", status: "Mainline" },
    { subsystem: "RDMA/ionic", vuln: "Unbounded node_desc sysfs read via %.64s", status: "Mainline" },
    { subsystem: "net/rtnetlink", vuln: "ifla_vf_broadcast stack infoleak (zero init missing)", status: "Mainline" },
  ],

  aiResearch: [
    { title: "Self-Replicating Memory Worm", desc: "Adversarial self-replicating prompt that survives across sessions and propagates via long-term memory writes — the AI-worm primitive applied to persistent agent state." },
    { title: "Memory Injection Through Nested Skills", desc: "Skill injection + memory poisoning = self-healing autonomous implant. Validated against DVWA and Juice Shop in agent harness." },
    { title: "ChatGPT Canvas DNS Exfiltration", desc: "DNS exfiltration via rendered Canvas content — triggers lookups without outbound HTTP." },
    { title: "ChatGPT Sandbox: Pickle RCE + DNS Chain", desc: "Pickle deserialization RCE chained with DNS exfil to break out of the Code Interpreter sandbox." },
    { title: "MCP vs A2A Attack Surface", desc: "Comparative threat model: where Model Context Protocol and Agent-to-Agent diverge in trust boundaries." },
    { title: "The 30% Blind Spot — LLM Safety Judges", desc: "Empirical study showing LLM-as-judge safety classifiers miss ~30% of adversarial output classes." },
    { title: "Adversarial Prompting: Complete Guide", desc: "End-to-end methodology covering direct, indirect, multi-turn, and agentic prompt injection." },
  ],

  frameworks: [
    { name: "AATMF v3.1", desc: "Adversarial AI Threat Modeling Framework — 20 tactics, 240+ techniques, 2,152+ procedures, 4,980+ prompts. Mapped to NIST AI RMF and MITRE ATLAS." },
    { name: "AATMF Red Teaming Toolkit", desc: "Python CLI for systematic LLM safety testing — three-layer eval pipeline, defense fingerprinting, decay tracking, attack chain planning." },
    { name: "LLM Red Teamer's Playbook", desc: "Diagnostic methodology for bypassing LLM defense layers — input filters → alignment → identity → output → agentic trust." },
    { name: "Claude-Red", desc: "Curated offensive security skills library for the Claude skills system — 38 SKILL.md files spanning SQLi, shellcode, EDR evasion, exploit dev." },
  ],

  tools: [
    { name: "Burp MCP Toolkit",     desc: "MCP security analysis for Burp Suite — prompt injection and tool poisoning testing via Model Context Protocol." },
    { name: "SnailHunter",          desc: "AI-powered bug bounty automation — LLM analysis combined with traditional security scanning." },
    { name: "KubeRoast",            desc: "Red-team Kubernetes misconfiguration & attack-path scanner." },
    { name: "Xposure",              desc: "Autonomous credential intelligence platform for attack-surface recon." },
    { name: "SnailSploit Recon",    desc: "Chrome MV3 extension — passive recon, security headers, IP intel, CPE→CVE enrichment." },
    { name: "SnailPath",            desc: "Async directory & route discovery — HTTP/2, soft-404 suppression, JS/sourcemap mining." },
    { name: "ZenFlood",             desc: "Low-bandwidth stress testing — modernized Slowloris." },
    { name: "SnailObfuscator",      desc: "Structurally-aware code obfuscation engine." },
    { name: "Awesome-Snail-OSINT",  desc: "Curated OSINT resource collection for offensive recon." },
    { name: "JystDastIt",          desc: "The Burp You Can Afford — open-source CLI DAST toolkit for web app vulnerability scanning and XSS detection." },,
  ],

  cves: {
    container: [
      { id: "CVE-2026-3288", target: "Kubernetes ingress-nginx", type: "Config injection → RCE", severity: "high", score: "8.8" },
    ],
    apache: [
      { id: "CVE-2026-30911", target: "Apache Airflow Core", type: "Missing authentication", severity: "high", score: "8.1" },
      { id: "CVE-2026-32794", target: "Apache Airflow (Databricks provider)", type: "TLS verification bypass", severity: "med", score: "4.8" },
    ],
    crossLang: [
      { id: "CVE-2026-43884", target: "WWBN/AVideo", lang: "PHP", type: "SSRF — HTTP redirect & DNS rebinding bypass", severity: "high", score: "7.7" },
      { id: "CVE-2026-31899", target: "CairoSVG", lang: "Python", type: "Exponential DoS — recursive amplification", severity: "high", score: "7.5" },
      { id: "CVE-2026-32809", target: "ouch-org/ouch", lang: "Rust", type: "Symlink escape — arbitrary file overwrite", severity: "high", score: "7.4" },
      { id: "CVE-2026-33693", target: "activitypub-federation-rust", lang: "Rust", type: "SSRF — 0.0.0.0 bypass in fediverse federation", severity: "med", score: "6.5" },
      { id: "CVE-2026-32885", target: "ddev/ddev", lang: "Go", type: "ZipSlip — path traversal in archive extraction", severity: "med", score: "6.5" },
      { id: "CVE-2026-8368",  target: "Perl LWP::UserAgent / HTTP::Tiny", lang: "Perl", type: "Zero header strip on cross-host redirect", severity: "med", score: "—" },
      { id: "CVE-2026-45363", target: "jwt/ruby-jwt", lang: "Ruby", type: "Empty-key HMAC bypass", severity: "high", score: "7.4" },
      { id: "CVE-2026-44840", target: "Dgraph", lang: "Go", type: "DQL injection via GraphQL", severity: "high", score: "—" },
      { id: "CVE-2026-44217", target: "sse-channel (npm)", lang: "JavaScript", type: "SSE injection — unsanitized fields", severity: "med", score: "—" },
      { id: "CVE-2026-45620", target: "WWBN/AVideo", lang: "PHP", type: "Incomplete fix for CVE-2026-43881", severity: "med", score: "—" },
      { id: "CVE-2026-45619", target: "WWBN/AVideo", lang: "PHP", type: "Incomplete fix for CVE-2026-43884", severity: "med", score: "—" },
    ],
    wordpress: [
      { id: "CVE-2026-3596",  target: "Riaxe Product Customizer", type: "Privilege escalation", severity: "crit", score: "9.8" },
      { id: "CVE-2026-1313",  target: "MimeTypes Link Icons",     type: "SSRF",                 severity: "high", score: "8.3" },
      { id: "CVE-2026-3599",  target: "Riaxe Product Customizer", type: "SQL injection",        severity: "high", score: "7.5" },
      { id: "CVE-2025-9776",  target: "CatFolders",                type: "SQL injection via CSV import", severity: "med", score: "6.5" },
      { id: "CVE-2025-12163", target: "OmniPress",                 type: "Stored XSS",           severity: "med", score: "6.4" },
      { id: "CVE-2026-2717",  target: "HTTP Headers",              type: "CRLF injection",       severity: "med", score: "5.5" },
      { id: "CVE-2026-0811",  target: "Advanced CF7 DB",           type: "CSRF",                 severity: "med", score: "5.4" },
      { id: "CVE-2026-1314",  target: "3D FlipBook",               type: "Missing authentication", severity: "med", score: "5.3" },
      { id: "CVE-2026-3594",  target: "Riaxe Product Customizer",  type: "Information disclosure", severity: "med", score: "5.3" },
      { id: "CVE-2026-3595",  target: "Riaxe Product Customizer",  type: "Unauthenticated user deletion", severity: "med", score: "5.3" },
      { id: "CVE-2025-11171", target: "Chartify",                  type: "Missing authentication", severity: "med", score: "5.3" },
      { id: "CVE-2025-11174", target: "Document Library Lite",     type: "Unauth info disclosure", severity: "med", score: "5.3" },
      { id: "CVE-2026-0814",  target: "Advanced CF7 DB",           type: "Missing authentication", severity: "med", score: "4.3" },
      { id: "CVE-2025-12030", target: "ACF to REST API",           type: "IDOR",                 severity: "med", score: "4.3" },
      { id: "CVE-2026-1208",  target: "Welcart Friendly Functions", type: "CSRF → settings update", severity: "med", score: "4.3" },
    ],
    note: "Plus: TelSender — stored XSS that resulted in vendor-side plugin removal.",
  },

  advisories: [
    { id: "GHSA-2hch-c97c-g99x", target: "WWBN/AVideo", type: "SSRF Protection Bypass via HTTP Redirect & DNS Rebinding in isSSRFSafeURL() (CVE-2026-43884)", severity: "high", score: "7.7" },
    { id: "GHSA-j425-whc4-4jgc", target: "OpenClaw",    type: "system.run env override RCE — allowlist bypass via GIT_SSH_COMMAND, editor hooks, GIT_CONFIG_*", severity: "med", score: "6.3" },
    { id: "GHSA-gxhx-2686-5h9g", target: "slack-go/slack", type: "Security advisory", severity: "med", score: "—" },
    { id: "TelSender",            target: "TelSender (WP)", type: "Unauthenticated Stored XSS via Telegram Chat Title — plugin shut down by vendor", severity: "high", score: "7.2" },
  ],

  sourceTree: [
    { project: "concourse/concourse#9486", contribution: "Symlink breakout fix", status: "Merged in v8.1.1" },
  ],

  stats: {
    cveCount: 30,
    advisoryCount: 4,
    kernelCount: 5,
    frameworkCount: 4,
    toolCount: 10,
    aiResearchCount: 7,
  },
};
