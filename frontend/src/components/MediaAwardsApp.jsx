const BEST_DIRECTOR = [
  { name: "Chloé Zhao", film: "Hamnet" },
  { name: "Ryan Coogler", film: "Sinners" },
  { name: "Joachim Trier", film: "Sentimental Value" },
  { name: "Josh Safdie", film: "Marty Supreme" },
  { name: "Paul Thomas Anderson", film: "One Battle After Another" }
];

const BEST_ACTOR = [
  { name: "Michael B. Jordan", film: "Sinners" },
  { name: "Timothée Chalamet", film: "Marty Supreme" },
  { name: "Leonardo DiCaprio", film: "One Battle After Another" },
  { name: "Wagner Moura", film: "The Secret Agent" },
  { name: "Ethan Hawke", film: "Blue Moon" }
];

const BEST_ACTRESS = [
  { name: "Emma Stone", film: "Bugonia" },
  { name: "Rose Byrne", film: "If I Had Legs I'd Kick You" },
  { name: "Jessie Buckley", film: "Hamnet" },
  { name: "Renate Reinsve", film: "Sentimental Value" },
  { name: "Kate Hudson", film: "Song Sung Blue" }
];

const BEST_SUPPORTING_ACTRESS = [
  { name: "Teyana Taylor", film: "One Battle After Another" },
  { name: "Amy Madigan", film: "Weapons" },
  { name: "Wunmi Mosaku", film: "Sinners" },
  { name: "Elle Fanning", film: "Sentimental Value" },
  { name: "Inga Ibsdotter Lilleaas", film: "Sentimental Value" }
];

const BEST_SUPPORTING_ACTOR = [
  { name: "Delroy Lindo", film: "Sinners" },
  { name: "Benicio del Toro", film: "One Battle After Another" },
  { name: "Jacob Elordi", film: "Frankenstein" },
  { name: "Sean Penn", film: "One Battle After Another" },
  { name: "Stellan Skarsgård", film: "Sentimental Value" }
];

const ORIGINAL_SCREENPLAY = [
  { film: "It Was Just an Accident", name: "Jafar Panahi" },
  { film: "Blue Moon", name: "Robert Kaplow" },
  { film: "Marty Supreme", name: "Josh Safdie, Ronald Bronstein" },
  { film: "Sinners", name: "Ryan Coogler" },
  { film: "Sentimental Value", name: "Joachim Trier, Eskil Vogt" }
];

const ADAPTED_SCREENPLAY = [
  { film: "Bugonia", name: "Will Tracy" },
  { film: "Train Dreams", name: "Clint Bentley, Greg Kwedar" },
  { film: "Frankenstein", name: "Guillermo del Toro" },
  { film: "Hamnet", name: "Chloé Zhao, Maggie O'Farrell" },
  { film: "One Battle After Another", name: "Paul Thomas Anderson" }
];

const CINEMATOGRAPHY = [
  { film: "Frankenstein", name: "Dan Laustsen" },
  { film: "Marty Supreme", name: "Darius Khondji" },
  { film: "One Battle After Another", name: "Michael Bauman" },
  { film: "Sinners", name: "Autumn Durald Arkapaw" },
  { film: "Train Dreams", name: "Adolpho Veloso" }
];

const BEST_EDITING = [
  { film: "Marty Supreme", name: "Josh Safdie, Ronald Bronstein" },
  { film: "F1", name: "Stephen Mirrione" },
  { film: "Sinners", name: "Michael P. Shawver" },
  { film: "One Battle After Another", name: "Andy Jurgensen" },
  { film: "Sentimental Value", name: "Olivier Bugge Coutté" }
];

const PRODUCTION_DESIGN = [
  { film: "Marty Supreme", name: "Jack Fisk, Adam Willis" },
  { film: "Sinners", name: "Hannah Beachler, Monique Champagne" },
  { film: "Frankenstein", name: "Tamara Deverell, Shane Vieau" },
  { film: "Hamnet", name: "Fiona Crombie, Alice Felton" },
  { film: "One Battle After Another", name: "Florencia Martin, Anthony Carlino" }
];

const SOUND_MIXING_EDITING = [
  { film: "Sirât", name: "Yasmina Praderas, Laia Casanovas, Amanda Villavieja" },
  { film: "F1", name: "Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo, Juan Peralta" },
  { film: "Sinners", name: "Brandon Proctor, Steve Boeddeker, Benjamin A. Burtt, ..." },
  { film: "Frankenstein", name: "Nelson Ferreira, Nathan Robitaille, Brad Zoern, ..." },
  { film: "One Battle After Another", name: "Christopher Scarabosio, Tony Villaflor, José Antonio García" }
];

const COSTUME_DESIGN = [
  { film: "Marty Supreme", name: "Miyako Bellizzi" },
  { film: "Sinners", name: "Ruth E. Carter" },
  { film: "Frankenstein", name: "Kate Hawley" },
  { film: "Avatar: Fire and Ash", name: "Deborah L. Scott" },
  { film: "Hamnet", name: "Malgosia Turzanska" }
];

const VISUAL_EFFECTS = [
  { film: "Jurassic World Rebirth", name: "David Vickery, Neil Corbould, Charmaine Chan, ..." },
  { film: "The Lost Bus", name: "Charlie Noble, Brandon K. McLaughlin, Russell Bowen, ..." },
  { film: "F1", name: "Ryan Tudhope, Keith Dawson, Nicolas Chevallier, ..." },
  { film: "Sinners", name: "Michael Ralla, Guido Wolter, Espen Nordahl, ..." },
  { film: "Avatar: Fire and Ash", name: "Joe Letteri, Richard Baneham, Eric Saindon, ..." }
];

const ORIGINAL_SCORE = [
  { film: "Bugonia", name: "Jerskin Fendrix" },
  { film: "Sinners", name: "Ludwig Göransson" },
  { film: "Frankenstein", name: "Alexandre Desplat" },
  { film: "Hamnet", name: "Max Richter" },
  { film: "One Battle After Another", name: "Jonny Greenwood" }
];

// src/components/MediaAwardsApp.jsx
import { useEffect, useState } from "react";

async function fetchMovieByTitle(title) {
  const res = await fetch(`/proxy.php?t=${encodeURIComponent(title)}`);
  const data = await res.json();
  if (data.Response === "False") return null;
  return data;
}

const TOP10_TITLES = [
  // You will update these weekly
  "One Battle After Another",
  "Sinners",
  "Hamnet",
  "Marty Supreme",
  "Sentimental Value",
  "Frankenstein",
  "Bugonia",
  "Train Dreams",
  "F1",
  "The Secret Agent"
];

function AwardsTable({ title, anchor, data, winner }) {
  return (
    <section id={anchor} className="ma-section">
      <h2 className="ma-section-title">{title}</h2>

<table className="ma-table">
  <tbody>
    {data.map((row, idx) => {
      const isWinner = winner && (row.name === winner || row.film === winner);
      return (
        <tr key={`${row.name}-${idx}`}>
          <td>{row.name}</td>
          <td>{row.film}</td>
          <td style={{ textAlign: "right", fontWeight: "bold", color: "#c9a84c", whiteSpace: "nowrap" }}>
            {isWinner ? "WINNER" : ""}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

    </section>
  );
}

export default function MediaAwardsApp() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        TOP10_TITLES.map((title) => fetchMovieByTitle(title))
      );
      setMovies(results.filter(Boolean));
    })();
  }, []);

return (
  <div className="ma-container">

    <section id="best-picture">
      <div className="ma-grid">
        {movies.map((m, idx) => (
          <div key={m.imdbID || idx} className="ma-card">
            <div className="ma-rank" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{idx + 1}</span>
              {m.Title === "One Battle After Another" && (
                <span style={{ fontWeight: "bold", color: "#c9a84c" }}>WINNER</span>
              )}
            </div>

            <img
              src={
                m.Poster && m.Poster !== "N/A"
                  ? m.Poster
                  : "/default-poster.jpg"
              }
              className="ma-poster"
            />

            <h2 className="ma-name">{m.Title}</h2>

            <div className="ma-meta">
              <p>
                <strong>Date Released:</strong> {m.Released || "—"}
              </p>
              <p>
                <strong>Box Office:</strong> {m.BoxOffice || "—"}
              </p>
              <p>
                <strong>Studio:</strong> {m.Production || "—"}
              </p>
              <p>
                <strong>IMDb:</strong> {m.imdbRating || "—"}
              </p>
              <p>
                <strong>Rotten Tomatoes:</strong>{" "}
                {m.Ratings?.find(
                  (r) => r.Source === "Rotten Tomatoes"
                )?.Value || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <AwardsTable
      title="Best Director"
      anchor="best-director"
      data={BEST_DIRECTOR}
      winner="Paul Thomas Anderson"
    />

    <AwardsTable
      title="Best Actor"
      anchor="best-actor"
      data={BEST_ACTOR}
      winner="Michael B. Jordan"
    />

    <AwardsTable
      title="Best Actress"
      anchor="best-actress"
      data={BEST_ACTRESS}
      winner="Jessie Buckley"
    />

    <AwardsTable
      title="Best Supporting Actor"
      anchor="best-supporting-actor"
      data={BEST_SUPPORTING_ACTOR}
      winner="Sean Penn"
    />

    <AwardsTable
      title="Best Supporting Actress"
      anchor="best-supporting-actress"
      data={BEST_SUPPORTING_ACTRESS}
      winner="Amy Madigan"
    />

    <AwardsTable
  title="Original Screenplay"
  anchor="original-screenplay"
  data={ORIGINAL_SCREENPLAY}
  winner="Ryan Coogler"
/>

<AwardsTable
  title="Adapted Screenplay"
  anchor="adapted-screenplay"
  data={ADAPTED_SCREENPLAY}
  winner="Paul Thomas Anderson"
/>

<AwardsTable
  title="Cinematography"
  anchor="cinematography"
  data={CINEMATOGRAPHY}
  winner="Autumn Durald Arkapaw"
/>

<AwardsTable
  title="Best Editing"
  anchor="best-editing"
  data={BEST_EDITING}
  winner="Andy Jurgensen"
/>

<AwardsTable
  title="Production Design"
  anchor="production-design"
  data={PRODUCTION_DESIGN}
  winner="Tamara Deverell, Shane Vieau"
/>

<AwardsTable
  title="Sound Mixing and Editing"
  anchor="sound-mixing-editing"
  data={SOUND_MIXING_EDITING}
  winner="Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo, Juan Peralta"
/>

<AwardsTable
  title="Costume Design"
  anchor="costume-design"
  data={COSTUME_DESIGN}
  winner="Kate Hawley"
/>

<AwardsTable
  title="Visual Effects"
  anchor="visual-effects"
  data={VISUAL_EFFECTS}
  winner="Avatar: Fire and Ash"
/>

<AwardsTable
  title="Original Score"
  anchor="original-score"
  data={ORIGINAL_SCORE}
  winner="Ludwig Göransson"
/>

  </div>
);

}

