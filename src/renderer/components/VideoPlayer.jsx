import React, { useEffect, useRef, useState } from 'react';
import { checkFileExists, toFileUrl } from '../video/videoHandler';

export default function VideoPlayer({ episode, onVideoEnd }) {
  const videoRef = useRef(null);
  const [fileExists, setFileExists] = useState(true);

  useEffect(() => {
    async function verifyFile() {
      if (episode && episode.filePath) {
        const exists = await checkFileExists(episode.filePath);
        setFileExists(exists);
      }
    }
    verifyFile();
  }, [episode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (videoRef.current.paused) videoRef.current.play();
        else videoRef.current.pause();
      } else if (e.code === 'ArrowRight') {
        videoRef.current.currentTime += 5;
      } else if (e.code === 'ArrowLeft') {
        videoRef.current.currentTime -= 5;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenExternal = async () => {
    if (window.electronAPI && episode?.filePath) {
      window.electronAPI.openExternal(episode.filePath);
    }
  };

  if (!episode) return <div className="video-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Select an episode to play</div>;

  if (!episode.filePath) {
    return <div className="video-container"><div className="video-error">No video file assigned to this episode</div></div>;
  }

  if (!fileExists) {
    return (
       <div className="video-container">
         <div className="video-error">
           File not found at path: {episode.filePath}
         </div>
       </div>
    );
  }

  return (
    <div>
      <div className="video-container">
        <video 
          ref={videoRef}
          src={toFileUrl(episode.filePath)} 
          controls 
          autoPlay
          onEnded={onVideoEnd}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button className="btn btn-secondary" onClick={handleOpenExternal}>
          📺 Open in System Player (VLC / MPC)
        </button>
      </div>
    </div>
  );
}
