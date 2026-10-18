import { PeriodFilter } from '../types/finance';

/**
 * Format numeric value to Indonesian Rupiah representation
 * e.g., 1250000 -> "Rp 1.250.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(absVal);

  return `${isNegative ? '-' : ''}Rp ${formatted}`;
}

/**
 * Format ISO date string (YYYY-MM-DD) to Indonesian formatted date string
 * e.g., "2024-10-18" -> "18 Okt 2024" or "18 Oktober 2024"
 */
export function formatDateIndo(dateStr: string, mode: 'short' | 'long' = 'short'): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);

  if (isNaN(d.getTime())) return dateStr;

  const monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  const monthsLong = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const monthName = mode === 'short' ? monthsShort[month] : monthsLong[month];
  return `${day} ${monthName} ${year}`;
}

/**
 * Checks whether a given ISO date falls within the selected period filter
 */
export function isDateInPeriod(
  dateStr: string,
  period: PeriodFilter,
  customStart?: string,
  customEnd?: string,
  refDate: Date = new Date('2024-10-18')
): boolean {
  if (period === 'semua') return true;
  if (!dateStr) return false;

  const parts = dateStr.split('-');
  if (parts.length !== 3) return false;
  const itemDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

  const refYear = refDate.getFullYear();
  const refMonth = refDate.getMonth();
  const refDay = refDate.getDate();

  switch (period) {
    case 'hari_ini': {
      return (
        itemDate.getFullYear() === refYear &&
        itemDate.getMonth() === refMonth &&
        itemDate.getDate() === refDay
      );
    }
    case 'bulan_ini': {
      return (
        itemDate.getFullYear() === refYear &&
        itemDate.getMonth() === refMonth
      );
    }
    case 'bulan_lalu': {
      const prevMonth = refMonth === 0 ? 11 : refMonth - 1;
      const prevYear = refMonth === 0 ? refYear - 1 : refYear;
      return (
        itemDate.getFullYear() === prevYear &&
        itemDate.getMonth() === prevMonth
      );
    }
    case 'tahun_ini': {
      return itemDate.getFullYear() === refYear;
    }
    case 'kustom': {
      if (!customStart && !customEnd) return true;
      const itemTime = itemDate.getTime();
      let afterStart = true;
      let beforeEnd = true;

      if (customStart) {
        const sParts = customStart.split('-');
        const sDate = new Date(parseInt(sParts[0], 10), parseInt(sParts[1], 10) - 1, parseInt(sParts[2], 10));
        afterStart = itemTime >= sDate.getTime();
      }
      if (customEnd) {
        const eParts = customEnd.split('-');
        const eDate = new Date(parseInt(eParts[0], 10), parseInt(eParts[1], 10) - 1, parseInt(eParts[2], 10), 23, 59, 59);
        beforeEnd = itemTime <= eDate.getTime();
      }
      return afterStart && beforeEnd;
    }
    default:
      return true;
  }
}

/**
 * Utility to download array of rows as CSV in browser
 */
export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (cell: string | number) => {
    const str = String(cell ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map(row => row.map(escapeCell).join(','))
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
