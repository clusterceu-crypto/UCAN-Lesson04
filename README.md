# UCAN Lesson 04 — Learning Clarity & Timebox v1.1.5

## Status

- Upgrade type: controlled learner-content enrichment
- Runtime baseline: Lesson 04 v1.1.2 Learner UX Harmonization
- Learning architecture: preserved
- Assessment logic: preserved
- Portfolio field architecture: preserved
- Navigation and local storage: preserved

## Purpose

This release improves the instructional usefulness of Lesson 04 for both first-time and experienced participants. It adds plain-language explanations, concrete examples and explicit transfer prompts without replacing the canonical lesson logic.

## Main changes

- Seven steps on the page `Як читати міжнародний кейс` now include:
  - a plain-language explanation;
  - a concrete or explicitly hypothetical example;
  - a question for applying the step to the participant's own community.
- The case page now explains:
  - what is confirmed by an official source;
  - how the case may help a community;
  - what cannot be transferred automatically;
  - how the principle could look in a hypothetical community situation.
- Added separate guidance for:
  - participants who are new to the topic;
  - participants who already have practical experience.
- AI modes now support learning more directly:
  - advice explains difficult points simply;
  - help works one field at a time through guiding questions;
  - review checks the completed result against lesson criteria.

## Evidence boundary

No new external factual claims were introduced. New community examples are explicitly marked as hypothetical. Statements about Copenhagen, Barcelona, EU Cities Mission and SUN4Ukraine remain within the factual boundaries already present in Lesson 04.

## Package structure

```text
UCAN_Lesson_04_HTML_v1.1.3_Content_Enrichment/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── L04-A01_International_to_Local_First_Step_v1.0.png
│   ├── L04-A02_EU_Cities_Mission_System_v1.0.png
│   └── L04-A03_Copy_or_Adapt_v1.0.png
├── Content_Enrichment_Change_Log.md
└── README.md
```

## Launch

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/` from the package root.


## v1.1.5 timebox and simplification

- learner-facing duration changed to 20–30 minutes;
- resources and AI support marked as optional;
- separate novice/experienced pathways removed;
- AI support reduced to two modes: Help complete and Review result.


## Content Evidence Update v1.1.5
- Основний маршрут читання кейсу скорочено до 4 кроків; повна 7-крокова пам’ятка доступна за бажанням.
- Додано доказовий кейс кліматичних укриттів у школах Барселони з офіційним оцінюванням результатів.
- Додано умовний український сценарій відновлення амбулаторії та зупинки.
- Додано необов’язковий Urban Adaptation Support Tool.
- Зафіксовано, що відео не інтегрується без окремої мультимедійної матриці.
