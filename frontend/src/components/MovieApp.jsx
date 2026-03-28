// src/components/MovieApp.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// -----------------------------
// HELPERS
// -----------------------------
function parseBoxOffice(boxOffice) {
  if (!boxOffice || boxOffice === "N/A") return null;
  const cleaned = boxOffice.replace(/\$/g, "").replace(/,/g, "");
  const value = parseInt(cleaned, 10);
  return Number.isNaN(value) ? null : value;
}

function getInflationMultiplier(yearStr) {
  const year = parseInt(yearStr, 10);
  if (!year || Number.isNaN(year)) return 1.0;
  if (year < 1985) return 4.0;
  if (year < 1995) return 2.5;
  if (year < 2005) return 1.8;
  if (year < 2015) return 1.3;
  if (year < 2020) return 1.15;
  if (year < 2024) return 1.05;
  return 1.0;
}

function formatMoney(value) {
  if (value == null) return "—";
  return `$${value.toLocaleString("en-US")}`;
}

// -----------------------------
// DEFAULT MOVIE SETS
// -----------------------------
const DEFAULT_SETS = [
  // ⭐ Existing Sets
  {
    main: "Dune: Part Two",
    comps: ["Oppenheimer", "Barbie", "Avatar: The Way of Water"],
  },
  {
    main: "Inside Out 2",
    comps: ["Elemental", "Frozen II", "The Super Mario Bros. Movie"],
  },
  {
    main: "Mission: Impossible - Dead Reckoning Part One",
    comps: ["Top Gun: Maverick", "No Time to Die", "John Wick: Chapter 4"],
  },

  // ⭐ NEW SET 1 — Superhero / Blockbuster
  {
    main: "Spider-Man: No Way Home",
    comps: [
      "The Batman",
      "Black Panther",
      "Guardians of the Galaxy Vol. 3"
    ],
  },

  // ⭐ NEW SET 2 — Oscar-winning drama set
  {
    main: "Everything Everywhere All at Once",
    comps: [
      "The Whale",
      "Nomadland",
      "The Fabelmans"
    ],
  },

  // ⭐ NEW SET 3 — Sci-Fi classics & modern hits
  {
    main: "Interstellar",
    comps: [
      "Inception",
      "The Martian",
      "Gravity"
    ],
  },
];

function pickRandomSet() {
  const i = Math.floor(Math.random() * DEFAULT_SETS.length);
  return DEFAULT_SETS[i];
}

// -----------------------------
// API CALL
// -----------------------------
async function fetchMovieByTitle(title) {
  const res = await fetch(`/proxy.php?t=${encodeURIComponent(title)}`);
  const data = await res.json();
  if (data.Response === "False") return null;
  return data;
}

function chooseSimilarTitles(movie) {
  const genre = movie?.Genre || "";

  const animation = ["Inside Out 2", "The Super Mario Bros. Movie", "Frozen II"];
  const action = ["Top Gun: Maverick", "John Wick: Chapter 4", "No Time to Die"];
  const drama = ["Oppenheimer", "Barbie", "Joker"];

  if (genre.includes("Animation")) return animation;
  if (genre.includes("Action") || genre.includes("Adventure")) return action;
  if (genre.includes("Drama")) return drama;

  return pickRandomSet().comps;
}

// -----------------------------
// MOVIE CARD
// -----------------------------
function MovieCard({ movie, isPrimary, onChangeMovie }) {
  const [localSearch, setLocalSearch] = useState("");

  const handleLocalSearch = async (e) => {
    e.preventDefault();
    if (!localSearch.trim()) return;

    const result = await fetchMovieByTitle(localSearch.trim());
    if (result) onChangeMovie(result);
  };

  if (!movie) return null;

  const raw = parseBoxOffice(movie.BoxOffice);
  const mult = getInflationMultiplier(movie.Year);
  const adjusted = raw != null ? Math.round(raw * mult) : null;

  return (
    <div className={`movie-card ${isPrimary ? "movie-card--primary" : ""}`}>
      <form onSubmit={handleLocalSearch} className="card-search">
        <input
          type="text"
          placeholder="Search movie..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>

      <h2 className="movie-title">{movie.Title}</h2>
      <p className="movie-year">{movie.Year}</p>

      <img
        src={
          movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "/default-poster.jpg"
        }
        className="poster"
      />

      <div className="movie-meta">
        <p><strong>Date Released:</strong> {movie.Released}</p>
        <p><strong>Box Office:</strong> {movie.BoxOffice || "—"}</p>
        <p><strong>Adjusted:</strong> {adjusted ? formatMoney(adjusted) : "—"}</p>
        <p><strong>Studio:</strong> {movie.Production}</p>
        <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
        <p><strong>Rotten Tomatoes:</strong> {movie.Ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value || "—"}</p>
      </div>
    </div>
  );
}

// -----------------------------
// MAIN MOVIE APP
// -----------------------------
export default function MovieApp() {
  const location = useLocation();
  const [searchTitle, setSearchTitle] = useState("");
  const [primaryMovie, setPrimaryMovie] = useState(null);
  const [compareMovies, setCompareMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const set = pickRandomSet();

        const main = await fetchMovieByTitle(set.main);
        const compsRaw = await Promise.all(
          set.comps.map((t) => fetchMovieByTitle(t))
        );

        setPrimaryMovie(main);
        setCompareMovies(compsRaw.filter(Boolean).slice(0, 3));
        setSearchTitle(set.main);
      } catch {
        setError("Could not load default movies.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTitle.trim()) return;

    try {
      setLoading(true);
      setError("");

      const main = await fetchMovieByTitle(searchTitle);
      if (!main) {
        setError("Movie not found.");
        return;
      }

      setPrimaryMovie(main);

      const similar = chooseSimilarTitles(main);
      const compsRaw = await Promise.all(
        similar.map((t) => fetchMovieByTitle(t))
      );

      setCompareMovies(compsRaw.filter(Boolean).slice(0, 3));
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SEARCH SECTION */}
      <section className="search-section">
        <form id="movieForm" onSubmit={handleSearch}>
          <input
            id="movieTitle"
            placeholder="Enter movie name"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Get Info"}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </section>

      {/* MOVIE GRID */}
      <section className="grid-section">
        <div className="movie-grid">
          <MovieCard
            movie={primaryMovie}
            isPrimary={true}
            onChangeMovie={(newMovie) => setPrimaryMovie(newMovie)}
          />

          {compareMovies.map((m, idx) => (
            <MovieCard
              key={idx}
              movie={m}
              isPrimary={false}
              onChangeMovie={(newMovie) => {
                const updated = [...compareMovies];
                updated[idx] = newMovie;
                setCompareMovies(updated);
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
