/**
 * POST /api/contact — contact form endpoint
 *
 * Receives the form submission and dispatches an email via Resend.
 *
 * Required env vars on Cloudflare Pages → Settings → Environment variables:
 *   RESEND_API_KEY     (from resend.com/api-keys)
 *   CONTACT_TO_EMAIL   (where messages get delivered; default: research@snailsploit.com)
 *
 * Optional:
 *   CONTACT_FROM_EMAIL (must be on a verified domain in Resend; default: forms@snailsploit.com)
 *
 * Falls back gracefully — if RESEND_API_KEY is unset, returns 503 so the
 * client-side JS falls through to the mailto: action.
 */
export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return new Response('Form endpoint not configured (set RESEND_API_KEY).', { status: 503 });
  }

  let data;
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded')) {
    const fd = await request.formData();
    data = Object.fromEntries(fd.entries());
  } else {
    data = await request.json().catch(() => ({}));
  }

  // Honeypot
  if (data._gotcha) return new Response('OK', { status: 200 });

  const required = ['name', 'email', 'message'];
  for (const k of required) {
    if (!data[k] || String(data[k]).trim().length < 1) {
      return new Response(`Missing field: ${k}`, { status: 400 });
    }
  }

  const to = env.CONTACT_TO_EMAIL || 'research@snailsploit.com';
  const from = env.CONTACT_FROM_EMAIL || 'forms@snailsploit.com';

  const subject = `[snailsploit] ${data.topic || 'contact'} — ${data.name}`;
  const text = [
    `From: ${data.name}${data.org ? ` (${data.org})` : ''}`,
    `Email: ${data.email}`,
    `Topic: ${data.topic || '(none)'}`,
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
    body: JSON.stringify({
      from,
      to,
      reply_to: data.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(`Resend error: ${err}`, { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Reject other methods cleanly
export async function onRequest({ request }) {
  if (request.method === 'POST') return onRequestPost(arguments[0]);
  return new Response('Method Not Allowed', { status: 405 });
}
