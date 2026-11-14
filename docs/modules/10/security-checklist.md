# Security controls and threat model

Protect provider credentials, the visitor's demo board, their browser, and availability. Untrusted inputs include prompts, task descriptions, retrieved passages, role handoffs, provider text and local evidence. A signed anonymous demo session is not an authenticated user account.

| Threat / control | Implementation | Evidence |
|---|---|---|
| Server-side secrets | Provider modules are server-only; sensitive Vercel Production variables; no public key variables | Build marker scan; no secrets in tracked files |
| Malformed / oversized / cross-origin input | Strict Zod objects, bounded streaming JSON reader, origin check | HTTP boundary tests + live verifier |
| Tool escalation / foreign IDs | Fixed tool allowlists, validated arguments, scoped session board, revision/proposal checks | Inherited action and agent tests |
| Unapproved writes | Preview then explicit human approval; ARCHIVE confirmation | Inherited action tests; retained UI |
| Unsafe model HTML | Zero-tag parser sanitizer before provider output enters state, revalidation after sanitizing, final React text nodes | tests/security.test.tsx and live /api/security fixtures |
| Untrusted instructions | Common override/exfiltration/bypass patterns checked before model calls; task/source/handoff inspection | Injection tests and live 422 responses |
| Source poisoning / arbitrary fetch | Fixed fictional corpus, selected-source IDs only; no uploads/remote fetching; suspicious source text blocks synthesis | Source scope tests and visible trust rules |
| Request abuse | 30 writes/route/minute, 60 reads/route/minute, 180 total/client/minute; AI 12/client/minute and 60/client/24h; 60 AI/process/minute | Threshold/concurrency/capacity tests, live actual Knowledge throttling |
| Reset bypass | Client bucket derives from trusted Vercel edge IP, HMAC keyed by server secret, independent of cookies | Unit identity test; live erase then probe remains 429 |
| Privacy | Default tab storage; optional seven-day sliding inactivity retention; encrypted 24h cookies; erase controls | Privacy tests and browser walkthrough |
| Safe operational errors | Generic unhandled errors; no request bodies or key values logged by app | Error tests and code inspection |
| Browser boundaries | nosniff, DENY, restrictive referrer/permissions policy, CSP | Live headers |

## Important limits

Rate counters are bounded in-memory (4,000 buckets) and fail closed at capacity, but are not distributed. HMAC client identifiers and counters expire in process memory; they are not written to the app's logs. Vercel's overwritten x-forwarded-for is trusted only when VERCEL=1. Outside Vercel all callers share a conservative local bucket. A shared IP can affect other visitors; multiple IPs/instances and restarts defeat a global cap. No shared quota store or edge WAF rule is claimed.

Pattern detection misses disguised, multilingual or novel attacks and can reject legitimate security discussion. The fixed corpus is low-risk demo data, not a secure ingestion pipeline. Approval is still required even when prompt detection passes. Encrypted cookies isolate demo state but can be replayed by their holder: they are not a durable, transactional authorization ledger. Browser review records are editable by their owner and not trusted audit evidence.

CSP still allows inline scripts for framework hydration. No claim of complete XSS immunity, penetration-test certification, distributed abuse prevention or production readiness is made. The security workspace deliberately exposes a bounded fixture sanitizer/probe, not arbitrary code execution.

## Sources used

- [OWASP Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html): layered controls, untrusted-data separation and scoped actions.
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html): sanitization and safe rendering contexts; CSP alone is insufficient.
- [sanitize-html documentation](https://github.com/apostrophecms/apostrophe/blob/main/packages/sanitize-html/README.md): explicit tag/attribute allowlists and discarded nontext content.
- [Vercel request headers](https://vercel.com/docs/headers/request-headers): hosting-provided client address boundary.
