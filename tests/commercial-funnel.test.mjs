import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { onRequestPost } from '../functions/api/contact.js';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

function req(fields = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: 'Security Tester',
    email: 'tester@example.net',
    message: 'Authorized QA inquiry; no secrets.',
    topic: 'AI security assessment',
    ...fields,
  })) form.set(key, value);
  return new Request('https://snailsploit.com/api/contact', { method: 'POST', body: form });
}
const env = { RESEND_API_KEY: 'fake-test-key' };

test('valid contact payload preserves functioning Resend dispatch', async () => {
  let calls = 0;
  globalThis.fetch = async (url, opts) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(opts.method, 'POST');
    const body = JSON.parse(opts.body);
    assert.equal(body.reply_to, 'tester@example.net');
    assert.match(body.subject, /AI security assessment/);
    calls++;
    return new Response(JSON.stringify({ id: 'test-only' }), { status: 200 });
  };
  const response = await onRequestPost({ request: req(), env });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(calls, 1);
});

test('invalid JSON shape is rejected without contacting mail service', async () => {
  globalThis.fetch = () => { throw new Error('Unexpected external call'); };
  for (const json of ['null', '[]', '"text"']) {
    const request = new Request('https://snailsploit.com/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: json
    });
    const response = await onRequestPost({ request, env });
    assert.equal(response.status, 400);
  }
});

test('oversized metadata and invalid email are rejected', async () => {
  globalThis.fetch = () => { throw new Error('Unexpected external call'); };
  assert.equal((await onRequestPost({ request: req({ name: 'a'.repeat(121) }), env })).status, 400);
  assert.equal((await onRequestPost({ request: req({ email: 'invalid' }), env })).status, 400);
});

test('provider failure is generic to user; provider response is not reflected', async () => {
  globalThis.fetch = async () => new Response('internal provider details: confidential', { status: 403 });
  const response = await onRequestPost({ request: req(), env });
  assert.equal(response.status, 502);
  const body = await response.text();
  assert.doesNotMatch(body, /confidential|internal provider/i);
  assert.match(body, /Delivery temporarily unavailable/);
});

test('commercial routes have canonical metadata and tracked CTAs', () => {
  const page = readFileSync(new URL('../services/ai-agent-security/index.html', import.meta.url), 'utf8');
  const services = readFileSync(new URL('../services.html', import.meta.url), 'utf8');
  const article = readFileSync(new URL('../ai-security/agentic-ai-threat-landscape/index.html', import.meta.url), 'utf8');
  const contact = readFileSync(new URL('../contact.html', import.meta.url), 'utf8');
  const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const llms = readFileSync(new URL('../llms.txt', import.meta.url), 'utf8');
  assert.match(sitemap, /https:\/\/snailsploit\.com\/services\/ai-agent-security\//);
  assert.match(llms, /\[AI Agent Security Assessment\]/);
  assert.match(page, /<link rel="canonical" href="https:\/\/snailsploit.com\/services\/ai-agent-security\/">/);
  assert.match(page, /data-ss-cta="ai_agent_service_primary"/);
  assert.match(services, /href="\/services\/ai-agent-security\/"/);
  assert.match(article, /href="\/services\/ai-agent-security\/"/);
  assert.match(contact, /lead_form_submit/);
  assert.match(contact, /has NOT been sent/);
});

test('conversion instrumentation never reads input values', () => {
  const js = readFileSync(new URL('../commercial-events.js', import.meta.url), 'utf8');
  assert.match(js, /service_cta_click/);
  assert.doesNotMatch(js, /\.value\b|FormData|email|message\b/);
});


test('body limit is enforced even without trusted content-length', async () => {
  globalThis.fetch = () => { throw new Error('Unexpected provider call'); };
  const request = req({ message: 'A'.repeat(9000) });
  assert.equal(request.headers.get('content-length'), null);
  const response = await onRequestPost({ request, env });
  assert.equal(response.status, 413);
});

test('cross-origin submissions are rejected; same-origin requests still work', async () => {
  globalThis.fetch = async () => new Response('{"id":"ok"}', { status: 200 });
  const alien = req();
  alien.headers.set('Origin', 'https://attacker.invalid');
  assert.equal((await onRequestPost({ request: alien, env })).status, 403);

  const normal = req();
  normal.headers.set('Origin', 'https://snailsploit.com');
  assert.equal((await onRequestPost({ request: normal, env })).status, 200);
});

test('unsupported media type is rejected, while JSON remains accepted', async () => {
  let count = 0;
  globalThis.fetch = async () => { count++; return new Response('{"id":"ok"}', { status: 200 }); };
  const bad = new Request('https://snailsploit.com/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'contact'
  });
  assert.equal((await onRequestPost({ request: bad, env })).status, 415);
  const valid = new Request('https://snailsploit.com/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'test@example.net', message: 'Hello' })
  });
  assert.equal((await onRequestPost({ request: valid, env })).status, 200);
  assert.equal(count, 1);
});

test('email delivery exceptions never expose provider information', async () => {
  globalThis.fetch = async () => { throw new Error('secret connection details'); };
  const response = await onRequestPost({ request: req(), env });
  assert.equal(response.status, 502);
  const message = await response.text();
  assert.doesNotMatch(message, /secret connection details/);
});

test('untrusted topic is sanitized in the email subject', async () => {
  let subject;
  globalThis.fetch = async (url, opts) => {
    subject = JSON.parse(opts.body).subject;
    return new Response('{"id":"ok"}', { status: 200 });
  };
  const response = await onRequestPost({ request: req({ topic: 'Assessment\r\nBcc: risk@example.net' }), env });
  assert.equal(response.status, 200);
  assert.doesNotMatch(subject, /[\r\n]/);
});
