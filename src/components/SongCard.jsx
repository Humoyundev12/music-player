import React, { useState } from 'react';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaRegComment, FaHeadphones } from 'react-icons/fa';
import { resolveMediaUrl, DEFAULT_COVERS } from '../services/api';

const SongCard = ({
  song,
  isPlayingCurrent,
  isCurrent,
  onPlay,
  onToggleLike,
  onOpenComment,
  commentCount = 0,
}) => {
  const [imageError, setImageError] = useState(false);

  // Cover image manzilini aniqlash
  const fallbackIndex = Math.abs(Number(song.id) || 0) % DEFAULT_COVERS.length;
  const coverUrl = imageError
    ? DEFAULT_COVERS[fallbackIndex]
    : resolveMediaUrl(song.cover_url, 'cover', song.id);

  return (
    <div
      className={`group relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${
        isCurrent
          ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
          : 'bg-white dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Rasm va Play overlay */}
      <div className="relative w-full sm:w-20 h-40 sm:h-20 shrink-0 rounded-xl overflow-hidden shadow-sm">
        <img
          src={coverUrl}
          alt={song.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Tinglanayotganlik vizualizatori (Equalizer) */}
        {isPlayingCurrent && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-1">
            <span className="w-1 bg-indigo-400 rounded-full animate-bar-1 h-3"></span>
            <span className="w-1 bg-pink-400 rounded-full animate-bar-2 h-4"></span>
            <span className="w-1 bg-purple-400 rounded-full animate-bar-3 h-2"></span>
            <span className="w-1 bg-indigo-400 rounded-full animate-bar-4 h-3.5"></span>
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
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 active:scale-95 transition-all">
            {isPlayingCurrent ? <FaPause className="text-sm" /> : <FaPlay className="text-sm ml-0.5" />}
          </div>
        </button>
      </div>

      {/* Musiqa ma'lumotlari */}
      <div className="flex-1 min-w-0 w-full text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
            {song.title}
          </h3>
          {song.genre && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
              {song.genre}
            </span>
          )}
          {song.isLocal && (
            <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              Yangi
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2 font-medium">
          {song.artist}
        </p>

        {/* Play soni va vaqt */}
        <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <FaHeadphones className="text-[11px]" />
            {song.plays || 0} tinglandi
          </span>
        </div>
      </div>

      {/* Amallar: Like, Izoh (Comment), Play */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        
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

        {/* Comment (Izohlar) tugmasi - Modalni ochadi */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComment(song);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all"
          title="Fikrlar va izohlarni ko'rish"
        >
          <FaRegComment className="text-sm" />
          <span>{commentCount > 0 ? commentCount : "Izoh"}</span>
        </button>

        {/* Bosh Play tugmasi (faqat o'ng tomonda ko'rsatish) */}
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
