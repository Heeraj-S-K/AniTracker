import React from 'react';

export default function ProgressBar({ watched, total }) {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (watched / total) * 100)) : 0;
  
  return (
    <div className="progress-container">
      <div className="progress-text">
        <span>Progress</span>
        <span>{watched} / {total}</span>
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
