import React from 'react';
import { Invoice } from '../../types/finance';
import { useClinic } from '../../context/ClinicContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { 
  X, 
  Printer, 
  CreditCard, 
  Receipt, 
  Building2, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRecordPayment: (invoiceId: string) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onOpenRecordPayment
}) => {
  const { getPaymentsByInvoiceId, getPatientById, settings } = useClinic();

  if (!isOpen || !invoice) return null;

  const payments = getPaymentsByInvoiceId(invoice.id);
  const patient = getPatientById(invoice.patientId);

  const isLunas = invoice.status === 'Lunas';
  const isSebagian = invoice.status === 'Dibayar Sebagian';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar (hidden on print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-700" />
            <span className="font-semibold text-slate-800 text-sm">Rincian Faktur Tagihan</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Faktur</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Clinic Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                  KF
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {settings.clinicName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Layanan Kesehatan Terpadu: Poli Umum · Poli Gigi · Poli Kandungan
              </p>
              <p className="text-[11px] text-slate-400">
                Jl. Kesehatan Raya No. 12 · Telp: (021) 789-0123
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-teal-800 block">
                {invoice.id}
              </span>
              <span className="text-xs text-slate-500 block">
                Tgl: {formatDateIndo(invoice.date, 'long')}
              </span>
              <span className={`inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded ${
                isLunas
                  ? 'bg-emerald-100 text-emerald-900'
                  : isSebagian
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-rose-100 text-rose-900'
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Patient & Service Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px]">Identitas Pasien:</span>
              <span className="font-bold text-slate-900 block text-sm mt-0.5">{invoice.patientName}</span>
              <span className="text-slate-500 font-mono">ID: {invoice.patientId}</span>
              {patient?.phone && (
                <span className="text-slate-500 block font-mono">HP: {patient.phone}</span>
              )}
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Unit Pelayanan:</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{invoice.poli}</span>
              {invoice.notes && (
                <span className="text-slate-500 block mt-1 text-[11px]">
                  Catatan: {invoice.notes}
                </span>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Deskripsi Layanan / Tindakan</th>
                  <th className="py-2.5 px-4 text-center">Unit Poli</th>
                  <th className="py-2.5 px-4 text-right">Tarif</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {invoice.serviceDescription}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    {invoice.poli}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatRupiah(invoice.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary (Section 11) */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <div className="flex justify-between text-slate-600">
                <span>Total Tagihan:</span>
                <span className="font-mono font-bold text-slate-900">{formatRupiah(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-teal-700">
                <span>Total Terbayar Valid:</span>
                <span className="font-mono font-bold">{formatRupiah(invoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-900 font-bold">
                <span>Sisa Tagihan (Piutang):</span>
                <span className={`font-mono text-sm tabular-nums ${
                  invoice.remainingAmount > 0 ? 'text-amber-800' : 'text-emerald-700'
                }`}>
                  {formatRupiah(invoice.remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History For This Invoice */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Pembayaran Faktur Ini ({payments.length})
            </h4>

            {payments.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-lg">
                Belum ada pembayaran yang dicatat untuk tagihan ini.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                    <tr>
                      <th className="py-2 px-3">No. Transaksi</th>
                      <th className="py-2 px-3">Tanggal</th>
                      <th className="py-2 px-3">Metode</th>
                      <th className="py-2 px-3">Keterangan</th>
                      <th className="py-2 px-3 text-right">Nominal Masuk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td className="py-2 px-3 font-mono font-medium text-slate-800">{p.id}</td>
                        <td className="py-2 px-3 text-slate-600">{formatDateIndo(p.date)}</td>
                        <td className="py-2 px-3 text-slate-700">{p.paymentMethod}</td>
                        <td className="py-2 px-3 text-slate-500">{p.notes || '-'}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-teal-800 tabular-nums">
                          {formatRupiah(p.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions (hidden on print) */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between no-print">
          <div>
            {!isLunas && (
              <span className="text-xs text-amber-800 font-medium">
                Sisa tagihan yang harus dilunasi: <strong>{formatRupiah(invoice.remainingAmount)}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg bg-white"
            >
              Tutup
            </button>

            {!isLunas && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRecordPayment(invoice.id);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Catat Pembayaran</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
