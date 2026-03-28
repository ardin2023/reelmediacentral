// src/api/getGenreTrends.js

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }
  return res.json();
}

// Get map: genre_id -> genre_name
async function getGenreMap() {
  if (!API_KEY) {
    console.warn("Missing TMDB API key (VITE_TMDB_API_KEY)");
    return {};
  }

  const url = `${TMDB_BASE}/genre/movie/list?api_key=${API_KEY}&language=en-US`;
  const data = await fetchJson(url);
  const map = {};
  for (const g of data.genres || []) {
    map[g.id] = g.name;
  }
  return map;
}

/**
 * Returns genre popularity over time for the last `yearsBack` years.
 *
 * Shape:
 * {
 *   rows: [
 *     { year: "2016", Action: 8, Drama: 5, Animation: 3 },
 *     ...
 *   ],
 *   genres: ["Action", "Drama", "Animation"]
 * }
 */
export async function getGenreTrends(yearsBack = 10) {
  if (!API_KEY) {
    console.warn("Missing TMDB API key, genre trends will be empty.");
    return { rows: [], genres: [] };
  }

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - yearsBack + 1;

  const genreMap = await getGenreMap();
  const totals = {}; // total over all years per genre
  const byYear = {}; // { [year]: { [genreName]: count } }

  for (let year = startYear; year <= currentYear; year++) {
    const params = new URLSearchParams({
      api_key: API_KEY,
      sort_by: "revenue.desc",
      primary_release_year: String(year),
      include_adult: "false",
      page: "1", // top 20 per year is enough for a pattern
      region: "US",
    });

    const url = `${TMDB_BASE}/discover/movie?${params.toString()}`;
    const data = await fetchJson(url);

    const yearCounts = {};
    for (const movie of data.results || []) {
      for (const gid of movie.genre_ids || []) {
        const name = genreMap[gid];
        if (!name) continue;
        yearCounts[name] = (yearCounts[name] || 0) + 1;
        totals[name] = (totals[name] || 0) + 1;
      }
    }

    byYear[year] = yearCounts;
  }

  // Pick top 4 genres overall to keep the chart readable
  const topGenres = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);

  const rows = [];
  for (let year = startYear; year <= currentYear; year++) {
    const row = { year: String(year) };
    const counts = byYear[year] || {};
    for (const g of topGenres) {
      row[g] = counts[g] || 0;
    }
    rows.push(row);
  }

  return { rows, genres: topGenres };
}
