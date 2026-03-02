import React from 'react';
import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';
import QueuePanel from './QueuePanel';
import FullscreenPlayer from './FullscreenPlayer';
import LyricsOverlay from './LyricsOverlay';
import NewPlaylistModal from './NewPlaylistModal';
import { usePlayer } from '../context/PlayerContext';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { isFullscreen, showLyricsView, showQueuePanel } = usePlayer();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* Dynamic background */}
      <DynamicBackground />

      {/* Main container */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <Sidebar onNewPlaylist={() => setShowPlaylistModal(true)} />

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>

        {/* Queue Panel */}
        {showQueuePanel && <QueuePanel />}
      </div>

      {/* Bottom Player Bar */}
      <PlayerBar />

      {/* Fullscreen Player Overlay */}
      {isFullscreen && <FullscreenPlayer />}

      {/* Lyrics Overlay */}
      {showLyricsView && <LyricsOverlay />}

      {/* New Playlist Modal */}
      {showPlaylistModal && (
        <NewPlaylistModal onClose={() => setShowPlaylistModal(false)} />
      )}
    </div>
  );
};

const DynamicBackground = () => {
  const { currentSong } = usePlayer();

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: currentSong?.thumbnail
          ? `radial-gradient(ellipse at 50% 50%, rgba(147,51,234,0.08) 0%, transparent 70%)`
          : 'transparent',
        transition: 'background 2s ease',
      }}
    />
  );
};

export default Layout;
