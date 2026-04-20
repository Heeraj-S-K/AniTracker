import React from 'react';
import ProgressBar from './ProgressBar';

export default function AnimeCard({ anime, onEdit, onWatch, onDelete, onAddEpisode }) {
  const statusClass = `status-${anime.status.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="anime-card">
      <div className="card-header">
        <div style={{ overflow: 'hidden' }}>
          <h3 className="anime-title" title={anime.name}>{anime.name}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Rating: {'★'.repeat(anime.rating)}{'☆'.repeat(10 - anime.rating)}
          </span>
        </div>
        <span className={`status-badge ${statusClass}`}>{anime.status}</span>
      </div>
      
      <ProgressBar watched={anime.watchedEpisodes} total={anime.totalEpisodes} />
      
      <div className="card-actions">
        {anime.watchedEpisodes < anime.totalEpisodes && (
          <button 
            className="btn btn-secondary btn-icon" 
            title="+1 Episode"
            onClick={(e) => { e.stopPropagation(); onAddEpisode(anime.id); }}
          >
            +1
          </button>
        )}
        <button className="btn btn-primary" onClick={() => onWatch(anime.id)}>
          Watch
        </button>
        <button className="btn btn-secondary" onClick={() => onEdit(anime.id)}>
          Edit
        </button>
        <button className="btn btn-danger btn-icon" onClick={() => onDelete(anime.id)}>
          ✖
        </button>
      </div>
    </div>
  );
}
