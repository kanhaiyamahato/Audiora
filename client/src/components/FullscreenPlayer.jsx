import React from 'react';
import { motion } from 'framer-motion';
import {
  X, SkipBack, SkipForward, Play, Pause,
  Heart, Shuffle, Repeat, Repeat1, Volume2, VolumeX
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const FullscreenPlayer = () => {
  const {
    currentSong, isPlaying, isFullscreen, setIsFullscreen,
    progress, duration, isShuffled, repeatMode,
    volume, isMuted,
    togglePlay, skipNext, skipPrev,
    toggleShuffle, toggleRepeat,
    toggleMute, handleVolumeChange, seekTo,
    playerRef,
    setShowLyricsView,
  } = usePlayer();

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, pct));
    seekTo(clamped);
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo((clamped / 100) * duration, true);
    }
  };

  if (!currentSong) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fullscreen-player"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}
    >
      {/* Background album art blur */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${currentSong.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-10">
        <div className="text-sm text-white/50">Now Playing</div>
        <div className="text-sm font-semibold text-white/80">{currentSong.artist}</div>
        <button
          onClick={() => setIsFullscreen(false)}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-8">
        {/* Album Art */}
        <motion.div
          animate={{
            rotate: isPlaying ? [0, 360] : 0,
          }}
          transition={{
            duration: 20,
            repeat: isPlaying ? Infinity : 0,
            ease: 'linear',
          }}
          className="relative mb-8"
        >
          <div
            className="w-64 h-64 rounded-full overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(147,51,234,0.3)',
              border: '4px solid rgba(255,255,255,0.1)',
            }}
          >
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Vinyl hole */}
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{
                background: '#0f0c29',
                border: '3px solid rgba(255,255,255,0.2)',
              }}
            />
          </div>
        </motion.div>

        {/* Song Info */}
        <div className="text-center mb-6 w-full">
          <h2 className="text-2xl font-bold text-white mb-1 truncate">{currentSong.title}</h2>
          <p className="text-white/50 text-base">{currentSong.artist}</p>
        </div>

        {/* Progress */}
        <div className="w-full mb-4">
          <div
            className="progress-bar w-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-white/40">{formatTime((progress / 100) * duration)}</span>
            <span className="text-xs text-white/40">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-6">
          <button onClick={toggleShuffle}>
            <Shuffle size={20} className={isShuffled ? 'text-purple-400' : 'text-white/40'} />
          </button>
          <button onClick={skipPrev}>
            <SkipBack size={28} className="text-white/70 hover:text-white fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #9333ea, #ec4899)',
              boxShadow: '0 8px 32px rgba(147,51,234,0.5)',
            }}
          >
            {isPlaying
              ? <Pause size={28} className="text-white" />
              : <Play size={28} className="text-white ml-1" />
            }
          </button>
          <button onClick={skipNext}>
            <SkipForward size={28} className="text-white/70 hover:text-white fill-current" />
          </button>
          <button onClick={toggleRepeat}>
            {repeatMode === 'one'
              ? <Repeat1 size={20} className="text-purple-400" />
              : <Repeat size={20} className={repeatMode === 'all' ? 'text-purple-400' : 'text-white/40'} />
            }
          </button>
        </div>

        {/* Volume & Lyrics */}
        <div className="flex items-center gap-4 w-full">
          <button onClick={toggleMute}>
            {isMuted || volume === 0
              ? <VolumeX size={18} className="text-white/40" />
              : <Volume2 size={18} className="text-white/40" />
            }
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="flex-1"
            style={{
              background: `linear-gradient(to right, #9333ea 0%, #9333ea ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) 100%)`,
            }}
          />
          <Heart size={18} className="text-white/40" />
        </div>
      </div>
    </motion.div>
  );
};

export default FullscreenPlayer;
