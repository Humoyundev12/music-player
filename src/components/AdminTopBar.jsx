import React, { useState, useEffect } from 'react';
import {
  FaShieldAlt,
  FaPlus,
  FaCommentDots,
  FaUsers,
  FaMusic,
  FaCrown,
  FaChartLine,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getFeedbacks, getSongRequests } from '../services/feedbackService';

const AdminTopBar = ({
  totalSongs = 50,
  onOpenAddModal,
  onOpenAdminPanel,
  onOpenFeedbacks,
}) => {
  const { requests } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [songRequests, setSongRequests] = useState([]);

  const refreshCounts = () => {
    setFeedbacks(getFeedbacks());
    setSongRequests(getSongRequests());
  };

  useEffect(() => {
    refreshCounts();
    window.addEventListener('hb_feedback_updated', refreshCounts);
    window.addEventListener('hb_song_requests_updated', refreshCounts);
    return () => {
      window.removeEventListener('hb_feedback_updated', refreshCounts);
      window.removeEventListener('hb_song_requests_updated', refreshCounts);
    };
  }, []);

  const pendingFeedbacks = feedbacks.filter((f) => f.status === 'pending');
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/40 shadow-xl shadow-amber-500/5 text-slate-100 select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Admin Status info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
            <FaCrown className="text-xl text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                Admin Boshqaruv Markazi
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Muhim
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Administrator: <b className="text-amber-400">Humoyun Biymirzayev</b> • Barcha boshqaruv tugmalari shu yerda
            </p>
          </div>
        </div>

        {/* Center: Live Stats Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-slate-300">
            <FaMusic className="text-amber-500 text-xs" />
            <span>Kutubxona: <b>{totalSongs} ta</b></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-slate-300">
            <FaCommentDots className="text-amber-500 text-xs" />
            <span>Yangi fikrlar: <b className={pendingFeedbacks.length > 0 ? "text-amber-400 font-bold" : ""}>{pendingFeedbacks.length} ta</b></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-slate-300">
            <FaUsers className="text-amber-500 text-xs" />
            <span>Arizalar: <b className={pendingRequests.length > 0 ? "text-amber-400 font-bold" : ""}>{pendingRequests.length} ta</b></span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Song Button */}
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <FaPlus className="text-xs" />
            <span>+ Yangi musiqa qo'shish</span>
          </button>

          {/* User Feedbacks Reply */}
          <button
            onClick={onOpenFeedbacks}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5"
            title="Foydalanuvchilar fikrlariga javob qaytarish"
          >
            <FaCommentDots className="text-xs text-amber-400" />
            <span>Fikrlar & Javoblar</span>
            {pendingFeedbacks.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          {/* Full Admin Panel */}
          <button
            onClick={onOpenAdminPanel}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5"
            title="To'liq admin boshqaruvi va arizalar"
          >
            <FaShieldAlt className="text-xs text-amber-500" />
            <span>Boshqaruv paneli</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminTopBar;
