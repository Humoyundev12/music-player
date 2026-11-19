import React from 'react';
import { FaLanguage, FaFire } from 'react-icons/fa';
import { useTranslate } from '../hooks/useTranslate';

const GenreFilter = ({
  genres = [],
  selectedGenre,
  onSelectGenre,
  selectedLanguage,
  onSelectLanguage,
  showOnlyTrending,
  onToggleTrending,
}) => {
  const { t } = useTranslate();

  const langFilters = [
    { id: 'All', label: 'Barcha tillar' },
    { id: 'hasTranslation', label: '🌐 Tarjimasi bor (Ruscha/Xorij)', icon: true },
    { id: 'ru', label: '🇷🇺 Ruscha' },
    { id: 'en', label: '🇬🇧 Inglizcha' },
    { id: 'uz', label: '🇺🇿 O\'zbekcha' },
  ];

  return (
    <div className="space-y-2">
      {/* Tillar va Trend filtri */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-1 px-1">
        
        {/* 🔥 Trenddagi qo'shiqlar tugmasi */}
        {onToggleTrending && (
          <button
            onClick={onToggleTrending}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 active:scale-95 ${
              showOnlyTrending
                ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 text-white border-transparent shadow-lg shadow-rose-500/30 ring-2 ring-orange-400 scale-[1.02]'
                : 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 border-orange-200 dark:border-orange-800/60'
            }`}
          >
            <FaFire className={showOnlyTrending ? 'text-amber-200 animate-bounce' : 'text-orange-500'} />
            <span>🔥 Trenddagi qo'shiqlar</span>
          </button>
        )}

        {langFilters.map((lf) => {
          const isSelected = selectedLanguage === lf.id;
          return (
            <button
              key={lf.id}
              onClick={() => onSelectLanguage(lf.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent shadow-md shadow-amber-500/25 scale-[1.02]'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
              }`}
            >
              {lf.label}
            </button>
          );
        })}
      </div>

      {/* Janrlar filtri */}
      {genres && genres.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-1 px-1">
          {genres.map((genre) => {
            const isSelected = selectedGenre.toLowerCase() === genre.toLowerCase();
            return (
              <button
                key={genre}
                onClick={() => onSelectGenre(genre)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {genre === 'All' ? t('all_genres', 'Barchasi') : genre}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GenreFilter;
