// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import App from "../App.jsx";

const SECTIONS = [
  {
    name: "Box Office",
    description: "Weekly US weekend box office results with historical data going back to 2026.",
    route: "/boxoffice",
  },
  {
    name: "Music Charts",
    description: "Top songs ranked by Spotify (Global) and Apple Music (US), updated regularly.",
    route: "/music-charts",
  },
  {
    name: "Podcast Charts",
    description: "Top 20 podcasts on Apple Podcasts and Spotify side by side, auto-updated weekly.",
    route: "/podcast-charts",
  },
  {
    name: "Streaming Hits",
    description: "Weekly top streaming shows across platforms with viewership data.",
    route: "/streaming",
  },
  {
    name: "Book Sellers",
    description: "Weekly bestseller rankings with cover art and sales figures.",
    route: "/book-sellers",
  },
  {
    name: "Media Awards",
    description: "Oscar 2026 predictions across all 15 major categories using a scoring formula.",
    route: "/media-awards",
  },
  {
    name: "Top Trends",
    description: "Film industry analytics — genre trends, runtime shifts, box office by year, and more.",
    route: "/dashboards",
  },
  {
    name: "Social Buzz",
    description: "Weekly trending topics ranked by buzz score and week-over-week change.",
    route: "/social-buzz",
  },
];

function HomeContent() {
  const [hero, setHero] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/hero.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setHero)
      .catch(() => setHero(null));
  }, []);

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      {hero && (
        <div
          className="home-hero"
          style={
            hero.backgroundImage
              ? { backgroundImage: `url(${hero.backgroundImage})` }
              : {}
          }
          onClick={() => navigate(hero.chartLink)}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate(hero.chartLink)}
        >
          {hero.backgroundImage && <div className="home-hero-overlay" />}
          <div className="home-hero-content">
            {hero.category && (
              <span className="home-hero-category">{hero.category}</span>
            )}
            <h1 className="home-hero-title">{hero.title}</h1>
            <p className="home-hero-subtitle">{hero.subtitle}</p>
            <span className="home-hero-cta">View Chart →</span>
          </div>
        </div>
      )}

      {/* ── SECTION CARDS ── */}
      <div className="home-sections-header">
        <h2>Explore</h2>
      </div>

      <div className="home-grid">
        {SECTIONS.map((s) => (
          <Link key={s.route} to={s.route} className="home-card">
            <span className="home-card-name">{s.name}</span>
            <p className="home-card-desc">{s.description}</p>
            <span className="home-card-arrow">→</span>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default function HomePage() {
  return <App page={<HomeContent />} />;
}
