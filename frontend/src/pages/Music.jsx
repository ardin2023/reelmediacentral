// src/pages/Music.jsx
import App from "../App.jsx";

/*
====================================
ORIGINAL MUSIC PAGE — TEMPORARILY DISABLED
====================================

Previous implementation:
- Imported MusicContent
- Rendered full music search + cards

This is intentionally commented out.

To restore:
- Delete this comment
- Re-import MusicContent
- Restore original JSX
*/

function MusicContent() {
  return (
    <section style={{ textAlign: "center", padding: "120px 20px", color: "#666" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Coming Soon</h1>
      <p>Music content is under construction.</p>
    </section>
  );
}

export default function MusicPage() {
  return <App page={<MusicContent />} />;
}
