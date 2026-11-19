import React, { useState, useEffect } from 'react';
import { FaWifi, FaRedo, FaExclamationTriangle, FaCloud } from 'react-icons/fa';

const OfflineLoader = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true
  );
  const [isChecking, setIsChecking] = useState(false);
  const [manualOffline, setManualOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      if (manualOffline) {
        setManualOffline(false);
      }
      setIsOnline(navigator.onLine);
    }, 1200);
  };

  const showLoading = !isOnline || manualOffline;

  if (!showLoading) {
    // Agar internet ishlab turgan bo'lsa, xohishga ko'ra kichik sinov tugmachasini berishimiz mumkin (burchakda)
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl text-white animate-in fade-in duration-300">
      {/* Fon nurlari */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none -bottom-10 animate-pulse delay-700" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        
        {/* Pulsatsiyali Loading Ikonkasi */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 animate-spin opacity-40 blur-sm" />
          <div className="absolute inset-1.5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
            <FaWifi className="text-3xl text-cyan-400 animate-pulse" />
          </div>
          {/* Pulsatsiyalovchi to'lqin halqasi */}
          <div className="absolute -inset-3 rounded-full border border-cyan-500/40 animate-ping duration-1000" />
        </div>

        {/* Matnlar */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Internet aloqasi uzildi
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Loading...
          </h2>

          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Internet ishlamay qoldi yoki tarmoqqa ulanish sust. Musiqalar va sahifa yuklanmoqda...
          </p>
        </div>

        {/* Loading indikator chizig'i */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 w-full animate-indeterminate rounded-full" />
        </div>

        {/* Qayta urinish tugmasi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            <FaRedo className={`text-xs ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Tekshirilmoqda...' : 'Qayta urinish'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          HB Music Next.js • Avtomatik ulanish qayta tiklanishi kutilmoqda
        </p>
      </div>
    </div>
  );
};

export default OfflineLoader;
