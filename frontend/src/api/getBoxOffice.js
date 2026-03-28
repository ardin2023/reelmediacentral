// frontend/src/api/getBoxOffice.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB = "https://api.themoviedb.org/3";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB request failed");
  return res.json();
}

export async function getBoxOffice() {
  const url =
    `${TMDB}/movie/now_playing?api_key=${API_KEY}&region=US&page=1`;

  const data = await fetchJson(url);

  return {
    items: data.results.slice(0, 10).map((m, i) => ({
      rank: i + 1,
      title: m.title,
      releaseDate: m.release_date,
      totalGross: null
    }))
  };
}
