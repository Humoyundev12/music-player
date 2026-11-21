import React from 'react';
import {
  FaTimes,
  FaBookOpen,
  FaLanguage,
  FaHeart,
  FaDownload,
  FaCommentDots,
  FaPaperPlane,
  FaTelegramPlane,
  FaEnvelope,
  FaShieldAlt,
  FaCheckCircle,
} from 'react-icons/fa';

const UserGuideModal = ({
  isOpen,
  onClose,
  onOpenFeedback,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="relative w-full max-w-xl bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 flex flex-col max-h-[88vh] overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <FaBookOpen className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Foydalanish qo'llanmasi va Yordam
              </h2>
              <p className="text-[11px] text-slate-400">
                HB Music imkoniyatlari va qulayliklari
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* Guide items */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                <FaLanguage className="text-base" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs">Ruscha va Chet tili qo'shiqlari tarjimasi</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Har qanday chet tilidagi qo'shiqni tanlaganingizda, "Tarjimasi" tugmasini bosib, uning qatorma-qator o'zbek tilidagi ma'no tarjimasini o'qishingiz mumkin.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                <FaHeart className="text-base" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs">Musiqani saqlash va yuklab olish</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  O'zingizga yoqqan musiqalarni yurakcha orqali Sevimlilar to'plamiga saqlang yoki "Yuklab olish" tugmasi orqali telefon va kompyuteringizga MP3 formatda yuklab oling.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <FaCommentDots className="text-base" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs">Fikrlar va Qo'shiq taklif qilish</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Saytga yangi qo'shiq qo'shish yoki o'z fikringizni bildirish uchun "+" tugmasini bosing yoki sahifa pastidagi taklif bo'limiga yozing.
                </p>
              </div>
            </div>
          </div>

          {/* ADMIN BILAN BOG'LANISH (foydalanuvchi yordam qismini boskanda eng pastida admin bilan bog'lanish tursa yetadi) */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-amber-400 text-base" />
                  <h3 className="font-black text-xs text-white uppercase tracking-wider">
                    Admin bilan bog'lanish
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Aloqa
                </span>
              </div>

              <p className="text-[11px] text-slate-300">
                Savollaringiz, takliflaringiz yoki murojaat bo'yicha to'g'ridan-to'g'ri administrator bilan bog'lanishingiz mumkin:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Telegram */}
                <a
                  href="https://t.me/moxirvich_7"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2.5 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400 group-hover:scale-110 transition-transform">
                    <FaTelegramPlane className="text-sm" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Telegram orqali:</span>
                    <span className="font-bold text-white group-hover:text-amber-400">@moxirvich_7</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:humoyun@hbmusic.uz"
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2.5 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Elektron pochta:</span>
                    <span className="font-bold text-white group-hover:text-amber-400">humoyun@hbmusic.uz</span>
                  </div>
                </a>
              </div>

              {/* Direct Feedback trigger */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenFeedback) onOpenFeedback();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FaPaperPlane className="text-[10px]" />
                <span>Sayt orqali fikr yoki xabar qoldirish</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
