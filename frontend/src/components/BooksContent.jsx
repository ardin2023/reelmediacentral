import { useEffect, useState } from "react";
import BookCard from "./BookCard.jsx";
import { searchBooks } from "../api/books.js";

const DEFAULT_BOOK = "Dune";

export default function BooksContent() {
  const [query, setQuery] = useState(DEFAULT_BOOK);
  const [primary, setPrimary] = useState(null);
  const [compare, setCompare] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBook(DEFAULT_BOOK);
  }, []);

  async function loadBook(title) {
    const results = await searchBooks(title);
    if (!results || results.length === 0) {
      setError("No books found.");
      return;
    }
    setPrimary(results[0]);
    setCompare(results.slice(1, 4));
    setError("");
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    loadBook(query.trim());
  }

  return (
    <>
      <section className="search-section">
        <form id="movieForm" onSubmit={handleSearch}>
          <input
            id="movieTitle"
            placeholder="Search book..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Get Info</button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="grid-section">
        <div className="movie-grid">
          {primary && <BookCard book={primary} isPrimary />}
          {compare.map((b, i) => (
            <BookCard key={i} book={b} />
          ))}
        </div>
      </section>
    </>
  );
}
