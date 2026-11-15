# Module 10 assessment mapping

| Supplied requirement | Implementation |
|---|---|
| Keep keys and sensitive logic server-side | Sensitive Production GROQ_API_KEY/SESSION_SECRET; server model modules; built client-secret scan |
| Validate inputs, tools and structured outputs | Bounded same-origin JSON reader, strict request/tool schemas, scoped IDs and revisions, model schema revalidation after sanitization |
| Sanitize model HTML and render safely | content-safety.ts removes tags/attributes and dangerous nontext content; Knowledge uses ModelText; all output uses React text nodes |
| Strong sanitization evidence | Hostile model-shaped fixture follows production sanitizer and Knowledge schema; unit SSR test, live endpoint response and browser DOM proof show script/img removal |
| Rate limits, quotas and abuse UI | All routes guarded; per-route and shared-client/process buckets; minute/day AI-request budgets; Retry-After; visible countdown on security probe and Knowledge |
| Prompt-injection awareness and source trust | Visible rules, fixed-source allowlist, suspicious-input/source/task/handoff checks before provider calls; no arbitrary URL fetch |
| Privacy/retention expectations | Tab storage by default; optional seven-day browser persistence; encrypted 24h workspace cookies; erase UI and external-retention limitations |
| GitHub and Vercel | Separate tasklane-guard repository and connected Production project |

Continues the user-approved Tasklane lineage from Module 9. The original Module 1 continuity exception remains documented; no prior submissions were modified.
