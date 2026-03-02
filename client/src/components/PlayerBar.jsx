import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Volume1, Heart, ListMusic, Maximize2, Mic2,
  ChevronsRight
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const PlayerBar = () => {
  const {
    currentSong, isPlaying, setIsPlaying,
    volume, isMuted, progress, setProgress, duration, setDuration,
    isShuffled, repeatMode,
    isFullscreen, setIsFullscreen,
    showLyricsView, setShowLyricsView,
    showQueuePanel, setShowQueuePanel,
    playerRef,
    togglePlay, skipNext, skipPrev,
    toggleShuffle, toggleRepeat,
    handleVolumeChange, toggleMute, seekTo,
  } = usePlayer();

  const iframeRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const ytPlayerRef = useRef(null);

  // Format time
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Init YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, []);

  // Load song into YouTube player
  useEffect(() => {
    if (!currentSong) return;

    const initPlayer = () => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.loadVideoById(currentSong.id);
        return;
      }

      ytPlayerRef.current = new window.YT.Player('yt-iframe', {
        videoId: currentSong.id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            e.target.setVolume(volume);
            e.target.playVideo();
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(e.target.getDuration());
              startProgressTracking(e.target);
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopProgressTracking();
            } else if (e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              stopProgressTracking();
              handleSongEnd();
            }
          },
          onError: (e) => {
            console.error('YouTube player error:', e.data);
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [currentSong]);

  const startProgressTracking = useCallback((player) => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (!player) return;
      try {
        const cur = player.getCurrentTime();
        const dur = player.getDuration();
        if (dur > 0) {
          setProgress((cur / dur) * 100);
          setDuration(dur);
        }
      } catch (e) {}
    }, 500);
  }, [setProgress, setDuration]);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleSongEnd = useCallback(() => {
    if (repeatMode === 'one') {
      ytPlayerRef.current?.playVideo();
    } else {
      skipNext();
    }
  }, [repeatMode, skipNext]);

  // Volume change
  useEffect(() => {
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seekTo(Math.max(0, Math.min(100, pct)));
    if (ytPlayerRef.current) {
      ytPlayerRef.current.seekTo((pct / 100) * duration, true);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 50) return Volume1;
    return Volume2;
  };
  const VolumeIcon = getVolumeIcon();

  const [likedSongs, setLikedSongs] = React.useState(() => {
    return JSON.parse(localStorage.getItem('audiora_liked') || '[]');
  });
  const isLiked = currentSong && likedSongs.some(s => s.id === currentSong.id);

  const toggleLike = () => {
    if (!currentSong) return;
    let updated;
    if (isLiked) {
      updated = likedSongs.filter(s => s.id !== currentSong.id);
    } else {
      updated = [...likedSongs, currentSong];
    }
    setLikedSongs(updated);
    localStorage.setItem('audiora_liked', JSON.stringify(updated));
  };

  return (
    <>
      {/* Hidden YouTube iframe */}
      <div
        style={{
          position: 'fixed',
          bottom: -9999,
          left: -9999,
          width: 1,
          height: 1,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div id="yt-iframe" />
      </div>

      {/* Player Bar */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="flex-shrink-0 flex items-center px-4 gap-4 relative z-20"
        style={{
          height: 72,
          background: 'rgba(15, 12, 41, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Song Info */}
        <div className="flex items-center gap-3 w-52 flex-shrink-0">
          {currentSong ? (
            <>
              <div className="relative flex-shrink-0">
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-12 h-12 rounded-lg object-cover"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                />
                {isPlaying && (
                  <div className="absolute inset-0 flex items-end justify-center pb-1 gap-0.5 rounded-lg overflow-hidden"
                    style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <div className="wave-bar" style={{ height: 4 }} />
                    <div className="wave-bar" style={{ height: 4 }} />
                    <div className="wave-bar" style={{ height: 4 }} />
                    <div className="wave-bar" style={{ height: 4 }} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
                <p className="text-white/50 text-xs truncate">{currentSong.artist}</p>
              </div>
              <button onClick={toggleLike} className="ml-1 flex-shrink-0">
                <Heart
                  size={16}
                  className={isLiked ? 'text-pink-500 fill-pink-500' : 'text-white/40 hover:text-pink-400'}
                  style={{ transition: 'all 0.2s ease' }}
                />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg skeleton" />
              <div>
                <div className="w-28 h-3 skeleton mb-1.5" />
                <div className="w-20 h-2.5 skeleton" />
              </div>
            </div>
          )}
        </div>

        {/* Center Controls */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-xl mx-auto">
          {/* Buttons */}
          <div className="flex items-center gap-5">
            {/* Shuffle */}
            <button onClick={toggleShuffle} className="cursor-pointer group">
              <Shuffle
                size={16}
                className={isShuffled ? 'text-purple-400' : 'text-white/40 group-hover:text-white/70'}
              />
            </button>

            {/* Prev */}
            <button onClick={skipPrev} className="cursor-pointer group">
              <SkipBack size={20} className="text-white/60 group-hover:text-white fill-current" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              disabled={!currentSong}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
              style={{
                background: 'white',
                boxShadow: '0 4px 20px rgba(255,255,255,0.3)',
              }}
            >
              {isPlaying
                ? <Pause size={18} className="text-gray-900" />
                : <Play size={18} className="text-gray-900 ml-0.5" />
              }
            </button>

            {/* Next */}
            <button onClick={skipNext} className="cursor-pointer group">
              <SkipForward size={20} className="text-white/60 group-hover:text-white fill-current" />
            </button>

            {/* Repeat */}
            <button onClick={toggleRepeat} className="cursor-pointer group">
              {repeatMode === 'one'
                ? <Repeat1 size={16} className="text-purple-400" />
                : <Repeat size={16} className={repeatMode === 'all' ? 'text-purple-400' : 'text-white/40 group-hover:text-white/70'} />
              }
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-white/40 w-8 text-right">
              {formatTime((progress / 100) * duration)}
            </span>
            <div
              className="progress-bar flex-1 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-white/40 w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 w-52 justify-end flex-shrink-0">
          {/* Lyrics toggle */}
          <button
            onClick={() => setShowLyricsView(true)}
            className="cursor-pointer group"
            title="Lyrics"
          >
            <Mic2
              size={16}
              className={showLyricsView ? 'text-purple-400' : 'text-white/40 group-hover:text-white/70'}
            />
          </button>

          {/* Queue toggle */}
          <button
            onClick={() => setShowQueuePanel(prev => !prev)}
            className="cursor-pointer group"
            title="Queue"
          >
            <ListMusic
              size={16}
              className={showQueuePanel ? 'text-purple-400' : 'text-white/40 group-hover:text-white/70'}
            />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="cursor-pointer group">
              <VolumeIcon
                size={16}
                className="text-white/40 group-hover:text-white/70"
              />
            </button>
            <div className="w-20 relative">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full volume-slider"
                style={{
                  background: `linear-gradient(to right, #9333ea 0%, #9333ea ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="cursor-pointer group"
            title="Fullscreen"
          >
            <Maximize2 size={16} className="text-white/40 group-hover:text-white/70" />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default PlayerBar;
