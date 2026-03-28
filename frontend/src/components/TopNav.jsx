// src/components/TopNav.jsx
import { Link, useLocation } from "react-router-dom";

export default function TopNav() {
  const location = useLocation();

  return (
    <nav className="nav-card">
      <div className="nav-left">
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
          className={`nav-btn ${location.pathname === "/media-awards" ? "active" : ""}`}
          to="/media-awards"
        >
          Media Awards
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
  );
}
