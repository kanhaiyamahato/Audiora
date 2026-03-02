import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Play, Music2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getTrending, searchSongs } from '../utils/api';

const GENRES = [
  { label: 'Pop', query: 'pop music 2024', color: '#ec4899', emoji: '🎵' },
  { label: 'Hip Hop', query: 'hip hop rap 2024', color: '#f59e0b', emoji: '🎤' },
  { label: 'Electronic', query: 'electronic edm music', color: '#06b6d4', emoji: '🎛️' },
  { label: 'Rock', query: 'rock music hits', color: '#ef4444', emoji: '🎸' },
  { label: 'R&B', query: 'rnb soul music', color: '#8b5cf6', emoji: '🎙️' },
  { label: 'Jazz', query: 'jazz music smooth', color: '#f97316', emoji: '🎷' },
  { label: 'Classical', query: 'classical music orchestral', color: '#10b981', emoji: '🎻' },
  { label: 'Country', query: 'country music hits', color: '#84cc16', emoji: '🤠' },
];

const Explore = () => {
  const { playSong } = usePlayer();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrending(12)
      .then(setTrending)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGenrePlay = async (genre) => {
    try {
      const songs = await searchSongs(genre.query, 10);
      if (songs.length > 0) playSong(songs[0], songs);
    } catch (e) {}
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <TrendingUp size={20} className="text-purple-400" />
        <h1 className="text-xl font-bold text-white">Explore</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Genres */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Browse by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GENRES.map((g, i) => (
              <motion.button
                key={g.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGenrePlay(g)}
                className="relative overflow-hidden rounded-xl py-8 px-4 cursor-pointer group text-left"
                style={{ background: `linear-gradient(135deg, ${g.color}40, ${g.color}20)`, border: `1px solid ${g.color}30` }}
              >
                <div className="text-3xl mb-2">{g.emoji}</div>
                <p className="text-white font-bold text-sm">{g.label}</p>
                <div
                  className="absolute right-3 bottom-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: g.color }}
                >
                  <Play size={12} className="text-white fill-white ml-0.5" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-400" /> Global Trending
          </h2>
          {loading ? (
            <div className="flex gap-4 flex-wrap">
              {Array.from({length: 6}).map((_, i) => (
                <div key={i} className="w-36 rounded-xl overflow-hidden" style={{background:'rgba(255,255,255,0.04)'}}>
                  <div className="w-36 h-36 skeleton" />
                  <div className="p-3">
                    <div className="w-3/4 h-3 skeleton mb-2" />
                    <div className="w-1/2 h-2.5 skeleton" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {trending.map((song, i) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="playlist-card cursor-pointer rounded-xl overflow-hidden group"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => playSong(song, trending)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="play-overlay-card absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}>
                        <Play size={11} className="text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-2 left-2 text-xs font-bold text-white/80 bg-black/40 rounded px-1.5 py-0.5">
                      #{i + 1}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="text-white text-xs font-semibold truncate">{song.title}</p>
                    <p className="text-white/40 text-xs truncate">{song.artist}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Explore;
