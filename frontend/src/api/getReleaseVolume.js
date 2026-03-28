// src/api/getReleaseVolume.js
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
 *   { year: 2016, releases: 512 },
 *   { year: 2017, releases: 545 },
 *   ...
 * ]
 */
export async function getReleaseVolume(yearsBack = 10) {
  const now = new Date().getFullYear();
  const start = now - yearsBack + 1;

  const results = [];

  for (let year = start; year <= now; year++) {
    const url = `${TMDB}/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&vote_count.gte=50`;
    const data = await fetchJson(url);

    results.push({
      year,
      releases: data.total_results || 0
    });
  }

  return results;
}
