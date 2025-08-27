//app skeleton and orchestration — loads notes via useNotes, handles keyboard shortcuts, flows for editing/creating notes and toggling sidebar/drawer.

import React, { useEffect, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import RightDrawer from "./components/RightDrawer";
import NotesGrid from "./components/NotesGrid";
import NoteEditor from "./components/NoteEditor";
import useNotes from "./hooks/useNotes";
import "./styles/theme.css";
import "./styles/global.css";
import "./App.css";

export default function App() {
  const { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote } = useNotes();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => { fetchNotes(); }, []); // load once

  // keyboard shortcuts: "/" focus search, "n" new note, "Escape" close editor
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key.toLowerCase() === "n" && tag !== "INPUT" && tag !== "TEXTAREA") {
        setEditingNote(null);
        setEditorOpen(true);
        return;
      }
      if (e.key === "Escape") {
        setEditorOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openEditorForEdit = (note) => { setEditingNote(note); setEditorOpen(true); };

  const handleSave = async (payload) => {
    if (editingNote) {
      await updateNote(editingNote._id, payload);
    } else {
      await createNote(payload);
    }
    setEditorOpen(false);
  };

  const filtered = notes.filter(n => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (n.title || "").toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q);
  });

  return (
    <div className="app-layout">
      <TopBar
        searchRef={searchRef}
        query={query}
        setQuery={setQuery}
        onToggleSidebar={() => setSidebarOpen(s => !s)}
        onToggleDrawer={() => setDrawerOpen(d => !d)}
        onNew={() => { setEditingNote(null); setEditorOpen(true); }}
      />

      <div className="content-grid">
        <Sidebar isOpen={sidebarOpen} onNew={() => { setEditingNote(null); setEditorOpen(true); }} />

        <main style={{ paddingBottom: 32 }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Notes</h2>
              <div style={{ color: "var(--muted)" }}>{loading ? "Loading…" : `${filtered.length} note${filtered.length !== 1 ? "s" : ""}`}</div>
            </div>

            <NotesGrid notes={filtered} onEdit={openEditorForEdit} onDelete={(id) => deleteNote(id)} />
            {filtered.length === 0 && !loading && (
              <div className="card" style={{ marginTop: 16 }}>
                <p style={{ margin: 0, color: "var(--muted)" }}>No notes yet — press <span className="kbd">N</span> to create one.</p>
              </div>
            )}
          </div>
        </main>

        {drawerOpen && <RightDrawer />}
      </div>

      {editorOpen && <NoteEditor initial={editingNote} onClose={() => setEditorOpen(false)} onSave={handleSave} />}
    </div>
  );
}
