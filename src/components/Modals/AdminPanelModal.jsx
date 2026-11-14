import React, { useState } from 'react';
import {
  FaTimes,
  FaCrown,
  FaPlus,
  FaTrashAlt,
  FaMusic,
  FaLanguage,
  FaExclamationTriangle,
  FaSearch,
  FaSignInAlt,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTranslate } from '../../hooks/useTranslate';
import { resolveMediaUrl, DEFAULT_COVERS } from '../../services/api';

const AdminPanelModal = ({
  isOpen,
  onClose,
  songs = [],
  onDeleteSong,
  onOpenAddModal,
  onOpenLogin,
}) => {
  const { isAdmin, currentUser } = useAuth();
  const { t } = useTranslate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedSuccess, setDeletedSuccess] = useState('');

  if (!isOpen) return null;

  const filtered = songs.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return s.title?.toLowerCase().includes(q) || s.artist?.toLowerCase().includes(q) || s.genre?.toLowerCase().includes(q);
  });

  const handleDelete = (song) => {
    if (window.confirm(`Haqiqatan ham "${song.title}" qo'shig'ini o'chirmoqchimisiz?`)) {
      onDeleteSong(song.id);
      setDeletedSuccess(`"${song.title}" o'chirildi!`);
      setTimeout(() => setDeletedSuccess(''), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Tepa qismi */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <FaCrown className="text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('admin_panel_title', 'Admin Boshqaruv Paneli')}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                  Humoyun
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('admin_panel_desc', "Qo'shiqlarni faqat admin qo'shadi va boshqaradi")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Agar Admin bo'lmasa - Cheklov xabari */}
        {!isAdmin ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <FaExclamationTriangle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Ruxsat berilmadi: Faqat Admin uchun!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Foydalanuvchi talabiga asosan yangi musiqa qo'shish va boshqarish huquqi faqat <b>Humoyun (Admin)</b> uchun ochiq.
                Hozirgi profil: <b>{currentUser?.name || "Mehmon"}</b>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-xs space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Admin sifatida kirish:
              </span>
              <div className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                Login: Humoyun
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 active:scale-95 transition-all"
            >
              <FaSignInAlt /> Admin (Humoyun) sifatida kirish
            </button>
          </div>
        ) : (
          /* Admin amallari */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Bildirishnoma */}
            {deletedSuccess && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                ✓ {deletedSuccess}
              </div>
            )}

            {/* Qidiruv va Yangi qo'shish tugmasi */}
            <div className="p-6 pb-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
              <div className="relative w-full sm:w-72">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Musiqani qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenAddModal();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/25 active:scale-95 transition-all"
              >
                <FaPlus className="text-[11px]" />
                <span>+ Yangi musiqa qo'shish</span>
              </button>
            </div>

            {/* Musiqalar jadvali */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-1">
                <span>Mavjud musiqalar ({filtered.length} ta)</span>
                <span>Amallar</span>
              </div>

              {filtered.map((song) => {
                const fallbackIndex = Math.abs(Number(song.id) || 0) % DEFAULT_COVERS.length;
                const cover = resolveMediaUrl(song.cover_url, 'cover', song.id) || DEFAULT_COVERS[fallbackIndex];

                return (
                  <div
                    key={song.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={cover}
                        alt={song.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {song.title}
                          </h4>
                          {song.language && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                              {song.language === 'ru' ? '🇷🇺 Rus' : song.language === 'en' ? '🇬🇧 Ing' : '🇺🇿 O\'zb'}
                            </span>
                          )}
                          {song.hasTranslation && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <FaLanguage /> Tarjimasi bor
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {song.artist} • <span className="font-semibold">{song.genre}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDelete(song)}
                        className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 transition-all text-xs"
                        title="Qo'shiqni o'chirish"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Modal pastki qismi */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>Admin boshqaruvi: Humoyun</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all"
          >
            {t('close', 'Yopish')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelModal;
