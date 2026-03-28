// src/pages/Movies.jsx
import App from "../App.jsx";

/*
====================================
ORIGINAL MOVIES PAGE — TEMPORARILY DISABLED
====================================

Everything that used to be here is intentionally
commented out.

When ready:
- Delete this comment
- Restore original content
*/

function MoviesContent() {
  return (
    <section style={{ textAlign: "center", padding: "120px 20px", color: "#666" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}></h1>
      <p>.</p>
    </section>
  );
}

export default function MoviesPage() {
  return <App page={<MoviesContent />} />;
}
