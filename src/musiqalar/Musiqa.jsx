import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GenreFilter from '../components/GenreFilter';
import SongCard from '../components/SongCard';
import AudioPlayer from '../components/AudioPlayer';
import AddSongModal from '../components/Modals/AddSongModal';
import CommentModal from '../components/Modals/CommentModal';

import useTheme from '../hooks/useTheme';
import useSongs from '../hooks/useSongs';
import usePlayer from '../hooks/usePlayer';
import useComments from '../hooks/useComments';
import { FaMusic, FaHeart, FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const Musiqa = () => {
  // 1. Dark/Light rejim custom hooki
  const { isDark, toggleTheme } = useTheme();

  // 2. Qo'shiqlar va API custom hooki
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
    showOnlyLiked,
    setShowOnlyLiked,
    likedCount,
    toggleLike,
    addSong,
    reloadSongs,
  } = useSongs();

  // 3. Audio player custom hooki
  const player = usePlayer();

  // 4. Izohlar (Comments) custom hooki
  const { getSongComments, getCommentCount, addComment } = useComments();

  // Modallar holati
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeCommentSong, setActiveCommentSong] = useState(null);

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
        isDark={isDark}
        toggleTheme={toggleTheme}
        totalSongs={songs.length}
      />

      {/* Asosiy kontent maydoni */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        
        {/* Banner / Tab sarlavhasi */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {showOnlyLiked ? (
                <span className="flex items-center gap-2.5 text-rose-500">
                  <FaHeart /> Yoqtirilgan musiqalar
                </span>
              ) : (
                <span>Musiqalar to'plami</span>
              )}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {showOnlyLiked
                ? `Siz yoqtirgan ${likedCount} ta qo'shiq`
                : "Eng sara treklarni tinglang, yoqtiring va o'z fikringizni bildiring"}
            </p>
          </div>

          {/* Janrlar filtri */}
          {!showOnlyLiked && (
            <GenreFilter
              genres={genres}
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
            />
          )}
        </div>

        {/* Yuklanish holati (Skeleton) */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="animate-pulse flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Xatolik yuz berganda */}
        {!loading && error && (
          <div className="text-center py-12 px-4 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 my-6">
            <FaExclamationTriangle className="text-4xl text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-rose-700 dark:text-rose-400 mb-1">
              Backendga ulanishda muammo
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
              {error}
            </p>
            <button
              onClick={reloadSongs}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md active:scale-95 transition-all"
            >
              <FaRedo className="text-xs" /> Qayta urinib ko'rish
            </button>
          </div>
        )}

        {/* Bo'sh ro'yxat holati */}
        {!loading && !error && filteredSongs.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <FaMusic className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
              Hech narsa topilmadi
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
              {showOnlyLiked
                ? "Siz hali hech qaysi qo'shiqqa like bosmadingiz. Qo'shiqlarni yoqtirish uchun yurakchani bosing!"
                : searchQuery
                ? `"${searchQuery}" so'rovi bo'yicha musiqa topilmadi.`
                : "Ushbu janrda hozircha musiqa mavjud emas."}
            </p>
            {showOnlyLiked ? (
              <button
                onClick={() => setShowOnlyLiked(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all shadow-md"
              >
                Barcha musiqalarni ko'rish
              </button>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all shadow-md"
              >
                + Yangi musiqa qo'shish
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
                  onPlay={player.playSong}
                  onToggleLike={toggleLike}
                  onOpenComment={(selected) => setActiveCommentSong(selected)}
                  commentCount={count}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Pastki Audio Player */}
      <AudioPlayer
        player={player}
        songsList={filteredSongs.length > 0 ? filteredSongs : songs}
        onToggleLike={toggleLike}
        onOpenComment={(selected) => setActiveCommentSong(selected)}
        commentCount={player.currentSong ? getCommentCount(player.currentSong.id) : 0}
      />

      {/* Musiqa qo'shish modali */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSong={addSong}
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
