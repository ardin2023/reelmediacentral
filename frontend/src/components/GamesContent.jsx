// src/components/GamesContent.jsx

import { useEffect, useState } from "react";
import GameCard from "./GameCard.jsx";
import { fetchGameSet } from "../api/games.js";

const DEFAULT_GAME_TITLE = "The Legend of Zelda: Breath of the Wild";

export default function GamesContent() {
  const [searchTitle, setSearchTitle] = useState(DEFAULT_GAME_TITLE);
  const [primaryGame, setPrimaryGame] = useState(null);
  const [compareGames, setCompareGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadGames(title) {
    try {
      setLoading(true);
      setError("");

      const { main, comps } = await fetchGameSet(title);

      if (!main) {
        setPrimaryGame(null);
        setCompareGames([]);
        setError("Game not found.");
        return;
      }

      setPrimaryGame(main);
      setCompareGames(comps || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading games.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames(DEFAULT_GAME_TITLE);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTitle.trim()) return;
    await loadGames(searchTitle.trim());
  };

  return (
    <>
      <section className="search-section">
        <form id="movieForm" onSubmit={handleSearch}>
          <input
            id="movieTitle"
            placeholder="Search game..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Get Info"}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="grid-section">
        <div className="movie-grid">
          {primaryGame && (
            <GameCard game={primaryGame} isPrimary={true} />
          )}

          {compareGames.map((g, idx) => (
            <GameCard key={idx} game={g} isPrimary={false} />
          ))}
        </div>
      </section>
    </>
  );
}
