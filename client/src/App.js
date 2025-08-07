import React, { useState, useEffect } from "react";

const API_URL = "http://3.110.14.32:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Fetch notes on load
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingNoteId ? "PUT" : "POST";
    const url = editingNoteId ? `${API_URL}/${editingNoteId}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      setTitle("");
      setContent("");
      setEditingNoteId(null);
      fetchNotes(); // Refresh list
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNoteId(note._id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchNotes(); // Refresh list
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto", background: "#fff" }}>
      <h1 style={{ textAlign: "center" }}>📓 Personal Notes</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.5rem",
            background: "#4caf50",
            color: "#fff",
            border: "none",
          }}
        >
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>
      </form>

      <div>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              style={{
                marginBottom: "1rem",
                border: "1px solid #ccc",
                padding: "1rem",
              }}
            >
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              {note.createdAt && (
                <p style={{ fontSize: "0.8rem", color: "#555" }}>
                  🕒 Created At: {new Date(note.createdAt).toLocaleString()}
                </p>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(note)}
                  style={{
                    background: "#2196f3",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  style={{
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

