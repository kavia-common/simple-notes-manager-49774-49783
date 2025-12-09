import React, { useEffect, useRef } from 'react';

/**
 * Note Editor with title and body and Save/Cancel/Delete actions.
 */
// PUBLIC_INTERFACE
export default function Editor({
  note,
  draft,
  onChange,
  onSave,
  onCancel,
  onDelete,
}) {
  /** Editor for the selected note. */
  const titleRef = useRef(null);

  useEffect(() => {
    // Focus title when selecting or creating a note
    if (titleRef.current) {
      titleRef.current.focus();
      // place caret at end
      const len = titleRef.current.value.length;
      titleRef.current.setSelectionRange(len, len);
    }
  }, [note?.id]);

  if (!note) {
    return (
      <div className="empty" role="region" aria-label="No note selected">
        <h3>Select a note</h3>
        <p>Choose a note from the list or create a new one to begin editing.</p>
      </div>
    );
  }

  return (
    <div className="panel" aria-label="Note editor panel">
      <div className="editor-header">
        <span className="badge" aria-label="status badge">Editing</span>
        <div className="spacer" />
      </div>

      <div className="editor">
        <input
          ref={titleRef}
          className="title-input"
          placeholder="Note title"
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
          aria-label="Note title"
        />
        <textarea
          className="textarea"
          placeholder="Write your note..."
          value={draft.body}
          onChange={(e) => onChange({ ...draft, body: e.target.value })}
          aria-label="Note body"
        />
        <div className="toolbar">
          <div className="btn-row">
            <button className="btn primary" onClick={onSave} aria-label="Save note">
              💾 Save
            </button>
            <button className="btn ghost" onClick={onCancel} aria-label="Cancel editing">
              Cancel
            </button>
          </div>
          <div className="btn-row">
            <span className="kbd">Ctrl/Cmd + S</span>
            <button className="btn danger" onClick={onDelete} aria-label="Delete note">
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
