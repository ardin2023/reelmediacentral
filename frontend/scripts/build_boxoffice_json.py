import json
import re
from pathlib import Path

# Output location (DO NOT CHANGE)
OUTPUT = Path("../public/data/boxoffice/2026-03-08.json")

# =====================================================
# WEEKLY INPUT — THIS IS THE ONLY SECTION YOU EDIT
# =====================================================
# Replace these lines each week with new Top 20 data
# Format:
# rank | title | weekend gross | total gross | release date

RAW_INPUT = """
1 | Hoppers | $45,349,801 | $45,349,801 |
2 | Scream 7 | $17,012,337 | $93,086,497 |
3 | The Bride! | $7,051,476 | $7,051,476 |
4 | GOAT | $6,476,972 | $83,680,019 |
5 | Wuthering Heights | $3,721,102 | $78,735,877 |
6 | Crime 101 | $2,034,640 | $33,608,432 |
7 | EPiC: Elvis Presley in Concert | $1,541,329 | $10,965,959 |
8 | Send Help | $1,531,569 | $62,667,416 |
9 | I Can Only Imagine 2 | $1,516,465 | $16,197,143 |
10 | Demon Slayer: Kimetsu No Yaiba Infinity Castle | $1,330,169 | $135,849,246 |
11 | Zootopia 2 | $747,896 | $427,290,099 |
12 | Avatar: Fire and Ash | $727,834 | $402,591,433 |
13 | Protector | $723,940 | $723,940 |
14 | Enhypen: Walk the Line Summer Edition - in Cinemas | $695,992 | $1,149,451 |
15 | 2026 Oscar Nominated Short Films | $544,319 | $2,976,200 |
16 | Solo Mio | $493,067 | $25,056,926 |
17 | Dolly | $473,909 | $473,909 |
18 | The Man Who Lives with the King | $436,975 | $1,699,810 |
19 | How to Make a Killing | $375,496 | $7,458,101 |
20 | Sirat (2026 Re-release) | $352,583 | $1,000,322 |
"""

# =====================================================
# SCRIPT LOGIC — DO NOT TOUCH BELOW THIS LINE
# =====================================================

def money_to_int(value):
    if not value:
        return None
    return int(re.sub(r"[^\d]", "", value))

rows = []

for line in RAW_INPUT.strip().splitlines():
    if "|" not in line:
        continue

    parts = [p.strip() for p in line.split("|")]
    if len(parts) < 5:
        continue

    rank, title, weekend, total, release = parts[:5]

    rows.append({
        "rank": int(rank),
        "title": title,
        "weekendGross": money_to_int(weekend),
        "totalGross": money_to_int(total),
        "releaseDate": release
    })

rows = sorted(rows, key=lambda x: x["rank"])[:20]

OUTPUT.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(rows, f, indent=2)

print(f"Saved {len(rows)} movies → {OUTPUT}")
