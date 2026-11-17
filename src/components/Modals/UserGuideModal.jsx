import React, { useState } from 'react';
import {
  FaTimes,
  FaBookOpen,
  FaUserCircle,
  FaCrown,
  FaLanguage,
  FaLock,
  FaCheckCircle,
  FaHeart,
  FaHeadphones,
  FaSignOutAlt,
  FaSignInAlt,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTranslate } from '../../hooks/useTranslate';

const UserGuideModal = ({
  isOpen,
  onClose,
  onOpenLogin,
  likedCount = 0,
  totalSongs = 0,
}) => {
  const { currentUser, logout, isAdmin, isLoggedIn } = useAuth();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' | 'profile'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Tepa qismi */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-amber-500/20 ring-2 ring-amber-500/30 shrink-0">
              <img src="/logo.png" alt="HB Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('guide_title', "Saytdan foydalanish qismi va Profil")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                HB Music — Imkoniyatlar, qoidalar va shaxsiy hisobingiz
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

        {/* Tablar: Qo'llanma | Profil */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 gap-2 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FaBookOpen />
            <span>Foydalanish qo'llanmasi</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FaUserCircle />
            <span>Foydalanuvchi Profili</span>
            {isLoggedIn && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            )}
          </button>
        </div>

        {/* Kontent */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'guide' ? (
            <div className="space-y-4">
              
              {/* Qoida 1: Login va Parol */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <div className="flex items-center gap-2.5 mb-2 font-bold text-sm text-indigo-900 dark:text-indigo-200">
                  <FaLock className="text-indigo-600 dark:text-indigo-400" />
                  <h4>1. Tizimga kirish (Login)</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Tizimda foydalanuvchi va admin uchun shaxsiy hisoblar mavjud. Xavfsizlik maqsadida barcha parollar maxfiy saqlanadi:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      👤 Oddiy Foydalanuvchi:
                    </span>
                    <div className="space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                      <div>Login: <b className="text-indigo-600 dark:text-indigo-400 font-mono">Muhammad</b></div>
                      <div>Parol: <span className="text-slate-400 font-mono tracking-widest font-bold">••••••••</span></div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Parol maxfiy himoyalangan</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-purple-100 dark:border-slate-700 shadow-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      👑 Boshqaruvchi Admin:
                    </span>
                    <div className="space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                      <div>Login: <b className="text-purple-600 dark:text-purple-400 font-mono">Humoyun</b></div>
                      <div>Parol: <span className="text-slate-400 font-mono tracking-widest font-bold">••••••••</span></div>
                      <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-1">Admin paroli maxfiy himoyalangan</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Qoida 2: Ruscha va Chet tili musiqalar tarjimasi */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center gap-2.5 mb-2 font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  <FaLanguage className="text-emerald-600 dark:text-emerald-400 text-base" />
                  <h4>2. Ruscha va chet tilidagi musiqalar tarjimasi</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Foydalanuvchi har qanday ruscha yoki boshqa tildagi qo'shiqni tanlaganda, pastki audio playerda va <b>"Matn va Tarjima"</b> oynasida uning o'zbek tilidagi ma'no tarjimasi qatorma-qator chiqib turadi.
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Misol:</span> "Группа крови на рукаве..." <br />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold italic">👉 O'zbekcha tarjimasi: "Qo'limdagi yengimda qon guruhi..."</span>
                </div>
              </div>

              {/* Qoida 3: Faqat Admin qo'shiq qo'sha oladi */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                <div className="flex items-center gap-2.5 mb-2 font-bold text-sm text-amber-900 dark:text-amber-200">
                  <FaCrown className="text-amber-600 dark:text-amber-400" />
                  <h4>3. Musiqa qo'shish (Faqat Admin uchun)</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Qo'shiqlarni faqat <b>Humoyun (Admin)</b> qo'sha oladi va boshqara oladi. Oddiy foydalanuvchi (Muhammad) musiqa qo'shish tugmasini bosganida tizim adminga xos huquqni talab qiladi.
                </p>
              </div>

              {/* Qoida 4: useTranslate orqali sayt tilini almashtirish */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                <div className="flex items-center gap-2.5 mb-2 font-bold text-sm text-purple-900 dark:text-purple-200">
                  <FaCheckCircle className="text-purple-600 dark:text-purple-400" />
                  <h4>4. Sayt tilini boshqarish (useTranslate hooki)</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Yuqori paneldagi bayroqchali til tugmasi orqali sayt interfeysini <b>O'zbekcha 🇺🇿</b>, <b>Русский 🇷🇺</b> va <b>English 🇬🇧</b> tillariga bir zumda o'tkazishingiz mumkin.
                </p>
              </div>

            </div>
          ) : (
            /* Profil qismi */
            <div className="space-y-5">
              {isLoggedIn ? (
                <div className="space-y-4">
                  {/* Profil kartochkasi */}
                  <div className="flex items-center gap-4 p-5 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/50">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {currentUser.name}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isAdmin
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-emerald-600 text-white shadow-sm'
                        }`}>
                          {isAdmin ? '👑 Admin' : '👤 Foydalanuvchi'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Login: <code className="font-mono">{currentUser.username}</code> • Status: Faol
                      </p>
                    </div>
                  </div>

                  {/* Statistika kartochkalari */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                      <FaHeadphones className="text-indigo-600 dark:text-indigo-400 text-xl mx-auto mb-1" />
                      <span className="block text-lg font-extrabold text-slate-900 dark:text-white">
                        {totalSongs}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Musiqalar</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                      <FaHeart className="text-rose-500 text-xl mx-auto mb-1" />
                      <span className="block text-lg font-extrabold text-slate-900 dark:text-white">
                        {likedCount}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Yoqtirilgan</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                      <FaCrown className="text-amber-500 text-xl mx-auto mb-1" />
                      <span className="block text-lg font-extrabold text-slate-900 dark:text-white">
                        {isAdmin ? 'Cheksiz' : 'Oddiy'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Ruxsat</span>
                    </div>
                  </div>

                  {/* Chiqish yoki boshqa profilga o'tish */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        logout();
                        onOpenLogin();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                    >
                      <FaUserCircle /> Boshqa profilga o'tish
                    </button>

                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
                    >
                      <FaSignOutAlt /> Chiqish (Logout)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaUserCircle className="text-5xl text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Hozircha tizimga kirmagansiz
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                    Musiqalardan to'liq foydalanish, like bosish va qo'shiqlar qo'shish uchun hisobingizga kiring.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLogin();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
                  >
                    <FaSignInAlt /> Tizimga kirish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal pastki qismi */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            {t('close', 'Tushunarli, yopish')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
