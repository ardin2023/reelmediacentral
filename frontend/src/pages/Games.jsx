// src/pages/Games.jsx
import App from "../App.jsx";

/*
====================================
ORIGINAL GAMES PAGE — TEMPORARILY DISABLED
====================================

Previous implementation:
- Imported GamesContent
- Rendered games data

This is intentionally commented out.

To restore:
- Delete this comment
- Re-import GamesContent
- Restore original JSX
*/

function GamesContent() {
  return (
    <section style={{ textAlign: "center", padding: "120px 20px", color: "#666" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Coming Soon</h1>
      <p>Games content is under construction.</p>
    </section>
  );
}

export default function GamesPage() {
  return <App page={<GamesContent />} />;
}
