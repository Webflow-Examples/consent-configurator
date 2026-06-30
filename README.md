# Webflow consent configurator

Generate and verify a correct, best-practice consent integration between a consent management platform (CMP) and Webflow's first-party tracking, which powers both Optimize and Analyze. One `wf.allowUserTracking()` bridge covers both products, so a site needs only this single setup – there is no separate consent integration for each.

The tool runs entirely in the browser as one self-contained HTML file. It has three modes: a guided walkthrough, an express mode for known setups, and a verify mode that checks a live page with a bookmarklet. It encodes the per-CMP failure modes for the common platforms (OneTrust, Cookiebot, Usercentrics, TrustArc, Osano, Ketch, Didomi, CookieYes) and the native paths (Finsweet Consent Pro, DataGrail).

## Live tool

https://grapes.wfsa.io/consent-configurator/

## Build

Requires Node 18 or newer.

```
npm install
npm run build
```

This produces `dist/index.html`, a single file with no runtime dependencies. Open it directly in a browser or host it on any static host.

## Project layout

- `src/App.jsx` – the entire application: UI, the per-CMP knowledge model, the snippet builders, and the verify bookmarklet
- `src/entry.jsx` – mounts the app into the page
- `src/lucide-shim.jsx` – inline SVG icons, so there is no runtime icon dependency
- `src/shell.html` – the HTML shell the build wraps the bundle into
- `build.mjs` – bundles with esbuild and wraps the output into `dist/index.html`

## Generated code and licensing

Every snippet the tool outputs carries an MIT license header, so the code a site pastes in is covered on its own. This repository is MIT licensed; see `LICENSE`. The copyright holder is Webflow, Inc.

## Accuracy

The per-CMP patterns reflect vendor behavior verified as of June 2026. Event names and category IDs vary by platform version and configuration, so confirm against current vendor documentation before relying on a generated snippet in production. This tool generates best-practice integration code, not legal advice; the privacy and legal teams own the consent posture and category mapping for each jurisdiction.

## Maintenance

The per-CMP knowledge (reference docs, category mappings, known failure modes, and the code generated per platform) needs periodic re-verification against current vendor APIs. See [`MAINTENANCE.md`](MAINTENANCE.md) for the model and the manual steps, or run the `refresh-cmp-docs` Claude Code skill (`.claude/skills/refresh-cmp-docs/`) to walk through a refresh end to end, including a live Verify-mode check per platform.
