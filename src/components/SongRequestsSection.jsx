import React, { useState, useEffect } from 'react';
import {
  FaMusic,
  FaHeart,
  FaThumbsUp,
  FaCommentDots,
  FaPaperPlane,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaUser,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import {
  getSongRequests,
  addSongRequest,
  toggleVoteSongRequest,
  updateSongRequestStatus,
} from '../services/feedbackService';

const SongRequestsSection = () => {
  const { currentUser, isAdmin } = useAuth();

  const [requests, setRequests] = useState([]);
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [comment, setComment] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Admin inline reply state
  const [replyingId, setReplyingId] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const loadRequests = () => {
    setRequests(getSongRequests());
  };

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener('hb_song_requests_updated', handleUpdate);
    return () => window.removeEventListener('hb_song_requests_updated', handleUpdate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!songTitle.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      addSongRequest({
        userName: currentUser?.name || currentUser?.displayName || 'Musiqa muxlisi',
        songTitle: songTitle.trim(),
        artist: artist.trim() || "Noma'lum ijrochi",
        comment: comment.trim(),
      });

      setSongTitle('');
      setArtist('');
      setComment('');
      setSubmitting(false);
      setSuccessMsg("Taklifingiz qabul qilindi! Boshqalar ham ovoz berishlari mumkin.");
      loadRequests();
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 300);
  };

  const handleVote = (reqId) => {
    const voterName = currentUser?.username || currentUser?.name || 'guest';
    toggleVoteSongRequest(reqId, voterName);
    loadRequests();
  };

  const handleAdminReplySubmit = (reqId) => {
    if (!adminNoteInput.trim()) return;
    updateSongRequestStatus(reqId, 'completed', adminNoteInput.trim());
    setReplyingId(null);
    setAdminNoteInput('');
    loadRequests();
  };

  return (
    <section className="mt-12 mb-16 rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-8 text-slate-100 shadow-xl relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <FaMusic className="text-base" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              Qaysi musiqani qo'shishimizni xohlaysiz?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            O'zingiz sevgan musiqani yozib qoldiring. Eng ko'p so'ralgan treklar kutubxonaga qo'shiladi!
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-amber-400">
            {requests.length} ta taklif
          </span>
        </div>
      </div>

      {/* Suggestion Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <FaCommentDots className="text-amber-500" />
          <span>Yangi musiqa taklif qilish:</span>
        </h3>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <FaCheckCircle className="shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Qo'shiq nomi (masalan: Mockingbird)"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition-all"
          />

          <input
            type="text"
            placeholder="Ijrochi (masalan: Eminem yoki Konsta)"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Qo'shimcha izoh (masalan: O'zbekcha tarjimasi bilan bo'lsa zo'r bo'lardi)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition-all"
          />

          <button
            type="submit"
            disabled={submitting || !songTitle.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <FaPaperPlane className="text-[11px]" />
            <span className="hidden sm:inline">Yuborish</span>
          </button>
        </div>
      </form>

      {/* Requests List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Foydalanuvchilarning takliflari:
        </h3>

        {requests.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            Hozircha hech kim taklif qoldirmadi. Birinchi bo'lib taklif qiling!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {requests.map((req) => {
              const currentVoter = currentUser?.username || currentUser?.name || 'guest';
              const hasVoted = (req.votedBy || []).includes(currentVoter);

              return (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex flex-col justify-between gap-2.5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                        <FaMusic className="text-amber-500 text-xs shrink-0" />
                        <span>{req.songTitle}</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-medium truncate">
                        {req.artist}
                      </p>
                    </div>

                    {/* Upvote button */}
                    <button
                      type="button"
                      onClick={() => handleVote(req.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        hasVoted
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/80'
                      }`}
                      title="Ovoz berish"
                    >
                      <FaThumbsUp className={`text-xs ${hasVoted ? 'text-white' : 'text-amber-400'}`} />
                      <span>{req.votes || 0}</span>
                    </button>
                  </div>

                  {req.comment && (
                    <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800 italic">
                      "{req.comment}"
                    </p>
                  )}

                  {/* Status & Admin Note */}
                  <div className="pt-1 flex flex-col gap-1.5 border-t border-slate-800/60 text-[10px]">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center gap-1">
                        <FaUser className="text-[9px]" />
                        <span>{req.userName}</span>
                      </span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>

                    {req.adminNote && (
                      <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 flex items-center gap-1.5 text-[11px]">
                        <FaShieldAlt className="text-emerald-400 shrink-0 text-xs" />
                        <span><b>Admin javobi:</b> {req.adminNote}</span>
                      </div>
                    )}

                    {/* Admin quick reply toggle if logged in as Admin */}
                    {isAdmin && !req.adminNote && (
                      <div className="pt-1">
                        {replyingId === req.id ? (
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="Admin javobi (masalan: Qo'shildi!)..."
                              value={adminNoteInput}
                              onChange={(e) => setAdminNoteInput(e.target.value)}
                              className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdminReplySubmit(req.id)}
                              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                            >
                              Javob
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplyingId(null)}
                              className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingId(req.id);
                              setAdminNoteInput("Qo'shildi! Asosiy ro'yxatda tinglashingiz mumkin.");
                            }}
                            className="text-[10px] text-amber-400 hover:underline font-bold flex items-center gap-1"
                          >
                            <FaShieldAlt /> Admindan javob qaytarish
                          </button>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
};

export default SongRequestsSection;
