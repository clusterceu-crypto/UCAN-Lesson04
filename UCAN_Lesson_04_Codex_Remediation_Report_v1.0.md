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
