/**
 * Page densification build script
 * Converts markdown content files into full static HTML pages
 * matching the site's existing templates (article, wiki, framework).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = '/home/user/SnailSploit.com';
const CONTENT = '/tmp/claude-0/-home-user-SnailSploit-com/006ce064-5a05-515e-b359-2f81f83a708c/scratchpad/content-update';

marked.setOptions({ gfm: true, breaks: false });

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) { return escHtml(s); }

function wordCount(text) {
  return text.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
}

function readTime(wc) { return Math.max(1, Math.ceil(wc / 200)); }

function fmtDate(d) {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

function extractFaqs(md) {
  const idx = md.search(/^## FAQ\s*$/m);
  if (idx === -1) return [];
  const start = md.indexOf('\n', idx) + 1;
  const nextH2 = md.indexOf('\n## ', start);
  const block = nextH2 === -1 ? md.slice(start) : md.slice(start, nextH2);
  const faqs = [];
  const parts = block.split(/\n\*\*/).filter(Boolean);
  for (const part of parts) {
    const lines = ('**' + part).trim().split('\n');
    const qLine = lines[0].replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
    const aLines = lines.slice(1).join('\n').trim();
    if (qLine && aLines) faqs.push({ q: qLine, a: aLines });
  }
  return faqs;
}

function processBody(md) {
  let body = md;
  body = body.replace(/^#\s+[^\n]+\n+\*\*[^*]+\*\*\s*\n*/s, '');
  body = body.replace(/^## Cite This Work\s*\n[\s\S]*?(?=\n## )/m, '\n');
  if (/## Cite This Work\s*\n/.test(body) && !/\n## /.test(body.split('## Cite This Work')[1] || '')) {
    body = body.replace(/## Cite This Work[\s\S]*$/, '');
  }
  return marked(body);
}

// ─── Shared HTML fragments ───

const GTM_HEAD = `  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-KNQQ58JL');</script>
  <!-- End Google Tag Manager -->`;

const GTM_BODY = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KNQQ58JL"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

const SKIP_STYLE = `<style>.ss-skip{position:fixed;left:8px;top:-64px;z-index:10000;background:var(--signal-2,#E07A4A);color:var(--bg,#0E0E0F);padding:10px 16px;font-family:system-ui,-apple-system,sans-serif;font-weight:600;font-size:14px;line-height:1;text-decoration:none;border-radius:4px;transition:top .15s ease}.ss-skip:focus{top:8px;outline:2px solid #fff;outline-offset:2px}</style>`;

const SOCIAL_ICONS = `<a href="https://github.com/snailsploit" rel="noopener" aria-label="SnailSploit on GitHub" style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid var(--line);border-radius:2px;color:var(--fg-2);text-decoration:none;transition:color 120ms,border-color 120ms" onmouseover="this.style.color='var(--signal-2)';this.style.borderColor='rgba(224,122,74,0.45)'" onmouseout="this.style.color='var(--fg-2)';this.style.borderColor='var(--line)'"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg></a><a href="https://x.com/SnailSploit" rel="noopener" aria-label="SnailSploit on X" style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid var(--line);border-radius:2px;color:var(--fg-2);text-decoration:none;transition:color 120ms,border-color 120ms" onmouseover="this.style.color='var(--signal-2)';this.style.borderColor='rgba(224,122,74,0.45)'" onmouseout="this.style.color='var(--fg-2)';this.style.borderColor='var(--line)'"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a><a href="https://linkedin.com/company/snailsploit" rel="noopener" aria-label="SnailSploit on LinkedIn" style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid var(--line);border-radius:2px;color:var(--fg-2);text-decoration:none;transition:color 120ms,border-color 120ms" onmouseover="this.style.color='var(--signal-2)';this.style.borderColor='rgba(224,122,74,0.45)'" onmouseout="this.style.color='var(--fg-2)';this.style.borderColor='var(--line)'"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05a3.73 3.73 0 0 1 3.36-1.85c3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg></a><a href="https://www.researchgate.net/profile/Kai-Aizen-2" rel="noopener">researchgate</a>`;

const ARTICLE_SCRIPT = `<script type="module">document.addEventListener("DOMContentLoaded",()=>{const d=document.getElementById("article-content"),u=document.getElementById("toc-list"),h=document.getElementById("article-toc");if(d&&u&&h){const t=Array.from(d.querySelectorAll("h2"));if(t.length<2)h.style.display="none";else{t.forEach((o,c)=>{const i=o.textContent?.trim()||"Section "+(c+1),a=o.id||i.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"section-"+c;o.id=a;const p=document.createElement("li");p.className="toc-item";const l=document.createElement("a");l.href="#"+a,l.textContent=i,l.className="toc-link",l.addEventListener("click",E=>{E.preventDefault(),document.getElementById(a)?.scrollIntoView({behavior:"smooth",block:"start"})}),p.appendChild(l),u.appendChild(p)});const v=new IntersectionObserver(o=>{o.forEach(c=>{c.isIntersecting&&(u.querySelectorAll(".toc-link").forEach(a=>a.classList.remove("toc-active")),u.querySelector('a[href="#'+c.target.id+'"]')?.classList.add("toc-active"))})},{rootMargin:"-100px 0px -60% 0px"});t.forEach(o=>v.observe(o))}}document.querySelectorAll("#article-content table").forEach(t=>{if(!t.parentElement?.classList.contains("table-wrapper")){const e=document.createElement("div");e.className="table-wrapper",t.parentNode?.insertBefore(e,t),e.appendChild(t)}});const m=document.getElementById("reading-progress"),g=document.getElementById("article-content");if(m&&g){let t=!1;window.addEventListener("scroll",()=>{t||(requestAnimationFrame(()=>{const e=g.getBoundingClientRect(),n=e.top+window.scrollY,r=n+e.height-window.innerHeight,s=Math.min(Math.max((window.scrollY-n)/(r-n),0),1);m.style.transform="scaleX("+s+")",t=!1}),t=!0)})}function w(){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("width","16"),t.setAttribute("height","16"),t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","2");const e=document.createElementNS("http://www.w3.org/2000/svg","rect");e.setAttribute("x","9"),e.setAttribute("y","9"),e.setAttribute("width","13"),e.setAttribute("height","13"),e.setAttribute("rx","2");const n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("d","M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"),t.appendChild(e),t.appendChild(n),t}function b(){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("width","16"),t.setAttribute("height","16"),t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","2");const e=document.createElementNS("http://www.w3.org/2000/svg","polyline");return e.setAttribute("points","20 6 9 17 4 12"),t.appendChild(e),t}document.querySelectorAll("#article-content pre").forEach(t=>{const e=document.createElement("button");e.className="copy-code-btn",e.setAttribute("aria-label","Copy code"),e.appendChild(w()),e.addEventListener("click",()=>{const n=t.querySelector("code"),r=n?n.textContent||"":t.textContent||"";navigator.clipboard.writeText(r).then(()=>{e.textContent="",e.appendChild(b()),setTimeout(()=>{e.textContent="",e.appendChild(w())},2e3)})}),t.style.position="relative",t.appendChild(e)})})</script>`;

// ─── Navigation ───

function navHeader(activeSection, includeUtils = true) {
  const links = [
    ['about', '/about'], ['frameworks', '/frameworks'], ['research', '/research'],
    ['ai security', '/ai-security/'], ['cves', '/cves'], ['wiki', '/wiki'],
    ['tools', '/tools'], ['writing', '/writing'],
  ];
  const lis = links.map(([label, href]) => {
    const current = label === activeSection ? ' aria-current="page"' : '';
    return `<li><a href="${href}"${current}>${label}</a></li>`;
  }).join('') + '<li></li><li><a href="/contact">contact</a></li>';

  const utils = includeUtils
    ? `<div class="nav-utils"><button class="ss-palette-trigger" data-ss-palette aria-label="Open search">⌘K</button><span style="display:inline-flex;align-items:center;gap:6px"><span class="live-dot"></span> live</span></div>`
    : '';

  return `<header class="nav"><div class="nav-inner"><a class="wm" href="/">snailsploit<span class="wm-sig">[<span class="dollar">$</span>]</span></a><nav><ul class="nav-links">${lis}</ul></nav>${utils}</div></header><div id="main" tabindex="-1"></div>`;
}

// ─── Footer ───

function articleFooter() {
  return `<footer class="footer"><div class="footer-inner"><a class="wm" href="/" style="font-size:23.8px"><span>snailsploit</span><span class="wm-sig" style="font-size:13.8px">[<span class="dollar">$</span>]</span></a><div class="footer-copy">© 2026 SnailSploit Ltd. · Same attack. Different substrate. Human or machine.</div></div><span class="footer-legal" style="font-family:var(--f-mono);font-size:11px;display:flex;gap:14px;flex-wrap:wrap"><a href="/contact" style="color:var(--fg-3);text-decoration:none;border-bottom:1px solid var(--line-hi)">Contact</a><a href="/privacy" style="color:var(--fg-3);text-decoration:none;border-bottom:1px solid var(--line-hi)">Privacy</a><a href="/cookies" style="color:var(--fg-3);text-decoration:none;border-bottom:1px solid var(--line-hi)">Cookies</a><a href="/accessibility" style="color:var(--fg-3);text-decoration:none;border-bottom:1px solid var(--line-hi)">Accessibility</a></span></footer>`;
}

function frameworkFooter() {
  return `<footer class="footer"><div class="footer-inner">
<span>© 2026 SnailSploit Ltd. · Same attack. Different substrate. Human or machine.</span>
<span class="footer-legal"><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/accessibility">Accessibility</a></span>
</div></footer>`;
}

// ─── Author section ───

function authorSection(eyebrowClass = 'author-eyebrow') {
  return `<section class="author-row"><div class="author-inner"><div class="${eyebrowClass}">Author</div><div class="author-name">Kai Aizen</div><div class="author-bio">Independent Adversarial · Research group. 97 published CVEs, 5 Linux kernel mainline patches, creator of AATMF / P.R.O.M.P.T / SEF, author of Adversarial Minds.</div><div class="author-links"><a href="/about">about</a><a href="/services">services</a>${SOCIAL_ICONS}</div></div></section>`;
}

// ─── Citation section ───

function citationSection(fm) {
  const title = fm.title;
  const year = fmtDate(fm.date).slice(0, 4);
  const url = fm.canonical;
  const bibKey = `aizen${year}${slugify(title.split(':')[0].split('|')[0].trim()).replace(/-/g, '')}`.slice(0, 40);
  return `
  <!-- citation:start -->
  <section style="padding:48px 32px;background:var(--bg-sink);border-bottom:1px solid var(--line)">
    <div style="max-width:780px;margin:0 auto">
      <div style="font-family:var(--f-mono);font-size:11px;color:var(--fg-3);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:20px">cite this work</div>
      <details style="border:1px solid var(--line);background:var(--bg);padding:16px 20px;margin-bottom:8px">
        <summary style="font-family:var(--f-mono);font-size:13px;color:var(--fg);cursor:pointer">BibTeX</summary>
        <pre style="font-family:var(--f-mono);font-size:12px;color:var(--fg-2);white-space:pre-wrap;margin:12px 0 0;background:var(--bg-sink);padding:12px;border:1px solid var(--line)">@misc{${bibKey},
  author = {Aizen, Kai},
  title  = {${escHtml(title)}},
  year   = {${year}},
  url    = {${url}},
  note   = {snailsploit.com}
}</pre>
      </details>
      <details style="border:1px solid var(--line);background:var(--bg);padding:16px 20px;margin-bottom:8px">
        <summary style="font-family:var(--f-mono);font-size:13px;color:var(--fg);cursor:pointer">APA</summary>
        <p style="font-family:var(--f-mono);font-size:12px;color:var(--fg-2);line-height:1.6;margin:12px 0 0">Aizen, K. (${year}). <i>${escHtml(title)}</i>. snailsploit.com. ${url}</p>
      </details>
      <details style="border:1px solid var(--line);background:var(--bg);padding:16px 20px;margin-bottom:8px">
        <summary style="font-family:var(--f-mono);font-size:13px;color:var(--fg);cursor:pointer">MLA</summary>
        <p style="font-family:var(--f-mono);font-size:12px;color:var(--fg-2);line-height:1.6;margin:12px 0 0">Aizen, Kai. “${escHtml(title)}.” <i>snailsploit</i>, ${year}, ${url}.</p>
      </details>
      <details style="border:1px solid var(--line);background:var(--bg);padding:16px 20px">
        <summary style="font-family:var(--f-mono);font-size:13px;color:var(--fg);cursor:pointer">Chicago</summary>
        <p style="font-family:var(--f-mono);font-size:12px;color:var(--fg-2);line-height:1.6;margin:12px 0 0">Aizen, Kai. “${escHtml(title)}.” snailsploit (blog). ${year}. ${url}.</p>
      </details>
      <div style="font-family:var(--f-mono);font-size:11px;color:var(--fg-3);margin-top:16px">Permalink: <a href="${url}" style="color:var(--signal-2);border-bottom:1px solid var(--signal-2)">${url}</a></div>
    </div>
  </section>
  <!-- citation:end -->`;
}

// ─── Related cards ───

function relatedSection(related) {
  if (!related || !related.length) return '';
  const cards = related.map(r => {
    const href = '/' + r.slug + '/';
    const desc = (r.description || '').slice(0, 120) + (r.description?.length > 120 ? '…' : '');
    return `<a class="related-card" href="${href}"><div class="related-date"></div><div class="related-title">${escHtml(r.title)}</div><div class="related-desc">${escHtml(desc)}</div></a>`;
  }).join('');
  return `<section class="related"><div class="related-inner"><div class="related-head">Related</div><div class="related-grid">${cards}</div></div></section>`;
}

// ─── TOC sidebar (article/wiki) ───

function buildToc(bodyHtml) {
  const headings = [];
  const re = /<h([23])\s+id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  let m;
  while ((m = re.exec(bodyHtml)) !== null) {
    headings.push({ level: parseInt(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, '') });
  }
  if (headings.length < 2) return '';
  const lis = headings.map(h => {
    const cls = h.level === 3 ? ' class="h3"' : '';
    return `<li${cls}><a href="#${h.id}">${escHtml(h.text)}</a></li>`;
  }).join('');
  return `<aside class="toc"><div class="toc-eyebrow">In this article</div><ul>${lis}</ul></aside>`;
}

// ─── JSON-LD builders ───

function personLd(full = true) {
  const p = {
    "@type": "Person",
    "@id": "https://snailsploit.com/#kai",
    "name": "Kai Aizen",
    "image": "https://snailsploit.com/og-square.png",
    "url": "https://snailsploit.com",
    "sameAs": [
      "https://github.com/SnailSploit",
      "https://x.com/SnailSploit",
      "https://linkedin.com/in/kaiaizen",
      "https://www.researchgate.net/profile/Kai-Aizen-2"
    ]
  };
  if (full) {
    p.alternateName = "The Jailbreak Chef";
    p.jobTitle = "Founder & Adversarial AI Researcher";
  }
  return p;
}

function articleLd(fm, wc) {
  const type = fm.jsonLd?.['@type'] || 'TechArticle';
  const obj = {
    "@type": type,
    "headline": fm.jsonLd?.headline || fm.title,
    "description": fm.description,
    "author": {"@id": "https://snailsploit.com/#kai"},
    "publisher": {"@id": "https://snailsploit.com/#kai"},
    "datePublished": fmtDate(fm.date),
    "dateModified": fmtDate(fm.updated),
    "url": fm.canonical,
    "mainEntityOfPage": fm.canonical,
    "image": fm.og?.image || `https://snailsploit.com/og-images/${fm.slug.replace(/\//g, '__')}.png`,
    "wordCount": wc,
    "inLanguage": "en-US",
    "keywords": (fm.tags || []).join(', ')
  };
  if (fm.jsonLd?.isPartOf) obj.isPartOf = fm.jsonLd.isPartOf;
  if (fm.jsonLd?.articleSection) obj.articleSection = fm.jsonLd.articleSection;
  return obj;
}

function breadcrumbLd(fm) {
  const items = (fm.breadcrumb || []).map((b, i) => {
    const item = { "@type": "ListItem", "position": i + 1, "name": b.name || b };
    if (b.url) item.item = b.url;
    else if (i === 0) item.item = "https://snailsploit.com/";
    else item.item = fm.canonical;
    return item;
  });
  return { "@type": "BreadcrumbList", "itemListElement": items };
}

function faqLd(faqs) {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };
}

function buildJsonLd(fm, wc, faqs, full = true) {
  const graph = [personLd(full), articleLd(fm, wc), breadcrumbLd(fm)];
  const faq = faqLd(faqs);
  if (faq) graph.unshift(faq);
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

// ─── Add heading IDs to converted HTML ───

function addHeadingIds(html) {
  const seen = {};
  return html.replace(/<h([2-6])>(.*?)<\/h[2-6]>/gi, (match, level, text) => {
    const plain = text.replace(/<[^>]+>/g, '');
    let id = slugify(plain);
    if (seen[id]) { seen[id]++; id += '-' + seen[id]; } else { seen[id] = 1; }
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

// ═══════════════════════════════════════════
//  ARTICLE TEMPLATE
// ═══════════════════════════════════════════

function articleTemplate(fm, bodyHtml, faqs) {
  const ogImage = fm.og?.image || `https://snailsploit.com/og-images/${fm.slug.replace(/\//g, '__')}.png`;
  const wc = wordCount(bodyHtml);
  const rt = readTime(wc);
  const date = fmtDate(fm.date);
  const jsonLd = buildJsonLd(fm, wc, faqs, true);

  const crumbs = (fm.breadcrumb || []).map((b, i, arr) => {
    if (i === arr.length - 1) return `<span>${escHtml(b.name || b)}</span>`;
    return `<a href="${b.url || '/'}">${escHtml(b.name || b)}</a><span class="sep">/</span>`;
  }).join('');

  const tagMetas = (fm.tags || []).map(t => `<meta content="${escAttr(t)}" property="article:tag"/>`).join('\n');
  const toc = buildToc(bodyHtml);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<title>${escHtml(fm.og?.title || fm.title)} | SnailSploit</title>
<meta content="${escAttr(fm.description)}" name="description"/>
<meta content="Kai Aizen" name="author"/>
<meta content="${fm.robots || 'index, follow, max-image-preview:large, max-snippet:-1'}" name="robots"/>
<link href="${fm.canonical}" rel="canonical"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link rel="preload" href="/css/article.css" as="style">
<link rel="stylesheet" href="/css/article.css">
<meta content="article" property="og:type"/>
<meta content="${escAttr(fm.og?.title || fm.title)}" property="og:title"/>
<meta content="${escAttr(fm.og?.description || fm.description)}" property="og:description"/>
<meta content="${fm.canonical}" property="og:url"/>
<meta content="SnailSploit" property="og:site_name"/>
<meta property="og:image" content="${ogImage}">
<meta content="1200" property="og:image:width"/>
<meta content="630" property="og:image:height"/>
<meta content="en_US" property="og:locale"/>
<meta content="Kai Aizen" property="article:author"/>
<meta content="${date}" property="article:published_time"/>
<meta content="${escAttr(fm.section)}" property="article:section"/>
${tagMetas}
<meta content="summary_large_image" name="twitter:card"/>
<meta content="@SnailSploit" name="twitter:site"/>
<meta content="@SnailSploit" name="twitter:creator"/>
<meta content="${escAttr(fm.og?.title || fm.title)}" name="twitter:title"/>
<meta content="${escAttr(fm.og?.description || fm.description)}" name="twitter:description"/>
<meta name="twitter:image" content="${ogImage}">
<script type="application/ld+json">${jsonLd}</script>
<link href="/favicon.svg" rel="icon" type="image/svg+xml"/>
<link href="/apple-touch-icon.png" rel="alternate icon" type="image/png"/>
<link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180"/>
<link href="/manifest.webmanifest" rel="manifest"/>
<meta content="#0E0E0F" name="theme-color"/>
<meta content="strict-origin-when-cross-origin" name="referrer"/>
<meta content="telephone=no" name="format-detection"/>
<meta content="dark" name="color-scheme"/>
<link href="/rss.xml" rel="alternate" title="snailsploit research" type="application/rss+xml"/>
<link href="/feed.xml" rel="alternate" title="snailsploit research" type="application/atom+xml"/>
  <link rel="stylesheet" href="/css/responsive.css">
${GTM_HEAD}
<link rel="stylesheet" href="/mobile.css">
<link rel="stylesheet" href="/ui.css?v=20260823">
${SKIP_STYLE}
</head>
<body>
<a class="ss-skip" href="#main">Skip to content</a>
${GTM_BODY}

${navHeader('ai security')}
<section class="article-hero">
<div class="article-hero-inner">
<div class="crumbs">${crumbs}</div>
<div class="article-meta">
<time datetime="${date}">${date}</time>
<span>${rt} min read</span>
</div>
<h1 class="article-h1">${escHtml(fm.title)}</h1>
<p class="article-lede">${escHtml(fm.description)}</p>
</div>
</section>
<div class="article-layout">
<main class="article-body">
<div class="article-body"> <div id="article-content">${bodyHtml}</div> ${ARTICLE_SCRIPT}</div>
</main>
${toc}
</div>
${relatedSection(fm.related)}
${citationSection(fm)}
${authorSection('author-eyebrow')}
${articleFooter()}
<script defer src="/ui.js?v=20260824"></script>
</body>
</html>`;
}

// ═══════════════════════════════════════════
//  WIKI TEMPLATE
// ═══════════════════════════════════════════

const WIKI_ATTACKS = [
  { slug: 'adversarial-examples', name: 'Adversarial Examples' },
  { slug: 'agent-hijacking', name: 'Agent Hijacking' },
  { slug: 'backdoor-attacks', name: 'Backdoor Attacks' },
  { slug: 'data-poisoning', name: 'Data Poisoning' },
  { slug: 'guardrail-bypass', name: 'Guardrail Bypass' },
  { slug: 'indirect-prompt-injection', name: 'Indirect Prompt Injection' },
  { slug: 'jailbreaking', name: 'Jailbreaking' },
  { slug: 'membership-inference', name: 'Membership Inference' },
  { slug: 'model-extraction', name: 'Model Extraction' },
  { slug: 'supply-chain-attacks', name: 'Supply Chain Attacks' },
  { slug: 'system-prompt-extraction', name: 'System Prompt Extraction' },
  { slug: 'training-data-extraction', name: 'Training Data Extraction' },
];

const WIKI_DEFENSES = [
  { slug: 'guardrails', name: 'Guardrails' },
  { slug: 'human-in-the-loop', name: 'Human in the Loop' },
  { slug: 'input-validation', name: 'Input Validation' },
  { slug: 'output-filtering', name: 'Output Filtering' },
  { slug: 'rate-limiting', name: 'Rate Limiting' },
];

function wikiTemplate(fm, bodyHtml, faqs, category) {
  const ogImage = fm.og?.image || `https://snailsploit.com/og-images/${fm.slug.replace(/\//g, '__')}.png`;
  const wc = wordCount(bodyHtml);
  const rt = readTime(wc);
  const date = fmtDate(fm.date);
  const jsonLd = buildJsonLd(fm, wc, faqs, true);
  const pageTitle = fm.og?.title || fm.title;
  const titleSuffix = pageTitle.includes('Wiki') ? pageTitle : `${fm.title} | AI Security Wiki`;

  const crumbs = (fm.breadcrumb || []).map((b, i, arr) => {
    if (i === arr.length - 1) return `<span>${escHtml(b.name || b)}</span>`;
    const href = b.url || '/';
    const linkHref = href.includes('wiki/attacks') || href.includes('wiki/defenses') ? '/wiki' : href;
    return `<a href="${linkHref}">${escHtml(b.name || b)}</a><span class="sep">/</span>`;
  }).join('');

  const tagMetas = (fm.tags || []).map(t => `<meta content="${escAttr(t)}" property="article:tag"/>`).join('\n');
  const toc = buildToc(bodyHtml);

  const termName = fm.title.replace(/ \| .*/, '').replace(/ Attacks$/, '').replace(/^.*: /, '');
  const definedTermLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": termName,
    "description": fm.description,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Adversarial AI Reference",
      "url": "https://snailsploit.com/wiki"
    },
    "url": fm.canonical
  });

  const wikiEntries = category === 'attacks' ? WIKI_ATTACKS : WIKI_DEFENSES;
  const currentSlug = fm.slug.split('/').pop();
  const seeAlsoLinks = wikiEntries
    .filter(e => e.slug !== currentSlug)
    .map(e => {
      const href = `/ai-security/wiki/${category}/${e.slug}/`;
      return `<a href="${href}" style="padding:14px 16px;border:1px solid var(--line);background:var(--bg);text-decoration:none;color:var(--fg);font-size:14px;display:flex;justify-content:space-between;align-items:center;gap:12px"><span>${escHtml(e.name)}</span><span style="color:var(--fg-3);font-size:11px">→</span></a>`;
    }).join('');

  const tldr = `<!-- tldr:start -->
  <div style="margin:0 0 32px;padding:20px 24px;border:1px solid var(--signal-2);background:color-mix(in srgb,var(--signal-2) 6%,var(--bg-raise));border-left-width:3px;font-family:var(--f-mono);font-size:14px;line-height:1.6;color:var(--fg)">
    <div style="font-size:10px;color:var(--signal-2);text-transform:uppercase;letter-spacing:0.18em;margin-bottom:8px;font-weight:500">TL;DR</div>
    <div>${escHtml(fm.description)}</div>
  </div>
  <!-- tldr:end -->`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<title>${escHtml(titleSuffix)} | SnailSploit</title>
<meta content="${escAttr(fm.description)}" name="description"/>
<meta content="Kai Aizen" name="author"/>
<meta content="${fm.robots || 'index, follow, max-image-preview:large, max-snippet:-1'}" name="robots"/>
<link href="${fm.canonical}" rel="canonical"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link rel="preload" href="/css/article.css" as="style">
<link rel="stylesheet" href="/css/article.css">
<meta content="article" property="og:type"/>
<meta content="${escAttr(fm.og?.title || titleSuffix)}" property="og:title"/>
<meta content="${escAttr(fm.og?.description || fm.description)}" property="og:description"/>
<meta content="${fm.canonical}" property="og:url"/>
<meta content="SnailSploit" property="og:site_name"/>
<meta property="og:image" content="${ogImage}">
<meta content="1200" property="og:image:width"/>
<meta content="630" property="og:image:height"/>
<meta content="en_US" property="og:locale"/>
<meta content="Kai Aizen" property="article:author"/>
<meta content="${date}" property="article:published_time"/>
<meta content="AI Security Wiki" property="article:section"/>
${tagMetas}
<meta content="summary_large_image" name="twitter:card"/>
<meta content="@SnailSploit" name="twitter:site"/>
<meta content="@SnailSploit" name="twitter:creator"/>
<meta content="${escAttr(fm.og?.title || titleSuffix)}" name="twitter:title"/>
<meta content="${escAttr(fm.og?.description || fm.description)}" name="twitter:description"/>
<meta name="twitter:image" content="${ogImage}">
<script type="application/ld+json">${jsonLd}</script>
<link href="/favicon.svg" rel="icon" type="image/svg+xml"/>
<link href="/apple-touch-icon.png" rel="alternate icon" type="image/png"/>
<link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180"/>
<link href="/manifest.webmanifest" rel="manifest"/>
<meta content="#0E0E0F" name="theme-color"/>
<meta content="strict-origin-when-cross-origin" name="referrer"/>
<meta content="telephone=no" name="format-detection"/>
<meta content="dark" name="color-scheme"/>
<link href="/rss.xml" rel="alternate" title="snailsploit research" type="application/rss+xml"/>
<link href="/feed.xml" rel="alternate" title="snailsploit research" type="application/atom+xml"/>
  <link rel="stylesheet" href="/css/responsive.css">
${GTM_HEAD}
<link rel="stylesheet" href="/mobile.css">
<link rel="stylesheet" href="/ui.css?v=20260823">
${SKIP_STYLE}
<script type="application/ld+json">${definedTermLd}</script>
</head>
<body>
<a class="ss-skip" href="#main">Skip to content</a>
${GTM_BODY}

${navHeader('wiki')}
<section class="article-hero">
<div class="article-hero-inner">
<div class="crumbs">${crumbs}</div>
<div class="article-meta">
<time datetime="${date}">${date}</time>
<span>${rt} min read</span>
</div>
<h1 class="article-h1">${escHtml(titleSuffix)}</h1>
<p class="article-lede">${escHtml(fm.description)}</p>
</div>
</section>
<div class="article-layout">
<main class="article-body">
<div class="article-body">
  ${tldr}
 <div> <div id="article-content">${bodyHtml}</div> ${ARTICLE_SCRIPT} </div> </div>
</main>
${toc}
</div>
${relatedSection(fm.related)}
${citationSection(fm)}

  <!-- wiki-seealso:start -->
  <section style="padding:48px 32px;background:var(--bg-sink);border-bottom:1px solid var(--line)">
    <div style="max-width:1080px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:24px;font-family:var(--f-mono);font-size:11px;color:var(--fg-3);text-transform:uppercase;letter-spacing:0.14em;border-bottom:1px solid var(--line-hi);padding-bottom:12px">
        <span>more in ${category}</span>
        <a href="/wiki" style="color:var(--fg-3);text-decoration:none;border-bottom:1px solid var(--line-hi)">← back to wiki</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px">
        ${seeAlsoLinks}
      </div>
    </div>
  </section>
  <!-- wiki-seealso:end -->
${authorSection('author-eyebrow')}
${articleFooter()}
<script defer src="/ui.js?v=20260824"></script>
</body>
</html>`;
}

// ═══════════════════════════════════════════
//  FRAMEWORK TEMPLATE
// ═══════════════════════════════════════════

const FRAMEWORK_CSS = readFileSync(join(ROOT, 'frameworks/aatmf/prompt-bank/index.html'), 'utf8')
  .match(/<style>([\s\S]*?)<\/style>/)?.[1]
  ?.replace(/<\/style>[\s\S]*/, '') || '';

const AATMF_VOLUMES = [
  { slug: 'foundations', num: 'I', title: 'Foundations', desc: 'Introduction, risk-assessment methodology, and architecture for adversarial AI threat mode…' },
  { slug: 'core-tactics', num: 'II', title: 'Core Tactics (T01–T08)', desc: 'The eight foundational adversarial-AI tactics: prompt subversion, semantic evasion, reason…' },
  { slug: 'advanced-tactics', num: 'III', title: 'Advanced Tactics (T09–T12)', desc: 'Multimodal attacks, integrity breach, agentic exploitation, RAG-specific threats — for sys…' },
  { slug: 'infrastructure', num: 'IV', title: 'Infrastructure & Human (T13–T15)', desc: 'Where the attack surface meets the surrounding stack: supply chain, infrastructure, and th…' },
  { slug: 'operations', num: 'V', title: 'Operations', desc: 'Detection engineering, mitigation, incident response, red-team ops, blue-team defense — ap…' },
  { slug: 'governance', num: 'VI', title: 'Governance', desc: 'Risk management, compliance mapping (NIST AI RMF, MITRE ATLAS), and security training prog…' },
  { slug: 'prompt-bank', num: 'VII-PB', title: 'Prompt Bank', desc: 'Curated catalog of adversarial prompts and detection signatures from Appendices A and B.' },
  { slug: 'appendices', num: 'VII', title: 'Appendices', desc: 'Attack catalog, signatures, tools, templates, case studies, glossary — operational referen…' },
];

const FRAMEWORK_VOL_MAP = {
  'prompt-bank': { num: 'VII-PB', h1: 'prompt bank.', eyebrow: 'AATMF v3.1 · Volume VII-PB' },
  'advanced-tactics': { num: 'III', h1: 'advanced attack tactics.', eyebrow: 'AATMF v3.1 · Volume III' },
  'infrastructure': { num: 'IV', h1: 'infrastructure & human tactics.', eyebrow: 'AATMF v3.1 · Volume IV' },
};

function frameworkTemplate(fm, bodyHtml, faqs, pageMeta) {
  const ogImage = fm.og?.image || `https://snailsploit.com/og-images/${fm.slug.replace(/\//g, '__')}.png`;
  const wc = wordCount(bodyHtml);
  const jsonLd = buildJsonLd(fm, wc, faqs, false);

  const volSlug = fm.slug.split('/').pop();
  const vol = FRAMEWORK_VOL_MAP[volSlug] || { num: '', h1: volSlug, eyebrow: 'AATMF v3.1' };

  const crumbs = (fm.breadcrumb || []).map((b, i, arr) => {
    if (i === arr.length - 1) return `<span class="here">${escHtml(b.name || b)}</span>`;
    const href = b.url || '/';
    const linkHref = href.includes('/frameworks/aatmf') ? '/aatmf' : href.includes('/frameworks') ? '/frameworks' : href;
    return `<a href="${linkHref}">${escHtml(b.name || b)}</a><span class="sep">/</span>`;
  }).join('');

  const h2s = [];
  const re = /<h2\s+id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  let m;
  while ((m = re.exec(bodyHtml)) !== null) {
    h2s.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, '') });
  }
  const tocBarLinks = h2s.slice(0, 8).map(h => `<a href="#${h.id}">${escHtml(h.text)}</a>`).join('');

  const volCards = AATMF_VOLUMES
    .filter(v => v.slug !== volSlug)
    .map(v => `<a href="/frameworks/aatmf/${v.slug}/" class="vol-card"><div class="vol-card-num">Vol ${v.num} →</div><div class="vol-card-title">${escHtml(v.title)}</div><div class="vol-card-desc">${escHtml(v.desc)}</div></a>`)
    .join('');

  const sectionBlocks = bodyHtml.replace(/<h2 /g, '\x00<h2 ').split('\x00').filter(Boolean).map(block => {
    const idMatch = block.match(/id="([^"]*)"/);
    const id = idMatch ? idMatch[1] : '';
    return `<section class="section-block" id="${id}">
<div class="section-eyebrow">${id}</div>
<div class="md">${block}</div>
</section>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escHtml(fm.og?.title || fm.title)} | SnailSploit</title>
<meta name="description" content="${escAttr(fm.description)}">
<meta name="author" content="Kai Aizen">
<meta name="robots" content="${fm.robots || 'index, follow, max-image-preview:large, max-snippet:-1'}">
<link rel="canonical" href="${fm.canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${FRAMEWORK_CSS}</style>

<meta property="og:type" content="article">
<meta property="og:title" content="${escAttr(fm.og?.title || fm.title)}">
<meta property="og:description" content="${escAttr(fm.og?.description || fm.description)}">
<meta property="og:url" content="${fm.canonical}">
<meta property="og:site_name" content="SnailSploit">
<meta content="en_US" property="og:locale"/>
<meta property="og:image" content="${ogImage}">
<meta content="1200" property="og:image:width"/>
<meta content="630" property="og:image:height"/>
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@SnailSploit">
<meta name="twitter:creator" content="@SnailSploit">
<meta name="twitter:title" content="${escAttr(fm.og?.title || fm.title)}">
<meta name="twitter:description" content="${escAttr(fm.og?.description || fm.description)}">
<meta name="twitter:image" content="${ogImage}">

<script type="application/ld+json">${jsonLd}</script>

<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0E0E0F">
${GTM_HEAD}
<link rel="stylesheet" href="/mobile.css">
<link rel="stylesheet" href="/ui.css?v=20260823">
${SKIP_STYLE}
</head>
<body>
<a class="ss-skip" href="#main">Skip to content</a>
${GTM_BODY}
${navHeader('frameworks', false)}
<nav class="site-crumbs" aria-label="Breadcrumb"><div class="site-crumbs-inner">${crumbs}</div></nav>

<section class="hero"><div class="hero-inner">
  <div class="eyebrow">${escHtml(vol.eyebrow)}</div>
  <h1 class="vol-h1"><span class="vol-num">${escHtml(vol.num)}.</span>${escHtml(vol.h1)}</h1>
  <p class="lede">${escHtml(fm.description)}</p>
</div></section>

<div class="toc-bar"><div class="toc-bar-inner">${tocBarLinks}</div></div>

<section class="body"><div class="body-inner">
${sectionBlocks}
</div></section>

<section class="next-vol"><div class="next-vol-inner">
${volCards}
</div></section>

${authorSection('author-eye')}
<!-- snailsploit-promptbank-cta --><section style="border-bottom:1px solid var(--line);background:var(--bg-sink)"><div style="max-width:1280px;margin:0 auto;padding:64px 32px"><div style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center"><div><div style="font-family:var(--f-mono);font-size:11px;color:var(--fg-3);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:14px">payloads · github</div><h2 style="margin:0 0 12px;font-size:40px;font-weight:500;letter-spacing:-0.03em;line-height:1.04">The full 4,980+ prompts live in the AATMF repo.</h2><p style="margin:0;font-size:15px;color:var(--fg-2);line-height:1.6;max-width:680px">This page is the operational catalog — 15 tactics, 240+ techniques, and the procedure counts you see below. The actual adversarial prompts, the YARA / Sigma detection signatures, the runbook templates, and the assessment scoring sheets are versioned in the open-source repository so they can be diff-able, fork-able, and contributed to.</p></div><div style="display:flex;flex-direction:column;gap:10px"><a href="https://github.com/SnailSploit/AATMF-Adversarial-AI-Threat-Modeling-Framework" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;padding:14px 22px;font-family:var(--f-mono);font-size:13px;letter-spacing:0.02em;text-decoration:none;border:1px solid var(--signal-2);background:var(--signal-2);color:var(--bg);white-space:nowrap">github repo →</a><a href="/cite-aatmf" style="display:inline-flex;align-items:center;gap:10px;padding:14px 22px;font-family:var(--f-mono);font-size:13px;letter-spacing:0.02em;text-decoration:none;border:1px solid var(--line-hi);background:transparent;color:var(--fg);white-space:nowrap">how to cite →</a></div></div></div></section>
${frameworkFooter()}
<script defer src="/ui.js?v=20260824"></script>
</body>
</html>`;
}

// ═══════════════════════════════════════════
//  MAIN BUILD
// ═══════════════════════════════════════════

const PAGES = [
  { src: 'ai-security/hidden-risks-offensive-perspective.md', template: 'article' },
  { src: 'ai-security/computational-countertransference.md', template: 'article' },
  { src: 'ai-security/rag-agentic-attack-surface.md', template: 'article' },
  { src: 'ai-security/wiki/attacks/data-poisoning.md', template: 'wiki', wikiCategory: 'attacks' },
  { src: 'ai-security/wiki/defenses/rate-limiting.md', template: 'wiki', wikiCategory: 'defenses' },
  { src: 'frameworks/aatmf/prompt-bank.md', template: 'framework' },
  { src: 'frameworks/aatmf/advanced-tactics.md', template: 'framework' },
  { src: 'frameworks/aatmf/infrastructure.md', template: 'framework' },
];

let ok = 0, fail = 0;
for (const page of PAGES) {
  const srcPath = join(CONTENT, page.src);
  if (!existsSync(srcPath)) {
    console.error(`  ✗ ${page.src}: file not found`);
    fail++;
    continue;
  }
  try {
    const raw = readFileSync(srcPath, 'utf8');
    const { data: fm, content } = matter(raw);

    const faqs = extractFaqs(content);
    let bodyHtml = processBody(content);
    bodyHtml = addHeadingIds(bodyHtml);

    let html;
    switch (page.template) {
      case 'article':
        html = articleTemplate(fm, bodyHtml, faqs);
        break;
      case 'wiki':
        html = wikiTemplate(fm, bodyHtml, faqs, page.wikiCategory);
        break;
      case 'framework':
        html = frameworkTemplate(fm, bodyHtml, faqs, page);
        break;
    }

    const outPath = join(ROOT, fm.slug, 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    const sz = (html.length / 1024).toFixed(1);
    console.log(`  ✓ ${fm.slug.padEnd(50)} ${sz} KB  (${wordCount(bodyHtml)} words, ${faqs.length} FAQs)`);
    ok++;
  } catch (e) {
    console.error(`  ✗ ${page.src}:`, e.message);
    fail++;
  }
}

console.log(`\nDone. ${ok} ok, ${fail} failed.`);
