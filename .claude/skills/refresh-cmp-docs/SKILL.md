---
name: refresh-cmp-docs
description: Re-verify and update the per-CMP knowledge that the consent configurator uses to generate code. Use whenever a consent platform (OneTrust, Cookiebot, Usercentrics, TrustArc, Osano, Ketch, Didomi, CookieYes, Finsweet Consent Pro, DataGrail) changes its API, when a generated snippet is reported broken, or on a periodic re-verification pass. Updates the vendor reference docs, the category/purpose mappings, the snippet builders, the VERIFIED_ON stamp, rebuilds, and verifies on a live page.
---

# Refresh CMP docs

Re-verify the consent configurator's per-CMP knowledge against current vendor documentation and update the generated code to match. All the knowledge lives in one file: `src/App.jsx`. There is no separate data store. See `MAINTENANCE.md` at the repo root for the human-readable model overview.

## When to run

- A vendor changed its consent JavaScript API (new event name, changed consent-read call, renamed category/purpose IDs).
- Someone reported a generated snippet no longer works for a specific CMP.
- A periodic re-verification pass (the UI shows users a `VERIFIED_ON` date — keep it honest).

## What you are maintaining

In `src/App.jsx`:

- `VERIFIED_ON` (~line 26) — the date stamp shown to users. Bump when the pass completes.
- `CMP_DOCS` (~line 41) — `{ url, label }` per CMP: the vendor reference docs to re-read.
- `CMPS` (~line 52) — the core model. Per entry: `name`, `detect`, `cat` (the marketing/analytics/functional → vendor-ID mapping that drives generated code), `catNote`, `knownIssue`, `gotcha`. Native integrations (Finsweet Consent Pro `consentpro`, DataGrail `datagrail`) instead use `native: true`, `nativeNote`, `docUrl`, `docLabel`, `nativeChecks`.
- Snippet builders — `buildSnippet` (~line 348), `buildNonHostedSnippet` (~line 387), `buildGenericSnippet` (~line 1031). These turn a `CMPS` entry into code. Touch these only if a vendor changed the *shape* of its API, not just an ID.
- `CMP_ORDER` (~line 184) — display order.

Confirm these line numbers by grepping (`grep -n "const CMPS" src/App.jsx`) before editing — the file changes over time.

The CMPs to cover: OneTrust, Cookiebot, Usercentrics, TrustArc, Osano, Ketch, Didomi, CookieYes (snippet-generating), plus Finsweet Consent Pro and DataGrail (native, no generated bridge).

## Process

Work one CMP at a time. For each:

1. **Read the vendor's current docs.** Fetch the URL from `CMP_DOCS` (or the native `docUrl`). If it 404s or the vendor moved it, find the current API reference and update the URL/label.
2. **Diff against the encoded model.** Compare what the vendor now documents against:
   - `detect` — is the global/cookie signal still right?
   - `cat` — are the category/purpose IDs still current? (Note: many are configured per-tenant; only change defaults that the vendor documents as canonical.)
   - the event name(s) and consent-read call described in `catNote`.
   - `knownIssue` — is the failure mode and fix still accurate?
3. **Update the `CMPS` entry** (and `CMP_DOCS`) where reality has drifted. Keep the existing prose style — concise, specific, no hype.
4. **Update the snippet builder** only if the API *shape* changed (new event, different read call, changed return structure). For ID-only changes, the `cat` map is enough.
5. Note in your working summary what changed and what you verified, per CMP.

After all changed CMPs are done:

6. **Bump `VERIFIED_ON`** to the current month/year.
7. **Rebuild:** `npm run build` → produces `dist/index.html`. Confirm it builds cleanly.
8. **Verify on a live page (per changed CMP).** This step is required, not optional:
   - Open the rebuilt `dist/index.html`, select the changed CMP, and generate its snippet.
   - Install it on a Webflow page running that CMP (or a test page with the CMP loaded).
   - Switch the tool to **Verify mode** and drag the bookmarklet onto the page.
   - Confirm the **Webflow tracking consent API** row toggles correctly: tracking stays denied by default, and `wf.allowUserTracking()` fires when the mapped category is accepted, `wf.denyUserTracking()` on decline.
   - If you cannot reach a live page for a given CMP, say so explicitly in the summary rather than marking it verified.

## Output

Report, per CMP touched: what the vendor changed, what you edited (`CMPS`/`CMP_DOCS`/builder), and the Verify-mode result. Confirm `VERIFIED_ON` was bumped and the build succeeded. Do not commit or push unless asked.

## Guardrails

- This tool generates technical integration code, not legal advice. Do not change the recommended category posture to suit a guess about a vendor's defaults — the privacy/legal team owns the consent posture and category mapping. Maintenance is about keeping the *API patterns* correct.
- Preserve the MIT license banner and the existing entry shapes; don't restructure the model unless a vendor genuinely requires it.
