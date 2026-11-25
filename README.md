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

## Publish
See the "Publish" section at the bottom (filled in once the GitHub Pages URL exists).
