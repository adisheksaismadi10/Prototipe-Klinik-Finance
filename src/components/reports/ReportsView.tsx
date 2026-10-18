import React, { useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { formatRupiah, formatDateIndo, downloadCSV } from '../../utils/formatters';
import { PoliType, ExpenseCategory } from '../../types/finance';
import { 
  BarChart3, 
  Download, 
  Printer, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Scale, 
  Clock, 
  Building2, 
  Layers,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    periodFilter,
    filteredPayments,
    filteredExpenses,
    filteredInvoices,
    totalPaymentsInPeriod,
    totalExpensesInPeriod,
    netCashFlowInPeriod,
    totalReceivables,
    settings
  } = useClinic();

  const getPeriodLabel = () => {
    switch (periodFilter) {
      case 'hari_ini': return 'Hari Ini (18 Okt 2024)';
      case 'bulan_ini': return 'Bulan Ini (Oktober 2024)';
      case 'bulan_lalu': return 'Bulan Lalu (September 2024)';
      case 'tahun_ini': return 'Tahun Ini (2024)';
      case 'kustom': return 'Rentang Tanggal Kustom';
      default: return 'Semua Periode Tercatat';
    }
  };

  // 1. Poli Breakdown for payments
  const poliReport = useMemo(() => {
    const map: Record<PoliType, { total: number; count: number }> = {
      'Poli Umum': { total: 0, count: 0 },
      'Poli Gigi': { total: 0, count: 0 },
      'Poli Kandungan': { total: 0, count: 0 }
    };

    filteredPayments.forEach(p => {
      if (map[p.poli]) {
        map[p.poli].total += p.amount;
        map[p.poli].count += 1;
      }
    });

    return map;
  }, [filteredPayments]);

  // 2. Expense Category Breakdown
  const expenseReport = useMemo(() => {
    const map: Record<string, number> = {};
    settings.categories.forEach(cat => {
      map[cat] = 0;
    });

    filteredExpenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredExpenses, settings.categories]);

  // 3. Combined ledger rows
  const combinedTransactions = useMemo(() => {
    const rows: Array<{
      date: string;
      id: string;
      type: 'Penerimaan' | 'Pengeluaran';
      partyOrCategory: string;
      description: string;
      method: string;
      amountIn: number;
      amountOut: number;
    }> = [];

    filteredPayments.forEach(p => {
      rows.push({
        date: p.date,
        id: p.id,
        type: 'Penerimaan',
        partyOrCategory: p.poli,
        description: `Pembayaran ${p.invoiceId} - Pasien: ${p.patientName}`,
        method: p.paymentMethod,
        amountIn: p.amount,
        amountOut: 0
      });
    });

    filteredExpenses.forEach(e => {
      rows.push({
        date: e.date,
        id: e.id,
        type: 'Pengeluaran',
        partyOrCategory: e.category,
        description: e.description,
        method: e.paymentMethod,
        amountIn: 0,
        amountOut: e.amount
      });
    });

    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredPayments, filteredExpenses]);

  // Total Billed for reference
  const totalBilledInPeriod = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Tanggal',
      'No. Transaksi',
      'Jenis Aliran',
      'Poli / Kategori',
      'Deskripsi & Pasien',
      'Metode Pembayaran',
      'Penerimaan (Rp)',
      'Pengeluaran (Rp)'
    ];

    const rows = combinedTransactions.map(item => [
      item.date,
      item.id,
      item.type,
      item.partyOrCategory,
      item.description,
      item.method,
      item.amountIn,
      item.amountOut
    ]);

    const filename = `Laporan_Keuangan_Klinik_${periodFilter}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(filename, headers, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Laporan Ringkasan Operasional Keuangan
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-teal-50 text-teal-800">
                {getPeriodLabel()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rekapitulasi penerimaan riil kas, pengeluaran, piutang, dan kinerja finansial 3 poli
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-start gap-2.5 text-xs text-slate-600">
          <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <strong>Catatan Kebijakan:</strong> Laporan ini menyajikan arus kas operasional (kas masuk riil vs kas keluar), bukan laporan laba rugi akuntansi formal. Nilai tagihan diterbitkan ({formatRupiah(totalBilledInPeriod)}) tidak disamakan dengan penerimaan kas ({formatRupiah(totalPaymentsInPeriod)}).
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Penerimaan Aktual */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Penerimaan Kas Riil</span>
            <div className="w-7 h-7 rounded-md bg-teal-50 flex items-center justify-center text-teal-700">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatRupiah(totalPaymentsInPeriod)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            Dari {filteredPayments.length} bukti pembayaran
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total Pengeluaran</span>
            <div className="w-7 h-7 rounded-md bg-rose-50 flex items-center justify-center text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatRupiah(totalExpensesInPeriod)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            Dari {filteredExpenses.length} transaksi beban
          </div>
        </div>

        {/* Arus Kas Bersih (Selisih) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Selisih Kas Bersih</span>
            <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-700">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${
            netCashFlowInPeriod >= 0 ? 'text-teal-700' : 'text-rose-600'
          }`}>
            {formatRupiah(netCashFlowInPeriod)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            {netCashFlowInPeriod >= 0 ? 'Surplus operasional' : 'Defisit operasional'}
          </div>
        </div>

        {/* Total Piutang Pasien */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Piutang Belum Lunas</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-950 font-mono tabular-nums">
            {formatRupiah(totalReceivables)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            Saldo piutang pasien kumulatif
          </div>
        </div>
      </div>

      {/* 2 Breakdown Columns: Poli Revenue vs Expense Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Poli Performance Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-slate-900 text-sm">Rincian Penerimaan Berdasarkan Poli</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800">
              {formatRupiah(totalPaymentsInPeriod)}
            </span>
          </div>

          <div className="space-y-3">
            {(['Poli Umum', 'Poli Gigi', 'Poli Kandungan'] as PoliType[]).map(poli => {
              const data = poliReport[poli];
              const pct = totalPaymentsInPeriod > 0
                ? Math.round((data.total / totalPaymentsInPeriod) * 100)
                : 0;

              return (
                <div key={poli} className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">{poli}</span>
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      {formatRupiah(data.total)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-teal-600 rounded-full"
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{data.count} transaksi pembayaran</span>
                    <span>{pct}% total penerimaan</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">Rincian Pengeluaran Berdasarkan Kategori</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800">
              {formatRupiah(totalExpensesInPeriod)}
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {expenseReport.map(([cat, val]) => {
              const pct = totalExpensesInPeriod > 0
                ? Math.round((val / totalExpensesInPeriod) * 100)
                : 0;

              return (
                <div key={cat} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-medium text-slate-800 block truncate">{cat}</span>
                    <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-rose-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900 tabular-nums block">
                      {formatRupiah(val)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comprehensive Ledger Table of Period Transactions */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Buku Kas Transaksi Periode Terpilih</h3>
            <p className="text-xs text-slate-500">
              Daftar kronologis mutasi kas masuk (pembayaran) dan kas keluar (pengeluaran)
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {combinedTransactions.length} mutasi
          </span>
        </div>

        {combinedTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Tidak ada transaksi tercatat pada periode ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="py-2.5 px-4">Tanggal</th>
                  <th className="py-2.5 px-3">No. Transaksi</th>
                  <th className="py-2.5 px-3">Jenis Aliran</th>
                  <th className="py-2.5 px-3">Poli / Kategori</th>
                  <th className="py-2.5 px-3">Deskripsi Transaksi</th>
                  <th className="py-2.5 px-3">Metode</th>
                  <th className="py-2.5 px-3 text-right">Penerimaan</th>
                  <th className="py-2.5 px-4 text-right">Pengeluaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {combinedTransactions.map(item => {
                  const isPay = item.type === 'Penerimaan';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDateIndo(item.date)}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isPay ? 'bg-teal-50 text-teal-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        {item.partyOrCategory}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 max-w-[220px] truncate" title={item.description}>
                        {item.description}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {item.method}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-teal-700 whitespace-nowrap">
                        {item.amountIn > 0 ? formatRupiah(item.amountIn) : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-rose-600 whitespace-nowrap">
                        {item.amountOut > 0 ? formatRupiah(item.amountOut) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-xs">
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-slate-800 text-right">
                    Total Mutasi Periode:
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-teal-800 tabular-nums">
                    {formatRupiah(totalPaymentsInPeriod)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700 tabular-nums">
                    {formatRupiah(totalExpensesInPeriod)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
