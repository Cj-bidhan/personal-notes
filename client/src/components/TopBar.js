// top navigation bar with search options, theme toggle, accent selector, quick new note and  toggle buttons 

import React from "react";

/**
 * TopBar
 * Props:
 * - searchRef (ref)
 * - query, setQuery
 * - onToggleSidebar, onToggleDrawer, onNew
 */
export default function TopBar({ searchRef, query = "", setQuery = () => {}, onToggleSidebar = () => {}, onToggleDrawer = () => {}, onNew = () => {} }) {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const currentAccent = document.documentElement.getAttribute("data-accent") || "teal";

  function toggleTheme() {
    const next = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  function onAccentChange(e) {
    const a = e.target.value;
    document.documentElement.setAttribute("data-accent", a);
    localStorage.setItem("accent", a);
  }

  return (
    <header className="topbar card" style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", padding: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">☰</button>
        <div>
          <strong>Personal Notes</strong>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>DevOps showcase</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes (press / to focus)"
          style={{ width: "60%", padding: "8px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--panel)" }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <select defaultValue={currentAccent} onChange={onAccentChange} style={{ padding: "8px", borderRadius: 8 }}>
          <option value="teal">Teal</option>
          <option value="purple">Purple</option>
          <option value="blue">Blue</option>
        </select>

        <button className="btn" onClick={toggleTheme} aria-pressed={currentTheme === "dark"}>
          {currentTheme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button className="btn" onClick={onNew}>+ New</button>

        <button className="btn" onClick={onToggleDrawer}>Utilities</button>
      </div>
    </header>
  );
}

