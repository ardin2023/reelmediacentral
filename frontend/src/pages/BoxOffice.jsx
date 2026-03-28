// src/pages/BoxOffice.jsx

import { useEffect, useState } from "react";
import App from "../App.jsx";
import "../boxoffice.css";

function formatMoney(value) {
  if (value == null) return "—";
  return `$${value.toLocaleString("en-US")}`;
}

function BoxOfficeContent() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const [weekends, setWeekends] = useState([]);
  const [selectedWeekend, setSelectedWeekend] = useState("");

  // Fetch available weekends (index)
  useEffect(() => {
    fetch("/data/boxoffice/index.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Weekend index is empty or invalid");
        }
        setWeekends(data);
        setSelectedWeekend(data[0].id); // default to latest
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  // Fetch box office data when weekend changes
  useEffect(() => {
    if (!selectedWeekend) return;

    fetch(`/data/boxoffice/${selectedWeekend}.json`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Box office data is not an array");
        }
        setRows(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [selectedWeekend]);

  return (
    <section className="boxoffice-page">
      <h1 className="page-title">Box Office</h1>

      {/* REAL DROPDOWN */}
      <div className="fluent-dropdown">
        <select
          className="fluent-dropdown-btn"
          value={selectedWeekend}
          onChange={(e) => setSelectedWeekend(e.target.value)}
        >
          {weekends.map((w) => (
            <option key={w.id} value={w.id}>
              {w.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!error && rows.length === 0 && <p>Loading…</p>}

      {!error && rows.length > 0 && (
        <div className="boxoffice-table-wrapper">
          <table className="boxoffice-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Movie</th>
                <th>Released</th>
                <th>Weekend Gross</th>
                <th>Total Gross</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((movie) => (
                <tr key={movie.rank}>
                  <td>{movie.rank}</td>
                  <td>{movie.title}</td>
                  <td>{movie.releaseDate}</td>
                  <td>{formatMoney(movie.weekendGross)}</td>
                  <td>{formatMoney(movie.totalGross)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function BoxOfficePage() {
  return <App page={<BoxOfficeContent />} />;
}
