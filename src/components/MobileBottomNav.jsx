import React from 'react';
import {
  FaHome,
  FaHeart,
  FaSearch,
  FaCommentDots,
  FaUserCircle,
  FaPlus,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const MobileBottomNav = ({
  showOnlyLiked,
  setShowOnlyLiked,
  likedCount = 0,
  onOpenFeedback,
  onOpenAddModal,
  onOpenProfile,
  onFocusSearch,
}) => {
  const { isAdmin } = useAuth();

  const handleHomeClick = () => {
    setShowOnlyLiked(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikedClick = () => {
    setShowOnlyLiked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCenterAction = () => {
    if (isAdmin && onOpenAddModal) {
      onOpenAddModal();
    } else if (onOpenFeedback) {
      onOpenFeedback();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 select-none shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Asosiy */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
            !showOnlyLiked
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FaHome className="text-xl" />
          <span className="text-[10px] mt-0.5 tracking-tight">Asosiy</span>
        </button>

        {/* Sevimlilar */}
        <button
          onClick={handleLikedClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative ${
            showOnlyLiked
              ? 'text-rose-500 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FaHeart className="text-xl" />
            {likedCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm">
                {likedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Sevimlilar</span>
        </button>

        {/* Markaziy: Fikrlar (yoki Admin uchun +) */}
        <button
          onClick={handleCenterAction}
          className="flex flex-col items-center justify-center -mt-5 py-1 px-2 transition-transform active:scale-95"
          title={isAdmin ? "Musiqa qo'shish" : "Fikr bildirish"}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-[#090d16]">
            {isAdmin ? <FaPlus className="text-lg" /> : <FaCommentDots className="text-xl" />}
          </div>
          <span className="text-[9px] font-bold text-slate-300 mt-0.5">
            {isAdmin ? "Qo'shish" : "Fikrlar"}
          </span>
        </button>

        {/* Qidiruv */}
        <button
          onClick={onFocusSearch}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-200"
        >
          <FaSearch className="text-lg" />
          <span className="text-[10px] mt-0.5 tracking-tight">Qidiruv</span>
        </button>

        {/* Profil */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-200"
        >
          <FaUserCircle className="text-xl" />
          <span className="text-[10px] mt-0.5 tracking-tight">Profil</span>
        </button>

      </div>
    </nav>
  );
};

export default MobileBottomNav;
