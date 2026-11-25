#!/usr/bin/env python3
"""Usage: make_qr.py URL  -> writes card/qr.svg (segno, error level M, ink #2a2a29, quiet zone 4)."""
import sys, os, segno
url = sys.argv[1] if len(sys.argv) > 1 else "https://USERNAME.github.io/anhar-portfolio/card/"
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
qr = segno.make(url, error="m")
qr.save(os.path.join(root, "card", "qr.svg"), kind="svg", scale=8, border=4, dark="#2a2a29", light=None, xmldecl=False, svgclass=None, lineclass=None)
qr.save(os.path.join(root, "card", "qr.png"), kind="png", scale=12, border=4, dark="#2a2a29", light="#d2d2ce")
print("qr ->", url, "| version", qr.version)
