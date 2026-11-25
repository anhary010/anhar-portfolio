// Injects EN markup from content.js + templates.js into site/index.html between <!-- @name --> markers,
// so the page reads without JavaScript. Idempotent.
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'site/js/content.js'), 'utf8'), ctx);
vm.runInNewContext(fs.readFileSync(path.join(root, 'site/js/templates.js'), 'utf8'), ctx);
const C = ctx.window.CONTENT, T = ctx.window.TPL, ui = C.ui.en, l = 'en';
const blocks = {
  cards: C.projects.map((p, i) => T.card(p, i, l, ui)).join('\n'),
  practice: T.practice(C.practice, l),
  recognition: T.recognition(C.recognition, l),
  journey: T.journey(C.journey, l),
  playground: T.playground(C.playground),
  footergrid: T.footerGrid(C.playground.slice(0, 8)),
};
const file = path.join(root, 'site/index.html');
let html = fs.readFileSync(file, 'utf8');
for (const [k, v] of Object.entries(blocks)) {
  const re = new RegExp(`(<!-- @${k} -->)[\\s\\S]*?(<!-- /@${k} -->)`);
  if (!re.test(html)) { console.error('marker missing:', k); process.exit(1); }
  html = html.replace(re, `$1\n${v}\n$2`);
}
// data-i18n text fill for EN
html = html.replace(/(<[^>]*data-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/)/g, (m, open, key, inner, close) => {
  const v = ui[key]; if (v === undefined || Array.isArray(v)) return m; return open + v.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) + close;
});
fs.writeFileSync(file, html);
console.log('prerendered', Object.keys(blocks).join(', '));
