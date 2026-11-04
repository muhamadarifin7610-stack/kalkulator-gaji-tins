import React from 'react';
import { Lock, ShieldCheck, Clock, Zap } from 'lucide-react';
import { TARIF_PER_JAM, formatRupiah } from '../utils/formatters.ts';

export const RateBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Tarif Tetap Terverifikasi</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Otomatis Aktif</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
            <span>{formatRupiah(TARIF_PER_JAM)}</span>
            <span className="text-base sm:text-lg font-normal text-slate-300">/ jam kerja</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Sistem secara otomatis menerapkan tarif tetap Rp15.000 untuk setiap jam kerja karyawan. Anda tidak perlu memasukkan atau mengubah tarif secara manual.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Status Tarif</div>
              <div className="text-xs font-semibold text-white">Terkunci & Otomatis</div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Ekuivalen Menit</div>
              <div className="text-xs font-semibold text-white">Rp250 / menit</div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Shift 8 Jam</div>
              <div className="text-xs font-semibold text-emerald-400">{formatRupiah(8 * TARIF_PER_JAM)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
