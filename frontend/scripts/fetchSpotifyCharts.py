import json
import re
import requests
import csv
import io
from datetime import datetime, timezone
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None

OUTPUT_FILE = Path("../public/data/music-charts-global.json")

SPOTIFY_CSV_URL = "https://spotifycharts.com/regional/global/daily/latest/download"
KWORB_URL = "https://kworb.net/spotify/country/global_daily.html"

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "text/csv,text/plain,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def is_html(text: str) -> bool:
    t = text.lstrip().lower()
    return t.startswith("<!doctype") or t.startswith("<html") or "<html" in t[:5000]

def clean_lines_for_csv(text: str):
    # Keep non-empty, non-comment lines
    lines = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("#"):
            continue
        lines.append(line)
    return lines

def try_spotifycharts_csv():
    r = requests.get(SPOTIFY_CSV_URL, headers=HEADERS, timeout=30)
    r.raise_for_status()

    text = r.text

    # --- HARD PROOF OUTPUT ---
    print("=== SpotifyCharts response sniff ===")
    print("Status:", r.status_code)
    print("Content-Type:", r.headers.get("content-type"))
    print("First 200 chars:", repr(text[:200]))
    print("===================================")

    if is_html(text):
        raise RuntimeError("SpotifyCharts download returned HTML (not CSV). Likely bot-block/redirect.")

    lines = clean_lines_for_csv(text)
    if not lines:
        raise RuntimeError("SpotifyCharts returned no usable CSV lines.")

    # SpotifyCharts CSV is usually comma-delimited, BUT can vary. Detect delimiter.
    sample = "\n".join(lines[:5])
    delimiter = ";" if sample.count(";") > sample.count(",") else ","

    reader = csv.DictReader(io.StringIO("\n".join(lines)), delimiter=delimiter)

    print("Detected delimiter:", delimiter)
    print("Detected header fields:", reader.fieldnames)

    items = []
    for row in reader:
        # Try multiple known header variants
        pos = row.get("Position") or row.get("Pos") or row.get("Rank") or row.get("position")
        track = row.get("Track Name") or row.get("Track") or row.get("track_name")
        artist = row.get("Artist") or row.get("artist")
        streams = row.get("Streams") or row.get("streams")
        url = row.get("URL") or row.get("Uri") or row.get("uri") or row.get("url")

        if not (pos and track and artist):
            continue

        try:
            rank = int(str(pos).strip())
        except:
            continue

        # Streams can have commas
        stream_int = None
        if streams:
            s = re.sub(r"[^\d]", "", str(streams))
            if s:
                stream_int = int(s)

        items.append({
            "rank": rank,
            "track": str(track).strip(),
            "artist": str(artist).strip(),
            "streams": stream_int,
            "url": str(url).strip() if url else None
        })

    if len(items) == 0:
        raise RuntimeError("SpotifyCharts parsed 0 rows (header mismatch or blocked content).")

    # Keep top 20
    items = sorted(items, key=lambda x: x["rank"])[:20]
    return items, "SpotifyCharts"

def try_kworb_html():
    if BeautifulSoup is None:
        raise RuntimeError("BeautifulSoup not installed. Run: pip install beautifulsoup4")

    r = requests.get(KWORB_URL, headers=HEADERS, timeout=30)
    r.raise_for_status()
    html = r.text

    print("=== Kworb response sniff ===")
    print("Status:", r.status_code)
    print("Content-Type:", r.headers.get("content-type"))
    print("First 200 chars:", repr(html[:200]))
    print("===========================")

    soup = BeautifulSoup(html, "html.parser")

    # Kworb page contains a main table. We’ll grab the first table that has rank + track columns.
    table = soup.find("table")
    if not table:
        raise RuntimeError("Kworb: table not found.")

    rows = table.find_all("tr")
    if not rows or len(rows) < 5:
        raise RuntimeError("Kworb: table rows not found.")

    items = []
    for tr in rows[1:]:
        tds = tr.find_all("td")
        if len(tds) < 4:
            continue

        # Kworb typical columns: Rank | Track | Artist | Streams | ...
        rank_txt = tds[0].get_text(strip=True)
        track_txt = tds[1].get_text(" ", strip=True)
        artist_txt = tds[2].get_text(" ", strip=True)
        streams_txt = tds[3].get_text(strip=True)

        if not rank_txt.isdigit():
            continue

        rank = int(rank_txt)

        s = re.sub(r"[^\d]", "", streams_txt)
        stream_int = int(s) if s else None

        items.append({
            "rank": rank,
            "track": track_txt,
            "artist": artist_txt,
            "streams": stream_int,
            "url": None
        })

        if len(items) >= 20:
            break

    if len(items) == 0:
        raise RuntimeError("Kworb: parsed 0 tracks.")

    return items, "Kworb"

def main():
    items = []
    source = None

    # Try SpotifyCharts first
    try:
        items, source = try_spotifycharts_csv()
    except Exception as e:
        print("SpotifyCharts failed:", str(e))
        print("Falling back to Kworb...")

        items, source = try_kworb_html()

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    output = {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "platform": "Spotify",
        "scope": "Global",
        "source": source,
        "items": items
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(items)} tracks to {OUTPUT_FILE} (source={source})")

if __name__ == "__main__":
    main()
