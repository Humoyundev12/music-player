import React from 'react';
import { FaMusic, FaHeart, FaSun, FaMoon, FaPlus, FaSearch } from 'react-icons/fa';

const Navbar = ({
  searchQuery,
  setSearchQuery,
  showOnlyLiked,
  setShowOnlyLiked,
  likedCount,
  onOpenAddModal,
  isDark,
  toggleTheme,
  totalSongs,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo va brend */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setShowOnlyLiked(false)}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <FaMusic className="text-xl animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                SoundWave
              </span>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {totalSongs} ta musiqa
              </span>
            </div>
          </div>

          {/* Qidiruv qatori */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Qo'shiq, ijrochi yoki janr qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-all"
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

          {/* Harakatlar (Liked, Add, Theme) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Yoqtirilganlar filter tugmasi */}
            <button
              onClick={() => setShowOnlyLiked(!showOnlyLiked)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                showOnlyLiked
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200'
              }`}
              title="Yoqtirilgan qo'shiqlar"
            >
              <FaHeart className={showOnlyLiked ? 'text-white' : 'text-rose-500'} />
              <span className="hidden sm:inline">Yoqtirilganlar</span>
              {likedCount > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  showOnlyLiked ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                }`}>
                  {likedCount}
                </span>
              )}
            </button>

            {/* Yangi musiqa qo'shish modal tugmasi */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 transition-all"
            >
              <FaPlus className="text-xs" />
              <span className="hidden sm:inline">Musiqa qo'shish</span>
              <span className="sm:hidden">Qo'shish</span>
            </button>

            {/* Dark / Light rejim tugmasi */}
            <button
              onClick={toggleTheme}
              aria-label="Rejimni o'zgartirish"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-yellow-400 transition-all active:scale-90"
              title={isDark ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish"}
            >
              {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg text-indigo-600" />}
            </button>

          </div>

        </div>

        {/* Mobil uchun qidiruv qatori */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Qo'shiq, ijrochi yoki janr qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
