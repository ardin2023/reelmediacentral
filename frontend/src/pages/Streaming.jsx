// src/pages/Streaming.jsx

import { useEffect, useState } from "react";
import App from "../App.jsx";
import "../boxoffice.css";

export default function StreamingPage() {
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const [weekOf, setWeekOf] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  useEffect(() => {
    fetch("/data/streaming/index.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Streaming index missing");
        }
        setWeeks(data);
        setSelectedWeek(data[0].id);
      })
      .catch(() => {
        // Fallback for legacy single-file mode
        setWeeks([{ id: "latest", label: "Latest" }]);
        setSelectedWeek("latest");
      });
  }, []);

  useEffect(() => {
    if (!selectedWeek) return;

    setLoaded(false);
    setError("");

    const url = selectedWeek === "latest"
      ? "/data/top-streaming-shows.json"
      : `/data/streaming/${selectedWeek}.json`;

    fetch(url, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data.items)) {
          throw new Error("Streaming data format invalid");
        }
        setItems(data.items);
        setWeekOf(data.weekOf || "");
        setUpdatedDate(data.date || "");
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load streaming data");
        setLoaded(true);
      });
  }, [selectedWeek]);

  return (
    <App
      page={
        <section className="boxoffice-page">
          <h1 className="page-title">Streaming Hits</h1>

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
                    <th>Title</th>
                    <th>Platform</th>
                    <th>Weekly Views</th>
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 10).map((item) => (
                    <tr key={`${item.rank}-${item.title}`}>
                      <td>{item.rank}</td>
                      <td>{item.title}</td>
                      <td>{item.platform}</td>
                      <td>{item.weeklyViews?.toLocaleString?.("en-US") ?? "—"}</td>
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
