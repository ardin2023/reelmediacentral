import { useEffect, useState } from "react";
import App from "../App.jsx";
import "../boxoffice.css";

export default function BookSellersPage() {
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [weekOf, setWeekOf] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  useEffect(() => {
    fetch("/data/book-sellers/index.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Book sellers index missing");
        }
        setWeeks(data);
        setSelectedWeek(data[0].id);
      })
      .catch(() => {
        setWeeks([{ id: "latest", label: "Latest" }]);
        setSelectedWeek("latest");
      });
  }, []);

  useEffect(() => {
    if (!selectedWeek) return;

    setLoaded(false);
    setError("");

    let active = true;

    async function enrichCovers(baseItems) {
      const promises = baseItems.map(async (item) => {
        if (item.cover) return item;
        const query = encodeURIComponent(`${item.title} ${item.author || ""}`);
        const url = `https://openlibrary.org/search.json?q=${query}&limit=1`;

        try {
          const res = await fetch(url);
          if (!res.ok) return { ...item };
          const data = await res.json();
          const doc = data.docs?.[0];
          if (doc?.cover_i) {
            return {
              ...item,
              cover: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
            };
          }
        } catch (err) {
          console.warn("OpenLibrary cover lookup failed", err);
        }

        return { ...item };
      });

      const enriched = await Promise.all(promises);
      if (active) setItems(enriched);
    }

    const url = selectedWeek === "latest"
      ? "/data/top-book-sellers.json"
      : `/data/book-sellers/${selectedWeek}.json`;

    fetch(url, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data.items)) {
          throw new Error("Book sellers data format invalid");
        }

        setItems(data.items);
        setWeekOf(data.weekOf || "");
        setUpdatedDate(data.date || "");
        setLoaded(true);

        enrichCovers(data.items);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load book sellers data");
        setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [selectedWeek]);

  return (
    <App
      page={
        <section className="boxoffice-page">
          <h1 className="page-title">Book Sellers</h1>

          <div style={{ marginTop: "12px", marginBottom: "12px" }}>
            <label style={{ marginRight: "8px", fontWeight: 600 }}>Week:</label>
            <select
              className="fluent-dropdown-btn"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              {weeks.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          {(weekOf || updatedDate) && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", color: "#666" }}>
              {weekOf && <span>Week of: {new Date(weekOf).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>}
              {updatedDate && <span>Last updated: {new Date(updatedDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>}
            </div>
          )}

          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {!loaded && <p>Loading…</p>}

          {loaded && !error && items.length === 0 && <p>No data available.</p>}

          {loaded && !error && items.length > 0 && (
            <div className="boxoffice-table-wrapper">
              <table className="boxoffice-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Weekly Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 20).map((item) => (
                    <tr key={`${item.rank}-${item.title}`}>
                      <td>{item.rank}</td>
                      <td>
                        <div className="movie-cell">
                          <img
                            src={item.cover || "/vite.svg"}
                            alt={item.title}
                            className="movie-poster"
                            loading="lazy"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/vite.svg'; }}
                          />
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td>{item.author || "—"}</td>
                      <td>{item.weeklySales?.toLocaleString?.("en-US") ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      }
    />
  );
}
