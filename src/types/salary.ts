export interface WorkEntry {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  rate: number; // 15000
  totalSalary: number;
  note: string;
  timestamp: number;
}

export interface CalculationResult {
  hours: number;
  rate: number;
  totalSalary: number;
  formattedSalary: string;
  terbilang: string;
}

export interface Projections {
  daily: number;
  weekly: number;
  monthly: number;
  daysPerWeek: number;
}
