# UCAN Lesson 04 — HTML Package v1.1.6

## Status

- Release type: controlled learner-facing content and documentation update
- Current runtime version: 1.1.6
- Learning architecture: preserved
- Assessment logic: preserved
- Portfolio field architecture: preserved
- Navigation and local storage: preserved
- Learner-facing duration: 20–30 minutes
- Additional resources and AI support: optional

## Purpose

This package presents Lesson 04 as a concise, evidence-aware learning experience for municipal leaders and local-government staff. The lesson explains how to read international city cases, distinguish copying from adaptation, and transfer a verified principle into a realistic first step for a Ukrainian community.

## Current learning structure

The lesson contains 11 learner-facing pages and follows one common route for all participants.

The main case-reading method is presented in four steps:

1. What problem was being addressed?
2. What was done and what result is confirmed?
3. Under what conditions did it work?
4. What can be checked in the participant's own community?

A full seven-step case-reading checklist remains available as optional deepening material.

## Evidence and transfer approach

The lesson separates:

- facts confirmed by official sources;
- interpretation for municipal practice;
- hypothetical Ukrainian application scenarios;
- limits on what can be transferred automatically.

The Barcelona school climate-shelter example is used as the principal evidence-based case. The Ukrainian community scenario is explicitly presented as a learning example rather than a documented real-life result.

## Practical output

The participant prepares an adaptation map that identifies:

- the local problem;
- the transferable principle;
- required conditions;
- a realistic first step;
- a responsible partner;
- a key risk;
- a success criterion.

The practical task, self-check and assessment logic remain unchanged.

## AI support

AI support is optional and contains two modes only:

- **Help complete** — supports the participant one field at a time through guiding questions;
- **Review result** — checks the participant's draft against the lesson criteria.

The learner-facing interface references ChatGPT and Gemini as external AI services. AI is positioned as support for the participant's own work, not as a replacement for it.

## Optional resources

Additional resources are separated from the main 20–30 minute route. The Urban Adaptation Support Tool is included as an optional resource for participants who want to explore adaptation planning in greater depth.

Internal production notes, including decisions about possible multimedia integration, are not displayed in the learner-facing lesson.

## Package structure

```text
lesson04_v116/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── L04-A01_International_to_Local_First_Step_v1.0.png
│   ├── L04-A02_EU_Cities_Mission_System_v1.0.png
│   └── L04-A03_Copy_or_Adapt_v1.0.png
├── Content_Enrichment_Change_Log.md
├── Content_Evidence_Change_Log.md
├── Learning_Clarity_Change_Log.md
└── README.md
```

## Local launch

From the package root, run:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## QA status

Completed static checks:

- runtime version consistency;
- JavaScript syntax;
- duplicate HTML IDs;
- local asset references;
- learner-facing removal of the internal video-integration note;
- preservation of 11 lesson pages;
- preservation of assessment and navigation structure.

Still required before Final Release:

- browser navigation through all 11 pages;
- local-storage and progress restoration;
- practical-field persistence;
- self-check and test behavior;
- final-page unlocking;
- mobile rendering;
- published GitHub Pages verification.
