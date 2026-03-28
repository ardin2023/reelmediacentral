// src/api/moviesDashboard.js

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Generate last N years (including current year)
export function generateYearRange(numYears) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < numYears; i++) {
    years.push(currentYear - i);
  }
  return years.reverse();
}

// Fetch top 10 revenue movies for a given year
export async function fetchTop10RevenueForYear(year) {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_year=${year}&sort_by=revenue.desc`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data || !data.results) return null;

  const top10 = data.results.slice(0, 10);

  const totalRevenue = top10.reduce((sum, movie) => sum + (movie.revenue || 0), 0);

  return {
    year,
    revenue: totalRevenue
  };
}

// Fetch all years
export async function fetchRevenueForYears(yearList) {
  const results = [];

  for (const y of yearList) {
    try {
      const yearData = await fetchTop10RevenueForYear(y);
      if (yearData) results.push(yearData);
    } catch (err) {
      console.error("Failed to fetch year:", y, err);
    }
  }

  return results;
}
