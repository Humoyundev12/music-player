import React, { useState } from 'react';
import { FaTimes, FaLanguage, FaCopy, FaCheck, FaVolumeUp } from 'react-icons/fa';
import { resolveMediaUrl, DEFAULT_COVERS } from '../../services/api';
import { useTranslate } from '../../hooks/useTranslate';

const LyricsModal = ({ isOpen, onClose, song, isPlaying, onTogglePlay }) => {
  const { t } = useTranslate();
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('both'); // 'both', 'translation', 'original'

  if (!isOpen || !song) return null;

  const fallbackIndex = Math.abs(Number(song.id) || 0) % DEFAULT_COVERS.length;
  const coverUrl = resolveMediaUrl(song.cover_url, 'cover', song.id) || DEFAULT_COVERS[fallbackIndex];

  // Til nomi va bayrog'ini aniqlash
  const getLanguageDetails = (langCode) => {
    switch (langCode) {
      case 'ru':
        return { label: "Ruscha", flag: "🇷🇺", target: "O'zbekcha" };
      case 'en':
        return { label: "Inglizcha", flag: "🇬🇧", target: "O'zbekcha" };
      case 'es':
        return { label: "Ispancha", flag: "🇪🇸", target: "O'zbekcha" };
      case 'tr':
        return { label: "Turkcha", flag: "🇹🇷", target: "O'zbekcha" };
      default:
        return { label: "O'zbekcha", flag: "🇺🇿", target: "O'zbekcha" };
    }
  };

  const langInfo = getLanguageDetails(song.language);
  const isForeign = song.language && song.language !== 'uz';

  const handleCopy = () => {
    if (!song.lyrics || song.lyrics.length === 0) return;
    const text = song.lyrics
      .map((l) => `${l.original}\n👉 Tarjimasi: ${l.translation}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Tepa qismi: Qo'shiq info */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={coverUrl}
              alt={song.title}
              className="w-14 h-14 rounded-2xl object-cover shadow-md shrink-0 border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                  {song.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center gap-1 shrink-0">
                  {langInfo.flag} {langInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                {song.artist} • {song.genre}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
              title="Matn va tarjimani nusxalash"
            >
              {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* E'lon / Banner: Ruscha yoki chet tilidagi qo'shiqlar uchun */}
        {isForeign && (
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-indigo-500/20 px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
              <FaLanguage className="text-base shrink-0" />
              <span>
                {langInfo.flag} {langInfo.label} tilidagi qo'shiq — Pastida o'zbekcha tarjimasi keltirilgan:
              </span>
            </div>

            {/* Ko'rinish rejimi: Ikkalasi / Faqat tarjima / Faqat asl matn */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                onClick={() => setViewMode('both')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  viewMode === 'both'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                }`}
              >
                Ikkala til
              </button>
              <button
                onClick={() => setViewMode('translation')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  viewMode === 'translation'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                }`}
              >
                O'zbekcha
              </button>
              <button
                onClick={() => setViewMode('original')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  viewMode === 'original'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                }`}
              >
                Asl matn
              </button>
            </div>
          </div>
        )}

        {/* Qo'shiq ma'nosi / Tavsifi (agar bor bo'lsa) */}
        {song.summary && (
          <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 italic border-b border-slate-100 dark:border-slate-800">
            💡 {song.summary}
          </div>
        )}

        {/* Matn va Tarjima ro'yxati (Asosiy maydon) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!song.lyrics || song.lyrics.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm">Ushbu musiqa uchun matn hali kiritilmagan.</p>
            </div>
          ) : (
            song.lyrics.map((line, index) => {
              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all space-y-2 group"
                >
                  {/* Asl matn */}
                  {(viewMode === 'both' || viewMode === 'original') && (
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-500 mt-0.5 select-none shrink-0 w-5">
                        {index + 1}.
                      </span>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-wide leading-relaxed">
                        {line.original}
                      </p>
                    </div>
                  )}

                  {/* O'zbekcha tarjimasi (pastiga chiqib turishi) */}
                  {(viewMode === 'both' || viewMode === 'translation') && isForeign && line.translation && (
                    <div className="ml-7 pl-3 border-l-2 border-emerald-500 dark:border-emerald-400 py-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                        <span>🇺🇿 O'zbekcha tarjimasi:</span>
                      </div>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 leading-relaxed italic">
                        "{line.translation}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal pastki qismi: Holat va Yopish */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FaVolumeUp className="text-indigo-500" />
            <span>
              {isPlaying ? "Musiqa ijro etilmoqda" : "Musiqa to'xtatilgan"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            {t('close', 'Yopish')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LyricsModal;
