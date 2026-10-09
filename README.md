# Industrial a Catalunya · v0 local
A working Catalan decision prototype. Six verified admission options, year-specific weights, fixed-base mathematics/physics sliders, 2-3 option comparator, static degree pages and methodology. No guarantees of admission.

## Run
Node 22+ and npm. No account or API key.
```
npm ci
npm run build
npm start
```
Open http://127.0.0.1:4173. `npm run dev` rebuilds then serves (no hot reload).
The `dist` directory is also a prebuilt static site. Serve its root, not file://. All routes have index.html. No deployment has been made.

## Check
```
npm run typecheck
npm test
npm run build
npm run lint
npm run test:e2e
```
E2E requires installed Chrome at /usr/bin/google-chrome (or CHROME_PATH). It starts/stops its own local server, validates interaction and saves screenshots. A platform-independent alternative: install Playwright Chromium then set CHROME_PATH to that executable. The lint command is explicit static safety checks, not a full style linter.

## Structure
- src/engine.ts: pure rounding/access/admission logic. Best two distinct approved weighted subjects, null blocks calculation.
- data/: programmes, cutoffs, weightings, source manifest with per-value provenance.
- scripts/build.mjs: all HTML prerendered plus browser bundle.
- sources/: original PDFs and readable source evidence. No private data.
- scripts/import-data.py: review-only importer (Python3 + PyMuPDF); candidate file does not overwrite verified data.
- docs/: audit, choices, prelaunch checklist.
- screenshots/: 390/1280-width visual checks.

2027 mode = weights 2027 + historical cutoff 2026. 2026 mode = coherent 2026/2026 comparison. All six math/physics coefficients happen to match across years, independently verified. Other programmes may differ. Access/admission rounding follows official three-decimal half-up rule.

First visit has blank grades; explicit example uses synthetic 8/7/7. Only session memory; no notes in URL/storage/server. Selection deeplink includes only a public program ID. Fixed-base sliders intentionally do not change the access-phase average.

## Limits
No ads, analytics, cookies, accounts, payments or AI. Legal/contact placeholders are not production-ready. No domain/repo/deploy. `SITE_URL` is unset, so pages are noindex and no canonical domain is invented. Only set it after a real production domain is chosen. No comprehensive Catalunya catalogue and no historical-exam validity logic.

Official sources and exact document provenance are in docs/data-audit.md and data/*.json. Review source discrepancy: 2027 PDF footer says 2028 on a page despite 2027 header and official index. Do not silently erase this in future maintenance.
