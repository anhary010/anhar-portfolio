/* Project panel: FLIP open from the card image, hash routing, focus trap, ESC to close. */
(function () {
  const C = window.CONTENT, T = window.TPL;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement, panel = $('#panel');
  if (!panel) return;
  const sheet = $('.panel__sheet', panel), media = $('.panel__media', panel), body = $('#panelBody'), closeBtn = $('.panel__close', panel), nextBtn = $('.panel__next', panel);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = null, lastFocus = null, movedImg = null, homeCard = null, placeholder = null, openId = 0;

  const lang = () => html.lang === 'ar' ? 'ar' : 'en';
  const ui = () => C.ui[lang()];
  const bySlug = slug => C.projects.find(p => p.slug === slug);

  function fill(p) {
    body.innerHTML = T.panelBody(p, lang(), ui());
    $('.panel__title', body).id = 'panelTitle';
    const i = C.projects.indexOf(p), next = C.projects[(i + 1) % C.projects.length];
    nextBtn.href = `#project/${next.slug}`; nextBtn.textContent = `${ui()['panel.next']}: ${next.title[lang()] || next.title.en}`;
    closeBtn.textContent = ui()['panel.close'];
  }

  function open(slug, fromCard) {
    const p = bySlug(slug); if (!p) return;
    if (current === slug) return;
    openId++;
    if (current) { // swap in place (Next project / hash change while open)
      restoreImage(); current = slug; fill(p);
      media.innerHTML = ''; const img = document.createElement('img'); img.src = `img/${p.cover}.jpg`; img.alt = p.title[lang()] || p.title.en; media.appendChild(img);
      sheet.scrollTop = 0;
      if (!reduce && window.gsap) gsap.fromTo([media, ...body.children, nextBtn], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, stagger: .04, ease: 'power3.out' });
      if (location.hash !== `#project/${slug}`) history.pushState(null, '', `#project/${slug}`);
      return;
    }
    current = slug; lastFocus = document.activeElement;
    fill(p);
    panel.hidden = false; document.body.classList.add('panel-open'); sheet.scrollTop = 0;
    const card = fromCard || $(`.stack__card[data-slug="${slug}"]`);
    const cardImg = card && $('.stack__img', card);
    media.innerHTML = '';
    const canFlip = !reduce && window.gsap && window.Flip && cardImg && cardImg.getBoundingClientRect().height > 0 && isInViewport(cardImg);
    if (canFlip) {
      const state = Flip.getState(cardImg);
      placeholder = document.createElement('div'); placeholder.className = 'stack__img stack__img--ph'; placeholder.style.background = '#000';
      cardImg.replaceWith(placeholder); media.appendChild(cardImg); movedImg = cardImg; homeCard = card;
      gsap.set([sheet], { opacity: 0 }); gsap.set(media, { opacity: 1 });
      gsap.set(panel.querySelector('.panel__backdrop'), { opacity: 0 });
      gsap.to(panel.querySelector('.panel__backdrop'), { opacity: 1, duration: .5 });
      gsap.to(sheet, { opacity: 1, duration: .5, delay: .15 });
      Flip.from(state, { duration: .8, ease: 'power3.inOut', absolute: true, scale: false });
      gsap.fromTo([body.children, nextBtn], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7, stagger: .05, delay: .4, ease: 'power3.out' });
    } else {
      const img = document.createElement('img'); img.src = `img/${p.cover}.jpg`; img.alt = p.title[lang()] || p.title.en; media.appendChild(img);
      if (!reduce && window.gsap) { gsap.fromTo(sheet, { opacity: 0 }, { opacity: 1, duration: .45 }); gsap.fromTo([body.children, nextBtn], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7, stagger: .05, delay: .2, ease: 'power3.out' }); }
      else { sheet.style.opacity = 1; }
    }
    panel.classList.add('is-open');
    if (location.hash !== `#project/${slug}`) history.pushState(null, '', `#project/${slug}`);
    setTimeout(() => closeBtn.focus(), 50);
  }

  function isInViewport(el) { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }

  function restoreImage() {
    if (movedImg && placeholder) { placeholder.replaceWith(movedImg); gsap && gsap.set(movedImg, { clearProps: 'all' }); }
    movedImg = null; placeholder = null; homeCard = null;
  }

  function close(opts = {}) {
    if (!current) return;
    const myId = ++openId;
    const finish = () => { if (myId !== openId) return; restoreImage(); panel.hidden = true; panel.classList.remove('is-open'); document.body.classList.remove('panel-open'); current = null; if (lastFocus && lastFocus.focus) lastFocus.focus(); };
    if (!opts.silent && location.hash.startsWith('#project/')) history.pushState(null, '', location.pathname + location.search + '#projects');
    if (!reduce && window.gsap && window.Flip && movedImg && placeholder) {
      const state = Flip.getState(movedImg);
      placeholder.replaceWith(movedImg); const ph = placeholder; placeholder = null;
      gsap.to(sheet, { opacity: 0, duration: .35 }); gsap.to(panel.querySelector('.panel__backdrop'), { opacity: 0, duration: .5, delay: .2 });
      Flip.from(state, { duration: .6, ease: 'power3.inOut', absolute: true, onComplete: () => { gsap.set(movedImg, { clearProps: 'all' }); movedImg = null; finish(); } });
    } else if (!reduce && window.gsap) {
      gsap.to(sheet, { opacity: 0, duration: .3, onComplete: finish });
    } else finish();
  }

  function rerender() { if (current) { const p = bySlug(current); fill(p); } }

  function route() {
    const m = location.hash.match(/^#project\/([a-z0-9-]+)$/);
    if (m && bySlug(m[1])) open(m[1]); else if (current) close({ silent: true });
  }

  // Events
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#project/"]'); if (!a) return;
    e.preventDefault(); const slug = a.getAttribute('href').slice(9);
    const card = a.closest('.stack__card');
    open(slug, card);
  });
  closeBtn.addEventListener('click', () => close());
  panel.querySelector('.panel__backdrop').addEventListener('click', () => close());
  document.addEventListener('keydown', e => {
    if (!current) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') { const f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', panel).filter(el => !el.hidden); if (!f.length) return; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });
  window.addEventListener('hashchange', route);
  window.PANEL = { open, close, rerender };
  // Route only after main.js has rendered the language, so a deep link opens in the right language.
  if (html.classList.contains('is-rendered')) route();
  else window.addEventListener('anhar:rendered', route, { once: true });
})();
