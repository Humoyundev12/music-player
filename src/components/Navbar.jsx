import React, { useState } from 'react';
import {
  FaHeart,
  FaSun,
  FaMoon,
  FaPlus,
  FaSearch,
  FaUserCircle,
  FaCrown,
  FaSignOutAlt,
  FaBookOpen,
  FaTimes,
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
  searchInputRef,
}) => {
  const { currentUser, isAdmin, isLoggedIn, logout } = useAuth();
  const { lang, setLang, t } = useTranslate();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo va Brend (HB Music) */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0 group"
            onClick={() => setShowOnlyLiked(false)}
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/25 ring-2 ring-amber-500/30 group-hover:scale-105 transition-all duration-300 bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="HB Logo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  {t('app_title', 'HB Music')}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 uppercase tracking-wide">
                  Pro
                </span>
              </div>
              <span className="block text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 sm:mt-0">
                {totalSongs} {t('songs_count', 'ta musiqa')}
              </span>
            </div>
          </div>

          {/* Qidiruv qatori (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-2">
            <div className="relative w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('search_placeholder', "Qo'shiq, ijrochi yoki janr qidirish...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 focus:border-amber-500 dark:focus:border-amber-500 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
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
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Mobil uchun tezkor qidiruv tugmasi */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              title="Qidiruv"
            >
              {mobileSearchOpen ? <FaTimes className="text-xs" /> : <FaSearch className="text-xs" />}
            </button>
            
            {/* Tilni tanlash */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
                title="Tilni o'zgartirish"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline text-[11px] font-bold">{currentLangObj.code.toUpperCase()}</span>
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
                          ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30'
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

            {/* Foydalanish qismi (Guide) tugmasi - Desktop */}
            <button
              onClick={onOpenGuide}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
              title="Foydalanish qo'llanmasi va Profil"
            >
              <FaBookOpen className="text-amber-500" />
              <span>{t('user_guide', 'Qo\'llanma')}</span>
            </button>

            {/* Admin Paneli (Faqat Admin - Humoyun uchun) */}
            {isAdmin && (
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 transition-all shadow-sm"
                title="Admin Boshqaruvi"
              >
                <FaCrown className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm" />
                <span className="hidden sm:inline">{t('admin_panel', 'Admin')}</span>
              </button>
            )}

            {/* Yoqtirilganlar filter tugmasi (Desktop) */}
            <button
              onClick={() => setShowOnlyLiked(!showOnlyLiked)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                showOnlyLiked
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-300'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
              title={t('liked_songs', 'Yoqtirilgan qo\'shiqlar')}
            >
              <FaHeart className={showOnlyLiked ? 'text-white' : 'text-rose-500'} />
              <span>{t('liked_songs', 'Yoqtirilganlar')}</span>
              {likedCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  showOnlyLiked ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                }`}>
                  {likedCount}
                </span>
              )}
            </button>

            {/* Musiqa qo'shish tugmasi (Desktop) */}
            <button
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/20"
              title={isAdmin ? "Musiqa qo'shish (Admin)" : "Musiqa qo'shish (Faqat Admin uchun)"}
            >
              <FaPlus className="text-[10px]" />
              <span>{t('add_song', "Musiqa qo'shish")}</span>
              {isAdmin && <FaCrown className="text-[10px] text-yellow-200 ml-0.5" />}
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
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-500/40"
                  />
                  <div className="hidden md:block text-left">
                    <span className="block font-bold text-slate-800 dark:text-white leading-tight">
                      {currentUser.name}
                    </span>
                    <span className={`text-[9px] font-semibold block leading-tight ${
                      isAdmin ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isAdmin ? '👑 Admin' : '👤 User'}
                    </span>
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in duration-150 text-xs"
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
                      <FaUserCircle className="text-amber-500" /> Shaxsiy profil & Qo'llanma
                    </button>
                    {isAdmin && (
                      <button
                        onClick={onOpenAdminPanel}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-2"
                      >
                        <FaCrown className="text-amber-600" /> Admin boshqaruvi
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
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-sm transition-all"
              >
                <FaUserCircle className="text-xs sm:text-sm" />
                <span>{t('login_btn', 'Kirish')}</span>
              </button>
            )}

            {/* Dark / Light rejim tugmasi */}
            <button
              onClick={toggleTheme}
              aria-label="Rejimni o'zgartirish"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-all border border-slate-200 dark:border-slate-700"
              title={isDark ? "Yorug' rejim" : "Qorong'u rejim"}
            >
              {isDark ? <FaSun className="text-sm sm:text-base text-amber-400" /> : <FaMoon className="text-sm sm:text-base text-slate-700" />}
            </button>

          </div>
        </div>

        {/* Mobil uchun qidiruv qatori (Ochilgan holatda yoki har doim ixcham) */}
        <div className={`pb-3 lg:hidden transition-all duration-200 ${mobileSearchOpen ? 'block' : 'hidden sm:block'}`}>
          <div className="relative w-full">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder={t('search_placeholder', "Qo'shiq, ijrochi yoki janr qidirish...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus:border-amber-500 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
