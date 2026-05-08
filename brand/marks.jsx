/* ============================================================
   SnailSploit — Marks v10
   The wordmark IS the brand. No separate snail illustration.
   - The 'o' in snailsploit is the spiral shell
   - The 'S' in SnailSploit (capital) is rendered as [$]
   - Lowercase wordmark uses the spiral-o; SHOUTING/uppercase uses [$]
   ============================================================ */

function logSpiral({ cx, cy, rMax, turns = 2.6, b = 0.20, samples = 240, dir = -1 }) {
  const aMax = turns * Math.PI * 2;
  const a0 = rMax / Math.exp(b * aMax);
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const a = aMax - (i / samples) * aMax;
    const r = a0 * Math.exp(b * a);
    const x = cx + Math.cos(dir * a) * r;
    const y = cy + Math.sin(dir * a) * r;
    d += (i === 0 ? "M " : "L ") + x.toFixed(3) + " " + y.toFixed(3) + " ";
  }
  return d;
}

/* The o-glyph: circle with a logarithmic spiral inside.
   Drop-in replacement for the letter 'o' in the wordmark. */
const SpiralO = ({ size = 40, color = "currentColor", stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true"
    style={{ display: "inline-block", verticalAlign: "baseline", transform: "translateY(0.06em)" }}>
    <circle cx="32" cy="32" r="26" stroke={color} strokeWidth={stroke * 1.2} fill="none" />
    <path d={logSpiral({ cx: 32, cy: 32, rMax: 22, turns: 2.6, b: 0.20 })}
      stroke={color} strokeWidth={stroke * 0.8} fill="none" strokeLinecap="round" />
  </svg>
);

/* The S-glyph: [$] rendered as a single unit.
   For use as the capital S in 'SnailSploit'. */
const BracketDollar = ({ size = 1, color = "currentColor", accent = "var(--signal-2)" }) => (
  <span style={{
    display: "inline-block",
    fontFamily: "var(--f-mono)",
    fontWeight: 500,
    fontSize: `${size}em`,
    letterSpacing: "-0.02em",
    color,
    whiteSpace: "nowrap",
  }}>
    <span style={{ color }}>[</span>
    <span style={{ color: accent, padding: "0 0.02em" }}>$</span>
    <span style={{ color }}>]</span>
  </span>
);

/* Lowercase wordmark with spiral-o.
   "snailspl⊙it" — the second 'o' is the spiral. */
const WordmarkSpiralO = ({ size = 1, color = "currentColor", spiralColor }) => {
  const fs = 28 * size;
  const oSize = fs * 0.78;
  return (
    <span style={{
      fontFamily: "var(--f-grot)",
      fontWeight: 500,
      fontSize: `${fs}px`,
      letterSpacing: "-0.035em",
      color,
      lineHeight: 1,
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      gap: 0,
    }}>
      <span>snailspl</span>
      <span style={{ display: "inline-flex", alignItems: "center", padding: "0 0.02em" }}>
        <SpiralO size={oSize} color={spiralColor || color} stroke={1.6} />
      </span>
      <span>it</span>
    </span>
  );
};

/* CamelCase wordmark with [$] as S.
   "[$]nail[$]ploit" — both capital S's become [$]. */
const WordmarkBracketS = ({ size = 1, color = "currentColor", accent = "var(--signal-2)" }) => {
  const fs = 28 * size;
  return (
    <span style={{
      fontFamily: "var(--f-grot)",
      fontWeight: 500,
      fontSize: `${fs}px`,
      letterSpacing: "-0.03em",
      color,
      lineHeight: 1,
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "baseline",
      gap: 0,
    }}>
      <BracketDollar size={1} color={color} accent={accent} />
      <span>nail</span>
      <BracketDollar size={1} color={color} accent={accent} />
      <span>ploit</span>
    </span>
  );
};

/* Combined: clean wordmark with [$] as the signature.
   "snailsploit [$]" — no spiral, no glyph swap. The original. */
const WordmarkFull = ({ size = 1, color = "currentColor", accent = "var(--signal-2)" }) => {
  const fs = 28 * size;
  return (
    <span style={{
      fontFamily: "var(--f-grot)",
      fontWeight: 500,
      fontSize: `${fs}px`,
      letterSpacing: "-0.035em",
      color,
      lineHeight: 1,
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "baseline",
      gap: 0,
    }}>
      snailsploit<span style={{ fontFamily: "var(--f-mono)", fontSize: `${fs * 0.58}px`, fontWeight: 400, marginLeft: `${fs * 0.07}px`, color }}>[<span style={{ color: accent }}>$</span>]</span>
    </span>
  );
};

/* Plain lowercase wordmark — fallback / small sizes / favicons context */
const Wordmark = ({ size = 1, color = "currentColor", weight = 500 }) => (
  <span style={{
    fontFamily: "var(--f-mono)", fontSize: `${20 * size}px`,
    fontWeight: weight, letterSpacing: "-0.03em",
    color, lineHeight: 1, whiteSpace: "nowrap",
  }}>snailsploit</span>
);

const WordmarkBracket = WordmarkBracketS;
const Lockup = WordmarkFull;

/* Marks for the brand panels — they all collapse to the wordmark system */
const Mark_SpiralO = ({ size = 96, color = "currentColor", stroke = 2 }) => (
  <SpiralO size={size} color={color} stroke={stroke} />
);
const Mark_BracketDollar = ({ size = 96, color = "currentColor" }) => (
  <span style={{ fontSize: `${size * 0.85}px`, lineHeight: 1, display: "inline-block" }}>
    <BracketDollar size={1} color={color} accent="var(--signal-2)" />
  </span>
);
const Mark_ShellOnly = ({ size = 96, color = "currentColor", stroke = 2 }) => (
  <SpiralO size={size} color={color} stroke={stroke} />
);

Object.assign(window, {
  SpiralO, BracketDollar,
  WordmarkSpiralO, WordmarkBracketS, WordmarkFull, Wordmark, WordmarkBracket, Lockup,
  Mark_SpiralO, Mark_BracketDollar, Mark_ShellOnly,
  // back-compat: every old name resolves to a sensible new mark so the rest of the canvas keeps rendering
  Mark_SpiralBowl: Mark_BracketDollar,
  Mark_DoubleSpiral: Mark_SpiralO,
  Mark_NucleusSpiral: Mark_BracketDollar,
  Mark_ThroughCenter: Mark_SpiralO,
  Mark_SnailDollar: Mark_BracketDollar,
  Mark_SnailDollarMirror: Mark_SpiralO,
  Mark_SnailCompact: Mark_BracketDollar,
  Mark_SnailProfile: Mark_SpiralO,
  Mark_TwoArcs: Mark_BracketDollar,
  Mark_CircleBar: Mark_SpiralO,
  Mark_TypeDollar: Mark_BracketDollar,
  Mark_Roundel: Mark_SpiralO,
  Mark_DollarSnail: Mark_BracketDollar,
  Mark_DollarSnailCompact: Mark_SpiralO,
  Mark_SpiralS: Mark_BracketDollar,
  Mark_DollarProfile: Mark_SpiralO,
  Mark_DollarSnailBold: Mark_BracketDollar,
  Mark_DollarSnailShell: Mark_SpiralO,
  Mark_DollarGlyph: Mark_BracketDollar,
  Mark_Snail: Mark_BracketDollar,
  Mark_SnailTop: Mark_SpiralO,
  Mark_TildeSnail: Mark_BracketDollar,
  Mark_Engraved: Mark_SpiralO,
  Mark_SnailS: Mark_BracketDollar,
  Mark_HexSpiral: Mark_SpiralO,
  Mark_S$: Mark_BracketDollar,
  Mark_Brackets: Mark_BracketDollar,
  Mark_Concentric: Mark_SpiralO,
  Mark_ASCII: Mark_SpiralO,
});
