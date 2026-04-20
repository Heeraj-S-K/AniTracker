import React, { useState, useEffect } from 'react';
import { getAnimeById, addAnime, updateAnime } from '../storage/animeStorage';
import { selectVideoFile, selectVideoFolder } from '../video/videoHandler';

export default function AddEditScreen({ animeId, onBack }) {
  const isEdit = !!animeId;
  const [formData, setFormData] = useState({
    name: '',
    totalEpisodes: 12,
    watchedEpisodes: 0,
    status: 'Plan to Watch',
    rating: 0,
    notes: '',
    episodes: []
  });

  useEffect(() => {
    if (isEdit) {
      const anime = getAnimeById(animeId);
      if (anime) setFormData(anime);
    }
  }, [animeId, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'totalEpisodes' || name === 'watchedEpisodes' || name === 'rating' ? Number(value) : value 
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
       alert('Name is required');
       return;
    }
    if (isEdit) updateAnime(animeId, formData);
    else addAnime(formData);
    onBack();
  };

  const handleAddSingleFile = async () => {
    try {
      const filePath = await selectVideoFile();
      if (filePath) {
        // Extract filename from path
        const fileName = filePath.split(/[/\\]/).pop();
        setFormData(prev => ({
          ...prev,
          episodes: [...prev.episodes, { episodeNumber: prev.episodes.length + 1, filePath, fileName }]
        }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImportFolder = async () => {
    try {
      const resultFiles = await selectVideoFolder();
      if (!resultFiles || resultFiles.length === 0) return;
      
      const newEpisodes = resultFiles.map(fileObj => {
        // Simple heuristic to extract episode number from filename
        // Matches things like "Episode 2", "Ep02", "- 02", etc.
        const match = fileObj.name.match(/(?:ep|episode|e|part|\s-)\s*0*(\d+)/i);
        const epNum = match ? parseInt(match[1], 10) : null;
        return {
          fileName: fileObj.name,
          filePath: fileObj.path,
          guessEpNum: epNum
        };
      });
      
      // Sort by guessed episode number, or alphabetically
      newEpisodes.sort((a, b) => {
        if (a.guessEpNum && b.guessEpNum) return a.guessEpNum - b.guessEpNum;
        return a.fileName.localeCompare(b.fileName);
      });

      // Map to proper episode objects
      const startIndex = formData.episodes.length + 1;
      const mapped = newEpisodes.map((ep, idx) => ({
        episodeNumber: ep.guessEpNum || (startIndex + idx),
        filePath: ep.filePath,
        fileName: ep.fileName
      }));

      setFormData(prev => ({
        ...prev,
        episodes: [...prev.episodes, ...mapped]
      }));
    } catch(err) {
      alert('Error importing folder: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="mb-4">{isEdit ? 'Edit Anime' : 'Add New Anime'}</h2>
      
      <form onSubmit={handleSave} style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
        <div className="flex-row mb-4" style={{ alignItems: 'flex-start' }}>
          <div className="form-group" style={{ flex: 2 }}>
            <label>Anime Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
              <option value="Plan to Watch">Plan to Watch</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        </div>

        <div className="flex-row mb-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Total Episodes</label>
            <input type="number" name="totalEpisodes" min="1" value={formData.totalEpisodes} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Watched Episodes</label>
            <input type="number" name="watchedEpisodes" min="0" max={formData.totalEpisodes} value={formData.watchedEpisodes} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Rating (0-10)</label>
            <input type="number" name="rating" min="0" max="10" value={formData.rating} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group mb-4">
          <label>Notes (Optional)</label>
          <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange}></textarea>
        </div>

        <hr style={{ borderColor: 'var(--card-border)', margin: '2rem 0' }} />

        <div className="mb-4">
          <div className="flex-row mb-2" style={{ justifyContent: 'space-between' }}>
            <h3>Assigned Episodes ({formData.episodes.length})</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleAddSingleFile}>
                  + Add Single File
                </button>
                <button type="button" className="btn btn-primary" onClick={handleImportFolder}>
                  + Import Folder
                </button>
            </div>
          </div>
          
          <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            {formData.episodes.length === 0 ? (
              <p style={{ textAlign: 'center' }}>No episodes assigned yet. Add a file or import a folder.</p>
            ) : (
              formData.episodes.map((ep, index) => (
                <div key={index} className="episode-list-item flex-row">
                  <div style={{ flex: 1 }}>
                    <strong>Ep {ep.episodeNumber}:</strong> {ep.fileName || ep.filePath.split(/[/\\]/).pop()}
                  </div>
                  <button type="button" className="btn btn-danger btn-icon" onClick={() => {
                    const newEps = [...formData.episodes];
                    newEps.splice(index, 1);
                    setFormData(prev => ({ ...prev, episodes: newEps }));
                  }}>✖</button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-row" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onBack}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
