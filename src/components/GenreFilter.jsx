import React from 'react';
import { FaFire, FaGlobe } from 'react-icons/fa';
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
    { id: 'hasTranslation', label: 'Tarjimasi bor (Ruscha/Xorij)' },
    { id: 'ru', label: 'Ruscha' },
    { id: 'en', label: 'Inglizcha' },
    { id: 'uz', label: "O'zbekcha" },
  ];

  return (
    <div className="space-y-2 select-none">
      {/* Tillar va Trend filtri */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-1 px-1">
        
        {/* Trenddagi qo'shiqlar tugmasi */}
        {onToggleTrending && (
          <button
            onClick={onToggleTrending}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 active:scale-95 ${
              showOnlyTrending
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500 shadow-md shadow-orange-500/20'
                : 'bg-slate-900/80 text-amber-400 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <FaFire className={showOnlyTrending ? 'text-white' : 'text-amber-500 text-xs'} />
            <span>Trenddagilar</span>
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
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-black'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
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
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 border ${
                  isSelected
                    ? 'bg-white text-slate-950 border-white font-bold shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800/80'
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
