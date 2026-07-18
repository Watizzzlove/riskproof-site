(function () {
  const params = new URLSearchParams(window.location.search);
  const file = window.location.pathname.split('/').pop() || 'riskproof-concept.html';
  const data = window.RiskProofData && window.RiskProofData.directions;
  const byFile = {
    'riskproof-podrostok-page.html':'podrostok',
    'riskproof-ustoichivost-page.html':'ustoichivost',
    'riskproof-finance-page.html':'finance',
    'riskproof-proforientation-page.html':'proforientation'
  };
  const direction = params.get('direction') || byFile[file] || 'podrostok';
  const directionData = data && data[direction] ? data[direction] : data.podrostok;
  const queryLink = (target, values, hash) => {
    const q = new URLSearchParams(values || {});
    return target + (q.toString() ? '?' + q.toString() : '') + (hash || '');
  };
  const home = 'riskproof-concept.html';
  const testLink = d => queryLink('riskproof-test-page.html', {direction:d});
  const offerLink = (type, d) => queryLink('riskproof-offer-template-page.html', {type:type, direction:d});
  const anketaLink = d => d === 'finance' ? 'riskproof-anketa-finance-page.html' : d === 'proforientation' ? 'riskproof-anketa-proforientation-page.html' : 'riskproof-anketa-page.html';

  document.querySelectorAll('.logo').forEach(logo => {
    logo.dataset.homeLink = 'true'; logo.tabIndex = 0; logo.setAttribute('role','link');
    logo.setAttribute('aria-label','На главную RiskProof');
    const go = () => { window.location.href = home; };
    logo.addEventListener('click', go);
    logo.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  document.querySelectorAll('.breadcrumb a').forEach(a => a.href = home);

  if (file === 'riskproof-concept.html') {
    const cardMap = ['podrostok','ustoichivost','finance','proforientation'];
    document.querySelectorAll('.dir-card').forEach((card, i) => {
      const d = cardMap[i]; if (!d) return;
      card.dataset.href = data[d].page; card.tabIndex = 0; card.setAttribute('role','link');
      const heading = card.querySelector('h3');
      if (heading && !heading.querySelector('a')) heading.innerHTML = `<a href="${data[d].page}">${heading.textContent}</a>`;
      const cta = card.querySelector('.btn-text'); if (cta) cta.href = testLink(d);
      const go = e => { if (!e.target.closest('a,button')) window.location.href = data[d].page; };
      card.addEventListener('click', go);
      card.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a,button')) { e.preventDefault(); window.location.href = data[d].page; } });
    });
  }

  document.querySelectorAll('a[href="#test"]').forEach(a => a.href = testLink(direction));
  document.querySelectorAll('section#test a.btn, section[id="test"] a.btn').forEach(a => a.href = testLink(direction));

  document.querySelectorAll('.product-row').forEach(row => {
    const panel = row.closest('.lineup-panel');
    const d = panel ? panel.dataset.panel : direction;
    const kicker = (row.querySelector('.kicker') || {}).textContent || '';
    const a = row.querySelector('a.btn'); if (!a) return;
    if (/Тест/i.test(kicker)) a.href = testLink(d);
    else if (/Чек-лист/i.test(kicker)) a.href = queryLink('riskproof-checklist-page.html', {direction:d});
    else if (/Персональный разбор/i.test(kicker)) a.href = offerLink('razbor', d);
    else if (/Стратегическая сессия/i.test(kicker)) a.href = offerLink('session', d);
    else if (/Индивидуаль/i.test(kicker)) a.href = offerLink('individual', d);
    else if (/Курс/i.test(kicker)) {
      if (d === 'podrostok') a.href = 'riskproof-course-page.html';
      else { a.href = data[d].page + '#products'; a.title = 'Отдельная страница курса пока отсутствует — переход к линейке направления'; }
    }
  });

  if (file === 'riskproof-test-page.html') {
    document.title = `Тест «${directionData.testTitle}» — RiskProof`;
    const exit = document.querySelector('.exit-link'); if (exit) exit.href = directionData.page;
  }

  if (file === 'riskproof-result-page.html') {
    document.title = `Результат теста «${directionData.testTitle}» — RiskProof`;
    const resultCta = document.getElementById('result-cta');
    const zone = params.get('zone') || 'green';
    if (resultCta) {
      resultCta.href = zone === 'red2' ? offerLink('session', direction) : zone === 'red1' ? offerLink('razbor', direction) : directionData.page + '#products';
    }
    const crossDirections = Object.keys(data).filter(d => d !== direction);
    document.querySelectorAll('.crosssell-card').forEach((a, i) => {
      if (!crossDirections[i]) return;
      const next = data[crossDirections[i]];
      a.href = testLink(crossDirections[i]);
      const heading = a.querySelector('h4'); if (heading) heading.textContent = next.title;
      const note = a.querySelector('span:not(.crosssell-icon)'); if (note) note.textContent = 'Бесплатный тест · 3 минуты';
    });
    const emailButton = document.querySelector('.email-capture-form button');
    if (emailButton) emailButton.addEventListener('click', e => { e.preventDefault(); window.location.href = queryLink('riskproof-spasibo-page.html', {product:'result', direction:direction}); });
  }

  if (file === 'riskproof-checklist-page.html') {
    const pill = document.querySelector(`.demo-pill[data-type="${direction}"]`); if (pill) pill.click();
    const cross = document.getElementById('cross-cta'); if (cross) cross.href = testLink(direction);
    const download = document.querySelector('.email-form-row button');
    if (download) download.addEventListener('click', e => { e.preventDefault(); window.location.href = queryLink('riskproof-spasibo-page.html', {product:'checklist', direction:direction}); });
  }

  if (file === 'riskproof-offer-template-page.html') {
    const type = params.get('type') || 'razbor';
    const pill = document.querySelector(`.demo-pill[data-type="${type}"]`); if (pill) pill.click();
    document.querySelectorAll('.hero-kicker').forEach(el => el.textContent = `Направление · ${directionData.title}`);
    const destination = queryLink('riskproof-spasibo-page.html', {product:'razbor', direction:direction});
    ['offer-cta','final-cta-btn'].forEach(id => { const a = document.getElementById(id); if (a) a.href = destination; });
  }

  if (file === 'riskproof-course-page.html') {
    document.querySelectorAll('a.btn-primary').forEach(a => a.href = queryLink('riskproof-spasibo-page.html', {product:'course', direction:'podrostok'}));
  }

  if (/riskproof-anketa(?:-finance|-proforientation)?-page\.html/.test(file)) {
    const button = document.querySelector('.submit-block button');
    if (button) button.addEventListener('click', e => { e.preventDefault(); window.location.href = queryLink('riskproof-spasibo-page.html', {product:'anketa', direction:direction}); });
  }

  if (file === 'riskproof-spasibo-page.html') {
    const product = params.get('product') || 'course';
    const pill = document.querySelector(`.demo-pill[data-type="${product}"]`); if (pill) pill.click();
    const action = document.getElementById('action-btn');
    if (product === 'course') action.href = 'riskproof-course-page.html';
    else if (product === 'razbor') action.href = anketaLink(direction);
    else if (product === 'checklist') action.href = queryLink('riskproof-checklist-page.html', {direction:direction});
    else if (product === 'result') {
      document.getElementById('thanks-title').textContent = 'Расшифровка результата отправлена';
      document.getElementById('thanks-lede').textContent = 'Письмо с результатом и краткими рекомендациями уже готовится. Если его не видно, проверьте папку «Спам».';
      document.getElementById('action-title').textContent = 'Продолжить по направлению';
      document.getElementById('action-sub').textContent = directionData.title;
      action.textContent = 'Посмотреть материалы'; action.href = directionData.page;
      document.getElementById('thanks-note').textContent = 'Результат теста остаётся доступен в текущем браузере, пока открыта вкладка.';
    }
    else if (product === 'anketa') {
      document.getElementById('thanks-title').textContent = 'Спасибо! Анкета отправлена';
      document.getElementById('thanks-lede').textContent = 'Ответы сохранены. Ольга изучит вашу ситуацию и подготовит следующий шаг в оговорённый срок.';
      document.getElementById('action-title').textContent = 'Вернуться к направлению';
      document.getElementById('action-sub').textContent = directionData.title;
      action.textContent = 'Вернуться'; action.href = directionData.page;
      document.getElementById('thanks-note').textContent = 'Сохраните эту страницу как подтверждение отправки анкеты.';
    }
  }

  document.querySelectorAll('.footer-links a').forEach(a => {
    if (a.getAttribute('href') === '#') {
      a.href = home + '#author';
      a.title = 'Отдельная целевая страница отсутствует в исходном комплекте';
      a.dataset.fallback = 'missing-page';
    }
  });
  document.querySelectorAll('a[href="#"]').forEach(a => {
    a.href = home;
    a.title = a.title || 'Целевая страница отсутствует — переход на главную';
    a.dataset.fallback = 'missing-page';
  });
})();
