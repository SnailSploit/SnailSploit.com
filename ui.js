/* snailsploit — UI behaviour layer.
   Exposes window.ss = { fuzzy, palette, toc, progress, copy, severity, bootstrap, _test }
   _test exposes pure functions for /tests.html harness. */
(function () {
  'use strict';

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

  function paletteOpen() {
    if (!paletteEl) buildPalette();
    paletteEl.classList.add('is-open');
    paletteInput.value = '';
    paletteActive = 0;
    renderResults('');
    setTimeout(function () { paletteInput.focus(); }, 0);
  }

  function paletteClose() {
    if (paletteEl) paletteEl.classList.remove('is-open');
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
      else if (e.key === 'ArrowDown') { e.preventDefault(); paletteActive = Math.min(paletteVisible.length - 1, paletteActive + 1); renderResults(paletteInput.value.trim()); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); paletteActive = Math.max(0, paletteActive - 1); renderResults(paletteInput.value.trim()); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (paletteVisible[paletteActive]) window.location.href = paletteVisible[paletteActive].url;
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

  // ── Bootstrap ───────────────────────────────────────────────────────
  function bootstrap() {
    loadIndex().then(function () {
      bindPaletteShortcut();
      initProgress();
      initToc();
      initCopyButtons();
      initSeverity();
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
