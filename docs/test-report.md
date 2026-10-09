# Validation · 07/10/2026
- npm run typecheck: passed (strict TypeScript).
- npm test: 20 pure-engine/data validation tests passed.
- npm run build: passed, calculator + six static degree routes + methodology + four legal/contact placeholders.
- npm run lint: static safety checks passed. This is not a full ESLint style check; transparently labelled.
- npm run test:e2e: 27 assertion groups passed, real installed Chrome. Blank first visit, explicit example, numeric/range synchronization, comma input, year mode, 3-option comparator and rejection of fourth, calculated base and invalid phase, reset, preselection, all degree routes at 390px/1280px, legal/methodology routes. Zero external requests and no browser errors.
- Actual screenshots inspected: homepage desktop/full, mobile/full and top; comparator desktop/bottom and mobile/bottom; all degree routes in contact sheet; ETSEIB and URV mobile directly. Readable controls and result labels, no horizontal overflow (also tested). No invented campus photos.
- Original 2027 industrial weighting PDF screenshot inspected, math/physics columns and selected rows confirmed. Other numeric fields extracted deterministically with original headers and code coordinates and importer independently reproduced the values.
- First E2E attempt used check() on intentionally rejected fourth checkbox; expected state reversion caused automation exception. Changed test to click() and assert unchecked+warning, then reran successfully. No product workaround.

Remaining: no broad accessibility audit, actual user testing or production legal review. Public deploy is not part of this delivery.
