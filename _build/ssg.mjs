/**
 * Static Site Generation for snailsploit.com
 *
 * Converts React/JSX prototype pages into pre-rendered static HTML.
 * Drops React, ReactDOM, and Babel-standalone runtime entirely.
 * Net effect: pages go from ~5MB JS download + 2-3s render to pure HTML.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { transformSync } from 'esbuild';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import vm from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const READ = (p) => readFileSync(join(ROOT, p), 'utf8');
const WRITE = (p, s) => writeFileSync(join(ROOT, p), s);

/**
 * Compile a JSX/JS file string to plain JS (CommonJS-style for vm).
 * Strips ES module imports — everything we need is on the shared sandbox.
 */
function compileJSX(source) {
  // strip import/export statements; we use globals
  source = source
    .replace(/^\s*import\s.+?from\s.+?;?\s*$/gm, '')
    .replace(/^\s*import\s.+?;\s*$/gm, '')
    .replace(/^\s*export\s+(default\s+)?/gm, '');
  return transformSync(source, {
    loader: 'jsx',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: 'es2020',
  }).code;
}

/**
 * Build a fresh sandbox with React + a fake `window`/`document`/`ReactDOM` so
 * the prototype's `ReactDOM.createRoot(...).render(<Page/>)` calls capture
 * the React element instead of trying to mount to a real DOM.
 */
function makeSandbox() {
  let captured = null;
  const fakeRoot = {
    render(el) { captured = el; },
  };
  const fakeReactDOM = {
    createRoot() { return fakeRoot; },
    render(el) { captured = el; },
  };
  const sb = {
    React,
    ReactDOM: fakeReactDOM,
    console,
    setTimeout, clearTimeout,
    setInterval, clearInterval,
    Date, Math, JSON, Object, Array, String, Number, Boolean, RegExp, Error, Map, Set, Promise,
    encodeURIComponent, decodeURIComponent,
    document: {
      getElementById: () => ({}),
      createElement: () => ({}),
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      documentElement: { style: {} },
      body: { style: {}, classList: { add(){}, remove(){}, toggle(){} } },
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    requestAnimationFrame: (cb) => setTimeout(cb, 0),
    cancelAnimationFrame: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'https://snailsploit.com/', pathname: '/', search: '', hash: '' },
    fetch: async () => ({ ok: false, json: async () => ({}), text: async () => '' }),
  };
  sb.window = sb;
  sb.globalThis = sb;
  vm.createContext(sb);
  return {
    sb,
    getCaptured: () => captured,
  };
}

/**
 * For a given page HTML, build the React element tree by executing
 * its data → marks → layout → page → inline scripts inside a sandbox.
 */
function renderPage(html, fileName) {
  const { sb, getCaptured } = makeSandbox();

  // Find all <script> tags with src + their inline content
  const scriptTags = [...html.matchAll(/<script\s+[^>]*?src=["']([^"']+)["'][^>]*?>\s*<\/script>/g)];
  const inlineTags = [...html.matchAll(/<script\s+type=["']text\/babel["'][^>]*?>([\s\S]*?)<\/script>/g)];

  // External scripts to execute (skip CDN React/Babel; we have our own)
  for (const m of scriptTags) {
    const src = m[1];
    if (src.startsWith('http')) continue; // skip CDN
    let p = src.startsWith('/') ? src.slice(1) : src;
    // Some pages reference brand/marks.jsx, others /brand/marks.jsx
    if (!existsSync(join(ROOT, p))) {
      console.warn(`  ! missing ${p} for ${fileName}`);
      continue;
    }
    const source = readFileSync(join(ROOT, p), 'utf8');
    const code = compileJSX(source);
    try {
      vm.runInContext(code, sb, { filename: p });
    } catch (e) {
      console.warn(`  ! exec error in ${p}: ${e.message}`);
      throw e;
    }
  }

  // Inline scripts (the page's render call)
  for (const m of inlineTags) {
    if (m[0].includes('src=')) continue; // already handled
    // Wrap in IIFE to give inline page-locals their own scope (avoids
    // const/let collisions with same-named identifiers from _layout.jsx).
    const code = compileJSX(`(function(){\n${m[1]}\n}).call(window);`);
    try {
      vm.runInContext(code, sb, { filename: `${fileName}#inline` });
    } catch (e) {
      console.warn(`  ! inline error in ${fileName}: ${e.message}`);
      throw e;
    }
  }

  const el = getCaptured();
  if (!el) throw new Error(`no element captured from ${fileName}`);
  return renderToStaticMarkup(el);
}

/**
 * Replace the runtime React/Babel scaffolding in the page HTML with the
 * pre-rendered markup. Keep all SEO blocks, fonts, styles, analytics intact.
 */
function staticize(html, renderedHTML) {
  // 1. Strip every <script> tag (we don't need any of them at runtime)
  let out = html.replace(/<script[\s\S]*?<\/script>\s*/g, '');

  // 2. Inject the rendered HTML in place of <div id="root"></div>
  if (out.includes('<div id="root"></div>')) {
    out = out.replace('<div id="root"></div>', renderedHTML);
  } else if (out.includes('<div id="root"/>')) {
    out = out.replace('<div id="root"/>', renderedHTML);
  } else {
    // fallback: stick it just before </body>
    out = out.replace('</body>', renderedHTML + '\n</body>');
  }

  // 3. Re-add the analytics beacon (only meaningful runtime script we keep)
  // Cloudflare Web Analytics — placeholder token, defer
  const cfa = `<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "REPLACE_WITH_CF_WEB_ANALYTICS_TOKEN"}'></script>`;
  out = out.replace('</body>', `  ${cfa}\n</body>`);

  return out;
}

/**
 * Critical CSS: the brand tokens.css gets inlined into <head> for every page
 * so first paint doesn't wait for a separate request.
 */
function inlineTokens(html) {
  if (!existsSync(join(ROOT, 'brand/tokens.css'))) return html;
  const css = readFileSync(join(ROOT, 'brand/tokens.css'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return html.replace(
    /<link\s+rel=["']stylesheet["']\s+href=["']\/?brand\/tokens\.css["']\s*\/?>/g,
    `<style>${css}</style>`
  );
}

/* ───────────────────────── main ───────────────────────── */
const HTML_FILES = readdirSync(ROOT).filter(f => f.endsWith('.html'));
console.log(`found ${HTML_FILES.length} html files`);

let ok = 0, fail = 0;
for (const fn of HTML_FILES) {
  const html = READ(fn);
  // skip files that don't have a <div id="root">
  if (!html.includes('id="root"')) {
    console.log(`  − ${fn} (no root, skip)`);
    continue;
  }
  try {
    const rendered = renderPage(html, fn);
    let out = staticize(html, rendered);
    out = inlineTokens(out);
    WRITE(fn, out);
    const sz = (out.length / 1024).toFixed(1);
    console.log(`  ✓ ${fn.padEnd(28)} ${sz} KB`);
    ok++;
  } catch (e) {
    console.error(`  ✗ ${fn}:`, e.message);
    fail++;
  }
}

console.log(`\nDone. ${ok} ok, ${fail} failed.`);
