/* Pure string templates shared by the browser (main.js) and the prerender tool. */
(function (root) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const t = (o, l) => esc(o[l] ?? o.en);
  const img = (slug, alt = '', cls = '', lazy = true) => `<img class="${cls}" src="img/${slug}.jpg" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`;

  const TPL = {
    card(p, i, l, ui) {
      return `<article class="stack__card" data-slug="${p.slug}" style="--i:${i + 1}">
  <a class="stack__link" href="#project/${p.slug}" aria-label="${esc(ui['ui.open'])}: ${t(p.title, l)}">
    <div class="stack__media">${img(p.cover, t(p.title, l), 'stack__img', i > 1)}<div class="stack__overlay"></div></div>
    <div class="stack__content">
      <div class="stack__top"><h3 class="stack__title">${t(p.title, l)}</h3><span class="stack__year">${esc(p.year)}</span></div>
      <div class="stack__bottom"><p class="stack__blurb">${t(p.blurb, l)}</p><span class="chip">${t(p.tag, l)}</span></div>
    </div>
  </a>
</article>`;
    },
    practice(items, l) {
      return `<div class="practice__list reveal">${items.map((p, i) => `
  <div class="practice__item" data-i="${i}" tabindex="0"><h3 class="practice__name">${t(p.title, l)}</h3><p class="practice__line">${t(p.line, l)}</p><div class="hairline"></div></div>`).join('')}
</div>
<div class="practice__imgs" aria-hidden="true">${items.map((p, i) => img(p.image, '', `practice__img`, true).replace('<img ', `<img data-i="${i}" `)).join('')}</div>`;
    },
    recognition(items, l) {
      return items.map((r, i) => `<li class="recog__item" data-i="${i}">
  ${r.image ? `<div class="recog__media">${img(r.image, t(r.title, l), 'recog__img')}</div>` : '<div class="recog__media recog__media--empty"><span>★</span></div>'}
  <h3 class="recog__title">${t(r.title, l)}</h3><p class="recog__meta">${t(r.meta, l)}</p>
</li>`).join('');
    },
    journey(items, l) {
      return items.map(j => `<li class="journey__item reveal"><span class="journey__years">${esc(j.years)}</span><div><h3 class="journey__title">${t(j.title, l)}</h3><p class="journey__org">${t(j.org, l)}</p></div></li>`).join('');
    },
    playground(slugs) {
      return slugs.map(s => `<figure class="play__tile">${img(s, '', 'play__img')}</figure>`).join('');
    },
    footerGrid(slugs) {
      return slugs.map(s => img(s, '', 'footer__tile')).join('');
    },
    panelBody(p, l, ui) {
      const lang_ = l;
      const facts = (p.facts || []).map(f => `<div class="panel__fact"><dt>${t(f.k, l)}</dt><dd>${t(f.v, l)}</dd></div>`).join('');
      return `<p class="panel__tag">${t(p.tag, l)}</p>
<h2 class="panel__title">${t(p.title, l)}</h2>
<dl class="panel__facts"><div class="panel__fact"><dt>${esc(ui['panel.role'])}</dt><dd>${t(p.role, l)}</dd></div><div class="panel__fact"><dt>${esc(ui['panel.year'])}</dt><dd>${esc(p.year)}</dd></div>${facts}</dl>
<div class="panel__text">${(p.body[l] || p.body.en).map(s => `<p>${esc(s)}</p>`).join('')}</div>
${(p.links || []).length ? `<div class="panel__links">${p.links.map(l => `<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener">${t(l.label, lang_)}</a>`).join('')}</div>` : ''}
${p.images.length ? `<div class="panel__strip">${p.images.map(s => `<figure>${img(s, t(p.title, l), 'panel__strip-img')}</figure>`).join('')}</div>` : ''}`;
    }
  };
  root.TPL = TPL;
})(typeof window !== 'undefined' ? window : globalThis);
