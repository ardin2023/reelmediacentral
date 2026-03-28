# CLAUDE Notes

This file is a local reference for the new Streaming Hits feature and maintenance improvements.

## feature: Streaming Hits
- new page: `frontend/src/pages/Streaming.jsx`
- route: `/streaming`
- nav links in `frontend/src/App.jsx` and `frontend/src/components/TopNav.jsx`
- data file: `frontend/public/data/top-streaming-shows.json`
- generation script: `frontend/scripts/fetch_streaming_data.py`
- weekly context fields:
  - `weekOf`
  - `date` (last updated)
- table now only shows top 10 rows using `items.slice(0, 10)`

## build check
- `cd frontend && npm run build` passes.

## next improvements
- auto index generation for weekly data (BoxOffice/music/podcast/streaming)
- optional shared chart component/logic for similar data shapes

## new section candidates
- Streaming Hits (done): weekly top shows, route `/streaming`, existing table+dropdown pattern.
- Social / Buzz metrics (needs review): sentiment/volume charts from Twitter/Reddit/Google Trends.
- Franchise / IP performance tracker (needs review): revenue+engagement across movies/games/books.
- Genre mix dashboard (needs review): cross-category genre trends, maybe on /dashboards.
- International regional charts (needs review): localized box office/music/podcasts by region/country.
