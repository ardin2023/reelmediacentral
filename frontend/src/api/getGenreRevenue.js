// src/api/getGenreRevenue.js

export async function getGenreRevenue() {
  // Mocked data — replace with real API later
  return {
    genres: ["Action", "Drama", "Comedy", "Animation", "Thriller"],
    rows: [
      { year: "2016", Action: 5e9, Drama: 3e9, Comedy: 2e9, Animation: 1.5e9, Thriller: 1e9 },
      { year: "2017", Action: 4.2e9, Drama: 3.8e9, Comedy: 1.9e9, Animation: 1.4e9, Thriller: 1.1e9 },
      { year: "2018", Action: 6e9, Drama: 3.5e9, Comedy: 1.8e9, Animation: 1.7e9, Thriller: 1.2e9 },
      { year: "2019", Action: 7e9, Drama: 3.6e9, Comedy: 2.1e9, Animation: 1.9e9, Thriller: 1.5e9 },
      { year: "2020", Action: 3e9, Drama: 2.8e9, Comedy: 1.1e9, Animation: 0.8e9, Thriller: 0.9e9 },
      { year: "2021", Action: 5.2e9, Drama: 3.4e9, Comedy: 1.7e9, Animation: 1.3e9, Thriller: 1.1e9 },
      { year: "2022", Action: 6.5e9, Drama: 3.9e9, Comedy: 2.4e9, Animation: 1.8e9, Thriller: 1.6e9 },
      { year: "2023", Action: 7.1e9, Drama: 4.2e9, Comedy: 2.6e9, Animation: 2e9, Thriller: 1.7e9 },
      { year: "2024", Action: 6.8e9, Drama: 4.1e9, Comedy: 2.5e9, Animation: 1.9e9, Thriller: 1.6e9 },
      { year: "2025", Action: 7.3e9, Drama: 4.5e9, Comedy: 2.7e9, Animation: 2.1e9, Thriller: 1.8e9 },
    ]
  };
}
