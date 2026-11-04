export const TARIF_PER_JAM = 15000;

/**
 * Format nominal angka ke format Rupiah Indonesia (IDR)
 * Contoh: Rp15.000, Rp120.000, Rp1.200.000
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp0';
  }
  // Math.round for currency precision
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(Math.abs(rounded));

  const prefix = rounded < 0 ? '-Rp' : 'Rp';
  return `${prefix}${formatted}`;
}

/**
 * Format jam dalam desimal dengan pemisah koma Indonesia
 * Contoh: 7.5 -> "7,5", 8 -> "8"
 */
export function formatJam(hours: number): string {
  if (isNaN(hours) || hours === null || hours === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(hours);
}

/**
 * Parsing input jam kerja dari string yang bisa berisi titik atau koma
 * Contoh: "7,5" -> 7.5, "8" -> 8, "-2" -> null, "abc" -> null
 */
export function parseHoursInput(input: string): { value: number | null; error?: string } {
  if (!input || input.trim() === '') {
    return { value: null, error: 'Jumlah jam kerja tidak boleh kosong.' };
  }

  // Replace comma with dot
  const normalized = input.trim().replace(',', '.');
  const parsed = Number(normalized);

  if (isNaN(parsed)) {
    return { value: null, error: 'Format jam kerja tidak valid. Masukkan angka (misal: 8 atau 7,5).' };
  }

  if (parsed <= 0) {
    return { value: null, error: 'Jumlah jam kerja harus lebih besar dari 0 (tidak boleh angka negatif atau nol).' };
  }

  if (parsed > 24) {
    return {
      value: parsed,
      error: 'Peringatan: Jam kerja harian biasanya maksimal 24 jam dalam 1 hari.',
    };
  }

  return { value: parsed };
}

/**
 * Format tanggal Indonesia ramah pengguna
 * Contoh: "Rabu, 4 Nov 2026"
 */
export function formatTanggalIndonesia(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Konversi angka ke kalimat Terbilang Bahasa Indonesia
 * Contoh: 15000 -> "Lima Belas Ribu Rupiah"
 */
export function angkaKeTerbilang(nominal: number): string {
  if (nominal <= 0 || isNaN(nominal)) {
    return 'Nol Rupiah';
  }

  const satuan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  function convert(n: number): string {
    if (n < 12) {
      return satuan[n];
    } else if (n < 20) {
      return convert(n - 10) + ' Belas';
    } else if (n < 100) {
      return convert(Math.floor(n / 10)) + ' Puluh ' + convert(n % 10);
    } else if (n < 200) {
      return 'Seratus ' + convert(n - 100);
    } else if (n < 1000) {
      return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    } else if (n < 2000) {
      return 'Seribu ' + convert(n - 1000);
    } else if (n < 1000000) {
      return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    } else if (n < 1000000000) {
      return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    } else if (n < 1000000000000) {
      return convert(Math.floor(n / 1000000000)) + ' Miliar ' + convert(n % 1000000000);
    }
    return '';
  }

  const terbilang = convert(Math.floor(nominal)).replace(/\s+/g, ' ').trim();
  return `${terbilang} Rupiah`;
}
