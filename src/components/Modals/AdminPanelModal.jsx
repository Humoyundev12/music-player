import React, { useState } from 'react';
import {
  FaTimes,
  FaCrown,
  FaPlus,
  FaTrashAlt,
  FaMusic,
  FaLanguage,
  FaExclamationTriangle,
  FaSearch,
  FaSignInAlt,
  FaUserCheck,
  FaUserClock,
  FaEnvelope,
  FaChartLine,
  FaKey,
  FaCheck,
  FaHistory,
  FaUserCircle,
  FaHeadphones,
  FaHeart,
  FaCamera,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTranslate } from '../../hooks/useTranslate';
import { resolveMediaUrl, DEFAULT_COVERS } from '../../services/api';
import { clearStoredActivities } from '../../services/activityService';
import { getFeedbacks, replyToFeedback } from '../../services/feedbackService';

const AdminPanelModal = ({
  isOpen,
  onClose,
  songs = [],
  onDeleteSong,
  onOpenAddModal,
  onOpenLogin,
}) => {
  const {
    isAdmin,
    currentUser,
    requests,
    approveRequest,
    activities,
    emails,
  } = useAuth();
  const { t } = useTranslate();

  const [activeTab, setActiveTab] = useState('feedbacks'); // 'feedbacks' | 'requests' | 'monitoring' | 'songs' | 'emails'
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('ALL'); // 'ALL' | 'AUTH' | 'SEARCH' | 'PROFILE' | 'MUSIC'
  const [deletedSuccess, setDeletedSuccess] = useState('');

  // Foydalanuvchilar fikrlari va javoblar
  const [feedbacksList, setFeedbacksList] = useState(() => getFeedbacks());
  const [replyInputs, setReplyInputs] = useState({});

  const reloadFeedbacks = () => {
    setFeedbacksList(getFeedbacks());
  };

  const handleSendFeedbackReply = (feedbackId) => {
    const replyText = replyInputs[feedbackId];
    if (!replyText || !replyText.trim()) return;

    replyToFeedback(feedbackId, replyText.trim());
    setApprovalNotification("✓ Javobingiz foydalanuvchiga yuborildi!");
    setReplyInputs((prev) => ({ ...prev, [feedbackId]: '' }));
    reloadFeedbacks();
    setTimeout(() => setApprovalNotification(''), 4000);
  };

  // Login & Parol berish modalikasi
  const [selectedReqForApproval, setSelectedReqForApproval] = useState(null);
  const [customLoginInput, setCustomLoginInput] = useState('');
  const [customPassInput, setCustomPassInput] = useState('');
  const [approvalNotification, setApprovalNotification] = useState('');

  if (!isOpen) return null;

  // Qo'shiqlar qidiruvi
  const filteredSongs = songs.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return s.title?.toLowerCase().includes(q) || s.artist?.toLowerCase().includes(q) || s.genre?.toLowerCase().includes(q);
  });

  const handleDelete = (song) => {
    if (window.confirm(`Haqiqatan ham "${song.title}" qo'shig'ini o'chirmoqchimisiz?`)) {
      onDeleteSong(song.id);
      setDeletedSuccess(`"${song.title}" o'chirildi!`);
      setTimeout(() => setDeletedSuccess(''), 2500);
    }
  };

  // Login va parol berishni boshlash
  const handleStartApproval = (req) => {
    setSelectedReqForApproval(req);
    // Avtomatik taklif etilgan login va parol
    const suggestedLogin = `${req.firstName.toLowerCase()}.${req.birthYear.slice(-2) || '01'}`;
    const suggestedPass = `hb${req.birthYear}!`;
    setCustomLoginInput(suggestedLogin);
    setCustomPassInput(suggestedPass);
  };

  // Login va parol berishni tasdiqlash va Emailga jo'natish
  const handleConfirmApproval = (e) => {
    e.preventDefault();
    if (!selectedReqForApproval) return;

    const res = approveRequest(
      selectedReqForApproval.id,
      customLoginInput,
      customPassInput
    );

    if (res.success) {
      setApprovalNotification(
        `✓ ${selectedReqForApproval.firstName} ${selectedReqForApproval.lastName} ga login: "${customLoginInput}" va parol berildi hamda ${selectedReqForApproval.email} ga email orqali yuborildi!`
      );
      setSelectedReqForApproval(null);
      setTimeout(() => setApprovalNotification(''), 6000);
    }
  };

  // Faoliyatlarni filtrlash
  const filteredActivities = activities.filter((act) => {
    if (activityFilter === 'ALL') return true;
    if (activityFilter === 'AUTH') return act.type === 'LOGIN' || act.type === 'LOGOUT';
    if (activityFilter === 'SEARCH') return act.type === 'SEARCH';
    if (activityFilter === 'PROFILE') return act.type.startsWith('PROFILE');
    if (activityFilter === 'MUSIC') return act.type === 'PLAY' || act.type === 'LIKE';
    return true;
  });

  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Tepa qismi */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-amber-500/20 ring-2 ring-amber-500/30 shrink-0 bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <FaCrown className="text-xl text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black">
                  Admin Boshqaruv Paneli
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                  Humoyun (Bosh Admin)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Foydalanuvchi arizalari, monitoring, emaillar va musiqalar nazorati
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

        {/* Agar Admin bo'lmasa - Cheklov xabari */}
        {!isAdmin ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <FaExclamationTriangle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-black">
                Ruxsat berilmadi: Faqat Humoyun (Admin) uchun!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Foydalanuvchi arizalarini ko'rish, login/parol berish va tizim monitoringi faqat <b>Humoyun (Admin)</b> uchun ochiq.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 active:scale-95 transition-all"
            >
              <FaSignInAlt /> Admin (Humoyun) sifatida kirish
            </button>
          </div>
        ) : (
          /* Admin amallari */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Bildirishnomalar */}
            {approvalNotification && (
              <div className="mx-6 mt-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <FaCheck className="shrink-0 text-emerald-500" />
                <span>{approvalNotification}</span>
              </div>
            )}

            {deletedSuccess && (
              <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                ✓ {deletedSuccess}
              </div>
            )}

            {/* Admin Boshqaruv Tablari */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-2 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
              
              {/* Tab: Foydalanuvchilar fikrlari & takliflari (MUHIM) */}
              <button
                onClick={() => setActiveTab('feedbacks')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'feedbacks'
                    ? 'border-amber-500 text-amber-500 dark:text-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>💬 Fikrlar & Javoblar</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  {feedbacksList.length}
                </span>
                {feedbacksList.some((f) => f.status === 'pending') && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>

              {/* Tab 1: Foydalanuvchi arizalari (Kirish so'rovlari) */}
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'requests'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FaUserClock />
                <span>Kirish so'rovlari</span>
                {pendingRequestsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                    {pendingRequestsCount} yangi
                  </span>
                )}
              </button>

              {/* Tab 2: Jonli Monitoring (Kim kirdi, kim chiqdi, nimani qidirdi, profil harakatlari) */}
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'monitoring'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FaChartLine />
                <span>📊 Jonli Monitoring</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {activities.length}
                </span>
              </button>

              {/* Tab 3: Yuborilgan Emaillar */}
              <button
                onClick={() => setActiveTab('emails')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'emails'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FaEnvelope />
                <span>📧 Yuborilgan Emaillar ({emails.length})</span>
              </button>

              {/* Tab 4: Musiqalar boshqaruvi */}
              <button
                onClick={() => setActiveTab('songs')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'songs'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FaMusic />
                <span>Musiqalar ({songs.length})</span>
              </button>
            </div>

            {/* TAB: FOYDALANUVCHILAR FIKRLARI VA ADMIN JAVOBI */}
            {activeTab === 'feedbacks' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Foydalanuvchilar Fikrlari va Qo'shiq Takliflari ({feedbacksList.length} ta)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Foydalanuvchilar sayt orqali yuborgan fikr va takliflar. Shu yerdan to'g'ridan-to'g'ri javob yozing.
                    </p>
                  </div>
                  <button
                    onClick={reloadFeedbacks}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
                  >
                    Yangilash
                  </button>
                </div>

                {feedbacksList.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500">
                    Hozircha foydalanuvchilardan fikrlar kelmadi.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbacksList.map((fb) => (
                      <div
                        key={fb.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          fb.status === 'replied'
                            ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                            : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              👤 {fb.userName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (@{fb.userId})
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                fb.status === 'replied'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {fb.status === 'replied' ? '✓ Javob berilgan' : '⏳ Javob kutilmoqda'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(fb.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Fikr matni */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 mb-3">
                          <p className="font-bold text-amber-600 dark:text-amber-400 text-xs mb-1">
                            {fb.subject}
                          </p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {fb.message}
                          </p>
                        </div>

                        {/* Agar javob berilgan bo'lsa */}
                        {fb.adminReply && (
                          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs space-y-1 mb-2">
                            <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-[11px]">
                              <span>👑 Sizning (Admin) javobingiz:</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                                {fb.repliedAt ? new Date(fb.repliedAt).toLocaleDateString() : ''}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200">{fb.adminReply}</p>
                          </div>
                        )}

                        {/* Javob yozish maydoni */}
                        <div className="pt-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={fb.adminReply ? "Javobni yangilash..." : "Foydalanuvchiga javob yozing..."}
                              value={replyInputs[fb.id] || ''}
                              onChange={(e) =>
                                setReplyInputs((prev) => ({ ...prev, [fb.id]: e.target.value }))
                              }
                              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleSendFeedbackReply(fb.id)}
                              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                            >
                              Javob qaytarish
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: KIRISH SO'ROVLARI VA LOGIN/PAROL BERISH */}
            {activeTab === 'requests' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold">
                      Yangi kelgan arizalar ({requests.length} ta)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Birinchi marta kirgan odamlar yozgan ism-familiya, tug'ilgan yil va email.
                    </p>
                  </div>
                </div>

                {requests.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500">
                    Hozircha hech qanday yangi ariza kelmadi.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          req.status === 'approved'
                            ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                            : 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/60 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm">
                                {req.firstName} {req.lastName}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {req.birthYear}-yil
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  req.status === 'approved'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                                }`}
                              >
                                {req.status === 'approved' ? '✓ Login Berilgan' : '⏳ Kutilmoqda'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                              <span>📧 {req.email}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-400 text-[11px]">
                                {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </p>

                            {req.note && (
                              <p className="text-xs text-slate-500 italic">
                                "{req.note}"
                              </p>
                            )}

                            {req.status === 'approved' && (
                              <div className="pt-1 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                                Berilgan Login: <b>{req.assignedLogin}</b> | Parol: <b>{req.assignedPassword}</b>
                              </div>
                            )}
                          </div>

                          <div className="shrink-0">
                            {req.status === 'pending' ? (
                              <button
                                onClick={() => handleStartApproval(req)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 active:scale-95 transition-all"
                              >
                                <FaKey className="text-[11px]" />
                                <span>Login va Parol berish</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartApproval(req)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                              >
                                <span>Qayta yuborish</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: JONLI MONITORING (Admin ko'rib tursin) */}
            {activeTab === 'monitoring' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Foydalanuvchilar Jonli Monitoringi</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kim kirdi, kim chiqdi, nimani qidirdi va profilida nima qildi — barchasi real-vaqtda.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => clearStoredActivities()}
                      className="text-xs text-slate-400 hover:text-rose-500 underline"
                    >
                      Jurnalni tozalash
                    </button>
                  </div>
                </div>

                {/* Filtrlar */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                  {[
                    { id: 'ALL', label: 'Barchasi' },
                    { id: 'AUTH', label: '🔑 Kirish / Chiqish' },
                    { id: 'SEARCH', label: '🔍 Qidiruvlar' },
                    { id: 'PROFILE', label: '👤 Profil harakatlari' },
                    { id: 'MUSIC', label: '🎵 Musiqa tinglash/Like' },
                  ].map((flt) => (
                    <button
                      key={flt.id}
                      onClick={() => setActivityFilter(flt.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        activityFilter === flt.id
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {flt.label}
                    </button>
                  ))}
                </div>

                {/* Faoliyatlar ro'yxati */}
                <div className="space-y-2">
                  {filteredActivities.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-500">
                      Ushbu toifada faoliyat qayd etilmagan.
                    </div>
                  ) : (
                    filteredActivities.map((act) => {
                      const timeStr = new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const dateStr = new Date(act.timestamp).toLocaleDateString();

                      let badgeBg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                      let icon = '⚡';

                      if (act.type === 'LOGIN') {
                        badgeBg = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300';
                        icon = '🟢 Kirish';
                      } else if (act.type === 'LOGOUT') {
                        badgeBg = 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300';
                        icon = '🔴 Chiqish';
                      } else if (act.type === 'SEARCH') {
                        badgeBg = 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300';
                        icon = '🔍 Qidiruv';
                      } else if (act.type.startsWith('PROFILE')) {
                        badgeBg = 'bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300';
                        icon = '📸 Profil';
                      } else if (act.type === 'PLAY') {
                        badgeBg = 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300';
                        icon = '▶️ Musiqa';
                      } else if (act.type === 'LIKE') {
                        badgeBg = 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300';
                        icon = '❤️ Like';
                      }

                      return (
                        <div
                          key={act.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 transition-all text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`px-2.5 py-1 rounded-xl font-bold shrink-0 text-[10px] ${badgeBg}`}>
                              {icon}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 dark:text-white mr-2">
                                {act.user}
                              </span>
                              <span className="text-slate-600 dark:text-slate-300 break-words">
                                {act.details}
                              </span>
                            </div>
                          </div>

                          <div className="text-right text-[11px] text-slate-400 shrink-0 font-mono">
                            {timeStr}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: YUBORILGAN EMAILLAR */}
            {activeTab === 'emails' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold">
                    Email orqali yuborilgan Login va Parollar ({emails.length} ta)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Foydalanuvchilar arizasiga binoan ularning elektron pochtasiga yetkazilgan ma'lumotlar arxivi.
                  </p>
                </div>

                <div className="space-y-3">
                  {emails.map((em) => (
                    <div
                      key={em.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          Kimga: {em.to} ({em.firstName} {em.lastName})
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(em.sentAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Mavzu: {em.subject}
                      </p>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
                        <div>Login: <b className="text-sky-600 dark:text-sky-400">{em.login}</b></div>
                        <div>Parol: <b className="text-amber-600 dark:text-amber-400">{em.password}</b></div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Holat: {em.status || 'Yetkazildi'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MUSIQALAR BOSHQARUVI */}
            {activeTab === 'songs' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 pb-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative w-full sm:w-72">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Musiqani qidirish..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenAddModal();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/25 active:scale-95 transition-all"
                  >
                    <FaPlus className="text-[11px]" />
                    <span>+ Yangi musiqa qo'shish</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                  {filteredSongs.map((song) => {
                    const fallbackIndex = Math.abs(Number(song.id) || 0) % DEFAULT_COVERS.length;
                    const cover = resolveMediaUrl(song.cover_url, 'cover', song.id) || DEFAULT_COVERS[fallbackIndex];

                    return (
                      <div
                        key={song.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cover}
                            alt={song.title}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {song.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {song.artist} • <span className="font-semibold">{song.genre}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(song)}
                          className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 transition-all text-xs"
                          title="Qo'shiqni o'chirish"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* DIALOG: LOGIN VA PAROL BERISH VA EMAILGA YUBORISH */}
        {selectedReqForApproval && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FaKey className="text-purple-600" />
                  <h3 className="font-bold text-sm">
                    Login va Parol berish
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReqForApproval(null)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-1">
                <div>Foydalanuvchi: <b>{selectedReqForApproval.firstName} {selectedReqForApproval.lastName}</b></div>
                <div>Tug'ilgan yili: <b>{selectedReqForApproval.birthYear}</b></div>
                <div>Email: <b className="text-purple-600 dark:text-purple-400">{selectedReqForApproval.email}</b></div>
              </div>

              <form onSubmit={handleConfirmApproval} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">
                    Unga beriladigan Login:
                  </label>
                  <input
                    type="text"
                    value={customLoginInput}
                    onChange={(e) => setCustomLoginInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">
                    Unga beriladigan Parol:
                  </label>
                  <input
                    type="text"
                    value={customPassInput}
                    onChange={(e) => setCustomPassInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
                  <FaEnvelope className="text-purple-500 shrink-0" />
                  <span>Tasdiqlangach, ushbu ma'lumotlar avtomatik tarzda uning emailingizga yuboriladi.</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReqForApproval(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-purple-500/25 transition-all"
                  >
                    Tasdiqlash & Emailga yuborish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal pastki qismi */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>Admin Boshqaruvi: Humoyun</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all"
          >
            {t('close', 'Yopish')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelModal;
