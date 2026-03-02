import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Play, ChevronRight, TrendingUp, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { searchSongs, getTrending } from '../utils/api';

const FILTER_PILLS = ['All', 'Songs', 'Videos', 'Albums', 'Playlists', 'Podcasts'];

const MADE_FOR_YOU = [
  {
    id: 'mfy1',
    title: 'Techno Mix',
    subtitle: 'Daily Mix 1',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&q=80',
    searchQuery: 'techno electronic music',
  },
  {
    id: 'mfy2',
    title: 'Vocal Trance',
    subtitle: 'Audiora Curated',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80',
    searchQuery: 'vocal trance music',
  },
  {
    id: 'mfy3',
    title: 'Lo-Fi Chill',
    subtitle: 'Focus Mix',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
    searchQuery: 'lofi hip hop chill',
  },
  {
    id: 'mfy4',
    title: 'Hip Hop Hits',
    subtitle: "Today's Top",
    image: 'https://images.unsplash.com/photo-1520872122930-5a36fe16c2a8?w=300&q=80',
    searchQuery: 'hip hop hits 2024',
  },
];

// Song Card Component
const SongCard = ({ song, onPlay, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="playlist-card cursor-pointer rounded-xl overflow-hidden group"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      onClick={onPlay}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className="play-overlay-card absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity duration-200"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
          >
            <Play size={14} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-white text-sm font-semibold truncate">{song.title}</p>
        <p className="text-white/40 text-xs truncate mt-0.5">{song.artist}</p>
        {song.duration && (
          <p className="text-white/25 text-xs mt-1">{song.duration}</p>
        )}
      </div>
    </motion.div>
  );
};

// Song List Item for "trending" section
const SongListItem = ({ song, onPlay, index }) => {
  const formatViewCount = (count) => {
    if (!count) return '';
    const n = parseInt(count);
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B views`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M views`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K views`;
    return `${n} views`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (index - 5) * 0.04 }}
      className="song-card flex items-center gap-4 px-3 py-2 rounded-xl cursor-pointer group"
      style={{ background: 'rgba(255,255,255,0.02)' }}
      onClick={onPlay}
    >
      <span className="text-white/25 text-sm w-5 text-center">{index}</span>
      <div className="relative flex-shrink-0">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div className="play-overlay absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 transition-opacity">
          <Play size={12} className="text-white fill-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{song.title}</p>
        <p className="text-white/40 text-xs truncate">{song.artist}</p>
      </div>
      <span className="text-white/30 text-xs flex-shrink-0 hidden sm:block">
        {formatViewCount(song.viewCount)}
      </span>
      <span className="text-white/30 text-xs flex-shrink-0 w-10 text-right">
        {song.duration}
      </span>
    </motion.div>
  );
};

// Made For You Card
const MadeForYouCard = ({ item, onPlay, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
    className="playlist-card cursor-pointer rounded-xl overflow-hidden group"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
    onClick={onPlay}
  >
    <div className="relative overflow-hidden" style={{ paddingBottom: '80%' }}>
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        className="play-overlay-card absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity duration-200"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
        >
          <Play size={14} className="text-white fill-white ml-0.5" />
        </div>
      </div>
    </div>
    <div className="p-3">
      <p className="text-white text-sm font-semibold">{item.title}</p>
      <p className="text-white/40 text-xs mt-0.5">{item.subtitle}</p>
    </div>
  </motion.div>
);

// Skeleton loader
const SongCardsSkeleton = ({ count = 5 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="aspect-square skeleton" />
        <div className="p-3">
          <div className="w-3/4 h-3 skeleton mb-2" />
          <div className="w-1/2 h-2.5 skeleton" />
        </div>
      </div>
    ))}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { playSong } = usePlayer();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = React.useRef(null);

  // Load trending on mount
  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setIsLoadingTrending(true);
    try {
      const songs = await getTrending(10);
      setTrendingSongs(songs);
    } catch (e) {
      console.error('Failed to load trending:', e);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  // Debounced search
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!val.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      setHasSearched(true);
      try {
        const results = await searchSongs(val, 20);
        setSearchResults(results);
      } catch (e) {
        console.error('Search failed:', e);
      } finally {
        setIsSearching(false);
      }
    }, 600);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchSongs(searchQuery, 20);
      setSearchResults(results);
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSongPlay = (song, songList) => {
    playSong(song, songList);
  };

  const displaySongs = hasSearched ? searchResults : trendingSongs;
  const topResults = displaySongs.slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 gap-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search songs, albums, artists..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm text-white outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(147,51,234,0.4)';
              e.target.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          )}
        </form>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <Bell size={16} className="text-white/70" />
            <div className="notif-badge" />
          </button>

          {/* Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full overflow-hidden cursor-pointer"
            style={{ border: '2px solid rgba(147,51,234,0.5)' }}
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=audiora&backgroundColor=b6e3f4"
              alt="Profile"
              className="w-full h-full object-cover bg-purple-800"
            />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className={`pill-btn ${activeFilter === pill ? 'active' : ''}`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Top Results Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {hasSearched ? `Results for "${searchQuery}"` : 'Top Results'}
            </h2>
            <button
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              onClick={() => handleSearchChange(searchQuery || 'trending music')}
            >
              SEE ALL <ChevronRight size={12} />
            </button>
          </div>

          {isSearching || isLoadingTrending ? (
            <SongCardsSkeleton count={5} />
          ) : topResults.length === 0 ? (
            <div className="text-center py-12 text-white/30">
              <Music size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No results found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {topResults.map((song, i) => (
                <SongCard
                  key={song.id}
                  song={song}
                  index={i}
                  onPlay={() => handleSongPlay(song, topResults)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Made For You Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Made For You</h2>
            <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer">
              SEE ALL <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {MADE_FOR_YOU.map((item, i) => (
              <MadeForYouCard
                key={item.id}
                item={item}
                index={i}
                onPlay={() => {
                  searchSongs(item.searchQuery, 10).then(songs => {
                    if (songs.length > 0) handleSongPlay(songs[0], songs);
                  }).catch(console.error);
                }}
              />
            ))}
          </div>
        </section>

        {/* All Songs / More section */}
        {displaySongs.length > 5 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {hasSearched ? 'More Results' : 'Trending Now'}
              </h2>
              {!hasSearched && (
                <div className="flex items-center gap-1 text-purple-400 text-xs">
                  <TrendingUp size={12} /> Live
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {displaySongs.slice(5).map((song, i) => (
                <SongListItem
                  key={song.id}
                  song={song}
                  index={i + 6}
                  onPlay={() => handleSongPlay(song, displaySongs)}
                />
              ))}
            </div>
          </section>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
};

export default Home;
