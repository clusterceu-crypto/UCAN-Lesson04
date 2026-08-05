# UCAN Lesson 04 — Codex Remediation Report v1.0

- Repository: `clusterceu-crypto/UCAN-Lesson04`
- Branch: `develop`
- Starting SHA: `ab857d15bd724569771888916070e3fcff031dae`
- Candidate overlay: already present before this pass; it was not repeated.

During final verification, `develop` was observed at `2999fafe7b22332fa0506e5c176db20b0ce249ac`, which contains the candidate overlay. This advance was external to this remediation pass; Codex performed no Git write operation.

## Files changed in this remediation pass

- `index.html`
- `js/lesson04.js`
- `tests/static/lesson04-static-checks.ps1`
- This report

The existing candidate files `css/style.css`, modular CSS, shared runtime, candidate manifest, supporting documents, and assets were not changed by this pass. `js/script.js` remains absent and is not linked.

## Remediation completed

- P08 has exactly two approved actions: `L04-AI-P01` and `L04-AI-P02`, with the approved learner-facing labels. Each action passes its own registry ID to the shared preview/copy/open workflow.
- P09 has one approved action only: `L04-AI-P03`, with the approved learner-facing label. The generic selector, `help`, `review`, and their builder branches are removed.
- `buildAiPrompt()` now reads only from `window.UCAN_L04_APPROVED_PROMPTS` and safely substitutes supplied Portfolio values into the canonical template. No payload is duplicated outside `js/lesson04-config.js`.
- The existing completion gate is combined: P11 requires both `assessmentPassed` and `isPortfolioComplete()`. Completeness checks all 13 Portfolio fields after `trim()`. Portfolio saves and clears refresh the navigation state, so clearing a field after a passed assessment immediately re-locks P11 and refilling it re-enables the gate while the passed assessment remains stored.

## Static verification

Commands run:

```powershell
powershell -ExecutionPolicy Bypass -File tests/static/lesson04-static-checks.ps1
git diff --check
```

Result: `STATIC_CHECKS_PASS`; `git diff --check` produced no whitespace errors.

The static suite confirms 11 pages, page roles, 13 Portfolio fields, answer key `B,C,B,C,A,C`, namespace `ucan_l04_v1`, no duplicate IDs, static DOM-reference coverage, P08 P01/P02-only wiring, P09 P03-only wiring, absence of generic modes and obsolete selector, combined gate/trim behavior, exact SHA-256 checks for the three canonical payload strings, absent/unlinked legacy `js/script.js`, and unchanged `assets/` status.

## Source-level regression findings

- AI actions invoke only their supplied approved registry ID; no generic fallback or builder branch remains.
- P09 retains the six-field context preview and copy-context action.
- Empty prompts are rejected before copy; shared preview/copy/open controls remain connected to approved prompts.
- The completion gate handles incomplete/failed, complete/failed, incomplete/passed, and complete/passed states through `assessmentPassed && isPortfolioComplete()`; whitespace-only values are incomplete.
- Reload uses persisted assessment and Portfolio data, and a restored P11 is guarded by the same combined check. Reset progress continues to preserve Portfolio data; delete Portfolio continues to remove only Portfolio data.

## Browser-dependent checks still required

Interactive browser smoke verification remains required for navigation/progress, reload persistence, P08 and P09 preview/copy/open flows, clipboard/external-link behavior, focus return from the dialog, PDF generation, reset/delete behavior, responsive/mobile layout, print rules, and console errors.

## Git operations

No commit, push, merge, rebase, reset, tag, release, branch switch, or deployment was performed.

Status: 🟢 Approved Technical Candidate — Remediation Applied  
Browser status: 🟡 Browser Verification Required

## Course UX Harmonization Decision

Lessons 02–03 were used only as learner-facing UX references for the header/progress pattern, simple lesson contents control, button hierarchy, practical workspace placement, completion links, and responsive component treatment. No lesson-specific content was copied.

- The learner-facing structure is now 10 pages: the former separate AI handover page is removed.
- P08 remains the practical-work owner and now contains the three approved actions `L04-AI-P01`, `L04-AI-P02`, and `L04-AI-P03`, alongside the 13-field Portfolio, shared prompt preview/copy/external-open controls, and six-field context generation.
- Navigation is unified around a single “Зміст заняття” control, a current-page indication, `Сторінка X з 10`, percentage progress, and `← Назад` / `Далі →` controls. Learner-facing visited/completed indicators are removed.
- The canonical prompt registry, lesson content, Portfolio contract, storage namespace, answer key, assets, and combined completion gate are preserved.
- The completion page uses `← До Заняття 03` and `Перейти до Заняття 05 →`; reaching it remains conditional on the combined gate.

Browser checks remain required for the changed contents control, responsive behavior, prompt workflow, focus behavior, and completion links.

## Targeted Browser Defect Hotfix — 03.08.2026

- Baseline HEAD: `0c56fb9e9c2a1917b45d2512be0751af3bf5e0da` on `develop`.
- Files changed: `index.html`, `js/lesson04.js`, `js/ucan-compat-runtime.js`, and `tests/static/lesson04-static-checks.ps1`.
- HOTFIX-L04-001: restored startup navigation now uses the existing controlled heading-focus path with `preventScroll: true`; scrolling respects reduced-motion preference.
- HOTFIX-L04-002: Escape closes an open “Зміст заняття” control and returns focus to its trigger.
- HOTFIX-L04-003: progress uses route position: `Math.round(((currentPage + 1) / pages.length) * 100)`.
- HOTFIX-L04-004: one centralized recovery-message function enforces assessment-first, then Portfolio-incomplete priority and suppresses a competing session notice during recovery.
- HOTFIX-L04-005: `prior_context` remains in the 13-field collection and is now visibly and semantically required; its prior optional marker is removed.

Static verification passed: the updated static suite, `node --check js/lesson04.js`, `node --check js/ucan-compat-runtime.js`, and `git diff --check`. The suite also reconfirmed 10 pages, P01–P03 only in P08, exact payload hashes, answer key, namespace, combined gate, reset/delete separation, links, and unchanged assets.

Targeted Chromium scenarios could not run: the in-app browser runtime failed before tab creation with `failed to write kernel assets: The system cannot find the path specified. (os error 3)`. This is the sole remaining verification blocker; it is not a source-code defect finding. No Git operation was performed.

## Completion Recovery Message Conflict Hotfix

- Baseline HEAD: `bd59540c933528c72d92305e9f1b2e0f704fb74e` on `develop`.
- Root cause: restored `renderAssessment()` wrote “Усі шість відповідей правильні. Сторінка завершення відкрита.” from `assessmentPassed` alone, even when the combined gate remained locked because the Portfolio was incomplete.
- Code change: the restored assessment status now writes the completion-open success text only when `assessmentPassed && isPortfolioComplete()`; otherwise it is empty. The existing centralized completion recovery message remains the sole learner-facing lock message with assessment-first, then Portfolio-incomplete priority.
- Files changed: `js/lesson04.js`, `tests/static/lesson04-static-checks.ps1`, and this report.
- Static verification: `node --check js/lesson04.js`, the complete static suite, and `git diff --check` passed. The suite adds an explicit regression assertion that restored assessment success cannot claim completion while the Portfolio is incomplete.
- Assets unchanged; prompt payload hashes, namespace, answer key, 13-field contract, and combined gate remain unchanged.
- Scenario D browser verification could not start because the in-app browser runtime again failed before tab creation with `failed to write kernel assets: The system cannot find the path specified. (os error 3)`.
- Git operations: none performed.

## L04-FPQA-001 — Route 1 Lesson Map Hotfix (2026-08-04)

- Defect ID: `L04-FPQA-001`.
- Root cause: the Route 1 learner-facing `Карта заняття` table retained the legacy 11-step presentation after runtime navigation had already been consolidated to 10 routes. The stale table included a standalone AI row and shifted assessment/completion numbering to 10/11.
- Exact source change: `index.html` now presents the approved 10-entry Lesson Map in the required order; standalone AI was removed and entry 8 is exactly `Практичне завдання + AI`.
- Files changed: `index.html`, `tests/static/lesson04-static-checks.ps1`, and this remediation report.
- Static verification: `git diff --check` passed. The existing suite returned `STATIC_CHECKS_PASS`, including targeted assertions for exactly 10 Lesson Map entries, approved order, no standalone AI row, exact entry 8 text, 10 runtime pages, unchanged P01–P03 payload hashes, 13 Portfolio fields, namespace, assessment key, combined gate, reset/delete contracts, course links, and unchanged assets. JavaScript syntax checks were not required because all JavaScript files are unchanged; the suite verifies that invariant when shell Node is unavailable.
- Targeted browser verification: PASS at `http://127.0.0.1:4174/`. Route 1 displayed exactly 10 visible Lesson Map rows; no standalone AI step was present; entry 8 displayed `Практичне завдання + AI`; `Сторінка 1 з 10`, 10 runtime `.lesson-page` elements, and 10 contents-navigation route buttons were confirmed; console errors/warnings: none.
- Runtime route count remains 10.
- Source files outside the authorized scope are unchanged. `UCAN_Lesson_04_Final_Production_QA_Report_v1.0.md` was not modified.
- Git operations: none.

Status: 🟢 Lesson 04 Route 1 Lesson Map Hotfix Completed
Defect: 🟢 L04-FPQA-001 Closed
Next controls: 🟡 Controlled Save Required · 🟡 Final Production Preview Repeat Required

## Controlled Targeted Hotfix — L04-FPQA-001 and L04-FPQA-002 (2026-08-04)

- Defect IDs: `L04-FPQA-001`, `L04-FPQA-002`.
- L04-FPQA-001 root cause and source change: the Route 1 learner-facing `Карта заняття` retained a legacy 11-entry presentation, including a standalone AI row. `index.html` now retains only the approved ordered 10 entries; entry 8 is exactly `Практичне завдання + AI`.
- L04-FPQA-002 root cause: the Route 8 learner experience exposed approved prompt payloads through a preview panel and modal before copying, rather than the approved direct copy workflow.
- L04-FPQA-002 exact source change: Route 8 now displays the approved short purpose for each of P01, P02, and P03 with one `Копіювати промпт` action per payload. Each action builds its payload only from `window.UCAN_L04_APPROVED_PROMPTS`, copies it directly to the clipboard, and displays exactly: `Промпт скопійовано. Відкрийте ChatGPT або Gemini та вставте його в чат.` The learner-facing preview panel, preview modal, standalone copy action, and preview-before-copy behavior were removed. ChatGPT/Gemini links remain disabled until a successful copy and do not transmit prompt data.
- Files changed: `index.html`, `js/lesson04.js`, `tests/static/lesson04-static-checks.ps1`, and this remediation report. `js/lesson04-config.js` was read only and is unchanged. The Final Production QA report was not modified.
- Static verification: `git diff --check` passed. The existing static suite returned `STATIC_CHECKS_PASS`, including 10 runtime pages; the complete ordered Route 1 map; no standalone AI map row; exact entry 8; three P01–P03 copy actions; no learner-facing prompt preview workflow; exact P01–P03 payload hashes; unchanged config; 13 Portfolio fields; namespace; assessment key; and combined completion gate. Shell `node --check` is unavailable in this environment; the three JavaScript files were parsed by the available Node runtime with no `SyntaxError`.
- Targeted browser verification: blocked before any page content loaded. The in-app browser rejected both local test endpoints (`http://127.0.0.1:4175/` and `http://127.0.0.1:4174/`) with `net::ERR_BLOCKED_BY_CLIENT`. Therefore Route 1 visible-state confirmation, P01–P03 clipboard confirmation, Route 8 persistence, assessment/gate smoke checks, and console-error confirmation could not be executed in this run.
- Runtime route count: static verification confirms 10 learner-facing runtime pages; browser runtime confirmation is blocked as above.
- Source files outside the authorized scope are unchanged. Git operations: none.

Status: 🟡 Lesson 04 Targeted Production Hotfix Implemented
Defects: 🟢 L04-FPQA-001 Closed · 🟢 L04-FPQA-002 Implemented (targeted browser verification pending)
Verification: 🟡 Targeted Browser Verification Blocked — `net::ERR_BLOCKED_BY_CLIENT` on local test endpoints
Control: 🟡 Controlled Save Not Yet Authorized

## Controlled UX Alignment Sprint — Progress, Course Navigation, AI Copy Buttons (2026-08-04)

- Baseline: `develop` at `373a99fb713976a1b018e576d9509b794f1c2086` (`фінал 1.1`); working tree was clean and remote was `https://github.com/clusterceu-crypto/UCAN-Lesson04.git`.
- Files changed: `index.html`, `css/lesson04.css`, `js/lesson04.js`, `tests/static/lesson04-static-checks.ps1`, and this report. `css/ucan-components.css` was not changed. Read-only `js/lesson04-config.js`, approved assets, the Final Production QA report, and the executable contract remain unchanged.
- Section-aware progress implementation: one 10-label progress strip now follows `currentPage`; each active label is marked `aria-current="step"`, styled active, and scrolled into view within its own controlled horizontal container. The existing `Сторінка X з 10`, percentage, bar width, and `aria-valuenow` remain derived from the same position-based state. Routes 1–9 remain available and Route 10 is disabled in the strip until `assessmentPassed && isPortfolioComplete()`.
- Course navigation implementation: Route 10 now has a separate lower `course-navigation` block, distinct from internal Back/Next and `Повернутися на початок`. Exact labels are `← Попереднє заняття: Заняття 03` and `Наступне заняття: Заняття 05 →`; the flex layout places previous left and next right on desktop and stacks safely on mobile.
- URL sources: Lesson 03 uses the existing `CONFIG.previousLessonUrl` value `https://clusterceu-crypto.github.io/UCAN-Lesson03`. Lesson 05 uses the existing `CONFIG.nextLessonUrl` value `https://clusterceu-crypto.github.io/UCAN-Lesson05`; no URL was inferred or invented.
- AI copy-button alignment: P01–P03 retain direct copy only, use purpose/action separation, one shared compact `ai-copy-button` pattern, a copy icon, exact `Копіювати промпт` label, consistent sizing/radius/padding/focus/active treatment, and a mobile-safe stacked layout. Payload generation remains exclusively `window.UCAN_L04_APPROVED_PROMPTS`; no preview, modal, payload text, or pre-copy flow was reintroduced.
- Static verification: `git diff --check` and the existing static suite passed. The suite confirms exactly 10 ordered progress labels, current-route-driven active state and Route 10 lock, exact course-navigation labels and canonical URLs, three icon-bearing copy buttons, unchanged registry hashes, no preview workflow, 13 Portfolio fields, assessment key, combined completion gate, 10 runtime routes, and position-based progress. Shell `node --check` is unavailable; changed JavaScript parsed with the available Node runtime without syntax errors.
- Targeted browser verification: blocked before the app could load. Local HTTP origin `http://127.0.0.1:4174/` was rejected by the in-app browser with `net::ERR_BLOCKED_BY_CLIENT`. Consequently desktop (1440×900), tablet (768×1024), mobile (390×844), Route 10 link target/alignment, P01–P03 clipboard/action, console, and regression smoke scenarios could not be observed.
- Regression smoke: static regression locks pass; browser smoke is blocked by the same local-origin error. No full Final Production Preview was run.
- Validated Candidate Pattern for Lessons 05–26 (not an Approved Standard): (1) Section-Aware Progress Pattern — one route-derived progress state with active/locked labels inside a contained responsive strip; (2) Course Navigation Pattern — separate explicit previous/next lesson controls using confirmed canonical URLs; (3) AI Prompt Copy Pattern — purpose-separated, equal direct-copy controls sourced only from the approved registry.
- Git operations: none. Repository synchronization: not performed.

Status: 🟡 Lesson 04 UX Alignment Implemented
Verification: 🟡 Browser Verification Blocked — `net::ERR_BLOCKED_BY_CLIENT` on local HTTP origin
Control: 🟡 Controlled Save Not Yet Authorized
Synchronization: 🔴 Do Not Synchronize Repository

## L04-UX-COURSE-NAV-001 — Targeted Course Navigation Correction (2026-08-04)

- Defect ID: `L04-UX-COURSE-NAV-001`.
- Root cause: both Route 10 course-navigation anchors were shipped with `hidden` and `href="#"`. Their visibility depended on JavaScript initialization, and the same JavaScript contained branches that could hide them again.
- Exact source change: `index.html` now renders both anchors visible by default with their confirmed canonical URLs. `js/lesson04.js` no longer modifies the visibility or href of either course-navigation link; it retains only the existing `Повернутися на початок` action.
- Exact URLs and evidence source: `https://clusterceu-crypto.github.io/UCAN-Lesson03` and `https://clusterceu-crypto.github.io/UCAN-Lesson05`, both from the existing approved `CONFIG.previousLessonUrl` / `CONFIG.nextLessonUrl` values in `js/lesson04.js`. No URL was guessed.
- Files changed for this correction: `index.html`, `js/lesson04.js`, `tests/static/lesson04-static-checks.ps1`, and this report.
- Static verification: `git diff --check` passed; `STATIC_CHECKS_PASS` confirms visible non-placeholder previous/next anchors, exact labels, exact canonical URLs, no `previousLink`/`nextLink` JavaScript visibility toggle, 10 runtime routes, unchanged approved prompt registry, and preserved regression locks. Shell `node --check` is unavailable; changed JavaScript parsed without syntax errors in the available Node runtime.
- Targeted browser verification: blocked before app content loaded. The in-app browser rejected local origin `http://127.0.0.1:4174/` with `net::ERR_BLOCKED_BY_CLIENT`, so Route 10 desktop/mobile visual verification and console inspection could not run.
- Git operations: none. Repository synchronization: none.

Status: 🟢 Lesson 04 Course Navigation Corrected
Defect: 🟢 L04-UX-COURSE-NAV-001 Closed
Visibility: 🟢 Previous Lesson Button Visible · 🟢 Next Lesson 05 Button Visible
Browser: 🟡 Verification blocked by `net::ERR_BLOCKED_BY_CLIENT`
Control: 🟡 Controlled Save Required
Synchronization: 🔴 Репозиторій не синхронізувати

## L04-QA-PREVIEW-006 — Explicit QA Preview Control (2026-08-05)

- Defect: `Shift + Alt + N` conflicts with OS/browser split-screen handling and cannot be a reliable QA control.
- Correction: removed all QA keyboard detection and added exactly one header control, visible only when the URL parameter is `?qa=1`: `QA: Фінальна сторінка` (accessible name: `Відкрити фінальну сторінку в режимі QA`).
- First click opens Route 10 in the existing in-memory QA preview and changes the label to `QA: Повернутися`; second click returns to the saved legitimate route and restores the label. Query parameter alone does not open Route 10.
- State protection: QA mode remains in-memory and does not write localStorage or mutate assessment, Portfolio, completion state, learner progress, or the combined gate. The existing banner and QA control are excluded from print/PDF.
- Standard amendment: **Canonical UCAN Creator QA Preview Pattern — Lessons 04–26** — QA is enabled only through `?qa=1`; expose explicit control; never use global shortcut; final route opens temporarily and toggles back; do not mutate learner/persistent state; exclude QA UI from print; QA UI absent on normal URLs; reuse unchanged across Lessons 04–26. Status: **Approved Production QA Control for Lessons 04–26**.
- Files changed: `index.html`, `css/lesson04.css`, `js/lesson04.js`, `tests/static/lesson04-static-checks.ps1`, and this report.
- Static verification: `git diff --check` and `STATIC_CHECKS_PASS` passed. Browser verification remains blocked by the local browser webview environment.
- Git operations: none. Synchronization: none.

## Final-Page Reset Duplication Removal (2026-08-05)

- Removed the Route 10 `.completion-actions` block, including `Продовжити навчання` and `Повернутися на початок` / `#return-start`.
- The persistent header `Почати спочатку` remains the single course-reset control; its existing reset contract, including Portfolio preservation, is unchanged.
- Canonical Cross-Lesson Navigation additions: (11) final page MUST NOT duplicate the persistent header reset control; (12) `Повернутися на початок` is removed from final-page content; (13) course reset remains available only through header `Почати спочатку`.

## L04-UX-FINAL-NAV-008 and L04-UX-HEADER-CONTEXT-009 (2026-08-05)

- Route 10 now uses the existing right sticky control as the sole Lesson 05 control: its visible label becomes `Наступне заняття →`, it is active, has accessible name `Наступне заняття: Заняття 05`, and navigates same-tab to the configured Lesson 05 URL. The content CTA was removed.
- Routes 1–9 retain sticky `Далі →`. Header page counter was replaced with the current section label derived from the existing approved progress-label source; sticky count remains unchanged.
- Static verification: `git diff --check` and `STATIC_CHECKS_PASS` passed. Browser verification remains blocked by the local webview environment. Learner gate, QA preview, assessment viewport fix, Portfolio, and prompt contracts are unchanged.
- Canonical UCAN Final Navigation Pattern and Header Context Pattern are recorded as Approved Production UX Rules for Lessons 04–26: final sticky next replaces internal next; no duplicate content CTA; header shows lesson number + approved section label, while count remains in progress/sticky navigation.

## Controlled Creator QA Preview Shortcut (2026-08-05)

- Added in-memory `Shift + Alt + N` QA Preview Mode. It is permitted only on `localhost`, `127.0.0.1`, or with `?qa=1`.
- The shortcut opens Route 10 for inspection without writing learner progress, answers, Portfolio data, completion flags, or `assessmentPassed`; the real gate remains `assessmentPassed && isPortfolioComplete()`.
- A Route 10-only accessible banner states: `QA Preview Mode — фінальна сторінка відкрита без перевірки завершення.` It is excluded from print/PDF output.
- Repeating the shortcut returns to the last real learner route; reset also exits preview mode.
- Files changed: `index.html`, `css/lesson04.css`, `js/lesson04.js`, `tests/static/lesson04-static-checks.ps1`, and this report.
- Static verification: `git diff --check` and `STATIC_CHECKS_PASS` passed, including QA access/persistence checks and existing regression locks. Node CLI is unavailable; changed JS requires runtime browser verification.
- Git operations: none. Repository synchronization: none.

## L04-UX-ASSESSMENT-004 — Targeted Assessment Interaction Hotfix (2026-08-04)

- Defect ID: `L04-UX-ASSESSMENT-004`.
- Root cause: an assessment radio change called `saveAssessmentDraft()`, which called `updateNavigation()`. The section-aware progress update then called `scrollIntoView()` on the active top progress control, scrolling the learner from the selected Route 9 answer to the top of the page.
- Exact code change: `updateNavigation()` and `updateProgressNavigation()` now accept `keepViewport`. Assessment draft saves and assessment submit call `updateNavigation({ keepViewport: true })`; this updates only stored answer/gate state without `scrollIntoView()`. The unnecessary assessment-status focus call was removed. No route render, `showPage`, question rebuild, scoring, or completion transition is triggered by selection or submit.
- Files changed: `js/lesson04.js`, `tests/static/lesson04-static-checks.ps1`, and this report.
- Before/after: before, a selected option persisted and then the progress control scrolled the viewport to Route 9 top; after, the selected radio retains focus and state while the viewport remains at the current question.
- Static verification: `git diff --check` and `STATIC_CHECKS_PASS` passed. Added assertions verify that assessment option changes and submit paths do not call route render, `scrollTo`, `scrollIntoView`, or focus, and preserve the current route/viewport. Existing checks confirm the six-question answer key, pass threshold, 10 routes, combined completion gate, and approved prompt registry remain unchanged. Shell `node --check` is unavailable; changed JavaScript parsed without syntax errors in the available Node runtime.
- Browser verification: blocked by the current in-app browser environment before local page interaction; prior local run failed with `Timed out waiting for the Browser webview to attach for this browser-use page`. First/middle/last question and submit scenarios therefore require a later local browser QA run.
- Git operations: none. Repository synchronization: none.

Status: 🟡 Lesson 04 Assessment Interaction Hotfix Implemented
Verification: 🟡 Browser Verification Blocked
Control: 🟡 Controlled Save Not Yet Authorized
Synchronization: 🔴 Репозиторій не синхронізувати

## L04-UX-NAV-PATTERN-003 — Canonical Cross-Lesson Navigation Pattern (2026-08-04)

- Defect ID: `L04-UX-NAV-PATTERN-003`.
- Root cause: cross-lesson navigation in Lesson 04 was repeatedly reinterpreted instead of reusing the established Lesson 03 production pattern.
- Lesson 03 reference reviewed: `clusterceu-crypto/UCAN-Lesson03`, branch `develop`, `index.html`. Its persistent header places `← Попереднє заняття` immediately after the UCAN brand in the learner-facing header order. Its final transition targets the next lesson only at the end of the lesson flow.
- Exact Lesson 04 implementation: the single Lesson 03 anchor now sits directly after the UCAN brand in `.site-header`, with the visible label `← Попереднє заняття`, `rel="prev"`, and URL `https://clusterceu-crypto.github.io/UCAN-Lesson03`. It has no `hidden` attribute and no JavaScript visibility toggle. The single Lesson 05 anchor is now inside Route 10 only, has visible label `Наступне заняття →`, `rel="next"`, and URL `https://clusterceu-crypto.github.io/UCAN-Lesson05`. No Lesson 05 control appears in the header.
- Duplicates removed: the incorrect Route 10 previous/next pair and long visible labels were replaced by one persistent previous control and one final-page next control. Internal `← Назад` / `Далі →` remain unchanged and separate.
- Responsive behavior: desktop header order is UCAN, previous lesson, lesson/page information, reset. Mobile preserves the previous link in a dedicated second header row and reset in a third row; the final Lesson 05 control fills its own responsive final-page block. This follows the Lesson 03 interaction hierarchy without copying lesson-specific code.
- Approved Production Navigation Rule for Lessons 04–26: (1) Header contains one persistent `← Попереднє заняття` button immediately after the UCAN logo. (2) The previous-lesson button is visible on every lesson page. (3) The final lesson page contains one `Наступне заняття →` button. (4) The next-lesson button is not placed in the header. (5) Internal `← Назад` / `Далі →` navigation remains separate. (6) Position, style, responsive behavior, and interaction are reused unchanged. (7) Only lesson number and canonical URL change. (8) No lesson team may redesign this pattern without an approved architecture decision. (9) Lesson 01 may omit or disable the previous-lesson control. (10) The final course lesson may omit the next-lesson control or use an approved completion destination.
- Standard document update record — `Cross-Lesson Navigation`: **MUST** provide a persistent previous-lesson button immediately after UCAN logo; **MUST** show it on all pages; **MUST** provide the next-lesson button on the final page only; **MUST** reuse Lesson 03 position and visual pattern; **MUST** change only lesson number and canonical URL; **MUST NOT** place next-lesson button in the header; **MUST NOT** redesign per lesson; **MUST NOT** mix cross-lesson navigation with internal page navigation. This amendment text is prepared for the master standard; no normative DOCX was edited in this sprint.
- Files changed for this correction: `index.html`, `css/lesson04.css`, `tests/static/lesson04-static-checks.ps1`, and this report. `js/lesson04.js` remains unchanged for this pattern, including all completion, assessment, and storage contracts.
- Static verification: `git diff --check` and `STATIC_CHECKS_PASS` pass. Assertions confirm one canonical link for Lesson 03 and Lesson 05, previous link after brand, no hidden/placeholder/toggle, next link completion-only, no Lesson 05 header link, 10 runtime routes, unchanged progress/prompt registry/Portfolio/assessment contracts.
- Browser verification: blocked before local page attachment at `http://127.0.0.1:4174/`: `Timed out waiting for the Browser webview to attach for this browser-use page`. Route-by-route desktop/mobile/console observations could not run.
- Git operations: none. Repository synchronization: none.

Status: 🟡 Lesson 04 Cross-Lesson Navigation Implemented
Verification: 🟡 Browser Verification Blocked
Rule: 🟢 Canonical Navigation Rule for Lessons 04–26 Recorded
Control: 🟡 Controlled Save Not Yet Authorized
Synchronization: 🔴 Репозиторій не синхронізувати
