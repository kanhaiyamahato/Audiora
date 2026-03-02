require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Helper to format duration (PT4M13S → 4:13)
function formatDuration(iso) {
  if (!iso) return '0:00';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Search route
app.get('/api/search', async (req, res) => {
  try {
    const { q, type = 'video', maxResults = 20 } = req.query;
    if (!q) return res.status(400).json({ error: 'Query is required' });

    const searchRes = await youtube.search.list({
      part: ['snippet'],
      q: `${q} music`,
      type: ['video'],
      videoCategoryId: '10',
      maxResults: parseInt(maxResults),
      order: 'relevance'
    });

    const videoIds = searchRes.data.items.map(item => item.id.videoId).filter(Boolean);

    let durations = {};
    if (videoIds.length > 0) {
      const videoDetails = await youtube.videos.list({
        part: ['contentDetails', 'statistics'],
        id: videoIds
      });
      videoDetails.data.items.forEach(v => {
        durations[v.id] = {
          duration: formatDuration(v.contentDetails?.duration),
          viewCount: v.statistics?.viewCount || '0'
        };
      });
    }

    const results = searchRes.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      album: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      duration: durations[item.id.videoId]?.duration || '3:30',
      viewCount: durations[item.id.videoId]?.viewCount || '0',
      publishedAt: item.snippet.publishedAt
    }));

    res.json({ results });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Trending music
app.get('/api/trending', async (req, res) => {
  try {
    const { maxResults = 20, regionCode = 'US' } = req.query;
    const trendingRes = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      chart: 'mostPopular',
      videoCategoryId: '10',
      maxResults: parseInt(maxResults),
      regionCode
    });

    const results = trendingRes.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      album: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      duration: formatDuration(item.contentDetails?.duration),
      viewCount: item.statistics?.viewCount || '0',
      publishedAt: item.snippet.publishedAt
    }));

    res.json({ results });
  } catch (error) {
    console.error('Trending error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Related videos
app.get('/api/related', async (req, res) => {
  try {
    const { videoId, maxResults = 10 } = req.query;
    if (!videoId) return res.status(400).json({ error: 'videoId required' });

    const searchRes = await youtube.search.list({
      part: ['snippet'],
      relatedToVideoId: videoId,
      type: ['video'],
      maxResults: parseInt(maxResults)
    });

    const results = searchRes.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      duration: '3:30'
    }));

    res.json({ results });
  } catch (error) {
    console.error('Related error:', error.message);
    // Return empty array on error (related API sometimes returns 403)
    res.json({ results: [] });
  }
});

// Lyrics route - multi-source with fallback
app.get('/api/lyrics', async (req, res) => {
  try {
    const { title, artist } = req.query;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    // Clean the title - remove YouTube-specific stuff
    const cleanTitle = title
      .replace(/\(.*?official.*?\)/gi, '')
      .replace(/\[.*?official.*?\]/gi, '')
      .replace(/official\s*(music\s*)?video/gi, '')
      .replace(/\(.*?lyric.*?\)/gi, '')
      .replace(/\[.*?lyric.*?\]/gi, '')
      .replace(/\(.*?audio.*?\)/gi, '')
      .replace(/\[.*?audio.*?\]/gi, '')
      .replace(/\(.*?hd.*?\)/gi, '')
      .replace(/ft\b.*/gi, '')
      .replace(/feat\b.*/gi, '')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .trim();

    const cleanArtist = (artist || '')
      .replace(/VEVO$/gi, '')
      .replace(/Official$/gi, '')
      .replace(/\s*-\s*Topic$/gi, '')
      .trim();

    // Try lrclib.net API (no auth required, good lyrics database)
    try {
      const lrclibRes = await axios.get('https://lrclib.net/api/search', {
        params: { q: `${cleanTitle} ${cleanArtist}`.trim() },
        timeout: 8000,
        headers: { 'User-Agent': 'Audiora/1.0 (music streaming app)' }
      });

      if (lrclibRes.data && lrclibRes.data.length > 0) {
        const best = lrclibRes.data[0];
        // Try synced lyrics first, fallback to plain lyrics
        const lyricsText = best.plainLyrics || best.syncedLyrics?.replace(/\[\d+:\d+\.\d+\]\s*/g, '');
        if (lyricsText) {
          const lines = lyricsText
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0 && !l.startsWith('['));
          if (lines.length > 0) {
            return res.json({ lyrics: lines, found: true, source: 'lrclib' });
          }
        }
      }
    } catch (e) {
      // lrclib failed, continue
    }

    // Try lyrics.ovh API (fast timeout)
    try {
      const response = await axios.get(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist || 'unknown')}/${encodeURIComponent(cleanTitle)}`,
        { timeout: 4000 }
      );

      if (response.data && response.data.lyrics) {
        const lines = response.data.lyrics
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0);
        if (lines.length > 0) {
          return res.json({ lyrics: lines, found: true, source: 'ovh' });
        }
      }
    } catch (e) {
      // lyrics.ovh failed or timed out
    }

    // No lyrics found
    res.json({ lyrics: [], found: false, message: 'LYRICS NOT AVAILABLE' });
  } catch (error) {
    console.error('Lyrics error:', error.message);
    res.json({ lyrics: [], found: false, message: 'LYRICS NOT AVAILABLE' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React build
const clientBuild = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuild));
// SPA catch-all - use a specific path pattern for Express 5
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(clientBuild, 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Audiora Server running on port ${PORT}`);
});
