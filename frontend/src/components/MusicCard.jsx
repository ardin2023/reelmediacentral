import { useState } from "react";
import { searchMusic } from "../api/music.js";

export default function MusicCard({ item, isPrimary, onChangeItem }) {
  const [local, setLocal] = useState("");

  async function handleLocal(e) {
    e.preventDefault();
    if (!local.trim()) return;

    const results = await searchMusic(local.trim());
    if (results && results.length > 0) {
      onChangeItem(results[0]);
    }
  }

  return (
    <div className={`movie-card ${isPrimary ? "movie-card--primary" : ""}`}>
      
      <form onSubmit={handleLocal} className="card-search">
        <input
          type="text"
          placeholder="Search song/album..."
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>

      <h2 className="movie-title">{item.title}</h2>
      <p className="movie-year">{item.artist}</p>

      <img src={item.cover} className="poster" />

      <div className="movie-meta">
        <p><strong>Album:</strong> {item.album}</p>
        <p><strong>Release:</strong> {item.release}</p>
        <p><strong>Genre:</strong> {item.genre}</p>
      </div>

    </div>
  );
}
