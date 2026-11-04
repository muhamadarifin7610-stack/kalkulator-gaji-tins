import React, { useState } from 'react';
import {
  History,
  Trash2,
  Download,
  Calendar,
  Clock,
  Wallet,
  AlertTriangle,
  X,
  Search,
  CheckCheck,
} from 'lucide-react';
import { WorkEntry } from '../types/salary.ts';
import {
  formatRupiah,
  formatJam,
  formatTanggalIndonesia,
  TARIF_PER_JAM,
} from '../utils/formatters.ts';

interface HistoryListProps {
  entries: WorkEntry[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  onSelectEntryToForm: (entry: WorkEntry) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  entries,
  onDeleteEntry,
  onClearAll,
  onSelectEntryToForm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Filter entries based on search term
  const filtered = entries.filter((item) => {
    const term = searchTerm.toLowerCase();
    const dateFormatted = formatTanggalIndonesia(item.date).toLowerCase();
    const note = (item.note || '').toLowerCase();
    return dateFormatted.includes(term) || note.includes(term) || item.date.includes(term);
  });

  // Calculate aggregates
  const totalEntries = entries.length;
  const totalHours = entries.reduce((acc, curr) => acc + curr.hours, 0);
  const totalSalary = entries.reduce((acc, curr) => acc + curr.totalSalary, 0);
  const avgHours = totalEntries > 0 ? totalHours / totalEntries : 0;

  // Export to CSV
  const handleExportCSV = () => {
    if (entries.length === 0) return;
    const headers = 'ID,Tanggal,Jam Kerja,Tarif Per Jam,Total Gaji (IDR),Catatan\n';
    const rows = entries
      .map(
        (e) =>
          `"${e.id}","${e.date}","${e.hours}","${e.rate}","${e.totalSalary}","${(e.note || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `riwayat_gaji_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy text summary
  const handleCopySummary = () => {
    if (entries.length === 0) return;
    const summaryLines = [
      '--- REKAP RIWAYAT GAJI PER JAM ---',
      `Total Sesi Tercatat: ${totalEntries}`,
      `Total Jam Kerja: ${formatJam(totalHours)} Jam`,
      `Total Gaji Akumulasi: ${formatRupiah(totalSalary)}`,
      '----------------------------------',
      ...entries.map(
        (e, i) =>
          `${i + 1}. ${formatTanggalIndonesia(e.date)} | ${formatJam(e.hours)} jam | ${formatRupiah(
            e.totalSalary
          )}${e.note ? ` (${e.note})` : ''}`
      ),
    ];
    navigator.clipboard.writeText(summaryLines.join('\n'));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div id="riwayat" className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Penyimpanan Lokal (Local Storage)
          </span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" />
            <span>Riwayat Perhitungan Gaji</span>
          </h3>
        </div>

        {entries.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSummary ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Salin Rekap</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Unduh data dalam format CSV Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Hapus Semua</span>
            </button>
          </div>
        )}
      </div>

      {/* Aggregate Statistics Cards */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Total Sesi</span>
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {totalEntries} <span className="text-xs font-normal text-slate-500">Hari/Sesi</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Akumulasi Jam</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {formatJam(totalHours)} <span className="text-xs font-normal text-slate-500">Jam</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/60">
            <div className="flex items-center justify-between text-emerald-800 mb-1">
              <span className="text-[11px] font-semibold">Total Pendapatan</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {formatRupiah(totalSalary)}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Rata-rata / Sesi</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {formatJam(avgHours)} <span className="text-xs font-normal text-slate-500">Jam/Hari</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      {entries.length > 3 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan tanggal atau catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Belum Ada Riwayat Perhitungan</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Masukkan jam kerja pada kalkulator di atas lalu klik tombol <strong>"Simpan Riwayat"</strong> untuk mencatat penghasilan Anda.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500">
          Tidak ada riwayat yang cocok dengan pencarian "{searchTerm}".
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl overflow-hidden">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="p-4 sm:p-4.5 bg-white hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div
                onClick={() => onSelectEntryToForm(entry)}
                className="cursor-pointer flex-1 space-y-1"
                title="Klik untuk memuat kembali data ini ke formulir"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {formatTanggalIndonesia(entry.date)}
                  </span>
                  {entry.note && (
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5">
                      {entry.note}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>
                    Durasi: <strong className="text-slate-700">{formatJam(entry.hours)} Jam</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Tarif: <strong className="text-slate-700">{formatRupiah(entry.rate || TARIF_PER_JAM)}/Jam</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-base sm:text-lg font-bold text-emerald-700 font-mono tabular-nums">
                    {formatRupiah(entry.totalSalary)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {formatJam(entry.hours)} × {formatRupiah(entry.rate || TARIF_PER_JAM)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus riwayat ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">Hapus Seluruh Riwayat?</h4>
              <p className="text-xs text-slate-500">
                Tindakan ini akan menghapus semua {entries.length} data riwayat perhitungan yang tersimpan di browser ini. Data yang sudah dihapus tidak dapat dipulihkan kembali.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setShowClearModal(false);
                }}
                className="flex-1 min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
