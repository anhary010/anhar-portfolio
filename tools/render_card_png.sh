#!/usr/bin/env bash
# Renders card/index.html?png=1 at 1080x1920 into card/card-1080x1920.png using headless Chrome.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8791
(cd "$ROOT" && python3 -m http.server $PORT >/dev/null 2>&1 &) ; sleep 1
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1920 --virtual-time-budget=5000 \
  --screenshot="$ROOT/card/card-1080x1920.png" "http://localhost:$PORT/card/index.html?png=1" 2>/dev/null
pkill -f "http.server $PORT" || true
python3 -c "from PIL import Image;im=Image.open('$ROOT/card/card-1080x1920.png');print('card png',im.size)"
