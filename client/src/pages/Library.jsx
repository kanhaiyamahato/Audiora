import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Clock, Play, Music2, Trash2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Library = () => {
  const { playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState('playlists');
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setPlaylists(JSON.parse(localStorage.getItem('audiora_playlists') || '[]'));
    setLikedSongs(JSON.parse(localStorage.getItem('audiora_liked') || '[]'));
    setHistory(JSON.parse(localStorage.getItem('audiora_history') || '[]'));
  }, [activeTab]);

  const deletePlaylist = (id) => {
    const updated = playlists.filter(p => p.id !== id);
    setPlaylists(updated);
    localStorage.setItem('audiora_playlists', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <BookOpen size={20} className="text-purple-400" />
        <h1 className="text-xl font-bold text-white">Library</h1>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex gap-4 px-6 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {['playlists', 'liked', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold pb-1 capitalize cursor-pointer transition-colors ${
              activeTab === tab ? 'text-white border-b-2 border-purple-500' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab === 'liked' ? 'Liked Songs' : tab === 'history' ? 'Recently Played' : 'Playlists'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Playlists */}
        {activeTab === 'playlists' && (
          <div>
            {playlists.length === 0 ? (
              <EmptyState icon={Music2} message="No playlists yet" sub="Create your first playlist using the + button" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {playlists.map((pl, i) => (
                  <motion.div
                    key={pl.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="playlist-card rounded-xl overflow-hidden group relative cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="aspect-square flex items-center justify-center"
                      style={{ background: pl.cover ? `url(${pl.cover}) center/cover` : 'linear-gradient(135deg, rgba(147,51,234,0.3), rgba(236,72,153,0.2))' }}>
                      {!pl.cover && <Music2 size={32} className="text-white/30" />}
                    </div>
                    <div className="p-3">
                      <p className="text-white text-sm font-semibold truncate">{pl.name}</p>
                      <p className="text-white/40 text-xs">{pl.songs?.length || 0} songs</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deletePlaylist(pl.id); }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={11} className="text-white/70" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Liked Songs */}
        {activeTab === 'liked' && (
          <div>
            {likedSongs.length === 0 ? (
              <EmptyState icon={Heart} message="No liked songs" sub="Heart a song to add it here" />
            ) : (
              likedSongs.map((song, i) => (
                <SongRow key={song.id} song={song} index={i + 1} onPlay={() => playSong(song, likedSongs)} />
              ))
            )}
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div>
            {history.length === 0 ? (
              <EmptyState icon={Clock} message="No listening history" sub="Songs you play will appear here" />
            ) : (
              history.map((song, i) => (
                <SongRow key={song.id + i} song={song} index={i + 1} onPlay={() => playSong(song, history)} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SongRow = ({ song, index, onPlay }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.03 }}
    className="song-card flex items-center gap-4 px-3 py-2 rounded-xl cursor-pointer group"
    style={{ background: 'rgba(255,255,255,0.02)' }}
    onClick={onPlay}
  >
    <span className="text-white/25 text-sm w-5 text-center">{index}</span>
    <div className="relative flex-shrink-0">
      <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
      <div className="play-overlay absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 transition-opacity">
        <Play size={12} className="text-white fill-white" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-medium truncate">{song.title}</p>
      <p className="text-white/40 text-xs truncate">{song.artist}</p>
    </div>
    <span className="text-white/30 text-xs">{song.duration}</span>
  </motion.div>
);

const EmptyState = ({ icon: Icon, message, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.2)' }}>
      <Icon size={28} className="text-purple-400/50" />
    </div>
    <p className="text-white/40 font-semibold mb-1">{message}</p>
    <p className="text-white/20 text-sm">{sub}</p>
  </div>
);

export default Library;
