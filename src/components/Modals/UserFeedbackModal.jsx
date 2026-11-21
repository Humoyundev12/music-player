import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaCommentDots,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaUser,
  FaShieldAlt,
  FaMusic,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { getFeedbacks, sendFeedback } from '../../services/feedbackService';

const UserFeedbackModal = ({ isOpen, onClose }) => {
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'my_feedbacks'
  const [subject, setSubject] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [feedbacksList, setFeedbacksList] = useState([]);

  const loadFeedbacks = () => {
    const all = getFeedbacks();
    // Foydalanuvchining o'z fikrlari yoki barcha fikrlar
    const my = all.filter(
      (f) => f.userId === currentUser?.username || f.userName === currentUser?.name
    );
    setFeedbacksList(my.length > 0 ? my : all.slice(0, 5));
  };

  useEffect(() => {
    if (isOpen) {
      loadFeedbacks();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    const handleUpdate = () => loadFeedbacks();
    window.addEventListener('hb_feedback_updated', handleUpdate);
    return () => window.removeEventListener('hb_feedback_updated', handleUpdate);
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!message.trim()) {
      setErrorMsg("Iltimos, o'z fikringiz yoki qo'shiq taklifingizni yozing!");
      return;
    }

    setLoading(true);

    const fullSubject = subject.trim()
      ? subject.trim()
      : songArtist.trim()
      ? `Qo'shiq taklifi: ${songArtist.trim()}`
      : "Foydalanuvchi fikri";

    const fullMessage = songArtist.trim()
      ? `Qo'shiq / Ijrochi: ${songArtist.trim()}\nIzoh: ${message.trim()}`
      : message.trim();

    setTimeout(() => {
      sendFeedback({
        userId: currentUser?.username || 'Mehmon',
        userName: currentUser?.name || currentUser?.displayName || 'Foydalanuvchi',
        subject: fullSubject,
        message: fullMessage,
      });

      setLoading(false);
      setSuccessMsg("Fikringiz muvaffaqiyatli adminga yuborildi! Admin tez orada javob qaytaradi.");
      setSubject('');
      setSongArtist('');
      setMessage('');
      loadFeedbacks();
      setTimeout(() => {
        setActiveTab('my_feedbacks');
        setSuccessMsg('');
      }, 1500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="relative w-full max-w-xl bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 flex flex-col max-h-[90vh] overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <FaCommentDots className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Fikrlar va Qo'shiq taklifi
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Fikringizni yozing, bu to'g'ridan-to'g'ri Adminga boradi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex px-6 pt-3 border-b border-slate-800 bg-slate-900/40 gap-3">
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'new'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FaPaperPlane className="text-[11px]" />
            <span>Fikr yuborish</span>
          </button>

          <button
            onClick={() => setActiveTab('my_feedbacks')}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'my_feedbacks'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FaClock className="text-[11px]" />
            <span>Fikrlarim & Admin javoblari</span>
            {feedbacksList.some((f) => f.status === 'replied') && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'new' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 text-rose-300 bg-rose-500/10 rounded-2xl border border-rose-500/30">
                  <FaExclamationCircle className="shrink-0 text-sm text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 p-3 text-emerald-300 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                  <FaCheckCircle className="shrink-0 text-sm text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaMusic className="text-amber-500 text-[11px]" />
                  <span>Qaysi qo'shiq yoki mavzu haqida? (Ixtiyoriy)</span>
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Konsta - O'tadi kunlar yoki Sayt dizayni haqida..."
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaCommentDots className="text-amber-500 text-[11px]" />
                  <span>Fikringiz, taklifingiz yoki istagingiz:</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Fikringizni erkin yozing. Masalan: Shu qo'shiqni qo'shib bering, tarjimasi bo'lsin, yoki sayt haqida taklif..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-xs resize-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                <FaShieldAlt className="text-amber-400 shrink-0 text-xs" />
                <span>
                  Xabaringiz Bosh Administrator (Humoyun) paneliga tushadi va admin javob qaytargach shu yerda ko'rinadi.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Adminga yuborish</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'my_feedbacks' && (
            <div className="space-y-3">
              {feedbacksList.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <FaCommentDots className="text-3xl mx-auto mb-2 opacity-40 text-amber-500" />
                  <p className="font-bold">Hozircha fikrlar yo'q</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Birinchi bo'lib fikr yoki qo'shiq taklif qiling!
                  </p>
                </div>
              ) : (
                feedbacksList.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs flex items-center gap-1.5">
                        <FaUser className="text-amber-500 text-[10px]" />
                        <span>{fb.userName}</span>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-slate-300 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <p className="font-semibold text-amber-400/90 text-[11px] mb-1">
                        {fb.subject}
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">{fb.message}</p>
                    </div>

                    {/* Admin Reply */}
                    {fb.adminReply ? (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <FaShieldAlt className="text-amber-400" />
                            <span>Bosh Administrator (Humoyun) javobi:</span>
                          </span>
                          <span className="text-[10px] text-amber-400/70">
                            {fb.repliedAt ? new Date(fb.repliedAt).toLocaleDateString() : 'Javob berildi'}
                          </span>
                        </div>
                        <p className="text-slate-200 text-xs leading-relaxed pt-0.5">
                          {fb.adminReply}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-900/30">
                        <FaClock className="text-[10px] animate-spin" />
                        <span>Admin ko'rib chiqmoqda (tez orada javob qaytaradi)...</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFeedbackModal;
