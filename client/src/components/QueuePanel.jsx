import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const QueuePanel = () => {
  const {
    currentSong, queue, queueIndex,
    lyrics, lyricsFound, activeLyricIndex,
    relatedSongs,
    showQueuePanel, setShowQueuePanel,
    queuePanelTab, setQueuePanelTab,
    playSong,
  } = usePlayer();

  const activeLyricRef = useRef(null);

  // Scroll to active lyric
  useEffect(() => {
    if (activeLyricRef.current && queuePanelTab === 'lyrics') {
      activeLyricRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLyricIndex, queuePanelTab]);

  const upNextSongs = queue.slice(queueIndex + 1, queueIndex + 11);

  // Mood filter tabs for UP NEXT
  const MOOD_FILTERS = ['All', 'Familiar', 'Chill', 'Party', 'Romance', 'Indian'];
  const [activeMood, setActiveMood] = React.useState('All');

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 380, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{
        background: 'rgba(15, 12, 41, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        minWidth: 380,
      }}
    >
      {/* Header Tabs */}
      <div className="flex items-center px-4 pt-4 pb-2 gap-4 flex-shrink-0">
        {['upnext', 'lyrics', 'related'].map((tab) => (
          <button
            key={tab}
            onClick={() => setQueuePanelTab(tab)}
            className={`text-sm font-semibold pb-1 cursor-pointer transition-colors capitalize ${
              queuePanelTab === tab
                ? 'text-white border-b-2 border-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab === 'upnext' ? 'Up Next' : tab === 'lyrics' ? 'Lyrics' : 'Related'}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setShowQueuePanel(false)} className="cursor-pointer">
          <X size={16} className="text-white/40 hover:text-white/70" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">

        {/* UP NEXT */}
        {queuePanelTab === 'upnext' && (
          <div className="px-4 py-2">
            {/* Playing from */}
            {currentSong && (
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-white/40">Playing from</p>
                  <p className="text-sm font-semibold text-white">
                    {currentSong.album || currentSong.artist || 'Mix'}
                  </p>
                </div>
                <button
                  className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
                >
                  + Save
                </button>
              </div>
            )}

            {/* Mood filters */}
            <div className="flex gap-2 flex-wrap mb-4">
              {MOOD_FILTERS.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMood(m)}
                  className={`pill-btn ${activeMood === m ? 'active' : ''}`}
                  style={{ fontSize: '11px', padding: '4px 12px' }}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Current song */}
            {currentSong && (
              <div
                className="flex items-center gap-3 p-2 rounded-lg mb-2"
                style={{ background: 'rgba(147, 51, 234, 0.15)', border: '1px solid rgba(147,51,234,0.3)' }}
              >
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
                  <p className="text-white/50 text-xs truncate">{currentSong.artist}</p>
                </div>
                <span className="text-xs text-white/40">{currentSong.duration || '3:30'}</span>
                {/* Mini wave animation */}
                <div className="flex items-end gap-0.5 h-4">
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                </div>
              </div>
            )}

            {/* Queue songs */}
            {upNextSongs.length > 0 ? (
              upNextSongs.map((song, i) => (
                <QueueSongItem
                  key={song.id + i}
                  song={song}
                  onPlay={() => playSong(song, queue)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-white/30 text-sm">
                <p>Queue is empty</p>
                <p className="text-xs mt-1">Search for songs to add</p>
              </div>
            )}
          </div>
        )}

        {/* LYRICS */}
        {queuePanelTab === 'lyrics' && (
          <div className="px-4 py-4">
            {!currentSong ? (
              <div className="text-center py-12 text-white/30">
                <p className="text-sm">No song playing</p>
              </div>
            ) : !lyricsFound || lyrics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/30 text-sm font-medium">LYRICS NOT AVAILABLE</p>
                <p className="text-white/20 text-xs mt-2">for "{currentSong.title}"</p>
              </div>
            ) : (
              <div className="space-y-1">
                {lyrics.map((line, i) => (
                  <p
                    key={i}
                    ref={i === activeLyricIndex ? activeLyricRef : null}
                    className={`lyrics-line py-1 ${i === activeLyricIndex ? 'active' : ''}`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RELATED */}
        {queuePanelTab === 'related' && (
          <div className="px-4 py-4">
            {relatedSongs.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-sm">
                <p>No related songs</p>
              </div>
            ) : (
              relatedSongs.map((song, i) => (
                <QueueSongItem
                  key={song.id + i}
                  song={song}
                  onPlay={() => playSong(song, relatedSongs)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
};

const QueueSongItem = ({ song, onPlay }) => (
  <div
    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors mb-1"
    onClick={onPlay}
  >
    <div className="relative flex-shrink-0">
      <img
        src={song.thumbnail}
        alt={song.title}
        className="w-10 h-10 rounded-lg object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={14} className="text-white fill-white" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-medium truncate">{song.title}</p>
      <p className="text-white/40 text-xs truncate">{song.artist}</p>
    </div>
    <span className="text-xs text-white/30">{song.duration || '3:30'}</span>
  </div>
);

export default QueuePanel;
