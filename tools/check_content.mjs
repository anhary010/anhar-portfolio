// Validates site/js/content.js: EN/AR parity, image slugs, project count.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'site/js/content.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site/img/manifest.json'), 'utf8'));
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const C = ctx.window.CONTENT;
const errors = [];
let pairs = 0;

function walk(node, trail) {
  if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${trail}[${i}]`));
  if (node && typeof node === 'object') {
    const keys = Object.keys(node);
    if (keys.includes('en') || keys.includes('ar')) {
      pairs++;
      for (const l of ['en', 'ar']) {
        const v = node[l];
        const ok = Array.isArray(v) ? v.length && v.every(s => typeof s === 'string' && s.trim()) : typeof v === 'string' && v.trim();
        if (!ok) errors.push(`${trail}.${l} missing/empty`);
      }
      if (Array.isArray(node.en) && Array.isArray(node.ar) && node.en.length !== node.ar.length) errors.push(`${trail} en/ar paragraph count differs`);
      return;
    }
    for (const k of keys) walk(node[k], `${trail}.${k}`);
  }
}
function img(slug, trail) { if (!manifest[slug]) errors.push(`${trail}: unknown image slug "${slug}"`); }

if (!C) errors.push('window.CONTENT not defined');
else {
  for (const l of ['en', 'ar']) if (!C.ui?.[l]) errors.push(`ui.${l} missing`);
  if (C.ui?.en && C.ui?.ar) {
    const ke = Object.keys(C.ui.en).sort(), ka = Object.keys(C.ui.ar).sort();
    if (ke.join() !== ka.join()) errors.push(`ui key mismatch: en-only ${ke.filter(k => !ka.includes(k))} ar-only ${ka.filter(k => !ke.includes(k))}`);
    for (const k of ke) { const a = C.ui.en[k], b = C.ui.ar[k]; if (Array.isArray(a) !== Array.isArray(b) || (Array.isArray(a) && a.length !== b.length)) errors.push(`ui.${k} shape differs`); if ((Array.isArray(a) ? a : [a]).some(s => !String(s).trim()) || (Array.isArray(b) ? b : [b]).some(s => !String(s).trim())) errors.push(`ui.${k} empty`); }
  }
  if (!Array.isArray(C.projects) || C.projects.length !== 9) errors.push(`projects.length = ${C.projects?.length}, want 9`);
  const slugs = new Set();
  (C.projects || []).forEach((p, i) => {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug || '')) errors.push(`projects[${i}].slug not kebab-case: ${p.slug}`);
    if (slugs.has(p.slug)) errors.push(`duplicate slug ${p.slug}`); slugs.add(p.slug);
    if (!p.year) errors.push(`projects[${i}].year missing`);
    img(p.cover, `projects[${i}].cover`); (p.images || []).forEach((s, j) => img(s, `projects[${i}].images[${j}]`));
    walk({ title: p.title, role: p.role, blurb: p.blurb, tag: p.tag, body: p.body, facts: p.facts }, `projects[${i}]`);
  });
  (C.practice || []).forEach((p, i) => { img(p.image, `practice[${i}].image`); walk(p, `practice[${i}]`); });
  if ((C.practice || []).length !== 4) errors.push('practice must have 4 items');
  (C.recognition || []).forEach((r, i) => { if (r.image) img(r.image, `recognition[${i}].image`); walk(r, `recognition[${i}]`); });
  (C.journey || []).forEach((j, i) => walk(j, `journey[${i}]`));
  (C.playground || []).forEach((s, i) => img(s, `playground[${i}]`));
}
if (errors.length) { console.error('FAIL\n' + errors.map(e => ' - ' + e).join('\n')); process.exit(1); }
console.log(`PASS: ${C.projects.length} projects, ${pairs} en/ar pairs, ${C.practice.length} practice, ${C.recognition.length} recognition, ${C.journey.length} journey, ${C.playground.length} playground`);
