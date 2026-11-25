#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf="$ROOT/cv/Anhar-Almalki-CV-2026.pdf" "file://$ROOT/cv/Anhar-Almalki-CV-2026.html" 2>/dev/null
python3 -c "import fitz;d=fitz.open('$ROOT/cv/Anhar-Almalki-CV-2026.pdf');print('pages',len(d))"
