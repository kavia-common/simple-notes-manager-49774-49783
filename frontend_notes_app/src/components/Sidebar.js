import React from 'react';

/**
 * Sidebar with search and "New Note" button.
 */
// PUBLIC_INTERFACE
export default function Sidebar({ search, onSearch, onCreate }) {
  /** Sidebar for navigation and note actions. */
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="search">
        <span className="icon" aria-hidden>🔎</span>
        <input
          className="input"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <button className="new-btn" onClick={onCreate} aria-label="Create new note">
        <span>＋</span>
        <span>New Note</span>
      </button>
    </aside>
  );
}
