import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './theme.css';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import Editor from './components/Editor';
import DeleteModal from './components/DeleteModal';
import { loadNotes, saveNotes, createNote, updateNote, deleteNote } from './services/storage';

// PUBLIC_INTERFACE
function App() {
  /**
   * Notes App main component with Ocean Professional styling.
   * Provides localStorage-backed CRUD and a modern UI with sidebar, list, and editor.
   */

  // Theme toggle (light/dark) preserved from template for convenience
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // State: notes, selected note id, search query, draft, and modal
  const [notes, setNotes] = useState(() => loadNotes());
  const [selectedId, setSelectedId] = useState(() => notes[0]?.id || null);
  const [query, setQuery] = useState('');
  const selected = useMemo(() => notes.find((n) => n.id === selectedId) || null, [notes, selectedId]);

  // Draft mirrors selected note
  const [draft, setDraft] = useState({ title: '', body: '' });
  useEffect(() => {
    if (selected) {
      setDraft({ title: selected.title || '', body: selected.body || '' });
    } else {
      setDraft({ title: '', body: '' });
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage when notes change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Keybind: save with Cmd/Ctrl + S
  useEffect(() => {
    const onKey = (e) => {
      const isSave = (e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S');
      if (isSave) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleCreate = () => {
    const newNote = createNote({ title: 'Untitled', body: '' });
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setDraft({ title: newNote.title, body: newNote.body });
  };

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleSave = () => {
    if (!selected) {
      // If no selected note, create one with current draft
      const created = createNote({ title: draft.title, body: draft.body });
      setNotes((prev) => [created, ...prev]);
      setSelectedId(created.id);
      return;
    }
    const updated = updateNote(selected.id, { title: draft.title, body: draft.body });
    if (updated) {
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    }
  };

  const handleCancel = () => {
    if (selected) {
      setDraft({ title: selected.title || '', body: selected.body || '' });
    } else {
      setDraft({ title: '', body: '' });
    }
  };

  const [showDelete, setShowDelete] = useState(false);
  const requestDelete = () => setShowDelete(true);
  const cancelDelete = () => setShowDelete(false);
  const confirmDelete = () => {
    if (selected) {
      deleteNote(selected.id);
      setNotes((prev) => prev.filter((n) => n.id !== selected.id));
      setSelectedId((prevId) => {
        if (!prevId) return null;
        const remaining = notes.filter((n) => n.id !== prevId);
        return remaining[0]?.id || null;
      });
    }
    setShowDelete(false);
  };

  // Derived list for left column to re-use NoteList component
  const listNotes = useMemo(() => notes, [notes]);

  // Env variables placeholders to respect existing setup (not used directly for local)
  const API_BASE = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
  void API_BASE; // suppress unused var warning for now

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="brand-badge">🗒</div>
          <div>Notes</div>
        </div>
        <div className="spacer" />
        <div className="actions">
          <button
            className="btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <Sidebar search={query} onSearch={setQuery} onCreate={handleCreate} />

      <main className="main">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, height: '100%' }}>
          <section aria-label="Notes list" className="panel" style={{ height: '100%' }}>
            <div className="editor-header">
              <span className="badge" aria-label="Notes count">{listNotes.length} notes</span>
            </div>
            <div style={{ overflow: 'auto' }}>
              <NoteList
                notes={listNotes}
                query={query}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </div>
          </section>

          <section aria-label="Editor region">
            <Editor
              note={selected}
              draft={draft}
              onChange={setDraft}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={requestDelete}
            />
          </section>
        </div>
      </main>

      <DeleteModal
        open={showDelete}
        title={selected?.title}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default App;
