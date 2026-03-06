import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Share2, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SETTINGS = [
  {
    key: 'highQuality',
    label: 'High Quality Audio',
    desc: 'Stream music in 320kbps (uses more data)',
    default: true,
  },
  {
    key: 'explicit',
    label: 'Explicit Content',
    desc: 'Allow playback of explicit rated content',
    default: false,
  },
  {
    key: 'notifications',
    label: 'Desktop Notifications',
    desc: 'Get notified when favorite artists release new music',
    default: true,
  },
  {
    key: 'autoplay',
    label: 'Autoplay',
    desc: 'Keep listening to similar songs when your music ends',
    default: true,
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('audiora_settings') || '{}');
    return SETTINGS.reduce((acc, s) => ({
      ...acc,
      [s.key]: saved[s.key] !== undefined ? saved[s.key] : s.default,
    }), {});
  });

  const toggleSetting = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem('audiora_settings', JSON.stringify(updated));
  };

  const userInfo = JSON.parse(localStorage.getItem('audiora_user') || JSON.stringify({
    name: 'C H I K U',
    email: '2173chiku@gmail.com',
    memberSince: '2026',
    plan: 'PREMIUM',
    playlists: 24,
    following: 142,
    followers: 89,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera&backgroundColor=b6e3f4',
  }));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} className="text-white/70" />
        </button>
        <h1 className="text-lg font-bold text-white">Profile & Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(236,72,153,0.08))',
            border: '1px solid rgba(147,51,234,0.2)',
          }}
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full overflow-hidden"
                style={{ border: '3px solid rgba(147,51,234,0.5)', padding: 2, background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
              >
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-full h-full rounded-full object-cover bg-purple-800"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{userInfo.name}</h2>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white' }}
                >
                  ⭐ {userInfo.plan}
                </span>
              </div>
              <p className="text-white/50 text-sm mb-4">
                {userInfo.email} • Member since {userInfo.memberSince}
              </p>

              {/* Stats */}
              <div className="flex gap-6 mb-4">
                {[
                  { label: 'Playlists', value: userInfo.playlists },
                  { label: 'Following', value: userInfo.following },
                  { label: 'Followers', value: userInfo.followers },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-white text-xl font-bold">{stat.value}</p>
                    <p className="text-white/40 text-xs uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  className="px-5 py-2 rounded-full text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #9333ea, #7c3aed)' }}
                >
                  Edit Profile
                </button>
                <button
                  className="px-5 py-2 rounded-full text-sm font-semibold text-white/70 cursor-pointer hover:bg-white/10 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Settings size={16} className="text-purple-400" />
              <h3 className="text-base font-bold text-white">Settings</h3>
            </div>

            <div className="space-y-1">
              {SETTINGS.map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-center justify-between py-3.5"
                  style={{ borderBottom: i < SETTINGS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{s.label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
                  </div>
                  <div
                    className={`toggle-switch ${settings[s.key] ? 'active' : ''}`}
                    onClick={() => toggleSetting(s.key)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Logout */}
            <button
              className="flex items-center gap-2 mt-4 text-red-400 hover:text-red-300 text-sm cursor-pointer transition-colors"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              <LogOut size={14} />
              Log Out
            </button>
          </motion.div>

          {/* Help & Privacy */}
          <div className="flex flex-col gap-4">
            {/* Help & Support */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">❓</span>
                <h3 className="text-base font-bold text-white">Help & Support</h3>
              </div>

              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  className="w-full px-3 py-2 rounded-lg text-white text-xs outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              {['How to manage subscription?', 'Audio quality troubleshooting', 'Connect external devices'].map((faq) => (
                <button
                  key={faq}
                  className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 hover:bg-white/5 cursor-pointer transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="text-white/70 text-xs">{faq}</span>
                  <ChevronRight size={12} className="text-white/30" />
                </button>
              ))}

              <button
                className="w-full mt-3 py-2.5 rounded-full text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
              >
                🎧 Contact Support
              </button>
            </motion.div>

            {/* Privacy */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🔒</span>
                <h3 className="text-base font-bold text-white">Privacy</h3>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">
                Manage how your data is used and who can see your activity on Audiora.
              </p>
              <button className="flex items-center gap-1 mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                Privacy Settings <ChevronRight size={11} />
              </button>
            </motion.div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
};

export default Profile;
