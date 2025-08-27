// model form to create/edit notes; calls onSave(payload) passed by App which uses useNotes to call the backend.


import React, { useEffect, useState } from "react";

export default function NoteEditor({ initial = null, onClose = () => {}, onSave = async () => {} }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [tags, setTags] = useState((initial?.tags || []).join(", "));

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e) {
    e.preventDefault();
    const payload = { title, content, tags: tags.split(",").map(t => t.trim()).filter(Boolean) };
    await onSave(payload);
  }

  return (
    <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 80 }}>
      <div className="modal card" style={{ width: "min(760px,96%)", padding: 18 }}>
        <form onSubmit={submit}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{initial ? "Edit Note" : "New Note"}</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn">Save</button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div style={{ marginTop: 10 }}>
            <textarea className="input" placeholder="Write your note..." value={content} onChange={e => setContent(e.target.value)} style={{ minHeight: 140, resize: "vertical" }} />
          </div>

          <div style={{ marginTop: 10 }}>
            <input className="input" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
        </form>
      </div>
    </div>
  );
}

