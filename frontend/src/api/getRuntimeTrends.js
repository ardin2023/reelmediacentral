// src/api/getRuntimeTrends.js
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
 *   { year: 2016, avgRuntime: 112 },
 *   { year: 2017, avgRuntime: 118 },
 *   ...
 * ]
 */
export async function getRuntimeTrends(yearsBack = 10) {
  const now = new Date().getFullYear();
  const start = now - yearsBack + 1;

  const results = [];

  for (let year = start; year <= now; year++) {
    // Step 1: Discover top movies for that year
    const discoverUrl = `${TMDB}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&page=1`;

    const discover = await fetchJson(discoverUrl);
    const movies = (discover.results || []).slice(0, 10); // sample 10

    let runtimes = [];

    // Step 2: Fetch details for each movie
    for (const m of movies) {
      try {
        const detailsUrl = `${TMDB}/movie/${m.id}?api_key=${API_KEY}`;
        const details = await fetchJson(detailsUrl);

        if (details.runtime) {
          runtimes.push(details.runtime);
        }
      } catch (e) {
        // skip
      }
    }

    const avg =
      runtimes.length > 0
        ? Math.round(runtimes.reduce((a, b) => a + b, 0) / runtimes.length)
        : 0;

    results.push({
      year,
      avgRuntime: avg,
    });
  }

  return results;
}
