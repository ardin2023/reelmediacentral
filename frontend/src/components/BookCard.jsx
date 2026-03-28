import { useState } from "react";
import { searchBooks } from "../api/books.js";

export default function BookCard({ book, isPrimary, onChangeBook }) {
  const [local, setLocal] = useState("");

  async function handleLocalUpdate(e) {
    e.preventDefault();
    if (!local.trim()) return;

    const results = await searchBooks(local.trim());
    if (results && results.length > 0) {
      onChangeBook(results[0]);
    }
  }

  if (!book) return null;

  return (
    <div className={`movie-card ${isPrimary ? "movie-card--primary" : ""}`}>

      {/* SEARCH-IN-CARD */}
      <form onSubmit={handleLocalUpdate} className="card-search">
        <input
          type="text"
          placeholder="Search book..."
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>

      {/* DETAILS */}
      <h2 className="movie-title">{book.title}</h2>
      <p className="movie-year">{book.year || "—"}</p>

      <img src={book.cover} className="poster" />

      <div className="movie-meta">
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Description:</strong> {book.description || "—"}</p>
        <p><strong>Rating:</strong> {book.rating}</p>
      </div>

    </div>
  );
}
