import React, { useState } from 'react';
import { FaCode, FaBolt, FaLayerGroup, FaCheckCircle, FaTimes, FaGlobe } from 'react-icons/fa';

const NextFooter = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl py-8 px-4 text-center transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
        
        {/* Next.js Zamonaviy Brend Belgisi (Logotip) */}
        <div
          onClick={() => setShowModal(true)}
          className="group cursor-pointer inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-black/10 dark:ring-white/20"
          title="Next.js arxitekturasi haqida"
        >
          {/* Next.js Uchburchak belgisi (SVG) */}
          <div className="w-5 h-5 flex items-center justify-center font-black">
            <svg viewBox="0 0 180 180" className="w-full h-full fill-current" aria-hidden="true">
              <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
                <circle cx="90" cy="90" fill="black" r="90" />
              </mask>
              <g mask="url(#mask0_next)">
                <circle cx="90" cy="90" data-circle="true" fill="currentColor" fillOpacity="0.15" r="90" />
                <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.16 149.508 157.52Z" fill="currentColor" />
                <rect fill="currentColor" height="72" width="12" x="115" y="54" />
              </g>
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider uppercase">
              Powered by Next.js
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 dark:bg-black/20 text-white dark:text-black">
              v15.1
            </span>
          </div>
        </div>

        {/* Tavsif va texnologiyalar */}
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          HB Music platformasi eng so'nggi <b>Next.js</b> va <b>React 19</b> arxitekturasi asosida yaratilgan.
          Tezkor yuklanish, audio oqimi va xavfsiz boshqaruv tizimi.
        </p>

        {/* Teglar */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1">
            <FaBolt className="text-amber-500 text-[10px]" /> Next.js Turbo Engine
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1">
            <FaLayerGroup className="text-sky-500 text-[10px]" /> SSR & Client Components
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1">
            <FaGlobe className="text-emerald-500 text-[10px]" /> Vercel Edge Optimized
          </span>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 w-full max-w-xs">
          © 2026 HB Music. All rights reserved. Next.js Core.
        </div>
      </div>

      {/* Next.js Tafsilotlari Modali */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black">▲ Next.js</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full">
                  Architecture
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaCheckCircle className="text-emerald-500" />
                  1. Server-Side Rendering & Edge Streaming
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Musiqa fayllari va tarjimalar minimal kechikish bilan foydalanuvchiga yetkaziladi.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaCheckCircle className="text-sky-500" />
                  2. Offline Detection va Loading tizimi
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Internet aloqasi uzilganda avtomatik Loading rejimiga o'tadi va ma'lumotlar xavfsiz saqlanadi.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaCheckCircle className="text-purple-500" />
                  3. Admin Jonli Monitoring va Instagram Profil
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Next.js modulli tuzilmasi orqali foydalanuvchining har bir harakati admin panelida real-vaqtda aks etadi.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-all shadow-md"
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default NextFooter;
