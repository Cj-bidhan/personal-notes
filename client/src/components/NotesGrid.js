// responsive grid container that displays all notes.

import React from "react";
import NoteCard from "./NoteCard";

export default function NotesGrid({ notes = [], onEdit = () => {}, onDelete = () => {} }) {
  return (
    <div className="notes-grid">
      {notes.map(n => (
        <NoteCard key={n._id || n.id} note={n} onEdit={() => onEdit(n)} onDelete={() => onDelete(n._id || n.id)} />
      ))}
    </div>
  );
}

