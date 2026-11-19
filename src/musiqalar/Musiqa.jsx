import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import GenreFilter from '../components/GenreFilter';
import SongCard from '../components/SongCard';
import AudioPlayer from '../components/AudioPlayer';
import MobileBottomNav from '../components/MobileBottomNav';
import OfflineLoader from '../components/OfflineLoader';
import NextFooter from '../components/NextFooter';
import InstagramProfileModal from '../components/InstagramProfileModal';

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
  FaFire,
  FaPlay,
} from 'react-icons/fa';

const Musiqa = () => {
  // 1. Dark / Light rejim
  const { isDark, toggleTheme } = useTheme();

  // 2. Auth tizimi va harakatlarni kuzatish (Monitoring)
  const { currentUser, isAdmin, isLoggedIn, trackPlay, trackLike } = useAuth();

  // 3. Til tarjimasi hooki
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
    showOnlyTrending,
    setShowOnlyTrending,
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
  const [isInstagramProfileOpen, setIsInstagramProfileOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeCommentSong, setActiveCommentSong] = useState(null);
  const [activeLyricsSong, setActiveLyricsSong] = useState(null);

  // Qidiruv input refi (mobil navigatsiyadan fokuslash uchun)
  const searchInputRef = useRef(null);

  // Ruscha / Chet tili tanlangandagi xabarnoma (Toast)
  const [foreignAlert, setForeignAlert] = useState(null);

  // Qo'shiqni tanlash va ijro etish (monitoring bilan)
  const handlePlaySong = (song) => {
    player.playSong(song);
    trackPlay(song);

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

  // Like bosish (monitoring bilan)
  const handleToggleLike = (songId) => {
    const song = songs.find((s) => s.id === songId || String(s.id) === String(songId));
    const willBeLiked = !song?.liked;
    toggleLike(songId);
    if (song) {
      trackLike(song, willBeLiked);
    }
  };

  const handleFocusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 250);
  };

  // Top trend qo'shiqlar (Shelf uchun)
  const topTrendingSongs = songs
    .filter((s) => s.isTrending || Number(s.plays) >= 900)
    .sort((a, b) => (Number(b.plays) || 0) - (Number(a.plays) || 0))
    .slice(0, 8);

  // Yoqtirilgan qo'shiqlar obyektlari
  const likedSongsList = songs.filter((s) => s.liked);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* 1. Offline & Loading Ekran (Internet ishlamay qolsa loading... chiqsin) */}
      <OfflineLoader />

      {/* 2. Yuqori Navbar (HB Logo bilan) */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showOnlyLiked={showOnlyLiked}
        setShowOnlyLiked={setShowOnlyLiked}
        showOnlyTrending={showOnlyTrending}
        setShowOnlyTrending={setShowOnlyTrending}
        likedCount={likedCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenProfile={() => setIsInstagramProfileOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        totalSongs={songs.length}
        searchInputRef={searchInputRef}
      />

      {/* Chet tilidagi qo'shiq tanlangandagi maxsus xabarnoma */}
      {foreignAlert && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-md sticky top-16 sm:top-20 z-30 animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-semibold">
            <div className="flex items-center gap-2 truncate">
              <FaLanguage className="text-base shrink-0 animate-bounce text-amber-200" />
              <span className="truncate">✨ {foreignAlert.message}</span>
            </div>
            <button
              onClick={() => setForeignAlert(null)}
              className="text-white/90 hover:text-white px-2 py-0.5 rounded-lg bg-black/20 text-[11px] shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Asosiy kontent maydoni */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-44 sm:pb-36">
        
        {/* Banner va Tab sarlavhasi */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight">
                {showOnlyTrending ? (
                  <span className="flex items-center gap-2 bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 bg-clip-text text-transparent">
                    <FaFire className="text-orange-500" /> Trenddagi qo'shiqlar
                  </span>
                ) : showOnlyLiked ? (
                  <span className="flex items-center gap-2 text-rose-500">
                    <FaHeart /> {t('liked_title', 'Yoqtirilgan musiqalar')}
                  </span>
                ) : (
                  <span>{t('collection_title', "Musiqalar to'plami")}</span>
                )}
              </h1>

              {/* Hozirgi foydalanuvchi ma'lumoti */}
              {isLoggedIn && (
                <button
                  onClick={() => setIsInstagramProfileOpen(true)}
                  className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-bold shadow-sm hover:scale-105 transition-all ${
                    isAdmin
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  }`}
                  title="Instagram Profilni ochish"
                >
                  {isAdmin ? '👑 Humoyun (Admin)' : `👤 ${currentUser.name}`}
                </button>
              )}
            </div>

            <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400">
              {showOnlyTrending
                ? `Eng ko'p tinglangan va top o'rinlardagi trend xitlar`
                : showOnlyLiked
                ? `${likedCount} ta sevimli qo'shiqlaringiz`
                : t('collection_subtitle', "Eng sara treklarni tinglang, yoqtiring va ruscha/xorijiy qo'shiqlarning o'zbekcha tarjimasini o'qing")}
            </p>
          </div>

          {/* Janrlar, Tillar va Trend filtrlari */}
          {!showOnlyLiked && (
            <div className="w-full md:w-auto">
              <GenreFilter
                genres={genres}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
                showOnlyTrending={showOnlyTrending}
                onToggleTrending={() => {
                  setShowOnlyTrending(!showOnlyTrending);
                  if (showOnlyLiked) setShowOnlyLiked(false);
                }}
              />
            </div>
          )}
        </div>

        {/* TOP TREND DAGI ENG SARA QO'SHIQLAR CAROUSEL / SHELF */}
        {!showOnlyTrending && !showOnlyLiked && !searchQuery && topTrendingSongs.length > 0 && (
          <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-amber-500/10 border border-orange-200/80 dark:border-orange-900/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaFire className="text-orange-500 text-lg animate-bounce" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Trenddagi Eng Sara Qo'shiqlar (Top Hits)
                </h3>
              </div>
              <button
                onClick={() => setShowOnlyTrending(true)}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Barcha trendlarni ko'rish →
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {topTrendingSongs.map((ts, idx) => (
                <div
                  key={ts.id}
                  onClick={() => handlePlaySong(ts)}
                  className="flex-shrink-0 w-36 sm:w-44 p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md cursor-pointer group transition-all"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-slate-200 dark:bg-slate-800">
                    <img
                      src={ts.cover_url}
                      alt={ts.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/70 text-amber-300 font-extrabold text-[10px] flex items-center gap-1 shadow">
                      <span>#{idx + 1}</span>
                      <FaFire className="text-[9px] text-orange-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg">
                        <FaPlay className="text-[10px] ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {ts.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {ts.artist}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yuklanish holati */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="animate-pulse flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <FaRedo className="text-xs" /> Qayta urinib ko'rish
            </button>
          </div>
        )}

        {/* Bo'sh ro'yxat */}
        {!loading && !error && filteredSongs.length === 0 && (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <FaMusic className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              Hech qanday musiqa topilmadi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              {showOnlyTrending
                ? "Hozircha trenddagi filtr bo'yicha musiqa topilmadi."
                : showOnlyLiked
                ? t('empty_liked', "Siz hali hech qaysi qo'shiqqa like bosmadingiz.")
                : searchQuery
                ? `"${searchQuery}" ${t('empty_search', "so'rovi bo'yicha musiqa topilmadi.")}`
                : "Tanlangan parametrlar bo'yicha musiqa mavjud emas."}
            </p>
            {showOnlyTrending ? (
              <button
                onClick={() => setShowOnlyTrending(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Barcha musiqalarni ko'rish
              </button>
            ) : showOnlyLiked ? (
              <button
                onClick={() => setShowOnlyLiked(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                {t('view_all', 'Barcha musiqalarni ko\'rish')}
              </button>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                + {t('add_song', "Yangi musiqa qo'shish")}
              </button>
            )}
          </div>
        )}

        {/* Musiqalar ro'yxati (Grid) */}
        {!loading && filteredSongs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
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
                  onToggleLike={handleToggleLike}
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

      {/* 3. SO'NGIDA "NEXT.JS" (Foydalanuvchi talabi: "va songida next.js bolsin") */}
      <NextFooter />

      {/* Audio Player */}
      <AudioPlayer
        player={player}
        songsList={filteredSongs.length > 0 ? filteredSongs : songs}
        onToggleLike={handleToggleLike}
        onOpenComment={(selected) => setActiveCommentSong(selected)}
        onOpenLyrics={(selected) => setActiveLyricsSong(selected)}
        commentCount={player.currentSong ? getCommentCount(player.currentSong.id) : 0}
      />

      {/* Mobil telefonlar uchun qulay pastki navigatsiya */}
      <MobileBottomNav
        showOnlyLiked={showOnlyLiked}
        setShowOnlyLiked={setShowOnlyLiked}
        likedCount={likedCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenProfile={() => setIsInstagramProfileOpen(true)}
        onFocusSearch={handleFocusSearch}
      />

      {/* Instagram Uslubidagi Profil Modali (Rasm 3 ga aynan mos, rasm 2 kabi sodda emas) */}
      <InstagramProfileModal
        isOpen={isInstagramProfileOpen}
        onClose={() => setIsInstagramProfileOpen(false)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        likedSongs={likedSongsList}
        songs={songs}
        onPlaySong={handlePlaySong}
      />

      {/* Musiqa qo'shish modali (Faqat admin qo'sha oladi) */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSong={addSong}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Login Modali (Rasm 1 dagi kabi dizayn: Tizimga Kirish, Birinchi marta kirish ariza va email) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Foydalanish qismi va Profil modali */}
      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenInstagramProfile={() => setIsInstagramProfileOpen(true)}
        likedCount={likedCount}
        totalSongs={songs.length}
      />

      {/* Admin Boshqaruv paneli modali (Monitoring, arizalar, login/parol berish, emailga yuborish) */}
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
