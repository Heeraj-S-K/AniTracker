import React from 'react';

export default function SearchBar({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }) {
  return (
    <div className="flex-row mb-4" style={{ backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
      <input 
        type="text" 
        placeholder="Search anime..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ flex: 2 }}
      />
      <select 
        value={statusFilter} 
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ flex: 1 }}
      >
        <option value="All">All Statuses</option>
        <option value="Watching">Watching</option>
        <option value="Completed">Completed</option>
        <option value="Plan to Watch">Plan to Watch</option>
        <option value="Dropped">Dropped</option>
      </select>
    </div>
  );
}
