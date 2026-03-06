import axios from 'axios';

// When accessed via public URL, we need to proxy through the Vite dev server
// The vite.config.js has a proxy from /api -> http://localhost:5000
const BASE_URL = 'https://audiora-7qru.onrender.com';  // Use relative URL so Vite proxy handles it

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export const searchSongs = async (query, maxResults = 20) => {
  const res = await api.get('/api/search', { params: { q: query, maxResults } });
  return res.data.results;
};

export const getTrending = async (maxResults = 20) => {
  const res = await api.get('/api/trending', { params: { maxResults } });
  return res.data.results;
};

export const getRelated = async (videoId, maxResults = 10) => {
  const res = await api.get('/api/related', { params: { videoId, maxResults } });
  return res.data.results;
};

export const getLyrics = async (title, artist) => {
  const res = await api.get('/api/lyrics', { params: { title, artist } });
  return res.data;
};

export default api;
