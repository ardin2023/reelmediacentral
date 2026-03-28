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
        <header className="topbar">
          <span style={{ fontFamily: "Superclarendon, serif", fontSize: "28px", textAlign: "left" }}>
            <span style={{ color: "#c9a84c" }}>R</span>eel<span style={{ color: "#c9a84c" }}>M</span>edia<span style={{ color: "#c9a84c" }}>C</span>entral
          </span>
        </header>

        {/* NAVIGATION */}
        <nav className={`nav-card${navOpen ? " nav-open" : ""}`}>
          <button className="nav-hamburger" onClick={() => setNavOpen(v => !v)}>☰</button>
          <div className="nav-left">
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

            <Link
              className={`nav-btn ${location.pathname === "/streaming" ? "active" : ""}`}
              to="/streaming"
            >
              Streaming Hits
            </Link>

            <Link
              className={`nav-btn ${location.pathname === "/book-sellers" ? "active" : ""}`}
              to="/book-sellers"
            >
              Book Sellers
            </Link>

            <Link
              className={`nav-btn ${location.pathname === "/social-buzz" ? "active" : ""}`}
              to="/social-buzz"
            >
              Social Buzz
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
