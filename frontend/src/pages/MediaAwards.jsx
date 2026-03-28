// src/pages/MediaAwards.jsx
import { useState, useRef, useEffect } from "react";
import App from "../App.jsx";
import MediaAwardsApp from "../components/MediaAwardsApp.jsx";
import FormulaDrawer from "../components/FormulaDrawer.jsx";
import "../media-awards.css";

export default function MediaAwardsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Best Picture");

  const sliderRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const categories = [
    "Best Picture",
    "Director",
    "Actor",
    "Actress",
    "Supporting Actor",
    "Supporting Actress",
    "Original Screenplay",
    "Adapted Screenplay",
    "Cinematography",
    "Editing",
    "Production Design",
    "Sound Mixing and Editing",
    "Costume Design",
    "Visual Effects",
    "Original Score",
  ];

  const anchorMap = {
    "Best Picture": "best-picture",
    Director: "best-director",
    Actor: "best-actor",
    Actress: "best-actress",
    "Supporting Actor": "best-supporting-actor",
    "Supporting Actress": "best-supporting-actress",
    "Original Screenplay": "original-screenplay",
    "Adapted Screenplay": "adapted-screenplay",
    Cinematography: "cinematography",
    Editing: "best-editing",
    "Production Design": "production-design",
    "Sound Mixing and Editing": "sound-mixing-editing",
    "Costume Design": "costume-design",
    "Visual Effects": "visual-effects",
    "Original Score": "original-score",
  };

  const updateArrowVisibility = () => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    setShowLeft(el.scrollLeft > 5);
    setShowRight(
      el.scrollWidth - el.clientWidth - el.scrollLeft > 5
    );
  };

  useEffect(() => {
    updateArrowVisibility();
  }, []);

  const scrollPills = (dir) => {
    sliderRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
    setTimeout(updateArrowVisibility, 250);
  };

  return (
    <App
      page={
        <div>

          {/* ☢️ SINGLE STICKY BLOCK */}
          <div className="media-awards-sticky-shell">

            {/* ROW 1: Banner already in App */}

            {/* ROW 2: Nav already in App */}

            {/* ROW 3: Oscar header */}
            <div className="media-awards-header-row">
              <h1>Oscar 2026 Prediction</h1>

              <div className="awards-pill-wrapper">
                {showLeft && (
                  <button
                    className="pill-arrow pill-arrow--left"
                    onClick={() => scrollPills("left")}
                  >
                    ‹
                  </button>
                )}

                <div
                  ref={sliderRef}
                  className="awards-pill-slider"
                  onScroll={updateArrowVisibility}
                >
                  {categories.map((cat) => (
                    <a
                      key={cat}
                      href={`#${anchorMap[cat]}`}
                      className={`award-pill ${
                        activeCategory === cat ? "active" : ""
                      }`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </a>
                  ))}
                </div>

                {showRight && (
                  <button
                    className="pill-arrow pill-arrow--right"
                    onClick={() => scrollPills("right")}
                  >
                    ›
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* NOT STICKY */}
          <div className="media-awards-content-gap" />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Best Picture Top 10</h2>
<span
  className="media-awards-formula-link"
  onClick={() => setDrawerOpen(true)}
>
  Formula used
</span>

          </div>

          <FormulaDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />

          <MediaAwardsApp />
        </div>
      }
    />
  );
}
