import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Compass, BookOpen, Heart, Clock, Dumbbell, Moon,
  Plus, ChevronLeft, Music2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: BookOpen, label: 'Library', path: '/library' },
];

const COLLECTION_ITEMS = [
  { icon: Heart, label: 'Liked Songs', path: '/?filter=liked', color: '#ec4899' },
  { icon: Clock, label: 'Recently Played', path: '/?filter=recent', color: '#9333ea' },
  { icon: Dumbbell, label: 'Workout Mix', path: '/?filter=workout', color: '#f59e0b' },
  { icon: Moon, label: 'Sleep Sounds', path: '/?filter=sleep', color: '#3b82f6' },
];

const Sidebar = ({ onNewPlaylist }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setIsSidebarCollapsed } = usePlayer();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.search;
    return location.pathname === path;
  };

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 64 : 200 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-shrink-0 flex flex-col h-full relative"
      style={{
        background: 'rgba(15, 12, 41, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
        >
          <Music2 size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-white font-bold text-lg"
            >
              Audiora
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsSidebarCollapsed(prev => !prev)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-10 cursor-pointer"
        style={{
          background: 'rgba(147, 51, 234, 0.8)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <motion.div animate={{ rotate: isSidebarCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronLeft size={12} className="text-white" />
        </motion.div>
      </button>

      {/* Navigation */}
      <nav className="px-2 mt-2">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 cursor-pointer group ${
              isActive(path) ? 'nav-active' : 'hover:bg-white/5'
            }`}
          >
            <Icon
              size={18}
              className={isActive(path) ? 'text-purple-400' : 'text-white/60 group-hover:text-white/90'}
            />
            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-sm font-medium ${isActive(path) ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Collection */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 mt-4"
          >
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
              Your Collection
            </p>
            {COLLECTION_ITEMS.map(({ icon: Icon, label, path, color }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 py-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22`, border: `1px solid ${color}44` }}
                >
                  <Icon size={13} style={{ color }} />
                </div>
                <span className="text-sm text-white/60 hover:text-white/90 transition-colors text-left">
                  {label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="flex-1" />

      {/* New Playlist Button */}
      <div className="p-3 mb-2">
        <button
          onClick={onNewPlaylist}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <Plus size={16} className="text-white" />
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-white overflow-hidden whitespace-nowrap"
              >
                New Playlist
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
