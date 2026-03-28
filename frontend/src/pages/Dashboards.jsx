// src/pages/Dashboards.jsx

import { useEffect, useState } from "react";
import App from "../App.jsx";

/* ---------------------------
   CHART COMPONENTS
--------------------------- */
import RuntimeTrendChart from "../components/RuntimeTrendChart.jsx";
import GenreTrendChart from "../components/GenreTrendChart.jsx";
import RevenuePerGenreChart from "../components/RevenuePerGenreChart.jsx";
import ReleaseSeasonalityChart from "../components/ReleaseSeasonalityChart.jsx";
import BestPictureRevenueChart from "../components/BestPictureRevenueChart.jsx";
import ReleaseVolumeChart from "../components/ReleaseVolumeChart.jsx";

/* ---------------------------
   API HELPERS
--------------------------- */
import { getRuntimeTrends } from "../api/getRuntimeTrends.js";
import { getGenreTrends } from "../api/getGenreTrends.js";
import { getGenreRevenue } from "../api/getGenreRevenue.js";
import { getSeasonalityTrends } from "../api/getSeasonalityTrends.js";
import { getBestPictureRevenues } from "../api/getBestPictureRevenues.js";
import { getReleaseVolume } from "../api/getReleaseVolume.js";

function DashboardsContent() {
  const [runtimeData, setRuntimeData] = useState(null);
  const [genrePopularityData, setGenrePopularityData] = useState(null);
  const [genreRevenueData, setGenreRevenueData] = useState(null);
  const [seasonalityData, setSeasonalityData] = useState(null);
  const [bestPictureData, setBestPictureData] = useState(null);
  const [releaseVolumeData, setReleaseVolumeData] = useState(null);

  useEffect(() => {
    async function load() {
      setRuntimeData(await getRuntimeTrends(10));
      setGenrePopularityData(await getGenreTrends(10));
      setGenreRevenueData(await getGenreRevenue());
      setSeasonalityData(await getSeasonalityTrends());
      setBestPictureData(await getBestPictureRevenues());
      setReleaseVolumeData(await getReleaseVolume(10));
    }

    load();
  }, []);

  return (
    <>
      <h1>Industry Trends</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Best Picture Winners: Box Office</h2>
          {bestPictureData ? (
            <BestPictureRevenueChart data={bestPictureData} />
          ) : (
            <p>Loading…</p>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Movie Release Volume Per Year</h2>
          {releaseVolumeData ? (
            <ReleaseVolumeChart data={releaseVolumeData} />
          ) : (
            <p>Loading…</p>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Average Movie Runtime Per Year</h2>
          {runtimeData ? (
            <RuntimeTrendChart data={runtimeData} />
          ) : (
            <p>Loading…</p>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Genre Popularity Over Time</h2>
          {genrePopularityData ? (
            <GenreTrendChart data={genrePopularityData} />
          ) : (
            <p>Loading…</p>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Revenue Per Genre</h2>
          {genreRevenueData ? (
            <RevenuePerGenreChart data={genreRevenueData} />
          ) : (
            <p>Loading…</p>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Seasonal Movie Trends</h2>
          {seasonalityData ? (
            <ReleaseSeasonalityChart data={seasonalityData} />
          ) : (
            <p>Loading…</p>
          )}
        </div>
      </div>
    </>
  );
}

export default function DashboardsPage() {
  return <App page={<DashboardsContent />} />;
}
