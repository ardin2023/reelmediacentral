// src/api/getTopStreamingSongs.js

/**
 * Mocked Top 10 Daily Streaming Songs
 * Replace later with scraped Spotify data
 */

export async function getTopStreamingSongs() {
  return {
    dateLabel: "As of Dec 24, 2025",
    items: [
      { title: "All I Want for Christmas Is You", streams: 23338007 },
      { title: "Last Christmas", streams: 22664921 },
      { title: "Rockin' Around the Christmas Tree", streams: 20954813 },
      { title: "Jingle Bell Rock", streams: 18131160 },
      { title: "Let It Snow! Let It Snow! Let It Snow!", streams: 16333308 },
      { title: "Santa Tell Me", streams: 16090412 },
      { title: "Underneath the Tree", streams: 14926975 },
      { title: "Snowman", streams: 13974518 },
      { title: "It's the Most Wonderful Time of the Year", streams: 13523539 },
      { title: "Feliz Navidad", streams: 13410747 }
    ]
  };
}
