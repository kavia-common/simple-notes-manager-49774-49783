import React from 'react';

/**
 * Simple confirmation modal.
 */
// PUBLIC_INTERFACE
export default function DeleteModal({ open, title, onConfirm, onCancel }) {
  /** Delete confirmation modal */
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm deletion">
      <div className="modal">
        <h3 style={{ margin: 0 }}>Delete note</h3>
        <p className="muted" style={{ margin: '4px 0 10px' }}>
          Are you sure you want to delete “{title || 'Untitled'}”? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={onCancel} autoFocus>Cancel</button>
          <button className="btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
