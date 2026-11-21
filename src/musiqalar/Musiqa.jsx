import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import GenreFilter from '../components/GenreFilter';
import SongCard from '../components/SongCard';
import AudioPlayer from '../components/AudioPlayer';
import MobileBottomNav from '../components/MobileBottomNav';
import OfflineLoader from '../components/OfflineLoader';
import LoginScreen from '../components/LoginScreen';
import AdminTopBar from '../components/AdminTopBar';
import SongRequestsSection from '../components/SongRequestsSection';

import UserProfileModal from '../components/Modals/UserProfileModal';
import UserFeedbackModal from '../components/Modals/UserFeedbackModal';
import AddSongModal from '../components/Modals/AddSongModal';
import CommentModal from '../components/Modals/CommentModal';
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
  FaFire,
  FaPlay,
} from 'react-icons/fa';

const Musiqa = () => {
  // 1. Dark / Light rejim
  const { isDark, toggleTheme } = useTheme();

  // 2. Auth tizimi (foydalanuvchi birinchi login/parol kiritishi kerak)
  const { currentUser, isAdmin, isLoggedIn, trackPlay, trackLike } = useAuth();

  // 3. Til tarjimasi
  const { t } = useTranslate();

  // 4. Qo'shiqlar va kutubxona (50 ta yangi xitlar)
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
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeCommentSong, setActiveCommentSong] = useState(null);
  const [activeLyricsSong, setActiveLyricsSong] = useState(null);

  // Qidiruv input refi
  const searchInputRef = useRef(null);

  // Ruscha / Chet tili xabarnomasi
  const [foreignAlert, setForeignAlert] = useState(null);

  // AGAR FOYDALANUVCHI KIRMAGAN BO'LSA - BIRINCHI BO'LIB LOGIN EKRANI CHIQADI (1-rasmdan oldin)
  if (!isLoggedIn || !currentUser) {
    return <LoginScreen />;
  }

  // Qo'shiqni ijro etish
  const handlePlaySong = (song) => {
    player.playSong(song);
    trackPlay(song);

    if (song.language && song.language !== 'uz') {
      const langLabel = song.language === 'ru' ? 'Ruscha' : 'Inglizcha';
      setForeignAlert({
        title: song.title,
        message: `"${song.title}" (${langLabel}) tanlandi! "Tarjimasi" tugmasida o'zbekcha qatorma-qator tarjimasi mavjud.`,
      });
      setTimeout(() => setForeignAlert(null), 5000);
    }
  };

  // Like bosish
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

  // Top trend qo'shiqlar
  const topTrendingSongs = songs
    .filter((s) => s.isTrending || Number(s.plays) >= 900)
    .sort((a, b) => (Number(b.plays) || 0) - (Number(a.plays) || 0))
    .slice(0, 8);

  // Yoqtirilgan qo'shiqlar
  const likedSongsList = songs.filter((s) => s.liked);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-amber-500/30">
      
      {/* Offline xabarnoma */}
      <OfflineLoader />

      {/* Yuqori Navbar - Toza, ortiqcha mayda-chuda tugmalarsiz */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showOnlyLiked={showOnlyLiked}
        setShowOnlyLiked={setShowOnlyLiked}
        showOnlyTrending={showOnlyTrending}
        setShowOnlyTrending={setShowOnlyTrending}
        likedCount={likedCount}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        totalSongs={songs.length}
        searchInputRef={searchInputRef}
      />

      {/* Chet tili tanlangandagi ixcham bildirishnoma */}
      {foreignAlert && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 text-amber-200 px-4 py-2 sticky top-16 sm:top-20 z-30 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-semibold">
            <div className="flex items-center gap-2 truncate">
              <FaLanguage className="text-base text-amber-400 shrink-0" />
              <span className="truncate">{foreignAlert.message}</span>
            </div>
            <button
              onClick={() => setForeignAlert(null)}
              className="text-amber-300/80 hover:text-white px-2 py-0.5 rounded-lg bg-black/40 text-[11px] shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Asosiy kontent maydoni */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 pb-44 sm:pb-36">
        
        {/* ADMIN BOSHQARUV TEPADA (User requirement: "admin boshqaruv musiclar turibtiyu oshani tepasida bolsin chunki u muhimroq") */}
        {isAdmin && (
          <AdminTopBar
            totalSongs={songs.length}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
            onOpenFeedbacks={() => setIsAdminPanelOpen(true)}
          />
        )}

        {/* Sarlavha va Janr filtrlari */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                {showOnlyTrending ? (
                  <span className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                    <FaFire className="text-orange-500" /> Trenddagi qo'shiqlar
                  </span>
                ) : showOnlyLiked ? (
                  <span className="flex items-center gap-2 text-rose-500">
                    <FaHeart /> Sevimli musiqalar
                  </span>
                ) : (
                  <span>Musiqalar to'plami</span>
                )}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-400">
              {showOnlyTrending
                ? `Eng ko'p tinglangan va yuqori o'rinlardagi trend xitlar`
                : showOnlyLiked
                ? `${likedCount} ta saqlangan va sevimli qo'shiqlaringiz`
                : "Eng sara 50 ta trek, yuqori sifatli audio va o'zbekcha ma'no tarjimalari bilan"}
            </p>
          </div>

          {/* Janrlar va Tillar filtri */}
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
          <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <FaFire className="text-orange-500 text-base" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Trenddagi Eng Sara Qo'shiqlar (Top Hits)
                </h3>
              </div>
              <button
                onClick={() => setShowOnlyTrending(true)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                Barcha trendlarni ko'rish →
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {topTrendingSongs.map((ts, idx) => (
                <div
                  key={ts.id}
                  onClick={() => handlePlaySong(ts)}
                  className="flex-shrink-0 w-36 sm:w-44 p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 shadow-sm cursor-pointer group transition-all"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-slate-800">
                    <img
                      src={ts.cover_url}
                      alt={ts.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/70 text-amber-300 font-extrabold text-[10px] flex items-center gap-1 shadow">
                      <span>#{idx + 1}</span>
                      <FaFire className="text-[9px] text-orange-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg">
                        <FaPlay className="text-[10px] ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {ts.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate font-medium">
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
                className="animate-pulse flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="h-2.5 bg-slate-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Xatolik holati */}
        {!loading && error && (
          <div className="text-center py-10 px-4 rounded-3xl bg-rose-950/20 border border-rose-900/40 my-6">
            <FaExclamationTriangle className="text-3xl text-rose-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-300 mb-1">
              Qo'shiqlarni yuklashda muammo bo'ldi
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
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
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-slate-500 mx-auto flex items-center justify-center mb-4 border border-slate-800">
              <FaMusic className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {songs.length === 0 ? "Kutubxonada hozircha musiqa yo'q" : "Hech qanday musiqa topilmadi"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              {songs.length === 0
                ? (isAdmin ? "Barcha eski qo'shiqlar olib tashlandi. Yangi musiqalar qo'shish uchun pastdagi tugmani bosing:" : "Administrator tomonidan yangi musiqalar kiritilishi kutilmoqda. Qaysi musiqani xohlashingizni taklif qilib qoldirishingiz mumkin.")
                : showOnlyTrending
                ? "Hozircha trenddagi filtr bo'yicha musiqa topilmadi."
                : showOnlyLiked
                ? "Siz hali hech qaysi qo'shiqni sevimli qilmadingiz."
                : searchQuery
                ? `"${searchQuery}" so'rovi bo'yicha musiqa topilmadi.`
                : "Tanlangan parametrlar bo'yicha musiqa mavjud emas."}
            </p>
            {showOnlyLiked ? (
              <button
                onClick={() => setShowOnlyLiked(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Barcha musiqalarni ko'rish
              </button>
            ) : isAdmin ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                + Yangi musiqa kiritish
              </button>
            ) : (
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                + Musiqa taklif qilish
              </button>
            )}
          </div>
        )}

        {/* Musiqalar ro'yxati (Grid) - 50 ta boy xitlar */}
        {!loading && filteredSongs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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

        {/* ENG PASTKI QISM: "QAYSI MUSIC NI QO'SHISHIMIZNI HOHLAYSIZ" KOMMENT/SO'ROV BO'LIMI */}
        <SongRequestsSection />

      </main>

      {/* Audio Player */}
      <AudioPlayer
        player={player}
        songsList={filteredSongs.length > 0 ? filteredSongs : songs}
        onToggleLike={handleToggleLike}
        onOpenComment={(selected) => setActiveCommentSong(selected)}
        onOpenLyrics={(selected) => setActiveLyricsSong(selected)}
        commentCount={player.currentSong ? getCommentCount(player.currentSong.id) : 0}
      />

      {/* Mobil navigatsiya */}
      <MobileBottomNav
        showOnlyLiked={showOnlyLiked}
        setShowOnlyLiked={setShowOnlyLiked}
        likedCount={likedCount}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onFocusSearch={handleFocusSearch}
      />

      {/* Foydalanuvchi Profili Modali (Katta odamlar uchun zamonaviy, Instagram nusxasi emas) */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        likedSongs={likedSongsList}
        onPlaySong={handlePlaySong}
      />

      {/* Fikrlar va Qo'shiq taklifi Modali (Foydalanuvchi + ni bosganda chiqadi, adminga boradi va admin javob qaytaradi) */}
      <UserFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {/* Musiqa qo'shish modali (Faqat Admin kiritishi uchun) */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSong={addSong}
      />

      {/* Foydalanish qo'llanmasi (Eng pastida admin bilan bog'lanish bor) */}
      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Admin Boshqaruv paneli modali (Fikrlar, arizalar, musiqalar va monitoring) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        songs={songs}
        onDeleteSong={deleteSong}
        onOpenAddModal={() => setIsAddModalOpen(true)}
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
