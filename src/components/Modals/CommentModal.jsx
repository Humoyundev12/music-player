import React, { useState } from 'react';
import { FaTimes, FaComment, FaPaperPlane } from 'react-icons/fa';
import { resolveMediaUrl, DEFAULT_COVERS } from '../../services/api';

// Vaqtni chiroyli ko'rsatish
const formatCommentDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('uz-UZ', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Yaqinda';
  }
};

const CommentModal = ({ isOpen, onClose, song, comments = [], onAddComment }) => {
  const [author, setAuthor] = useState(() => localStorage.getItem('music_app_user_name') || '');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !song) return null;

  const fallbackIndex = Math.abs(Number(song.id) || 0) % DEFAULT_COVERS.length;
  const coverUrl = resolveMediaUrl(song.cover_url, 'cover', song.id) || DEFAULT_COVERS[fallbackIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    const authorName = author.trim() || 'Musiqa muxlisi';

    // Foydalanuvchi ismini keyingi safar uchun saqlab qo'yamiz
    localStorage.setItem('music_app_user_name', authorName);

    onAddComment(song.id, {
      author: authorName,
      text: text.trim(),
    });

    setText('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal tepa qismi */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={coverUrl}
              alt={song.title}
              className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {song.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {song.artist}
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

        {/* Fikrlar ro'yxati (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider pb-1">
            <span>Fikrlar ({comments.length})</span>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <FaComment className="text-xl" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Hozircha hech qanday izoh yo'q
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Ushbu musiqa haqida birinchi bo'lib o'z fikringizni bildiring!
              </p>
            </div>
          ) : (
            comments.map((comm) => (
              <div
                key={comm.id}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {comm.author ? comm.author.slice(0, 1).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {comm.author}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatCommentDate(comm.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                    {comm.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Izoh yozish formasi */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Ismingiz (ixtiyoriy)..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Fikringizni qoldiring..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubmitting || !text.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-1.5 shadow-md shadow-indigo-500/25 disabled:opacity-50 active:scale-95 transition-all"
              >
                <FaPaperPlane className="text-xs" />
                <span className="hidden sm:inline">Yozish</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
