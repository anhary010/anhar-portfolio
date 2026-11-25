# Anhar Almalki — Portfolio Site, Digital Business Card & CV Redesign
Design doc · 2026-11-25 · status: APPROVED by Anhar 2026-11-25 (answers folded in, §10)

## 1. Intent & why
Anhar is repositioning from government project management toward curatorial /
exhibition practice (MA in Museums & Exhibitions Curation, WRTH × NABA, 2025–2027).
She needs three things that present her as a curator first:

1. A **publishable portfolio website** modelled on the Webflow template *Beauté*
   (by Over Sight). She explicitly cares about **how the template moves**: the
   hero entrance, how project "files" stack and slide over each other on scroll,
   the ghost marquee type, the text reveals, the hover reveals — not just the look.
2. A **digital business card** she can share with people (link + image).
3. A **re-ordered CV** that adds her current role: assistant curator on
   *The Individual Apple* (curated by Rawan Al-Qahtani), where she designed the
   label/interpretation system. The exhibition opens the week after this doc
   (early Dec 2026); Anhar asked that it be treated as opened: full case study,
   artwork titles and wall-card images allowed. Year "2026" only; no venue is
   stated because none is confirmed in her materials.

Language: **English primary, with an Arabic toggle** on the site and card.

## 2. Goals / non-goals / anti-goals
Goals
- Site reproduces the Beauté motion language faithfully (see §5) on her content.
- Everything is static files: open `index.html` and it works; drag the folder to
  Netlify / GitHub Pages and it is live. No build step, no CMS.
- Immediate shareable links today (published as Claude Artifacts) while she
  decides on a domain.
- Card: one tap to save contact (vCard), WhatsApp, email, LinkedIn, Instagram,
  portfolio; also a PNG version for chats; QR code pointing at the card.
- CV: 2 pages, English, curator-first ordering, same contact details.

Non-goals
- No blog, no contact form backend, no analytics, no custom domain purchase.
- No Arabic CV in this round (English only, like the original).

Anti-goals (would make it a failure)
- A generic template look that loses the dossier's black-and-white, memory-and-
  trace voice. Her photographs and texts must carry the page.
- Motion that is heavy or janky on a phone. Everything must degrade gracefully
  and respect `prefers-reduced-motion`.
- Stating facts not in her materials (dates, venues, titles).

## 3. Constraints
- Sources: CV v01-2 (Aug 2026), *Selected Narratives* dossier (25 pp, images
  extracted), LinkedIn profile (read 2026-11-25), *The Individual Apple* files
  (proposal, wall cards PDF, artwork register). No other facts.
- Template reference: https://ovo-beaute.webflow.io/ (studied live + CSS).
- Tooling available offline: Python 3 (PyMuPDF, Pillow, openpyxl), headless
  Chrome for PDF/PNG rendering. No Node toolchain required.
- Images: dossier images are 800–2500 px, mostly B/W; good enough for web at
  1600 px max width, WebP/JPEG re-encoded.

## 4. Approaches considered (site)
A. **Static HTML/CSS + GSAP ScrollTrigger (CDN)** — hand-built single page that
   re-implements each Beauté interaction. Full control of motion, zero hosting
   friction, publishable anywhere. *Chosen.*
B. Buy the Beauté Webflow template and fill it — closest fidelity, but needs a
   Webflow account/plan, RTL/Arabic toggle is awkward in Webflow, and content
   lives in someone else's CMS.
C. Framework site (Astro/Next + Framer Motion) — nicer authoring for many
   pages, but adds a build step and Node dependency for a one-page portfolio.

Approach A was picked by me because she talked about outcomes, not tools; it is
the only one that is both publishable today and fully owned.

## 5. Site design

### 5.1 Palette, type, tone
- Background `#d2d2ce` (warm grey, as the template), ink `#2a2a29`, paragraph
  `#312823`, hairlines `#312823` at 1px. Dark blocks `#2a2a29` for the
  testimonial-equivalent and footer, matching the template rhythm.
- Display: **Anton** (Google Fonts) uppercase, like the template. Arabic display:
  **Cairo** 800. Body: **Inter**; Arabic body: **IBM Plex Sans Arabic**.
- Photography stays black-and-white (hers already is).

### 5.2 Page structure (single page, in order)
1. **Nav** (sticky, blurred `#dddddd d1` bar, 70px): logo "ANHAR" · Home ·
   Projects · Practice · Contact · right: EN|AR toggle + "LET'S TALK" button.
2. **Hero**: full-viewport. Ghost marquee "ANHAR ANHAR ANHAR" in Anton at ~470px
   at 6% opacity behind; her portrait (dossier p11, back view on grey, blended
   with `mix-blend-mode: multiply` so its background disappears into the page);
   bottom gradient to background; tag row "#CURATORIAL #SPATIAL #ARCHIVAL
   #RESEARCH" at bottom-left.
3. **About**: the dossier statement ("I approach exhibitions and spatial design
   as intellectual and narrative practices…") as a caps-title reveal, the quote
   "I do not design spaces. I construct experiences that leave traces." and two
   buttons: ABOUT ME (scrolls to practice) / MY WORK.
4. **Selected Projects** ("Works" ghost marquee behind the heading): stacked
   sticky cards, one per project, each a full-width image with dark overlay,
   title top-left, year top-right, one-line description, and a tag chip. Cards:
   1. The Individual Apple — Assistant Curator & Interpretation System — 2026
   2. Documented, Therefore It Remained — Curatorial Concept — 2025/26
   3. Craft in Flux — Research Exhibition — 2026
   4. Beyond Erasure — Living Archive, Al-Nuzha neighbourhood — 2026
   5. Continuum '26 — Artist Producer, Diriyah Art Futures — 2026
   6. Hajj Exhibition — Design Advisory & Spatial Coordination — 2021–2024
   7. WRTH Annual Exhibition — Installation & Interpretation — 2025
   8. Mustahel Student Club & Shawahid — Collective Practice — 2025–
   Clicking a card opens a **project panel** (see 5.4).
5. **Practice** (template "Services"): heading + four big uppercase lines with
   hairlines, each revealing an image on hover and dimming the others:
   Curatorial Concept & Narrative · Exhibition & Spatial Design ·
   Interpretation & Label Systems · Production & Project Delivery.
6. **Dark band — Recognition** (template "Testimonials" slot, re-purposed):
   a horizontal slider with PREV/NEXT: Best Office Interior, International
   Property Awards 2025 · Career Excellence Award, Ministry of Hajj & Umrah ·
   Author, Ministry Architectural & Interior Design Guidelines · First-class
   honours, Taif University (GPA 3.91).
7. **Journey** (compact timeline from the CV): WRTH × NABA MA 2025– ·
   Ministry of Hajj & Umrah 2021– (Head of Studies & Design Unit) ·
   Elevated Studio 2017–2020 · Taif University 2016.
8. **Playground** ("Play ground" ghost marquee): a scrolling strip of dossier
   images (installation shots, sketches, Shawahid logo) — template's fun grid.
9. **Footer / Contact**: left "Open for curatorial collaborations & cultural
   exchange" + email, phone, LinkedIn, Instagram @anhary12; right the
   perspective image grid flipping in on scroll (template footer); bottom
   links row and © 2026 Anhar Almalki.

### 5.3 Motion spec (what she asked to focus on)
Measured from the live template; reproduced with GSAP 3 + ScrollTrigger.
- **Hero entrance (on load)**: portrait starts `opacity 0, translateY 250px,
  rotateY 45deg` inside a `perspective: 1500px` container → eases to identity
  over ~1.2s (expo.out). Tag row starts `opacity 0, translateY 120px` → in, 0.2s
  later. Ghost marquee drifts horizontally with scroll (scrubbed), not timed.
- **Hero parallax**: on scroll the portrait holder translates up to −60px while
  the hero scrolls out (scrub).
- **Caps-title reveals**: each heading starts `opacity 0, translateY 20px` and
  animates in when it enters the viewport (once). Tag lists ("Branding…" in
  the template) stagger in 60ms apart.
- **Stacked project cards**: each card is `position: sticky; top: 4em` with an
  increasing z-index, so the next card slides over the previous one; the card
  underneath scales to 0.96 and dims as it is covered (ScrollTrigger scrub on
  the *next* card's progress). Card content (title/date) has a slight parallax.
- **Practice hover**: hovering a line fades its image in (`opacity 0 → 1,
  translateY 20 → 0`, 0.35s) and sets the other lines to 0.4 opacity; the whole
  image holder enters on scroll from `rotateX 85deg, opacity 0`.
- **Footer grid**: image tiles flip in from `rotateX ±60deg` in a perspective
  container as the footer enters; gradient overlays top and bottom.
- **Project panel open/close**: the clicked card's image expands to a
  full-screen panel (FLIP: record card rect → animate to viewport) while the
  page fades; panel content slides up in staggered lines; ESC/close reverses.
- **Buttons**: arrow shifts right on hover (background-position 88% → 94%),
  0.25s. Nav links underline-slide.
- `prefers-reduced-motion: reduce` → all of the above becomes instant fades.

### 5.4 Project panels (content)
Each panel: title, role, year, 1–3 paragraphs taken verbatim or lightly edited
from the dossier, 2–4 images, and a "Next project" link. The Individual Apple
panel documents the label system: three layers (Identity / Spark / In depth),
the six spark colours and what each means, the bilingual white card vs
coloured card logic, QR to in-depth texts, artwork register & installation
schedule; and notes that she also exhibits *My Mother's Braids* (100×50 cm).

### 5.5 Bilingual
A single `content.js` holds EN and AR strings keyed per element. Toggle sets
`html[lang]` + `dir`, swaps fonts, and re-renders text; layout mirrors with
logical CSS properties. Arabic copy is written from her dossier (not machine
Arabic), concise, in the voice of her LinkedIn posts. Choice is remembered in
`localStorage`.

### 5.6 Files
```
anhar-portfolio/
  site/ index.html  css/style.css  js/main.js  js/content.js  img/…
  card/ index.html  anhar.vcf  qr.svg  card-1080x1920.png
  cv/   Anhar-Almalki-CV-2026.html → Anhar-Almalki-CV-2026.pdf
  docs/ this file, README (how to publish)
```

## 6. Business card
- Mobile-first page (max 420px column, works on desktop too), same palette and
  type as the site; her portrait, name in Anton, title line "Curator ·
  Exhibition & Spatial Designer", four tag words, then buttons:
  **Save contact** (downloads `anhar.vcf`), **WhatsApp** (wa.me/966534402993),
  **Email**, **LinkedIn**, **Instagram**, **Portfolio**. QR code (SVG,
  generated offline) linking to the card URL. EN/AR toggle.
- PNG 1080×1920 export of the card for sharing in chats, rendered by headless
  Chrome from the same HTML.

## 7. CV redesign (English, 2 pages, PDF)
Order: name + title "Curator & Exhibition Designer | Senior Project Manager" →
3-line profile (curatorial first, delivery second) → **Curatorial & Exhibition
Experience** (The Individual Apple 2026 — Assistant Curator, in development;
Continuum '26 — Artist Producer, DAF; WRTH Annual Exhibition 2025 —
Installation & Interpretation; Hajj Exhibition 2021–2024 — Design Advisory;
Triennale Milano proposal; Mustahel Student Club founder; Shawahid) →
**Professional Experience** (Ministry roles, Elevated Studio, condensed to
outcome bullets) → Education → Skills (curatorial / spatial / tools) →
Recognition → Certifications (PMP, CIOB L4, BIM, Design Thinking,
Operations Mgmt, Procurement). Same contact line. Typography: Anton for name
and section heads, Inter body, hairline rules — visually a sibling of the site.

The Individual Apple entry (draft):
> **Assistant Curator — *The Individual Apple*, group exhibition curated by
> Rawan Al-Qahtani** · 2026 (in development)
> Designed the exhibition's interpretation and label system: a three-layer
> structure (Identity / Spark / In depth) with colour-coded "spark" cards and
> QR-linked long texts; wrote and edited bilingual (AR/EN) wall texts for eight
> works; built the artwork register and installation schedule; coordinated
> with seven participating artists. Also exhibiting the painting
> *My Mother's Braids* (100 × 50 cm).

## 8. Decisions I made (flag if wrong)
- Dates for Ministry roles follow the CV (Head of Unit 2022–present), not
  LinkedIn (Jan 2025–present), because the CV is her latest authored document.
- Hero portrait: dossier p11 (back view). Fallback p01 (bench) if blending fails.
- Project panels replace the template's separate project pages so the site
  stays one file set and the transition stays smooth; URLs still deep-link
  via `#project/the-individual-apple`.
- WhatsApp number = the phone on the CV (+966 53 440 2993).
- Instagram handle @anhary12 from the dossier back page.

## 9. Left to the builder
Exact easing curves, image crops, Arabic line lengths, QR size, PNG card
composition, and the order of playground images.

## 10. Answers from Anhar (2026-11-25)
1. *The Individual Apple* opens next week → treat as opened. Full case study
   in the project panel and on the CV, including the label system, the six
   spark colours, artwork titles and wall-card visuals. Still no venue.
2. She has a GitHub account → publish the site and card to **GitHub Pages**
   (repo `anhar-portfolio`, `site/` as root via a Pages workflow or `docs/`
   mirror). The QR code and the card's Portfolio button point at the
   GitHub Pages URLs. Claude Artifacts remain a backup preview only.
3. Ministry / Hajj Exhibition images are cleared for the public site.
   Add the **International Property Awards** (Best Office Interior 2025,
   won with the Ministry) with the award-ceremony photo (dossier p5) in the
   Recognition band and on the CV.
4. MA studio projects are labelled "Curatorial concept — MA studio,
   WRTH × NABA, 2025–2026". Confirmed.
Build from CV v02 (21 Aug 2026) and Dossier-3.
