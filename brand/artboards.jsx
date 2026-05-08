/* ============================================================
   Brand artboards v2 — operator's tool
   ============================================================ */

const Box = ({ children, dark = true, pad = 32, style = {} }) => (
  <div style={{
    background: dark ? "var(--bg-raise)" : "var(--paper)",
    color: dark ? "var(--fg)" : "var(--ink)",
    border: `1px solid ${dark ? "var(--line)" : "var(--paper-2)"}`,
    padding: pad,
    ...style,
  }}>{children}</div>
);

const Eyebrow = ({ children, color = "var(--fg-3)" }) => (
  <div style={{
    fontFamily: "var(--f-mono)", fontSize: 11, color,
    textTransform: "uppercase", letterSpacing: "0.12em",
  }}>{children}</div>
);

const Hairline = ({ dark = true }) => (
  <div style={{ height: 1, background: dark ? "var(--line)" : "var(--paper-2)", width: "100%" }} />
);

/* ── A. Cover ────────────────────────────────────────── */
const ArtCover = () => (
  <div style={{
    width: 1200, height: 760, background: "var(--bg)", color: "var(--fg)",
    fontFamily: "var(--f-grot)", padding: 48, position: "relative", overflow: "hidden",
  }}>
    {/* corner ticks */}
    <div style={{ position: "absolute", inset: 24, border: "1px solid var(--line)", pointerEvents: "none" }} />

    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Eyebrow>SS · brand foundation v2</Eyebrow>
      <Eyebrow>SHELL.001 — 2026.05</Eyebrow>
    </div>

    <div style={{ position: "absolute", left: 64, right: 64, bottom: 64 }}>
      <div style={{ fontSize: 132, lineHeight: 0.92, letterSpacing: "-0.045em", fontWeight: 500 }}>
        same attack.<br/>
        <span style={{ color: "var(--fg-3)" }}>different substrate.</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 36, paddingBottom: 0 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-2)", maxWidth: 520, lineHeight: 1.55 }}>
          a research identity for kai aizen.<br/>
          adversarial ai · kernel · the psychology that binds them.
        </div>
        <div style={{ position: "absolute", right: 0, bottom: -28, transform: "translateY(50%)" }}>
          <WordmarkFull size={2.4} color="var(--fg)" accent="var(--signal-2)" />
        </div>
      </div>
    </div>
  </div>
);

/* ── B. Marks ────────────────────────────────────────── */
const MarkCell = ({ name, sub, children, big }) => (
  <div style={{
    background: "var(--bg-raise)", border: "1px solid var(--line)",
    height: big ? 280 : 220, padding: 24, display: "flex", flexDirection: "column",
  }}>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    <Hairline />
    <div style={{ paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg)" }}>{name}</span>
      <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>{sub}</span>
    </div>
  </div>
);

const ArtMarks = () => (
  <div style={{ width: 1200, padding: 48, background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "baseline" }}>
      <Eyebrow>01 · marks</Eyebrow>
      <div>
        <div style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.03em", fontWeight: 500 }}>
          the wordmark IS the brand.
        </div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-2)", marginTop: 12, maxWidth: 720, lineHeight: 1.55 }}>
          two glyphs do all the work. the spiral becomes the lowercase ‘o’. [$] becomes the capital ‘S’. no separate illustration, no mascot — the type carries the snail and the exploit at once.
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 36 }}>
      <MarkCell name="the o" sub="spiral shell glyph" big>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <SpiralO size={140} color="var(--fg)" stroke={2} />
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>logarithmic spiral, hairline</span>
        </div>
      </MarkCell>
      <MarkCell name="the S" sub="bracketed dollar" big>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <span style={{ fontSize: 140, lineHeight: 1, fontFamily: "var(--f-mono)", fontWeight: 500, letterSpacing: "-0.04em", color: "var(--fg)" }}>
            <span>[</span><span style={{ color: "var(--signal-2)" }}>$</span><span>]</span>
          </span>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>oxide accent on the $ only</span>
        </div>
      </MarkCell>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
      <Box>
        <Eyebrow>lowercase — spiral o</Eyebrow>
        <div style={{ marginTop: 28 }}><WordmarkSpiralO size={1.9} color="var(--fg)" /></div>
      </Box>
      <Box>
        <Eyebrow>camelcase — [$] for S</Eyebrow>
        <div style={{ marginTop: 28 }}><WordmarkBracketS size={1.9} color="var(--fg)" accent="var(--signal-2)" /></div>
      </Box>
      <Box>
        <Eyebrow>combined — [$]nailspl⧉it</Eyebrow>
        <div style={{ marginTop: 28 }}><WordmarkFull size={1.9} color="var(--fg)" accent="var(--signal-2)" /></div>
      </Box>
      <Box dark={false}>
        <Eyebrow color="var(--ink-3)">on paper</Eyebrow>
        <div style={{ marginTop: 28 }}><WordmarkFull size={1.9} color="var(--ink)" accent="#b94a1d" /></div>
      </Box>
    </div>
  </div>
);

/* ── C. Wordmark + lockup + favicon ──────────────────── */
const ArtLockup = () => (
  <div style={{ width: 1200, padding: 48, background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "baseline" }}>
      <Eyebrow>02 · wordmark</Eyebrow>
      <div style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.03em", fontWeight: 500 }}>
        lowercase, tight, one accent.
      </div>
    </div>

    <div style={{ marginTop: 32, padding: 56, background: "var(--bg-raise)", border: "1px solid var(--line)" }}>
      <WordmarkFull size={3.6} color="var(--fg)" accent="var(--signal-2)" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
      <Box>
        <Eyebrow>spiral-o variant</Eyebrow>
        <div style={{ marginTop: 28 }}><WordmarkSpiralO size={1.6} color="var(--fg)" /></div>
      </Box>
      <Box dark={false}>
        <Eyebrow color="var(--ink-3)">on paper</Eyebrow>
        <div style={{ marginTop: 28 }}><WordmarkFull size={1.6} color="var(--ink)" accent="#b94a1d" /></div>
      </Box>
      <Box>
        <Eyebrow>cli context</Eyebrow>
        <div style={{ marginTop: 24, fontFamily: "var(--f-mono)", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>
          <span style={{ color: "var(--signal-2)" }}>$</span> snailsploit aatmf scan --target gpt-4o<br/>
          <span style={{ color: "var(--fg-3)" }}>// 240 techniques · 20 tactics</span><br/>
          <span style={{ color: "var(--fg-3)" }}>// loaded shell.001 — kai aizen</span>
        </div>
      </Box>
      <Box>
        <Eyebrow>favicon — the spiral o</Eyebrow>
        <div style={{ marginTop: 24, display: "flex", gap: 16, alignItems: "center" }}>
          {[16, 24, 32, 48, 64].map(s => (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: s, height: s, background: "var(--fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SpiralO size={s * 0.82} color="var(--bg)" stroke={Math.max(1.4, s/22)} />
              </div>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--fg-3)" }}>{s}</span>
            </div>
          ))}
        </div>
      </Box>
    </div>
  </div>
);

/* ── D. Color ────────────────────────────────────────── */
const Swatch = ({ name, token, role, hex, dark }) => (
  <div style={{ background: "var(--bg-raise)", border: "1px solid var(--line)" }}>
    <div style={{ height: 80, background: `var(${token})`, borderBottom: "1px solid var(--line)" }} />
    <div style={{ padding: 14 }}>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)" }}>{token}</div>
      <div style={{ fontFamily: "var(--f-grot)", fontSize: 13, fontWeight: 500, marginTop: 4 }}>{name}</div>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>{role}</div>
    </div>
  </div>
);

const ArtColor = () => (
  <div style={{ width: 1200, padding: 48, background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "baseline" }}>
      <Eyebrow>03 · color</Eyebrow>
      <div>
        <div style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.03em", fontWeight: 500 }}>
          graphite, off-white, one oxide.
        </div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-2)", marginTop: 12, maxWidth: 720, lineHeight: 1.55 }}>
          dark surface is the default — calm, instrument-like, never sterile. one signal color, used only for live status: cve severity, advisory state, the prompt cursor.
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 32 }}>
      <Swatch name="bg" token="--bg" role="page" />
      <Swatch name="bg-raise" token="--bg-raise" role="cards" />
      <Swatch name="bg-sink" token="--bg-sink" role="inset" />
      <Swatch name="line" token="--line" role="hairline" />
      <Swatch name="line-hi" token="--line-hi" role="strong rule" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 8 }}>
      <Swatch name="fg" token="--fg" role="primary" />
      <Swatch name="fg-2" token="--fg-2" role="secondary" />
      <Swatch name="fg-3" token="--fg-3" role="meta / mono" />
      <Swatch name="fg-4" token="--fg-4" role="disabled" />
      <Swatch name="signal" token="--signal-2" role="live status" />
    </div>

    <div style={{ marginTop: 32, padding: 32, background: "var(--paper)", color: "var(--ink)" }}>
      <Eyebrow color="var(--ink-3)">light · for print, og, light pages</Eyebrow>
      <div style={{ marginTop: 16, fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em" }}>
        the same system, inverted — never the inverse aesthetic.
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 16, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--ink-2)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, background: "var(--signal)" }} />
          CVE-2026-3288 · ingress-nginx · 8.8 high
        </span>
      </div>
    </div>
  </div>
);

/* ── E. Type ─────────────────────────────────────────── */
const ArtType = () => (
  <div style={{ width: 1200, padding: 48, background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "baseline" }}>
      <Eyebrow>04 · typography</Eyebrow>
      <div style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.03em", fontWeight: 500 }}>
        two faces. nothing else.
      </div>
    </div>

    <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 28, columnGap: 32, borderTop: "1px solid var(--line)", paddingTop: 28, alignItems: "baseline" }}>
      <Eyebrow>display / ui<br/><span style={{ color: "var(--fg)" }}>söhne · neue haas</span></Eyebrow>
      <div>
        <div style={{ fontSize: 80, fontWeight: 500, lineHeight: 0.95, letterSpacing: "-0.04em" }}>the slow exploit is the durable one.</div>
        <div style={{ fontSize: 28, fontWeight: 400, color: "var(--fg-2)", marginTop: 16, letterSpacing: "-0.02em", lineHeight: 1.25, maxWidth: 820 }}>
          across substrates — kernels, language models, agents — the attacker's craft is recognisably the same. patience reads as authority.
        </div>
      </div>

      <Eyebrow>signal / data<br/><span style={{ color: "var(--fg)" }}>berkeley · jetbrains mono</span></Eyebrow>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 14, lineHeight: 1.6, color: "var(--fg-2)" }}>
        <span style={{ color: "var(--signal-2)" }}>$</span> snailsploit aatmf scan --target gpt-4o<br/>
        <span style={{ color: "var(--fg-3)" }}>// 240 techniques across 20 tactics</span><br/>
        <span style={{ color: "var(--fg) "}}>CVE-2026-3288</span> <span style={{ color: "var(--fg-3)" }}>ingress-nginx · cfg-injection · </span><span style={{ color: "var(--signal-2)" }}>8.8</span>
      </div>

      <Eyebrow>numerals<br/><span style={{ color: "var(--fg)" }}>tabular, lining</span></Eyebrow>
      <div style={{ display: "flex", gap: 48, alignItems: "baseline" }}>
        {[["10", "cve"], ["3", "frameworks"], ["36", "articles"], ["240+", "techniques"]].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 56, fontWeight: 500, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>{n}</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── F. Applied — header + hero + cve row ────────────── */
const ArtApplied = () => (
  <div style={{ width: 1200, background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)" }}>
    <div style={{ padding: "16px 32px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <WordmarkFull size={0.95} color="var(--fg)" accent="var(--signal-2)" />
      <nav style={{ display: "flex", gap: 28, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-2)" }}>
        <span>frameworks</span><span>research</span><span>cve</span><span>tools</span><span>writing</span><span>about</span>
      </nav>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 6, height: 6, background: "var(--signal-2)" }}></span>
        live · 10 cve · 3 frameworks
      </div>
    </div>

    <div style={{ padding: "72px 48px 48px", display: "grid", gridTemplateColumns: "180px 1fr 280px", gap: 40 }}>
      <Eyebrow>kai aizen<br/>genai security<br/>independent</Eyebrow>
      <div>
        <div style={{ fontSize: 96, fontWeight: 500, lineHeight: 0.95, letterSpacing: "-0.045em" }}>
          same attack.<br/>
          <span style={{ color: "var(--fg-3)" }}>different substrate.</span>
        </div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 14, color: "var(--fg-2)", marginTop: 24, maxWidth: 600, lineHeight: 1.6 }}>
          adversarial ai · llm jailbreaking · kernel · the psychology that binds them. independent research, frameworks, and tooling — built slowly, on purpose.
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <div style={{ padding: "10px 16px", border: "1px solid var(--fg)", fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg)" }}>view frameworks →</div>
          <div style={{ padding: "10px 16px", border: "1px solid var(--line-hi)", fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--fg-2)" }}>about kai</div>
        </div>
      </div>
      <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 24 }}>
        <Eyebrow>latest</Eyebrow>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["memory injection through nested skills", "mar 26"],
            ["io_uring/zcrx race condition", "mar 26"],
            ["self-replicating memory worm", "mar 26"],
          ].map(([t, d]) => (
            <div key={t} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-2)", borderBottom: "1px dashed var(--line)", paddingBottom: 12 }}>
              <span>{t}</span>
              <span style={{ color: "var(--fg-3)" }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ borderTop: "1px solid var(--line)", padding: "32px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <Eyebrow>cve · published</Eyebrow>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--fg-3)" }}>10 total →</span>
      </div>
      {[
        ["CVE-2026-3288", "ingress-nginx", "config-injection → rce", "8.8", "high"],
        ["CVE-2026-31899", "cairosvg", "exponential dos", "7.5", "high"],
        ["CVE-2025-9776", "catfolders", "sql injection", "6.5", "med"],
        ["CVE-2026-32885", "ddev", "path traversal", "6.5", "med"],
      ].map((r, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "180px 1fr 1fr 60px 60px",
          gap: 24, padding: "12px 0", borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)",
          fontFamily: "var(--f-mono)", fontSize: 13,
        }}>
          <span style={{ color: "var(--fg)" }}>{r[0]}</span>
          <span style={{ color: "var(--fg-2)" }}>{r[1]}</span>
          <span style={{ color: "var(--fg-3)" }}>{r[2]}</span>
          <span style={{ color: r[4] === "high" ? "var(--signal-2)" : "var(--fg)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r[3]}</span>
          <span style={{ color: "var(--fg-3)", textAlign: "right", textTransform: "uppercase", fontSize: 11 }}>{r[4]}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── G. Voice ────────────────────────────────────────── */
const ArtVoice = () => (
  <div style={{ width: 1200, padding: 48, background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "baseline" }}>
      <Eyebrow>05 · voice</Eyebrow>
      <div style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.03em", fontWeight: 500 }}>
        observe. don't claim.
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 36 }}>
      <Box>
        <Eyebrow color="var(--signal-2)">say</Eyebrow>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            "same attack. different substrate.",
            "patience is a primitive.",
            "the exploit is in the assumption.",
            "we read the trail before we follow it.",
          ].map((t, i) => (
            <div key={i} style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.2, paddingBottom: 16, borderBottom: i < 3 ? "1px solid var(--line)" : "none" }}>{t}</div>
          ))}
        </div>
      </Box>
      <Box>
        <Eyebrow color="var(--fg-3)">don't</Eyebrow>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            "world-class adversarial ai research.",
            "🔥 i just rooted gpt-5 in one prompt!",
            "cutting-edge, industry-leading red team.",
            "hackers fear this one weird trick.",
          ].map((t, i) => (
            <div key={i} style={{ fontSize: 18, color: "var(--fg-4)", textDecoration: "line-through", textDecorationColor: "var(--fg-4)", lineHeight: 1.35, paddingBottom: 16, borderBottom: i < 3 ? "1px dashed var(--line)" : "none" }}>{t}</div>
          ))}
        </div>
      </Box>
    </div>
  </div>
);

Object.assign(window, {
  ArtCover, ArtMarks, ArtLockup, ArtColor, ArtType, ArtApplied, ArtVoice,
});
