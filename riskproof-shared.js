(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const file = window.location.pathname.split('/').pop() || 'riskproof-concept.html';
  const data = window.RiskProofData && window.RiskProofData.directions;
  if (!data) return;

  const byFile = {
    'riskproof-podrostok-page.html': 'podrostok',
    'riskproof-ustoichivost-page.html': 'ustoichivost',
    'riskproof-finance-page.html': 'finance',
    'riskproof-proforientation-page.html': 'proforientation'
  };
  const direction = params.get('direction') || params.get('type') || byFile[file] || 'podrostok';
  const directionData = data[direction] || data.podrostok;
  const home = 'riskproof-concept.html';
  const queryLink = (target, values, hash) => {
    const query = new URLSearchParams(values || {}).toString();
    return target + (query ? `?${query}` : '') + (hash || '');
  };
  const testLink = d => queryLink('riskproof-test-page.html', { direction: d });
  const offerLink = (type, d) => queryLink('riskproof-offer-template-page.html', { type, direction: d });
  const anketaLink = d => d === 'finance'
    ? 'riskproof-anketa-finance-page.html'
    : d === 'proforientation' ? 'riskproof-anketa-proforientation-page.html' : 'riskproof-anketa-page.html';
  const courseFile = {
    podrostok: 'riskproof-course-page.html',
    ustoichivost: 'riskproof-course-ustoichivost-page.html',
    finance: 'riskproof-course-finance-page.html',
    proforientation: 'riskproof-course-proforientation-page.html'
  };
  const thanksLink = (product, d) => queryLink('riskproof-spasibo-page.html', { product, direction: d });

  if (!document.querySelector('link[rel="icon"]')) {
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="%232B1E1A"/><text x="50" y="62" text-anchor="middle" font-size="38" font-family="serif" fill="%23FDF7F2">RP</text></svg>';
    document.head.appendChild(icon);
  }

  document.querySelectorAll('.logo').forEach(logo => {
    logo.dataset.homeLink = 'true';
    logo.tabIndex = 0;
    logo.setAttribute('role', 'link');
    logo.setAttribute('aria-label', 'На главную RiskProof');
    const goHome = () => { window.location.href = home; };
    logo.addEventListener('click', goHome);
    logo.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); goHome(); }
    });
  });
  document.querySelectorAll('.breadcrumb a').forEach(link => { link.href = home; });

  if (file === 'riskproof-concept.html') {
    ['podrostok', 'ustoichivost', 'finance', 'proforientation'].forEach((d, index) => {
      const card = document.querySelectorAll('.dir-card')[index];
      if (!card || !data[d]) return;
      card.dataset.href = data[d].page;
      card.tabIndex = 0;
      card.setAttribute('role', 'link');
      const heading = card.querySelector('h3');
      if (heading && !heading.querySelector('a')) heading.innerHTML = `<a href="${data[d].page}">${heading.textContent}</a>`;
      const test = card.querySelector('.btn-text');
      if (test) test.href = testLink(d);
      const go = event => { if (!event.target.closest('a,button')) window.location.href = data[d].page; };
      card.addEventListener('click', go);
      card.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a,button')) {
          event.preventDefault(); window.location.href = data[d].page;
        }
      });
    });
  }

  document.querySelectorAll('a[href="#test"], section#test a.btn, section[id="test"] a.btn').forEach(link => {
    link.href = testLink(direction);
  });

  document.querySelectorAll('.product-row').forEach(row => {
    const panel = row.closest('.lineup-panel');
    const currentDirection = panel?.dataset.panel || direction;
    const kicker = row.querySelector('.kicker')?.textContent || '';
    const link = row.querySelector('a.btn');
    if (!link) return;
    if (/Тест/i.test(kicker)) link.href = testLink(currentDirection);
    else if (/Чек-лист/i.test(kicker)) link.href = queryLink('riskproof-checklist-page.html', { direction: currentDirection });
    else if (/Персональный разбор/i.test(kicker)) link.href = offerLink('razbor', currentDirection);
    else if (/Стратегическая сессия/i.test(kicker)) link.href = offerLink('session', currentDirection);
    else if (/Индивидуальн/i.test(kicker)) link.href = offerLink('individual', currentDirection);
    else if (/Курс/i.test(kicker)) link.href = courseFile[currentDirection];
  });

  if (file === 'riskproof-test-page.html') {
    document.title = `Тест «${directionData.testTitle}» — RiskProof`;
    const exit = document.querySelector('.exit-link');
    if (exit) exit.href = directionData.page;
  }

  if (file === 'riskproof-result-page.html') {
    document.title = `Результат теста «${directionData.testTitle}» — RiskProof`;
    const zone = params.get('zone') || 'green';
    const resultCta = document.getElementById('result-cta');
    if (resultCta) resultCta.href = zone === 'red2'
      ? offerLink('session', direction)
      : zone === 'red1' ? offerLink('razbor', direction) : `${directionData.page}#products`;
    const otherDirections = Object.keys(data).filter(d => d !== direction);
    document.querySelectorAll('.crosssell-card').forEach((card, index) => {
      const nextDirection = otherDirections[index];
      if (!nextDirection) return;
      card.href = testLink(nextDirection);
      const heading = card.querySelector('h4');
      if (heading) heading.textContent = data[nextDirection].title;
    });
    const emailForm = document.querySelector('.email-capture-form');
    if (emailForm) emailForm.addEventListener('submit', event => {
      event.preventDefault(); window.location.href = thanksLink('result', direction);
    });
  }

  if (file === 'riskproof-checklist-page.html') {
    const checklistHeading = document.querySelector('h1')?.textContent?.trim();
    if (checklistHeading) document.title = `Чек-лист «${checklistHeading}» — RiskProof`;
    const crossCta = document.getElementById('cross-cta');
    if (crossCta) crossCta.href = testLink(direction);
    const emailForm = document.querySelector('.email-form-row');
    if (emailForm) emailForm.addEventListener('submit', event => {
      event.preventDefault(); window.location.href = thanksLink('checklist', direction);
    });
  }

  if (file === 'riskproof-offer-template-page.html') {
    const type = params.get('type') || 'razbor';
    const offerTitles = {
      razbor: 'Персональный разбор ситуации',
      session: 'Стратегическая сессия',
      individual: 'Индивидуальное сопровождение'
    };
    document.title = `${offerTitles[type] || offerTitles.razbor} — RiskProof`;
    document.querySelectorAll('.hero-kicker').forEach(el => { el.textContent = `Направление · ${directionData.title}`; });
    const product = ['razbor', 'session', 'individual'].includes(type) ? type : 'razbor';
    const destination = thanksLink(product, direction);
    ['offer-cta', 'final-cta-btn'].forEach(id => {
      const link = document.getElementById(id);
      if (link) link.href = destination;
    });
  }

  if (file === 'riskproof-course-page.html' || file === 'riskproof-course-ustoichivost-page.html' ||
      file === 'riskproof-course-finance-page.html' || file === 'riskproof-course-proforientation-page.html') {
    const courseDirection = byFile[file.replace('riskproof-course-', 'riskproof-').replace('-page.html', '-page.html')] ||
      (file.includes('finance') ? 'finance' : file.includes('proforientation') ? 'proforientation' : file.includes('ustoichivost') ? 'ustoichivost' : 'podrostok');
    document.querySelectorAll('a.btn-primary').forEach(link => {
      link.href = thanksLink('course', courseDirection);
    });
  }

  if (/riskproof-anketa(?:-finance|-proforientation)?-page\.html/.test(file)) {
    const submit = document.querySelector('.submit-block button');
    if (submit) submit.addEventListener('click', event => {
      event.preventDefault(); window.location.href = thanksLink('anketa', direction);
    });
  }

  if (file === 'riskproof-spasibo-page.html') {
    const product = params.get('product') || params.get('service') || 'course';
    const eyebrow = document.querySelector('main .eyebrow');
    const title = document.getElementById('thanks-title');
    const lede = document.getElementById('thanks-lede');
    const actionTitle = document.getElementById('action-title');
    const actionSub = document.getElementById('action-sub');
    const action = document.getElementById('action-btn');
    const note = document.getElementById('thanks-note');
    const states = {
      course: { eyebrow: 'Доступ к материалам', title: 'Спасибо! Материалы готовы', lede: 'После подключения оплаты доступ к материалам будет отправлен на вашу почту.', actionTitle: 'Открыть курс', actionSub: 'Материалы RiskProof', actionText: 'Перейти к курсу', href: courseFile[direction], note: 'Если письмо не пришло в течение нескольких минут, проверьте папку «Спам».' },
      razbor: { eyebrow: 'Заявка принята', title: 'Спасибо! Анкета отправлена', lede: 'Ответы получены. Следующий шаг — заполнить короткую анкету по выбранному направлению.', actionTitle: 'Заполнить анкету', actionSub: '12 вопросов · 10–15 минут', actionText: 'Перейти к анкете', href: anketaLink(direction), note: 'Сохраните эту страницу как подтверждение отправки заявки.' },
      checklist: { eyebrow: 'Чек-лист готовится', title: 'Спасибо! Запрос принят', lede: 'Ссылка на чек-лист появится после подключения формы выдачи материалов.', actionTitle: 'Продолжить диагностику', actionSub: directionData.title, actionText: 'Пройти тест', href: testLink(direction), note: 'Пока email-выдача не подключена, тест остаётся доступен без регистрации.' },
      result: { eyebrow: 'Результат теста отправлен', title: 'Расшифровка результата готовится', lede: 'Письмо с результатом и рекомендациями будет отправлено после подключения email-сервиса.', actionTitle: 'Продолжить по направлению', actionSub: directionData.title, actionText: 'Посмотреть материалы', href: directionData.page, note: 'Результат теста остаётся доступен в текущей вкладке.' },
      anketa: { eyebrow: 'Анкета отправлена', title: 'Спасибо! Анкета получена', lede: 'Ответы сохранены в рамках текущего сценария. Ольга изучит вашу ситуацию и подготовит следующий шаг.', actionTitle: 'Вернуться к направлению', actionSub: directionData.title, actionText: 'Вернуться', href: directionData.page, note: 'Сохраните эту страницу как подтверждение отправки анкеты.' },
      session: { eyebrow: 'Заявка на сессию', title: 'Следующий шаг — связаться с Ольгой', lede: 'Стратегическая сессия требует согласования формата и времени напрямую.', actionTitle: 'Связаться в Telegram', actionSub: directionData.title, actionText: 'Открыть Telegram', href: 'https://t.me/riskproof', note: 'Ссылка откроется в новом окне.' },
      individual: { eyebrow: 'Заявка на сопровождение', title: 'Следующий шаг — связаться с Ольгой', lede: 'Индивидуальное сопровождение согласуется после короткого знакомства с вашей ситуацией.', actionTitle: 'Связаться в Telegram', actionSub: directionData.title, actionText: 'Открыть Telegram', href: 'https://t.me/riskproof', note: 'Ссылка откроется в новом окне.' }
    };
    const state = states[product] || states.course;
    if (eyebrow) eyebrow.textContent = state.eyebrow;
    if (title) title.textContent = state.title;
    if (lede) lede.textContent = state.lede;
    if (actionTitle) actionTitle.textContent = state.actionTitle;
    if (actionSub) actionSub.textContent = state.actionSub;
    if (action) { action.textContent = state.actionText; action.href = state.href; if (state.href.startsWith('http')) action.target = '_blank'; }
    if (note) note.textContent = state.note;
  }

  document.querySelectorAll('input[type="email"]').forEach(input => {
    input.required = true;
    input.setAttribute('autocomplete', 'email');
  });
  document.querySelectorAll('.footer-links a[href="#"]').forEach(link => {
    const label = link.textContent.trim().toLowerCase();
    if (label.includes('telegram')) { link.href = 'https://t.me/riskproof'; link.target = '_blank'; }
    else if (label.includes('оферт')) link.href = 'riskproof-oferta.html';
    else if (label.includes('политик') || label.includes('данн')) link.href = 'riskproof-policy.html';
    else { link.href = home + '#author'; link.dataset.fallback = 'missing-page'; }
  });
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.href = home;
    link.dataset.fallback = 'missing-page';
  });
})();
