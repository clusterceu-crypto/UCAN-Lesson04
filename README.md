# UCAN Заняття 04 — HTML Release Candidate v1.1

## Статус

- HTML package: completed
- HTML QA: passed locally
- Handoff: ready for Targeted Final QA
- Package type: standalone static HTML/LMS release candidate

## Canonical sources

- `UCAN_Заняття_04_Фінальна_Редакція_v1.0.docx` — controlling canonical source
- `UCAN_Заняття_04_Designer_Package_v1.1.docx` — synchronized downstream contract
- `UCAN_Заняття_04_AI_Visual_Generation_Pack_v1.1.docx` — synchronized generated-asset contract; no visual regeneration required
- Approved visual assets L04-A01–L04-A03 from the Lesson 04 Designer folder
- Current standards confirmed through the UCAN Active Standards Registry: HTML/LMS v1.1, Lesson Creator v1.2, Editorial Style Guide v0.2.1, Brandbook v1.1

No legacy HTML or previous Lesson was used as a content source.

## Package structure

```text
UCAN_Заняття_04_HTML_RC_v1.1/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── L04-A01_International_to_Local_First_Step_v1.0.png
│   ├── L04-A02_EU_Cities_Mission_System_v1.0.png
│   └── L04-A03_Copy_or_Adapt_v1.0.png
└── README.md
```

The A02 and A03 source files were copied byte-for-byte and assigned the canonical filenames defined by the Designer Package. Their image content was not modified.

## Launch

Open `index.html` in a current browser. A local static server is recommended for the most reliable Clipboard API behavior:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Functional scope

- 11 semantic participant-facing pages with dynamic page count
- visited-page progress without false completion
- keyboard navigation and heading focus management
- local restoration of page, transition note, self-check, Portfolio form and final test
- H01 case cards
- H02 official resource cards
- H03 six-item self-check, unlimited attempts, no completion gate
- H04 exact 13-field Portfolio form, local persistence, clear confirmation and print/PDF summary
- three controlled AI-support modes with preview and learner-controlled copy only
- H06 exact copy-context action for Заняття 05
- H05 six-item assessment with exact options, keys and feedback; completion page unlocks only after all six are correct
- full local reset with confirmation
- print styles for the full lesson and the Portfolio artifact
- no analytics, cookies, remote fonts, remote libraries or automatic data transmission

## Local storage keys

All keys are namespaced with `ucan_l04_v1`:

- `ucan_l04_v1:page`
- `ucan_l04_v1:visited`
- `ucan_l04_v1:transition`
- `ucan_l04_v1:selfCheck`
- `ucan_l04_v1:portfolio`
- `ucan_l04_v1:assessment`

## QA executed

- HTML structural validation
- JavaScript syntax validation
- internal and external link inventory validation
- responsive browser checks at mobile, tablet and desktop widths
- accessibility static and keyboard checks
- asset existence, dimensions, filename, alt-text and byte-integrity checks
- self-check persistence and reset checks
- Portfolio persistence, validation, context generation and print-mode checks
- assessment answer, retry, persistence and completion-gate checks
- DOCX-to-HTML exact-text verification for locked titles, labels, statements, feedback, test stems/options and Portfolio fields

Independent Targeted Final QA should verify the controlled terminology, Portfolio continuity and affected functional flows before Final Release packaging.

## v1.1 Targeted Synchronization

Canonical source: `UCAN_Заняття_04_Фінальна_Редакція_v1.0.docx`.

Controlled changes only:
- participant-visible `Lesson 03/04/05` harmonized to `Заняття 03/04/05`;
- internal participant-visible terminology removed;
- Mayor’s Portfolio identity added under the practical artifact title;
- completion message synchronized for use in Заняття 05.

No JavaScript behavior, field IDs, localStorage namespace, assessment logic, navigation, page count, CSS, visual assets or external URLs were changed.

