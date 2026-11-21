import React, { useState } from 'react';
import {
  FaHeart,
  FaSearch,
  FaUserCircle,
  FaShieldAlt,
  FaSignOutAlt,
  FaBookOpen,
  FaTimes,
  FaFire,
  FaCommentDots,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useTranslate, LANGUAGES } from '../hooks/useTranslate';

const Navbar = ({
  searchQuery,
  setSearchQuery,
  showOnlyLiked,
  setShowOnlyLiked,
  showOnlyTrending,
  setShowOnlyTrending,
  likedCount,
  onOpenFeedback,
  onOpenGuide,
  onOpenProfile,
  onOpenAdminPanel,
  totalSongs = 50,
  searchInputRef,
}) => {
  const { currentUser, isAdmin, isLoggedIn, logout, trackSearch } = useAuth();
  const { lang, setLang, t } = useTranslate();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090d16]/90 border-b border-slate-800 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
            onClick={() => {
              setShowOnlyLiked(false);
              setShowOnlyTrending(false);
            }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-all duration-300 bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center p-0.5">
              <img
                src="/logo.png"
                alt="HB Logo"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  HB Music
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-black rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
                  Pro
                </span>
              </div>
              <span className="block text-[11px] font-medium text-slate-400 -mt-0.5">
                {totalSongs} ta musiqa
              </span>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Qo'shiq, ijrochi yoki janr qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    trackSearch(searchQuery.trim());
                  }
                }}
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-slate-900 border border-slate-700/80 focus:border-amber-500 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2">

            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
              title="Qidiruv"
            >
              {mobileSearchOpen ? <FaTimes className="text-xs" /> : <FaSearch className="text-xs" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
                title="Tilni o'zgartirish"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline text-[11px] font-bold">{currentLangObj.code.toUpperCase()}</span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 rounded-2xl bg-slate-800 shadow-2xl border border-slate-700 py-1.5 z-50 animate-in fade-in duration-150"
                  onClick={() => setLangMenuOpen(false)}
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-700 ${
                        lang === l.code
                          ? 'font-bold text-amber-400 bg-amber-950/40'
                          : 'text-slate-300'
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

            {/* Qo'llanma / Yordam tugmasi */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
              title="Qo'llanma va Yordam"
            >
              <FaBookOpen className="text-amber-500 text-xs" />
              <span className="hidden sm:inline">Yordam</span>
            </button>

            {/* Fikr / Taklif bildirish (Oddiy foydalanuvchilar uchun) */}
            <button
              onClick={onOpenFeedback}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all"
              title="Fikr bildirish va qo'shiq taklif qilish"
            >
              <FaCommentDots className="text-amber-400 text-xs" />
              <span className="hidden sm:inline">Fikrlar</span>
            </button>

            {/* Sevimlilar (Saved/Liked) */}
            <button
              onClick={() => {
                setShowOnlyLiked(!showOnlyLiked);
                if (showOnlyTrending) setShowOnlyTrending(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                showOnlyLiked
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Yoqtirilgan musiqalar"
            >
              <FaHeart className={showOnlyLiked ? 'text-white' : 'text-rose-500 text-xs'} />
              <span className="hidden sm:inline">Sevimlilar</span>
              {likedCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  showOnlyLiked ? 'bg-white/20 text-white' : 'bg-rose-950/80 text-rose-300'
                }`}>
                  {likedCount}
                </span>
              )}
            </button>

            {/* Admin Boshqaruv tugmasi (FAQAT ADMIN UCHUN - foydalanuvchiga ko'rinmasin!) */}
            {isAdmin && (
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
                title="Admin Boshqaruv Paneli"
              >
                <FaShieldAlt className="text-xs" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Profil avatar & menu */}
            {isLoggedIn && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-xs"
                title="Profilni ochish"
              >
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-500/40"
                />
                <span className="hidden md:inline font-bold text-slate-200 truncate max-w-[100px]">
                  {currentUser?.name}
                </span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile search input expand */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Qo'shiq, ijrochi yoki janr..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
