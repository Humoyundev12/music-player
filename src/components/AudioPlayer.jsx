import React, { useState } from 'react';
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaHeart,
  FaRegHeart,
  FaVolumeUp,
  FaVolumeMute,
  FaRandom,
  FaRedo,
  FaRegComment,
} from 'react-icons/fa';
import { resolveMediaUrl, DEFAULT_COVERS } from '../services/api';

// Vaqtni MM:SS ko'rinishida formatlash
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const AudioPlayer = ({
  player,
  songsList = [],
  onToggleLike,
  onOpenComment,
  commentCount = 0,
}) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoop,
    isShuffle,
    audioError,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    nextSong,
    prevSong,
  } = player;

  const [imageError, setImageError] = useState(false);

  if (!currentSong) return null;

  const fallbackIndex = Math.abs(Number(currentSong.id) || 0) % DEFAULT_COVERS.length;
  const coverUrl = imageError
    ? DEFAULT_COVERS[fallbackIndex]
    : resolveMediaUrl(currentSong.cover_url, 'cover', currentSong.id);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-all">
      
      {/* Audio xatolik xabari */}
      {audioError && (
        <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-4 py-1 text-center font-medium border-b border-amber-500/20">
          ⚠️ {audioError}
        </div>
      )}

      {/* Progress slider (Mobil uchun tepada nozik ko'rsatish) */}
      <div className="relative w-full h-1 group cursor-pointer bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 relative transition-all"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-opacity" />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime || 0}
          onChange={(e) => seek(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Chap qism: Musiqa rasmi, nomi, ijrochi va like */}
        <div className="flex items-center gap-3 min-w-0 max-w-[40%] sm:max-w-[30%]">
          <img
            src={coverUrl}
            alt={currentSong.title}
            onError={() => setImageError(true)}
            className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentSong.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {currentSong.artist}
            </p>
          </div>

          {/* Like tugmasi */}
          <button
            onClick={() => onToggleLike(currentSong.id)}
            className={`p-2 rounded-full transition-all shrink-0 ${
              currentSong.liked
                ? 'text-rose-500 hover:scale-110'
                : 'text-slate-400 hover:text-rose-500'
            }`}
            title="Like"
          >
            {currentSong.liked ? <FaHeart className="text-base" /> : <FaRegHeart className="text-base" />}
          </button>
        </div>

        {/* Markaziy qism: Boshqaruv tugmalari va vaqt chizig'i */}
        <div className="flex-1 max-w-xl flex flex-col items-center">
          
          {/* Boshqaruv tugmalari */}
          <div className="flex items-center gap-2 sm:gap-5 mb-1">
            
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full text-xs sm:text-sm transition-all ${
                isShuffle
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Aralashtirish (Shuffle)"
            >
              <FaRandom />
            </button>

            {/* Oldingi */}
            <button
              onClick={() => prevSong(songsList)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
              title="Oldingi"
            >
              <FaStepBackward className="text-sm" />
            </button>

            {/* Play / Pause (Katta dumaloq tugma) */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
              title={isPlaying ? 'Pauza' : 'Ijro'}
            >
              {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm ml-0.5" />}
            </button>

            {/* Keyingi */}
            <button
              onClick={() => nextSong(songsList)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
              title="Keyingi"
            >
              <FaStepForward className="text-sm" />
            </button>

            {/* Loop */}
            <button
              onClick={toggleLoop}
              className={`p-2 rounded-full text-xs sm:text-sm transition-all ${
                isLoop
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Takrorlash (Repeat)"
            >
              <FaRedo />
            </button>

          </div>

          {/* Vaqt ko'rsatkichi (desktop) */}
          <div className="hidden sm:flex items-center gap-2 w-full text-[11px] font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>

        </div>

        {/* O'ng qism: Izohlar va Ovoz (Volume) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Joriy qo'shiq uchun izohlar tugmasi */}
          <button
            onClick={() => onOpenComment(currentSong)}
            className="flex items-center gap-1.5 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Izohlarni ochish"
          >
            <FaRegComment className="text-base" />
            <span className="hidden md:inline text-xs font-semibold">
              {commentCount > 0 ? commentCount : ''}
            </span>
          </button>

          {/* Ovoz sozlamasi */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
            >
              {isMuted || volume === 0 ? <FaVolumeMute className="text-base" /> : <FaVolumeUp className="text-base" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default AudioPlayer;
