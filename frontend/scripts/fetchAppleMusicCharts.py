import json
import requests
from datetime import datetime, timezone
from pathlib import Path

URL = "https://rss.applemarketingtools.com/api/v2/us/music/most-played/40/songs.json"
OUTPUT_FILE = Path("../public/data/music-charts-applemusic.json")

def main():
    r = requests.get(URL, timeout=15)
    r.raise_for_status()
    data = r.json()

    items = []
    for idx, song in enumerate(data["feed"]["results"], start=1):
        items.append({
            "rank": idx,
            "track": song["name"],
            "artist": song["artistName"]
        })

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    output = {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "platform": "Apple Music",
        "scope": "US",
        "source": "Apple Marketing Tools",
        "items": items
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(items)} tracks → {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
