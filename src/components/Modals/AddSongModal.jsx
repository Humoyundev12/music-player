import React, { useState } from 'react';
import { FaTimes, FaMusic, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { DEFAULT_COVERS } from '../../services/api';

// Namunaviy test audiolari (foydalanuvchi tezda sinab ko'rishi uchun)
const SAMPLE_AUDIOS = [
  { label: 'SoundHelix 1 (Elektron)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { label: 'SoundHelix 2 (Gitara)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { label: 'SoundHelix 3 (Sokin)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

const GENRE_OPTIONS = ['Pop', 'Lo-Fi', 'Electronic', 'Rock', 'Jazz', 'Ethno', 'Chill', 'Hip-Hop', 'Klassik'];

const AddSongModal = ({ isOpen, onClose, onAddSong }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Pop');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState(DEFAULT_COVERS[0]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) {
      setErrorMsg("Iltimos, qo'shiq nomi va ijrochisini kiriting!");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await onAddSong({
        title: title.trim(),
        artist: artist.trim(),
        genre: genre || 'Pop',
        audio_url: audioUrl.trim() || SAMPLE_AUDIOS[0].url,
        cover_url: coverUrl.trim() || DEFAULT_COVERS[0],
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
        // Reset form
        setTitle('');
        setArtist('');
        setAudioUrl('');
      }, 1000);
    } catch (err) {
      setErrorMsg("Qo'shiqni qo'shishda xatolik yuz berdi: " + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal sarlavhasi */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FaMusic className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Yangi musiqa qo'shish
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                O'zingiz yoqtirgan qo'shiq ma'lumotlarini kiriting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal formasi */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
              <FaExclamationCircle className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
              <FaCheck className="shrink-0" />
              <span>Musiqa muvaffaqiyatli qo'shildi!</span>
            </div>
          )}

          {/* Qo'shiq nomi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Qo'shiq nomi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: Yomg'ir sadosi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Ijrochi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ijrochi / Xonanda <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: Tohir Sodiqov"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Janr tanlash */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Janr
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
            >
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Audio URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Audio havola (MP3 URL)
              </label>
              <span className="text-[11px] text-slate-400">Namunaviy MP3 tanlash:</span>
            </div>
            <input
              type="url"
              placeholder="https://example.com/audio.mp3"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
            {/* Tezkor namunaviy tugmalar */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SAMPLE_AUDIOS.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAudioUrl(s.url)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
                >
                  ⚡ {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Rasm URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Muqova rasmi (Cover URL)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />

            {/* Namunaviy cover rasmlar */}
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
              {DEFAULT_COVERS.slice(0, 5).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Cover ${i}`}
                  onClick={() => setCoverUrl(img)}
                  className={`w-10 h-10 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform border-2 ${
                    coverUrl === img ? 'border-indigo-500 shadow-md' : 'border-transparent opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tugmalar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/25 active:scale-95 disabled:opacity-50 transition-all"
            >
              {loading ? "Yuklanmoqda..." : "Qo'shiqni qo'shish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongModal;
