# CLAUDE Notes

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

**Live fetch from GitHub raw** (Apple Podcasts)
- Python script writes to `frontend/public/data/podcasts-apple.json`
- GitHub Actions commits the updated file weekly (see below)
- The page fetches directly from `raw.githubusercontent.com` at load time — no rebuild or redeploy needed
- URL: `https://raw.githubusercontent.com/ardin2023/reelmediacentral/main/frontend/public/data/podcasts-apple.json`

## GitHub Actions

### `update-apple-podcasts.yml`
- **Schedule**: every Monday at 08:00 UTC
- **Trigger**: also has `workflow_dispatch` for manual runs via the Actions tab
- **What it does**: runs `fetchApplePodcastCharts.py`, commits `podcasts-apple.json` back to `main` with `[skip ci]`
- Only commits if the data actually changed

## feature: Podcast Charts

- page: `frontend/src/pages/PodcastCharts.jsx`
- Apple data: fetched live from `raw.githubusercontent.com` (see above), falls back to hardcoded list if unavailable
- Spotify data: still hardcoded in `SPOTIFY_ROWS` (not yet automated)
- fetch script: `frontend/scripts/fetchApplePodcastCharts.py` — uses iTunes RSS API (`itunes.apple.com/us/rss/toppodcasts/limit=20/json`)
- **Note**: the Apple Marketing Tools RSS URL (`rss.applemarketingtools.com/api/v2/us/podcasts/...`) returns 404 for podcasts — use the iTunes RSS URL instead
- "Last updated" date is read from the JSON `date` field, not hardcoded

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
- automate Spotify podcast charts (same pattern as Apple)
- optional shared chart component/logic for similar data shapes

## new section candidates

- Streaming Hits (done): weekly top shows, route `/streaming`, existing table+dropdown pattern.
- Social / Buzz metrics (needs review): sentiment/volume charts from Twitter/Reddit/Google Trends.
- Franchise / IP performance tracker (needs review): revenue+engagement across movies/games/books.
- Genre mix dashboard (needs review): cross-category genre trends, maybe on /dashboards.
- International regional charts (needs review): localized box office/music/podcasts by region/country.
