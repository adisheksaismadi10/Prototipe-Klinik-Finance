import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Expense, ExpenseCategory } from '../../types/finance';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { RecordExpenseModal } from './RecordExpenseModal';
import { 
  Search, 
  Plus, 
  ArrowUpRight, 
  Trash2, 
  Eye, 
  Building2, 
  AlertCircle,
  X
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { filteredExpenses, deleteExpense, settings } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedExpenseForDetail, setSelectedExpenseForDetail] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Filtered expenses
  const displayedExpenses = useMemo(() => {
    return filteredExpenses.filter(e => {
      const matchSearch =
        e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'all' || e.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [filteredExpenses, searchQuery, selectedCategory]);

  const totalFilteredAmount = displayedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Find top category
  const topCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    displayedExpenses.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + e.amount;
    });
    let topName = '-';
    let topVal = 0;
    Object.entries(counts).forEach(([cat, val]) => {
      if (val > topVal) {
        topVal = val;
        topName = cat;
      }
    });
    return { name: topName, amount: topVal };
  }, [displayedExpenses]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Catatan Pengeluaran Operasional Klinik
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan beban obat, peralatan medis, honor staf/dokter, utilitas listrik, dan logistik
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRecordModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pengeluaran Baru</span>
          </button>
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100">
            <span className="text-rose-700 block">Total Pengeluaran (Tersaring):</span>
            <strong className="text-rose-900 font-mono text-sm">{formatRupiah(totalFilteredAmount)}</strong>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Beban Tertinggi:</span>
            <strong className="text-slate-900 text-sm truncate block" title={topCategory.name}>
              {topCategory.name} {topCategory.amount > 0 && `(${formatRupiah(topCategory.amount)})`}
            </strong>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Jumlah Bukti Transaksi:</span>
            <strong className="text-slate-900 font-mono text-sm">{displayedExpenses.length} Pengeluaran</strong>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari deskripsi, no. pengeluaran (EXP-)..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-slate-50/50"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5 text-xs self-start md:self-auto">
          <span className="text-slate-500">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
          >
            <option value="all">Semua Kategori</option>
            {settings.categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {displayedExpenses.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-2">
            <ArrowUpRight className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">Tidak ada transaksi pengeluaran</p>
            <p>Silakan sesuaikan filter periode atau catat transaksi pengeluaran baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="py-3 px-3.5">No. Transaksi</th>
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Deskripsi Pengeluaran</th>
                  <th className="py-3 px-3">Metode Bayar</th>
                  <th className="py-3 px-3 text-right">Nominal Biaya</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedExpenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {expense.id}
                    </td>

                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {formatDateIndo(expense.date)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                        {expense.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-900 max-w-[240px] truncate" title={expense.description}>
                      <div className="font-medium truncate">{expense.description}</div>
                      {expense.notes && (
                        <div className="text-[11px] text-slate-400 truncate">{expense.notes}</div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {expense.paymentMethod}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-700 tabular-nums whitespace-nowrap">
                      {formatRupiah(expense.amount)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedExpenseForDetail(expense)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Lihat Detail Pengeluaran"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpenseToDelete(expense)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Expense Modal */}
      <RecordExpenseModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />

      {/* Expense Detail Modal */}
      {selectedExpenseForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-rose-700 block">
                  {selectedExpenseForDetail.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base">Rincian Transaksi Pengeluaran</h3>
              </div>
              <button
                onClick={() => setSelectedExpenseForDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tanggal:</span>
                <span className="font-medium text-slate-900">{formatDateIndo(selectedExpenseForDetail.date, 'long')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kategori:</span>
                <span className="font-semibold text-slate-800">{selectedExpenseForDetail.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="text-slate-800">{selectedExpenseForDetail.paymentMethod}</span>
              </div>
              <div className="py-1 border-b border-slate-100">
                <span className="text-slate-500 block mb-0.5">Deskripsi:</span>
                <span className="text-slate-900 font-medium block">{selectedExpenseForDetail.description}</span>
              </div>
              {selectedExpenseForDetail.notes && (
                <div className="py-1 border-b border-slate-100">
                  <span className="text-slate-500 block mb-0.5">Catatan / Vendor:</span>
                  <span className="text-slate-700 block">{selectedExpenseForDetail.notes}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-sm font-bold border-t border-slate-200">
                <span className="text-slate-900">Total Nominal:</span>
                <span className="font-mono text-rose-700 tabular-nums">{formatRupiah(selectedExpenseForDetail.amount)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedExpenseForDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Hapus Transaksi Pengeluaran?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda akan menghapus pengeluaran <strong>{expenseToDelete.id}</strong> sebesar{' '}
              <strong>{formatRupiah(expenseToDelete.amount)}</strong>. Saldo kas ilustratif akan disesuaikan kembali.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExpenseToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteExpense(expenseToDelete.id);
                  setExpenseToDelete(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
