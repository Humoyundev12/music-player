import React, { useState, useEffect } from 'react';
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
  FaLanguage,
  FaChevronDown,
  FaChevronUp,
  FaExpandAlt,
} from 'react-icons/fa';
import { resolveMediaUrl, DEFAULT_COVERS } from '../services/api';
import { useTranslate } from '../hooks/useTranslate';

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
  onOpenLyrics,
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

  const { t } = useTranslate();
  const [imageError, setImageError] = useState(false);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Vaqt o'tishi bilan matn qatorini sinxronlashtirish
  useEffect(() => {
    if (!currentSong?.lyrics || currentSong.lyrics.length === 0) {
      setActiveLyricIndex(0);
      return;
    }
    const totalLines = currentSong.lyrics.length;
    if (duration > 0 && currentTime > 0) {
      const lineDuration = duration / totalLines;
      const calculatedIndex = Math.min(
        totalLines - 1,
        Math.floor(currentTime / Math.max(1, lineDuration))
      );
      setActiveLyricIndex(calculatedIndex);
    }
  }, [currentTime, duration, currentSong]);

  if (!currentSong) return null;

  const fallbackIndex = Math.abs(Number(currentSong.id) || 0) % DEFAULT_COVERS.length;
  const coverUrl = imageError
    ? DEFAULT_COVERS[fallbackIndex]
    : resolveMediaUrl(currentSong.cover_url, 'cover', currentSong.id);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isForeign = currentSong.language && currentSong.language !== 'uz';
  const currentLyric = currentSong.lyrics && currentSong.lyrics[activeLyricIndex];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBIL MINI-PLAYER (Telefonlar uchun ixcham dock panel)  */}
      {/* ========================================================= */}
      <div className="fixed bottom-[56px] left-2 right-2 z-30 sm:hidden bg-slate-900/95 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden transition-all duration-300">
        
        {/* Progress bar (Yuqori ingichka chiziq) */}
        <div className="relative w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Jonli tarjima ko'rinishi (agar chet tili bo'lsa) */}
        {isForeign && currentLyric && (
          <div
            onClick={() => setIsMobileSheetOpen(true)}
            className="bg-amber-950/60 px-3 py-1 flex items-center justify-between text-[11px] border-b border-amber-500/20 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-amber-400 font-bold shrink-0">🇺🇿 Tarjima:</span>
              <span className="truncate text-amber-200/90 font-medium">"{currentLyric.translation}"</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold shrink-0 ml-1">Batafsil ➔</span>
          </div>
        )}

        {/* Mini player asosiy qatori */}
        <div className="flex items-center justify-between p-2 gap-2">
          
          {/* Chap: Rasm va Qo'shiq ma'lumotlari (bosinganda to'liq sheet ochiladi) */}
          <div
            onClick={() => setIsMobileSheetOpen(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer active:opacity-80"
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shrink-0 ring-1 ring-amber-500/30">
              <img
                src={coverUrl}
                alt={currentSong.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5">
                  <span className="w-0.5 bg-amber-400 h-2.5 animate-bar-1 rounded-full" />
                  <span className="w-0.5 bg-amber-300 h-3.5 animate-bar-2 rounded-full" />
                  <span className="w-0.5 bg-amber-400 h-2 animate-bar-3 rounded-full" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate leading-tight">
                {currentSong.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* O'ng: Amallar (Like, Play/Pause, Keyingi) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Like */}
            <button
              onClick={() => onToggleLike(currentSong.id)}
              className={`p-2 transition-transform active:scale-90 ${
                currentSong.liked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              {currentSong.liked ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 active:scale-90 transition-transform"
            >
              {isPlaying ? <FaPause className="text-xs" /> : <FaPlay className="text-xs ml-0.5" />}
            </button>

            {/* To'liq oynani ochish tugmasi */}
            <button
              onClick={() => setIsMobileSheetOpen(true)}
              className="p-2 text-slate-400 hover:text-white active:scale-90"
              title="Kattalashtirish"
            >
              <FaExpandAlt className="text-xs" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. MOBIL TO'LIQ PLAYER SHEET (Spotify / Apple Music uslubi) */}
      {/* ========================================================= */}
      {isMobileSheetOpen && (
        <div className="fixed inset-0 z-50 sm:hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white flex flex-col justify-between p-5 pb-8 animate-in slide-in-from-bottom duration-300">
          
          {/* Sheet Yuqori qismi (Yopish tugmasi & Sarlavha) */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileSheetOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
            >
              <FaChevronDown className="text-sm" />
            </button>
            <div className="text-center">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Hozir yangramoqda
              </span>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px] block">
                {currentSong.artist}
              </span>
            </div>
            <button
              onClick={() => onToggleLike(currentSong.id)}
              className={`p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all ${
                currentSong.liked ? 'text-rose-500' : 'text-slate-300'
              }`}
            >
              {currentSong.liked ? <FaHeart className="text-base" /> : <FaRegHeart className="text-base" />}
            </button>
          </div>

          {/* O'rta qism: Katta Cover Rasm va Sarlavha */}
          <div className="my-auto py-4 flex flex-col items-center text-center">
            <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20 ring-2 ring-amber-500/30 mb-5">
              <img
                src={coverUrl}
                alt={currentSong.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Ijro etilmoqda
                </div>
              )}
            </div>

            <h3 className="text-xl font-black text-white truncate max-w-xs mb-1">
              {currentSong.title}
            </h3>
            <p className="text-sm text-slate-400 font-medium mb-3">
              {currentSong.artist}
            </p>

            {/* Janr va Til belgilari */}
            <div className="flex items-center gap-2 mb-4">
              {currentSong.genre && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {currentSong.genre}
                </span>
              )}
              {currentSong.language && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                  {currentSong.language === 'ru' ? '🇷🇺 Ruscha' : currentSong.language === 'en' ? '🇬🇧 Inglizcha' : '🇺🇿 O\'zbekcha'}
                </span>
              )}
            </div>

            {/* Jonli Tarjima & Matn Kartochkasi */}
            {isForeign && currentLyric && (
              <div
                onClick={() => onOpenLyrics(currentSong)}
                className="w-full max-w-sm rounded-2xl bg-amber-950/40 border border-amber-500/40 p-3 text-left shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <FaLanguage className="text-xs" /> O'zbekcha tarjima
                  </span>
                  <span className="text-[10px] text-amber-300 underline font-semibold">
                    To'liq matn
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic mb-1 truncate">
                  "{currentLyric.original}"
                </p>
                <p className="text-xs font-bold text-amber-300 leading-snug">
                  👉 "{currentLyric.translation}"
                </p>
              </div>
            )}
          </div>

          {/* Pastki qism: Progress va Boshqaruv tugmalari */}
          <div className="space-y-4">
            
            {/* Progress Slider */}
            <div>
              <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime || 0}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Katta Boshqaruv tugmalari */}
            <div className="flex items-center justify-between px-4">
              
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-full transition-all ${
                  isShuffle ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                <FaRandom className="text-base" />
              </button>

              {/* Oldingi */}
              <button
                onClick={() => prevSong(songsList)}
                className="p-3 text-white hover:text-amber-400 active:scale-90 transition-transform"
              >
                <FaStepBackward className="text-xl" />
              </button>

              {/* Katta Play/Pause tugmasi */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-xl shadow-amber-500/40 active:scale-95 transition-all"
              >
                {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-1" />}
              </button>

              {/* Keyingi */}
              <button
                onClick={() => nextSong(songsList)}
                className="p-3 text-white hover:text-amber-400 active:scale-90 transition-transform"
              >
                <FaStepForward className="text-xl" />
              </button>

              {/* Repeat */}
              <button
                onClick={toggleLoop}
                className={`p-2.5 rounded-full transition-all ${
                  isLoop ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                <FaRedo className="text-base" />
              </button>

            </div>

            {/* Qo'shimcha tugmalar (Matn, Izohlar) */}
            <div className="flex items-center justify-around pt-2 border-t border-slate-800">
              <button
                onClick={() => onOpenLyrics(currentSong)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-amber-300"
              >
                <FaLanguage className="text-sm" />
                <span>Matn va Tarjima</span>
              </button>

              <button
                onClick={() => onOpenComment(currentSong)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-300"
              >
                <FaRegComment className="text-sm" />
                <span>Izohlar {commentCount > 0 ? `(${commentCount})` : ''}</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DESKTOP AUDIO PLAYER (Kompyuter va planshetlar uchun)   */}
      {/* ========================================================= */}
      <div className="hidden sm:block fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-all">
        
        {/* Ruscha / Chet tili qo'shiqlari uchun jonli subtitr va o'zbekcha tarjima sahnasi */}
        {isForeign && currentLyric && (
          <div className="bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 text-white border-b border-amber-500/30 px-4 py-2 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shrink-0 flex items-center gap-1 shadow-sm">
                  <FaLanguage /> 
                  {currentSong.language === 'ru' ? '🇷🇺 Ruscha' : '🇬🇧 Inglizcha'} ➔ 🇺🇿 O'zbekcha
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    "{currentLyric.original}"
                  </p>
                  <p className="text-[11px] font-semibold text-amber-300 truncate leading-tight italic mt-0.5">
                    👉 Tarjimasi: "{currentLyric.translation}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenLyrics(currentSong)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-[11px] font-bold text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span>To'liq tarjima</span>
              </button>

            </div>
          </div>
        )}

        {/* Audio xatolik xabari */}
        {audioError && (
          <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-4 py-1 text-center font-medium border-b border-amber-500/20">
            ⚠️ {audioError}
          </div>
        )}

        {/* Progress slider */}
        <div className="relative w-full h-1 group cursor-pointer bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 relative transition-all"
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

        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between gap-4">
          
          {/* Chap qism: Rasm, nom, ijrochi va like */}
          <div className="flex items-center gap-3 min-w-0 max-w-[32%]">
            <img
              src={coverUrl}
              alt={currentSong.title}
              onError={() => setImageError(true)}
              className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0 border border-slate-200 dark:border-slate-800 ring-1 ring-amber-500/30"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentSong.title}
                </h4>
                {isForeign && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0">
                    {currentSong.language === 'ru' ? '🇷🇺 Rus' : '🇬🇧 Ing'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentSong.artist}
              </p>
            </div>

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
            <div className="flex items-center gap-4 mb-1">
              
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full text-xs sm:text-sm transition-all ${
                  isShuffle
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Aralashtirish (Shuffle)"
              >
                <FaRandom />
              </button>

              {/* Oldingi */}
              <button
                onClick={() => prevSong(songsList)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all active:scale-90"
                title="Oldingi"
              >
                <FaStepBackward className="text-sm" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
                title={isPlaying ? 'Pauza' : 'Ijro'}
              >
                {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm ml-0.5" />}
              </button>

              {/* Keyingi */}
              <button
                onClick={() => nextSong(songsList)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all active:scale-90"
                title="Keyingi"
              >
                <FaStepForward className="text-sm" />
              </button>

              {/* Loop */}
              <button
                onClick={toggleLoop}
                className={`p-2 rounded-full text-xs sm:text-sm transition-all ${
                  isLoop
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Takrorlash (Repeat)"
              >
                <FaRedo />
              </button>

            </div>

            {/* Vaqt ko'rsatkichi */}
            <div className="flex items-center gap-2 w-full text-[11px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>

          </div>

          {/* O'ng qism: Matn va Tarjima, Izohlar va Ovoz */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Matn va Tarjima tugmasi */}
            <button
              onClick={() => onOpenLyrics(currentSong)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isForeign
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  : 'text-slate-500 hover:text-amber-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Qo'shiq matni va o'zbekcha tarjimasini ko'rish"
            >
              <FaLanguage className="text-base" />
              <span>{isForeign ? "Tarjimasi" : "Matni"}</span>
            </button>

            {/* Izohlar tugmasi */}
            <button
              onClick={() => onOpenComment(currentSong)}
              className="flex items-center gap-1.5 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Izohlarni ochish"
            >
              <FaRegComment className="text-base" />
              <span className="text-xs font-semibold">
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
                className="w-16 accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
