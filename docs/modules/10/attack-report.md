# Attack and sanitization evidence

Verified on the live product on 14 November 2026. [Machine-readable live results](live-verification.json) retain all nine groups. [Unit transcript](unit-tests.tap) contains all 61 passing tests.

## Unsafe HTML removed before rendering

Controlled model-shaped input (explicit fixture, not a claim that Groq generated it):

```html
Launch checks are ready.<script>window.__tasklaneAttack=1</script><img src=x onerror="window.__tasklaneAttack=1">
```

The real server sanitizer produced `Launch checks are ready.`. The shared Knowledge renderer produced exactly:

```html
<p><span class="model-text">Launch checks are ready.</span></p>
```

Browser DOM inspection found **zero** script, image, iframe, SVG, MathML, link or style elements inside the protected output. [DOM evidence](browser-sanitization.json) · [Browser screenshot](screenshots/live-sanitization.png).

Additional deterministic cases cover javascript links, embedded frames, SVG events, CSS, encoded HTML, malformed nested markup and script-only responses. Encoded markup is decoded but stays an inert text node; it is never inserted into an HTML sink. A script-only answer becomes invalid after sanitization and is blocked by the output schema. Fixtures traverse the same sanitizer/schema/renderer as real Knowledge output. Real Groq synthesis was tested separately and passed; adversarial model behavior is not exhaustively evaluated.

## Other attacks defended

- Common instruction overrides, secret-exfiltration requests and approval-bypass wording returned 422 before a model call.
- A foreign source ID returned 403; restricting selection to Research did not pull in release documents.
- Cross-origin writes returned 403; malformed JSON and unexpected parameters returned 400; oversized request returned 413.
- Tampered session cookie returned 401; an invented executeCode tool was rejected without changing board revision.
- Actual Knowledge requests reached the per-route limit and returned 429 with Retry-After 47 seconds in the observed run (19 additional requests accepted after preceding checks).
- The harmless probe accepted five requests, rejected the sixth, and remained blocked after erasing all workspace cookies and opening a fresh session. Browser countdown and disabled retry button were observed.
- A synthetic feedback record was saved, its browser-retention preference survived navigation, ERASE removed it, and Evaluation then showed Feedback (0).

## Limits

These are bounded defense demonstrations, not penetration-test certification. Pattern detection is fallible. Rate limits are process-local, not distributed or a global spending guarantee. Browser data and anonymous cookie state are not an authenticated audit system. See security-checklist.md and privacy.md before wider use.
