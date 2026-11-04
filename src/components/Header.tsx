import React from 'react';
import { Calculator } from 'lucide-react';

interface HeaderProps {
  onScrollTo: (sectionId: string) => void;
  activeSection?: string;
  onOpenInstallModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollTo, onOpenInstallModal }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Kalkulator Gaji Per Jam
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onScrollTo('kalkulator')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Hitung Gaji
          </button>
          <button
            onClick={() => onScrollTo('rekap')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Rekap Gaji
          </button>
          <button
            onClick={() => onScrollTo('tabel-tarif')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Tabel Tarif
          </button>
          <button
            onClick={() => onScrollTo('riwayat')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Riwayat
          </button>
        </nav>

        {/* Zone 3: Primary action & Install */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onOpenInstallModal?.()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Pasang aplikasi di layar HP"
          >
            <span>📱 Pasang di HP</span>
          </button>

          <button
            onClick={() => onScrollTo('kalkulator')}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Mulai Hitung
          </button>
        </div>
      </div>
    </header>
  );
};
