/**
 * POST /api/contact — contact form endpoint
 *
 * Hardened pipeline:
 *   1. Per-IP rate limit (5 req / 60s) via Workers KV — graceful no-op if KV not bound
 *   2. Cloudflare Turnstile token verification — graceful no-op if TURNSTILE_SECRET_KEY unset
 *   3. Honeypot field check (_gotcha)
 *   4. Required-field validation + length cap
 *   5. Resend email dispatch
 *
 * Required env vars on Cloudflare Pages → Settings → Environment variables:
 *   RESEND_API_KEY          (from resend.com/api-keys)
 *
 * Recommended (form will fail closed without them once configured):
 *   TURNSTILE_SECRET_KEY    (from dash.cloudflare.com → Turnstile)
 *   RATE_LIMIT_KV           (KV namespace binding, name "RATE_LIMIT_KV")
 *
 * Optional:
 *   CONTACT_TO_EMAIL        (default Kai@snailsploit.com)
 *   CONTACT_FROM_EMAIL      (must be on a verified Resend domain; default forms@snailsploit.com)
 *
 * If RESEND_API_KEY is unset, returns 503 so the client JS falls through to mailto:.
 */
const MAX_BODY = 8 * 1024;        // 8 KB
const MAX_MSG  = 4000;            // 4000 chars
const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX = 5;

function jsonResp(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getIP(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
    'unknown'
  );
}

async function rateLimit(env, ip) {
  if (!env.RATE_LIMIT_KV) return { ok: true, remaining: RATE_LIMIT_MAX, skipped: true };
  const key = `cf-form:${ip}`;
  const now = Date.now();
  const raw = await env.RATE_LIMIT_KV.get(key);
  let entries = raw ? JSON.parse(raw) : [];
  entries = entries.filter((t) => now - t < RATE_LIMIT_WINDOW_SEC * 1000);
  if (entries.length >= RATE_LIMIT_MAX) {
    return { ok: false, remaining: 0, retryAfter: RATE_LIMIT_WINDOW_SEC };
  }
  entries.push(now);
  await env.RATE_LIMIT_KV.put(key, JSON.stringify(entries), {
    expirationTtl: RATE_LIMIT_WINDOW_SEC * 2,
  });
  return { ok: true, remaining: RATE_LIMIT_MAX - entries.length };
}

async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: 'missing-token' };
  const fd = new FormData();
  fd.append('secret', env.TURNSTILE_SECRET_KEY);
  fd.append('response', token);
  if (ip) fd.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: fd,
  });
  const data = await r.json().catch(() => ({}));
  return { ok: !!data.success, codes: data['error-codes'] || [] };
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const ip = getIP(request);

  // 1. Rate limit
  const rl = await rateLimit(env, ip);
  if (!rl.ok) {
    return new Response('Rate limit exceeded — try again in a minute.', {
      status: 429,
      headers: { 'Retry-After': String(rl.retryAfter || RATE_LIMIT_WINDOW_SEC) },
    });
  }

  // 2. Body parse with size cap
  const cl = parseInt(request.headers.get('content-length') || '0', 10);
  if (cl > MAX_BODY) return new Response('Body too large', { status: 413 });

  let data;
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded')) {
      const fd = await request.formData();
      data = Object.fromEntries(fd.entries());
    } else {
      data = await request.json();
    }
  } catch (e) {
    return new Response('Invalid body', { status: 400 });
  }

  // 3. Honeypot
  if (data._gotcha) return jsonResp({ ok: true }, 200);

  // 4. Turnstile (always verified once configured)
  const ts = await verifyTurnstile(env, data['cf-turnstile-response'] || data.token, ip);
  if (!ts.ok) {
    return new Response(`Turnstile verification failed: ${ts.reason || ts.codes?.join(',')}`, { status: 403 });
  }

  // 5. Field validation
  const required = ['name', 'email', 'message'];
  for (const k of required) {
    if (!data[k] || String(data[k]).trim().length < 1) {
      return new Response(`Missing field: ${k}`, { status: 400 });
    }
  }
  if (String(data.message).length > MAX_MSG) {
    return new Response(`Message too long (max ${MAX_MSG} chars)`, { status: 400 });
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(String(data.email))) {
    return new Response('Invalid email', { status: 400 });
  }

  // 6. Resend dispatch — only required env that must be set for the form to work
  if (!env.RESEND_API_KEY) {
    return new Response('Form endpoint not configured (set RESEND_API_KEY).', { status: 503 });
  }

  const to   = env.CONTACT_TO_EMAIL   || 'Kai@snailsploit.com';
  const from = env.CONTACT_FROM_EMAIL || 'forms@snailsploit.com';
  const subject = `[snailsploit] ${data.topic || 'contact'} — ${data.name}`;
  const text = [
    `From: ${data.name}${data.org ? ` (${data.org})` : ''}`,
    `Email: ${data.email}`,
    `Topic: ${data.topic || '(none)'}`,
    `IP: ${ip}`,
    '',
    String(data.message),
    '',
    '— Submitted via snailsploit.com contact form',
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, reply_to: data.email, subject, text }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(`Resend error: ${err}`, { status: 502 });
  }

  return jsonResp({
    ok: true,
    rateLimit: { remaining: rl.remaining, skipped: rl.skipped || false },
    turnstile: { verified: !ts.skipped },
  }, 200);
}

export async function onRequest(ctx) {
  if (ctx.request.method === 'POST') return onRequestPost(ctx);
  if (ctx.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  return new Response('Method Not Allowed', { status: 405 });
}
