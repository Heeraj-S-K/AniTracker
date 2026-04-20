const STORAGE_KEY = 'anime_list';

export function getAnimeList() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAnimeList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function generateId() {
  return crypto.randomUUID();
}

export function addAnime(entry) {
  const list = getAnimeList();
  const newEntry = {
    id: generateId(),
    name: entry.name || '',
    watchedEpisodes: entry.watchedEpisodes || 0,
    totalEpisodes: entry.totalEpisodes || 12,
    status: entry.status || 'Plan to Watch',
    rating: entry.rating || 0,
    notes: entry.notes || '',
    createdAt: new Date().toISOString(),
    episodes: entry.episodes || [],
  };
  list.unshift(newEntry);
  saveAnimeList(list);
  return newEntry;
}

export function updateAnime(id, changes) {
  const list = getAnimeList();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...changes };
  // Ensure watchedEpisodes doesn't exceed totalEpisodes
  if (list[idx].watchedEpisodes > list[idx].totalEpisodes) {
    list[idx].watchedEpisodes = list[idx].totalEpisodes;
  }
  if (list[idx].watchedEpisodes < 0) list[idx].watchedEpisodes = 0;
  saveAnimeList(list);
  return list[idx];
}

export function deleteAnime(id) {
  const list = getAnimeList().filter((a) => a.id !== id);
  saveAnimeList(list);
  return list;
}

export function getAnimeById(id) {
  return getAnimeList().find((a) => a.id === id) || null;
}
