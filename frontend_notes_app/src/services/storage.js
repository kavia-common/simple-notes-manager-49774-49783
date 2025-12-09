/**
 * Local storage persistence utilities for Notes.
 * Uses a namespaced key and JSON serialization.
 */

const STORAGE_KEY = 'notes_app__v1';

/**
 * Generate a simple unique id based on timestamp and random segment.
 */
export function generateId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Load notes array from storage.
 * Returns an empty array if none.
 */
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Validate structure
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Save notes array to storage.
 */
export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // no-op
  }
}

/**
 * Create and persist a new note.
 */
export function createNote(partial = {}) {
  const notes = loadNotes();
  const now = new Date().toISOString();
  const newNote = {
    id: generateId(),
    title: partial.title?.trim() || 'Untitled',
    body: partial.body || '',
    createdAt: now,
    updatedAt: now,
  };
  notes.unshift(newNote);
  saveNotes(notes);
  return newNote;
}

/**
 * Update a note by id. Returns updated note or null.
 */
export function updateNote(id, updates) {
  const notes = loadNotes();
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return null;
  const updated = {
    ...notes[idx],
    ...updates,
    title: (updates.title ?? notes[idx].title)?.trim() || 'Untitled',
    updatedAt: new Date().toISOString(),
  };
  notes[idx] = updated;
  saveNotes(notes);
  return updated;
}

/**
 * Delete a note by id. Returns true if deleted.
 */
export function deleteNote(id) {
  const notes = loadNotes();
  const next = notes.filter(n => n.id !== id);
  const changed = next.length !== notes.length;
  if (changed) saveNotes(next);
  return changed;
}
