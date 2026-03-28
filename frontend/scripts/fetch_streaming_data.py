import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "public/data/streaming"
INDEX_FILE = DATA_DIR / "index.json"
LEGACY_FILE = Path(__file__).resolve().parents[1] / "public/data/top-streaming-shows.json"

print("Generating sample streaming chart data…")

items = [
    {"rank": 1, "title": "Kingdom of the North", "platform": "Netflix", "weeklyViews": 13500000},
    {"rank": 2, "title": "Heist City", "platform": "Amazon Prime Video", "weeklyViews": 11300000},
    {"rank": 3, "title": "Galactic Frontier", "platform": "Disney+", "weeklyViews": 10400000},
    {"rank": 4, "title": "The Courtroom", "platform": "HBO Max", "weeklyViews": 8800000},
    {"rank": 5, "title": "Love, Memory", "platform": "Hulu", "weeklyViews": 7600000},
    {"rank": 6, "title": "Quantum Detectives", "platform": "Netflix", "weeklyViews": 6950000},
    {"rank": 7, "title": "Highway 9", "platform": "Peacock", "weeklyViews": 6420000},
    {"rank": 8, "title": "The Last Colony", "platform": "Paramount+", "weeklyViews": 5980000},
    {"rank": 9, "title": "Ghost Island", "platform": "Hulu", "weeklyViews": 5600000},
    {"rank": 10, "title": "Silent Waters", "platform": "Apple TV+", "weeklyViews": 5230000},
]

week_end = datetime.now(timezone.utc).date()
week_start = week_end - timedelta(days=week_end.weekday())  # Monday start
week_id = week_start.strftime("%Y-%m-%d")

payload = {
    "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    "source": "Sample generator",
    "weekOf": week_start.strftime("%Y-%m-%d"),
    "items": items,
}

DATA_DIR.mkdir(parents=True, exist_ok=True)
with open(DATA_DIR / f"{week_id}.json", "w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2, ensure_ascii=False)

# also write/refresh legacy location for compatibility
with open(LEGACY_FILE, "w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2, ensure_ascii=False)

# maintain index file for week selection
index = []
if INDEX_FILE.exists():
    try:
        index = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    except Exception:
        index = []

new_entry = {"id": week_id, "label": week_start.strftime("%b %d, %Y")}
index = [e for e in index if e.get("id") != week_id]
index.insert(0, new_entry)

with open(INDEX_FILE, "w", encoding="utf-8") as f:
    json.dump(index, f, indent=2, ensure_ascii=False)

print(f"Saved {len(items)} streaming titles to {DATA_DIR / f'{week_id}.json'}")
print(f"Updated streaming index with {len(index)} entries -> {INDEX_FILE}")

