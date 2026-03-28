import { useEffect } from "react";

export default function FormulaDrawer({ open, onClose }) {
  // Close drawer when pressing ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: open ? "rgba(0,0,0,0.4)" : "transparent",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
          zIndex: 1000
        }}
      />

      {/* DRAWER */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: "420px",
          background: "#fff",
          boxShadow: "-4px 0 18px rgba(0,0,0,0.15)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s ease",
          padding: "28px 26px",
          zIndex: 1001,
          overflowY: "auto"
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 600 }}>
            Prediction Formula
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
              lineHeight: "1"
            }}
          >
            ✕
          </button>
        </div>

        <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

        {/* CONTENT */}
        <div style={{ fontSize: "15px", lineHeight: "1.55", color: "#444" }}>
          <p>
            These rankings are generated using a proprietary scoring model that
            weighs multiple award-season indicators. The system considers
            elements such as early festival reception, critical performance,
            industry award momentum, box office context, and real-time awards
            buzz from trusted prediction sources.
          </p>

          <p style={{ marginTop: "16px" }}>
            Each film receives a blended score weekly, allowing the list to
            update dynamically as the season evolves.
          </p>
        </div>
      </div>
    </>
  );
}
