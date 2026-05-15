// src/App.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GoogleAd from "./components/GoogleAd.jsx";

export default function App({ page }) {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-root">
      <div className="app-shell">

        {/* HEADER BANNER */}
        <div className="site-header">
          <header className="topbar">
            <span style={{ fontFamily: "Superclarendon, serif", fontSize: "28px", textAlign: "left" }}>
              <span style={{ color: "#c9a84c" }}>R</span>eel<span style={{ color: "#c9a84c" }}>M</span>edia<span style={{ color: "#c9a84c" }}>C</span>entral
            </span>
          </header>
          <button className="nav-hamburger" onClick={() => setNavOpen(v => !v)}>☰</button>
        </div>

        {/* NAVIGATION */}
        <nav className={`nav-card${navOpen ? " nav-open" : ""}`}>
          <div className="nav-left">
            <Link
              className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
              to="/"
            >
              Home
            </Link>

            <Link
              className={`nav-btn ${location.pathname === "/media-awards" ? "active" : ""}`}
              to="/media-awards"
            >
              Media Awards
            </Link>

            <Link
              className={`nav-btn ${location.pathname === "/music-charts" ? "active" : ""}`}
              to="/music-charts"
            >
              Music Charts
            </Link>

            <Link
              className={`nav-btn ${location.pathname === "/boxoffice" ? "active" : ""}`}
              to="/boxoffice"
            >
              Boxoffice
            </Link>

            <Link
              className={`nav-btn ${location.pathname === "/podcast-charts" ? "active" : ""}`}
              to="/podcast-charts"
            >
              Podcast Charts
            </Link>

          </div>

          <div className="nav-right">
            <Link
              className={`nav-btn ${location.pathname === "/dashboards" ? "active" : ""}`}
              to="/dashboards"
            >
              Top Trends
            </Link>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        {page}

        {/* FOOTER */}
        <footer className="footer-bar">
          <div className="footer-left">
            2017–{new Date().getFullYear()} ReelMediaCentral.com. All Rights Reserved.
          </div>

          <div className="footer-right">
            <Link to="/about">About RMC</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </footer>

        {/* GOOGLE AD UNIT */}
        <GoogleAd />
      </div>
    </div>
  );
}
