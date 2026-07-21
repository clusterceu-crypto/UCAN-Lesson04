(() => {
  'use strict';

  const STORAGE_PREFIX = 'ucan_l04_v1';
  const keys = {
    page: `${STORAGE_PREFIX}:page`,
    visited: `${STORAGE_PREFIX}:visited`,
    transition: `${STORAGE_PREFIX}:transition`,
    selfCheck: `${STORAGE_PREFIX}:selfCheck`,
    portfolio: `${STORAGE_PREFIX}:portfolio`,
    assessment: `${STORAGE_PREFIX}:assessment`
  };

  const pages = Array.from(document.querySelectorAll('.lesson-page'));
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const pageLabel = document.getElementById('page-label');
  const navPageCount = document.getElementById('nav-page-count');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const globalStatus = document.getElementById('global-status');

  const selfCheckData = [
    { statement: 'Місто обирає рішення лише тому, що його використав відомий європейський лідер.', answer: 'Ні', feedback: 'Назва міста не замінює аналіз місцевих умов.' },
    { statement: 'Команда спочатку визначає проблему, а потім шукає релевантний міжнародний досвід.', answer: 'Так', feedback: 'Пошук починається з управлінського питання, а не з готового об’єкта.' },
    { statement: 'Перед пілотом громада перевіряє законодавчі, фінансові та інфраструктурні умови.', answer: 'Так', feedback: 'Адаптація потребує перевірки критичних передумов.' },
    { statement: 'Усі числові результати іншого міста можна використати як прогноз для своєї громади.', answer: 'Ні', feedback: 'Чужі результати не є локальним прогнозом без окремого аналізу.' },
    { statement: 'Громада переносить принцип і тестує невеликий перший крок.', answer: 'Так', feedback: 'Малий пілот зменшує ризик і створює локальні докази.' },
    { statement: 'Міжнародний кейс використовується без посилання на офіційне джерело.', answer: 'Ні', feedback: 'Learner-facing твердження мають бути простежуваними до перевіреного джерела.' }
  ];

  const assessmentData = [
    {
      question: 'Який перший крок є найкращим, коли громада бачить успішний міжнародний проєкт?',
      options: {
        A: 'Одразу повторити його технічне рішення у власному місті.',
        B: 'Визначити власну проблему й перевірити умови, за яких принцип може працювати локально.',
        C: 'Спочатку знайти грант, а потім визначити, яку проблему вирішувати.',
        D: 'Закупити подібну технологію, щоб не втрачати час на аналіз.'
      },
      answer: 'B',
      feedback: 'Пошук починається з локального управлінського питання.'
    },
    {
      question: 'Що найбільш точно описує Climate City Contract?',
      options: {
        A: 'Юридичний договір між містом і Європейською Комісією про обов’язкове досягнення нульових викидів.',
        B: 'Перелік кліматичних проєктів, які місто планує подати на фінансування.',
        C: 'Спільна рамка зобов’язань, плану дій та інвестиційного плану, створена зі стейкголдерами.',
        D: 'Технічний стандарт для цифрового моніторингу міських викидів.'
      },
      answer: 'C',
      feedback: 'CCC поєднує політичну, операційну та інвестиційну логіку.'
    },
    {
      question: 'Яке твердження найкраще відрізняє системний підхід від окремого проєкту?',
      options: {
        A: 'Системний підхід використовує більше цифрових інструментів.',
        B: 'Системний підхід поєднує сектори, відповідальність, дані, партнерства та інвестиції.',
        C: 'Системний підхід завжди потребує більшого бюджету.',
        D: 'Системний підхід починається з одного флагманського об’єкта.'
      },
      answer: 'B',
      feedback: 'Один об’єкт не створює загальноміської трансформації.'
    },
    {
      question: 'Що можна безпечно перенести з міжнародного кейсу?',
      options: {
        A: 'Точний бюджет і строк реалізації іншого міста.',
        B: 'Назву програми та бренд міста.',
        C: 'Підтверджений принцип і логіку дії після перевірки місцевих умов.',
        D: 'Очікуваний числовий результат як прогноз для своєї громади.'
      },
      answer: 'C',
      feedback: 'Результати й масштаб іншого міста не можна автоматично переносити.'
    },
    {
      question: 'Яка інформація має бути відокремлена в міжнародному кейсі?',
      options: {
        A: 'Те, що джерело підтверджує, від можливого застосування у громаді.',
        B: 'Назва міста від назви країни.',
        C: 'Кліматична дія від усіх фінансових можливостей.',
        D: 'Технічні характеристики від візуального оформлення.'
      },
      answer: 'A',
      feedback: 'Це захищає від перебільшення та псевдодоказів.'
    },
    {
      question: 'Який результат практичного завдання є достатнім?',
      options: {
        A: 'Повний план впровадження міжнародного рішення з бюджетом і календарем.',
        B: 'Перелік щонайменше п’яти міжнародних кейсів.',
        C: 'Один підтверджений принцип, умови адаптації, перший крок, ризик, партнер і ознаки перевірки.',
        D: 'Загальна презентація про кліматичні тренди для міської ради.'
      },
      answer: 'C',
      feedback: 'Завдання формує перевірювану карту, а не повний план впровадження.'
    }
  ];

  const portfolioFields = [
    ['community', 'Ваша громада'],
    ['local_challenge', 'Локальний виклик'],
    ['prior_context', 'Контекст із Lesson 03'],
    ['case_title', 'Міжнародний кейс або принцип'],
    ['official_source', 'Офіційне джерело'],
    ['confirmed_evidence', 'Що підтверджує джерело'],
    ['transferable_principle', 'Який принцип можна перенести'],
    ['adaptation_conditions', 'Що потрібно перевірити у громаді'],
    ['first_step', 'Перший крок'],
    ['risk', 'Головний ризик'],
    ['partner', 'Кого потрібно залучити'],
    ['success_signals', '2–3 ознаки доцільності'],
    ['next_lesson_note', 'Що перевірити в Lesson 05']
  ];

  let storageAvailable = true;
  let currentPage = 0;
  let visited = new Set([0]);
  let assessmentPassed = false;

  function announce(message, isError = false) {
    globalStatus.textContent = message || '';
    globalStatus.classList.toggle('error', Boolean(isError));
  }

  function storageGet(key, fallback) {
    if (!storageAvailable) return fallback;
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      storageAvailable = false;
      announce('Не вдалося прочитати локально збережені дані. Роботу можна продовжити, але прогрес може не зберегтися.', true);
      return fallback;
    }
  }

  function storageSet(key, value) {
    if (!storageAvailable) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      storageAvailable = false;
      announce('Не вдалося зберегти дані локально. Перевірте налаштування браузера або вільне місце.', true);
      return false;
    }
  }

  function storageRemove(key) {
    if (!storageAvailable) return;
    try { localStorage.removeItem(key); } catch (error) { storageAvailable = false; }
  }

  function isCompletionPage(index) {
    return pages[index]?.dataset.pageRole === 'completion';
  }

  function isAssessmentPage(index) {
    return pages[index]?.dataset.pageRole === 'assessment';
  }

  function showPage(index, { focus = true } = {}) {
    if (index < 0 || index >= pages.length) return;
    if (isCompletionPage(index) && !assessmentPassed) {
      index = pages.findIndex(page => page.dataset.pageRole === 'assessment');
      announce('Сторінка завершення відкриється після правильної відповіді на всі шість питань.', true);
    } else {
      announce('');
    }

    currentPage = index;
    pages.forEach((page, pageIndex) => {
      const active = pageIndex === index;
      page.hidden = !active;
      page.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    visited.add(index);
    storageSet(keys.page, currentPage);
    storageSet(keys.visited, Array.from(visited));
    updateNavigation();
    updateProgress();

    if (focus) {
      const heading = pages[index].querySelector('h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function updateNavigation() {
    const total = pages.length;
    const pageNumber = currentPage + 1;
    pageLabel.textContent = `Сторінка ${pageNumber} з ${total}`;
    navPageCount.textContent = `${pageNumber} / ${total}`;
    prevButton.disabled = currentPage === 0;

    const lastPage = currentPage === total - 1;
    const blockedByTest = isAssessmentPage(currentPage) && !assessmentPassed;
    nextButton.disabled = lastPage || blockedByTest;
    nextButton.textContent = blockedByTest ? 'Спочатку завершіть тест' : 'Далі';
  }

  function updateProgress() {
    const percent = Math.round((visited.size / pages.length) * 100);
    progressFill.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', String(percent));
    progressText.textContent = `Відвідано ${visited.size} з ${pages.length}`;
  }

  function renderSelfCheck() {
    const container = document.getElementById('self-check-items');
    const saved = storageGet(keys.selfCheck, { answers: {}, checked: false });
    container.textContent = '';

    selfCheckData.forEach((item, index) => {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'question-card';
      const legend = document.createElement('legend');
      legend.textContent = `Завдання ${index + 1}. ${item.statement}`;
      fieldset.appendChild(legend);

      ['Так', 'Ні'].forEach(option => {
        const label = document.createElement('label');
        label.className = 'choice-card';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `self-${index}`;
        input.value = option;
        input.checked = saved.answers?.[index] === option;
        input.addEventListener('change', saveSelfCheckDraft);
        const text = document.createElement('span');
        text.textContent = option;
        label.append(input, text);
        fieldset.appendChild(label);
      });

      const feedback = document.createElement('p');
      feedback.id = `self-feedback-${index}`;
      feedback.className = 'question-feedback';
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      if (saved.checked && saved.answers?.[index]) {
        setFeedback(feedback, saved.answers[index] === item.answer, item.feedback);
      }
      fieldset.appendChild(feedback);
      container.appendChild(fieldset);
    });
  }

  function collectRadioAnswers(prefix, count) {
    const answers = {};
    for (let index = 0; index < count; index += 1) {
      const selected = document.querySelector(`input[name="${prefix}-${index}"]:checked`);
      if (selected) answers[index] = selected.value;
    }
    return answers;
  }

  function saveSelfCheckDraft() {
    const answers = collectRadioAnswers('self', selfCheckData.length);
    storageSet(keys.selfCheck, { answers, checked: false });
  }

  function setFeedback(element, correct, text) {
    element.textContent = text;
    element.className = `question-feedback ${correct ? 'correct' : 'incorrect'}`;
  }

  function handleSelfCheckSubmit(event) {
    event.preventDefault();
    const answers = collectRadioAnswers('self', selfCheckData.length);
    let correctCount = 0;
    selfCheckData.forEach((item, index) => {
      const feedback = document.getElementById(`self-feedback-${index}`);
      const selected = answers[index];
      if (!selected) {
        feedback.textContent = 'Оберіть «Так» або «Ні».';
        feedback.className = 'question-feedback incorrect';
        return;
      }
      const correct = selected === item.answer;
      if (correct) correctCount += 1;
      setFeedback(feedback, correct, item.feedback);
    });
    storageSet(keys.selfCheck, { answers, checked: true });
    const status = document.getElementById('self-check-status');
    status.textContent = `Правильних відповідей: ${correctCount} з ${selfCheckData.length}. Ви можете змінити відповіді та спробувати ще раз.`;
  }

  function resetSelfCheck() {
    if (!window.confirm('Очистити всі відповіді самоперевірки?')) return;
    storageRemove(keys.selfCheck);
    renderSelfCheck();
    document.getElementById('self-check-status').textContent = 'Відповіді самоперевірки очищено.';
  }

  function renderAssessment() {
    const container = document.getElementById('assessment-items');
    const saved = storageGet(keys.assessment, { answers: {}, checked: false, passed: false });
    assessmentPassed = Boolean(saved.passed);
    container.textContent = '';

    assessmentData.forEach((item, index) => {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'question-card';
      const legend = document.createElement('legend');
      legend.textContent = `Питання ${index + 1}. ${item.question}`;
      fieldset.appendChild(legend);

      Object.entries(item.options).forEach(([key, option]) => {
        const label = document.createElement('label');
        label.className = 'choice-card';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `assessment-${index}`;
        input.value = key;
        input.checked = saved.answers?.[index] === key;
        input.addEventListener('change', saveAssessmentDraft);
        const text = document.createElement('span');
        text.textContent = `${key}. ${option}`;
        label.append(input, text);
        fieldset.appendChild(label);
      });

      const feedback = document.createElement('p');
      feedback.id = `assessment-feedback-${index}`;
      feedback.className = 'question-feedback';
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      if (saved.checked && saved.answers?.[index]) {
        setFeedback(feedback, saved.answers[index] === item.answer, item.feedback);
      }
      fieldset.appendChild(feedback);
      container.appendChild(fieldset);
    });

    const status = document.getElementById('assessment-status');
    if (assessmentPassed) status.textContent = 'Усі шість відповідей правильні. Сторінка завершення відкрита.';
    updateNavigation();
  }

  function saveAssessmentDraft() {
    const answers = collectRadioAnswers('assessment', assessmentData.length);
    storageSet(keys.assessment, { answers, checked: false, passed: false });
    assessmentPassed = false;
    updateNavigation();
  }

  function handleAssessmentSubmit(event) {
    event.preventDefault();
    const answers = collectRadioAnswers('assessment', assessmentData.length);
    let correctCount = 0;
    assessmentData.forEach((item, index) => {
      const feedback = document.getElementById(`assessment-feedback-${index}`);
      const selected = answers[index];
      if (!selected) {
        feedback.textContent = 'Оберіть одну відповідь.';
        feedback.className = 'question-feedback incorrect';
        return;
      }
      const correct = selected === item.answer;
      if (correct) correctCount += 1;
      setFeedback(feedback, correct, item.feedback);
    });

    assessmentPassed = correctCount === assessmentData.length;
    storageSet(keys.assessment, { answers, checked: true, passed: assessmentPassed });
    const status = document.getElementById('assessment-status');
    status.textContent = assessmentPassed
      ? 'Усі шість відповідей правильні. Сторінка завершення відкрита.'
      : `Правильних відповідей: ${correctCount} з ${assessmentData.length}. Перегляньте зворотний зв’язок і спробуйте ще раз.`;
    updateNavigation();
    status.focus?.();
  }

  function resetAssessment() {
    if (!window.confirm('Очистити всі відповіді підсумкового тесту?')) return;
    storageRemove(keys.assessment);
    assessmentPassed = false;
    renderAssessment();
    document.getElementById('assessment-status').textContent = 'Відповіді підсумкового тесту очищено.';
  }

  function getPortfolioData() {
    const data = {};
    portfolioFields.forEach(([key]) => {
      const field = document.getElementById(key);
      data[key] = field ? field.value.trim() : '';
    });
    return data;
  }

  function savePortfolio() {
    const data = getPortfolioData();
    storageSet(keys.portfolio, data);
    updateContextPreview(data);
  }

  function restorePortfolio() {
    const saved = storageGet(keys.portfolio, {});
    portfolioFields.forEach(([key]) => {
      const field = document.getElementById(key);
      if (!field) return;
      field.value = saved[key] || '';
      field.addEventListener('input', () => {
        clearFieldError(field);
        savePortfolio();
      });
    });
    updateContextPreview(saved);
  }

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    const error = document.getElementById(`${field.id}-error`);
    if (error) error.textContent = '';
  }

  function validatePortfolio({ focusFirst = true } = {}) {
    let firstInvalid = null;
    let valid = true;
    portfolioFields.forEach(([key]) => {
      const field = document.getElementById(key);
      if (!field || !field.required) return;
      const error = document.getElementById(`${key}-error`);
      if (!field.value.trim()) {
        valid = false;
        field.setAttribute('aria-invalid', 'true');
        if (error) error.textContent = 'Заповніть це поле.';
        if (!firstInvalid) firstInvalid = field;
      } else {
        clearFieldError(field);
      }
    });
    if (!valid && focusFirst && firstInvalid) firstInvalid.focus();
    return valid;
  }

  function renderPortfolioSummary(data = getPortfolioData()) {
    const summary = document.getElementById('portfolio-summary');
    const list = document.getElementById('portfolio-summary-list');
    const complete = portfolioFields.every(([key]) => key === 'prior_context' || Boolean((data[key] || '').trim()));
    list.textContent = '';
    portfolioFields.forEach(([key, label]) => {
      const wrapper = document.createElement('div');
      const term = document.createElement('dt');
      const value = document.createElement('dd');
      term.textContent = label;
      value.textContent = (data[key] || '').trim() || '—';
      wrapper.append(term, value);
      list.appendChild(wrapper);
    });
    document.getElementById('portfolio-completion-note').textContent = complete
      ? 'Карта містить усі обов’язкові поля.'
      : 'Карта містить незаповнені обов’язкові поля і не вважається завершеною.';
    summary.hidden = false;
    return complete;
  }

  function handlePortfolioSubmit(event) {
    event.preventDefault();
    savePortfolio();
    const valid = validatePortfolio();
    renderPortfolioSummary();
    document.getElementById('portfolio-status').textContent = valid
      ? 'Карту адаптації сформовано та збережено локально.'
      : 'Карту збережено як чернетку. Заповніть обов’язкові поля, щоб вважати її завершеною.';
  }

  function clearPortfolio() {
    if (!window.confirm('Очистити всі поля Карти адаптації? Цю дію не можна скасувати.')) return;
    document.getElementById('portfolio-form').reset();
    portfolioFields.forEach(([key]) => {
      const field = document.getElementById(key);
      if (field) clearFieldError(field);
    });
    storageRemove(keys.portfolio);
    document.getElementById('portfolio-summary').hidden = true;
    document.getElementById('portfolio-status').textContent = 'Поля Карти адаптації очищено.';
    updateContextPreview({});
  }

  function sanitizeFilename(value) {
    const cleaned = (value || 'громада')
      .trim()
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 80);
    return cleaned || 'громада';
  }

  function printPortfolio() {
    const data = getPortfolioData();
    savePortfolio();
    renderPortfolioSummary(data);
    const oldTitle = document.title;
    document.title = `UCAN_L04_Карта_адаптації_${sanitizeFilename(data.community)}`;
    document.body.classList.add('print-portfolio');
    const cleanup = () => {
      document.body.classList.remove('print-portfolio');
      document.title = oldTitle;
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    try {
      window.print();
    } catch (error) {
      cleanup();
      document.getElementById('portfolio-status').textContent = 'Не вдалося відкрити друк. Скористайтеся командою друку браузера.';
    }
  }

  function buildNextContext(data = getPortfolioData()) {
    return [
      `Громада: ${data.community || '—'}`,
      `Виклик: ${data.local_challenge || '—'}`,
      `Принцип: ${data.transferable_principle || '—'}`,
      `Умови: ${data.adaptation_conditions || '—'}`,
      `Перший крок: ${data.first_step || '—'}`,
      `Питання про можливість NBS: ${data.next_lesson_note || '—'}`
    ].join('\n');
  }

  function updateContextPreview(data = getPortfolioData()) {
    const preview = document.getElementById('next-context-preview');
    if (preview) preview.textContent = buildNextContext(data);
  }

  function buildAiPrompt(mode, data) {
    const context = portfolioFields
      .map(([key, label]) => `${label}: ${data[key] || '—'}`)
      .join('\n');

    const modeInstructions = {
      'fact-check': 'Перевірте, чи чітко відокремлено те, що підтверджує джерело, від припущень про можливе застосування у громаді.',
      questions: 'Сформуйте уточнювальні питання про умови адаптації, використовуючи лише наведений контекст.',
      compress: 'Стисніть погоджений контекст для передачі до Lesson 05 без додавання нових фактів.'
    };

    return [
      'Працюйте лише з контекстом, який надав користувач. Не вигадуйте джерела, місцеві факти, бюджети, строки, показники ефективності або гарантії придатності.',
      modeInstructions[mode] || modeInstructions['fact-check'],
      '',
      'Контекст користувача:',
      context,
      '',
      'Структура відповіді:',
      '1. Факти з наданого контексту.',
      '2. Припущення, які потребують перевірки.',
      '3. Три уточнювальні питання.',
      '4. Можливий наступний крок.'
    ].join('\n');
  }

  function handleAiPrompt(event) {
    event.preventDefault();
    const selected = document.querySelector('input[name="ai-mode"]:checked');
    const prompt = buildAiPrompt(selected?.value || 'fact-check', getPortfolioData());
    document.getElementById('ai-prompt-preview').textContent = prompt;
    document.getElementById('ai-status').textContent = 'Запит підготовлено. Перевірте його перед копіюванням.';
  }

  async function copyText(text, statusElement, successMessage) {
    if (!text || !text.trim()) {
      statusElement.textContent = 'Немає тексту для копіювання.';
      return false;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand('copy');
        helper.remove();
        if (!copied) throw new Error('copy failed');
      }
      statusElement.textContent = successMessage;
      return true;
    } catch (error) {
      statusElement.textContent = 'Не вдалося скопіювати автоматично. Виділіть текст у попередньому перегляді та скопіюйте вручну.';
      return false;
    }
  }

  function saveTransitionNote() {
    const note = document.getElementById('transition-note').value;
    storageSet(keys.transition, note);
    document.getElementById('transition-note-status').textContent = 'Нотатку збережено локально.';
  }

  function restoreTransitionNote() {
    const field = document.getElementById('transition-note');
    field.value = storageGet(keys.transition, '');
    let timer;
    field.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(saveTransitionNote, 300);
    });
  }

  function resetAllProgress() {
    if (!window.confirm('Скинути весь локальний прогрес Заняття 04, включно з Картою адаптації та тестом?')) return;
    Object.values(keys).forEach(storageRemove);
    window.location.reload();
  }

  function bindEvents() {
    prevButton.addEventListener('click', () => showPage(currentPage - 1));
    nextButton.addEventListener('click', () => showPage(currentPage + 1));

    document.getElementById('self-check-form').addEventListener('submit', handleSelfCheckSubmit);
    document.getElementById('self-check-reset').addEventListener('click', resetSelfCheck);
    document.getElementById('assessment-form').addEventListener('submit', handleAssessmentSubmit);
    document.getElementById('assessment-reset').addEventListener('click', resetAssessment);
    document.getElementById('portfolio-form').addEventListener('submit', handlePortfolioSubmit);
    document.getElementById('clear-portfolio').addEventListener('click', clearPortfolio);
    document.getElementById('print-portfolio').addEventListener('click', printPortfolio);
    document.getElementById('ai-support-form').addEventListener('submit', handleAiPrompt);
    document.getElementById('copy-ai-prompt').addEventListener('click', () => {
      copyText(
        document.getElementById('ai-prompt-preview').textContent,
        document.getElementById('ai-status'),
        'Запит скопійовано. Ви самі вирішуєте, чи передавати його зовнішньому AI-інструменту.'
      );
    });
    document.getElementById('copy-next-context').addEventListener('click', () => {
      const text = buildNextContext();
      document.getElementById('next-context-preview').textContent = text;
      copyText(text, document.getElementById('context-status'), 'Контекст для наступного заняття скопійовано.');
    });
    document.getElementById('reset-all-top').addEventListener('click', resetAllProgress);
    document.getElementById('reset-all-bottom').addEventListener('click', resetAllProgress);

    document.addEventListener('keydown', event => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      if (typing || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' && !prevButton.disabled) showPage(currentPage - 1);
      if (event.key === 'ArrowRight' && !nextButton.disabled) showPage(currentPage + 1);
    });
  }

  function initialize() {
    const savedAssessment = storageGet(keys.assessment, { passed: false });
    assessmentPassed = Boolean(savedAssessment.passed);
    const savedVisited = storageGet(keys.visited, [0]);
    visited = new Set(Array.isArray(savedVisited) ? savedVisited.filter(Number.isInteger) : [0]);
    if (visited.size === 0) visited.add(0);

    renderSelfCheck();
    renderAssessment();
    restorePortfolio();
    restoreTransitionNote();
    bindEvents();

    let savedPage = storageGet(keys.page, 0);
    if (!Number.isInteger(savedPage) || savedPage < 0 || savedPage >= pages.length) savedPage = 0;
    showPage(savedPage, { focus: false });
  }

  initialize();
})();
