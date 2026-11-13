import React from 'react';

const GenreFilter = ({ genres = [], selectedGenre, onSelectGenre }) => {
  if (!genres || genres.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {genres.map((genre) => {
        const isSelected = selectedGenre.toLowerCase() === genre.toLowerCase();
        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {genre === 'All' ? 'Barchasi' : genre}
          </button>
        );
      })}
    </div>
  );
};

export default GenreFilter;
