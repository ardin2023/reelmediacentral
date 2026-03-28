// src/api/games.js

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

async function fetchJson(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    console.error("RAWG API error:", res.status, res.statusText);
    throw new Error("RAWG request failed");
  }
  return await res.json();
}

function normalizeGame(raw) {
  return {
    id: raw.id,
    title: raw.name,
    cover: raw.background_image || "",
    released: raw.released || "",
    rating: raw.metacritic ?? raw.rating ?? null,
    platforms: (raw.platforms || [])
      .map((p) => p.platform?.name || p.name)
      .filter(Boolean),
    genres: (raw.genres || []).map((g) => g.name).filter(Boolean),
    publishers: (raw.publishers || []).map((p) => p.name).filter(Boolean),
    description: (raw.description_raw || "").replace(/\s+/g, " ").trim(),
  };
}

// 🔍 Used by "Update" button on each card
export async function fetchGameByName(name) {
  if (!name) return null;

  const search = await fetchJson(
    `/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(name)}&page_size=1`
  );

  const first = search.results?.[0];
  if (!first) return null;

  const details = await fetchJson(`/games/${first.id}?key=${RAWG_API_KEY}`);
  return normalizeGame(details);
}

// 🔥 Main loader for game + comparisons
export async function fetchGameSet(name) {
  if (!name) return { main: null, comps: [] };

  // 1. MAIN SEARCH
  const search = await fetchJson(
    `/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(name)}&page_size=1`
  );

  const mainRaw = search.results?.[0];
  if (!mainRaw) return { main: null, comps: [] };

  let suggested = [];

  // 2. TRY RAWG SUGGESTED ENDPOINT
  try {
    const sugg = await fetchJson(
      `/games/${mainRaw.id}/suggested?key=${RAWG_API_KEY}&page_size=4`
    );
    suggested = sugg.results || [];
  } catch (err) {
    console.warn("RAWG suggested failed:", err);
  }

  // 3. STRONG FALLBACK — FIND SIMILAR GAMES BY GENRE
  if (!suggested.length) {
    const mainGenres = mainRaw.genres?.map((g) => g.slug).join(",") || "";

    const rel = await fetchJson(
      `/games?key=${RAWG_API_KEY}&genres=${mainGenres}&ordering=-rating&page_size=4`
    );

    suggested = rel.results.filter((g) => g.id !== mainRaw.id).slice(0, 3);
  }

  // 4. Fetch detailed info for main + comps
  const selected = [mainRaw, ...suggested].slice(0, 4);

  const detailResponses = await Promise.all(
    selected.map((g) => fetchJson(`/games/${g.id}?key=${RAWG_API_KEY}`))
  );

  const normalized = detailResponses.map(normalizeGame);

  const [main, ...comps] = normalized;

  return {
    main,
    comps: comps.slice(0, 3), // ALWAYS exactly 3
  };
}
