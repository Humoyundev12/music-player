import React, { useState, useRef } from 'react';
import {
  FaTimes,
  FaCog,
  FaCamera,
  FaPlus,
  FaTh,
  FaBookmark,
  FaUserTag,
  FaHeart,
  FaHeadphones,
  FaSignOutAlt,
  FaEdit,
  FaHistory,
  FaCheck,
  FaPlay,
  FaImage,
  FaLink,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useTranslate } from '../hooks/useTranslate';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
];

const InstagramProfileModal = ({
  isOpen,
  onClose,
  onOpenLogin,
  likedSongs = [],
  songs = [],
  onPlaySong,
}) => {
  const { currentUser, logout, isAdmin, updateUserProfile } = useAuth();
  const { t } = useTranslate();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved' | 'history'
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingHighlight, setIsAddingHighlight] = useState(false);
  const [newHlTitle, setNewHlTitle] = useState('');
  const [newHlEmoji, setNewHlEmoji] = useState('🔥');

  // Tahrirlash formalari
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editUsername, setEditUsername] = useState(currentUser?.displayName || currentUser?.username || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '(@moxirvich_7)2');
  const [editNote, setEditNote] = useState(currentUser?.note || 'Note...');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatar || '');

  // Foydalanuvchi o'z kompyuteridan rasm yuklashi uchun ref
  const fileInputRef = useRef(null);

  // Foydalanuvchi ulashgan postlar (rasmlar / musiqalar)
  const [userPosts, setUserPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(`music_app_user_posts_${currentUser?.username}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddingPost, setIsAddingPost] = useState(false);
  const [postCaption, setPostCaption] = useState('');
  const [postImgUrl, setPostImgUrl] = useState('');
  const postFileInputRef = useRef(null);

  if (!isOpen || !currentUser) return null;

  // Kompyuterdan rasm yuklash (File Reader orqali Base64 ga o'girish)
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Rasm hajmi juda katta (maksimal 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setEditAvatarUrl(base64);
        updateUserProfile({ avatar: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Yangi post/rasm yuklash
  const handlePostFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    if (!postImgUrl) return;

    const newPost = {
      id: `post_${Date.now()}`,
      imageUrl: postImgUrl,
      caption: postCaption,
      likes: 1,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPost, ...userPosts];
    setUserPosts(updated);
    try {
      localStorage.setItem(`music_app_user_posts_${currentUser?.username}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Postni saqlashda xato:", e);
    }

    updateUserProfile({ postsCount: (currentUser.postsCount || 0) + 1 });
    setIsAddingPost(false);
    setPostImgUrl('');
    setPostCaption('');
  };

  // Profil tahririni saqlash
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim(),
      displayName: editUsername.trim(),
      bio: editBio.trim(),
      note: editNote.trim(),
      avatar: editAvatarUrl || currentUser.avatar,
    });
    setIsEditing(false);
  };

  // Yangi Stories / Highlight qo'shish
  const handleAddHighlight = (e) => {
    e.preventDefault();
    if (!newHlTitle.trim()) return;

    const currentHl = currentUser.highlights || [
      { id: 'hl-1', title: 'Futbol', emoji: '⚽' },
      { id: 'hl-2', title: '543', emoji: '🔥' },
      { id: 'hl-3', title: 'sertifikat', emoji: '🎓' },
    ];

    const updatedHl = [
      ...currentHl,
      {
        id: `hl_${Date.now()}`,
        title: newHlTitle.trim(),
        emoji: newHlEmoji,
      },
    ];

    updateUserProfile({ highlights: updatedHl });
    setNewHlTitle('');
    setIsAddingHighlight(false);
  };

  const highlights = currentUser.highlights || [
    { id: 'hl-1', title: '⚽', emoji: '⚽' },
    { id: 'hl-2', title: '543', emoji: '🔥' },
    { id: 'hl-3', title: 'sertifikat 🎓', emoji: '🎓' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Instagram 3-rasmdagi kabi Dark zamonaviy oyna */}
      <div
        className="relative w-full max-w-lg bg-[#000000] text-white sm:rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col h-full sm:h-[92vh] max-h-[850px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tepa Bar: Foydalanuvchi nomi, Sozlamalar va Yopish */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-[#000000]/90 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{currentUser.displayName || currentUser.username || 'biymirzayev.012'}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-neutral-400 hover:text-white transition-colors text-xs p-1"
                title="Tahrirlash"
              >
                <FaCog />
              </button>
            </h2>
            {isAdmin && (
              <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                Admin
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingPost(true)}
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Rasm yoki musiqa post ulashish"
            >
              <FaPlus />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Kontent maydoni (Skroll bo'ladigan) */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          
          {/* 1. Yuqori qism: Avatar, Note va Statistika (Rasmdagidek) */}
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between gap-4">
              
              {/* Avatar va "Note..." pufakchasi (Rasmdagidek!) */}
              <div className="relative group shrink-0">
                {/* Tepasidagi "Note..." pufakchasi */}
                <div
                  onClick={() => setIsEditing(true)}
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] text-neutral-200 shadow-md cursor-pointer hover:bg-neutral-700 transition-all flex items-center gap-1 whitespace-nowrap"
                  title="Eslatma (Note)"
                >
                  <span>{currentUser.note || 'Note...'}</span>
                  <span className="text-[8px] text-neutral-400">▲</span>
                </div>

                {/* Avatar aylanasi (Instagram gradient halqasi bilan) */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg relative cursor-pointer">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover border-2 border-black"
                  />
                  {/* Rasm almashtirish kamerasi overlay */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1"
                    title="O'zingiz hohlagan rasmni tanlang"
                  >
                    <FaCamera className="text-base" />
                    <span className="text-[9px] font-bold">O'zgartirish</span>
                  </div>
                </div>

                {/* Yashirin fayl tanlash inputi (Kompyuterdan rasm tanlash uchun) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              {/* Statistika: 0 posts • 94 followers • 44 following (Rasmdagidek!) */}
              <div className="flex-1 flex items-center justify-around text-center">
                <div className="cursor-pointer" onClick={() => setActiveTab('posts')}>
                  <span className="block text-base sm:text-lg font-bold text-white">
                    {userPosts.length || currentUser.postsCount || 0}
                  </span>
                  <span className="text-xs text-neutral-400">posts</span>
                </div>

                <div className="cursor-pointer">
                  <span className="block text-base sm:text-lg font-bold text-white">
                    {currentUser.followers || 94}
                  </span>
                  <span className="text-xs text-neutral-400">followers</span>
                </div>

                <div className="cursor-pointer">
                  <span className="block text-base sm:text-lg font-bold text-white">
                    {currentUser.following || 44}
                  </span>
                  <span className="text-xs text-neutral-400">following</span>
                </div>
              </div>

            </div>

            {/* Ism va Bio ma'lumotlari (Rasmdagidek) */}
            <div className="mt-3 space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {currentUser.name || 'Humoyun'}
              </h3>
              <p className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed">
                {currentUser.bio || '(@moxirvich_7)2'}
              </p>
            </div>

            {/* Tugmalar qatori: Edit profile | View archive | Chiqish */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors text-center"
              >
                Edit profile
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors text-center"
              >
                View archive
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-1 px-2 rounded-lg bg-sky-950/60 border border-sky-600/40 hover:bg-sky-900/60 text-sky-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <FaCamera /> <span>O'zingiz hohlagan rasmni qo'yish</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="py-1 px-3 rounded-lg bg-rose-950/60 border border-rose-600/40 hover:bg-rose-900/60 text-rose-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                title="Tizimdan chiqish"
              >
                <FaSignOutAlt /> Chiqish
              </button>
            </div>
          </div>

          {/* 2. Story Highlights (Rasmdagidek: ⚽, 543, sertifikat 🎓, + New) */}
          <div className="px-4 py-3 border-b border-neutral-800/80">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
              
              {highlights.map((hl) => (
                <div key={hl.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-neutral-800 group-hover:bg-neutral-700 border border-neutral-700 flex items-center justify-center transition-all">
                    <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-xl shadow-inner">
                      {hl.emoji}
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-300 max-w-[64px] truncate text-center">
                    {hl.title}
                  </span>
                </div>
              ))}

              {/* + New Highlight qo'shish */}
              <div
                onClick={() => setIsAddingHighlight(true)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full border border-dashed border-neutral-600 group-hover:border-white flex items-center justify-center text-neutral-400 group-hover:text-white transition-all">
                  <FaPlus className="text-lg" />
                </div>
                <span className="text-[11px] text-neutral-400">New</span>
              </div>

            </div>
          </div>

          {/* 3. Instagram Tablari (▦ Posts | 🔖 Saved | 🔄 Archive/History) */}
          <div className="grid grid-cols-3 border-b border-neutral-800 text-center">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-3 flex justify-center items-center text-lg transition-colors border-b-2 ${
                activeTab === 'posts'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <FaTh />
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`py-3 flex justify-center items-center text-lg transition-colors border-b-2 ${
                activeTab === 'saved'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <FaBookmark />
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 flex justify-center items-center text-lg transition-colors border-b-2 ${
                activeTab === 'history'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <FaHistory />
            </button>
          </div>

          {/* 4. Tab Kontentlari */}
          <div className="p-4">
            
            {/* POSTS TAB: Rasm 3 dagi "Share Photos" bo'limi */}
            {activeTab === 'posts' && (
              <div>
                {userPosts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1">
                    {userPosts.map((post) => (
                      <div key={post.id} className="aspect-square relative group overflow-hidden bg-neutral-900 rounded-sm">
                        <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white p-2 text-center font-semibold">
                          {post.caption || '❤️ HB Post'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 3-rasmdagi aynan Camera ikonkali bo'sh holat */
                  <div className="py-12 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full border-2 border-white/60 mx-auto flex items-center justify-center text-2xl text-white">
                      <FaCamera />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Share Photos
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                      When you share photos, they will appear on your profile.
                    </p>
                    <button
                      onClick={() => setIsAddingPost(true)}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300 pt-1"
                    >
                      Share your first photo or music
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SAVED TAB: Yoqtirilgan musiqalar */}
            {activeTab === 'saved' && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                  Saqlangan musiqalar ({likedSongs.length} ta)
                </h4>
                {likedSongs.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-xs">
                    Hozircha saqlangan musiqalar yo'q. Musiqalarga like bosib saqlang.
                  </div>
                ) : (
                  likedSongs.map((song) => (
                    <div
                      key={song.id}
                      onClick={() => onPlaySong && onPlaySong(song)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={song.cover_url} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{song.title}</h5>
                          <p className="text-[11px] text-neutral-400 truncate">{song.artist}</p>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs shadow-md shrink-0">
                        <FaPlay className="ml-0.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* HISTORY / ARCHIVE TAB */}
            {activeTab === 'history' && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                  Tinglash arxivi va faoliyat
                </h4>
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                    <span className="text-neutral-400">Kirish vaqti:</span>
                    <span className="text-neutral-200 font-mono">
                      {currentUser.loginTime ? new Date(currentUser.loginTime).toLocaleTimeString() : 'Hozir'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                    <span className="text-neutral-400">Status:</span>
                    <span className="text-emerald-400 font-bold">Faol (Online)</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-neutral-400">Tizim ruxsati:</span>
                    <span className="text-amber-400 font-semibold">{isAdmin ? '👑 Cheksiz Admin' : 'Oddiy a\'zo'}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* MODAL 1: TAHRIRLASH (Edit Profile) */}
        {isEditing && (
          <div className="absolute inset-0 bg-black/95 z-30 p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <button onClick={() => setIsEditing(false)} className="text-xs text-neutral-400 hover:text-white">
                  Bekor qilish
                </button>
                <h3 className="text-sm font-bold text-white">Edit Profile</h3>
                <button onClick={handleSaveProfile} className="text-xs font-bold text-sky-400 hover:text-sky-300">
                  Saqlash
                </button>
              </div>

              {/* Rasm tanlash bo'limi */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-sky-500 relative">
                  <img src={editAvatarUrl || currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300"
                >
                  O'zingiz hohlagan rasmni yuklang (Kompyuterdan)
                </button>

                {/* Tayyor avatarlar */}
                <div className="flex gap-2 pt-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="Preset"
                      onClick={() => setEditAvatarUrl(av)}
                      className={`w-7 h-7 rounded-full object-cover cursor-pointer border ${
                        editAvatarUrl === av ? 'border-sky-400 scale-110' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Ism:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Username:</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Note (Eslatma statusi):</label>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Masalan: Musiqa shaydosi 🎧"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Bio:</label>
                  <textarea
                    rows="3"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs mt-4 shadow-md transition-all"
            >
              O'zgarishlarni saqlash
            </button>
          </div>
        )}

        {/* MODAL 2: HIGHLIGHT QO'SHISH */}
        {isAddingHighlight && (
          <div className="absolute inset-0 bg-black/95 z-30 p-5 flex flex-col justify-center animate-in fade-in">
            <div className="space-y-4 max-w-sm mx-auto w-full">
              <h3 className="text-base font-bold text-white text-center">Yangi Story Highlight qo'shish</h3>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Emoji tanlang:</label>
                <div className="flex gap-2 justify-center py-2 text-2xl">
                  {['⚽', '🔥', '🎓', '🎧', '⚡', '❤️', '🏆'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewHlEmoji(em)}
                      className={`p-2 rounded-xl bg-neutral-900 border ${newHlEmoji === em ? 'border-sky-400' : 'border-neutral-800'}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Nom bering:</label>
                <input
                  type="text"
                  placeholder="Masalan: Sevimli treklar"
                  value={newHlTitle}
                  onChange={(e) => setNewHlTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingHighlight(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white"
                >
                  Qo'shish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: POST / RASM ULASHISH */}
        {isAddingPost && (
          <div className="absolute inset-0 bg-black/95 z-30 p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <button onClick={() => setIsAddingPost(false)} className="text-xs text-neutral-400 hover:text-white">
                  Bekor qilish
                </button>
                <h3 className="text-sm font-bold text-white">Yangi Post Ulashish</h3>
                <span />
              </div>

              <div className="flex flex-col items-center gap-3">
                {postImgUrl ? (
                  <div className="w-48 h-48 rounded-xl overflow-hidden border border-neutral-700">
                    <img src={postImgUrl} alt="Post preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    onClick={() => postFileInputRef.current?.click()}
                    className="w-48 h-48 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-sky-400 flex flex-col items-center justify-center cursor-pointer text-neutral-400 hover:text-white gap-2 transition-all"
                  >
                    <FaImage className="text-3xl text-sky-400" />
                    <span className="text-xs">Kompyuterdan rasm tanlang</span>
                  </div>
                )}

                <input
                  ref={postFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePostFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => postFileInputRef.current?.click()}
                  className="text-xs text-sky-400 hover:underline"
                >
                  {postImgUrl ? "Boshqa rasm tanlash" : "Rasm faylini yuklash"}
                </button>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Izoh (Caption):</label>
                <input
                  type="text"
                  placeholder="Bugungi kayfiyat va musiqa..."
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              onClick={handleSavePost}
              disabled={!postImgUrl}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold text-xs mt-4 shadow-md transition-all"
            >
              Postni joylash
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default InstagramProfileModal;
