import json
import requests
from datetime import datetime, timezone
from pathlib import Path

URL = "https://itunes.apple.com/us/rss/toppodcasts/limit=20/json"
OUTPUT_FILE = Path("../public/data/podcasts-apple.json")

def main():
    r = requests.get(URL, timeout=15)
    r.raise_for_status()
    data = r.json()

    items = []
    for idx, entry in enumerate(data["feed"]["entry"], start=1):
        items.append({
            "rank": idx,
            "name": entry["im:name"]["label"],
            "publisher": entry["im:artist"]["label"],
        })

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    output = {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "platform": "Apple Podcasts",
        "scope": "US",
        "source": "Apple Marketing Tools",
        "items": items,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(items)} podcasts → {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
