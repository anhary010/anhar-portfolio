#!/usr/bin/env bash
# Renders card/index.html?png=1 at 1080x1920 into card/card-1080x1920.png using headless Chrome.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8791
(cd "$ROOT" && python3 -m http.server $PORT >/dev/null 2>&1 &) ; sleep 1
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1920 --virtual-time-budget=5000 \
  --screenshot="$ROOT/card/card-1080x1920.png" "http://localhost:$PORT/card/index.html?png=1" 2>/dev/null
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf="$ROOT/card/Anhar-Almalki-Card.pdf" "http://localhost:$PORT/card/index.html?pdf=1" 2>/dev/null
pkill -f "http.server $PORT" || true
ROOT="$ROOT" python3 - <<'PY'
from PIL import Image
import os
root = os.environ["ROOT"]
im = Image.open(os.path.join(root, "card/card-1080x1920.png")).convert("RGB")
im.save(os.path.join(root, "card/card-1080x1920.jpg"), "JPEG", quality=90, optimize=True)
print("card png", im.size, "| jpg", os.path.getsize(os.path.join(root, "card/card-1080x1920.jpg"))//1024, "KB | pdf", os.path.getsize(os.path.join(root, "card/Anhar-Almalki-Card.pdf"))//1024, "KB")
PY
