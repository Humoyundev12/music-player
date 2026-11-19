import React from 'react';
import {
  FaHome,
  FaHeart,
  FaSearch,
  FaPlusCircle,
  FaUserCircle,
  FaCrown,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useTranslate } from '../hooks/useTranslate';

const MobileBottomNav = ({
  showOnlyLiked,
  setShowOnlyLiked,
  likedCount = 0,
  onOpenAddModal,
  onOpenGuide,
  onOpenProfile,
  onFocusSearch,
}) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslate();

  const handleHomeClick = () => {
    setShowOnlyLiked(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikedClick = () => {
    setShowOnlyLiked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Asosiy (Bosh sahifa) */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
            !showOnlyLiked
              ? 'text-amber-500 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FaHome className="text-xl" />
            {!showOnlyLiked && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Asosiy</span>
        </button>

        {/* Sevimlilar */}
        <button
          onClick={handleLikedClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative ${
            showOnlyLiked
              ? 'text-rose-500 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FaHeart className="text-xl" />
            {likedCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm">
                {likedCount}
              </span>
            )}
            {showOnlyLiked && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Sevimlilar</span>
        </button>

        {/* Tezkor Qo'shish (Admin yoki User) */}
        <button
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center -mt-4 py-1 px-2 transition-transform active:scale-95"
          title="Musiqa qo'shish"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-white dark:ring-slate-900">
            {isAdmin ? <FaCrown className="text-lg text-yellow-200" /> : <FaPlusCircle className="text-2xl" />}
          </div>
          <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
            {isAdmin ? "Admin +" : "Qo'shish"}
          </span>
        </button>

        {/* Qidiruv */}
        <button
          onClick={onFocusSearch}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all duration-200"
        >
          <FaSearch className="text-lg" />
          <span className="text-[10px] mt-0.5 tracking-tight">Qidiruv</span>
        </button>

        {/* Profil (Instagram-style) */}
        <button
          onClick={onOpenProfile || onOpenGuide}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all duration-200"
        >
          <FaUserCircle className="text-xl" />
          <span className="text-[10px] mt-0.5 tracking-tight">Profil</span>
        </button>

      </div>
    </nav>
  );
};

export default MobileBottomNav;
