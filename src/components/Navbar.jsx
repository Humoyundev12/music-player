import React, { useState } from 'react';
import {
  FaMusic,
  FaHeart,
  FaSun,
  FaMoon,
  FaPlus,
  FaSearch,
  FaUserCircle,
  FaCrown,
  FaSignOutAlt,
  FaGlobe,
  FaBookOpen,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useTranslate, LANGUAGES } from '../hooks/useTranslate';

const Navbar = ({
  searchQuery,
  setSearchQuery,
  showOnlyLiked,
  setShowOnlyLiked,
  likedCount,
  onOpenAddModal,
  onOpenLogin,
  onOpenGuide,
  onOpenAdminPanel,
  isDark,
  toggleTheme,
  totalSongs,
}) => {
  const { currentUser, isAdmin, isLoggedIn, logout } = useAuth();
  const { lang, setLang, t } = useTranslate();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleAddClick = () => {
    onOpenAddModal();
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo va brend */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => setShowOnlyLiked(false)}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <FaMusic className="text-xl animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                {t('app_title', 'SoundWave')}
              </span>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {totalSongs} {t('songs_count', 'ta musiqa')}
              </span>
            </div>
          </div>

          {/* Qidiruv qatori (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-2">
            <div className="relative w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder={t('search_placeholder', "Qo'shiq, ijrochi yoki janr qidirish...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* O'ng panel amallari */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Tilni tanlash (useTranslate) */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
                title="Tilni o'zgartirish"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.code.toUpperCase()}</span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setLangMenuOpen(false)}
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/80 ${
                        lang === l.code
                          ? 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {lang === l.code && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Foydalanish qismi (Guide) tugmasi */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
              title="Foydalanish qo'llanmasi va Profil"
            >
              <FaBookOpen className="text-indigo-500" />
              <span className="hidden md:inline">{t('user_guide', 'Foydalanish')}</span>
            </button>

            {/* Admin Paneli (Faqat Admin - Humoyun uchun) */}
            {isAdmin && (
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/70 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 transition-all shadow-sm"
                title="Admin Boshqaruvi"
              >
                <FaCrown className="text-purple-600 dark:text-purple-400 text-sm" />
                <span className="hidden sm:inline">{t('admin_panel', 'Admin')}</span>
              </button>
            )}

            {/* Yoqtirilganlar filter tugmasi */}
            <button
              onClick={() => setShowOnlyLiked(!showOnlyLiked)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                showOnlyLiked
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
              title={t('liked_songs', 'Yoqtirilgan qo\'shiqlar')}
            >
              <FaHeart className={showOnlyLiked ? 'text-white' : 'text-rose-500'} />
              <span className="hidden sm:inline">{t('liked_songs', 'Yoqtirilganlar')}</span>
              {likedCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  showOnlyLiked ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                }`}>
                  {likedCount}
                </span>
              )}
            </button>

            {/* Musiqa qo'shish tugmasi (Faqat Admin qo'shadi, aks holda ogohlantiradi) */}
            <button
              onClick={handleAddClick}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all ${
                isAdmin
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25'
              }`}
              title={isAdmin ? "Musiqa qo'shish (Admin)" : "Musiqa qo'shish (Faqat Admin uchun)"}
            >
              <FaPlus className="text-[10px]" />
              <span className="hidden sm:inline">{t('add_song', "Musiqa qo'shish")}</span>
              <span className="sm:hidden">{t('add_song', "Qo'shish")}</span>
              {isAdmin && <FaCrown className="text-[10px] text-yellow-300 ml-0.5" />}
            </button>

            {/* Foydalanuvchi / Login qismi */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all text-xs"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <div className="hidden sm:block text-left">
                    <span className="block font-bold text-slate-800 dark:text-white leading-tight">
                      {currentUser.name}
                    </span>
                    <span className={`text-[9px] font-semibold block leading-tight ${
                      isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isAdmin ? '👑 Admin' : '👤 User'}
                    </span>
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in duration-150 text-xs"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="p-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                      <div className="font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">@{currentUser.username}</div>
                    </div>
                    <button
                      onClick={onOpenGuide}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                    >
                      <FaUserCircle /> Shaxsiy profil & Qo'llanma
                    </button>
                    {isAdmin && (
                      <button
                        onClick={onOpenAdminPanel}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2"
                      >
                        <FaCrown /> Admin boshqaruvi
                      </button>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2 mt-1"
                    >
                      <FaSignOutAlt /> {t('logout_btn', 'Chiqish')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
              >
                <FaUserCircle />
                <span>{t('login_btn', 'Kirish')}</span>
              </button>
            )}

            {/* Dark / Light rejim tugmasi */}
            <button
              onClick={toggleTheme}
              aria-label="Rejimni o'zgartirish"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-yellow-400 transition-all border border-slate-200 dark:border-slate-700"
              title={isDark ? "Yorug' rejim" : "Qorong'u rejim"}
            >
              {isDark ? <FaSun className="text-base" /> : <FaMoon className="text-base text-indigo-600" />}
            </button>

          </div>
        </div>

        {/* Mobil uchun qidiruv qatori */}
        <div className="pb-3 lg:hidden">
          <div className="relative w-full">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder={t('search_placeholder', "Qo'shiq, ijrochi yoki janr qidirish...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
