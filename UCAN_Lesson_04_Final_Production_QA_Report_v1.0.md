# UCAN Lesson 04 — Final Production QA Report v1.0

🔴 Lesson 04 Final Production Preview Failed

- **Defect ID:** `L04-FPQA-001`
- **Exact reproduction:** На гілці `develop` у точному candidate HEAD `6872458977373a170c93d47e599dcca1d8f4575f` із чистим working tree запустити локальний HTTP preview, відкрити Route 1 і переглянути таблицю `Карта заняття`. Порахувати її learner-facing entries та порівняти їх зі списком у `Зміст заняття` і розділом `Final 10-Page Route` документа `UCAN_Lesson_04_Consolidated_Executable_Contract_v1.0.md`.
- **Expected:** `Карта заняття` містить рівно 10 затверджених entries: Route 8 об’єднує практичне завдання, Portfolio actions і AI Consultant P01–P03; Route 9 є підсумковим тестом; Route 10 є завершенням. Окремого learner-facing AI entry немає.
- **Actual:** `Карта заняття` містить 11 entries. Row 9 показує окрему `AI-підтримка`, row 10 — `Підсумковий тест заняття`, row 11 — `Завершення`. Це суперечить фактичній 10-route navigation, де AI інтегровано в Route 8, assessment є Route 9, а completion — Route 10.
- **Affected route/component:** Route 1 — learner-facing table `Карта заняття` у `index.html`.
- **Severity:** Blocker — executable-contract nonconformance і суперечлива learner-facing route model; Release Gate не може пройти.
- **Minimal corrective scope:** Змінити лише rows таблиці `Карта заняття` в `index.html`: інтегрувати AI-підтримку в опис Route 8, перенумерувати assessment як Route 9 і completion як Route 10 та видалити окремий AI row. Не змінювати DOM route count/order, JavaScript, CSS, prompt registry, Portfolio fields, assessment data, assets або completion gate.
