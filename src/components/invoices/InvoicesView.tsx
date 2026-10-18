import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice, PoliType, InvoiceStatus } from '../../types/finance';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import { 
  Search, 
  Plus, 
  Receipt, 
  Eye, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface InvoicesViewProps {
  onOpenRecordPayment: (invoiceId: string) => void;
  onOpenCreatePatient: () => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  onOpenRecordPayment,
  onOpenCreatePatient
}) => {
  const { invoices, settings } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoli, setSelectedPoli] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<Invoice | null>(null);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch =
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPoli = selectedPoli === 'all' || inv.poli === selectedPoli;
      const matchStatus = selectedStatus === 'all' || inv.status === selectedStatus;

      return matchSearch && matchPoli && matchStatus;
    });
  }, [invoices, searchQuery, selectedPoli, selectedStatus]);

  // Aggregate stats
  const totalBilled = filteredInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = filteredInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalRemaining = filteredInvoices.reduce((sum, i) => sum + i.remainingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Daftar Tagihan Pelayanan Klinik
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Penerbitan faktur tagihan pasien, status otomatis sisa pembayaran, dan pemantauan piutang
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tagihan Baru</span>
          </button>
        </div>

        {/* Quick financial indicator strip for current filtered view */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Total Nilai Tagihan Terpilih:</span>
            <strong className="text-slate-900 font-mono text-sm">{formatRupiah(totalBilled)}</strong>
          </div>
          <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100">
            <span className="text-teal-700 block">Sudah Terbayar Valid:</span>
            <strong className="text-teal-800 font-mono text-sm">{formatRupiah(totalPaid)}</strong>
          </div>
          <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
            <span className="text-amber-800 block">Sisa Piutang Terbuka:</span>
            <strong className="text-amber-900 font-mono text-sm">{formatRupiah(totalRemaining)}</strong>
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
            placeholder="Cari faktur, pasien, layanan..."
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

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="Belum Dibayar">Belum Dibayar</option>
              <option value="Dibayar Sebagian">Dibayar Sebagian</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-2">
            <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">Tidak ada tagihan yang cocok</p>
            <p>Ubah filter atau buat tagihan baru untuk pasien.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="py-3 px-3.5">No. Tagihan</th>
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Pasien</th>
                  <th className="py-3 px-3">Poli</th>
                  <th className="py-3 px-3">Deskripsi Layanan</th>
                  <th className="py-3 px-3 text-right">Total Tagihan</th>
                  <th className="py-3 px-3 text-right">Terbayar</th>
                  <th className="py-3 px-3 text-right">Sisa Tagihan</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map(inv => {
                  const isLunas = inv.status === 'Lunas';
                  const isSebagian = inv.status === 'Dibayar Sebagian';

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-medium text-slate-900">
                        {inv.id}
                      </td>

                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {formatDateIndo(inv.date)}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{inv.patientName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{inv.patientId}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                        {inv.poli}
                      </td>

                      <td className="py-3 px-3 text-slate-600 max-w-[180px] truncate" title={inv.serviceDescription}>
                        {inv.serviceDescription}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        {formatRupiah(inv.totalAmount)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-teal-700">
                        {formatRupiah(inv.paidAmount)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                        <span className={inv.remainingAmount > 0 ? 'text-amber-800' : 'text-slate-400'}>
                          {formatRupiah(inv.remainingAmount)}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isLunas
                            ? 'bg-emerald-50 text-emerald-800'
                            : isSebagian
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Detail Modal button */}
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceForDetail(inv)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                            title="Buka Rincian & Cetak Faktur"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Pay button (if not lunas) */}
                          {!isLunas && (
                            <button
                              type="button"
                              onClick={() => onOpenRecordPayment(inv.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors shadow-2xs"
                              title="Catat Pembayaran Masuk"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Bayar</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOpenCreatePatient={onOpenCreatePatient}
      />

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoiceForDetail}
        isOpen={!!selectedInvoiceForDetail}
        onClose={() => setSelectedInvoiceForDetail(null)}
        onOpenRecordPayment={onOpenRecordPayment}
      />
    </div>
  );
};
