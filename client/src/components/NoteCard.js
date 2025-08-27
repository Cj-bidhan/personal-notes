//shows note title, snippet, timestamp, tags, and Edit/Delete buttons. Calls back to App for actions.

import React from "react";

export default function NoteCard({ note = {}, onEdit = () => {}, onDelete = () => {} }) {
  const snippet = (note.content || "").slice(0, 240);
  return (
    <article className="card note-card" role="listitem" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: 0 }}>{note.title || "Untitled"}</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={onEdit}>Edit</button>
          <button onClick={() => { if (window.confirm("Are you Sure?Delete note?")) onDelete(); }} style={{ background: "transparent", border: "1px solid var(--border)", padding: "6px 10px", borderRadius: 8 }}>Delete</button>
        </div>
      </div>

      <p style={{ margin: 0, color: "var(--muted)" }}>{snippet}{(note.content && note.content.length > 240) ? "…" : ""}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <small style={{ color: "var(--muted)" }}>{note.updatedAt ? new Date(note.updatedAt).toLocaleString() : ""}</small>
        <div style={{ display: "flex", gap: 8 }}>
          {(note.tags || []).slice(0,3).map(t => <span key={t} style={{ fontSize: 12, color: "var(--muted)" }}>#{t}</span>)}
        </div>
      </div>
    </article>
  );
}
