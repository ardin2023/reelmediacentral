// src/api/getItunesTopSongs.js

export async function getItunesTopSongs(country = "us", limit = 40) {
  const url = `https://rss.applemarketingtools.com/api/v2/${country}/music/most-played/${limit}/songs.json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load iTunes chart");
  }

  const data = await res.json();

  return {
    date: data.feed.updated,
    items: data.feed.results.map((item, index) => ({
      rank: index + 1,
      title: item.name,
      artist: item.artistName,
      artwork: item.artworkUrl100,
      link: item.url
    }))
  };
}
