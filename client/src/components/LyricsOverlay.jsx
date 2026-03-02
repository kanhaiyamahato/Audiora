import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const LyricsOverlay = () => {
  const {
    currentSong, isPlaying,
    lyrics, lyricsFound, activeLyricIndex,
    progress, duration,
    setShowLyricsView,
    togglePlay, skipNext, skipPrev,
    seekTo, playerRef,
    toggleMute, isMuted, volume,
  } = usePlayer();

  const activeLyricRef = useRef(null);
  const containerRef = useRef(null);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Auto scroll to active lyric
  useEffect(() => {
    if (activeLyricRef.current && containerRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLyricIndex]);

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
      className="fixed inset-0 z-50 flex"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}
    >
      {/* Blurred background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${currentSong.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(60px)',
          opacity: 0.08,
          transform: 'scale(1.2)',
        }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-20">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.1)' }}
          onClick={() => setShowLyricsView(false)}
        >
          <X size={16} className="text-white" />
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
          >
            <span style={{ fontSize: 8 }} className="text-white font-bold">A</span>
          </div>
          <span className="text-white font-bold text-sm">Audiora</span>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex w-full h-full">
        {/* Left: Album Art + Song Info */}
        <div className="flex flex-col items-center justify-center px-16 w-1/3 flex-shrink-0">
          <div
            className="w-72 h-72 rounded-2xl overflow-hidden mb-6"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(147,51,234,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center mb-1">
            <p className="text-xs text-purple-400 font-semibold tracking-widest uppercase mb-2">
              Now Playing
            </p>
          </div>
          <h3 className="text-xl font-bold text-white text-center mb-1">{currentSong.title}</h3>
          <p className="text-white/50 text-sm text-center mb-6">{currentSong.artist}</p>

          {/* Progress */}
          <div className="w-full mb-4">
            <div className="progress-bar cursor-pointer" onClick={handleProgressClick}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/40">{formatTime((progress / 100) * duration)}</span>
              <span className="text-xs text-white/40">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            <button onClick={skipPrev}>
              <SkipBack size={22} className="text-white/70 hover:text-white fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              {isPlaying
                ? <Pause size={20} className="text-white" />
                : <Play size={20} className="text-white ml-0.5" />
              }
            </button>
            <button onClick={skipNext}>
              <SkipForward size={22} className="text-white/70 hover:text-white fill-current" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Heart size={16} className="text-white/30" />
            <Volume2 size={16} className="text-white/30" />
          </div>
        </div>

        {/* Right: Lyrics */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto flex flex-col justify-center px-16 py-24"
          style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}
        >
          {!lyricsFound || lyrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div
                className="p-8 rounded-2xl text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-2xl font-bold text-white/40 mb-3">LYRICS NOT AVAILABLE</p>
                <p className="text-white/20 text-sm">
                  We couldn't find lyrics for "{currentSong.title}"
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-32">
              {lyrics.map((line, i) => (
                <motion.p
                  key={i}
                  ref={i === activeLyricIndex ? activeLyricRef : null}
                  animate={{
                    opacity: i === activeLyricIndex ? 1 : i === activeLyricIndex - 1 || i === activeLyricIndex + 1 ? 0.5 : 0.25,
                    scale: i === activeLyricIndex ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`lyrics-line ${i === activeLyricIndex ? 'active' : ''}`}
                  style={{
                    fontSize: i === activeLyricIndex ? 28 : 20,
                    fontWeight: i === activeLyricIndex ? 700 : 400,
                    lineHeight: 1.5,
                    letterSpacing: i === activeLyricIndex ? '-0.5px' : '0',
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LyricsOverlay;
