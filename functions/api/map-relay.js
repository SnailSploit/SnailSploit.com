/**
 * POST /api/map-relay — email relay for the SnailSploit Map Worker.
 *
 * Lives on the snailsploit.com Pages project so it inherits RESEND_API_KEY.
 * The threat-feed Worker POSTs digest emails here; this function sends via Resend.
 *
 * Auth: Bearer MAP_RELAY_SECRET (set as Pages env var).
 *
 * Body: { from, to: [...], subject, html }
 */

const ALLOWED_FROM_DOMAINS = ['snailsploit.com'];
const ALLOWED_TO_PATTERNS = [
  /@snailsploit\.com$/i,
  /^kaiaizendev@gmail\.com$/i,
  /^abeshemesh97@gmail\.com$/i,
];

function jsonResp(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function fromOk(from) {
  const m = from.match(/<([^>]+)>|([^\s<>]+@[^\s<>]+)/);
  const addr = m ? (m[1] || m[2]) : from;
  return ALLOWED_FROM_DOMAINS.some(d => addr.toLowerCase().endsWith('@' + d));
}

function toOk(to) {
  return to.every(t => ALLOWED_TO_PATTERNS.some(p => p.test(t)));
}

export async function onRequestPost({ request, env }) {
  // Auth: shared secret from the Worker.
  const expected = env.MAP_RELAY_SECRET;
  if (!expected) {
    return jsonResp({ error: 'relay not configured (MAP_RELAY_SECRET unset)' }, 503);
  }
  const auth = request.headers.get('Authorization') || '';
  if (auth !== `Bearer ${expected}`) {
    return jsonResp({ error: 'unauthorized' }, 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResp({ error: 'invalid json' }, 400);
  }

  const { from, to, subject, html } = body || {};
  if (typeof from !== 'string' || !Array.isArray(to) || to.length === 0 ||
      typeof subject !== 'string' || typeof html !== 'string') {
    return jsonResp({ error: 'missing fields: from, to[], subject, html' }, 400);
  }
  if (!fromOk(from)) {
    return jsonResp({ error: 'from address not allowed' }, 403);
  }
  if (!toOk(to)) {
    return jsonResp({ error: 'recipient not allowed' }, 403);
  }
  if (subject.length > 200) {
    return jsonResp({ error: 'subject too long' }, 400);
  }
  if (html.length > 256 * 1024) {
    return jsonResp({ error: 'body too large' }, 413);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    return jsonResp({ error: 'resend not configured' }, 503);
  }

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  const respBody = await resendRes.text();
  if (!resendRes.ok) {
    return jsonResp(
      { error: 'resend api error', status: resendRes.status, body: respBody.slice(0, 300) },
      502,
    );
  }
  return jsonResp({ ok: true, status: resendRes.status, body: JSON.parse(respBody) });
}

export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
  return jsonResp({ error: 'method not allowed; POST only' }, 405);
}
