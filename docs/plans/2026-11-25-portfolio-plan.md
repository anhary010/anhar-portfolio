# Anhar Portfolio · Card · CV — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a bilingual (EN default / AR toggle) one-page portfolio that reproduces the Beauté template's motion on Anhar's content, a shareable digital business card (page + vCard + QR + PNG), and a redesigned 2-page CV PDF, all as static files publishable to GitHub Pages.

**Architecture:** Plain HTML/CSS/JS, no bundler. One `content.js` holds every string in EN and AR and the project data; `main.js` renders text, wires GSAP/ScrollTrigger motion, the FLIP project panels and the language toggle. Card and CV are separate HTML pages sharing the same CSS tokens; headless Chrome renders the CV PDF and the card PNG. Python (PyMuPDF/Pillow/segno) handles image export and the QR.

**Tech Stack:** HTML5, CSS (custom properties, logical properties for RTL), GSAP 3.12 + ScrollTrigger + Flip (cdnjs), Google Fonts (Anton, Inter, Cairo, IBM Plex Sans Arabic), Python 3 (fitz, PIL, segno), headless Google Chrome, Node (for the content parity check), git + GitHub Pages.

**Spec:** `/Users/anharalmalki/Desktop/anhar-portfolio/docs/2026-11-25-portfolio-design.md`

## Global Constraints
- Palette: bg `#d2d2ce`, ink `#2a2a29`, paragraph `#312823`, hairline `#312823` 1px, dark bands `#2a2a29`.
- Fonts: Anton (EN display), Cairo 800 (AR display), Inter (EN body), IBM Plex Sans Arabic (AR body).
- English is the default language; Arabic toggle sets `html[lang=ar][dir=rtl]`; choice persisted in `localStorage['anhar-lang']`.
- No facts outside: CV v02, Dossier-3, LinkedIn (read 2026-11-25), The Individual Apple files. The Individual Apple: year "2026", no venue.
- Images: max 1600 px wide, JPEG q82 (or WebP), B/W kept as is. Total `site/img` ≤ 12 MB.
- `prefers-reduced-motion: reduce` → no transforms, instant opacity only.
- Every external script from cdnjs.cloudflare.com; fonts only from fonts.googleapis.com.
- Contact: anharalmalki1@gmail.com · +966 53 440 2993 · linkedin.com/in/anhar-almalki- · instagram @Anhray12.
- Commit after each task; messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus
1. Phone width (375 px) with the Arabic toggle on: stacked cards, ghost marquee and hero must not overflow horizontally. → Task 5 step 6 (headless 375×812 screenshot in AR, `document.documentElement.scrollWidth === 375`).
2. Deep link `#project/the-individual-apple` on first load must open the panel without the FLIP source card being on screen. → Task 4 step 4.
3. `prefers-reduced-motion` users must still see all content (nothing stuck at opacity 0). → Task 3 step 7 (emulate reduced motion, assert no element with computed opacity 0 among `.reveal`).
4. Browsers without JS or where the CDN is blocked: content must be visible (render from server-side markup, GSAP only enhances). → Task 2 step 5 (open `index.html` with `--disable-javascript`-equivalent: screenshot with scripts removed).
5. vCard must import on iPhone and Android: `BEGIN:VCARD`, `VERSION:3.0`, CRLF line endings, `N;` and `FN;` with Arabic in UTF-8, `TEL;TYPE=CELL:+966534402993`. → Task 6 step 3.

---

### Task 0: Repository scaffold and asset export

**Files:**
- Create: `README.md`, `.gitignore`, `site/img/`, `card/`, `cv/`, `tools/export_assets.py`
- Create: `site/img/manifest.json` (produced by the script)

**Interfaces:**
- Produces: `site/img/<slug>.jpg` files and `manifest.json` `{ "<slug>": {"w":…, "h":…, "src":"dossier p11"} }`. Slugs used by later tasks: `hero-portrait`, `portrait-face`, `portrait-bench`, `texture-dark`, `hajj-gallery`, `wrth-install-1`, `wrth-install-2`, `documented-plan`, `documented-stone`, `documented-gallery`, `craft-hands`, `craft-tools`, `erasure-poster`, `erasure-visitor`, `mustahel-talk`, `mustahel-group`, `continuum-install-1`, `continuum-install-2`, `shawahid-logo`, `shawahid-orange`, `award-ceremony`, `apple-wallcards-1`, `apple-wallcards-2`, `apple-wallcards-3`, `apple-wallcard-braids`.

- [ ] Step 1: `git init` in `/Users/anharalmalki/Desktop/anhar-portfolio`; write `.gitignore` (`.DS_Store`, `tools/__pycache__`, `*.pdf` NOT ignored).
- [ ] Step 2: Write `tools/export_assets.py`: `export(src_pdf: str, page: int, xref: int | None, slug: str, max_w: int = 1600) -> dict` using fitz; for wall cards render pages 1, 2, 5, 9 at 150 dpi (no xref). Map: hero-portrait←Dossier p11 xref 87; portrait-face←p2 46; portrait-bench←p1 42; texture-dark←p3 52; hajj-gallery←p10 83; wrth-install-1←p8 74; wrth-install-2←p8 75; documented-plan←p12 91; documented-stone←p12 92; documented-gallery←p13 97; craft-hands←p15 106; craft-tools←p15 108; erasure-poster←p17 116; erasure-visitor←p16 112; mustahel-talk←p19 126; mustahel-group←p19 124; continuum-install-1←p21 138; continuum-install-2←p21 139; shawahid-logo←p23 149; shawahid-orange←p23 150; award-ceremony←p5 60; apple-wallcards-1/2/3←Wall Cards-2 pages 1/2/5; apple-wallcard-braids←page 9.
- [ ] Step 3: Run `python3 tools/export_assets.py`; expected: 25 JPEGs in `site/img`, `manifest.json` with 25 keys, `du -sh site/img` ≤ 12M.
- [ ] Step 4: Write `README.md` (what each folder is, how to preview locally with `python3 -m http.server`, how to publish — filled in Task 8).
- [ ] Step 5: Commit `chore: scaffold project and export dossier assets`.

### Task 1: Content model (EN + AR) with parity check

**Files:**
- Create: `site/js/content.js`, `tools/check_content.mjs`

**Interfaces:**
- Produces: `window.CONTENT = { ui: {en:{…}, ar:{…}}, projects: [ {slug, year, tag:{en,ar}, title:{en,ar}, role:{en,ar}, blurb:{en,ar}, cover:"<img slug>", body:{en:[…paragraphs], ar:[…]}, images:[slugs], facts?:[{k:{en,ar}, v:{en,ar}}] } ], practice:[{title:{en,ar}, line:{en,ar}, image}], recognition:[{title:{en,ar}, meta:{en,ar}, image?}], journey:[{years, title:{en,ar}, org:{en,ar}}], playground:[slugs] }`.
- `ui` keys (exact): `nav.home nav.projects nav.practice nav.contact nav.cta hero.tags[4] about.caps about.quote about.btn1 about.btn2 works.heading works.list[4] practice.heading practice.intro recognition.heading recognition.sub journey.heading playground.heading playground.intro footer.open footer.email footer.phone footer.links footer.social footer.copy panel.close panel.next panel.role panel.year`.

- [ ] Step 1: Write `tools/check_content.mjs`: loads content.js in a vm, asserts every `{en,ar}` pair has both non-empty strings, every `cover`/`images` slug exists in `site/img/manifest.json`, `projects.length === 8`, slugs are unique and kebab-case. Exit 1 on failure.
- [ ] Step 2: Run `node tools/check_content.mjs` → FAIL (file missing).
- [ ] Step 3: Write `content.js`. Project order and English titles fixed by the spec §5.2; Arabic titles: التفاحة الفردية · وُثِّق فبقي · الحِرفة في تحوّل · ما بعد المحو · كونتينيوم ٢٦ · معرض الحج · معرض وِرث السنوي · مُستهل وشواهد. Body copy: lift verbatim from the dossier chapters (EN) and write AR in Anhar's LinkedIn register (first person, short sentences). The Individual Apple body = label-system case study per spec §5.4 + answer 1 (three layers, six spark colours with meanings, white vs coloured card, QR depth, register & schedule, eight works, *My Mother's Braids* 100×50 cm).
- [ ] Step 4: Run `node tools/check_content.mjs` → PASS, prints counts.
- [ ] Step 5: Commit `feat: bilingual content model`.

### Task 2: Static page, tokens, layout (no motion yet)

**Files:**
- Create: `site/index.html`, `site/css/style.css`, `site/js/main.js` (render only)

**Interfaces:**
- Produces: DOM hooks used by Task 3/4: `[data-i18n="<ui key>"]`, `.hero`, `.hero__img-holder`, `.hero__img`, `.hero__tags`, `.ghost` (marquee text, `data-ghost="ANHAR"`), `.reveal` (any element that enters on scroll), `.stack` + `.stack__card[data-slug]` (one per project, `--i` CSS var = index), `.practice__item[data-i]` + `.practice__img[data-i]`, `.footer__grid img`, `#panel` (empty dialog shell).
- `main.js` exports on window: `render(lang: 'en'|'ar'): void` (fills all `[data-i18n]`, builds cards/practice/recognition/journey/playground from CONTENT).

- [ ] Step 1: Write `index.html` with full server-side markup for the EN content of every section (so no-JS still reads); `<html lang="en" dir="ltr">`; fonts link; GSAP scripts deferred at the end.
- [ ] Step 2: Write `style.css`: `:root` tokens; `.nav` sticky 70px blur; hero min-height 100vh, `.ghost` Anton `clamp(180px, 32vw, 470px)` color `#3128230f`; hero image `mix-blend-mode: multiply`, max-width 630px, holder `perspective:1500px`; `.stack__card` `position: sticky; top: 4em; z-index: var(--i)`; practice lines 64px/35px mobile with hairlines; dark bands; footer grid `perspective:1500px`; RTL via logical properties; breakpoints 991 / 767 / 479 px as the template.
- [ ] Step 3: Write `render()` in `main.js`; call `render(localStorage['anhar-lang']||'en')` on DOMContentLoaded.
- [ ] Step 4: Verify in headless Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/tmp/site-desktop.png --window-size=1440,4000 file://…/site/index.html`; eyeball: nav, hero portrait blended (no grey rectangle), 8 cards, practice list, footer.
- [ ] Step 5: Review Focus 4: copy `index.html` to `/tmp/nojs.html` with `<script` tags stripped, screenshot; expected: all section text visible.
- [ ] Step 6: Commit `feat: static portfolio layout and render`.

### Task 3: Motion (GSAP + ScrollTrigger)

**Files:**
- Create: `site/js/motion.js`
- Modify: `site/index.html` (script tag), `site/css/style.css` (initial states only via `.js` class)

**Interfaces:**
- Consumes: hooks from Task 2.
- Produces: `window.MOTION = { init(): void, refresh(): void }`; `init()` is idempotent and `refresh()` re-measures after `render()`.

- [ ] Step 1: Hero entrance timeline: `.hero__img` from `{opacity:0, y:250, rotateY:45}` to identity, 1.2s `expo.out`; `.hero__tags` from `{opacity:0,y:120}` at `-=0.9`. Hero parallax: `.hero__img-holder` y: -60 scrubbed over the hero's exit.
- [ ] Step 2: Ghost marquees: every `.ghost` gets `x: -20%` scrubbed across its section (`start: top bottom, end: bottom top`).
- [ ] Step 3: Reveals: `.reveal` from `{opacity:0,y:20}` to `{opacity:1,y:0, duration:.7}` `once:true`, `start: top 85%`; children `.reveal--stagger > *` staggered 0.06.
- [ ] Step 4: Stacked cards: for each `.stack__card` except the last, when the *next* card scrolls over it (`trigger: next, start: top bottom, end: top 4em, scrub`), scale to 0.96 and overlay opacity 0.3→0.6; card title block `y: -20` parallax.
- [ ] Step 5: Practice: `.practice__imgs` enters from `{rotateX:85, opacity:0}` on reveal; `mouseenter` on `.practice__item[data-i]` → matching `.practice__img` `{opacity:1, y:0, duration:.35}`, siblings `.practice__item` opacity 0.4; `mouseleave` restores.
- [ ] Step 6: Footer grid: tiles `from {rotateX: ±60, opacity:0}` stagger 0.08 on footer reveal; buttons arrow hover via CSS (`background-position` 88%→94%).
- [ ] Step 7: Reduced motion: if `matchMedia('(prefers-reduced-motion: reduce)').matches` → `init()` only sets `gsap.set(all targets, {clearProps:'all'})`. Verify: `Chrome --headless --screenshot … --force-prefers-reduced-motion`, then run a dump script (`--dump-dom` + node) asserting no `.reveal` has `opacity: 0`.
- [ ] Step 8: Record a scroll contact sheet: headless screenshots at scroll 0 / 900 / 1800 / 2700 / 3600 px (via `--virtual-time-budget` and a tiny `?scroll=` query handled in main.js for QA only) and eyeball the stack behaviour.
- [ ] Step 9: Commit `feat: Beauté-style motion`.

### Task 4: Project panels with FLIP transition and hash routing

**Files:**
- Create: `site/js/panel.js`
- Modify: `site/index.html` (`#panel` markup), `site/css/style.css` (`.panel` styles)

**Interfaces:**
- Consumes: `CONTENT.projects`, `.stack__card[data-slug]`, current lang from `document.documentElement.lang`.
- Produces: `window.PANEL = { open(slug: string, fromCard?: HTMLElement): void, close(): void }`; URL hash `#project/<slug>` kept in sync; `Escape` closes; focus trapped while open; `body` scroll locked.

- [ ] Step 1: Panel markup: fixed full-screen `#panel` with `.panel__media` (cover image), `.panel__body` (title, role, year, paragraphs, image strip, facts), close button, "Next project" link.
- [ ] Step 2: `open()` with a card: `Flip.getState(card.querySelector('img'))` → move image into `.panel__media` → `Flip.from(state, {duration:.8, ease:'power3.inOut'})`; body lines slide up stagger 0.05 after 0.4s. `close()` reverses to the card and restores the image.
- [ ] Step 3: Hash routing: on load and `hashchange`, parse `#project/<slug>`; unknown slug → ignore.
- [ ] Step 4: Review Focus 2: load `index.html#project/the-individual-apple` in headless Chrome, `--dump-dom`, assert `#panel.is-open` and the panel `h2` text equals the EN title; screenshot shows the panel without a broken FLIP (no `fromCard` → plain fade-in path).
- [ ] Step 5: Commit `feat: project panels with FLIP open/close`.

### Task 5: Language toggle, RTL and Arabic pass

**Files:**
- Modify: `site/js/main.js` (`setLang(lang)`), `site/css/style.css` (`[dir=rtl]` rules, font swap), `site/index.html` (toggle button)

**Interfaces:**
- Produces: `window.setLang(lang: 'en'|'ar'): void` — sets `lang`/`dir`, stores `localStorage['anhar-lang']`, calls `render(lang)`, `MOTION.refresh()`, re-renders an open panel.

- [ ] Step 1: Toggle button in the nav (`EN | ع`), `aria-pressed`, keyboard operable.
- [ ] Step 2: CSS: `[lang=ar]` → display font Cairo, body IBM Plex Sans Arabic, letter-spacing 0, `.ghost` text becomes "أنهار" with `font-size` reduced 15%; practice lines 56px.
- [ ] Step 3: `render()` must not re-create cards (keep ScrollTrigger pins valid): update text nodes in place.
- [ ] Step 4: Arabic proofread pass over content.js: numerals Western (2026) in dates, Arabic punctuation (، ؛ «»), no machine-sounding calques; read every string once aloud-style.
- [ ] Step 5: Verify: headless 1440 px screenshot with `?lang=ar` (QA query handled in main.js) → mirrored layout.
- [ ] Step 6: Review Focus 1: headless `--window-size=375,812 ?lang=ar` and `--dump-dom` + script asserting `document.documentElement.scrollWidth <= 375`.
- [ ] Step 7: Commit `feat: Arabic toggle and RTL layout`.

### Task 6: Digital business card

**Files:**
- Create: `card/index.html`, `card/card.css`, `card/card.js`, `card/anhar.vcf`, `card/qr.svg`, `card/card-1080x1920.png`, `tools/make_qr.py`, `tools/render_card_png.sh`

**Interfaces:**
- Consumes: tokens from `site/css/style.css` (copied as `card.css` root block), `site/img/portrait-face.jpg`.
- Produces: `tools/make_qr.py URL` writes `card/qr.svg` (segno, error level M, dark `#2a2a29`, 4-module quiet zone). `render_card_png.sh` renders `card/index.html?png=1` at 1080×1920 DPR 1.

- [ ] Step 1: Write `anhar.vcf` (VERSION:3.0, CRLF, `N:Almalki;Anhar;;;`, `FN:Anhar Almalki`, `TITLE:Curator & Exhibition Designer`, `TEL;TYPE=CELL:+966534402993`, `EMAIL:anharalmalki1@gmail.com`, `URL:<portfolio url>`, `X-SOCIALPROFILE;type=linkedin:…`, `X-SOCIALPROFILE;type=instagram:https://instagram.com/Anhray12`, `NOTE:` one line).
- [ ] Step 2: Write `card/index.html` + `card.css`: 420px column; portrait circle-cropped on the grey; name in Anton 44px; title; four tags; six buttons (Save contact, WhatsApp `https://wa.me/966534402993`, Email `mailto:`, LinkedIn, Instagram, Portfolio); QR block; EN/ع toggle (`card.js` holds the ~20 strings); `?png=1` → 1080×1920 poster layout with QR large.
- [ ] Step 3: Review Focus 5: `python3 - <<EOF` validate the vcf: starts `BEGIN:VCARD`, has `VERSION:3.0`, every line ends `\r\n`, contains `TEL;TYPE=CELL:+966534402993`. Expected: prints OK.
- [ ] Step 4: `python3 tools/make_qr.py "https://<user>.github.io/anhar-portfolio/card/"` (placeholder URL now; rerun in Task 8). Expected: `card/qr.svg` exists, decodes (segno `--decode` not available: verify by rendering to PNG and scanning with `zbarimg` if installed; otherwise trust segno and eyeball).
- [ ] Step 5: `bash tools/render_card_png.sh` → `card/card-1080x1920.png`, 1080×1920, < 1.5 MB. Eyeball.
- [ ] Step 6: Commit `feat: digital business card, vCard, QR and PNG`.

### Task 7: CV redesign (HTML → PDF)

**Files:**
- Create: `cv/Anhar-Almalki-CV-2026.html`, `cv/cv.css`, `cv/Anhar-Almalki-CV-2026.pdf`, `tools/render_cv_pdf.sh`

**Interfaces:**
- Consumes: facts from CV v02 + answers (§10 of the spec); The Individual Apple entry text from spec §7.
- Produces: A4 PDF, exactly 2 pages, embedded fonts, text selectable.

- [ ] Step 1: Write the HTML in the spec §7 order with `@page { size: A4; margin: 16mm 14mm }`, Anton for name/section heads, Inter 9.5pt body, hairline rules, two-column header (contact right). Dates: Ministry Head of Unit 2022–present, Assistant PM 2021–2022, Elevated 2017–2020, MA 2025–2027 (WRTH × NABA), BA 2016.
- [ ] Step 2: `render_cv_pdf.sh`: Chrome `--headless=new --print-to-pdf=… --no-pdf-header-footer --virtual-time-budget=4000`.
- [ ] Step 3: Verify: `python3 -c "import fitz;d=fitz.open('cv/Anhar-Almalki-CV-2026.pdf');print(len(d))"` → `2`; render page thumbnails and eyeball for orphans/overflow.
- [ ] Step 4: Commit `feat: redesigned 2-page CV`.

### Task 8: Publish

**Files:**
- Create: `.github/workflows/pages.yml`, `.nojekyll`, `index.html` (root redirect to `site/`)
- Modify: `README.md`, `card/qr.svg`, `card/anhar.vcf` URL, `card/card-1080x1920.png`

- [ ] Step 1: Root `index.html` meta-refresh + link to `site/`; `pages.yml` deploys the repo root with `actions/upload-pages-artifact` (whole repo) so URLs are `/anhar-portfolio/site/` and `/anhar-portfolio/card/`.
- [ ] Step 2: Ask Anhar for her GitHub username (or install `gh`); create the public repo `anhar-portfolio`, push `main`, enable Pages (Source: GitHub Actions). Record the final URLs in README.
- [ ] Step 3: Rerun `make_qr.py` with the real card URL, update `URL:` in the vcf and the Portfolio button, rerun `render_card_png.sh`, commit `chore: point QR and links at the live URL`, push.
- [ ] Step 4: Publish `site/index.html` and `card/index.html` as Claude Artifacts too (backup links) — only if the Pages deploy is delayed.
- [ ] Step 5: Final QA on the live URL: desktop + 375 px, EN and AR, open two panels, save contact, scan QR with a phone camera (ask Anhar), Lighthouse performance ≥ 85 mobile.
