/* Bounded Lesson 04 compatibility runtime; does not claim cross-lesson authority. */
(() => {
  'use strict';
  const config = window.UCAN_L04_CONFIG;
  const pages = Array.from(document.querySelectorAll('.lesson-page'));
  const strip = document.getElementById('section-navigation');
  if (!config || !strip || pages.length !== config.pages.length) return;
  const key = `${config.storageNamespace}:visited`;
  const buttons = config.pages.map(({ index, shortLabel }) => {
    const page = pages[index];
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = shortLabel;
    button.dataset.pageIndex = String(index);
    button.setAttribute('aria-label', `Розділ ${index + 1}: ${page.querySelector('h1, h2')?.textContent?.trim() || ''}`);
    button.addEventListener('click', () => {
      const current = pages.findIndex(candidate => !candidate.hidden);
      if (index === current) return;
      const control = document.getElementById(index > current ? 'next-page' : 'prev-page');
      for (let step = 0; step < Math.abs(index - current); step += 1) control?.click();
    });
    return button;
  });
  strip.replaceChildren(...buttons);
  function update() {
    const current = pages.findIndex(page => !page.hidden);
    let visited = [];
    try { visited = JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) { visited = []; }
    buttons.forEach((button, index) => {
      const states = [];
      if (index === current) { button.setAttribute('aria-current', 'page'); states.push('current'); }
      else button.removeAttribute('aria-current');
      if (visited.includes(index)) states.push('visited');
      if (pages[index].dataset.pageRole === 'completion' && index !== current && pages[index].hidden) states.push('locked');
      button.dataset.state = states.join(' ');
    });
  }
  new MutationObserver(update).observe(document.querySelector('main'), { subtree:true, attributes:true, attributeFilter:['hidden'] });
  window.addEventListener('storage', update); update();
})();
