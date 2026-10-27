# Contact intake — Phase 2 security and measurement notes (27 Oct 2026)

## Live architecture
- Active Cloudflare Pages project: `snailsploit` bound to `SnailSploit/SnailSploit.com` / `main`.
- Form POSTs to `/api/contact` and sends via Resend.
- Production `RESEND_API_KEY` is configured; do not copy its value to GitHub.
- At the time of the audit, no Turnstile secret or widget site key is configured.
- Cloudflare zone is on **Free Website**. Its *one* allowed WAF rate-limiting rule is already in use for a separate leaked-credential expression. Do **not** replace or delete that rule to limit contact submissions.

## Delivered changes
- Parse only JSON, multipart and form-urlencoded content types.
- Read body as a stream and enforce a real 8 KiB cap independent of `Content-Length`.
- Same-origin browser form submission check (not a bot-authentication mechanism).
- Reject malformed payloads / excess metadata, sanitize email subject header controls.
- Return generic errors for provider failures and network exceptions; do not reflect provider responses.
- Disable submit button during a request, prevent accidental double sends, run client validity checks.
- Give useful 4xx feedback; do not open mailto fallback on bad form details.
- Live `RESEND_API_KEY` and endpoint behavior remain intact.

## KV throttle
The namespace `snailsploit-contact-throttle` provides best-effort per-IP throttling with a 5 request / 60s threshold and TTL of 120 seconds.
KV keys store SHA-256 digests of source IP values, rather than raw addresses.

**Limitations:** Workers KV uses eventual consistency, and read-modify-write is **not atomic**. Cloudflare's free Workers KV also has write limitations under bursts. This is *not* a global strict rate limiter and must not be treated as one. Use Cloudflare Turnstile or an atomic rate-limit service for stronger anti-spam guarantees. A transient KV failure is logged and the legitimate form flow is kept available.

## Turnstile activation procedure (not yet activated)
1. Create a **Managed** Turnstile widget for `snailsploit.com` in the Cloudflare dashboard.
2. Add its **public** site key to `contact.html` `#cf-turnstile-mount[data-sitekey]`.
3. Store the private secret in Cloudflare Pages **production** environment as `TURNSTILE_SECRET_KEY`. Never commit it.
4. Deploy the site key and secret as a coordinated change. **Do not set the secret first**, or all form requests will fail verification.
5. Test a real, authorized harmless submission and the challenge-failure path.
6. Add the Preview hostname and Preview secret separately if needed.

## Google Tag Manager / GA4 configuration (manual in GTM)
These `dataLayer` events are emitted by site code; they will **not** appear in GA4 until GTM is configured.
- Custom event trigger: `service_cta_click`. GA4 event name: `service_cta_click`; safe parameters `cta_context` and `target_type`. **Do not mark it as a key event**.
- Custom event trigger: `lead_form_submit`. GA4 recommended event name: `generate_lead`; safe parameter `form_type=general_contact`.
- Mark **`generate_lead`** as a key event in GA4 only after preview/debug verification.
- Never pass visitor names, emails, IP addresses, raw messages, or free-text form entries to GA4.
- Test using GTM Preview and GA4 DebugView. Avoid duplicate reporting when existing GTM tags already instrument forms.

## Validation, rollout and rollback
- CI tests: mock provider success/failed response/network error; oversized requests; form-origin checks; KV throttle and fallback; regex safety; page smoke checks.
- Preview HTTP tests are read-only; no real mail is sent by CI.
- Confirm production Cloudflare deployment corresponds to the merge SHA.
- Watch live contact delivery/Resend logs after launch. If legitimate contacts fail, revert the PR from `main` and unbind `RATE_LIMIT_KV` from production.
- Existing WAF custom rule blocking `/.well-known/security.txt` warrants a **separate**, scoped review. It is not changed here.
