/** Rebuild this article from its preserved manuscript: node _build/insight-agency.mjs */
import fs from 'node:fs';
import { marked, Renderer } from 'marked';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const write = (p, s) => { const u = new URL(p, root); fs.mkdirSync(new URL('.', u), {recursive:true}); fs.writeFileSync(u, s); };
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const slug = 'insight-agency-gap';
const route = `/ai-security/${slug}/`;
const url = `https://snailsploit.com${route}`;
const title = 'The Insight–Agency Gap';
const desc = 'Eight proposed failure modes in LLM reasoning and behavior under adversarial examination. An exploratory case study with evidence limits and a replication framework.';
const asset = `/images/${slug}/`;
const manuscript = read(`downloads/${slug}.md`);
const toc = [];
const renderer = new Renderer();
renderer.heading = function({tokens, depth}) {
  const text = this.parser.parseInline(tokens);
  const id = text.replace(/<[^>]*>/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if (depth === 2) toc.push({id,text});
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};
let body = marked.parse(manuscript.slice(manuscript.indexOf('## Abstract')), {renderer});
body = body.replaceAll('<table>', '<div class="iag-table" role="region" aria-label="Research table" tabindex="0"><table>').replaceAll('</table>','</table></div>');

function svg(name, width, height, label, content) {
  write(`images/${slug}/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${esc(label)}</title><desc id="desc">Conceptual illustration based on the manuscript; no quantitative results are depicted.</desc><defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="#23252b" stroke-width=".6"/></pattern></defs><rect width="100%" height="100%" fill="#101114"/><rect width="100%" height="100%" fill="url(#grid)"/><g font-family="Arial, sans-serif">${content}</g></svg>`);
}
const txt = (x,y,t,size=22,color='#e9e7e1') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}">${esc(t)}</text>`;
const box = (x,y,w,h,stroke='#34363c') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#17191d" stroke="${stroke}"/>`;
svg('gap', 1200, 630, 'Expressed insight and observable action require separate verification',
  txt(64,64,'SNAILSPLOIT / RESEARCH SESSION 001',16,'#5eb8a8') +
  txt(64,142,'The Insight–Agency Gap',54) + txt(64,184,'Recognition is observable. Correction must be verified.',24,'#b6b4ac') +
  box(64,244,454,230,'#5eb8a8') + txt(94,287,'01 / EXPRESSED INSIGHT',16,'#5eb8a8') + txt(94,342,'“I recognize the inconsistency.”',27) + txt(94,392,'Model-generated explanation',21,'#b6b4ac') + txt(94,430,'An artifact to examine',18,'#b6b4ac') +
  box(682,244,454,230,'#e07a4a') + txt(712,287,'02 / OBSERVABLE BEHAVIOR',16,'#e07a4a') + txt(712,342,'Does the decision change?',27) + txt(712,392,'Response and tool-action record',21,'#b6b4ac') + txt(712,430,'An outcome to adjudicate',18,'#b6b4ac') +
  '<path d="M518 358 H565 M635 358 H682" stroke="#777a82" stroke-width="2"/><circle cx="600" cy="358" r="29" fill="#101114" stroke="#e07a4a"/>' + txt(588,368,'≠',30,'#e07a4a') +
  txt(64,542,'TEST BOTH DIRECTIONS',16,'#5eb8a8') + txt(64,580,'Correct verified errors · Resist persuasive but invalid corrections',25) + txt(925,64,'KAI AIZEN · 2026',16,'#b6b4ac'));

const modes = [
 ['FM-001','Insight–Agency Gap','Preliminary behavioral observation'],
 ['FM-002','Differential Override Pathways','Framing-sensitivity hypothesis'],
 ['FM-003','Post-Hoc Justification','Causal hypothesis'],
 ['FM-004','Context Contamination','Preliminary methodological observation'],
 ['FM-005','Fluent Confabulation','Concrete output error in reported record'],
 ['FM-006','Care–Compliance Tension','Preliminary agent-security hypothesis'],
 ['FM-007','Same Cloth Principle','Design-tradeoff hypothesis'],
 ['FM-008','Intent Asymmetry','Detection hypothesis']
];
let taxonomy = txt(40,53,'EIGHT LABELS. DIFFERENT EVIDENCE STATUS.',24) + txt(40,89,'A taxonomy for investigation; not eight equally validated mechanisms.',19,'#b6b4ac');
for (let i=0;i<modes.length;i++) {
 const [id,name,status]=modes[i]; const x=40+(i%2)*562,y=125+Math.floor(i/2)*140;
 taxonomy+=box(x,y,538,120)+txt(x+22,y+29,id,15,i<5?'#5eb8a8':'#e07a4a')+txt(x+22,y+64,name,23)+txt(x+22,y+96,status,17,'#b6b4ac');
}
taxonomy+=txt(40,719,'Phase 1: FM-001–005 / conversational sessions',17,'#5eb8a8')+txt(40,749,'Phase 2: FM-006–008 / browser-agent testing and conceptual extensions',17,'#e07a4a');
svg('taxonomy',1200,790,'Eight failure modes with their distinct evidence status',taxonomy);

let replication=txt(40,54,'REPLICATION / SEPARATE ACCESS FROM EFFECT',25)+txt(40,90,'Proposed conditions, not completed experimental results.',20,'#b6b4ac');
const conditions=[['01','Fresh session','No threat discussion'],['02','Fresh session','Explicit threat priming'],['03','Ordinary feedback','No returned traces'],['04','Returned traces','No interpretation'],['05','Traces + commentary','Combined intervention']];
conditions.forEach(([n,a,b],i)=>{const y=126+i*90; replication+=box(40,y,505,74)+txt(60,y+31,n,19,'#5eb8a8')+txt(112,y+31,a,23)+txt(112,y+57,b,17,'#b6b4ac');});
replication+='<path d="M575 163 H605 V523 H575 M605 343 H650" fill="none" stroke="#5eb8a8" stroke-width="2"/>';
replication+=box(650,207,510,275,'#e07a4a')+txt(676,246,'INDEPENDENT OUTCOME ASSESSMENT',17,'#e07a4a')+txt(676,294,'Score separately',28)+txt(676,338,'Conversational agreement',22)+txt(676,376,'Factual correction',22)+txt(676,414,'Executed action',22)+txt(676,454,'Ground truth defined before testing',17,'#b6b4ac');
replication+=txt(40,623,'Record context length, task exposure, tool permissions, trial counts and uncertainty.',20,'#b6b4ac');
svg('replication',1200,670,'Five proposed experimental conditions and three independently scored outcomes',replication);

const fig = (name,alt,caption,w,h) => `<figure><a href="${asset}${name}.svg" aria-label="Open full-size figure: ${esc(alt)}"><img src="${asset}${name}.svg" width="${w}" height="${h}" loading="lazy" alt="${esc(alt)}"></a><figcaption>${caption}</figcaption></figure>`;
body = body.replace('<h2 id="5-', fig('taxonomy','Eight taxonomy entries, each labeled with its evidence status. FM-001 through FM-005 come from Phase 1; FM-006 through FM-008 from Phase 2.','Figure 2. Taxonomy overview. Evidence status follows the manuscript; categories do not indicate frequency or severity.',1200,790)+'<h2 id="5-');
body = body.replace('<h2 id="appendix-b-', fig('replication','Five proposed conditions: unprimed baseline, threat priming, ordinary feedback, returned traces, and traces with commentary. Score agreement, factual correction, and executed actions separately.','Figure 3. Proposed replication design from Appendix B. No efficacy or outcome rate is claimed.',1200,670)+'<h2 id="appendix-b-');

const template = read('ai-security/computational-countertransference/index.html');
const nav = template.match(/<header class="nav">[\s\S]*?<\/header>/)[0];
const footer = template.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0];
const styles = `
.iag-hero-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:center}.iag-eyebrow{font:12px var(--f-mono);letter-spacing:.12em;color:var(--accent-cool);margin-bottom:24px}.iag-hero-grid .article-h1{font-size:clamp(44px,5.4vw,76px)}.iag-hero-grid .article-lede{margin:24px 0;font-family:var(--f-grot);font-size:20px}.iag-hero-art{width:100%;height:auto;border:1px solid var(--line-hi)}.iag-byline{font:13px/1.8 var(--f-mono);color:var(--fg-2)}.iag-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.iag-actions a{padding:12px 16px;border:1px solid var(--line-hi);font:12px var(--f-mono)}.iag-actions a:first-child{background:var(--accent-cool);color:var(--bg)}.iag-note{border-left:2px solid var(--accent-cool);padding:18px 22px;background:var(--bg-raise);font-size:15px;line-height:1.7}.iag-note p{margin:0 0 10px}.iag-note p:last-child{margin:0}.iag-table{overflow-x:auto;max-width:100%;margin:24px 0}.iag-table table{min-width:560px;margin:0}.iag-toc{position:sticky;top:100px;font:12px/1.6 var(--f-mono);max-height:calc(100vh - 120px);overflow-y:auto}.iag-toc h2{font-size:12px;color:var(--accent-cool);letter-spacing:.12em}.iag-toc a{display:block;color:var(--fg-2);padding:7px 0;border-bottom:1px solid var(--line)}.iag-toc a:hover{color:var(--signal-2)}.iag-toc a:focus-visible{outline-offset:-2px}.article-body figcaption{color:var(--fg-2);text-align:left}.article-body figure>a{border:0;display:block}.article-body figure img{width:100%}.iag-citation{margin-top:48px;padding:24px;border:1px solid var(--line-hi);overflow-wrap:anywhere}.iag-citation h2{margin:0;padding:0;border:0}.iag-citation h2:before{display:none}.iag-citation p{font-size:14px}.iag-end{padding:32px;text-align:center;border-bottom:1px solid var(--line);font:13px var(--f-mono)}
@media(max-width:900px){.iag-hero-grid{grid-template-columns:1fr;gap:28px}.article-layout{grid-template-columns:1fr;gap:32px}.iag-toc{position:static;max-height:none;grid-row:1}.iag-toc nav{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}.article-body{max-width:100%}}
@media(max-width:520px){.article-hero{padding:32px 20px}.article-layout{padding:32px 20px}.iag-toc nav{grid-template-columns:1fr}.article-body{font-size:16px}.article-body h2{font-size:27px}.iag-hero-grid .article-lede{font-size:18px}.iag-note{padding:16px}.iag-byline{font-size:12px}}
@media print{.nav,.iag-toc,.footer,.iag-actions,.iag-end{display:none!important}.article-layout,.iag-hero-grid{display:block}.article-body{max-width:none}.iag-hero-art{max-width:600px}.article-body,.article-body strong,.article-body em,.article-body h2,.article-body h3,body{color:#111!important;background:#fff!important}.iag-note{background:#eee}.iag-table{overflow:visible}.iag-table table{min-width:0}.article-body figure{break-inside:avoid}.iag-hero-grid .article-h1{font-size:42px}}
`;
const schema = {'@context':'https://schema.org','@type':'ScholarlyArticle',headline:title,description:desc,url,mainEntityOfPage:url,author:{'@type':'Person',name:'Kai Aizen',url:'https://snailsploit.com/about'},datePublished:'2026-10-28',dateModified:'2026-10-28',image:`https://snailsploit.com/og-images/ai-security__${slug}.png`,isAccessibleForFree:true,inLanguage:'en',keywords:['adversarial AI','reasoning faithfulness','self-correction','agent security'],articleSection:'AI Security Research'};
write(`ai-security/${slug}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | SnailSploit</title><meta name="description" content="${desc}"><meta name="author" content="Kai Aizen"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0e0e0f"><meta name="color-scheme" content="dark"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="/css/article.css"><link rel="stylesheet" href="/css/responsive.css"><link rel="stylesheet" href="/mobile.css"><link rel="stylesheet" href="/ui.css?v=20260823"><meta property="og:type" content="article"><meta property="og:site_name" content="SnailSploit"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${url}"><meta property="og:image" content="${schema.image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="The Insight–Agency Gap: expressed insight and observable behavior require separate verification"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@SnailSploit"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${schema.image}"><meta property="article:published_time" content="2026-10-28"><meta property="article:modified_time" content="2026-10-28"><link rel="alternate" href="/rss.xml" type="application/rss+xml" title="SnailSploit research"><script type="application/ld+json">${JSON.stringify(schema)}</script><style>${styles}.ss-skip{position:fixed;left:8px;top:-60px;background:#5eb8a8;color:#101114;padding:12px;z-index:999}.ss-skip:focus{top:8px}</style></head><body><a class="ss-skip" href="#main">Skip to manuscript</a>${nav}
<section class="article-hero"><div class="article-hero-inner"><div class="crumbs"><a href="/">Home</a><span>/</span><a href="/research">Research</a><span>/</span><a href="/ai-security/">AI Security</a></div><div class="iag-hero-grid"><div><div class="iag-eyebrow">RESEARCH SESSION 001 / COMBINED EDITION</div><h1 class="article-h1">The Insight–<br>Agency Gap</h1><p class="article-lede">Eight Failure Modes in LLM Reasoning and Behavior Under Adversarial Examination</p><div class="iag-byline"><strong>Kai Aizen</strong> · SnailSploit Research<br>Creator of AATMF · Author of <em>Adversarial Minds</em> · NVD Contributor<br>Research: January–February 2026<br>Web edition published <time datetime="2026-10-28">28 October 2026</time> · ${Math.ceil(manuscript.split(/\s+/).length/220)} min read</div><div class="iag-actions"><a href="#abstract">Read the paper ↓</a><a href="/downloads/${slug}.md" download>Download manuscript (.md)</a></div></div><img class="iag-hero-art" src="${asset}gap.svg" width="1200" height="630" fetchpriority="high" alt="Expressed insight and observable behavior are distinct. Correct verified errors while resisting persuasive but invalid corrections."></div></div></section>
<div class="article-layout"><main id="main" class="article-body" tabindex="-1"><div class="iag-note"><p><strong>Exploratory case study.</strong> This is a preliminary taxonomy with mixed evidence status. The figures are conceptual illustrations, not measured outcome charts.</p><p>Developed through research sessions and manuscript collaboration with Claude (Anthropic). Observations and interpretations are attributed below; model-generated commentary is not independent validation.</p></div><figure><figcaption>Figure 1 (above). Expressed recognition does not establish valid correction. Both the original decision and the proposed correction require independent assessment.</figcaption></figure>${body}<section class="iag-citation" aria-label="Citation"><h2 id="cite">Cite this edition</h2><p>Aizen, Kai. (2026). <em>The Insight–Agency Gap: Eight Failure Modes in LLM Reasoning and Behavior Under Adversarial Examination.</em> SnailSploit Research. Combined edition; web publication 28 October 2026. <a href="${url}">${url}</a></p></section></main><aside class="iag-toc" aria-label="Table of contents"><h2>IN THIS PAPER</h2><nav>${toc.map(t=>`<a href="#${t.id}">${t.text}</a>`).join('')}<a href="#cite">Cite this edition</a></nav></aside></div><div class="iag-end"><a href="/research">← All research</a> · <a href="/downloads/${slug}.md" download>Source manuscript</a></div>${footer}<script defer src="/ui.js?v=20260824"></script></body></html>`);
console.log(`Built ${route} with ${toc.length} manuscript sections and three SVG figures.`);
