import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { getLyrics, getRelated } from '../utils/api';

const PlayerContext = createContext(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
};

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // none, all, one
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLyricsView, setShowLyricsView] = useState(false);
  const [lyrics, setLyrics] = useState([]);
  const [lyricsFound, setLyricsFound] = useState(true);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [relatedSongs, setRelatedSongs] = useState([]);
  const [showQueuePanel, setShowQueuePanel] = useState(true);
  const [queuePanelTab, setQueuePanelTab] = useState('upnext'); // upnext, lyrics, related
  const [dynamicBgColor, setDynamicBgColor] = useState('#302b63');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const playerRef = useRef(null);
  const progressInterval = useRef(null);
  const lyricTimersRef = useRef([]);

  // Play a song
  const playSong = useCallback(async (song, songList = null) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setLyrics([]);
    setActiveLyricIndex(0);

    if (songList) {
      setQueue(songList);
      const idx = songList.findIndex(s => s.id === song.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }

    // Fetch lyrics
    try {
      const lyricsData = await getLyrics(song.title, song.artist);
      setLyrics(lyricsData.lyrics || []);
      setLyricsFound(lyricsData.found);
    } catch (e) {
      setLyrics([]);
      setLyricsFound(false);
    }

    // Fetch related
    try {
      const related = await getRelated(song.id, 8);
      setRelatedSongs(related);
    } catch (e) {
      setRelatedSongs([]);
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo?.();
    } else {
      player.playVideo?.();
    }
    setIsPlaying(prev => !prev);
  }, [currentSong, isPlaying]);

  // Skip next
  const skipNext = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx;
    if (isShuffled) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = (queueIndex + 1) % queue.length;
    }
    setQueueIndex(nextIdx);
    playSong(queue[nextIdx], queue);
  }, [queue, queueIndex, isShuffled, playSong]);

  // Skip prev
  const skipPrev = useCallback(() => {
    if (queue.length === 0) return;
    const prevIdx = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    setQueueIndex(prevIdx);
    playSong(queue[prevIdx], queue);
  }, [queue, queueIndex, playSong]);

  // Add to queue
  const addToQueue = useCallback((song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  }, []);

  // Set volume
  const handleVolumeChange = useCallback((val) => {
    setVolume(val);
    setIsMuted(val === 0);
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(val);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isMuted) {
      player.unMute?.();
      player.setVolume?.(volume);
      setIsMuted(false);
    } else {
      player.mute?.();
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Seek
  const seekTo = useCallback((pct) => {
    const player = playerRef.current;
    if (!player || !duration) return;
    const time = (pct / 100) * duration;
    player.seekTo?.(time, true);
    setProgress(pct);
  }, [duration]);

  // Update lyrics active line based on progress
  useEffect(() => {
    if (lyrics.length === 0 || duration === 0) return;
    const timePerLine = duration / lyrics.length;
    const currentTime = (progress / 100) * duration;
    const lineIdx = Math.floor(currentTime / timePerLine);
    setActiveLyricIndex(Math.min(lineIdx, lyrics.length - 1));
  }, [progress, lyrics, duration]);

  // Update playlist position in localStorage
  useEffect(() => {
    if (currentSong) {
      const history = JSON.parse(localStorage.getItem('audiora_history') || '[]');
      const filtered = history.filter(s => s.id !== currentSong.id);
      const updated = [currentSong, ...filtered].slice(0, 50);
      localStorage.setItem('audiora_history', JSON.stringify(updated));
    }
  }, [currentSong]);

  const value = {
    currentSong,
    isPlaying,
    setIsPlaying,
    volume,
    isMuted,
    progress,
    setProgress,
    duration,
    setDuration,
    queue,
    setQueue,
    queueIndex,
    isShuffled,
    repeatMode,
    isFullscreen,
    setIsFullscreen,
    showLyricsView,
    setShowLyricsView,
    lyrics,
    lyricsFound,
    activeLyricIndex,
    relatedSongs,
    showQueuePanel,
    setShowQueuePanel,
    queuePanelTab,
    setQueuePanelTab,
    dynamicBgColor,
    setDynamicBgColor,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    playerRef,
    playSong,
    togglePlay,
    skipNext,
    skipPrev,
    addToQueue,
    toggleShuffle,
    toggleRepeat,
    handleVolumeChange,
    toggleMute,
    seekTo,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
