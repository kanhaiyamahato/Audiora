import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Search, Upload } from 'lucide-react';

const NewPlaylistModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [coverImg, setCoverImg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    const playlists = JSON.parse(localStorage.getItem('audiora_playlists') || '[]');
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      isPrivate,
      cover: coverImg,
      songs: [],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('audiora_playlists', JSON.stringify([...playlists, newPlaylist]));
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCoverImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-xl mx-4 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(24, 20, 50, 0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(30px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-xl font-bold text-white">Create New Playlist</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
            >
              <X size={18} className="text-white/60" />
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="flex gap-6">
              {/* Cover Upload */}
              <div className="flex-shrink-0">
                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <div
                    className="w-40 h-44 rounded-xl flex flex-col items-center justify-center transition-all hover:border-white/30"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '2px dashed rgba(255,255,255,0.15)',
                      backgroundImage: coverImg ? `url(${coverImg})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!coverImg && (
                      <>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                          style={{ background: 'rgba(255,255,255,0.08)' }}
                        >
                          <Music size={20} className="text-white/50" />
                        </div>
                        <p className="text-white/60 text-sm font-medium">Upload Cover</p>
                        <p className="text-white/30 text-xs mt-1">Drag & Drop or Click</p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Form Fields */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-2">
                    NAME
                  </label>
                  <input
                    type="text"
                    placeholder="My Awesome Playlist"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(147,51,234,0.5)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(147,51,234,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-2">
                    DESCRIPTION
                  </label>
                  <textarea
                    placeholder="Add an optional description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(147,51,234,0.5)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  />
                </div>

                {/* Private Toggle */}
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(147,51,234,0.15)' }}
                    >
                      <span className="text-base">🔒</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Private Playlist</p>
                      <p className="text-xs text-white/40">Only you can view this playlist</p>
                    </div>
                  </div>
                  <div
                    className={`toggle-switch ${isPrivate ? 'active' : ''}`}
                    onClick={() => setIsPrivate(prev => !prev)}
                  />
                </div>
              </div>
            </div>

            {/* Add Songs */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-white mb-3">Add songs</p>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search for songs to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/5 mt-4 mb-4" />

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #9333ea, #7c3aed)' }}
              >
                Create Playlist
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewPlaylistModal;
