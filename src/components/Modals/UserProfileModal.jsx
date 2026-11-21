import React, { useState, useRef } from 'react';
import {
  FaTimes,
  FaUser,
  FaHeart,
  FaPlay,
  FaDownload,
  FaSignOutAlt,
  FaCommentDots,
  FaShieldAlt,
  FaCamera,
  FaCheck,
  FaCog,
  FaMusic,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { getFeedbacks } from '../../services/feedbackService';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
];

const UserProfileModal = ({
  isOpen,
  onClose,
  likedSongs = [],
  onPlaySong,
}) => {
  const { currentUser, logout, isAdmin, updateUserProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'feedbacks' | 'settings'
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [bioInput, setBioInput] = useState(currentUser?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen || !currentUser) return null;

  const feedbacks = getFeedbacks().filter(
    (f) => f.userId === currentUser.username || f.userName === currentUser.name
  );

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Rasm hajmi juda katta (maksimal 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target?.result;
      if (base64Data) {
        updateUserProfile({ avatar: base64Data });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: nameInput.trim() || currentUser.name,
      bio: bioInput.trim(),
    });
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    if (window.confirm("Haqiqatan ham hisobdan chiqmoqchimisiz?")) {
      logout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="relative w-full max-w-2xl bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 flex flex-col max-h-[90vh] overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <FaUser className="text-amber-500 text-sm" />
            <span className="font-bold text-sm text-slate-200">Foydalanuvchi Profili</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="p-6 bg-gradient-to-b from-slate-900/90 to-[#0f172a] border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            
            {/* Avatar with edit option */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden ring-4 ring-amber-500/20 shadow-xl bg-slate-800">
                <img
                  src={currentUser.avatar || PRESET_AVATARS[0]}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold"
                title="Rasm yuklash"
              >
                <FaCamera className="text-base mb-1" />
                <span>O'zgartirish</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                    <span>{currentUser.name}</span>
                    {isAdmin ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <FaShieldAlt className="text-[9px]" /> Administrator
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        Foydalanuvchi
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">@{currentUser.displayName || currentUser.username}</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <FaCog className="text-[11px]" />
                    <span>{isEditing ? "Yopish" : "Tahrirlash"}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all flex items-center gap-1.5"
                  >
                    <FaSignOutAlt className="text-[11px]" />
                    <span>Chiqish</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-md pt-1">
                {currentUser.bio || "Musiqa ixlosmandi • HB Music faol a'zosi"}
              </p>

              {/* Stats badges */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
                <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <FaHeart className="text-rose-500 text-[11px]" />
                  <span>Sevimli: <b>{likedSongs.length} ta</b></span>
                </div>

                <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <FaCommentDots className="text-amber-500 text-[11px]" />
                  <span>Fikrlar: <b>{feedbacks.length} ta</b></span>
                </div>
              </div>
            </div>

          </div>

          {/* Inline Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Ismingiz:</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Status / Bio:</label>
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Preset avatar picks */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Tayyor avatarlardan tanlash:</label>
                <div className="flex gap-2">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateUserProfile({ avatar: av })}
                      className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all ring-1 ring-transparent hover:ring-amber-500"
                    >
                      <img src={av} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          )}

          {savedSuccess && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <FaCheck className="text-emerald-400" />
              <span>Profil ma'lumotlari muvaffaqiyatli saqlandi!</span>
            </div>
          )}

        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 pt-3 border-b border-slate-800 bg-slate-900/40 gap-4">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'saved'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FaMusic className="text-[11px]" />
            <span>Saqlangan & Sevimli musiqalar ({likedSongs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'feedbacks'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FaCommentDots className="text-[11px]" />
            <span>Fikrlarim & Admin javoblari ({feedbacks.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {activeTab === 'saved' && (
            <div>
              {likedSongs.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <FaHeart className="text-3xl text-rose-500/30 mx-auto" />
                  <p className="font-bold">Hozircha saqlangan musiqalar yo'q</p>
                  <p className="text-[11px] text-slate-500">
                    Qo'shiqlardagi yurakcha yoki saqlash tugmasini bosib shu yerda to'plashingiz mumkin.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {likedSongs.map((song) => (
                    <div
                      key={song.id}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={song.cover_url}
                          alt={song.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{song.title}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{song.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            if (onPlaySong) onPlaySong(song);
                            onClose();
                          }}
                          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1.5 font-bold"
                          title="Tinglash"
                        >
                          <FaPlay className="text-[10px]" />
                          <span className="hidden sm:inline">Ijro</span>
                        </button>

                        <a
                          href={song.audio_url}
                          download={`${song.title} - ${song.artist}.mp3`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5"
                          title="Yuklab olish"
                        >
                          <FaDownload className="text-[10px]" />
                          <span className="hidden sm:inline">Yuklab olish</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'feedbacks' && (
            <div className="space-y-3">
              {feedbacks.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <FaCommentDots className="text-3xl text-amber-500/30 mx-auto mb-2" />
                  <p className="font-bold">Siz hali fikr yubormadingiz</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    "+" tugmasi orqali o'z taklifingizni adminga yuborishingiz mumkin.
                  </p>
                </div>
              ) : (
                feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-400">{fb.subject}</span>
                      <span className="text-slate-500">{new Date(fb.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      {fb.message}
                    </p>

                    {fb.adminReply ? (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                        <div className="text-amber-300 font-bold flex items-center gap-1.5 text-[11px]">
                          <FaShieldAlt className="text-amber-400" />
                          <span>Admin (Humoyun) javobi:</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed pt-0.5">{fb.adminReply}</p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-400/80 bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-900/30">
                        Admin ko'rib chiqmoqda...
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;
