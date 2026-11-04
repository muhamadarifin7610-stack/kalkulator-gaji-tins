import React, { useState } from 'react';
import { Check, Copy, Wallet, Sparkles, BookmarkPlus } from 'lucide-react';
import { formatRupiah, formatJam } from '../utils/formatters.ts';

interface SalaryResultCardProps {
  hours: number;
  rate: number;
  totalSalary: number;
  terbilang: string;
  dateStr: string;
  noteStr?: string;
  onSaveHistory: () => void;
  isSaved?: boolean;
}

export const SalaryResultCard: React.FC<SalaryResultCardProps> = ({
  hours,
  rate,
  totalSalary,
  terbilang,
  onSaveHistory,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Kalkulator Gaji Per Jam\nJam Kerja: ${formatJam(hours)} Jam\nTarif: ${formatRupiah(rate)}/Jam\nTotal Gaji: ${formatRupiah(totalSalary)}\nTerbilang: ${terbilang}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
      {/* Decorative emerald gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hasil Perhitungan
              </span>
              <h3 className="text-base font-bold text-slate-900">Total Gaji Yang Diperoleh</h3>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            {formatJam(hours)} Jam × {formatRupiah(rate)}
          </div>
        </div>

        {/* Big prominent emerald salary display */}
        <div className="my-6 p-5 sm:p-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200/70 rounded-2xl text-center sm:text-left">
          <div className="text-xs sm:text-sm font-semibold text-emerald-800 mb-1 flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Nominal Gaji Bersih</span>
          </div>

          <div className="text-3xl sm:text-5xl font-black text-emerald-700 tracking-tight font-mono tabular-nums py-1">
            {formatRupiah(totalSalary)}
          </div>

          <div className="mt-2 text-xs sm:text-sm font-medium text-emerald-900/80 italic">
            "{terbilang}"
          </div>
        </div>

        {/* Breakdown detail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Total Jam Kerja</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
              {formatJam(hours)} <span className="text-xs font-normal text-slate-500">Jam</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Tarif Per Jam</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
              {formatRupiah(rate)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Metode Rumus</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              Jam × Rp15.000
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-slate-100">
        <button
          onClick={onSaveHistory}
          disabled={isSaved}
          className={`w-full sm:flex-1 min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            isSaved
              ? 'bg-emerald-100 text-emerald-800 cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Tersimpan di Riwayat</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              <span>Simpan ke Riwayat</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopy}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Salin Rincian</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
