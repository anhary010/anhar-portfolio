/* Render text + lists from CONTENT for the current language; language toggle; mobile menu; recognition slider. */
(function () {
  const C = window.CONTENT, T = window.TPL;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;

  function render(lang) {
    const ui = C.ui[lang] || C.ui.en;
    html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => { const v = ui[el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-list]').forEach(el => {
      const v = ui[el.dataset.i18nList]; if (!Array.isArray(v)) return;
      const lis = $$('li', el); v.forEach((s, i) => { if (lis[i]) lis[i].textContent = s; });
    });
    const tog = $('#langToggle'); if (tog) tog.setAttribute('aria-label', ui['lang.label']);
    $$('.ghost').forEach(g => { g.textContent = lang === 'ar' ? (g.dataset.ghostAr || 'أنهار أنهار أنهار أنهار') : Array(4).fill(g.dataset.ghost).join(' '); });
    // Cards: update text in place (keep DOM nodes for ScrollTrigger); create if missing.
    const stack = $('#stack');
    if (stack && !$('.stack__card', stack)) stack.innerHTML = C.projects.map((p, i) => T.card(p, i, lang, ui)).join('');
    else C.projects.forEach(p => {
      const card = $(`.stack__card[data-slug="${p.slug}"]`); if (!card) return;
      const tx = o => o[lang] || o.en;
      $('.stack__title', card).textContent = tx(p.title); $('.stack__blurb', card).textContent = tx(p.blurb);
      $('.chip', card).textContent = tx(p.tag); $('.stack__link', card).setAttribute('aria-label', `${ui['ui.open']}: ${tx(p.title)}`);
      $('.stack__img', card).alt = tx(p.title);
    });
    const pg = $('#practiceGrid'); if (pg) pg.innerHTML = T.practice(C.practice, lang);
    const rt = $('#recogTrack'); if (rt) rt.innerHTML = T.recognition(C.recognition, lang);
    const jl = $('#journeyList'); if (jl) jl.innerHTML = T.journey(C.journey, lang);
    // Re-created nodes lost their reveal state: once motion has started (or is off), show them straight away.
    if (html.classList.contains('motion-ready') || html.classList.contains('no-motion')) $$('.reveal', pg || document).concat($$('.reveal', jl || document)).forEach(el => el.classList.add('is-in'));
    const ps = $('#playStrip'); if (ps && !ps.children.length) ps.innerHTML = T.playground(C.playground);
    const fg = $('#footerGrid'); if (fg && !fg.children.length) fg.innerHTML = T.footerGrid(C.playground.slice(0, 8));
    document.title = lang === 'ar' ? 'أنهار المالكي — ممارسة تقييمية / فراغية / أرشيفية' : 'Anhar Almalki — Curatorial / Spatial / Archival Practice';
    html.classList.add('is-rendered');
    if (window.PANEL) window.PANEL.rerender();
    window.dispatchEvent(new CustomEvent('anhar:rendered', { detail: { lang } }));
  }

  function setLang(lang) {
    try { localStorage.setItem('anhar-lang', lang); } catch (e) {}
    render(lang);
    if (window.MOTION) window.MOTION.refresh();
    if (window.PANEL) window.PANEL.rerender();
  }

  function currentLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ar' || q === 'en') return q;
    try { const s = localStorage.getItem('anhar-lang'); if (s === 'ar' || s === 'en') return s; } catch (e) {}
    return 'en';
  }

  function initUI() {
    $('#langToggle')?.addEventListener('click', () => setLang(html.lang === 'ar' ? 'en' : 'ar'));
    const burger = $('.nav__burger'), menu = $('#mobileMenu');
    burger?.addEventListener('click', () => { const open = burger.getAttribute('aria-expanded') === 'true'; burger.setAttribute('aria-expanded', String(!open)); menu.hidden = open; document.body.classList.toggle('menu-open', !open); });
    menu?.addEventListener('click', e => { if (e.target.tagName === 'A') burger.click(); });
    // recognition slider
    const track = $('#recogTrack');
    $$('.recog__btn').forEach(b => b.addEventListener('click', () => {
      const w = track.firstElementChild?.getBoundingClientRect().width || 300; const dir = (html.dir === 'rtl' ? -1 : 1) * Number(b.dataset.dir);
      track.scrollBy({ left: dir * (w + 24), behavior: 'smooth' });
    }));
  }

  window.render = render; window.setLang = setLang;
  // This script sits at the end of <body>, so the DOM above it is parsed: run now, do not wait for deferred/async scripts.
  html.classList.add('js'); render(currentLang()); initUI();
  // Safety net: if the motion library never arrives (blocked CDN, slow network), show everything.
  setTimeout(() => { if (!html.classList.contains('motion-ready')) { html.classList.add('motion-ready', 'no-motion'); $$('.reveal, .footer__tile').forEach(el => el.classList.add('is-in')); } }, 1800);
})();
