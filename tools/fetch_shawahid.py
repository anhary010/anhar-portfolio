#!/usr/bin/env python3
"""Pull the latest Shawahid uploads from the public YouTube RSS feed into site/data/shawahid.json.
Standard library only, so it runs unchanged in GitHub Actions. Exit code 0 always; prints 'changed' or 'unchanged'."""
import json, os, sys, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone

CHANNEL_ID = "UC6ceYIY3TfCsyOVgI7ktoEQ"          # youtube.com/@SHAWAHID-0
CHANNEL_URL = "https://www.youtube.com/@SHAWAHID-0"
LIMIT = 8
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site", "data", "shawahid.json")
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}

def fetch():
    req = urllib.request.Request(f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}", headers={"User-Agent": "Mozilla/5.0 (anhar-portfolio feed sync)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        root = ET.fromstring(r.read())
    videos = []
    for e in root.findall("a:entry", NS):
        videos.append({"id": e.find("yt:videoId", NS).text, "title": e.find("a:title", NS).text.strip(), "published": e.find("a:published", NS).text[:10]})
    # Teasers/Shorts on this channel carry hashtags in the title; keep full episodes only.
    videos = [v for v in videos if "#" not in v["title"]]
    videos.sort(key=lambda v: v["published"], reverse=True)
    return videos[:LIMIT]

def main():
    try:
        videos = fetch()
    except Exception as ex:
        print("fetch failed, keeping previous file:", ex); return
    old = None
    if os.path.exists(OUT):
        try: old = json.load(open(OUT, encoding="utf-8")).get("videos")
        except Exception: old = None
    if old == videos:
        print("unchanged"); return
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({"channel": CHANNEL_URL, "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "videos": videos}, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("changed:", len(videos), "videos, newest", videos[0]["published"], videos[0]["title"])

if __name__ == "__main__":
    main()
