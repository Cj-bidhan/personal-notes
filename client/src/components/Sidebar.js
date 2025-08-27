import React from "react";

export default function Sidebar({ isOpen = true, onNew = () => {} }) {
  const sampleTags = ["Personal", "Work", "Ideas", "Todo"];

  return (
    <aside className="sidebar" style={{ display: isOpen ? "block" : "none" }}>
      <div className="card" style={{ padding: 12 }}>
        <button className="btn" style={{ width: "100%", marginBottom: 12 }} onClick={onNew}>+ New Note</button>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Tags</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sampleTags.map(t => <button key={t} className="card" style={{ textAlign: "left", padding: "8px 10px", borderRadius: 10 }}>{t}</button>)}
          </div>
        </div>

        <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 13 }}>
          <div>Shortcuts</div>
          <div style={{ marginTop: 6 }}><span className="kbd">/</span> search &nbsp; <span className="kbd">N</span> new</div>
        </div>
      </div>
    </aside>
  );
}
