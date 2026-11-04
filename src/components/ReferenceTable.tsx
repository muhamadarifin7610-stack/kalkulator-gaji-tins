import React from 'react';
import { Table, ArrowRight, Sparkles } from 'lucide-react';
import { TARIF_PER_JAM, formatRupiah, formatJam } from '../utils/formatters.ts';

interface ReferenceTableProps {
  onSelectHours: (hoursStr: string) => void;
  activeHours: number;
}

export const ReferenceTable: React.FC<ReferenceTableProps> = ({
  onSelectHours,
  activeHours,
}) => {
  const referenceData = [
    { hours: 1, label: '1 Jam (Dasar)', desc: 'Tarif dasar 1 jam kerja' },
    { hours: 2, label: '2 Jam', desc: 'Pekerjaan singkat / freelance' },
    { hours: 4, label: '4 Jam (Paruh Waktu)', desc: 'Setengah hari kerja / part-time' },
    { hours: 5, label: '5 Jam', desc: 'Shift kasir / asisten paruh waktu' },
    { hours: 6, label: '6 Jam', desc: 'Shift kerja moderat' },
    { hours: 7.5, label: '7,5 Jam', desc: 'Shift fleksibel dengan istirahat' },
    { hours: 8, label: '8 Jam (Shift Standar Penuh)', desc: 'Standar jam kerja harian UU' },
    { hours: 9, label: '9 Jam (Lembur 1 Jam)', desc: 'Jam kerja standar + 1 jam lembur' },
    { hours: 10, label: '10 Jam (Lembur)', desc: 'Shift panjang dengan kompensasi' },
    { hours: 12, label: '12 Jam (Shift Panjang)', desc: 'Maksimum shift operasional / security' },
  ];

  return (
    <div id="tabel-tarif" className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-7 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tabel Referensi Resmi
          </span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Table className="w-4 h-4 text-slate-700" />
            <span>Daftar Acuan Gaji Berdasarkan Jam Kerja</span>
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          Klik baris mana saja untuk mengisi kalkulator otomatis
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
              <th className="py-3 px-4 rounded-l-xl">Jumlah Jam Kerja</th>
              <th className="py-3 px-4">Rumus Perhitungan</th>
              <th className="py-3 px-4 text-right">Total Gaji</th>
              <th className="py-3 px-4 text-center rounded-r-xl w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {referenceData.map((item) => {
              const total = item.hours * TARIF_PER_JAM;
              const isActive = Math.abs(activeHours - item.hours) < 0.01;
              const hoursFormatted = String(item.hours).replace('.', ',');

              return (
                <tr
                  key={item.hours}
                  onClick={() => onSelectHours(hoursFormatted)}
                  className={`group transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50/60 font-semibold'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono tabular-nums">
                        {formatJam(item.hours)} Jam
                      </span>
                      {item.hours === 8 && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Standar
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                    {formatJam(item.hours)} × {formatRupiah(TARIF_PER_JAM)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="text-base font-bold text-emerald-700 font-mono tabular-nums">
                      {formatRupiah(total)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHours(hoursFormatted);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <span>Pilih</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Semua nilai dihitung murni dengan formula resmi: <strong>Jumlah Jam Kerja × Rp15.000</strong> tanpa potongan tersembunyi.
        </span>
      </div>
    </div>
  );
};
