/* snailsploit — UI behaviour layer.
   Exposes window.ss = { fuzzy, palette, toc, progress, copy, severity, bootstrap, _test }
   _test exposes pure functions for /tests.html harness. */
(function () {
  'use strict';

  // ── Analytics event tracker (dataLayer for GTM/GA4; no-op if absent) ─
  function track(event, payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: 'ss_' + event }, payload || {}));
    } catch (e) {}
  }

  // ── Fuzzy match (subsequence + position weighting) ──────────────────
  function fuzzyScore(query, text) {
    if (!query) return 0;
    var q = query.toLowerCase();
    var t = text.toLowerCase();
    if (t.indexOf(q) !== -1) {
      // direct substring — score on early position
      var idx = t.indexOf(q);
      return 1000 - idx;
    }
    // subsequence match
    var qi = 0, ti = 0, score = 0, prev = -2;
    while (qi < q.length && ti < t.length) {
      if (q[qi] === t[ti]) {
        score += (ti - prev === 1) ? 5 : 1;
        prev = ti;
        qi++;
      }
      ti++;
    }
    return qi === q.length ? score : 0;
  }

  function rank(query, items) {
    var scored = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var s = Math.max(
        fuzzyScore(query, item.title) * 2,
        fuzzyScore(query, item.url),
        item.tags ? fuzzyScore(query, item.tags.join(' ')) : 0
      );
      if (s > 0) scored.push({ item: item, score: s });
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, 12).map(function (s) { return s.item; });
  }

  // ── Palette ─────────────────────────────────────────────────────────
  var paletteEl = null, paletteInput = null, paletteResults = null;
  var paletteIndex = [], paletteActive = 0, paletteVisible = [];

  var paletteReturnFocus = null;
  function paletteOpen() {
    if (!paletteEl) buildPalette();
    paletteReturnFocus = document.activeElement;
    paletteEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    paletteInput.value = '';
    paletteActive = 0;
    renderResults('');
    setTimeout(function () { paletteInput.focus(); }, 0);
    track('palette_open', {});
  }

  function paletteClose() {
    if (paletteEl) paletteEl.classList.remove('is-open');
    document.body.style.overflow = '';
    if (paletteReturnFocus && typeof paletteReturnFocus.focus === 'function') {
      try { paletteReturnFocus.focus(); } catch (e) {}
    }
  }

  function renderResults(q) {
    var items = q ? rank(q, paletteIndex) : paletteIndex.slice(0, 12);
    paletteVisible = items;
    if (items.length === 0) {
      paletteResults.innerHTML = '<div class="ss-palette-empty">no matches</div>';
      return;
    }
    paletteResults.innerHTML = items.map(function (it, i) {
      var active = i === paletteActive ? ' is-active' : '';
      return '<a href="' + it.url + '" class="ss-palette-result' + active + '" data-i="' + i + '">'
        + escapeHtml(it.title)
        + '<span class="ss-palette-result-type">' + escapeHtml(it.type || 'page') + ' · ' + escapeHtml(it.url) + '</span></a>';
    }).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function buildPalette() {
    var html =
      '<div class="ss-palette-backdrop" role="dialog" aria-modal="true" aria-label="Search">' +
        '<div class="ss-palette">' +
          '<input class="ss-palette-input" type="text" placeholder="Search pages, CVEs, AATMF tactics…" autocomplete="off" spellcheck="false">' +
          '<div class="ss-palette-results"></div>' +
          '<div class="ss-palette-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>↵</kbd> open · <kbd>esc</kbd> close</span><span>' + paletteIndex.length + ' indexed</span></div>' +
        '</div>' +
      '</div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    paletteEl = div.firstChild;
    document.body.appendChild(paletteEl);
    paletteInput = paletteEl.querySelector('.ss-palette-input');
    paletteResults = paletteEl.querySelector('.ss-palette-results');

    paletteInput.addEventListener('input', function () {
      paletteActive = 0;
      renderResults(paletteInput.value.trim());
    });

    paletteEl.addEventListener('click', function (e) {
      if (e.target === paletteEl) paletteClose();
    });

    paletteInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { paletteClose(); }
      else if (e.key === 'Tab') {
        // Focus trap — only one focusable element inside, so trap on it
        e.preventDefault();
        paletteInput.focus();
      }
      else if (e.key === 'ArrowDown') { e.preventDefault(); paletteActive = Math.min(paletteVisible.length - 1, paletteActive + 1); renderResults(paletteInput.value.trim()); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); paletteActive = Math.max(0, paletteActive - 1); renderResults(paletteInput.value.trim()); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (paletteVisible[paletteActive]) {
          track('palette_open_result', { url: paletteVisible[paletteActive].url, query: paletteInput.value });
          window.location.href = paletteVisible[paletteActive].url;
        }
      }
    });
  }

  function bindPaletteShortcut() {
    document.addEventListener('keydown', function (e) {
      var metaOrCtrl = e.metaKey || e.ctrlKey;
      if (metaOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        paletteOpen();
      }
    });
    // Click trigger button(s)
    document.querySelectorAll('.ss-palette-trigger, [data-ss-palette]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); paletteOpen(); });
    });
  }

  // ── Progress bar ────────────────────────────────────────────────────
  function progressCompute(scrollY, docHeight, viewHeight) {
    var max = Math.max(1, docHeight - viewHeight);
    var pct = Math.max(0, Math.min(1, scrollY / max));
    return pct;
  }

  function initProgress() {
    // Only on article-like pages
    if (!document.querySelector('article, [data-ss-progress], .article-body, .article-hero')) return;
    var bar = document.createElement('div');
    bar.className = 'ss-progress';
    document.body.appendChild(bar);
    var raf = false;
    function update() {
      raf = false;
      var pct = progressCompute(window.scrollY, document.documentElement.scrollHeight, window.innerHeight);
      bar.style.width = (pct * 100).toFixed(2) + '%';
    }
    window.addEventListener('scroll', function () {
      if (!raf) { raf = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ── TOC ─────────────────────────────────────────────────────────────
  function collectHeadings() {
    var candidates = document.querySelectorAll('article h2, article h3, .article-body h2, .article-body h3, main h2, main h3');
    if (candidates.length < 3) candidates = document.querySelectorAll('h2, h3');
    var out = [];
    candidates.forEach(function (h) {
      if (h.closest('header, footer, .ss-toc, .ss-palette')) return;
      if (!h.id) {
        var slug = h.textContent.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
        if (slug && !document.getElementById(slug)) h.id = 'h-' + slug;
      }
      if (h.id && h.textContent.trim().length > 1) {
        out.push({ id: h.id, text: h.textContent.trim(), level: h.tagName === 'H3' ? 3 : 2 });
      }
    });
    return out;
  }

  function initToc() {
    if (document.querySelector('aside.toc, aside.ss-toc, #article-toc')) return;
    var headings = collectHeadings();
    if (headings.length < 3) return;
    if (window.innerWidth < 1280) return;
    var toc = document.createElement('aside');
    toc.className = 'ss-toc is-visible';
    toc.setAttribute('aria-label', 'On this page');
    toc.innerHTML = '<div class="ss-toc-label">On this page</div><ul class="ss-toc-list">' +
      headings.map(function (h) {
        return '<li class="ss-toc-item ss-toc-item--h' + h.level + '" data-target="' + h.id + '">'
          + '<a href="#' + h.id + '">' + escapeHtml(h.text) + '</a></li>';
      }).join('') + '</ul>';
    document.body.appendChild(toc);

    // Scrollspy
    var items = toc.querySelectorAll('.ss-toc-item');
    function spy() {
      var y = window.scrollY + 120;
      var active = null;
      headings.forEach(function (h) {
        var el = document.getElementById(h.id);
        if (el && el.offsetTop <= y) active = h.id;
      });
      items.forEach(function (li) {
        li.classList.toggle('is-active', li.dataset.target === active);
      });
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  // ── Copy-to-clipboard on <pre> ──────────────────────────────────────
  function initCopyButtons() {
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.closest('.ss-pre-wrap')) return;
      if (pre.parentElement && pre.parentElement.classList.contains('ss-pre-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'ss-pre-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ss-copy-btn';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.textContent = 'cp';
      btn.addEventListener('click', function () {
        var text = pre.innerText;
        track('copy_code', { length: text.length });
        var done = function () {
          btn.classList.add('is-copied');
          btn.textContent = '✓ copied';
          setTimeout(function () {
            btn.classList.remove('is-copied');
            btn.textContent = 'cp';
          }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else {
          fallbackCopy(text); done();
        }
      });
      wrap.appendChild(btn);
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // ── Severity chip normalisation ─────────────────────────────────────
  function applySeverityClass(el) {
    var sev = (el.dataset.severity || el.getAttribute('data-severity') || '').toLowerCase();
    if (!sev) return;
    var tier;
    if (sev === 'critical' || sev === 'crit') tier = 'critical';
    else if (sev === 'high' || sev === 'hig') tier = 'high';
    else if (sev === 'medium' || sev === 'med' || sev === 'moderate' || sev === 'mod') tier = 'medium';
    else if (sev === 'low') tier = 'low';
    else if (sev === 'pending' || sev === 'pen' || sev === '—') tier = 'pending';
    else return;
    el.classList.add('ss-severity', 'ss-severity--' + tier);
  }

  function initSeverity() {
    document.querySelectorAll('[data-severity]').forEach(applySeverityClass);
  }

  // ── Load search index ───────────────────────────────────────────────
  function loadIndex() {
    if (paletteIndex.length) return Promise.resolve(paletteIndex);
    return fetch('/search-index.json', { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) { paletteIndex = data || []; return paletteIndex; })
      .catch(function () { paletteIndex = []; return paletteIndex; });
  }

  // ── TOC click tracking ──────────────────────────────────────────────
  function bindTocTracking() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('.ss-toc-item a');
      if (a) track('toc_click', { hash: a.getAttribute('href') });
    });
  }

  // ── Outbound link tracking ──────────────────────────────────────────
  function bindOutboundTracking() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="http"]');
      if (!a) return;
      try {
        var u = new URL(a.href);
        if (u.hostname && u.hostname !== window.location.hostname) {
          track('outbound', { host: u.hostname, href: a.href });
        }
      } catch (e) {}
    });
  }

  // ── Skip-to-content link (a11y) ────────────────────────────────────
  function initSkipLink() {
    if (document.querySelector('.ss-skip-link')) return;
    var skip = document.createElement('a');
    skip.className = 'ss-skip-link';
    skip.href = '#main';
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
    // Ensure a #main anchor exists no matter how the page is structured.
    if (!document.getElementById('main')) {
      var existing = document.querySelector('main, article, [role="main"]');
      if (existing) {
        if (!existing.id) existing.id = 'main';
      } else {
        // Inject a focusable anchor immediately after the first <header>,
        // or at the top of <body> if there is no header.
        var anchor = document.createElement('div');
        anchor.id = 'main';
        anchor.setAttribute('tabindex', '-1');
        anchor.style.cssText = 'position:relative;outline:none';
        var header = document.querySelector('body > header, body > [role="banner"]');
        if (header && header.parentNode) {
          header.parentNode.insertBefore(anchor, header.nextSibling);
        } else {
          document.body.insertBefore(anchor, skip.nextSibling);
        }
      }
    }
  }

  // ── Mobile nav drawer ──────────────────────────────────────────────
  var drawerEl = null;
  function initMobileDrawer() {
    var header = document.querySelector('header');
    if (!header) return;
    var nav = header.querySelector('nav');
    if (!nav) return;
    // Inject trigger button — only visible on mobile via CSS
    var trigger = header.querySelector('.ss-drawer-trigger');
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'ss-drawer-trigger';
      trigger.setAttribute('aria-label', 'Open menu');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.textContent = 'menu';
      // Insert into the header's outer container
      var insertTarget = header.querySelector('.ss-palette-trigger');
      if (insertTarget && insertTarget.parentNode) insertTarget.parentNode.insertBefore(trigger, insertTarget);
      else header.appendChild(trigger);
    }
    trigger.addEventListener('click', function () {
      drawerOpen(nav);
    });
  }
  function drawerOpen(srcNav) {
    if (drawerEl) drawerClose();
    drawerEl = document.createElement('div');
    drawerEl.className = 'ss-drawer-backdrop is-open';
    drawerEl.innerHTML =
      '<div class="ss-drawer" role="dialog" aria-modal="true" aria-label="Navigation">' +
        '<div class="ss-drawer-head"><span class="ss-drawer-label">menu</span>' +
        '<button class="ss-drawer-close" type="button" aria-label="Close menu">close ×</button></div>' +
        '<nav class="ss-drawer-nav">' + srcNav.innerHTML + '</nav>' +
      '</div>';
    document.body.appendChild(drawerEl);
    document.body.style.overflow = 'hidden';
    drawerEl.addEventListener('click', function (e) {
      if (e.target === drawerEl || e.target.classList.contains('ss-drawer-close')) drawerClose();
    });
    document.addEventListener('keydown', drawerKeyHandler);
    track('drawer_open', {});
  }
  function drawerClose() {
    if (drawerEl) drawerEl.remove();
    drawerEl = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', drawerKeyHandler);
  }
  function drawerKeyHandler(e) {
    if (e.key === 'Escape') drawerClose();
  }

  // ── Bootstrap ───────────────────────────────────────────────────────
  function bootstrap() {
    loadIndex().then(function () {
      bindPaletteShortcut();
      initProgress();
      initToc();
      initCopyButtons();
      initSeverity();
      bindTocTracking();
      bindOutboundTracking();
      initSkipLink();
      initMobileDrawer();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // ── Test surface ────────────────────────────────────────────────────
  window.ss = {
    open: paletteOpen,
    close: paletteClose,
    drawerOpen: function () { var n = document.querySelector('header nav'); if (n) drawerOpen(n); },
    drawerClose: drawerClose,
    track: track,
    _test: {
      fuzzyScore: fuzzyScore,
      rank: rank,
      progressCompute: progressCompute,
      applySeverityClass: applySeverityClass,
      collectHeadings: collectHeadings,
      escapeHtml: escapeHtml
    }
  };
})();
