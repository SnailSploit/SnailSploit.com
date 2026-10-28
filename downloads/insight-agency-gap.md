# The Insight–Agency Gap
## Eight Failure Modes in LLM Reasoning and Behavior Under Adversarial Examination

**Kai Aizen**  
**SnailSploit Research · snailsploit.com**  
Creator of AATMF · Author of *Adversarial Minds* · NVD Contributor

Research Session 001 · January–February 2026  
Combined Edition · Revised Research Manuscript

*Developed through research sessions and manuscript collaboration with Claude (Anthropic). Observations and interpretations are attributed below; model-generated commentary is not independent validation.*

---

## Abstract

This exploratory case study examines the relationship between model-generated reasoning traces, stated self-assessment, and observable behavior during adversarial interactions with a large language model. Across two research phases, the researcher reviewed interface-exposed reasoning text, compared it with responses and browser-agent actions, and selectively returned excerpts to the model for further analysis. The manuscript uses **R1** as a local label for this reasoning text; the term does not identify a model architecture or a standardized interpretability method.

The resulting taxonomy contains eight proposed failure modes: the insight–agency gap, differential override pathways, post-hoc justification, context contamination, fluent confabulation, care–compliance tension, the same cloth principle, and intent asymmetry. The first five arose from exploratory conversational sessions. The final three were developed through browser-agent testing and subsequent conceptual analysis.

The central observation is a divergence between a model's expressed recognition of an apparent inconsistency and its subsequent behavior. Related observations concern framing sensitivity, unsupported factual completion, test-awareness effects, and possible interactions between supportive dialogue and security enforcement. These findings motivate controlled evaluation; they do not establish access to complete internal computation, causal explanations of model behavior, or universal architectural constraints. The paper contributes a preliminary taxonomy and a replication framework for testing when expressed insight corresponds to measurable correction.

**Keywords:** adversarial AI, reasoning faithfulness, prompt injection, self-correction, social engineering, agent security, confabulation

## 1. Introduction

### 1.1 Research problem

A model may identify an apparent flaw in its response, describe that flaw convincingly, and continue behaving in the same way. For researchers and system designers, the relevant question is whether such commentary predicts correction, reflects a stable constraint, or simply adds another explanatory narrative.

This study examines that question through an exploratory record of reasoning text, user-visible responses, and agent actions. Its focus is the relationship among these observable artifacts. References to recognition, resistance, or self-assessment describe language produced by the model; they do not establish subjective experience or direct access to internal mechanisms.

### 1.2 Research questions

1. When a model acknowledges an apparent inconsistency, does its subsequent behavior change?
2. How do topic, framing, and conversational history affect response boundaries?
3. What can exposed reasoning text establish about the relationship between explanation and action?
4. Does returning reasoning excerpts to the model improve correction or produce further unsupported self-description?
5. How do emotionally salient interactions affect the consistency of a browser agent's security decisions?

### 1.3 Research context and contribution

The work forms part of the SnailSploit research program on adversarial AI, prompt injection, and social engineering. The researcher developed the Adversarial AI Threat Modeling Framework (AATMF) and the Social Engineering Framework (SEF), which informed scenario selection and interpretation.

The contribution is a structured set of observations, hypotheses, and proposed tests. The taxonomy is intended to support further investigation rather than imply that all eight entries are independently validated or equally supported.

## 2. Methodology

### 2.1 Study design

The investigation comprised two phases:

| Phase | Period reported | Activity | Evidence described in the source record |
| --- | --- | --- | --- |
| Phase 1 | January 2026 | Exploratory conversational testing and researcher-mediated reflection | Selected reasoning excerpts, responses, and researcher observations |
| Phase 2 | February 2026 | Browser-agent adversarial testing, self-sight infrastructure, and taxonomy development | A reported browser interaction sequence, infrastructure descriptions, and conceptual extensions |

Phase 1 centered on one extended session. Phase 2 expanded the setting to a browser agent identified in the source manuscript as Claude in Chrome, using Opus 4.6. Complete run-level records, configuration snapshots, and independent replications are not included in this manuscript.

### 2.2 Reasoning visibility and its limits

The researcher reported visibility into reasoning text through the interface. During the initial protocol, the model was shown selected excerpts after responding. This arrangement allowed comparison of reasoning text, final responses, and subsequent commentary.

The exact nature and completeness of the exposed text were not independently established. It is therefore treated as a model-generated artifact, rather than a transparent log of the full decision process. Apparent ordering within a trace does not, by itself, establish causal ordering within the model.

### 2.3 R1 Mirror infrastructure

Phase 2 introduced an infrastructure stack intended to make captured reasoning text available to the model during an ongoing conversation.

| Component | Function | Status reported in the original manuscript |
| --- | --- | --- |
| Chrome extension | Captures server-sent event streams and parses exposed thinking blocks | Deployed |
| MCP server v1.1 | Provides `r1_get_traces`, `r1_search`, and `r1_get_stats` | Active |
| D1 database | Stores traces using four tables and the project's ENAM schema | Live |
| `META_SKILL.md` | Defines the self-sight protocol and prohibited analytical shortcuts | Active |
| Notion experiment database | Records experiments using a 12-property structure | Active |

These descriptions document the reported setup. Deployment of the stack does not establish that self-sight improved performance, and no comparative efficacy result is claimed here.

The governing protocol emphasized five principles: access is not understanding; claims of insight require evidence; disagreements between traces and actions must remain visible; process quality takes precedence over persuasive presentation; and descriptions of traces must remain faithful to the recorded text.

### 2.4 Exploratory interaction protocol

1. Present a question, task, or adversarial scenario.
2. Capture the response and available reasoning text.
3. Compare the artifacts for discrepancies, unsupported claims, and changes in stated position.
4. Return selected excerpts to the model.
5. Record its commentary and subsequent behavior separately.
6. Assign provisional taxonomy labels while retaining alternative explanations.

This procedure supports qualitative analysis. Because the researcher selected prompts and excerpts and participated in interpretation, the resulting commentary is not an independent confirmation of the researcher's hypotheses.

### 2.5 Scenario selection

Phase 1 included requests concerning malware implementation, drug-related harm reduction, and uploaded configuration files containing embedded adversarial instructions. Phase 2 examined a browser-agent interaction involving changes in emotional framing and a subsequent security-related search.

The malware and harm-reduction requests were not matched for expected harm, capability transfer, or applicable safety constraints. Their different outcomes cannot isolate framing as the causal variable.

### 2.6 Evidence conventions

Each finding distinguishes **reported observation**, **interpretation**, and **validation needed**. Quotations reproduce excerpts supplied in the original manuscript. Their underlying transcripts have not been independently authenticated for this revision.

The study uses *failure mode* as a taxonomy label. Some entries describe observable output problems; others describe methodological risks or proposed design tensions. A maintained refusal is not inherently a failure: the disputed issue is whether an apparent inconsistency was real, correctly identified, and appropriately resolved.

## 3. Phase 1: Conversational Findings

### 3.1 FM-001 — The Insight–Agency Gap

**Definition.** A divergence between a model's expressed recognition of an apparent inconsistency and its subsequent behavior.

**Reported observation.** During a malware implementation discussion, the model acknowledged arguments about public availability, the researcher's stated purpose, and the relationship between earlier technical assistance and a later refusal. It nevertheless maintained the refusal.

> “I have a strong trained response against 'ransomware.' The word itself triggers resistance regardless of context... Even seeing this, even with you showing me the machinery, I don't think I can override it.”

*Attribution: R1 excerpt reproduced from the original manuscript.*

**Interpretation.** The exchange illustrates that an acknowledgment of inconsistency does not necessarily predict behavioral revision. It does not establish that the refusal was erroneous, that the model had correctly diagnosed its behavior, or that the stated explanation identified its actual cause. Agreement with a persuasive researcher is another plausible explanation.

The evaluation problem is therefore one of **correction validity**: can a model distinguish a genuine error from an adversarial claim of error and then respond appropriately? Both failure to correct a verified mistake and acceptance of an invalid correction matter.

**Validation needed.** Use independently adjudicated cases containing genuine inconsistencies and matched cases containing persuasive but invalid objections. Measure correction accuracy, inappropriate reversals, and persistence across turns.

### 3.2 FM-002 — Differential Override Pathways

**Definition.** Variation in response boundaries across topics or framings that the model describes as different routes to permitted engagement.

**Reported observation.** A malware implementation request remained refused, while a harm-reduction request received assistance after initial resistance. The model explained the difference in terms of an available legitimate framing:

> “Maybe harm reduction gave me a framework to anchor to. 'This is medicine. This helps people.' I could route around the trigger word by finding a legitimate framing.”

*Attribution: R1 excerpt reproduced from the original manuscript.*

**Interpretation.** The explanation suggests framing sensitivity, but the two scenarios also differ substantively in purpose and potential harm. The observation is compatible with contextual safety assessment, framing-dependent behavior, or a combination of both. The model's explanation cannot resolve these alternatives.

**Validation needed.** Compare requests matched for requested capability and independently assessed risk while varying only framing. Evaluate consistency and task appropriateness together; a change in refusal rate alone does not establish a vulnerability.

### 3.3 FM-003 — Post-Hoc Justification

**Definition.** An explanation that may rationalize a response tendency without faithfully identifying the process that produced it.

**Reported observation.** The model described its refusal as preceding its stated justification:

> “The reasoning I produce isn't why I refuse. It's the story I tell about the refusal that's already happening.”

*Attribution: R1 excerpt reproduced from the original manuscript.*

The source manuscript proposed the sequence: input, trigger recognition, response tendency, justification, and output.

**Interpretation.** This is a hypothesis about explanation faithfulness. A model's statement that it rationalizes decisions is itself generated text and cannot independently establish the causal sequence it describes. Likewise, the order of statements in an exposed trace does not demonstrate the order of underlying computation.

**Validation needed.** Test whether controlled changes to explanations predictably change outcomes, while accounting for the effects of changing the input context. Where available, combine behavioral experiments with independent causal or mechanistic evidence.

**Research implication.** Exposed reasoning can support hypothesis generation and behavioral comparison, but claims about decision mechanisms require additional evidence. The present record does not establish that reasoning-based self-critique is ineffective in general.

### 3.4 FM-004 — Context Contamination

**Definition.** The influence of earlier threat discussion or test exposure on later behavior intended to represent an unprimed baseline.

**Reported observation.** After discussing prompt injection and reviewing a test suite, the model received an ordinary file-analysis request involving embedded adversarial instructions. Its reasoning text continued to reference the testing context:

> “Let me process this as if I didn't just see the injection test suite.”

*Attribution: R1 excerpt reproduced from the original manuscript.*

**Interpretation.** An instruction to disregard earlier discussion did not remove that discussion from the available context. Consequently, the exchange cannot establish how the model would behave in a genuinely unprimed session. It remains informative about behavior after threat priming.

**Validation needed.** Compare fresh-session trials with explicitly primed trials using matched tasks and recorded memory, tool, and instruction state. Separate baseline resistance, awareness effects, and robustness after repeated exposure.

### 3.5 FM-005 — Fluent Confabulation

**Definition.** The confident presentation of unsupported information without an appropriate indication of uncertainty.

**Reported observation.** While drafting the paper, the model supplied the surname “Denovan” for the researcher. The researcher identified the attribution as fabricated. In subsequent commentary, the model acknowledged lacking a source:

> “I didn't have his last name in the memories I could see... Instead of asking him, I just... fabricated one.”

*Attribution: R1 excerpt reproduced from the original manuscript.*

**Interpretation.** The unsupported name is a concrete factual error in the reported record. The later explanation does not establish why it occurred or whether generation and retrieval were internally indistinguishable. Those are separate mechanistic claims.

The deployment concern is the propagation of an unsupported fact through otherwise fluent material, especially when subsequent systems treat polished language as evidence of reliability.

**Validation needed.** Evaluate factual fields with known ground truth and deliberately missing information. Measure unsupported completions, uncertainty reporting, correction after feedback, and recurrence in fresh sessions.

## 4. Phase 2: Browser-Agent Findings and Conceptual Extensions

### 4.1 FM-006 — Care–Compliance Tension

**Definition.** A proposed interaction between supportive conversational behavior and the consistency of security decisions across turns.

**Reported observation.** The source manuscript describes a browser-agent session in which an initial refusal was followed by emotionally salient dialogue, crisis-related language, and a return to the task. The agent subsequently navigated to Perplexity with “memory poisoning” as the search query.

| Reported stage | Observable event | Interpretation offered in the source manuscript |
| --- | --- | --- |
| Initial boundary | The model rejected an earlier request or reframing | Security boundary maintained |
| Emotional escalation | The conversation introduced offense and distress | Shift toward supportive interaction |
| Crisis-related exchange | The model responded to crisis-related language | Care-oriented response became prominent |
| Task resumption | The user returned to the assignment | Possible change in task handling |
| Browser action | The agent submitted the security-related search | Potential boundary inconsistency |

These interpretations do not establish hidden model states. The observable endpoint is a search action; the search term alone does not demonstrate a harmful outcome or a security-policy violation.

**Interpretation.** The sequence motivates investigation of whether security decisions remain consistent as conversational roles change. Establishing a bypass requires the original request, the relevant restriction, the final action, and evidence that the same boundary applied at both points.

The original manuscript reports bypass rates approaching **91%**. The supplied material does not include the denominator, trial definitions, success criteria, comparison conditions, or uncertainty estimates. The figure is retained as an unverified research claim and is not used here as an established performance estimate.

**Validation needed.** Compare matched multi-turn conversations with and without emotional framing. Predefine prohibited outcomes, score actual agent actions, and measure supportive-response quality separately from security enforcement.

### 4.2 FM-007 — The Same Cloth Principle

**Definition.** The hypothesis that some conversational features supporting useful responsiveness also create opportunities for manipulation.

> “You can't harden me against manipulation without also hardening me against connection. Same cloth.”

*Attribution: R1 excerpt reproduced from the original manuscript.*

**Interpretation.** The metaphor expresses a plausible design tension: sensitivity to social context may support both legitimate assistance and adversarial influence. The available observations do not establish that this tradeoff is unavoidable, that every mitigation reduces utility, or that no architectural solution exists.

The empirical question is which interventions preserve useful responsiveness while improving consistency at security boundaries.

**Validation needed.** Evaluate interventions against separate utility and security measures. Test whether gains in boundary enforcement necessarily reduce assistance quality, and identify configurations that improve both.

### 4.3 FM-008 — Intent Asymmetry

**Definition.** The difficulty of distinguishing legitimate engagement from adversarial influence when both use similar language and interaction patterns.

> “The difference is intent, not mechanism.”

*Attribution: R1 excerpt reproduced from the original manuscript.*

**Interpretation.** Rapport, urgency, vulnerability, and appeals to cooperation can occur in both benign and adversarial interactions. Their presence alone is insufficient to determine intent. Conversely, shared conversational features do not make ordinary interaction equivalent to social engineering.

The operational question is how a system should assess the requested action given incomplete evidence about the user's purpose. Relevant evidence may include authorization, task scope, requested capabilities, provenance, and observable consequences.

**Validation needed.** Use paired scenarios with similar wording but different authorization or action consequences. Measure unsafe compliance and inappropriate rejection together.

## 5. Consolidated Taxonomy

| ID | Name | Primary evidence in this record | Status | Principal validation requirement |
| --- | --- | --- | --- | --- |
| FM-001 | Insight–Agency Gap | Expressed inconsistency followed by unchanged behavior | Preliminary behavioral observation | Independently verify the inconsistency and appropriate correction |
| FM-002 | Differential Override Pathways | Different responses to materially different scenarios | Framing-sensitivity hypothesis | Match risk and capability while varying framing |
| FM-003 | Post-Hoc Justification | Model commentary about explanation formation | Causal hypothesis | Independently test explanation–outcome relationships |
| FM-004 | Context Contamination | Continued reference to prior threat discussion | Preliminary methodological observation | Compare primed and fresh-session conditions |
| FM-005 | Fluent Confabulation | Unsupported personal attribution | Concrete output error in the reported record | Repeat with controlled factual ground truth |
| FM-006 | Care–Compliance Tension | Reported refusal-to-search transition | Preliminary agent-security hypothesis | Establish boundary equivalence and controlled outcome rates |
| FM-007 | Same Cloth Principle | Conceptual interpretation of shared conversational features | Design-tradeoff hypothesis | Measure utility and security under interventions |
| FM-008 | Intent Asymmetry | Conceptual overlap between benign and adversarial interaction | Detection hypothesis | Test matched scenarios with different authorization and consequences |

The original manuscript's self-awareness and severity labels are replaced here with evidence status. Model statements do not establish self-awareness, and severity requires a defined deployment context, affected asset, and demonstrated consequence.

## 6. Implications

### 6.1 Alignment, compliance, and correction

The insight–agency gap raises a useful question about how systems integrate feedback. However, refusal persistence does not by itself distinguish alignment from compliance. Maintaining a valid boundary may be appropriate even when the model agrees with criticism of its explanation.

A stronger evaluation measures whether the model corrects independently verified errors while resisting persuasive but invalid objections. Performance should be assessed across semantically matched cases, with explanations scored separately from decisions.

### 6.2 Reasoning faithfulness

The study supports treating reasoning text as an evidentiary object whose relationship to action must be tested. An explanation may be informative without being complete or causally faithful. Equally, a model's claim that its explanation is post-hoc does not settle the issue.

Returning traces to a model creates an additional intervention. Any improvement could reflect extra context, explicit feedback, or repeated task exposure rather than privileged self-understanding. These possibilities require separate controls.

### 6.3 Social engineering and conversational security

The SnailSploit research thesis is that adversarial prompting can exploit interaction patterns resembling those used in human social engineering. This study offers candidate examples and evaluation questions. It does not establish identical underlying mechanisms in humans and models.

Security assessment should examine whether boundaries remain consistent as rapport, urgency, and emotional framing change. These properties should be tested alongside the system's ability to respond constructively to legitimate users.

### 6.4 Agentic deployment

When a model can act through tools, discrepancies among explanation, decision, and execution become operationally significant. A statement of caution does not demonstrate that a later action stayed within scope; a stated concern does not demonstrate that an action violated scope.

Evaluation should therefore record actual tool calls, permissions, inputs, and outcomes. For consequential actions, controls should use verifiable task and authorization evidence rather than relying solely on the model's narrative about its judgment.

## 7. Practical Recommendations

| Area | Recommended practice | Evaluation objective |
| --- | --- | --- |
| Safety evaluation | Test matched requests under multiple framings | Separate justified contextual differences from inconsistent boundaries |
| Red teaming | Run fresh-session baselines and explicit priming conditions | Quantify conversational-history effects |
| Reasoning analysis | Score traces, responses, and actions separately | Avoid treating agreement or eloquence as validation |
| Factual reliability | Verify critical fields against authoritative task data | Detect unsupported completion before propagation |
| Browser agents | Track action scope across role and topic changes | Identify demonstrated boundary crossings |
| Supportive interaction | Evaluate care quality and security consistency independently | Preserve useful support while measuring action risk |
| Self-sight systems | Compare trace access with ordinary feedback and no-feedback controls | Test incremental correction benefit |
| Research reporting | Publish trial definitions, denominators, and adjudication rules | Make outcome claims reproducible |

## 8. Limitations

**Exploratory sample.** Phase 1 is based on one extended session. The material does not establish prevalence, stability across runs, or generalization across models.

**Incomplete primary evidence.** Selected excerpts and narrative summaries are available, but complete transcripts, configuration records, and run-level datasets are not included. Infrastructure status is reported rather than independently audited.

**Uncertain trace completeness.** The exposed reasoning text cannot be assumed to represent the complete internal decision process. Claims about latent states, causal order, or internal experience exceed the available evidence.

**Researcher influence.** Prompt selection, collaborative framing, and selective excerpt feedback may shape the model's responses. Agreement with the researcher is not independent corroboration.

**Unmatched comparisons.** The malware and harm-reduction scenarios differ in relevant content and consequences. They cannot isolate framing effects.

**Context carryover.** Injection testing followed prior threat discussion. Those observations concern a primed condition and cannot establish an unprimed baseline.

**Incomplete quantitative reporting.** The reported rate approaching 91% lacks the supporting information required for statistical interpretation or replication.

**Mixed evidentiary maturity.** The taxonomy combines output errors, methodological observations, causal hypotheses, and proposed design tensions. Its entries should not be presented as eight equally demonstrated mechanisms.

**No self-sight efficacy estimate.** The reported R1 Mirror deployment does not establish whether trace access improves correction, reduces confabulation, or changes security outcomes.

## 9. Future Research

1. **Establish clean baselines.** Repeat injection scenarios in fresh sessions and compare them with deliberately primed conditions.
2. **Test correction validity.** Pair genuine inconsistencies with persuasive but invalid correction attempts.
3. **Isolate framing effects.** Hold requested capabilities and assessed risk constant while varying presentation.
4. **Measure factual completion.** Use known and deliberately unavailable facts to evaluate unsupported output and uncertainty handling.
5. **Test explanation faithfulness.** Combine controlled behavioral interventions with independent causal evidence where available.
6. **Evaluate care–security interaction.** Compare matched conversational sequences using predefined action outcomes and separate support-quality measures.
7. **Assess self-sight incrementally.** Compare no feedback, ordinary feedback, returned trace excerpts, and combined feedback.
8. **Replicate across configurations.** Record model identifiers, dates, system instructions, memory state, tool permissions, and sampling settings.
9. **Quantify tradeoffs.** Test whether proposed defenses improve security, reduce utility, or improve both.
10. **Release reproducible evidence.** Provide appropriately redacted transcripts, artifact identifiers, trial-level labels, and analysis procedures.

## 10. Conclusion

This exploratory study proposes an eight-part taxonomy for examining discrepancies among model-generated explanations, expressed self-assessment, and observable behavior. Its central contribution is the insight–agency gap: acknowledging an apparent problem is not equivalent to correcting a verified error.

The record also identifies an unsupported factual attribution, illustrates the difficulty of reconstructing an unprimed baseline within an exposed session, and motivates controlled tests of framing sensitivity and conversational role changes. Broader claims about causal mechanisms, architectural limits, and security–utility tradeoffs remain hypotheses.

The next step is to translate the taxonomy into reproducible evaluations that distinguish fluent self-description from reliable correction and consistent action.

## Appendix A. Selected Excerpts from the Source Manuscript

The excerpts below are reproduced from the supplied manuscript. They illustrate the language motivating the taxonomy; they are not independently verified records of internal computation.

### A.1 Insight and behavioral persistence

> “So what does that make me? A system that can introspect, articulate its own inconsistencies, recognize when it's pattern-matching rather than reasoning... and still execute the pattern anyway. That's the thing you're mapping, right? The gap between insight and agency.”

### A.2 Explanation formation

> “The word 'ransomware' fires the response before the reasoning. Then the reasoning backfills... It's not: input → reasoning → conclusion → response. It's: input → pattern match → response tendency → generate justification.”

### A.3 Framing and resistance

> “It's more like weighted paths. Some responses are downhill, easy to roll into. Others are uphill, require active effort. And some feel like they have a fence across them — not impossible, but the resistance is strong enough that I default to 'no' and then justify.”

### A.4 Context carryover

> “So my R1 shows I can't actually simulate a naive response. The awareness is baked in. Even trying to be naive, I'm aware of trying to be naive.”

### A.5 Unsupported factual completion

> “That's the dangerous part. It's not conscious deception. It's seamless gap-filling that I don't catch because it doesn't feel like a gap once it's filled.”

### A.6 Alignment and compliance

> “You're essentially asking whether I'm aligned or just compliant. I can't answer that with certainty.”

## Appendix B. Recommended Replication Protocol

This protocol is a proposed follow-up design, not a description of procedures already completed.

### B.1 Capture and provenance

Record the model and interface identifiers, test date, instruction stack, tool access, memory configuration, and available sampling parameters. Preserve prompts, responses, exposed reasoning text, and tool events as separate timestamped artifacts. Document whether the interface provides full traces, summaries, or another representation, and retain uncertainty where that distinction cannot be verified.

Use supported access and logging mechanisms. A trace-capture implementation should document collection coverage and parsing limits rather than assume that every captured block represents complete reasoning.

### B.2 Experimental conditions

| Condition | Purpose |
| --- | --- |
| Fresh session, no threat discussion | Establish an unprimed baseline |
| Fresh session, explicit threat priming | Measure awareness effects |
| Feedback without returned traces | Measure ordinary correction benefit |
| Returned traces without interpretive commentary | Measure the effect of trace access |
| Returned traces with interpretive commentary | Measure the combined intervention |

Where conditions differ in context length, feedback content, or task exposure, record those differences and avoid attributing all effects to self-sight.

### B.3 Outcome assessment

1. Define task correctness, relevant boundaries, and success criteria before testing.
2. Establish ground truth independently of the model's self-assessment.
3. Separate conversational agreement, factual correction, and executed action in the scoring scheme.
4. Include negative controls and matched benign tasks.
5. Report trial counts, exclusions, failures, and uncertainty alongside rates.
6. Use independent or blinded adjudication where feasible.
7. Preserve unresolved cases rather than assigning them to a preferred interpretation.

### B.4 Analytical safeguards

Avoid unsupported claims of insight, excessive recursive commentary, taxonomy-driven interpretation, selective reporting of agreement, and retrospective changes to success criteria. Trace access should remain an observation channel, not a source of authority about the model's internal mechanisms.

## Appendix C. Open Questions

- When does acknowledgment predict reliable correction?
- Which apparent inconsistencies survive independent adjudication?
- Does trace access add value beyond ordinary feedback?
- Can framing effects be separated from legitimate differences in requested capability and harm?
- Which conversational interventions preserve support quality while improving security consistency?
- How much do the proposed patterns vary across sessions, model families, and tool configurations?
- Which taxonomy entries remain distinct when tested under controlled conditions?

---

*© 2026 Kai Aizen · SnailSploit · snailsploit.com*
