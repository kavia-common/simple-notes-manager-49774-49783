import React, { useMemo } from 'react';

/**
 * List of notes with filtering and selection.
 */
// PUBLIC_INTERFACE
export default function NoteList({ notes, query, selectedId, onSelect }) {
  /** Renders a list of notes filtered by the query. */

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q)
    );
  }, [notes, query]);

  if (!notes.length) {
    return <div className="note-list-empty">No notes yet. Create your first note to get started.</div>;
  }

  if (!filtered.length) {
    return <div className="note-list-empty">No matches found.</div>;
  }

  return (
    <div role="list" className="note-list">
      {filtered.map(n => (
        <button
          key={n.id}
          role="listitem"
          className={`note-list-item ${selectedId === n.id ? 'active' : ''}`}
          onClick={() => onSelect(n.id)}
          aria-label={`Open note ${n.title}`}
        >
          <div className="title">{n.title || 'Untitled'}</div>
          <div className="meta">
            <span className="small muted">{preview(n.body)}</span>
            <span className="small muted">{formatDate(n.updatedAt)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function preview(text) {
  if (!text) return '—';
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > 28 ? t.slice(0, 28) + '…' : t;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}
