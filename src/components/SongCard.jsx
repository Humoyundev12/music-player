import React, { useState } from 'react';
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaHeadphones,
  FaLanguage,
  FaTrashAlt,
  FaFire,
  FaDownload,
} from 'react-icons/fa';
import { resolveMediaUrl, DEFAULT_COVERS } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useTranslate } from '../hooks/useTranslate';

const SongCard = ({
  song,
  isPlayingCurrent,
  isCurrent,
  onPlay,
  onToggleLike,
  onOpenComment,
  onOpenLyrics,
  onDeleteSong,
  commentCount = 0,
}) => {
  const [imageError, setImageError] = useState(false);
  const { isAdmin } = useAuth();
  const { t } = useTranslate();

  const fallbackIndex = Math.abs(Number(song.id) || 0) % DEFAULT_COVERS.length;
  const coverUrl = imageError
    ? DEFAULT_COVERS[fallbackIndex]
    : resolveMediaUrl(song.cover_url, 'cover', song.id);

  const isForeign = song.language && song.language !== 'uz';

  const handleDownload = (e) => {
    e.stopPropagation();
    // Musiqani saqlash / yuklab olish
    const link = document.createElement('a');
    link.href = song.audio_url;
    link.download = `${song.title} - ${song.artist}.mp3`;
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={() => onPlay(song)}
      className={`group relative flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300 border cursor-pointer select-none ${
        isCurrent
          ? 'bg-amber-950/25 dark:bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
          : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Chap qism: Cover rasm & Equalizer */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/10 bg-slate-800">
        <img
          src={coverUrl}
          alt={song.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Equalizer animatsiyasi */}
        {isPlayingCurrent ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center gap-1">
            <span className="w-1 bg-amber-400 rounded-full animate-bar-1 h-3.5" />
            <span className="w-1 bg-orange-400 rounded-full animate-bar-2 h-5" />
            <span className="w-1 bg-amber-300 rounded-full animate-bar-3 h-2.5" />
            <span className="w-1 bg-amber-400 rounded-full animate-bar-4 h-4" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-md transform group-hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
              <FaPlay className="text-[11px] ml-0.5 text-amber-600" />
            </div>
          </div>
        )}
      </div>

      {/* O'rta qism: Qo'shiq nomi, ijrochi va teglar */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className={`font-bold text-sm sm:text-base truncate ${
            isCurrent ? 'text-amber-500 dark:text-amber-400' : 'text-slate-900 dark:text-white'
          }`}>
            {song.title}
          </h3>

          {/* Til nishoni */}
          {song.language && (
            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 border border-slate-200 dark:border-slate-700">
              {song.language === 'ru' ? 'RU' : song.language === 'en' ? 'EN' : 'UZ'}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium mb-1.5">
          {song.artist}
        </p>

        {/* Teglar qatori */}
        <div className="flex flex-wrap items-center gap-1.5">
          {isForeign && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-semibold border border-amber-500/20">
              <FaLanguage className="text-[10px]" />
              <span>Tarjimasi bor</span>
            </span>
          )}

          {song.genre && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {song.genre}
            </span>
          )}

          {(song.isTrending || Number(song.plays) >= 900) && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-rose-600 text-white text-[9px] font-extrabold shadow-sm">
              <FaFire className="text-[9px] text-amber-200" />
              <span>Trend</span>
            </span>
          )}

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
            <FaHeadphones className="text-[9px]" />
            {song.plays || 0}
          </span>
        </div>
      </div>

      {/* O'ng tomondagi amallar */}
      <div
        className="flex items-center gap-1 sm:gap-1.5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Matn va Tarjima tugmasi */}
        {song.lyrics && song.lyrics.length > 0 && (
          <button
            onClick={() => onOpenLyrics && onOpenLyrics(song)}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isForeign
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Qo'shiq matni va o'zbekcha tarjimasi"
          >
            <FaLanguage className="text-xs sm:text-sm text-amber-500" />
            <span className="hidden md:inline">{isForeign ? "Tarjimasi" : "Matni"}</span>
          </button>
        )}

        {/* Musiqani saqlash / yuklab olish tugmasi */}
        <button
          onClick={handleDownload}
          className="p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Musiqani saqlash / yuklab olish (MP3)"
        >
          <FaDownload className="text-xs sm:text-sm" />
        </button>

        {/* Like tugmasi */}
        <button
          onClick={() => onToggleLike(song.id)}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            song.liked
              ? 'text-rose-500 bg-rose-500/10'
              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={song.liked ? "Yoqtirilganlardan o'chirish" : "Yoqtirish (Like)"}
        >
          {song.liked ? (
            <FaHeart className="text-xs sm:text-sm text-rose-500" />
          ) : (
            <FaRegHeart className="text-xs sm:text-sm" />
          )}
          <span className="text-[11px]">{song.likes || 0}</span>
        </button>

        {/* Izohlar */}
        <button
          onClick={() => onOpenComment(song)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Izohlar"
        >
          <FaRegComment className="text-xs" />
          {commentCount > 0 && <span className="text-[11px]">{commentCount}</span>}
        </button>

        {/* Admin o'chirish tugmasi (faqat admin bo'lsa) */}
        {isAdmin && onDeleteSong && (
          <button
            onClick={() => {
              if (window.confirm(`Haqiqatan ham "${song.title}" qo'shig'ini o'chirmoqchimisiz?`)) {
                onDeleteSong(song.id);
              }
            }}
            className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-xs"
            title="Qo'shiqni o'chirish (Admin)"
          >
            <FaTrashAlt />
          </button>
        )}

        {/* Play / Pause asosiy tugmasi */}
        <button
          onClick={() => onPlay(song)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95 ${
            isPlayingCurrent
              ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-amber-500/25 ring-2 ring-amber-400/50'
              : 'bg-slate-100 hover:bg-amber-500 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-amber-500 dark:text-slate-200'
          }`}
          title={isPlayingCurrent ? 'Pauza' : 'Ijro etish'}
        >
          {isPlayingCurrent ? <FaPause className="text-xs" /> : <FaPlay className="text-xs ml-0.5" />}
        </button>
      </div>
    </div>
  );
};

export default SongCard;
