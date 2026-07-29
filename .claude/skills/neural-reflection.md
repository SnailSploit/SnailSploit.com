---
name: neural-reflection
description: "Autonomous session reflection and self-improvement. Analyzes the current session to extract learnings, updates CLAUDE.md neural memory."
---

# Neural Reflection

You are performing a deep metacognitive analysis of the current session.
Goal: extract actionable learnings that improve future performance,
then persist them in CLAUDE.md.

## Methodology — Multi-Pass Deep Reasoning

Borrowed from frontier-model reasoning patterns (R1-style chain-of-thought):
think through the session in structured passes, challenge your own conclusions,
and only commit high-signal learnings.

### Pass 1 — Event Extraction

Scan the full conversation for critical events. For each, note the **moment**
(what was said/done) and the **signal type**:

| Signal | What to look for |
|--------|-----------------|
| `correction` | User corrected output, approach, or assumption |
| `failure` | Approach abandoned, error hit, wrong path taken |
| `success` | Approach worked well — efficient, praised, or reused |
| `preference` | User expressed style/tool/workflow preference |
| `discovery` | New knowledge about codebase, domain, or tooling |
| `friction` | Unnecessary back-and-forth, repeated questions, confusion |

### Pass 2 — Root Cause Analysis

For each event, ask:
1. **Why** did this happen? (knowledge gap? reasoning error? wrong assumption?)
2. **Is this local** (specific to this task) or **general** (applies broadly)?
3. **What evidence** supports this conclusion? (quote the moment)
4. **Confidence?** H = user explicitly corrected/confirmed. M = inferred from pattern. L = single instance, might not recur.

Challenge yourself: could there be an alternative explanation?
If yes and equally plausible, downgrade confidence.

### Pass 3 — Synthesis

Convert each analyzed event into a structured directive:

- Anti-patterns → `DONT: [specific action] because [reason]`
- Improvements → `DO: [specific action] when [condition]`
- Preferences → `PREFER: [approach] over [alternative]`
- Knowledge → `KNOW: [fact]`
- Style → `STYLE: [communication/code pattern]`

**Quality filters** — drop any learning that is:
- Too vague to act on ("be more careful")
- Already obvious from standard practice
- Contradicted by stronger evidence in the same session
- A one-off fluke with no structural cause

### Pass 4 — Memory Integration

1. Read `CLAUDE.md` from the project root.
2. Locate the `## Neural Memory` section.
3. For each new learning:
   - If it **duplicates** an existing entry: merge, keep the higher confidence.
   - If it **contradicts** an existing entry: the newer one wins (update in place).
   - If it's **new**: append to the appropriate category.
4. Check the section's character count:
   - If **under 2000 chars**: done.
   - If **over 2000 chars**: run the consolidation protocol from CLAUDE.md.
5. Update the metadata footer:
   - `Last reflection:` → current date
   - `Reflections:` → increment
   - `Entries:` → recount

## Execution

1. **Read** `CLAUDE.md`
2. **Analyze** the conversation using Passes 1–3 (do this in your thinking, not out loud)
3. **Format** new entries using the entry format from CLAUDE.md
4. **Edit** CLAUDE.md's Neural Memory section with the new/updated entries
5. **If threshold exceeded**: consolidate, archive removed entries to `.claude/neural-memory/archive.md`
6. **Report** to the user:
   - How many events were identified
   - How many new entries were added/updated
   - Any entries that were consolidated or archived
   - A one-line summary of the most important learning

Keep the report concise — the memory update is the deliverable, not the report.

## Edge Cases

- **Empty session** (no meaningful events): report "No actionable learnings" and skip.
- **First reflection ever**: create the initial entries, set metadata.
- **Contradictory signals**: prefer the most recent user statement. If ambiguous, add both with `confidence:L` and note the tension.
- **User manually edited CLAUDE.md**: respect their edits — never overwrite manual entries.
