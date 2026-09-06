# External-link policy for the knowledge center

Requested policy, 2026-09-06. Implemented on a branch from updated main `d6cbb32`. Scope: the knowledge link checker, its regression tests and existing knowledge-only CI workflow. No page, source URL, indexing flag or professional content changes.

| Classification | Evidence | Effect |
| --- | --- | --- |
| `verified` | Final HTTP 2xx response | Counted in the verified numerator |
| `unreachable-from-CI` | HTTP 403 or another access/request restriction, timeout, DNS/TLS/connection failure, or a response outside the verified/broken status sets | Warning with every original URL and its HTTP status/error reason; verify by hand; not counted as verified |
| `broken` | A reachable host returns a definitive HTTP 404, 410 or 5xx response | Fails the check |

The existing 20-second request deadline and declared `Plan-T-Knowledge-Link-Check/1.0` identity remain. Each unique original URL gets **one attempt**, with normal HTTP redirects followed. No retry loop, browser identity spoofing or block bypass is used. Classification reflects HTTP/network evidence; it does not approve the destination's content or mark a manual review complete.

The report preserves its denominator. For example, 11 successful responses, seven 403 responses and one timeout produce **11/19 verified, 8 unreachable-from-CI, 0 broken**, exit 0, and a full eight-URL warning list. Adding a definitive broken response makes the exit code 1. A successful CI job means no broken links were detected; it does not mean every link was verified.

The full report is retained in the existing `knowledge-link-evidence` artifact (`links.log`). GitHub also receives a warning annotation when manual verification is needed. Bash pipeline failure propagation stays enabled, so `tee` cannot hide broken-link failures.

Regression checks use injected HTTP/network outcomes without accessing external websites:

- 2xx, 404/410, all 5xx, blocked/authentication/rate-limit responses and redirects.
- Timeout, DNS and TLS failures; exactly one attempt per unique URL and an unchanged checker identity.
- A mixed result with any broken link exits 1; unreachable-only results exit 0 with a warning.
- The 11/19 fixture retains all eight unreachable URLs and produces identical results/reports from fresh inputs in a different order.
- Response-body cleanup cannot erase a definitive HTTP error.

Run: `node --experimental-strip-types --test scripts/knowledge/links.test.mjs`. The existing external-links CI job runs these tests before the live check.
