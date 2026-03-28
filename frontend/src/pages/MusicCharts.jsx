// src/pages/MusicCharts.jsx
import { useEffect, useState } from "react";
import App from "../App.jsx";
import "../music-charts.css";

const SOURCES = [
  { id: "spotify-global", label: "Spotify (Global)", file: "/data/music-charts-global.json", enabled: true },
  { id: "itunes", label: "iTunes (Coming soon)", file: "/data/music-charts-itunes.json", enabled: false },
  { id: "applemusic", label: "Apple Music (US)", file: "/data/music-charts-applemusic.json", enabled: true },
  { id: "amazonmusic", label: "Amazon Music (Coming soon)", file: "/data/music-charts-amazonmusic.json", enabled: false },
];

function splitArtistTrack(s) {
  if (!s) return { artist: "—", track: "—" };
  const idx = s.indexOf(" - ");
  if (idx === -1) return { artist: s, track: "—" };
  return {
    artist: s.slice(0, idx).trim(),
    track: s.slice(idx + 3).trim(),
  };
}

function MusicChartsContent() {
  const [sourceId, setSourceId] = useState("spotify-global");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const source = SOURCES.find((s) => s.id === sourceId) || SOURCES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".fluent-dropdown")) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    setError("");
    setData(null);
    if (!source.enabled) return;

    fetch(source.file, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch(() => setError("Failed to fetch"));
  }, [source.file, source.enabled]);

  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <section className="boxoffice-page">
      <h1 className="page-title">Music Charts</h1>

      {/* Header row: dropdown + last updated */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div className="fluent-dropdown">
          <button
            type="button"
            className="fluent-dropdown-btn"
            onClick={() => setOpen((v) => !v)}
          >
            {source.label}
            <span className="chevron">▾</span>
          </button>

          {open && (
            <div className="fluent-dropdown-menu">
              {SOURCES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  disabled={!s.enabled}
                  className={`fluent-dropdown-item ${s.id === sourceId ? "active" : ""}`}
                  onClick={() => {
                    if (!s.enabled) return;
                    setSourceId(s.id);
                    setOpen(false);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {data?.date && (
          <span
            style={{
              marginLeft: "auto",
              color: "#666",
            }}
          >
            Last updated:{" "}
            {new Date(data.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      {!source.enabled && <p style={{ color: "#666" }}>Coming soon.</p>}
      {source.enabled && error && <p style={{ color: "red" }}>{error}</p>}
      {source.enabled && !error && !data && <p>Loading…</p>}

      {source.enabled && !error && data && (
        <div className="boxoffice-table-wrapper">
          <table className="boxoffice-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Song</th>
                <th>Artist</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const parsed =
                  source.id === "spotify-global"
                    ? splitArtistTrack(item.artist)
                    : { artist: item.artist, track: item.track };

                return (
                  <tr key={item.rank ?? `${parsed.artist}-${parsed.track}`}>
                    <td>{item.rank ?? "—"}</td>
                    <td>{parsed.track}</td>
                    <td>{parsed.artist}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function MusicChartsPage() {
  return <App page={<MusicChartsContent />} />;
}
