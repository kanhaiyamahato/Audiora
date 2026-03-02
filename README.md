# 🎵 Audiora - Premium Music Streaming App

A production-ready, Spotify/YouTube Music-inspired streaming application with a stunning dark purple glassmorphism design.

## 🚀 Live App

- **Frontend + Backend**: `http://localhost:3000`
- **API Health**: `http://localhost:3000/api/health`

## ✨ Features

### Core Features
- 🔍 **Real-time Search** — Search songs, artists, albums via YouTube Data API v3
- 🎵 **YouTube IFrame Player** — Full audio/video playback with hidden iframe
- 📋 **Queue Management** — Up Next panel with song queue
- 🎤 **Lyrics View** — Real-time scrolling lyrics (via lyrics.ovh API) or "LYRICS NOT AVAILABLE" message
- 🌊 **Fullscreen Player** — Vinyl-spinning album art with full controls
- 🔔 **Notifications Page** — Welcome, Release alerts, Security alerts
- 👤 **Profile & Settings** — User stats, High Quality Audio, Autoplay toggles
- ➕ **New Playlist Modal** — Create playlists with cover upload
- 📱 **Library Page** — Playlists, Liked Songs, Recently Played (LocalStorage)
- 🧭 **Explore Page** — Genre browsing + Global Trending charts

### Design
- 🎨 **Triple-tone dark purple gradient** (#0f0c29 → #302b63 → #24243e)
- 🔮 **Glassmorphism** — `backdrop-filter: blur(20px)` on all panels
- ✨ **Framer Motion** — Smooth page transitions and animations
- 📐 **Responsive** — Collapsible sidebar, adaptive grid layouts

## 📁 Project Structure

```
webapp/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Layout, Sidebar, PlayerBar, QueuePanel, etc.
│   │   ├── pages/        # Home, Explore, Library, Profile, Notifications
│   │   ├── context/      # PlayerContext (global state)
│   │   └── utils/        # API utilities
│   └── dist/             # Production build
└── server/               # Node.js + Express backend
    ├── index.js          # API routes + static serving
    └── .env              # YOUTUBE_API_KEY
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=QUERY` | Search music on YouTube |
| GET | `/api/trending` | Get trending music chart |
| GET | `/api/related?videoId=ID` | Get related videos |
| GET | `/api/lyrics?title=T&artist=A` | Fetch song lyrics |
| GET | `/api/health` | Server health check |

## ⚙️ Environment Setup

Create `/server/.env`:
```env
YOUTUBE_API_KEY=your_api_key_here
PORT=3000
```

## 🏃 Running Locally

```bash
# Backend
cd server && npm install && node index.js

# Frontend (development)
cd client && npm install && npm run dev

# Frontend (production build)
cd client && npm run build
# Then backend serves /client/dist automatically
```

## 🎯 Data Architecture

- **Music Data**: YouTube Data API v3 (search, trending, related)
- **Lyrics**: lyrics.ovh public API
- **User State**: LocalStorage (playlists, liked songs, history, settings)
- **No Database Required**

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS 3, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express 5, googleapis, axios, dotenv
- **Player**: YouTube IFrame Player API
- **Routing**: React Router v6

## 📅 Last Updated
March 2, 2026
