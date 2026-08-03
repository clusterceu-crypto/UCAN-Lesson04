/* Bounded Lesson 04 contents control, aligned to the Course UX pattern. */
(() => {
  'use strict';
  const config = window.UCAN_L04_CONFIG;
  const pages = Array.from(document.querySelectorAll('.lesson-page'));
  const host = document.getElementById('section-navigation');
  if (!config || !host || pages.length !== config.pages.length) return;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'contents-toggle';
  toggle.textContent = 'Зміст заняття';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'lesson-contents-list');

  const list = document.createElement('div');
  list.id = 'lesson-contents-list';
  list.className = 'contents-list';
  list.hidden = true;
  const controls = config.pages.map(({ index }) => {
    const control = document.createElement('button');
    const page = pages[index];
    control.type = 'button';
    control.textContent = `${index + 1}. ${page.querySelector('h1')?.textContent?.trim() || ''}`;
    control.addEventListener('click', () => {
      const current = pages.findIndex(candidate => !candidate.hidden);
      if (index === current) return;
      const navigationControl = document.getElementById(index > current ? 'next-page' : 'prev-page');
      for (let step = 0; step < Math.abs(index - current); step += 1) navigationControl?.click();
      list.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
    list.appendChild(control);
    return control;
  });

  toggle.addEventListener('click', () => {
    list.hidden = !list.hidden;
    toggle.setAttribute('aria-expanded', String(!list.hidden));
  });
  host.replaceChildren(toggle, list);

  function update() {
    const current = pages.findIndex(page => !page.hidden);
    controls.forEach((control, index) => {
      if (index === current) control.setAttribute('aria-current', 'page');
      else control.removeAttribute('aria-current');
    });
  }
  new MutationObserver(update).observe(document.querySelector('main'), { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  update();
})();
