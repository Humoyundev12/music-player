import React, { useState } from 'react';
import {
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = () => {
  const { login, registerUser } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [logoImgError, setLogoImgError] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Iltimos, login va parolni kiriting!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(username, password);
      if (res.success) {
        setSuccessMsg(`Xush kelibsiz, ${res.user.name}!`);
      } else {
        setErrorMsg(res.message || "Login yoki parol noto'g'ri!");
        setLoading(false);
      }
    }, 350);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim() || !fullName.trim()) {
      setErrorMsg("Iltimos, ismingiz, login va parolingizni to'liq kiriting!");
      return;
    }

    if (password.length < 4) {
      setErrorMsg("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerUser({
        username: username.trim(),
        password: password.trim(),
        name: fullName.trim(),
      });

      if (res.success) {
        setSuccessMsg(`Tabriklaymiz, ${res.user.name}! Hisobingiz yaratildi.`);
      } else {
        setErrorMsg(res.message || "Ro'yxatdan o'tishda xatolik!");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-600/15 via-orange-600/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 p-0.5 shadow-2xl shadow-amber-500/25 mb-4 ring-1 ring-white/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[22px] flex items-center justify-center overflow-hidden font-black text-amber-500 text-2xl tracking-tighter">
              {!logoImgError ? (
                <img
                  src="/logo.png"
                  alt="HB"
                  onError={() => setLogoImgError(true)}
                  className="w-12 h-12 object-cover rounded-xl"
                />
              ) : (
                <span>HB</span>
              )}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>HB Music</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-widest font-bold">
              Pro
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            Professional audio platformasi. Tinglashni boshlash uchun tizimga kiring.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#0f172a]/85 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
          
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tizimga kirish
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Yangi hisob
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <FaExclamationCircle className="shrink-0 text-sm text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <FaCheckCircle className="shrink-0 text-sm text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
            
            {/* Full Name for register */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaUser className="text-amber-500 text-[10px]" />
                  <span>To'liq ismingiz</span>
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Sardor Aliyev"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            )}

            {/* Username / Login */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FaUser className="text-amber-500 text-[10px]" />
                <span>Foydalanuvchi nomi (Login)</span>
              </label>
              <input
                type="text"
                autoComplete="username"
                placeholder="Login kiriting..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FaLock className="text-amber-500 text-[10px]" />
                  <span>Maxfiy parol</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Parolni kiriting..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black tracking-wide shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Tizimga kirish' : 'Hisobni tasdiqlash'}</span>
                  <FaArrowRight className="text-[11px]" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6 font-medium">
          HB Music Pro © 2026. Barcha huquqlar himoyalangan.
        </p>

      </div>
    </div>
  );
};

export default LoginScreen;
