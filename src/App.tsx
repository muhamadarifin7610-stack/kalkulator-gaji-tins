import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { RateBanner } from './components/RateBanner.tsx';
import { CalculatorForm } from './components/CalculatorForm.tsx';
import { SalaryResultCard } from './components/SalaryResultCard.tsx';
import { ProjectionsCard } from './components/ProjectionsCard.tsx';
import { ReferenceTable } from './components/ReferenceTable.tsx';
import { HistoryList } from './components/HistoryList.tsx';
import { Toast, ToastMessage } from './components/Toast.tsx';
import { InstallModal } from './components/InstallModal.tsx';
import { WorkEntry } from './types/salary.ts';
import {
  TARIF_PER_JAM,
  parseHoursInput,
  angkaKeTerbilang,
  formatRupiah,
  formatJam,
} from './utils/formatters.ts';
import { Calculator, Sparkles, CheckCircle2, Smartphone } from 'lucide-react';

const STORAGE_KEY = 'kalkulator_gaji_riwayat_v1';

export default function App() {
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  // Today's date YYYY-MM-DD
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  // Form states
  const [hoursInput, setHoursInput] = useState<string>('8');
  const [dateInput, setDateInput] = useState<string>(todayStr);
  const [noteInput, setNoteInput] = useState<string>('Shift Standar');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // History state (LocalStorage)
  const [entries, setEntries] = useState<WorkEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback if localStorage is unavailable
    }
    return [
      {
        id: 'sample-1',
        date: todayStr,
        hours: 8,
        rate: TARIF_PER_JAM,
        totalSalary: 8 * TARIF_PER_JAM,
        note: 'Shift Penuh',
        timestamp: Date.now() - 86400000,
      },
      {
        id: 'sample-2',
        date: todayStr,
        hours: 7.5,
        rate: TARIF_PER_JAM,
        totalSalary: 7.5 * TARIF_PER_JAM,
        note: 'Shift Fleksibel',
        timestamp: Date.now() - 172800000,
      },
    ];
  });

  // Toast notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Ignore storage quota errors
    }
  }, [entries]);

  // Parse hours and compute salary dynamically
  const parseResult = useMemo(() => {
    return parseHoursInput(hoursInput);
  }, [hoursInput]);

  const activeHours = parseResult.value !== null ? parseResult.value : 0;
  const totalSalary = activeHours * TARIF_PER_JAM;
  const terbilang = useMemo(() => angkaKeTerbilang(totalSalary), [totalSalary]);
  const isValid = parseResult.value !== null && parseResult.value > 0;

  // Whenever hours input changes, reset saved indicator
  useEffect(() => {
    setIsSaved(false);
  }, [hoursInput, dateInput, noteInput]);

  // Toast trigger helper
  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToast({ id: String(Date.now()), type, text });
  };

  // Action: Hitung Gaji
  const handleCalculate = () => {
    if (!isValid) {
      showToast('error', parseResult.error || 'Masukkan jumlah jam kerja yang valid.');
      return;
    }
    showToast('success', `Perhitungan diperbarui: ${formatJam(activeHours)} Jam = ${formatRupiah(totalSalary)}`);
    // Smooth scroll to result card on mobile
    const el = document.getElementById('hasil-gaji');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Action: Reset form
  const handleReset = () => {
    setHoursInput('');
    setDateInput(todayStr);
    setNoteInput('');
    setIsSaved(false);
    showToast('info', 'Formulir jam kerja berhasil direset.');
  };

  // Action: Simpan Riwayat
  const handleSaveHistory = () => {
    if (!isValid) {
      showToast('error', 'Masukkan jumlah jam kerja terlebih dahulu sebelum menyimpan.');
      return;
    }

    const newEntry: WorkEntry = {
      id: `work_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      date: dateInput || todayStr,
      hours: activeHours,
      rate: TARIF_PER_JAM,
      totalSalary,
      note: noteInput.trim() || 'Jam Kerja',
      timestamp: Date.now(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setIsSaved(true);
    showToast('success', `Berhasil disimpan ke riwayat: ${formatRupiah(totalSalary)}`);
  };

  // Action: Hapus individual entry
  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
    showToast('info', '1 data riwayat berhasil dihapus.');
  };

  // Action: Hapus semua riwayat
  const handleClearAll = () => {
    setEntries([]);
    showToast('info', 'Semua data riwayat berhasil dibersihkan.');
  };

  // Action: Select preset or reference row
  const handleSelectHours = (hoursVal: string) => {
    setHoursInput(hoursVal);
    showToast('info', `Jam kerja diatur ke ${hoursVal} Jam.`);
    const el = document.getElementById('kalkulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Action: Load entry from history back into calculator
  const handleSelectEntryToForm = (entry: WorkEntry) => {
    setHoursInput(String(entry.hours).replace('.', ','));
    setDateInput(entry.date);
    setNoteInput(entry.note);
    setIsSaved(true);
    showToast('info', `Memuat data kerja tanggal ${entry.date}.`);
    const el = document.getElementById('kalkulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Smooth scroll helper for header
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Navigation */}
      <Header
        onScrollTo={scrollToSection}
        onOpenInstallModal={() => setShowInstallModal(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 flex-1 w-full">
        {/* Hero Section & Fixed Rate Banner */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span className="text-emerald-700 font-bold">Kalkulator Resmi</span>
                <span>·</span>
                <span>Tarif Standar Karyawan</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Kalkulator Gaji Per Jam
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Hitung total penghasilan kerja secara instan dan akurat dengan tarif tetap Rp15.000 per jam. Dilengkapi rekap harian, mingguan, bulanan, serta pencatatan riwayat otomatis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowInstallModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>📱 Pasang di Layar HP</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-xs shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Otomatis & Tanpa Login</span>
              </div>
            </div>
          </div>

          {/* Prominent Fixed Rate Banner */}
          <RateBanner />
        </section>

        {/* 2-Column Calculator & Live Result */}
        <section id="kalkulator" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Form Input (7 cols on lg) */}
          <div className="lg:col-span-7">
            <CalculatorForm
              hoursInput={hoursInput}
              setHoursInput={setHoursInput}
              dateInput={dateInput}
              setDateInput={setDateInput}
              noteInput={noteInput}
              setNoteInput={setNoteInput}
              onCalculate={handleCalculate}
              onReset={handleReset}
              onSave={handleSaveHistory}
              isSaved={isSaved}
              isValid={isValid}
              errorMessage={parseResult.error}
            />
          </div>

          {/* Right Column: Salary Result Card (5 cols on lg) */}
          <div id="hasil-gaji" className="lg:col-span-5 flex flex-col">
            <SalaryResultCard
              hours={activeHours}
              rate={TARIF_PER_JAM}
              totalSalary={totalSalary}
              terbilang={terbilang}
              dateStr={dateInput}
              noteStr={noteInput}
              onSaveHistory={handleSaveHistory}
              isSaved={isSaved}
            />
          </div>
        </section>

        {/* Rekapitulasi Gaji (Harian, Mingguan, Bulanan) */}
        <section>
          <ProjectionsCard hours={activeHours} />
        </section>

        {/* Tabel Referensi Acuan Cepat */}
        <section>
          <ReferenceTable
            onSelectHours={handleSelectHours}
            activeHours={activeHours}
          />
        </section>

        {/* Riwayat Perhitungan (Local Storage) */}
        <section>
          <HistoryList
            entries={entries}
            onDeleteEntry={handleDeleteEntry}
            onClearAll={handleClearAll}
            onSelectEntryToForm={handleSelectEntryToForm}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">Kalkulator Gaji Per Jam</span>
            <span className="text-slate-400">·</span>
            <span>Tarif Tetap Rp15.000 / Jam</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Formula: Jam Kerja × Rp15.000</span>
            <span>·</span>
            <span>Tersimpan di Local Storage</span>
          </div>
        </div>
      </footer>

      {/* Floating Toast notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Mobile Install Instructions Modal */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
