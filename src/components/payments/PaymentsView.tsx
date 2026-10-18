import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Payment, PoliType, PaymentMethod } from '../../types/finance';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { RecordPaymentModal } from './RecordPaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { 
  Search, 
  Plus, 
  CreditCard, 
  Eye, 
  ArrowDownLeft, 
  FileText,
  Building2,
  Printer
} from 'lucide-react';

interface PaymentsViewProps {
  prefillInvoiceId?: string;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ prefillInvoiceId }) => {
  const { filteredPayments, settings } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoli, setSelectedPoli] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  
  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(!!prefillInvoiceId);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);

  // Filtered payments
  const displayedPayments = useMemo(() => {
    return filteredPayments.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPoli = selectedPoli === 'all' || p.poli === selectedPoli;
      const matchMethod = selectedMethod === 'all' || p.paymentMethod === selectedMethod;

      return matchSearch && matchPoli && matchMethod;
    });
  }, [filteredPayments, searchQuery, selectedPoli, selectedMethod]);

  const totalFilteredAmount = displayedPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Riwayat Pembayaran Diterima (Penerimaan Kas)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan uang masuk riil dari pasien, metode transaksi, dan penerbitan kwitansi pembayaran
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRecordModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pembayaran Baru</span>
          </button>
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100">
            <span className="text-teal-700 block">Total Uang Diterima (Tersaring):</span>
            <strong className="text-teal-900 font-mono text-sm">{formatRupiah(totalFilteredAmount)}</strong>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Frekuensi Transaksi:</span>
            <strong className="text-slate-900 font-mono text-sm">{displayedPayments.length} Transaksi</strong>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Rata-rata Transaksi:</span>
            <strong className="text-slate-900 font-mono text-sm">
              {displayedPayments.length > 0
                ? formatRupiah(Math.round(totalFilteredAmount / displayedPayments.length))
                : 'Rp 0'}
            </strong>
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
            placeholder="Cari no. transaksi (TRX-), faktur, pasien..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-slate-50/50"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Poli Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Poli:</span>
            <select
              value={selectedPoli}
              onChange={e => setSelectedPoli(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
            >
              <option value="all">Semua Poli</option>
              {settings.polis.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Method Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Metode:</span>
            <select
              value={selectedMethod}
              onChange={e => setSelectedMethod(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
            >
              <option value="all">Semua Metode</option>
              {settings.paymentMethods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {displayedPayments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-2">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">Tidak ada transaksi pembayaran</p>
            <p>Silakan sesuaikan filter periode atau catat pembayaran baru dari tagihan terbuka.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="py-3 px-3.5">No. Transaksi</th>
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">No. Tagihan</th>
                  <th className="py-3 px-3">Nama Pasien</th>
                  <th className="py-3 px-3">Poli</th>
                  <th className="py-3 px-3">Metode Pembayaran</th>
                  <th className="py-3 px-3 text-right">Nominal Diterima</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-medium text-slate-900">
                      {payment.id}
                    </td>

                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {formatDateIndo(payment.date)}
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-teal-700 whitespace-nowrap">
                      {payment.invoiceId}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{payment.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{payment.patientId}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {payment.poli}
                    </td>

                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium">
                        {payment.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-teal-800 tabular-nums">
                      {formatRupiah(payment.amount)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentForReceipt(payment)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-2xs"
                        title="Buka & Cetak Kwitansi Resmi"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Kwitansi</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        prefillInvoiceId={prefillInvoiceId}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        payment={selectedPaymentForReceipt}
        isOpen={!!selectedPaymentForReceipt}
        onClose={() => setSelectedPaymentForReceipt(null)}
      />
    </div>
  );
};
