(() => {
  'use strict';

  const CONFIG = Object.freeze({
    lessonId: 'L04',
    currentLessonLabel: 'Заняття 04',
    storageNamespace: 'ucan_l04_v1',
    storageSchemaVersion: '1.1',
    releaseVersion: '1.1.4',
    portfolioTitle: 'Карта адаптації міжнародного кліматичного досвіду для громади',
    portfolioLabel: 'Портфель мера',
    portfolioFilenamePattern: 'UCAN_Карта_адаптації_міжнародного_кліматичного_досвіду_{community}.pdf',
    chatgptUrl: 'https://chatgpt.com/',
    geminiUrl: 'https://gemini.google.com/app',
    previousLessonUrl: 'https://clusterceu-crypto.github.io/UCAN-Lesson03',
    currentLessonUrl: 'https://clusterceu-crypto.github.io/UCAN-Lesson04',
    nextLessonUrl: 'https://clusterceu-crypto.github.io/UCAN-Lesson05',
    nextLessonTheme: 'природоорієнтовані рішення',
    assessmentGate: true
  });

  const STORAGE_PREFIX = CONFIG.storageNamespace;
  const keys = {
    page: `${STORAGE_PREFIX}:page`,
    visited: `${STORAGE_PREFIX}:visited`,
    transition: `${STORAGE_PREFIX}:transition`,
    selfCheck: `${STORAGE_PREFIX}:selfCheck`,
    portfolio: `${STORAGE_PREFIX}:portfolio`,
    assessment: `${STORAGE_PREFIX}:assessment`,
    meta: `${STORAGE_PREFIX}:meta`
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
    { statement: 'Міжнародний кейс використовується без посилання на офіційне джерело.', answer: 'Ні', feedback: 'Твердження для учасника мають бути простежуваними до перевіреного джерела.' }
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
    ['prior_context', 'Контекст із попереднього заняття'],
    ['case_title', 'Міжнародний кейс або принцип'],
    ['official_source', 'Офіційне джерело'],
    ['confirmed_evidence', 'Що точно підтверджує джерело'],
    ['transferable_principle', 'Який принцип можна перенести'],
    ['adaptation_conditions', 'Що потрібно перевірити у громаді'],
    ['first_step', 'Перший крок'],
    ['risk', 'Головний ризик'],
    ['partner', 'Кого потрібно залучити'],
    ['success_signals', '2–3 ознаки доцільності'],
    ['next_lesson_note', 'Що перевірити у наступному занятті']
  ];

  let storageAvailable = true;
  let currentPage = 0;
  let visited = new Set([0]);
  let assessmentPassed = false;
  let promptReady = false;

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
    prevButton.setAttribute('aria-disabled', String(prevButton.disabled));

    const lastPage = currentPage === total - 1;
    const blockedByTest = CONFIG.assessmentGate && isAssessmentPage(currentPage) && !assessmentPassed;
    nextButton.disabled = lastPage || blockedByTest;
    nextButton.setAttribute('aria-disabled', String(nextButton.disabled));
    if (blockedByTest) {
      nextButton.setAttribute('aria-label', 'Наступний розділ — спочатку завершіть тест');
      nextButton.title = 'Спочатку завершіть тест';
    } else {
      nextButton.setAttribute('aria-label', 'Наступний розділ');
      nextButton.removeAttribute('title');
    }
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

  function pdfFilename(data) {
    return CONFIG.portfolioFilenamePattern.replace('{community}', sanitizeFilename(data.community));
  }

  function wrapCanvasText(context, text, maxWidth) {
    const value = String(text || '—').replace(/\r\n?/g, '\n');
    const paragraphs = value.split('\n');
    const lines = [];
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const words = paragraph.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        lines.push('');
      } else {
        let line = '';
        words.forEach(word => {
          const candidate = line ? `${line} ${word}` : word;
          if (context.measureText(candidate).width <= maxWidth) {
            line = candidate;
            return;
          }
          if (line) lines.push(line);
          if (context.measureText(word).width <= maxWidth) {
            line = word;
            return;
          }
          let fragment = '';
          Array.from(word).forEach(character => {
            const next = fragment + character;
            if (context.measureText(next).width > maxWidth && fragment) {
              lines.push(fragment);
              fragment = character;
            } else {
              fragment = next;
            }
          });
          line = fragment;
        });
        if (line) lines.push(line);
      }
      if (paragraphIndex < paragraphs.length - 1) lines.push('');
    });
    return lines;
  }

  function createPortfolioPdfCanvases(data) {
    const width = 1240;
    const height = 1754;
    const margin = 92;
    const maxWidth = width - margin * 2;
    const bottom = height - margin;
    const canvases = [];
    let canvas;
    let context;
    let y;

    function newPage() {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      context = canvas.getContext('2d', { alpha: false });
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
      canvases.push(canvas);
      y = margin;
    }

    function ensureSpace(required) {
      if (y + required > bottom) newPage();
    }

    function drawText(text, options = {}) {
      const fontSize = options.fontSize || 28;
      const lineHeight = options.lineHeight || Math.round(fontSize * 1.42);
      const weight = options.weight || 400;
      const color = options.color || '#1f2a33';
      const gapAfter = options.gapAfter ?? 18;
      context.font = `${weight} ${fontSize}px Arial, "DejaVu Sans", sans-serif`;
      context.fillStyle = color;
      const lines = wrapCanvasText(context, text, options.maxWidth || maxWidth);
      for (const line of lines) {
        ensureSpace(lineHeight + gapAfter);
        if (line) context.fillText(line, margin, y);
        y += lineHeight;
      }
      y += gapAfter;
    }

    newPage();
    drawText(CONFIG.portfolioTitle, { fontSize: 42, lineHeight: 54, weight: 700, color: '#123f68', gapAfter: 10 });
    drawText(CONFIG.portfolioLabel, { fontSize: 30, lineHeight: 40, weight: 700, color: '#2d7b55', gapAfter: 34 });
    drawText('Локально створений навчальний артефакт. Дані не передавалися на сервер.', { fontSize: 22, lineHeight: 32, color: '#47545e', gapAfter: 32 });

    portfolioFields.forEach(([key, label]) => {
      ensureSpace(110);
      context.strokeStyle = '#cfd9df';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(margin, y);
      context.lineTo(width - margin, y);
      context.stroke();
      y += 24;
      drawText(label, { fontSize: 24, lineHeight: 34, weight: 700, color: '#123f68', gapAfter: 8 });
      drawText((data[key] || '').trim() || '—', { fontSize: 24, lineHeight: 36, color: '#1f2a33', gapAfter: 28 });
    });

    ensureSpace(130);
    context.strokeStyle = '#cfd9df';
    context.beginPath();
    context.moveTo(margin, y);
    context.lineTo(width - margin, y);
    context.stroke();
    y += 24;
    drawText('Примітка', { fontSize: 24, lineHeight: 34, weight: 700, color: '#123f68', gapAfter: 8 });
    drawText('Цей PDF можна за Вашим рішенням передати AI-помічнику для аналізу, уточнення або вдосконалення запропонованого рішення. Не додавайте персональні чи конфіденційні дані.', { fontSize: 22, lineHeight: 33, color: '#47545e', gapAfter: 0 });
    return canvases;
  }

  function base64ToBytes(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function buildImagePdf(canvases) {
    const encoder = new TextEncoder();
    const chunks = [];
    const offsets = [0];
    let length = 0;
    const pushBytes = bytes => { chunks.push(bytes); length += bytes.length; };
    const pushText = text => pushBytes(encoder.encode(text));
    const imageRecords = canvases.map(canvas => {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      return { width: canvas.width, height: canvas.height, bytes: base64ToBytes(dataUrl.split(',')[1]) };
    });
    const objectCount = 2 + imageRecords.length * 3;
    const pageIds = imageRecords.map((_, index) => 3 + index * 3);

    pushText('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    function startObject(id) { offsets[id] = length; pushText(`${id} 0 obj\n`); }
    function endObject() { pushText('endobj\n'); }

    startObject(1);
    pushText('<< /Type /Catalog /Pages 2 0 R >>\n');
    endObject();

    startObject(2);
    pushText(`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>\n`);
    endObject();

    imageRecords.forEach((record, index) => {
      const pageId = 3 + index * 3;
      const contentId = pageId + 1;
      const imageId = pageId + 2;
      const imageName = `Im${index}`;
      const content = `q\n595 0 0 842 0 0 cm\n/${imageName} Do\nQ\n`;
      const contentBytes = encoder.encode(content);

      startObject(pageId);
      pushText(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\n`);
      endObject();

      startObject(contentId);
      pushText(`<< /Length ${contentBytes.length} >>\nstream\n`);
      pushBytes(contentBytes);
      pushText('endstream\n');
      endObject();

      startObject(imageId);
      pushText(`<< /Type /XObject /Subtype /Image /Width ${record.width} /Height ${record.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${record.bytes.length} >>\nstream\n`);
      pushBytes(record.bytes);
      pushText('\nendstream\n');
      endObject();
    });

    const xrefOffset = length;
    pushText(`xref\n0 ${objectCount + 1}\n`);
    pushText('0000000000 65535 f \n');
    for (let id = 1; id <= objectCount; id += 1) {
      pushText(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
    }
    pushText(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
    return new Blob(chunks, { type: 'application/pdf' });
  }

  function setLoading(button, loading) {
    button.disabled = loading;
    button.setAttribute('aria-busy', String(loading));
    const label = button.querySelector('.button-label');
    if (label) label.textContent = loading ? 'Створення PDF…' : 'Завантажити PDF';
  }

  async function downloadPortfolioPdf() {
    const button = document.getElementById('download-portfolio');
    const status = document.getElementById('portfolio-status');
    const data = getPortfolioData();
    savePortfolio();
    renderPortfolioSummary(data);
    setLoading(button, true);
    status.textContent = 'Створюємо PDF локально у Вашому браузері…';
    try {
      await new Promise(resolve => window.requestAnimationFrame(resolve));
      const canvases = createPortfolioPdfCanvases(data);
      const blob = buildImagePdf(canvases);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFilename(data);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      status.textContent = 'PDF створено та завантажено. Дані залишилися у Вашому браузері.';
    } catch (error) {
      console.error('Portfolio PDF generation failed', error);
      status.textContent = 'Не вдалося створити PDF. Перевірте налаштування браузера та спробуйте ще раз.';
    } finally {
      setLoading(button, false);
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
      help: 'Допомагайте виконувати завдання поетапно. Спочатку визначте перше незаповнене або нечітке поле, коротко поясніть його простими словами і поставте одне навідне запитання. Не заповнюйте всю Карту одразу, не додавайте готових місцевих фактів і не видавайте припущення за доказ.',
      review: 'Перевірте готовий результат за критеріями заняття. Для кожного критерію використайте статус «готово» або «потребує уточнення»: підтверджений факт, відокремлення припущень, переносний принцип, місцеві умови, реалістичний перший крок, ризик, партнер і ознаки доцільності. Пояснюйте простими словами, назвіть сильні сторони та запропонуйте не більше трьох точкових покращень.'
    };

    return [
      'Працюйте лише з контекстом, який надав користувач. Не вигадуйте джерела, місцеві факти, бюджети, строки, показники ефективності або гарантії придатності.',
      modeInstructions[mode] || modeInstructions.help,
      '',
      'Контекст користувача:',
      context,
      '',
      'Вимоги до відповіді:',
      '1. Пишіть простою українською мовою без зайвого професійного жаргону.',
      '2. Чітко відділяйте те, що надав користувач, від Ваших порад та умовних прикладів.',
      '3. Не приймайте рішення замість користувача і не створюйте фальшивої впевненості.',
      '4. Допоможіть користувачу зрозуміти матеріал і самостійно покращити роботу.'
    ].join('\n');
  }

  function currentAiPrompt() {
    const selected = document.querySelector('input[name="ai-mode"]:checked');
    return buildAiPrompt(selected?.value || 'help', getPortfolioData());
  }

  function setPromptReady(ready) {
    promptReady = Boolean(ready);
    const copyButton = document.getElementById('copy-ai-prompt');
    copyButton.disabled = !promptReady;
    ['open-chatgpt', 'open-gemini'].forEach(id => {
      const link = document.getElementById(id);
      link.setAttribute('aria-disabled', String(!promptReady));
      link.tabIndex = promptReady ? 0 : -1;
    });
  }

  function openPromptDialog(prompt) {
    const dialog = document.getElementById('ai-prompt-dialog');
    document.getElementById('ai-prompt-dialog-content').textContent = prompt;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.getElementById('ai-prompt-dialog-content').focus();
  }

  function handleAiPrompt(event) {
    event.preventDefault();
    const prompt = currentAiPrompt();
    document.getElementById('ai-prompt-preview').textContent = prompt;
    document.getElementById('ai-status').textContent = 'Запит підготовлено. Перевірте його перед копіюванням або відкриттям зовнішнього сервісу.';
    setPromptReady(true);
    openPromptDialog(prompt);
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

  function resetLearningProgress() {
    const confirmed = window.confirm('Почати заняття спочатку? Буде очищено відвідані сторінки, нотатку переходу, самоперевірку та підсумковий тест. Карта адаптації залишиться збереженою.');
    if (!confirmed) return;
    [keys.page, keys.visited, keys.transition, keys.selfCheck, keys.assessment].forEach(storageRemove);
    assessmentPassed = false;
    visited = new Set([0]);
    const transitionField = document.getElementById('transition-note');
    if (transitionField) transitionField.value = '';
    renderSelfCheck();
    renderAssessment();
    setPromptReady(false);
    document.getElementById('ai-prompt-preview').textContent = 'Заповніть Карту адаптації та оберіть режим підтримки.';
    showPage(0);
    announce('Навчальний прогрес очищено. Карта адаптації збережена.');
  }


  function configureCompletionActions() {
    document.getElementById('return-start').addEventListener('click', () => showPage(0));

    const previousLink = document.getElementById('previous-lesson-link');
    if (CONFIG.previousLessonUrl) {
      previousLink.href = CONFIG.previousLessonUrl;
      previousLink.hidden = false;
    } else {
      previousLink.hidden = true;
      previousLink.removeAttribute('href');
    }

    const nextLink = document.getElementById('next-lesson-link');
    if (CONFIG.nextLessonUrl) {
      nextLink.href = CONFIG.nextLessonUrl;
      nextLink.hidden = false;
    } else {
      nextLink.hidden = true;
      nextLink.removeAttribute('href');
    }
  }

  function ensureStorageMetadata() {
    const existing = storageGet(keys.meta, null);
    const expected = { schemaVersion: CONFIG.storageSchemaVersion, releaseVersion: CONFIG.releaseVersion };
    if (!existing || existing.schemaVersion !== expected.schemaVersion || existing.releaseVersion !== expected.releaseVersion) {
      storageSet(keys.meta, expected);
    }
  }

  function configureExternalActions() {
    const chatgptLink = document.getElementById('open-chatgpt');
    const geminiLink = document.getElementById('open-gemini');
    chatgptLink.href = CONFIG.chatgptUrl;
    geminiLink.href = CONFIG.geminiUrl;
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
    document.getElementById('download-portfolio').addEventListener('click', downloadPortfolioPdf);
    document.getElementById('ai-support-form').addEventListener('submit', handleAiPrompt);

    document.querySelectorAll('input[name="ai-mode"]').forEach(input => {
      input.addEventListener('change', () => {
        setPromptReady(false);
        document.getElementById('ai-status').textContent = 'Режим змінено. Перегляньте оновлений запит перед копіюванням.';
      });
    });

    document.getElementById('copy-ai-prompt').addEventListener('click', () => {
      copyText(
        document.getElementById('ai-prompt-preview').textContent,
        document.getElementById('ai-status'),
        'Запит скопійовано. Ви самі вирішуєте, чи передавати його зовнішньому AI-інструменту.'
      );
    });
    document.getElementById('copy-ai-prompt-dialog').addEventListener('click', () => {
      copyText(
        document.getElementById('ai-prompt-dialog-content').textContent,
        document.getElementById('ai-status'),
        'Запит скопійовано. Ви самі вирішуєте, чи передавати його зовнішньому AI-інструменту.'
      );
    });
    document.getElementById('close-ai-prompt-dialog').addEventListener('click', () => {
      const dialog = document.getElementById('ai-prompt-dialog');
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    });
    document.getElementById('ai-prompt-dialog').addEventListener('close', () => {
      document.getElementById('preview-ai-prompt').focus();
    });

    ['open-chatgpt', 'open-gemini'].forEach(id => {
      const link = document.getElementById(id);
      link.addEventListener('click', event => {
        if (!promptReady) {
          event.preventDefault();
          document.getElementById('ai-status').textContent = 'Спочатку перегляньте запит.';
          return;
        }
        copyText(
          document.getElementById('ai-prompt-preview').textContent,
          document.getElementById('ai-status'),
          'Запит скопійовано. Вставте його у відкритому сервісі лише за власним рішенням.'
        );
      });
    });

    document.getElementById('copy-next-context').addEventListener('click', () => {
      const text = buildNextContext();
      document.getElementById('next-context-preview').textContent = text;
      copyText(text, document.getElementById('context-status'), 'Контекст для наступного заняття скопійовано.');
    });
    document.getElementById('reset-progress-top').addEventListener('click', resetLearningProgress);
    configureExternalActions();
    configureCompletionActions();

    document.addEventListener('keydown', event => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      const dialogOpen = document.getElementById('ai-prompt-dialog').open;
      if (typing || dialogOpen || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' && !prevButton.disabled) showPage(currentPage - 1);
      if (event.key === 'ArrowRight' && !nextButton.disabled) showPage(currentPage + 1);
    });
  }

  function initialize() {
    ensureStorageMetadata();
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
    setPromptReady(false);
    try {
      const noticeKey = `${STORAGE_PREFIX}:notice`;
      const notice = sessionStorage.getItem(noticeKey);
      if (notice) { announce(notice); sessionStorage.removeItem(noticeKey); }
    } catch (error) { /* session status is optional */ }
  }

  initialize();
})();
