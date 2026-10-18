import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  Wallet, 
  TrendingUp, 
  Building2, 
  Plus, 
  ChevronRight,
  AlertTriangle,
  Receipt,
  CreditCard
} from 'lucide-react';
import { PoliType } from '../../types/finance';

interface DashboardViewProps {
  onOpenCreateInvoice: () => void;
  onOpenRecordPayment: (prefillInvoiceId?: string) => void;
  onOpenRecordExpense: () => void;
  onOpenCreatePatient: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenCreateInvoice,
  onOpenRecordPayment,
  onOpenRecordExpense,
  onOpenCreatePatient
}) => {
  const {
    periodFilter,
    filteredPayments,
    filteredExpenses,
    totalPaymentsInPeriod,
    totalExpensesInPeriod,
    netCashFlowInPeriod,
    totalReceivables,
    illustrativeCashBalance,
    invoices,
    settings,
    setActiveTab,
    currentRole
  } = useClinic();

  // Period label for readable display
  const getPeriodLabel = () => {
    switch (periodFilter) {
      case 'hari_ini': return 'Hari Ini (18 Okt 2024)';
      case 'bulan_ini': return 'Bulan Ini (Oktober 2024)';
      case 'bulan_lalu': return 'Bulan Lalu (September 2024)';
      case 'tahun_ini': return 'Tahun Ini (2024)';
      case 'kustom': return 'Rentang Kustom';
      default: return 'Semua Periode';
    }
  };

  // Unpaid or partially paid invoices (sorted by date desc)
  const unpaidInvoices = invoices
    .filter(inv => inv.status !== 'Lunas')
    .slice(0, 5);

  // Poli Breakdown for payments in period
  const poliSummary = React.useMemo(() => {
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

  // Monthly aggregated data for trend visualization (Aug, Sep, Oct 2024)
  const monthlyTrends = [
    { month: 'Agustus 2024', label: 'Agu', payments: 1230000, expenses: 6500000 },
    { month: 'September 2024', label: 'Sep', payments: 2070000, expenses: 7870000 },
    { 
      month: 'Oktober 2024', 
      label: 'Okt', 
      payments: filteredPayments.filter(p => p.date.startsWith('2024-10')).reduce((s, p) => s + p.amount, 0),
      expenses: filteredExpenses.filter(e => e.date.startsWith('2024-10')).reduce((s, e) => s + e.amount, 0)
    }
  ];

  // Combined recent activities (last 5 payments + last 5 expenses sorted by date)
  const recentActivities = React.useMemo(() => {
    const list: Array<{
      id: string;
      type: 'payment' | 'expense';
      date: string;
      title: string;
      subtitle: string;
      amount: number;
      method: string;
      poliOrCategory: string;
    }> = [];

    filteredPayments.forEach(p => {
      list.push({
        id: p.id,
        type: 'payment',
        date: p.date,
        title: p.patientName,
        subtitle: `Pelunasan ${p.invoiceId} (${p.poli})`,
        amount: p.amount,
        method: p.paymentMethod,
        poliOrCategory: p.poli
      });
    });

    filteredExpenses.forEach(e => {
      list.push({
        id: e.id,
        type: 'expense',
        date: e.date,
        title: e.description,
        subtitle: `${e.category}`,
        amount: e.amount,
        method: e.paymentMethod,
        poliOrCategory: e.category
      });
    });

    return list.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  }, [filteredPayments, filteredExpenses]);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice for Prototype Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Periode Aktif: {getPeriodLabel()}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Menampilkan metrik transaksi aktual yang tercatat pada sistem keuangan 3 poli.
          </p>
        </div>

        {/* Quick Action Buttons for Admin & Owner */}
        <div className="flex flex-wrap items-center gap-2">
          {currentRole === 'admin' ? (
            <>
              <button
                type="button"
                onClick={onOpenCreateInvoice}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Tagihan Baru</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenRecordPayment()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-teal-700" />
                <span>Catat Pembayaran</span>
              </button>
              <button
                type="button"
                onClick={onOpenRecordExpense}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                <span>Catat Pengeluaran</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('laporan')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span>Lihat Laporan Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pembayaran Diterima (Penerimaan Aktual) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Penerimaan Aktual</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {formatRupiah(totalPaymentsInPeriod)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Uang kas masuk</span>
            <span className="font-mono">{filteredPayments.length} transaksi</span>
          </div>
        </div>

        {/* Card 2: Total Pengeluaran */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total Pengeluaran</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {formatRupiah(totalExpensesInPeriod)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Biaya & utilitas</span>
            <span className="font-mono">{filteredExpenses.length} transaksi</span>
          </div>
        </div>

        {/* Card 3: Total Piutang Pasien */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total Piutang Pasien</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-950 font-mono tabular-nums tracking-tight">
            {formatRupiah(totalReceivables)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Tagihan belum lunas</span>
            <span className="font-medium text-amber-700">
              {invoices.filter(i => i.status !== 'Lunas').length} invoice
            </span>
          </div>
        </div>

        {/* Card 4: Saldo Kas Ilustratif */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Saldo Kas Ilustratif</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {formatRupiah(illustrativeCashBalance)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2 leading-tight">
            <span>Simulasi (Saldo awal: {formatRupiah(settings.initialBalance)})</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Trend vs Poli Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Trend Visualization */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Arus Kas Bulanan (Penerimaan vs Pengeluaran)
              </h2>
              <p className="text-xs text-slate-500">
                Perbandingan uang masuk riil dan biaya operasional klinik 3 bulan terakhir
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-teal-600" />
                <span className="text-slate-600">Penerimaan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-rose-400" />
                <span className="text-slate-600">Pengeluaran</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-4 pt-2">
            {monthlyTrends.map((item, idx) => {
              const maxVal = Math.max(item.payments, item.expenses, 8000000);
              const payPercent = Math.min(100, Math.round((item.payments / maxVal) * 100));
              const expPercent = Math.min(100, Math.round((item.expenses / maxVal) * 100));

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.month}</span>
                    <div className="flex items-center gap-3 font-mono tabular-nums">
                      <span className="text-teal-700 font-medium">+{formatRupiah(item.payments)}</span>
                      <span className="text-rose-600 font-medium">-{formatRupiah(item.expenses)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {/* Payment Bar */}
                    <div className="h-4 bg-slate-100 rounded overflow-hidden flex">
                      <div
                        style={{ width: `${Math.max(5, payPercent)}%` }}
                        className="bg-teal-600 rounded transition-all duration-300"
                        title={`Penerimaan: ${formatRupiah(item.payments)}`}
                      />
                    </div>
                    {/* Expense Bar */}
                    <div className="h-4 bg-slate-100 rounded overflow-hidden flex">
                      <div
                        style={{ width: `${Math.max(5, expPercent)}%` }}
                        className="bg-rose-400 rounded transition-all duration-300"
                        title={`Pengeluaran: ${formatRupiah(item.expenses)}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-xs text-slate-600">
            <span>
              Selisih Operasional Periode Ini:{' '}
              <strong className={netCashFlowInPeriod >= 0 ? 'text-teal-700' : 'text-rose-600'}>
                {formatRupiah(netCashFlowInPeriod)}
              </strong>
            </span>
            <button
              onClick={() => setActiveTab('laporan')}
              className="text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1"
            >
              Lihat Detail Laporan <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Revenue Breakdown by 3 Poli */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">
                Penerimaan per Poli
              </h2>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Distribusi pembayaran pasien pada periode {getPeriodLabel()}
            </p>

            <div className="space-y-4">
              {(['Poli Umum', 'Poli Gigi', 'Poli Kandungan'] as PoliType[]).map(poli => {
                const data = poliSummary[poli];
                const percentage = totalPaymentsInPeriod > 0
                  ? Math.round((data.total / totalPaymentsInPeriod) * 100)
                  : 0;

                const getPoliColor = () => {
                  if (poli === 'Poli Umum') return 'bg-emerald-600';
                  if (poli === 'Poli Gigi') return 'bg-cyan-600';
                  return 'bg-teal-600';
                };

                return (
                  <div key={poli} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900">{poli}</span>
                        <span className="text-slate-400 ml-1.5">({data.count} bayar)</span>
                      </div>
                      <span className="font-mono font-bold text-slate-800 tabular-nums">
                        {formatRupiah(data.total)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full ${getPoliColor()} rounded-full transition-all duration-300`}
                      />
                    </div>

                    <div className="flex justify-end text-[11px] text-slate-500 font-mono">
                      <span>{percentage}% kontribusi</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Total Penerimaan Poli</span>
            <strong className="font-mono text-slate-900">{formatRupiah(totalPaymentsInPeriod)}</strong>
          </div>
        </div>
      </div>

      {/* Bottom Section: Unpaid Invoices vs Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unpaid Invoices (Piutang Terbuka) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Tagihan Belum Lunas
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded">
                  {invoices.filter(i => i.status !== 'Lunas').length} tertunda
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar pasien dengan saldo piutang yang masih terbuka
              </p>
            </div>

            <button
              onClick={() => setActiveTab('tagihan')}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 inline-flex items-center"
            >
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {unpaidInvoices.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
              Semua tagihan telah lunas. Tidak ada piutang terbuka saat ini.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 pb-2 border-b border-slate-100 font-medium">
                    <th className="py-2 pr-3">No. Tagihan</th>
                    <th className="py-2 px-2">Pasien</th>
                    <th className="py-2 px-2">Poli</th>
                    <th className="py-2 px-2 text-right">Sisa Tagihan</th>
                    <th className="py-2 pl-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unpaidInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 pr-3 font-mono font-medium text-slate-800">
                        {inv.id}
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="font-semibold text-slate-900">{inv.patientName}</div>
                        <div className="text-[11px] text-slate-400">{formatDateIndo(inv.date)}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-[11px] text-slate-600">{inv.poli}</span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-amber-900 tabular-nums">
                        {formatRupiah(inv.remainingAmount)}
                      </td>
                      <td className="py-2.5 pl-3 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenRecordPayment(inv.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors shadow-2xs"
                        >
                          Bayar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions Feed */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Transaksi Terbaru
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aktivitas penerimaan & pengeluaran terkini pada periode terpilih
              </p>
            </div>
            <button
              onClick={() => setActiveTab('pembayaran')}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 inline-flex items-center"
            >
              Lihat Kas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
              Belum ada transaksi pada periode terpilih.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map(item => {
                const isPay = item.type === 'payment';
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isPay ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {isPay ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                          <span>{formatDateIndo(item.date)}</span>
                          <span>·</span>
                          <span>{item.subtitle}</span>
                          <span>·</span>
                          <span className="font-medium text-slate-700">{item.method}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right pl-3 shrink-0">
                      <div className={`text-xs font-bold font-mono tabular-nums ${
                        isPay ? 'text-teal-700' : 'text-slate-900'
                      }`}>
                        {isPay ? '+' : '-'}{formatRupiah(item.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.id}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
