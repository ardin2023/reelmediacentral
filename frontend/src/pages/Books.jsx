// src/pages/Books.jsx
import App from "../App.jsx";

/*
====================================
ORIGINAL BOOKS PAGE — TEMPORARILY DISABLED
====================================

Previous implementation:
- Imported BooksContent
- Rendered book search + results

This is intentionally commented out.

To restore:
- Delete this comment
- Re-import BooksContent
- Restore original JSX
*/

function BooksContent() {
  return (
    <section style={{ textAlign: "center", padding: "120px 20px", color: "#666" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Coming Soon</h1>
      <p>Books content is under construction.</p>
    </section>
  );
}

export default function BooksPage() {
  return <App page={<BooksContent />} />;
}
