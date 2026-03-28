// src/api/getBestPictureRevenues.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB = "https://api.themoviedb.org/3";

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("TMDB error");
  return r.json();
}

export async function getBestPictureRevenues() {
  // Last 5 winners (Oscars 2020–2024)
  const winners = [
    { year: 2024, title: "Oppenheimer" },
    { year: 2023, title: "Everything Everywhere All at Once" },
    { year: 2022, title: "CODA" },
    { year: 2021, title: "Nomadland" },
    { year: 2020, title: "Parasite" }
  ];

  const results = [];

  for (const w of winners) {
    const searchUrl = `${TMDB}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(w.title)}`;
    const search = await fetchJson(searchUrl);

    const movie = search.results?.[0];
    if (!movie) {
      results.push({ year: w.year, title: w.title, revenue: 0 });
      continue;
    }

    const detailsUrl = `${TMDB}/movie/${movie.id}?api_key=${API_KEY}`;
    const details = await fetchJson(detailsUrl);

    results.push({
      year: w.year,
      title: w.title,
      revenue: details.revenue || 0,
    });
  }

  return results.reverse(); // newest at bottom
}
