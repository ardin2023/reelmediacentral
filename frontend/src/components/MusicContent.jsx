import { useEffect, useState } from "react";
import MusicCard from "./MusicCard.jsx";
import { searchMusic } from "../api/music.js";

const DEFAULT_TRACK = "All I Want For Christmas Is You Mariah Carey";

export default function MusicContent() {
  const [query, setQuery] = useState(DEFAULT_TRACK);
  const [primary, setPrimary] = useState(null);
  const [compare, setCompare] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMusic(DEFAULT_TRACK);
  }, []);

  async function loadMusic(q) {
    const results = await searchMusic(q);
    if (!results || results.length === 0) {
      setError("No results found.");
      return;
    }
    setPrimary(results[0]);
    setCompare(results.slice(1, 4));
    setError("");
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    loadMusic(query.trim());
  }

  return (
    <>
      <section className="search-section">
        <form id="movieForm" onSubmit={handleSearch}>
          <input
            id="movieTitle"
            placeholder="Search song or album..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Get Info</button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="grid-section">
        <div className="movie-grid">
          {primary && <MusicCard item={primary} isPrimary />}
          {compare.map((m, i) => (
            <MusicCard key={i} item={m} />
          ))}
        </div>
      </section>
    </>
  );
}
