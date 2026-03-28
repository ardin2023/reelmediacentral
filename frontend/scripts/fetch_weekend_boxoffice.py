import json
import requests
from bs4 import BeautifulSoup
from pathlib import Path

URL = "https://www.boxofficemojo.com/weekend/"
OUTPUT_FILE = Path(__file__).resolve().parents[1] / "public/data/top-weekend-boxoffice.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

def parse_money(text):
    text = text.replace("$", "").replace(",", "").strip()
    return int(text) if text.isdigit() else None

print("Fetching Box Office Mojo weekend data…")
response = requests.get(URL, headers=HEADERS)
response.raise_for_status()

soup = BeautifulSoup(response.text, "html.parser")

table = soup.select_one("table")
if not table:
    raise RuntimeError("Weekend table not found on Box Office Mojo")

rows = table.select("tbody tr")
movies = []

for row in rows[:10]:
    cols = row.select("td")
    if len(cols) < 6:
        continue

    movies.append({
        "rank": int(cols[0].text.strip()),
        "title": cols[1].text.strip(),
        "releaseDate": None,
        "weekendGross": parse_money(cols[3].text),
        "totalGross": parse_money(cols[5].text)
    })

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(movies, f, indent=2)

print(f"Saved {len(movies)} movies to:")
print(OUTPUT_FILE)
