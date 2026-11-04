import React, { useState } from 'react';
import {
  Clock,
  RotateCcw,
  Calendar,
  FileText,
  AlertCircle,
  Play,
  BookmarkCheck,
  Timer,
  SlidersHorizontal,
} from 'lucide-react';
import { TARIF_PER_JAM, formatRupiah, parseHoursInput } from '../utils/formatters.ts';

interface CalculatorFormProps {
  hoursInput: string;
  setHoursInput: (val: string) => void;
  dateInput: string;
  setDateInput: (val: string) => void;
  noteInput: string;
  setNoteInput: (val: string) => void;
  onCalculate: () => void;
  onReset: () => void;
  onSave: () => void;
  isSaved: boolean;
  isValid: boolean;
  errorMessage?: string;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  hoursInput,
  setHoursInput,
  dateInput,
  setDateInput,
  noteInput,
  setNoteInput,
  onCalculate,
  onReset,
  onSave,
  isSaved,
  isValid,
  errorMessage,
}) => {
  const [inputMode, setInputMode] = useState<'direct' | 'timesheet'>('direct');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakHours, setBreakHours] = useState('1'); // 1 hour break

  // Quick preset buttons for common work shifts
  const quickHours = [
    { label: '4 Jam (Part Time)', val: '4' },
    { label: '7,5 Jam', val: '7,5' },
    { label: '8 Jam (Shift Standar)', val: '8' },
    { label: '10 Jam (Lembur)', val: '10' },
    { label: '12 Jam (Shift Panjang)', val: '12' },
  ];

  // Helper to add +0.5 or +1 hour
  const handleAddHours = (increment: number) => {
    const parsed = parseHoursInput(hoursInput);
    const current = parsed.value !== null ? parsed.value : 0;
    const nextVal = Math.max(0, current + increment);
    // Format with comma
    const formatted = String(nextVal).replace('.', ',');
    setHoursInput(formatted);
  };

  // Compute duration from start and end time
  const handleApplyTimesheet = () => {
    if (!startTime || !endTime) return;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;

    // Overnight shift handling
    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    const breakMinutes = (Number(breakHours.replace(',', '.')) || 0) * 60;
    const netMinutes = Math.max(0, endTotal - startTotal - breakMinutes);
    const calculatedHours = Number((netMinutes / 60).toFixed(2));
    const strVal = String(calculatedHours).replace('.', ',');
    setHoursInput(strVal);
    setInputMode('direct');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-7 space-y-6">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Formulir Kerja
          </span>
          <h3 className="text-lg font-bold text-slate-900">Input Jam Kerja Karyawan</h3>
        </div>

        {/* Tab switcher: Direct vs Timesheet calculation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setInputMode('direct')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              inputMode === 'direct'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Input Jam Langsung
          </button>
          <button
            type="button"
            onClick={() => setInputMode('timesheet')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              inputMode === 'timesheet'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hitung Masuk & Pulang
          </button>
        </div>
      </div>

      {/* Timesheet Mode Helper */}
      {inputMode === 'timesheet' && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Timer className="w-4 h-4 text-slate-600" />
            <span>Kalkulator Durasi Shift Otomatis</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Jam Masuk
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Jam Pulang
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Istirahat (Jam)
              </label>
              <input
                type="text"
                placeholder="1 atau 0.5"
                value={breakHours}
                onChange={(e) => setBreakHours(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleApplyTimesheet}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Terapkan ke Jam Kerja
            </button>
          </div>
        </div>
      )}

      {/* Main Input Section */}
      <div className="space-y-4">
        {/* Hours Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="hours-input" className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Jumlah Jam Kerja</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-500">
              Mendukung desimal (misal: 7,5 atau 8)
            </span>
          </div>

          <div className="relative">
            <input
              id="hours-input"
              type="text"
              inputMode="decimal"
              placeholder="Contoh: 8 atau 7,5"
              value={hoursInput}
              onChange={(e) => setHoursInput(e.target.value)}
              className={`w-full h-13 pl-4 pr-16 bg-white border ${
                errorMessage && !isValid
                  ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-emerald-500/20 focus:border-emerald-600'
              } rounded-xl text-lg sm:text-xl font-bold font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 transition-all`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 pointer-events-none">
              Jam
            </div>
          </div>

          {/* Validation Feedback */}
          {errorMessage && (
            <div
              className={`mt-2 text-xs flex items-center gap-1.5 ${
                isValid ? 'text-amber-700' : 'text-rose-600'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Quick Stepper & Presets */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Pilihan Jam Cepat:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAddHours(0.5)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors cursor-pointer"
              >
                +0,5 Jam
              </button>
              <button
                type="button"
                onClick={() => handleAddHours(1)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors cursor-pointer"
              >
                +1 Jam
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {quickHours.map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setHoursInput(preset.val)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  hoursInput === preset.val
                    ? 'bg-slate-900 border-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date and Note details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label htmlFor="date-input" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Tanggal Kerja Harian</span>
            </label>
            <input
              id="date-input"
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="note-input" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Catatan / Nama Shift (Opsional)</span>
            </label>
            <input
              id="note-input"
              type="text"
              placeholder="Contoh: Shift Pagi, Kasir, Lembur"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Primary Action: Hitung Gaji */}
          <button
            type="button"
            onClick={onCalculate}
            className="flex-1 sm:flex-none min-h-[44px] px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Hitung Gaji</span>
          </button>

          {/* Reset Action */}
          <button
            type="button"
            onClick={onReset}
            className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Reset formulir ke default"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

        {/* Simpan Riwayat Action */}
        <button
          type="button"
          onClick={onSave}
          disabled={!isValid || isSaved}
          className={`min-h-[44px] px-4 py-2.5 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
              : isValid
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-[0.98]'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>{isSaved ? 'Tersimpan' : 'Simpan Riwayat'}</span>
        </button>
      </div>

      {/* Information footer */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
        <span>Tarif saat ini: {formatRupiah(TARIF_PER_JAM)} / jam</span>
        <span>Perhitungan otomatis dan instan</span>
      </div>
    </div>
  );
};
