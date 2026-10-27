# Commercial conversion — Phase 1 audit (2026-10-27)

## Deployment source of truth
- Production domain: `snailsploit.com`, Cloudflare Pages project `snailsploit`, GitHub `SnailSploit/SnailSploit.com`, branch `main`.
- Historical Astro project: separate Cloudflare Pages project `snailsploit-build`, GitHub `SnailSploit/snailsploit-build`, branch `master`. Do not assume editing Astro changes the live site.
- All changes in this PR are isolated to a feature branch. Do not merge until preview smoke tests are complete.

## Implemented in this PR
- Clarify services-page research-led value proposition and put the scoping process before detailed service sections.
- Link service CTAs directly to the contact form.
- Give business inquiries a direct path from contact-page hero; preserve secure research-disclosure channels.
- Improve message copy and distinguish a server-confirmed submission from an unconfirmed mailto fallback.
- Add a research-article contextual commercial CTA.
- Push non-PII `service_cta_click` and `lead_form_submit` events into `dataLayer`.

## Important: measurement requires GTM configuration
The new `dataLayer` events do not become GA4 events automatically. In GTM, create custom-event triggers for `service_cta_click` and `lead_form_submit`, with privacy-safe parameters. Only mark a confirmed submission as a key event. Do NOT mark CTA clicks as business leads. Avoid user email, message text, IP or other PII in analytics.

## Security / reliability audit: release checklist
- [ ] **Contact form production test:** submit an authorized harmless test through `/contact#form`, confirm response, Resend delivery and inbox receipt. No unapproved production submissions.
- [ ] **Turnstile:** production currently has `RESEND_API_KEY` configured but no `TURNSTILE_SECRET_KEY`; frontend site key is empty. Set both and fail closed after activation.
- [ ] **Rate limiting:** production lacks `RATE_LIMIT_KV`. Current endpoint silently skips rate limiting and KV get/put would not provide a strong atomic rate limiter under concurrency. Prefer Cloudflare rate limiting/WAF or a dedicated atomic implementation.
- [ ] **Failure privacy:** `functions/api/contact.js` currently returns raw provider error bodies to the client on Resend failures. Replace with generic error messages and server-side logging before production merge.
- [ ] **Input robustness:** backend checks Content-Length but does not independently enforce a streamed payload limit; add strict parsing cap and reject non-object JSON/array payloads.
- [ ] **Turnstile consistency:** server must not require a Turnstile token until the frontend site key and secret are deployed together.
- [ ] **Preview:** Pages preview environments do not have `RESEND_API_KEY`; real delivery should not be presumed from preview alone.
- [ ] **SEO:** confirm title, canonical, robots and existing article URLs remain unchanged apart from intentional copy.
- [ ] **Responsive and accessibility QA:** inspect mobile/desktop, keyboard navigation and focus behavior.
- [ ] **Business claims:** verify CVE counts, patches and organization credits separately before using them as the central sales claim.

## Smoke-test commands / checks
- GET `/services`, `/contact`, `/ai-security/agentic-ai-threat-landscape/`.
- On services page click primary CTA: navigates to `/contact#form`.
- On research article click assessment CTA: navigates to `/services`.
- Verify `commercial-events.js` loads and GTM sees `service_cta_click` once per click.
- Submit a deliberately invalid form in isolated preview: `lead_form_submit` MUST NOT fire.
- After approved production configuration, successful submission fires `lead_form_submit` once, with no personal data.
- Validate `mailto:` fallback is clearly labeled *not sent*.

## Deferred (phase 2)
Separate `/services/ai-agent-security` landing page, commercial qualification fields, full lead tracking, protection hardening above, and tests for the contact handler.
