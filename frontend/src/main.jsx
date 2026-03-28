// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/Home.jsx";
import MoviesPage from "./pages/Movies.jsx";
import MusicPage from "./pages/Music.jsx";
import BooksPage from "./pages/Books.jsx";
import GamesPage from "./pages/Games.jsx";
import DashboardsPage from "./pages/Dashboards.jsx";
import MediaAwardsPage from "./pages/MediaAwards.jsx";
import BoxofficePage from "./pages/BoxOffice.jsx";
import MusicChartsPage from "./pages/MusicCharts.jsx";
import PodcastChartsPage from "./pages/PodcastCharts.jsx";
import StreamingPage from "./pages/Streaming.jsx";
import SocialBuzzPage from "./pages/SocialBuzz.jsx";
import BookSellersPage from "./pages/BookSellers.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/music" element={<MusicPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/dashboards" element={<DashboardsPage />} />
      <Route path="/media-awards" element={<MediaAwardsPage />} />
      <Route path="/boxoffice" element={<BoxofficePage />} />
      <Route path="/music-charts" element={<MusicChartsPage />} />
      <Route path="/podcast-charts" element={<PodcastChartsPage />} />
      <Route path="/streaming" element={<StreamingPage />} />
      <Route path="/book-sellers" element={<BookSellersPage />} />
      <Route path="/social-buzz" element={<SocialBuzzPage />} />

      {/* ⭐ Use the imported component name */}
 
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);
