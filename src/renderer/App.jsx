import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import AddEditScreen from './screens/AddEditScreen';
import EpisodeScreen from './screens/EpisodeScreen';
import { getAnimeList } from './storage/animeStorage';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'add', 'edit', 'episodes'
  const [activeAnimeId, setActiveAnimeId] = useState(null);
  
  // Dummy effect to re-render if needed, actually we just pass props down
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AskUrSenpai</h1>
        {currentView !== 'home' && (
          <button className="btn btn-secondary" onClick={() => setCurrentView('home')}>
            &larr; Back to Home
          </button>
        )}
      </header>

      <main className="app-main">
        {currentView === 'home' && (
          <HomeScreen 
            onEdit={(id) => { setActiveAnimeId(id); setCurrentView('edit'); }}
            onWatch={(id) => { setActiveAnimeId(id); setCurrentView('episodes'); }}
            onAdd={() => { setActiveAnimeId(null); setCurrentView('add'); }}
          />
        )}
        {currentView === 'add' && (
          <AddEditScreen 
            onBack={() => setCurrentView('home')} 
          />
        )}
        {currentView === 'edit' && activeAnimeId && (
          <AddEditScreen 
            animeId={activeAnimeId} 
            onBack={() => setCurrentView('home')} 
          />
        )}
        {currentView === 'episodes' && activeAnimeId && (
          <EpisodeScreen 
            animeId={activeAnimeId}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
