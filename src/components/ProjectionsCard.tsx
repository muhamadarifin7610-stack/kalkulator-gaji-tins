import React, { useState } from 'react';
import { CalendarDays, CalendarRange, Sun, TrendingUp, Info } from 'lucide-react';
import { TARIF_PER_JAM, formatRupiah, formatJam } from '../utils/formatters.ts';

interface ProjectionsCardProps {
  hours: number;
}

export const ProjectionsCard: React.FC<ProjectionsCardProps> = ({ hours }) => {
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<5 | 6>(5);

  // Projections calculations
  const dailySalary = hours * TARIF_PER_JAM;
  const weeklyHours = hours * workDaysPerWeek;
  const weeklySalary = weeklyHours * TARIF_PER_JAM;

  // Monthly: typical 4.33 weeks or (daysPerWeek * 4.33) -> approx 22 days for 5-day week, 26 days for 6-day week
  const monthlyWorkDays = workDaysPerWeek === 5 ? 22 : 26;
  const monthlyHours = hours * monthlyWorkDays;
  const monthlySalary = monthlyHours * TARIF_PER_JAM;

  return (
    <div id="rekap" className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Estimasi & Rekapitulasi
          </span>
          <h3 className="text-lg font-bold text-slate-900">Rekap Gaji Harian, Mingguan & Bulanan</h3>
        </div>

        {/* Days per week toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
          <span className="text-slate-500 font-medium px-2 hidden sm:inline">Hari Kerja/Minggu:</span>
          <button
            type="button"
            onClick={() => setWorkDaysPerWeek(5)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              workDaysPerWeek === 5
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5 Hari
          </button>
          <button
            type="button"
            onClick={() => setWorkDaysPerWeek(6)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              workDaysPerWeek === 6
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            6 Hari
          </button>
        </div>
      </div>

      {/* 3 Grid Recap Cards: Harian, Mingguan, Bulanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rekap Harian */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-md px-2 py-0.5">
                1 Hari Kerja
              </span>
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Rekap Gaji Harian
            </h4>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {formatRupiah(dailySalary)}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Jam Kerja:</span>
              <span className="font-semibold text-slate-800">{formatJam(hours)} Jam / hari</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tarif:</span>
              <span className="font-semibold text-slate-800">{formatRupiah(TARIF_PER_JAM)} / jam</span>
            </div>
          </div>
        </div>

        {/* Rekap Mingguan */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">
                {workDaysPerWeek} Hari / Pekan
              </span>
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Rekap Gaji Mingguan
            </h4>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {formatRupiah(weeklySalary)}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Jam Pekanan:</span>
              <span className="font-semibold text-slate-800">{formatJam(weeklyHours)} Jam</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Perhitungan:</span>
              <span className="font-semibold text-slate-800">{workDaysPerWeek} hari × {formatRupiah(dailySalary)}</span>
            </div>
          </div>
        </div>

        {/* Rekap Bulanan */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <CalendarRange className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-md px-2 py-0.5">
                ±{monthlyWorkDays} Hari / Bulan
              </span>
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Rekap Gaji Bulanan
            </h4>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900 font-mono tabular-nums">
              {formatRupiah(monthlySalary)}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Jam Bulanan:</span>
              <span className="font-semibold text-slate-800">{formatJam(monthlyHours)} Jam</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Perhitungan:</span>
              <span className="font-semibold text-slate-800">{monthlyWorkDays} hari × {formatRupiah(dailySalary)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projections summary bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Berdasarkan jam kerja saat ini ({formatJam(hours)} jam/hari), estimasi penghasilan bulanan Anda adalah{' '}
            <strong className="text-emerald-300 font-bold">{formatRupiah(monthlySalary)}</strong>.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
          <Info className="w-3.5 h-3.5" />
          <span>Estimasi kalender normal ({monthlyWorkDays} hari kerja)</span>
        </div>
      </div>
    </div>
  );
};
