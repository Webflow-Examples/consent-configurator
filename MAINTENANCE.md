# Maintenance

This tool encodes per-CMP (consent management platform) behavior — event names, category/purpose IDs, known failure modes, and the code it generates for each platform. Vendors change their JavaScript APIs over time, so this knowledge has to be re-verified against current vendor documentation periodically and after any report that a generated snippet no longer works.

There is a Claude Code skill that walks through this whole process: [`.claude/skills/refresh-cmp-docs/SKILL.md`](.claude/skills/refresh-cmp-docs/SKILL.md). Invoke it with `/refresh-cmp-docs`. This document is the human-readable companion — it explains *what* the knowledge model is and *where* it lives, so the refresh can be done by hand if needed.

## Where the per-CMP knowledge lives

All of it is centralized in [`src/App.jsx`](src/App.jsx). There is no separate data file or database.

| What | Location | Role |
|---|---|---|
| `VERIFIED_ON` | [`src/App.jsx:26`](src/App.jsx) | The date stamp ("June 2026") shown to users and written into the exported record. Bump this whenever a refresh completes. |
| `CMP_DOCS` | [`src/App.jsx:41`](src/App.jsx) | Per-CMP vendor reference doc URL + label. These are the sources every refresh re-reads. Keep the URLs live and pointing at the current API reference. |
| `CMPS` | [`src/App.jsx:52`](src/App.jsx) | The core knowledge model. One entry per CMP — see below. |
| Snippet builders | `buildSnippet`, `buildNonHostedSnippet`, `buildGenericSnippet` ([`src/App.jsx:348`](src/App.jsx) onward) | Turn a `CMPS` entry + user choices into the generated code. If a vendor changes the *shape* of its API (not just an ID), the builder is what changes. |
| `CMP_ORDER` | [`src/App.jsx:184`](src/App.jsx) | Display order of the platforms. |
| Verify bookmarklet | `bookmarkletHref` and helpers ([`src/App.jsx:526`](src/App.jsx) onward) | The on-page checker used in Verify mode. Update only if the Webflow tracking API or a CMP's detection signal changes. |

### Anatomy of a `CMPS` entry

Each platform entry carries the facts that drive both the explanatory UI and the generated code:

- `name` — display name.
- `detect` — how the tool (and a human) recognizes the CMP is present on a page (e.g. `window.OneTrust`).
- `cat` — **the category/purpose mapping** (`marketing` / `analytics` / `functional` → the platform's own IDs). This feeds directly into the generated snippet. Most refreshes are changes here.
- `catNote` — the prose explanation of the pattern and which event/API the snippet reads.
- `knownIssue` — the recurring failure mode and the fix the snippet applies.
- `gotcha` — the short "watch for" line surfaced in the UI.
- Native integrations (Finsweet Consent Pro, DataGrail) instead carry `native: true`, `nativeNote`, `docUrl`, `docLabel`, and `nativeChecks` — they need no generated bridge.

## The refresh process

For each CMP in `CMPS` (currently: OneTrust, Cookiebot, Usercentrics, TrustArc, Osano, Ketch, Didomi, CookieYes, plus the native paths Finsweet Consent Pro and DataGrail):

1. **Re-read the vendor's current docs.** Start from the URL in `CMP_DOCS` (and the native `docUrl` for Consent Pro / DataGrail). Fix the URL if the vendor moved it.
2. **Diff against the encoded model.** Check that `detect`, `cat` (category/purpose IDs), the event names in `catNote`, and the `knownIssue` still match what the vendor documents.
3. **Update the entry** in `CMPS` (and `CMP_DOCS`) where reality has drifted.
4. **Update the snippet builder** if the vendor changed the *shape* of its API — a new event name, a different consent-read call, a changed return structure. ID-only changes usually need only the `cat` map.
5. **Bump `VERIFIED_ON`** once everything has been re-checked.
6. **Rebuild:** `npm run build` (produces `dist/index.html`).
7. **Verify on a live page.** Load the rebuilt tool, generate the snippet for the changed CMP, install it on a Webflow page running that CMP, and use the tool's **Verify mode** (drag the bookmarklet onto the page) to confirm the Webflow tracking consent API toggles correctly on accept/decline. Do this per changed CMP before considering the refresh done.

## Build

Requires Node 18+.

```
npm install
npm run build
```

This bundles `src/` into the single self-contained `dist/index.html` with no runtime dependencies.

## Scope note

This tool generates best-practice integration code, not legal advice. The category-to-tracking mapping a given site should use is owned by that site's privacy/legal team. Maintenance here is about keeping the *technical* integration patterns correct against current vendor APIs.
