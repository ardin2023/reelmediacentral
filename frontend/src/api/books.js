export async function searchBooks(query) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.docs.map((b) => ({
    title: b.title,
    author: b.author_name?.[0] || "Unknown Author",
    year: b.first_publish_year || "—",
    cover: b.cover_i
      ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`
      : "/default-book.jpg",
    description: b.subtitle || "",
    rating: b.ratings_average || "—",
  }));
}
