import React from 'react';

export default function Modal({ onClose, title, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{title}</h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>✖</button>
        </div>
        {children}
      </div>
    </div>
  );
}
