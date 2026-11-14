# Privacy and retention

Use fictional data. No account sign-in, shared database, private uploads, analytics tracker or email integration is added.

| Data | Location | Retention / deletion |
|---|---|---|
| Demo board, action log, agent checkpoints, Studio review | Encrypted authenticated HttpOnly cookies; sent to this app | 24-hour expiry; ERASE expires all three cookie names |
| Evaluation runs, rubric reviews, feedback | Tab sessionStorage by default | Browser-session lifetime (session restore may preserve it); seven-day expiry checked on access |
| Optional persistent evaluation/feedback | Browser localStorage after explicit choice | Seven days since last save; removed on next read after expiry; ERASE deletes immediately in current browser |
| Retention preference | localStorage yes/no flag only | Until changed or erased |
| User prompt and required project context | Groq when the relevant AI consent/request is given | External provider policy applies; not deleted by this app's erase control |
| HMAC client ID, quota counters | Server process memory | Window expiry, restart or process termination; no raw IP stored in limiter |
| Operational requests/logs | Hosting/provider systems | External retention policies apply; this app does not claim control or zero retention |
| Exported JSON files | User's download location | User removes them; browser erase does not touch downloads |

Model prompts include only the context needed for the feature: selected fictional excerpts for Knowledge, session board for task planning, scoped handoffs for Studio. The application logs action metadata and generic failure information, not prompt bodies or secret values. This does not control hosting/provider logging.

The privacy switch moves existing records between tab and browser storage. ERASE requires typing ERASE and a same-origin JSON request; then app cookies and app-owned browser evidence are removed. It does not reset rate counters. Other open tabs must reload because they can still hold prior data in memory and could otherwise save it again. Erasure is local; it is not provider-wide deletion or global session revocation.
