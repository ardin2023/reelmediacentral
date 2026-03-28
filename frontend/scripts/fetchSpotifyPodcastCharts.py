import json
import requests
from datetime import datetime, timezone
from pathlib import Path

URL = "https://podcastcharts.byspotify.com/api/charts/top?region=US&limit=20"
OUTPUT_FILE = Path(__file__).parent.parent / "public/data/podcasts-spotify.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0",
}

def main():
    r = requests.get(URL, headers=HEADERS, timeout=15)
    r.raise_for_status()
    data = r.json()

    items = []
    for idx, entry in enumerate(data[:20], start=1):
        items.append({
            "rank": idx,
            "name": entry["showName"],
            "publisher": entry["showPublisher"],
        })

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    output = {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "platform": "Spotify",
        "scope": "US",
        "source": "Spotify Podcast Charts",
        "items": items,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(items)} podcasts → {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
