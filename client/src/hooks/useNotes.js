// all server interactions centralized so that we  can later add caching, retries, metrics, etc in one place

import { useCallback, useState } from "react";
export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : (data.notes || []));
    } catch (err) { setError(err.message || String(err)); }
    finally { setLoading(false); }
  }, []);

  const createNote = useCallback(async (payload) => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      setNotes(prev => [created, ...prev]);
      return created;
    } finally { setLoading(false); }
  }, []);

  const updateNote = useCallback(async (id, payload) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setNotes(prev => prev.map(n => n._id === id ? updated : n));
      return updated;
    } finally { setLoading(false); }
  }, []);

  const deleteNote = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setNotes(prev => prev.filter(n => n._id !== id));
      return true;
    } finally { setLoading(false); }
  }, []);

  return { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote };
}

