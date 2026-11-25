#!/usr/bin/env python3
"""Export dossier / wall-card images into site/img as web JPEGs + manifest.json."""
import json, io, os, sys
import fitz
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site", "img")
SRC = "/Users/anharalmalki/Desktop/Downloads"
DOSSIER = os.path.join(SRC, "Anhar Almalki — Selected Narratives A Curatorial & Spatial Practice Dossier-3.pdf")
CARDS = os.path.join(SRC, "The Individual Apple – Wall Cards-2.pdf")
WATHAQ = "/Users/anharalmalki/Documents/wrth - mastar/first smemter/out comes/فاينل وثق فبقى.pdf"

# slug: (pdf, page(1-based), xref or None)
MAP = {
 "hero-portrait": (DOSSIER, 11, 87), "portrait-face": (DOSSIER, 2, 46), "portrait-bench": (DOSSIER, 1, 42),
 "texture-dark": (DOSSIER, 3, 52), "hajj-gallery": (DOSSIER, 10, 83), "wrth-install-1": (DOSSIER, 8, 74),
 "wrth-install-2": (DOSSIER, 8, 75), "documented-plan": (DOSSIER, 12, 91), "documented-stone": (DOSSIER, 12, 92),
 "documented-gallery": (DOSSIER, 13, 97), "craft-hands": (DOSSIER, 15, 106), "craft-tools": (DOSSIER, 15, 108),
 "erasure-poster": (DOSSIER, 17, 116), "erasure-visitor": (DOSSIER, 16, 112), "mustahel-talk": (DOSSIER, 19, 126),
 "mustahel-group": (DOSSIER, 19, 124), "continuum-install-1": (DOSSIER, 21, 138), "continuum-install-2": (DOSSIER, 21, 139),
 "shawahid-logo": (DOSSIER, 23, 149), "shawahid-orange": (DOSSIER, 23, 150), "award-ceremony": (DOSSIER, 5, 60),
 "apple-wallcards-1": (CARDS, 1, None), "apple-wallcards-2": (CARDS, 2, None), "apple-wallcards-3": (CARDS, 5, None),
 "apple-wallcard-braids": (CARDS, 9, None),
 "documented-poster": (WATHAQ, 1, None), "documented-zone": (WATHAQ, 20, None), "documented-3d": (WATHAQ, 22, None),
}

def export(src_pdf, page, xref, slug, max_w=1600):
    doc = fitz.open(src_pdf)
    if xref is None:
        pix = doc[page-1].get_pixmap(dpi=150)
    else:
        pix = fitz.Pixmap(doc, xref)
        if pix.n >= 5: pix = fitz.Pixmap(fitz.csRGB, pix)
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    if img.width > max_w:
        img = img.resize((max_w, round(img.height*max_w/img.width)), Image.LANCZOS)
    path = os.path.join(OUT, slug + ".jpg")
    img.save(path, "JPEG", quality=82, optimize=True, progressive=True)
    return {"w": img.width, "h": img.height, "src": f"{os.path.basename(src_pdf)[:30]} p{page}", "bytes": os.path.getsize(path)}

EXTRA = {"apple-poster": os.path.join(os.path.dirname(os.path.abspath(__file__)), "src-apple-poster.jpeg")}

def export_file(path, slug, max_w=1600):
    img = Image.open(path).convert("RGB")
    if img.width > max_w: img = img.resize((max_w, round(img.height*max_w/img.width)), Image.LANCZOS)
    out = os.path.join(OUT, slug + ".jpg"); img.save(out, "JPEG", quality=86, optimize=True, progressive=True)
    return {"w": img.width, "h": img.height, "src": os.path.basename(path), "bytes": os.path.getsize(out)}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    manifest = {slug: export(*args, slug) for slug, args in MAP.items()}
    manifest.update({slug: export_file(path, slug) for slug, path in EXTRA.items()})
    json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=1, ensure_ascii=False)
    total = sum(m["bytes"] for m in manifest.values())
    print(f"{len(manifest)} images, {total/1e6:.1f} MB")
