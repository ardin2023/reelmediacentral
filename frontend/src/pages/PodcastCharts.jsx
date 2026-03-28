// src/pages/PodcastCharts.jsx
import { useEffect, useMemo, useState } from "react";
import App from "../App.jsx";
import "../podcast-charts.css";

// Fallback data used only if podcasts-spotify.json hasn’t been generated yet
const SPOTIFY_ROWS_FALLBACK = [
  { rank: 1, name: "The Joe Rogan Experience", publisher: "Joe Rogan" },
  { rank: 2, name: "Good Hang with Amy Poehler", publisher: "The Ringer" },
  { rank: 3, name: "This Past Weekend with Theo Von", publisher: "Theo Von" },
  { rank: 4, name: "Crime Junkie", publisher: "Audiochuck" },
  { rank: 5, name: "The Daily", publisher: "The New York Times" },
  { rank: 6, name: "The Shawn Ryan Show", publisher: "Shawn Ryan Show" },
  { rank: 7, name: "The Tucker Carlson Show", publisher: "Tucker Carlson Network" },
  { rank: 8, name: "Up First from NPR", publisher: "NPR" },
  { rank: 9, name: "Huberman Lab", publisher: "Scicomm Media" },
  { rank: 10, name: "Directed By", publisher: "Spotify Studios" },
  { rank: 11, name: "Billions Club: The Series", publisher: "Spotify" },
  { rank: 12, name: "Armchair Expert with Dax Shepard", publisher: "Armchair Umbrella" },
  { rank: 13, name: "Matt and Shane’s Secret Podcast", publisher: "Matt McCusker & Shane Gillis" },
  { rank: 14, name: "The Diary of a CEO with Steven Bartlett", publisher: "FlightStory" },
  { rank: 15, name: "Bad Friends", publisher: "Bobby Lee & Andrew Santino" },
  { rank: 16, name: "Candace", publisher: "Candace Owens" },
  { rank: 17, name: "Morbid", publisher: "Ash Kelley & Alaina Urquhart" },
  { rank: 18, name: "Pardon My Take", publisher: "Barstool Sports" },
  { rank: 19, name: "NPR News Now", publisher: "NPR" },
  { rank: 20, name: "The Journal.", publisher: "The Wall Street Journal" },
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

const GITHUB_RAW = "https://raw.githubusercontent.com/ardin2023/reelmediacentral/main/frontend/public/data";

function usePodcastData(platform, fallback) {
  const [data, setData] = useState({ items: [], date: "" });

  useEffect(() => {
    fetch(`${GITHUB_RAW}/podcasts-${platform}.json`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setData({ items: json.items || [], date: json.date || "" }))
      .catch(() => setData({ items: fallback, date: "" }));
  }, [platform]);

  return data;
}

function PodcastChartsContent() {
  const [primary, setPrimary] = useState("apple");
  const appleData = usePodcastData("apple", APPLE_ROWS_FALLBACK);
  const spotifyData = usePodcastData("spotify", SPOTIFY_ROWS_FALLBACK);

  const rows = useMemo(() => {
    const merged = new Map();

    spotifyData.items.forEach((row) => {
      const key = NAME_ALIASES[row.name] || row.name;
      merged.set(key, {
        name: key,
        platform: row.publisher,
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
  }, [primary, appleData, spotifyData]);

  const isApple = primary === "apple";
  const activeDate = isApple ? appleData.date : spotifyData.date;
  const updatedLabel = activeDate
    ? new Date(activeDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "—";

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
