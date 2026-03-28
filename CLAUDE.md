# CLAUDE Notes

## Site overview

ReelMediaCentral is a media tracking and charts site covering movies, music, podcasts, books, streaming, and box office. It's a React SPA with a shared top nav and footer. All pages use a consistent table/dropdown pattern for browsing weekly data.

---

## Pages

### `/media-awards` — Media Awards
Oscar 2026 prediction tracker. Shows a ranked top 10 for Best Picture and all major Oscar categories. Horizontally scrollable pill navigation to jump between categories. Includes a "Formula used" drawer that explains the scoring/prediction methodology. Most fully built page on the site.

### `/music-charts` — Music Charts
Top song charts. Dropdown to switch between sources: **Spotify (Global)** and **Apple Music (US)** are live; iTunes and Amazon Music are listed as "Coming soon." Table shows rank, song, and artist. Data comes from bundled JSON files updated manually via fetch scripts.

### `/boxoffice` — Box Office
Weekly US weekend box office results. Dropdown to select from historical weekends (driven by `boxoffice/index.json`). Table shows rank, movie title, release date, weekend gross, and total gross. Data goes back to Jan 2026, updated manually.

### `/podcast-charts` — Podcast Charts
Top podcast rankings for Apple Podcasts and Spotify US. Dropdown to switch primary sort. Table shows both platforms' ranks side by side. Data auto-updates weekly via GitHub Actions. See full data flow in the Podcast Charts section below.

### `/streaming` — Streaming Hits
Weekly top streaming shows. Dropdown to select week. Table shows top 10: rank, title, platform, weekly views. Data is weekly-indexed JSON (same pattern as box office). Updated manually via `fetch_streaming_data.py`.

### `/book-sellers` — Book Sellers
Weekly bestseller list. Dropdown to select week. Table shows rank, book (with cover art fetched from OpenLibrary), author, and weekly sales. Cover images are loaded lazily and fall back to a placeholder. Updated manually.

### `/social-buzz` — Social Buzz
Weekly social/trending topics table. Shows rank, topic, type/category, buzz score, and week-over-week change. Top 10 displayed. Data from `social-buzz.json` — manual update, early-stage page.

### `/dashboards` — Top Trends *(nav label)*
Industry analytics dashboard for film. Six chart panels in a grid:
- Best Picture Winners: Box Office
- Movie Release Volume Per Year
- Average Movie Runtime Per Year
- Genre Popularity Over Time
- Revenue Per Genre
- Seasonal Movie Trends

All charts pull from TMDB via JS API helpers on load.

### `/movies` — Movies *(disabled)*
Previously a movie search + detail page. Currently shows a blank placeholder. Original implementation is commented out in `Movies.jsx`.

### `/music` — Music *(disabled)*
Previously a music search + cards page. Shows "Coming Soon." Original implementation commented out.

### `/games` — Games *(disabled)*
Previously a games search + comparison page (powered by RAWG API). Shows "Coming Soon." Original implementation commented out.

### `/books` — Books *(disabled)*
Previously a book search + results page. Shows "Coming Soon." Original implementation commented out.

---

## GitHub repo

- Remote: `https://github.com/ardin2023/reelmediacentral.git`
- Branch: `main`
- Repo was initialized and first pushed in March 2026

## Project structure

```
reelmediacentral/
├── .github/workflows/          # GitHub Actions (automated data updates)
├── frontend/
│   ├── public/data/            # Static JSON data files served to the browser
│   ├── scripts/                # Python fetch scripts (run manually or via CI)
│   ├── src/
│   │   ├── api/                # JS data-fetching helpers
│   │   ├── components/         # Shared React components
│   │   └── pages/              # One file per route
│   ├── .env                    # API keys — gitignored, never committed
│   ├── .env.example            # Placeholder template for collaborators
│   ├── config.php              # PHP API keys — gitignored, never committed
│   └── config.example.php      # Placeholder template for collaborators
└── CLAUDE.md
```

## API keys

All keys are gitignored. Never hardcode them in source files.

| Key | Location | Used by |
|---|---|---|
| `VITE_TMDB_API_KEY` | `frontend/.env` | TMDB movie data |
| `VITE_RAWG_API_KEY` | `frontend/.env` | RAWG games API (`src/api/games.js` reads via `import.meta.env`) |
| `OMDB_API_KEY` | `frontend/config.php` | OMDB proxy (`proxy.php` reads via `require_once config.php`) |

When deploying or onboarding: copy `.env.example` → `.env` and `config.example.php` → `config.php`, then fill in real keys.

## Data update pattern

Two approaches are in use depending on the data source:

**Bundled JSON** (box office, music, streaming, book sellers)
- Python script in `frontend/scripts/` fetches data and writes to `frontend/public/data/`
- JSON is committed to the repo and served as a static asset
- Run scripts manually; no automation yet

**Live fetch from GitHub raw** (Apple Podcasts, Spotify Podcasts)
- Python script writes JSON to `frontend/public/data/`
- GitHub Actions commits the updated file weekly (see Podcast Charts section for full details)
- The page fetches directly from `raw.githubusercontent.com` at load time — no rebuild or redeploy needed

## GitHub Actions

### `update-apple-podcasts.yml`
- **Schedule**: every Monday at 08:00 UTC
- **Trigger**: also has `workflow_dispatch` for manual runs via the Actions tab
- **What it does**: runs `fetchApplePodcastCharts.py`, commits `podcasts-apple.json` back to `main` with `[skip ci]`
- Only commits if the data actually changed

### `update-spotify-podcasts.yml`
- **Schedule**: every Monday at 09:00 UTC (1 hour after Apple to avoid commit conflicts)
- **Trigger**: also has `workflow_dispatch` for manual runs via the Actions tab
- **What it does**: runs `fetchSpotifyPodcastCharts.py`, commits `podcasts-spotify.json` back to `main` with `[skip ci]`
- Only commits if the data actually changed

## feature: Podcast Charts

**Page:** `frontend/src/pages/PodcastCharts.jsx`

Dropdown lets the user switch the primary ranking between Apple Podcasts and Spotify. Both platforms' ranks are shown side-by-side in the table. "Last updated" reflects the `date` field from whichever platform's JSON is active.

---

### End-to-end data flow

```
External API
    │
    │  (Python fetch script — runs in GitHub Actions every Monday)
    ▼
GitHub repo  ←──────────────────────────────────────────────────┐
frontend/public/data/podcasts-apple.json                        │
frontend/public/data/podcasts-spotify.json                      │
    │                                                            │
    │  (GitHub Actions commits updated JSON with [skip ci])  ───┘
    │
    │  (browser fetches at page load via raw.githubusercontent.com)
    ▼
PodcastCharts.jsx  →  usePodcastData("apple",   APPLE_ROWS_FALLBACK)
                   →  usePodcastData("spotify", SPOTIFY_ROWS_FALLBACK)
                   →  merges both datasets by podcast name
                   →  sorts by selected primary platform
                   →  renders table with both ranks side-by-side
```

No rebuild or redeploy is needed when data updates — the page always fetches the latest JSON directly from GitHub.

---

### Apple Podcasts

| | |
|---|---|
| **Source API** | iTunes RSS — `itunes.apple.com/us/rss/toppodcasts/limit=20/json` |
| **Fetch script** | `frontend/scripts/fetchApplePodcastCharts.py` |
| **Output file** | `frontend/public/data/podcasts-apple.json` |
| **GitHub Actions** | `.github/workflows/update-apple-podcasts.yml` — every Monday 08:00 UTC |
| **Frontend URL** | `https://raw.githubusercontent.com/ardin2023/reelmediacentral/main/frontend/public/data/podcasts-apple.json` |
| **Fallback** | `APPLE_ROWS_FALLBACK` array in `PodcastCharts.jsx` (data as of Feb 2026) |

JSON shape:
```json
{
  "date": "2026-03-28",
  "platform": "Apple Podcasts",
  "scope": "US",
  "source": "Apple Marketing Tools",
  "items": [
    { "rank": 1, "name": "The Daily", "publisher": "The New York Times" },
    ...
  ]
}
```

> **Note:** `rss.applemarketingtools.com/api/v2/us/podcasts/...` returns 404. The iTunes RSS URL above is the working endpoint.

---

### Spotify Podcasts

| | |
|---|---|
| **Source API** | `podcastcharts.byspotify.com/api/charts/top?region=US` |
| **Fetch script** | `frontend/scripts/fetchSpotifyPodcastCharts.py` |
| **Output file** | `frontend/public/data/podcasts-spotify.json` |
| **GitHub Actions** | `.github/workflows/update-spotify-podcasts.yml` — every Monday 09:00 UTC |
| **Frontend URL** | `https://raw.githubusercontent.com/ardin2023/reelmediacentral/main/frontend/public/data/podcasts-spotify.json` |
| **Fallback** | `SPOTIFY_ROWS_FALLBACK` array in `PodcastCharts.jsx` (data as of Feb 2026) |

JSON shape: same structure as Apple, with `"platform": "Spotify"`.

> **Note:** The API ignores the `limit` query param and returns ~200 results. The script slices to `[:20]` before writing.

---

### GitHub Actions schedules

Apple runs at 08:00 UTC, Spotify at 09:00 UTC — staggered by one hour to prevent both workflows committing to `main` simultaneously. Both workflows:
- install `requests` via pip
- run the fetch script from repo root (scripts use `Path(__file__)` for portable output paths)
- only commit if the JSON actually changed (`git diff --cached --quiet ||`)
- tag commits with `[skip ci]` to prevent re-triggering the workflow
- can be triggered manually from the Actions tab via `workflow_dispatch`

---

### Frontend hook: `usePodcastData`

```js
function usePodcastData(platform, fallback) {
  // fetches podcasts-{platform}.json from raw.githubusercontent.com
  // on error, sets items to the provided fallback array
  // returns { items, date }
}
```

Both `appleData` and `spotifyData` are loaded in parallel on mount. The merge logic in `useMemo` joins them by podcast name (using `NAME_ALIASES` to normalize name variants like "Up First from NPR" → "Up First").

## feature: Streaming Hits

- page: `frontend/src/pages/Streaming.jsx`
- route: `/streaming`
- nav links in `frontend/src/App.jsx` and `frontend/src/components/TopNav.jsx`
- data file: `frontend/public/data/top-streaming-shows.json`
- generation script: `frontend/scripts/fetch_streaming_data.py`
- weekly context fields: `weekOf`, `date` (last updated)
- table shows top 10 rows using `items.slice(0, 10)`

## known issues / cleanup needed

- `frontend/src/phpinfo.php` exists in the repo — exposes PHP environment info and should be deleted before the site goes public

## build check

- `cd frontend && npm run build` passes.

## next improvements

- auto index generation for weekly data (BoxOffice/music/podcast/streaming)
- automate Spotify podcast charts (done)
- optional shared chart component/logic for similar data shapes

## new section candidates

- Streaming Hits (done): weekly top shows, route `/streaming`, existing table+dropdown pattern.
- Social / Buzz metrics (needs review): sentiment/volume charts from Twitter/Reddit/Google Trends.
- Franchise / IP performance tracker (needs review): revenue+engagement across movies/games/books.
- Genre mix dashboard (needs review): cross-category genre trends, maybe on /dashboards.
- International regional charts (needs review): localized box office/music/podcasts by region/country.
