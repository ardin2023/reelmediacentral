// src/api/getRevenueByYear.js

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB = "https://api.themoviedb.org/3";

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("TMDB error");
  return r.json();
}

/**
 * Returns:
 * [
 *   { year: 2016, revenue: 4560000000 },
 *   { year: 2017, revenue: 5120000000 },
 *   ...
 * ]
 */
export async function getRevenueByYear(yearsBack = 10) {
  const now = new Date().getFullYear();
  const start = now - yearsBack + 1;

  const results = [];

  for (let y = start; y <= now; y++) {
    const url = `${TMDB}/discover/movie?api_key=${API_KEY}&sort_by=revenue.desc&primary_release_year=${y}&page=1`;

    const data = await fetchJson(url);

    const top10 = (data.results || []).slice(0, 10);

    const total = top10.reduce(
      (sum, m) => sum + (m.revenue || 0),
      0
    );

    results.push({
      year: y,
      revenue: total,
    });
  }

  return results;
}
