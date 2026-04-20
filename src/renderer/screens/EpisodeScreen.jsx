import React, { useState, useEffect } from 'react';
import { getAnimeById, updateAnime } from '../storage/animeStorage';
import VideoPlayer from '../components/VideoPlayer';

export default function EpisodeScreen({ animeId, onBack }) {
  const [anime, setAnime] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  useEffect(() => {
    setAnime(getAnimeById(animeId));
  }, [animeId]);

  if (!anime) return <div>Loading...</div>;

  const handleVideoEnd = () => {
    if (anime.watchedEpisodes < anime.totalEpisodes) {
       // Only increment if we just watched an un-watched episode roughly
       // Let's just always increment watchedEpisodes by 1 on end if it's below total.
       // User can correct manually if needed.
       const newWatched = anime.watchedEpisodes + 1;
       const updated = updateAnime(animeId, { watchedEpisodes: newWatched });
       setAnime(updated);
       
       // Optional: Move to next episode
       const currentNum = currentEpisode.episodeNumber;
       const nextEp = anime.episodes.find(e => e.episodeNumber === currentNum + 1);
       if (nextEp) {
           setCurrentEpisode(nextEp);
       }
    }
  };

  const handlePlay = (ep) => {
    setCurrentEpisode(ep);
  };

  return (
    <div>
      <div className="flex-row mb-4" style={{ justifyContent: 'space-between' }}>
        <h2>{anime.name} - Watch</h2>
        <div style={{color: 'var(--text-secondary)'}}>Progress: {anime.watchedEpisodes} / {anime.totalEpisodes}</div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '0' }}>
           <div style={{ backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
             <h3 className="mb-2">
                 {currentEpisode ? `Episode ${currentEpisode.episodeNumber} - ${currentEpisode.fileName || 'Video'}` : 'Select an episode to start'}
             </h3>
             <VideoPlayer episode={currentEpisode} onVideoEnd={handleVideoEnd} />
           </div>
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--card-border)', maxHeight: '70vh', overflowY: 'auto' }}>
            <h3 className="mb-4">Episodes</h3>
            {(!anime.episodes || anime.episodes.length === 0) && (
              <p style={{color: 'var(--text-secondary)'}}>No videos linked. Edit anime to add files.</p>
            )}
            {anime.episodes.sort((a,b) => a.episodeNumber - b.episodeNumber).map(ep => (
              <div 
                key={ep.episodeNumber} 
                className="episode-list-item"
                style={{ 
                  cursor: 'pointer', 
                  borderLeft: currentEpisode && currentEpisode.episodeNumber === ep.episodeNumber ? '4px solid var(--accent-base)' : '4px solid transparent'
                }}
                onClick={() => handlePlay(ep)}
              >
                <div>
                  <strong>Ep {ep.episodeNumber}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', wordBreak: 'break-all' }}>
                    {ep.fileName || ep.filePath.split(/[/\\]/).pop()}
                  </div>
                </div>
                <button className="btn btn-secondary btn-icon" onClick={(e) => { e.stopPropagation(); handlePlay(ep); }}>▶️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
