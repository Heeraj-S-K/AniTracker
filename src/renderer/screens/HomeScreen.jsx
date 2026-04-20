import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';
import SearchBar from '../components/SearchBar';
import { getAnimeList, deleteAnime, updateAnime } from '../storage/animeStorage';

export default function HomeScreen({ onEdit, onWatch, onAdd }) {
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadData = () => {
    setAnimes(getAnimeList());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this anime?')) {
      deleteAnime(id);
      loadData();
    }
  };

  const handleAddEpisode = (id) => {
    const anime = animes.find(a => a.id === id);
    if (anime && anime.watchedEpisodes < anime.totalEpisodes) {
      updateAnime(id, { watchedEpisodes: anime.watchedEpisodes + 1 });
      loadData();
    }
  };

  const filtered = animes.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>My Anime List</h2>
        <button className="btn btn-primary" onClick={onAdd}>+ Add Anime</button>
      </div>
      
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
          <p>No anime found. Add some to get started!</p>
        </div>
      ) : (
        <div className="anime-grid">
          {filtered.map(anime => (
            <AnimeCard 
              key={anime.id} 
              anime={anime} 
              onEdit={onEdit} 
              onWatch={onWatch} 
              onDelete={handleDelete}
              onAddEpisode={handleAddEpisode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
