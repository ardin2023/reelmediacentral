export async function searchMusic(query) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=10`;

  const res = await fetch(url);
  const data = await res.json();

  return data.results.map((r) => ({
    title: r.trackName || r.collectionName,
    artist: r.artistName,
    album: r.collectionName,
    release: r.releaseDate?.split("T")[0] || "—",
    genre: r.primaryGenreName || "—",
    cover: r.artworkUrl100?.replace("100x100bb.jpg", "600x600bb.jpg"),
  }));
}
