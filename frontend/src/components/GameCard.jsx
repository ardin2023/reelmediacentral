// src/components/GameCard.jsx

import { useState } from "react";
import { fetchGameByName } from "../api/games.js";

export default function GameCard({ game, isPrimary, onChangeGame }) {
  const [localSearch, setLocalSearch] = useState("");
  const [loading, setLoading] = useState(false);

  if (!game) return null;

  const handleLocalSearch = async (e) => {
    e.preventDefault();
    const term = localSearch.trim();
    if (!term) return;

    try {
      setLoading(true);
      const result = await fetchGameByName(term);
      if (result && onChangeGame) {
        onChangeGame(result);
        setLocalSearch("");
      }
    } catch (err) {
      console.error("Game update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const {
    title,
    cover,
    released,
    rating,
    platforms,
    genres,
    publishers,
    description,
  } = game;

  // 🔥 FIX: CLEAN + TRUNCATE RAWG TEXT
  const cleanDescription = (description || "—")
    .replace(/https?:\/\/\S+/g, "")        // remove URLs
    .replace(/\s+/g, " ")                  // collapse whitespace
    .trim();

  const shortDescription =
    cleanDescription.length > 220
      ? cleanDescription.slice(0, 217) + "…"
      : cleanDescription;

  return (
    <div className={`movie-card ${isPrimary ? "movie-card--primary" : ""}`}>

      {/* Inline search */}
      <form onSubmit={handleLocalSearch} className="card-search">
        <input
          type="text"
          placeholder="Search game..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "…" : "Update"}
        </button>
      </form>

      <h2 className="movie-title">{title || "Untitled game"}</h2>

      <p className="movie-year">
        {released ? new Date(released).getFullYear() : "—"}
      </p>

      {cover && <img src={cover} alt={title} className="poster" />}

      <div className="movie-meta">
        <p><strong>Platform:</strong> {platforms?.join(", ") || "—"}</p>
        <p><strong>Publisher:</strong> {publishers?.join(", ") || "—"}</p>
        <p><strong>Genre:</strong> {genres?.join(", ") || "—"}</p>
        <p><strong>Release:</strong> {released || "—"}</p>
        <p><strong>Rating:</strong> {rating ?? "—"}</p>

        <p className="game-description">
          <strong>Description:</strong> {shortDescription}
        </p>
      </div>
    </div>
  );
}
