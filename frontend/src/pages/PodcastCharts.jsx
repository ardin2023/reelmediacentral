// src/pages/PodcastCharts.jsx
import { useEffect, useMemo, useState } from "react";
import App from "../App.jsx";
import "../podcast-charts.css";

const SPOTIFY_ROWS = [
  { rank: 1, name: "The Joe Rogan Experience", platform: "Joe Rogan" },
  { rank: 2, name: "Good Hang with Amy Poehler", platform: "The Ringer" },
  { rank: 3, name: "This Past Weekend with Theo Von", platform: "Theo Von" },
  { rank: 4, name: "Crime Junkie", platform: "Audiochuck" },
  { rank: 5, name: "The Daily", platform: "The New York Times" },
  { rank: 6, name: "The Shawn Ryan Show", platform: "Shawn Ryan Show" },
  { rank: 7, name: "The Tucker Carlson Show", platform: "Tucker Carlson Network" },
  { rank: 8, name: "Up First from NPR", platform: "NPR" },
  { rank: 9, name: "Huberman Lab", platform: "Scicomm Media" },
  { rank: 10, name: "Directed By", platform: "Spotify Studios" },
  { rank: 11, name: "Billions Club: The Series", platform: "Spotify" },
  { rank: 12, name: "Armchair Expert with Dax Shepard", platform: "Armchair Umbrella" },
  { rank: 13, name: "Matt and Shane’s Secret Podcast", platform: "Matt McCusker & Shane Gillis" },
  { rank: 14, name: "The Diary of a CEO with Steven Bartlett", platform: "FlightStory" },
  { rank: 15, name: "Bad Friends", platform: "Bobby Lee & Andrew Santino" },
  { rank: 16, name: "Candace", platform: "Candace Owens" },
  { rank: 17, name: "Morbid", platform: "Ash Kelley & Alaina Urquhart" },
  { rank: 18, name: "Pardon My Take", platform: "Barstool Sports" },
  { rank: 19, name: "NPR News Now", platform: "NPR" },
  { rank: 20, name: "The Journal.", platform: "The Wall Street Journal" },
];


const NAME_ALIASES = {
  "Up First from NPR": "Up First",
};

// Fallback data used only if podcasts-apple.json hasn't been generated yet
const APPLE_ROWS_FALLBACK = [
  { rank: 1, name: "The Daily", publisher: "The New York Times" },
  { rank: 2, name: "The Joe Rogan Experience", publisher: "Joe Rogan" },
  { rank: 3, name: "Crime Junkie", publisher: "Audiochuck" },
  { rank: 4, name: "The Dan Bongino Show", publisher: "Cumulus Podcast Network" },
  { rank: 5, name: "Good Hang with Amy Poehler", publisher: "The Ringer" },
  { rank: 6, name: "Dateline NBC", publisher: "NBC News" },
  { rank: 7, name: "Up First", publisher: "NPR" },
  { rank: 8, name: "Pod Save America", publisher: "Crooked Media" },
  { rank: 9, name: "The Mel Robbins Podcast", publisher: "Mel Robbins" },
  { rank: 10, name: "The Megyn Kelly Show", publisher: "SiriusXM" },
  { rank: 11, name: "Pardon My Take", publisher: "Barstool Sports" },
  { rank: 12, name: "REAL AF with Andy Frisella", publisher: "Andy Frisella" },
  { rank: 13, name: "The Bill Simmons Podcast", publisher: "The Ringer" },
  { rank: 14, name: "Morbid", publisher: "Ash Kelley & Alaina Urquhart" },
  { rank: 15, name: "The Shawn Ryan Show", publisher: "Shawn Ryan" },
  { rank: 16, name: "The Bible in a Year (with Fr. Mike Schmitz)", publisher: "Ascension" },
  { rank: 17, name: "SmartLess", publisher: "Jason Bateman, Sean Hayes, Will Arnett" },
  { rank: 18, name: "20/20", publisher: "ABC News" },
  { rank: 19, name: "The Rest Is History", publisher: "Goalhanger" },
  { rank: 20, name: "48 Hours", publisher: "CBS News" },
];

function PodcastChartsContent() {
  const [primary, setPrimary] = useState("apple");
  const [appleData, setAppleData] = useState({ items: [], date: "" });

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/ardin2023/reelmediacentral/main/frontend/public/data/podcasts-apple.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAppleData({
          items: data.items || [],
          date: data.date || "",
        });
      })
      .catch(() => {
        // Fall back to hardcoded data if JSON not yet generated
        setAppleData({ items: APPLE_ROWS_FALLBACK, date: "Feb 4, 2026" });
      });
  }, []);

  const rows = useMemo(() => {
    const merged = new Map();

    SPOTIFY_ROWS.forEach((row) => {
      const key = NAME_ALIASES[row.name] || row.name;
      merged.set(key, {
        name: key,
        platform: row.platform,
        appleRank: null,
        spotifyRank: row.rank,
      });
    });

    appleData.items.forEach((row) => {
      const key = NAME_ALIASES[row.name] || row.name;
      const existing = merged.get(key);
      if (existing) {
        merged.set(key, {
          ...existing,
          name: key,
          platform: row.publisher || existing.platform,
          appleRank: row.rank,
        });
      } else {
        merged.set(key, {
          name: key,
          platform: row.publisher,
          appleRank: row.rank,
          spotifyRank: null,
        });
      }
    });

    const key = primary === "apple" ? "appleRank" : "spotifyRank";
    return Array.from(merged.values())
      .filter((row) => row[key] != null)
      .sort((a, b) => (a[key] ?? 999) - (b[key] ?? 999));
  }, [primary, appleData]);

  const isApple = primary === "apple";

  const updatedLabel = isApple && appleData.date
    ? (appleData.date.includes("-")
        ? new Date(appleData.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : appleData.date)
    : "Feb 4, 2026";

  return (
    <section className="pc-page">
      <h1 className="pc-title">Podcast Charts</h1>

      <div className="pc-toolbar">
        <div className="pc-toolbar-left">
          <label className="pc-label" htmlFor="pc-primary">
            Ranked by:
          </label>
          <select
            id="pc-primary"
            className="pc-select"
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
          >
            <option value="apple">Apple Podcasts</option>
            <option value="spotify">Spotify</option>
          </select>
        </div>

        <div className="pc-updated">Last updated: {updatedLabel}</div>
      </div>

      <div className="pc-table-wrapper">
        <table className="pc-table">
          <thead>
            <tr>
              <th>{isApple ? "Apple Rank" : "Spotify Rank"}</th>
              <th>Podcast</th>
              <th>{isApple ? "Spotify Rank" : "Apple Rank"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{isApple ? row.appleRank : row.spotifyRank}</td>
                <td>
                  <div className="pc-podcast-name">{row.name}</div>
                  <div className="pc-podcast-platform">{row.platform}</div>
                </td>
                <td>{isApple ? row.spotifyRank ?? "—" : row.appleRank ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function PodcastChartsPage() {
  return <App page={<PodcastChartsContent />} />;
}
