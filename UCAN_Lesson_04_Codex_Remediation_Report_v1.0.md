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
