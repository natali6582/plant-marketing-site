import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkLinks, classifyHttpStatus, formatReport, getExitCode } from './links.mjs';

test('HTTP 200/204/206/299 are verified', () => {
  for (const status of [200, 204, 206, 299]) assert.equal(classifyHttpStatus(status), 'verified');
});

test('definitive HTTP 404/410 and every 5xx response are broken', () => {
  for (const status of [404, 410, ...Array.from({ length: 100 }, (_, i) => 500 + i)]) {
    assert.equal(classifyHttpStatus(status), 'broken');
  }
});

test('403, authentication/rate-limit blocks, HTTP timeout and unresolved redirects require manual verification', () => {
  for (const status of [301, 302, 307, 400, 401, 403, 405, 408, 429, 451]) {
    assert.equal(classifyHttpStatus(status), 'unreachable-from-CI');
  }
});

test('one attempt per unique URL; keep the declared checker identity and ordinary redirects', async () => {
  const calls = [];
  const results = await checkLinks(['https://example.test/b', 'https://example.test/a', 'https://example.test/b'], {
    request: async (url, options) => {
      calls.push(url);
      assert.equal(options.method, 'GET');
      assert.equal(options.redirect, 'follow');
      assert.equal(options.headers['User-Agent'], 'Plan-T-Knowledge-Link-Check/1.0');
      assert.ok(options.signal instanceof AbortSignal);
      return { status: 403 };
    },
  });
  assert.deepEqual(calls, ['https://example.test/a', 'https://example.test/b']);
  assert.ok(results.every(result => result.classification === 'unreachable-from-CI'));
  assert.equal(getExitCode(results), 0);
});

test('timeouts, DNS and TLS failures are unreachable and never retried', async () => {
  for (const error of [
    Object.assign(new Error('deadline'), { name: 'TimeoutError' }),
    Object.assign(new Error('fetch failed'), { cause: { code: 'UND_ERR_CONNECT_TIMEOUT' } }),
    Object.assign(new Error('fetch failed'), { cause: { code: 'ENOTFOUND' } }),
    Object.assign(new Error('fetch failed'), { cause: { code: 'CERT_HAS_EXPIRED' } }),
  ]) {
    let calls = 0;
    const results = await checkLinks(['https://example.test/blocked'], {
      request: async () => { calls++; throw error; },
    });
    assert.equal(calls, 1);
    assert.equal(results[0].classification, 'unreachable-from-CI');
    assert.ok(results[0].detail.includes(error.cause?.code ?? error.name));
    assert.equal(getExitCode(results), 0);
  }
});

test('a reachable 404/410/5xx fails even alongside verified and unreachable links', async () => {
  for (const status of [404, 410, 500, 502, 503, 504]) {
    const results = await checkLinks(['https://example.test/ok', 'https://example.test/blocked', 'https://example.test/broken'], {
      request: async url => ({ status: url.endsWith('/broken') ? status : url.endsWith('/ok') ? 200 : 403 }),
    });
    assert.equal(getExitCode(results), 1);
    assert.match(formatReport(results), /1\/3 external URLs verified by HTTP; 1 unreachable-from-CI; 1 broken/);
    assert.match(formatReport(results), new RegExp(`BROKEN HTTP ${status} https://example.test/broken`));
  }
});

test('response-body cleanup cannot hide a definitive HTTP error', async () => {
  const results = await checkLinks(['https://example.test/gone'], {
    request: async () => ({ status: 410, body: { cancel: async () => { throw new Error('closed'); } } }),
  });
  assert.equal(results[0].classification, 'broken');
  assert.equal(getExitCode(results), 1);
});

test('11 verified + 7 HTTP 403 + 1 timeout remains 11/19, with all eight URLs in the warning list', async () => {
  const urls = Array.from({ length: 19 }, (_, i) => `https://example.test/${String(i).padStart(2, '0')}`);
  const request = async url => {
    const i = Number(new URL(url).pathname.slice(1));
    if (i === 18) throw Object.assign(new Error('deadline'), { name: 'TimeoutError' });
    return { status: i < 11 ? 200 : 403 };
  };
  const first = await checkLinks([...urls], { request });
  const second = await checkLinks([...urls].reverse(), { request });
  const report = formatReport(first);
  assert.deepEqual(first, second);
  assert.equal(report, formatReport(second));
  assert.equal(getExitCode(first), 0);
  assert.match(report, /11\/19 external URLs verified by HTTP; 8 unreachable-from-CI; 0 broken/);
  assert.match(report, /WARNING: 8 unreachable-from-CI — verify by hand; not counted as verified/);
  for (const url of urls.slice(11)) assert.ok(report.includes(`UNREACHABLE-FROM-CI ${url}`));
  assert.equal(report.split('\n').filter(line => line.startsWith('VERIFIED ')).length, 11);
});

test('all verified links succeed without a warning; an empty input has an explicit 0/0 report', async () => {
  const results = await checkLinks(['https://example.test/ok'], { request: async () => ({ status: 200 }) });
  assert.equal(getExitCode(results), 0);
  assert.doesNotMatch(formatReport(results), /WARNING/);
  assert.match(formatReport([]), /0\/0 external URLs verified by HTTP; 0 unreachable-from-CI; 0 broken/);
});
