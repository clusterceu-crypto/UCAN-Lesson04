# UCAN Заняття 04 — HTML/LMS Controlled Upgrade v1.1

## Status

- Architecture baseline: `UCAN-AF-HTML-v1.2-20260722`
- HTML/LMS Standard: v1.2 — Current
- Canonical Component Contract: v1.0 — Mandatory
- Upgrade type: controlled conformance upgrade of Final Release v1.0
- Learning content: preserved

## Canonical source lineage

- Final Lesson: `UCAN_Заняття_04_Фінальна_Редакція_v1.0 (2).docx`
- Designer Package: `UCAN_Заняття_04_Designer_Package_v1.1.docx`
- AI Visual Generation Pack: `UCAN_Заняття_04_AI_Visual_Generation_Pack_v1.1.docx`
- Runtime baseline: `UCAN_Заняття_04_Final_Release_v1.0.zip`
- Approved RC lineage: `UCAN_Заняття_04_HTML_RC_v1.1.zip`

The Final Release v1.0 runtime members and RC v1.1 members were byte-identical before this upgrade.

## Package structure

```text
UCAN_Lesson_04_HTML_v1.1/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── L04-A01_International_to_Local_First_Step_v1.0.png
│   ├── L04-A02_EU_Cities_Mission_System_v1.0.png
│   └── L04-A03_Copy_or_Adapt_v1.0.png
└── README.md
```

## Controlled changes

- semantic previous/next lesson terminology;
- canonical header reset and separate full-data reset;
- fixed bottom section navigation;
- canonical button and emoji labels;
- direct local Portfolio PDF download with browser print as secondary fallback;
- prompt preview dialog and copy workflow;
- official ChatGPT and Gemini actions with learner-controlled paste;
- configuration-controlled completion routing;
- scoped state reset and storage metadata;
- accessibility, mobile and print refinements required by Standard v1.2.

## Local storage

Existing learner data remain compatible under `ucan_l04_v1`:

- `ucan_l04_v1:page`
- `ucan_l04_v1:visited`
- `ucan_l04_v1:transition`
- `ucan_l04_v1:selfCheck`
- `ucan_l04_v1:portfolio`
- `ucan_l04_v1:assessment`

Added metadata key:

- `ucan_l04_v1:meta`

The field schemas and assessment payloads are unchanged. The header reset preserves the Portfolio; the explicit footer danger action clears all lesson-local state only after confirmation.

## Privacy and portability

- No analytics, cookies, remote fonts, external JavaScript libraries or automatic data transmission.
- Portfolio PDF is generated locally in the browser.
- ChatGPT and Gemini open only after a learner action; prompt submission is never automatic.
- All runtime paths are relative and the package works from a local static server.

## Launch

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/` from the package root.
