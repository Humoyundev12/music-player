import React, { useState } from 'react';
import {
  FaTimes,
  FaUser,
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTranslate } from '../../hooks/useTranslate';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, validAccounts } = useAuth();
  const { t } = useTranslate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = login(username, password);
    if (res.success) {
      setSuccessMsg(`${t('login_success', 'Xush kelibsiz,')} ${res.user.name} (${res.user.role === 'admin' ? t('admin_badge', 'Admin') : t('user_badge', 'Foydalanuvchi')})!`);
      setTimeout(() => {
        setSuccessMsg('');
        if (onSuccess) onSuccess(res.user);
        onClose();
      }, 900);
    } else {
      setErrorMsg(res.message || t('login_error', "Login yoki parol noto'g'ri!"));
    }
  };

  const handleQuickFill = (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yuqori sarlavha */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('login_title', 'Tizimga kirish')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('login_subtitle', 'Foydalanuvchi yoki Admin sifatida kiring')}
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

        {/* Tezkor hisob tanlash (Parollar ko'rsatilmaydi!) */}
        <div className="px-6 pt-5 pb-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            ⚡ {t('quick_login_title', 'Hisobni tanlash:')}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickFill(validAccounts[0])}
              className="flex flex-col text-left p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all text-xs"
            >
              <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                👤 Muhammad
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Foydalanuvchi hisobi
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill(validAccounts[1])}
              className="flex flex-col text-left p-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all text-xs"
            >
              <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                👑 Humoyun
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
                Admin hisobi
              </span>
            </button>
          </div>
        </div>

        {/* Forma */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
              <FaExclamationCircle className="shrink-0 text-sm" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
              <FaCheckCircle className="shrink-0 text-sm" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('username', 'Login')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                required
                placeholder={t('enter_username', 'Muhammad yoki Humoyun')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('password', 'Parol')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={t('enter_password', 'Parolni kiriting')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-98 transition-all"
            >
              {t('submit_login', 'Tizimga kirish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
