// src/pages/SocialBuzz.jsx

import { useEffect, useState } from "react";
import App from "../App.jsx";
import "../boxoffice.css";

export default function SocialBuzzPage() {
  const [items, setItems] = useState([]);
  const [weekOf, setWeekOf] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/data/social-buzz.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data.items)) {
          throw new Error("Social buzz data format invalid");
        }
        setItems(data.items);
        setWeekOf(data.weekOf || "");
        setUpdatedDate(data.date || "");
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load social buzz data");
        setLoaded(true);
      });
  }, []);

  return (
    <App
      page={
        <section className="boxoffice-page">
          <h1 className="page-title">Social Buzz</h1>

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
                    <th>Topic</th>
                    <th>Type</th>
                    <th>Buzz Score</th>
                    <th>Δ (week)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 10).map((item) => (
                    <tr key={`${item.rank}-${item.title}`}>
                      <td>{item.rank}</td>
                      <td>{item.title}</td>
                      <td>{item.category}</td>
                      <td>{item.buzzScore}</td>
                      <td>{item.trendChange != null ? `${item.trendChange > 0 ? "+" : ""}${item.trendChange}%` : "—"}</td>
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
