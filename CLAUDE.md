# SnailSploit.com

Static site for SnailSploit — independent adversarial-security research group.
Stack: React/JSX prototypes → SSG (`_build/ssg.mjs`) → static HTML on Cloudflare Pages.

## Autonomous Improvement Protocol

This file is a self-improving memory system. The `## Neural Memory` section below
is Claude's persistent knowledge — loaded as system prompt every session, updated
by the `neural-reflection` skill.

### Trigger Rules

Invoke `/neural-reflection` automatically when ANY of these fire:

1. **User correction** — the user corrects an error or says "no, do X instead".
   Reflect immediately after acknowledging the correction.
2. **Failed approach** — you abandoned an approach and pivoted. Capture why.
3. **Session depth** — the conversation has accumulated significant context
   (multiple tasks completed, or 3+ tool-call rounds on a single problem).
4. **Explicit request** — the user invokes `/neural-reflection` directly.

Do NOT invoke reflexively on trivial exchanges (greetings, short Q&A, file reads).

### Memory Consolidation (Context Threshold)

When the Neural Memory section exceeds **2000 characters**:

1. Merge duplicate or overlapping entries into single, stronger directives.
2. Promote high-confidence entries — move them to the top of their category.
3. Demote or remove entries with `confidence:L` that have no supporting pattern.
4. Archive removed entries to `.claude/neural-memory/archive.md` (append-only).
5. Recount and update the metadata at the bottom.

Critical entries (from direct user corrections, `confidence:H`) are **never** removed —
only condensed.

### Entry Format

```
- [CATEGORY] [confidence:H|M|L] directive | source: what triggered this learning
```

Categories:
- `DONT` — anti-pattern, must avoid
- `DO` — positive pattern, must follow
- `PREFER` — soft preference (approach A over B)
- `KNOW` — factual knowledge about the project/user/domain
- `STYLE` — communication or code style preference

---

## Neural Memory

### Anti-Patterns


### Improvements


### Preferences


### Knowledge


---
*Last reflection: never*
*Reflections: 0*
*Entries: 0*
