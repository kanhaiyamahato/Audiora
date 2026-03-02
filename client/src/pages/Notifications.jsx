import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, CheckCheck, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'welcome',
    icon: '👋',
    iconBg: 'linear-gradient(135deg, #9333ea, #7c3aed)',
    title: 'Welcome to Audiora!',
    message: "Thanks for joining Audiora Premium. We're excited to have you on board! Start exploring millions of songs ad-free and enjoy high-fidelity audio.",
    time: 'Just now',
    unread: true,
    actions: [
      { label: 'Start Tour', primary: true },
      { label: 'Dismiss', primary: false },
    ],
    highlight: true,
  },
  {
    id: 2,
    type: 'release',
    icon: null,
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80',
    title: 'New Release Alert',
    message: 'Your favorite artist M83 just dropped a new single "Oceans".',
    time: '2h ago',
    unread: true,
    actions: [
      { label: '▶ Listen Now', primary: true, isLink: true },
    ],
  },
  {
    id: 3,
    type: 'playlist',
    icon: '🎵',
    iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
    title: 'Playlist Update',
    message: '3 new tracks were added to Workout Mix by collaborators.',
    time: '5h ago',
    unread: false,
    actions: [
      { label: 'View Playlist', primary: false },
    ],
  },
  {
    id: 4,
    type: 'security',
    icon: '🛡️',
    iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    title: 'Security Alert',
    message: 'New login detected from a Chrome browser on Windows.',
    time: '1d ago',
    unread: false,
    actions: [
      { label: 'Review Activity', primary: false },
      { label: 'Dismiss', primary: false },
    ],
  },
  {
    id: 5,
    type: 'weekly',
    icon: '🎯',
    iconBg: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    title: 'Your Weekly Mix is Ready',
    message: "We've curated 30 songs just for you based on your listening history. Discover new music that matches your taste.",
    time: '2d ago',
    unread: false,
    actions: [
      { label: '▶ Play Now', primary: true },
    ],
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [showEarlier, setShowEarlier] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;
  const visibleNotifs = showEarlier ? notifications : notifications.slice(0, 4);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const dismissNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={16} className="text-white/70" />
        </button>
        <Bell size={18} className="text-purple-400" />
        <h1 className="text-lg font-bold text-white">Notifications</h1>
        {unreadCount > 0 && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4">
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">RECENT</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
              >
                <CheckCheck size={12} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification Cards */}
          <div className="space-y-3">
            {visibleNotifs.map((notif, i) => (
              <NotificationCard
                key={notif.id}
                notif={notif}
                index={i}
                onDismiss={() => dismissNotif(notif.id)}
              />
            ))}
          </div>

          {/* Load earlier */}
          {notifications.length > 4 && (
            <button
              onClick={() => setShowEarlier(prev => !prev)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 text-sm text-white/40 hover:text-white/70 cursor-pointer transition-colors"
            >
              {showEarlier ? 'Show less' : `Load earlier notifications`}
              <span className="text-xs">{showEarlier ? '▲' : '▼'}</span>
            </button>
          )}

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};

const NotificationCard = ({ notif, index, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative rounded-2xl p-4 transition-all"
      style={{
        background: notif.unread
          ? 'rgba(147, 51, 234, 0.08)'
          : 'rgba(255, 255, 255, 0.03)',
        border: notif.unread
          ? '1px solid rgba(147, 51, 234, 0.25)'
          : '1px solid rgba(255, 255, 255, 0.06)',
        borderLeft: notif.highlight
          ? '3px solid #9333ea'
          : notif.unread ? '3px solid rgba(147, 51, 234, 0.5)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Unread indicator */}
      {notif.unread && (
        <div
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ background: '#9333ea' }}
        />
      )}

      <div className="flex gap-4">
        {/* Icon / Thumbnail */}
        <div className="flex-shrink-0">
          {notif.thumbnail ? (
            <img
              src={notif.thumbnail}
              alt=""
              className="w-11 h-11 rounded-xl object-cover"
            />
          ) : (
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{ background: notif.iconBg || 'rgba(255,255,255,0.1)' }}
            >
              {notif.icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-white font-bold text-sm">{notif.title}</p>
            <span className="text-white/30 text-xs flex-shrink-0">{notif.time}</span>
          </div>
          <p className="text-white/55 text-sm leading-relaxed mb-3">{notif.message}</p>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {notif.actions?.map((action, i) => (
              <button
                key={action.label}
                onClick={action.label.toLowerCase().includes('dismiss') ? onDismiss : undefined}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all hover:opacity-90 active:scale-95 ${
                  action.primary
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
                style={action.primary ? {
                  background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                } : {
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Notifications;
