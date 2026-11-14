import React, { useState } from 'react';
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaHeadphones,
  FaLanguage,
  FaFileAlt,
  FaTrashAlt,
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

  return (
    <div
      className={`group relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${
        isCurrent
          ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/15 ring-2 ring-indigo-500/30'
          : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/60'
      }`}
    >
      {/* Rasm va Play overlay */}
      <div className="relative w-full sm:w-24 h-44 sm:h-24 shrink-0 rounded-2xl overflow-hidden shadow-sm">
        <img
          src={coverUrl}
          alt={song.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Equalizer animatsiyasi */}
        {isPlayingCurrent && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-1">
            <span className="w-1 bg-indigo-400 rounded-full animate-bar-1 h-3.5"></span>
            <span className="w-1 bg-pink-400 rounded-full animate-bar-2 h-5"></span>
            <span className="w-1 bg-purple-400 rounded-full animate-bar-3 h-2.5"></span>
            <span className="w-1 bg-indigo-400 rounded-full animate-bar-4 h-4"></span>
          </div>
        )}

        {/* Hoverda chiqadigan Play tugmasi */}
        <button
          onClick={() => onPlay(song)}
          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
            isPlayingCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label={isPlayingCurrent ? 'Pauza' : 'Ijro etish'}
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 active:scale-95 transition-all">
            {isPlayingCurrent ? <FaPause className="text-sm" /> : <FaPlay className="text-sm ml-0.5" />}
          </div>
        </button>
      </div>

      {/* Musiqa ma'lumotlari */}
      <div className="flex-1 min-w-0 w-full text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
            {song.title}
          </h3>

          {/* Til belgisi */}
          {song.language && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {song.language === 'ru' ? '🇷🇺 Ruscha' : song.language === 'en' ? '🇬🇧 Inglizcha' : song.language === 'es' ? '🇪🇸 Ispancha' : '🇺🇿 O\'zbekcha'}
            </span>
          )}

          {/* Janr */}
          {song.genre && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
              {song.genre}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 truncate mb-2 font-medium">
          {song.artist}
        </p>

        {/* Ruscha / Chet tili bo'lsa - Pastida o'zbekcha tarjimasi borligi ko'rsatkichi */}
        {isForeign && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold mb-2">
            <FaLanguage className="text-xs shrink-0" />
            <span>O'zbekcha tarjimasi pastda chiqadi</span>
          </div>
        )}

        {/* Tinglash soni */}
        <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <FaHeadphones className="text-[11px]" />
            {song.plays || 0} {t('listen_count', 'tinglandi')}
          </span>
        </div>
      </div>

      {/* O'ng tomondagi amallar */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
        
        {/* Matn va Tarjima tugmasi */}
        {song.lyrics && song.lyrics.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenLyrics) onOpenLyrics(song);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isForeign
                ? 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
            title="Qo'shiq matni va o'zbekcha tarjimasini ko'rish"
          >
            <FaLanguage className="text-sm text-emerald-600 dark:text-emerald-400" />
            <span>{isForeign ? "Tarjimasi" : "Matni"}</span>
          </button>
        )}

        {/* Like tugmasi */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(song.id);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            song.liked
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60'
              : 'text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
          title={song.liked ? "Yoqtirilganlardan o'chirish" : "Yoqtirish (Like)"}
        >
          {song.liked ? (
            <FaHeart className="text-sm text-rose-500 animate-bounce" />
          ) : (
            <FaRegHeart className="text-sm" />
          )}
          <span>{song.likes || 0}</span>
        </button>

        {/* Izohlar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComment(song);
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all"
          title="Fikrlar va izohlarni ko'rish"
        >
          <FaRegComment className="text-xs" />
          <span>{commentCount > 0 ? commentCount : ''}</span>
        </button>

        {/* Admin o'chirish tugmasi (faqat admin ko'radi) */}
        {isAdmin && onDeleteSong && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Haqiqatan ham "${song.title}" qo'shig'ini o'chirmoqchimisiz?`)) {
                onDeleteSong(song.id);
              }
            }}
            className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500 transition-all text-xs"
            title="Qo'shiqni o'chirish (Admin)"
          >
            <FaTrashAlt />
          </button>
        )}

        {/* Play tugmasi */}
        <button
          onClick={() => onPlay(song)}
          className={`p-3 rounded-xl transition-all shadow-sm ${
            isPlayingCurrent
              ? 'bg-indigo-600 text-white shadow-indigo-500/25'
              : 'bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white dark:bg-slate-700 dark:hover:bg-indigo-600 dark:text-slate-200'
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
