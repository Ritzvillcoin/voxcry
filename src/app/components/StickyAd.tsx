"use client";

import AdUnit from "./AdUnit";

export default function StickyAd() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#ffffff",
        padding: "6px 0",
        borderTop: "1px solid #ddd",
        zIndex: 9999,
        maxHeight: "80px",       // ⭐ keeps it small
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "728px" }}>
        <AdUnit slot="4361094013" />
      </div>
    </div>
  );
}
