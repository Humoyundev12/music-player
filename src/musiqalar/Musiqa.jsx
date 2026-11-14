import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GenreFilter from '../components/GenreFilter';
import SongCard from '../components/SongCard';
import AudioPlayer from '../components/AudioPlayer';
import AddSongModal from '../components/Modals/AddSongModal';
import CommentModal from '../components/Modals/CommentModal';
import LoginModal from '../components/Modals/LoginModal';
import UserGuideModal from '../components/Modals/UserGuideModal';
import AdminPanelModal from '../components/Modals/AdminPanelModal';
import LyricsModal from '../components/Modals/LyricsModal';

import useTheme from '../hooks/useTheme';
import useSongs from '../hooks/useSongs';
import usePlayer from '../hooks/usePlayer';
import useComments from '../hooks/useComments';
import useAuth from '../hooks/useAuth';
import useTranslate from '../hooks/useTranslate';

import {
  FaMusic,
  FaHeart,
  FaExclamationTriangle,
  FaRedo,
  FaLanguage,
  FaCrown,
  FaCheckCircle,
} from 'react-icons/fa';

const Musiqa = () => {
  // 1. Dark / Light rejim
  const { isDark, toggleTheme } = useTheme();

  // 2. Auth tizimi (Foydalanuvchi: Muhammad, Admin: Humoyun)
  const { currentUser, isAdmin, isLoggedIn } = useAuth();

  // 3. Til tarjimasi hooki (useTranslate)
  const { t, lang } = useTranslate();

  // 4. Qo'shiqlar va kutubxona
  const {
    songs,
    filteredSongs,
    genres,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedLanguage,
    setSelectedLanguage,
    showOnlyLiked,
    setShowOnlyLiked,
    likedCount,
    toggleLike,
    addSong,
    deleteSong,
    reloadSongs,
  } = useSongs();

  // 5. Audio player
  const player = usePlayer();

  // 6. Izohlar
  const { getSongComments, getCommentCount, addComment } = useComments();

  // Modallar holati
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeCommentSong, setActiveCommentSong] = useState(null);
  const [activeLyricsSong, setActiveLyricsSong] = useState(null);

  // Ruscha / Chet tili tanlangandagi xabarnoma (Toast)
  const [foreignAlert, setForeignAlert] = useState(null);

  // Qo'shiqni tanlash va ijro etish
  const handlePlaySong = (song) => {
    player.playSong(song);

    // Agar ruscha yoki boshqa tildagi qo'shiq tanlansa, pastida tarjima chiqishi haqida xabar ko'rsatiladi
    if (song.language && song.language !== 'uz') {
      const langLabel = song.language === 'ru' ? 'Ruscha' : 'Inglizcha';
      setForeignAlert({
        title: song.title,
        message: `"${song.title}" (${langLabel}) tanlandi! Pastdagi playerda va "Tarjimasi" tugmasida o'zbekcha tarjimasi chiqib turadi.`,
      });
      setTimeout(() => setForeignAlert(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Yuqori Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showOnlyLiked={showOnlyLiked}
        setShowOnlyLiked={setShowOnlyLiked}
        likedCount={likedCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        totalSongs={songs.length}
      />

      {/* Chet tilidagi qo'shiq tanlangandagi maxsus xabarnoma */}
      {foreignAlert && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white px-4 py-2.5 shadow-md sticky top-20 z-30 animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <FaLanguage className="text-base shrink-0 animate-bounce" />
              <span>✨ {foreignAlert.message}</span>
            </div>
            <button
              onClick={() => setForeignAlert(null)}
              className="text-white/80 hover:text-white px-2 py-0.5 rounded-lg bg-black/20 text-[11px]"
            >
              ✕ Yopish
            </button>
          </div>
        </div>
      )}

      {/* Asosiy kontent maydoni */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-40">
        
        {/* Banner va tab sarlavhasi */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {showOnlyLiked ? (
                  <span className="flex items-center gap-2.5 text-rose-500">
                    <FaHeart /> {t('liked_title', 'Yoqtirilgan musiqalar')}
                  </span>
                ) : (
                  <span>{t('collection_title', "Musiqalar to'plami")}</span>
                )}
              </h1>

              {/* Hozirgi foydalanuvchi ma'lumoti */}
              {isLoggedIn && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm ${
                  isAdmin
                    ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {isAdmin ? '👑 Humoyun (Admin)' : '👤 Muhammad (Foydalanuvchi)'}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {showOnlyLiked
                ? `${likedCount} ta sevimli qo'shiqlaringiz`
                : t('collection_subtitle', "Eng sara treklarni tinglang, yoqtiring va ruscha/xorijiy qo'shiqlarning o'zbekcha tarjimasini o'qing")}
            </p>
          </div>

          {/* Janrlar va Til filtrlari */}
          {!showOnlyLiked && (
            <div className="w-full md:w-auto">
              <GenreFilter
                genres={genres}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
              />
            </div>
          )}
        </div>

        {/* Yuklanish holati */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="animate-pulse flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Xatolik holati */}
        {!loading && error && (
          <div className="text-center py-10 px-4 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 my-6">
            <FaExclamationTriangle className="text-3xl text-rose-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-1">
              Qo'shiqlarni yuklashda muammo bo'ldi
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-3">
              {error}
            </p>
            <button
              onClick={reloadSongs}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <FaRedo className="text-xs" /> Qayta urinib ko'rish
            </button>
          </div>
        )}

        {/* Bo'sh ro'yxat */}
        {!loading && !error && filteredSongs.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <FaMusic className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              Hech qanday musiqa topilmadi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              {showOnlyLiked
                ? t('empty_liked', "Siz hali hech qaysi qo'shiqqa like bosmadingiz.")
                : searchQuery
                ? `"${searchQuery}" ${t('empty_search', "so'rovi bo'yicha musiqa topilmadi.")}`
                : "Tanlangan parametrlar bo'yicha musiqa mavjud emas."}
            </p>
            {showOnlyLiked ? (
              <button
                onClick={() => setShowOnlyLiked(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-md"
              >
                {t('view_all', 'Barcha musiqalarni ko\'rish')}
              </button>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-md"
              >
                + {t('add_song', "Yangi musiqa qo'shish")}
              </button>
            )}
          </div>
        )}

        {/* Musiqalar ro'yxati (Grid) */}
        {!loading && filteredSongs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSongs.map((song) => {
              const isCurrent = player.currentSong?.id === song.id;
              const isPlayingCurrent = isCurrent && player.isPlaying;
              const count = getCommentCount(song.id);

              return (
                <SongCard
                  key={song.id}
                  song={song}
                  isCurrent={isCurrent}
                  isPlayingCurrent={isPlayingCurrent}
                  onPlay={handlePlaySong}
                  onToggleLike={toggleLike}
                  onOpenComment={(selected) => setActiveCommentSong(selected)}
                  onOpenLyrics={(selected) => setActiveLyricsSong(selected)}
                  onDeleteSong={deleteSong}
                  commentCount={count}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Pastki Audio Player va jonli tarjima paneli */}
      <AudioPlayer
        player={player}
        songsList={filteredSongs.length > 0 ? filteredSongs : songs}
        onToggleLike={toggleLike}
        onOpenComment={(selected) => setActiveCommentSong(selected)}
        onOpenLyrics={(selected) => setActiveLyricsSong(selected)}
        commentCount={player.currentSong ? getCommentCount(player.currentSong.id) : 0}
      />

      {/* Musiqa qo'shish modali (Faqat admin qo'sha oladi) */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSong={addSong}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Login Modali (Foydalanuvchi: Muhammad, Admin: Humoyun) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Foydalanish qismi va Foydalanuvchi profili modali */}
      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        likedCount={likedCount}
        totalSongs={songs.length}
      />

      {/* Admin Boshqaruv paneli modali */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        songs={songs}
        onDeleteSong={deleteSong}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Qo'shiq matni va Tarjimasi modali */}
      <LyricsModal
        isOpen={!!activeLyricsSong}
        onClose={() => setActiveLyricsSong(null)}
        song={activeLyricsSong}
        isPlaying={player.isPlaying && player.currentSong?.id === activeLyricsSong?.id}
        onTogglePlay={player.togglePlay}
      />

      {/* Izohlar (Comments) modali */}
      <CommentModal
        isOpen={!!activeCommentSong}
        onClose={() => setActiveCommentSong(null)}
        song={activeCommentSong}
        comments={activeCommentSong ? getSongComments(activeCommentSong.id) : []}
        onAddComment={addComment}
      />

    </div>
  );
};

export default Musiqa;
