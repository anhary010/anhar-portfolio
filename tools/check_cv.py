#!/usr/bin/env python3
"""CV checks: exactly 2 pages, and no section heading orphaned at the bottom of a page."""
import fitz, sys, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = fitz.open(os.path.join(root, "cv/Anhar-Almalki-CV-2026.pdf"))
errs = []
if len(d) != 2: errs.append(f"pages = {len(d)}, want 2")
HEADINGS = {"CURATORIAL & EXHIBITION EXPERIENCE", "PROFESSIONAL EXPERIENCE", "EDUCATION", "RECOGNITION", "CERTIFICATIONS", "CURATORIAL & CONCEPT SKILLS", "DELIVERY & TOOLS"}
for i, p in enumerate(d):
    blocks = [b[4].strip() for b in p.get_text("blocks") if b[4].strip()]
    body = [b for b in blocks if not b.startswith("Anhar Almalki — CV") and not b.startswith("Portfolio:")]
    if body and body[-1].upper() in HEADINGS: errs.append(f"page {i+1} ends with orphan heading: {body[-1]}")
if errs: print("FAIL\n - " + "\n - ".join(errs)); sys.exit(1)
print("CV OK: 2 pages, no orphan headings")
