import React, { useState } from 'react';
import {
  FaTimes,
  FaUser,
  FaLock,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaperPlane,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaKey,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTranslate } from '../../hooks/useTranslate';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, validAccounts, requestAccess, requests, emails } = useAuth();
  const { t } = useTranslate();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'check_status'

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Ariza yuborish form state (Birinchi marta kirgan odam uchun)
  const [reqFirstName, setReqFirstName] = useState('');
  const [reqLastName, setReqLastName] = useState('');
  const [reqBirthYear, setReqBirthYear] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [reqSuccess, setReqSuccess] = useState('');
  const [reqError, setReqError] = useState('');

  // Ariza holatini tekshirish
  const [checkEmailInput, setCheckEmailInput] = useState('');
  const [checkResult, setCheckResult] = useState(null);

  if (!isOpen) return null;

  // Login yuborish
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Iltimos, username va parolni kiriting!");
      return;
    }

    const res = login(username, password);
    if (res.success) {
      setSuccessMsg(`Xush kelibsiz, ${res.user.name}!`);
      setTimeout(() => {
        setSuccessMsg('');
        if (onSuccess) onSuccess(res.user);
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.message || "Login yoki parol noto'g'ri!");
    }
  };

  // Birinchi marta kirgan odam ariza yuborishi
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setReqError('');
    setReqSuccess('');

    if (!reqFirstName.trim() || !reqLastName.trim() || !reqBirthYear.trim() || !reqEmail.trim()) {
      setReqError("Iltimos, barcha maydonlarni (ism, familiya, tug'ilgan yil, email) to'ldiring!");
      return;
    }

    if (!reqEmail.includes('@') || !reqEmail.includes('.')) {
      setReqError("Iltimos, to'g'ri email manzil kiriting (masalan: foydalanuvchi@gmail.com)!");
      return;
    }

    requestAccess({
      firstName: reqFirstName,
      lastName: reqLastName,
      birthYear: reqBirthYear,
      email: reqEmail,
      note: reqNote,
    });

    setReqSuccess(
      `Arizangiz qabul qilindi va Admin (Humoyun) paneliga yuborildi! Admin sizga login va parol beradi va ${reqEmail} pochtangizga xat yuboriladi.`
    );

    // Formani tozalash
    setReqFirstName('');
    setReqLastName('');
    setReqBirthYear('');
    setReqNote('');
  };

  // Ariza holatini tekshirish
  const handleCheckStatus = (e) => {
    e.preventDefault();
    const query = checkEmailInput.trim().toLowerCase();
    if (!query) return;

    const matchedReq = requests.find((r) => r.email?.toLowerCase() === query);
    const matchedEmail = emails.find((m) => m.to?.toLowerCase() === query);

    if (matchedReq) {
      setCheckResult({ req: matchedReq, email: matchedEmail });
    } else {
      setCheckResult({ notFound: true });
    }
  };

  const handleQuickFill = (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Rasmdagidek fon gradienti va Glassmorphism karta */}
      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/20 text-white flex flex-col"
        style={{
          background: 'radial-gradient(circle at 10% 20%, rgba(88, 28, 135, 0.85) 0%, rgba(15, 23, 42, 0.95) 55%, rgba(14, 116, 144, 0.85) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yopish tugmasi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <FaTimes className="text-base" />
        </button>

        {/* Tablar: Tizimga Kirish (Rasm 1) | Birinchi marta kirish (Ariza) | Holat */}
        <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'login'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Kirish (Rasm 1)
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('register'); setReqError(''); setReqSuccess(''); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            + Ariza berish
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('check_status')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'check_status'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Arizam va Email holati"
          >
            Holat
          </button>
        </div>

        {/* 1. TIZIMGA KIRISH (Rasm 1 dagi kabi dizayn) */}
        {activeTab === 'login' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Sarlavha: Rasmdagidek toza oq va markazda */}
            <div className="text-center pt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Tizimga Kirish
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Foydalanuvchi yoki Admin sifatida kiring
              </p>
            </div>

            {/* Xatolik / Muvaffaqiyat xabari */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <FaExclamationCircle className="shrink-0 text-base" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <FaCheckCircle className="shrink-0 text-base" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Forma: Rasmdagi inputlar va ko'k tugma */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Usernameni kiriting"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-900/60 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Parolni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-slate-900/60 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Rasmdagi moviy/ko'k "Yuborish" tugmasi */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl font-bold text-white text-base shadow-lg shadow-sky-500/30 hover:brightness-110 active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)',
                }}
              >
                Yuborish
              </button>
            </form>

            {/* Tezkor hisob tanlash */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] font-semibold text-white/60 block mb-2 text-center">
                Tezkor sinov uchun tanlash:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill(validAccounts[1] || validAccounts[0])}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all"
                >
                  <span className="font-bold text-white block">👤 Muhammad</span>
                  <span className="text-[10px] text-sky-300">Foydalanuvchi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill(validAccounts[0])}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all"
                >
                  <span className="font-bold text-amber-300 block">👑 Humoyun</span>
                  <span className="text-[10px] text-amber-200">Administrator</span>
                </button>
              </div>
            </div>

            {/* Ariza berishga chaqiruv */}
            <div className="text-center text-xs text-white/70">
              Birinchi marta kirdingizmi?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-sky-300 hover:text-sky-200 font-bold underline"
              >
                Admin orqali login va parol olish
              </button>
            </div>
          </div>
        )}

        {/* 2. BIRINCHI MARTA KIRGAN ODAM UCHUN ARIZA YUBORISH */}
        {activeTab === 'register' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Birinchi marta kirish
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Ma'lumotlaringizni yozing, admin sizga login va parol berib emailingizga yuboradi.
              </p>
            </div>

            {reqError && (
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                {reqError}
              </div>
            )}

            {reqSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <FaCheckCircle className="text-base" />
                  <span>Ariza Adminga yuborildi!</span>
                </div>
                <p className="leading-relaxed text-[11px]">{reqSuccess}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('check_status')}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
                >
                  Arizam holatini tekshirish
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1">
                      Ismingiz *
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan: Humoyun"
                      value={reqFirstName}
                      onChange={(e) => setReqFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1">
                      Familiyangiz *
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan: Biymirzayev"
                      value={reqLastName}
                      onChange={(e) => setReqLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1">
                      Tug'ilgan yilingiz *
                    </label>
                    <input
                      type="number"
                      placeholder="Masalan: 2004"
                      min="1950"
                      max="2025"
                      value={reqBirthYear}
                      onChange={(e) => setReqBirthYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/80 mb-1">
                      Email manzilingiz *
                    </label>
                    <input
                      type="email"
                      placeholder="user@gmail.com"
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-white/80 mb-1">
                    Qo'shimcha izoh / maqsad (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    placeholder="Musiqa tinglash uchun kirish ruxsati so'rayman"
                    value={reqNote}
                    onChange={(e) => setReqNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl font-bold text-white text-sm shadow-lg shadow-sky-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                  style={{
                    background: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)',
                  }}
                >
                  <FaPaperPlane className="text-xs" />
                  <span>Adminga so'rov yuborish</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* 3. ARIZA VA EMAIL HOLATINI TEKSHIRISH */}
        {activeTab === 'check_status' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Arizam holati
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Arizangiz bo'yicha admin login va parol berganligini ko'ring
              </p>
            </div>

            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input
                type="email"
                placeholder="Arizada yozgan emailingiz..."
                value={checkEmailInput}
                onChange={(e) => setCheckEmailInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-sky-400"
                required
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all"
              >
                <FaSearch /> Tekshirish
              </button>
            </form>

            {checkResult && (
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs space-y-3">
                {checkResult.notFound ? (
                  <p className="text-rose-300">
                    Ushbu email bo'yicha ariza topilmadi. Iltimos, "Ariza berish" bo'limidan ro'yxatdan o'ting.
                  </p>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                      <span className="font-bold text-white">
                        {checkResult.req.firstName} {checkResult.req.lastName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          checkResult.req.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {checkResult.req.status === 'approved' ? '✓ Login Berildi' : '⏳ Kutilmoqda'}
                      </span>
                    </div>

                    {checkResult.req.status === 'approved' ? (
                      <div className="space-y-2">
                        <p className="text-emerald-300 text-[11px]">
                          Admin sizning arizangizni tasdiqladi va emailingizga login-parol yubordi:
                        </p>
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1 font-mono text-xs">
                          <div>
                            <span className="text-white/60">Login:</span>{' '}
                            <span className="text-sky-300 font-bold">{checkResult.req.assignedLogin}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Parol:</span>{' '}
                            <span className="text-amber-300 font-bold">{checkResult.req.assignedPassword}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUsername(checkResult.req.assignedLogin);
                            setPassword(checkResult.req.assignedPassword);
                            setActiveTab('login');
                          }}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                        >
                          Tizimga ushbu login bilan kirish
                        </button>
                      </div>
                    ) : (
                      <p className="text-white/70 text-[11px] leading-relaxed">
                        Arizangiz Admin (Humoyun) tomonidan ko'rib chiqilmoqda. Admin login va parol bergach shu yerda va emailingizda ko'rinadi.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginModal;
