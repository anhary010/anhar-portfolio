# Anhar Almalki — Portfolio, Digital Card & CV

Static files, no build step.

| Folder | What it is |
|---|---|
| `site/` | One-page bilingual portfolio (EN default, AR toggle). Open `site/index.html`. |
| `card/` | Digital business card page, `anhar.vcf` (save contact), `qr.svg`, PNG for chats. |
| `cv/` | CV as HTML and rendered PDF. |
| `tools/` | Python/Node helpers: asset export, content check, QR, PDF/PNG render. |
| `docs/` | Design doc and implementation plan. |

## Preview locally
```bash
cd site && python3 -m http.server 8080
```
Then open http://localhost:8080

## Regenerate assets
```bash
python3 tools/export_assets.py      # dossier → site/img
node tools/check_content.mjs         # EN/AR parity check
```

## Publish (GitHub Pages)
1. Create an empty public repository named `anhar-portfolio` on GitHub.
2. Push this folder:
   ```bash
   git remote add origin https://github.com/anhary010/anhar-portfolio.git
   git push -u origin main
   ```
3. In the repository: Settings → Pages → Source: **GitHub Actions**. The workflow in `.github/workflows/pages.yml` deploys the whole repo on every push.
4. URLs: `https://anhary010.github.io/anhar-portfolio/site/` (portfolio), `.../card/` (digital card), `.../cv/Anhar-Almalki-CV-2026.pdf`.
5. Point the QR and the vCard at the live card URL, then re-render the PNG:
   ```bash
   python3 tools/make_qr.py "https://anhary010.github.io/anhar-portfolio/card/"
   sed -i '' 's#https://USERNAME.github.io#https://anhary010.github.io#' card/anhar.vcf
   bash tools/render_card_png.sh
   ```

## Edit content
All site text lives in `site/js/content.js` (EN + AR). After editing run `node tools/check_content.mjs && node tools/prerender.mjs`.
To add Shawahid videos: in the `shawahid` project set `videos: [{ id: "YOUTUBE_ID", title: { en: "...", ar: "..." } }]` and update the YouTube link in `links`.
