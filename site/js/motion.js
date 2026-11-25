/* Beauté-style motion: hero entrance, ghost marquee scrub, reveals, stacked cards, practice hover, footer flip. */
(function () {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let inited = false;

  function showEverything() {
    html.classList.add('motion-ready', 'no-motion');
    $$('.reveal, .footer__tile').forEach(el => el.classList.add('is-in'));
    $$('.practice__img[data-i="0"]').forEach(el => el.classList.add('is-on'));
  }

  function bindPracticeHover() {
    const items = $$('.practice__item'), imgs = $$('.practice__img');
    if (!items.length) return;
    const on = i => { imgs.forEach(im => im.classList.toggle('is-on', im.dataset.i === String(i))); items.forEach(it => it.style.opacity = it.dataset.i === String(i) ? '1' : '.4'); };
    const off = () => { imgs.forEach(im => im.classList.toggle('is-on', im.dataset.i === '0')); items.forEach(it => it.style.opacity = '1'); };
    items.forEach(it => { it.addEventListener('mouseenter', () => on(it.dataset.i)); it.addEventListener('focus', () => on(it.dataset.i)); it.addEventListener('mouseleave', off); it.addEventListener('blur', off); });
    off();
  }

  function init() {
    if (inited) return; inited = true;
    if (reduce || !window.gsap || !window.ScrollTrigger) { showEverything(); bindPracticeHover(); return; }
    gsap.registerPlugin(ScrollTrigger);
    html.classList.add('motion-ready');

    // Hero entrance
    const heroImg = $('.hero__img'), heroTags = $('.hero__tags'), holder = $('.hero__img-holder');
    gsap.set(heroImg, { transformPerspective: 1500 });
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(heroImg, { opacity: 0, y: 250, rotateY: 45 }, { opacity: 1, y: 0, rotateY: 0, duration: 1.2 }, 0.1)
      .fromTo(heroTags, { opacity: 0, y: 120 }, { opacity: 1, y: 0, duration: 1 }, 0.4);
    gsap.to(holder, { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Ghost marquees scrub horizontally with scroll
    $$('.ghost').forEach(g => {
      const rtl = html.dir === 'rtl';
      gsap.fromTo(g, { xPercent: rtl ? -20 : 0 }, { xPercent: rtl ? 0 : -20, ease: 'none', scrollTrigger: { trigger: g.closest('section, footer') || g, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Reveals
    $$('.reveal').forEach(el => {
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => {
        el.classList.add('is-in');
        if (el.classList.contains('reveal--stagger')) gsap.fromTo(el.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .06, ease: 'power3.out' });
      } });
    });

    // Stacked cards: as the next card covers this one, scale + dim the covered card
    const cards = $$('.stack__card');
    cards.forEach((card, i) => {
      const next = cards[i + 1]; if (!next) return;
      const link = $('.stack__link', card), overlay = $('.stack__overlay', card), content = $('.stack__content', card);
      const base = parseFloat(getComputedStyle(overlay).opacity) || .3;
      gsap.timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 4em', scrub: true } })
        .to(link, { scale: .96, ease: 'none' }, 0)
        .to(overlay, { opacity: Math.min(base + .3, .85), ease: 'none' }, 0)
        .to(content, { y: -20, ease: 'none' }, 0);
    });

    // Practice: image holder flips up on reveal, hover swaps images
    const imgs = $('.practice__imgs');
    if (imgs) gsap.fromTo(imgs, { rotateX: 85, opacity: 0, transformOrigin: '50% 100%' }, { rotateX: 0, opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.practice__grid', start: 'top 80%', once: true } });
    bindPracticeHover();

    // Footer tiles flip in
    const tiles = $$('.footer__tile');
    if (tiles.length) ScrollTrigger.create({ trigger: '.footer', start: 'top 75%', once: true, onEnter: () => {
      tiles.forEach(t => t.classList.add('is-in'));
      gsap.fromTo(tiles, { rotateX: i => (i % 2 ? 60 : -60), opacity: 0, transformPerspective: 1500 }, { rotateX: 0, opacity: .9, duration: 1, stagger: .08, ease: 'power3.out' });
    } });

    // Recognition items stagger in
    ScrollTrigger.create({ trigger: '.recog__track', start: 'top 85%', once: true, onEnter: () => gsap.fromTo('.recog__item', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, stagger: .08, ease: 'power3.out' }) });
  }

  function refresh() {
    if (!inited) return init();
    bindPracticeHover();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  window.MOTION = { init, refresh };
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(init, 0);
  else document.addEventListener('DOMContentLoaded', init);
  // Re-bind hover handlers after a language re-render replaces the practice grid.
  window.addEventListener('anhar:rendered', () => { if (inited) bindPracticeHover(); });
})();
