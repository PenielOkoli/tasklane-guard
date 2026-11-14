# Tasklane Guard — Module 10

Security, privacy, abuse prevention and guardrails for the continuing Tasklane product.

- Repository: https://github.com/PenielOkoli/tasklane-guard
- Live deployment: https://tasklane-guard.vercel.app (see verification evidence for status)
- [Security checklist](docs/modules/10/security-checklist.md)
- [Privacy and retention](docs/modules/10/privacy.md)
- [Implementation plan](docs/modules/10/plan.md)
- [Attack tests](tests/security.test.tsx)

## Reviewer walkthrough

Open Trust & privacy. Run each controlled malicious-response fixture and inspect the sanitized output. These fixtures pass through the same server sanitizer and Knowledge output schema as real answers; the result uses the same React text renderer. The fixture label is deliberate: no model is asked to generate an attack.

Test the five-per-minute harmless request allowance and inspect the sixth request's 429 and retry time. Actual Knowledge, Board, Agent and Studio endpoints are also guarded. Open Source trust to inspect the retrieval boundaries. Privacy defaults to tab-session storage; optional browser persistence expires after seven days without a save. ERASE clears app cookies and local/session evidence, not downloads or provider/platform logs.

## Run and verify

Node 22; `npm ci`; configure server-only SESSION_SECRET (at least 32 random characters) and GROQ_API_KEY. Never put real values in tracked files. `npm run dev` starts the app; `npm run typecheck`, `npm test`, `npm run build` validate it.

`node --import tsx scripts/verify-security.ts https://tasklane-guard.vercel.app --ai` runs bounded live attack and defense checks, including real AI synthesis and actual rate exhaustion. Allow one minute between complete runs. `node --import tsx scripts/audit-client.ts` scans built browser artifacts for secret markers. Evidence is in docs/modules/10.

## Security boundaries

- Provider text is parsed by sanitize-html 2.18.2 with zero allowed tags/attributes; dangerous nontext elements and their contents are removed. Entity decoding happens before the final React text sink. No raw HTML sink is used anywhere in the app.
- Strict request/tool/output schemas, source and citation allowlists, same-origin JSON writes, 12 KB body cap, encrypted HttpOnly/Secure/SameSite cookies, explicit action approval, bounded model calls and generic provider errors.
- Shared guard code limits all API reads/writes and AI-enabled requests; Retry-After and visible abuse messages. Counters are process-local. This demo is **not** protected by a shared distributed quota or global budget cap; instance restarts, multiple instances and different addresses can bypass a global allowance. Use a shared store/edge controls before a public production rollout.
- Pattern-based injection checks are fallible. They complement trusted source selection, scoped tools, server validation and human approval; they do not guarantee resistance to all adversarial prompts.
- CSP restricts frames, objects, connections and form destinations but retains inline scripts for Next.js hydration. It is defense in depth, not the main XSS control. HTML sanitization and text-only rendering are the main output boundaries.

## Continuity

Source: Tasklane Eval `70dc89ef8e1394132ce7dd7a36b801994a264ce4`. Evaluation remains at `/evaluation`, Knowledge at `/knowledge`, Studio at `/studio`, Agent at `/agent`, Board at `/board`. The user selected Tasklane for number 5, establishing the documented exception to the original Module 1 product continuity. This milestone uses a separate GitHub repository, connected Vercel project and sensitive Production variables; prior submissions are unchanged.
