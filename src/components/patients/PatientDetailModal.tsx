import React from 'react';
import { Patient } from '../../types/finance';
import { useClinic } from '../../context/ClinicContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { 
  X, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Receipt, 
  CreditCard, 
  Plus, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateInvoiceForPatient: (patientId: string) => void;
  onOpenRecordPayment: (invoiceId?: string) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onOpenCreateInvoiceForPatient,
  onOpenRecordPayment
}) => {
  const { getInvoicesByPatientId, getPaymentsByPatientId } = useClinic();

  if (!isOpen || !patient) return null;

  const invoices = getInvoicesByPatientId(patient.id);
  const payments = getPaymentsByPatientId(patient.id);

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm font-mono">
              {patient.id.replace('PAS-', '')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{patient.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Terdaftar sejak: {formatDateIndo(patient.registeredAt)} · Kelamin: {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Lahir: {formatDateIndo(patient.birthDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{patient.address || 'Alamat belum diisi'}</span>
            </div>
          </div>

          {patient.notes && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Catatan Administrasi:</strong> {patient.notes}
              </div>
            </div>
          )}

          {/* Financial Summary Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
              <span className="text-slate-500 text-[11px] block">Total Tagihan Akumulatif</span>
              <span className="text-sm sm:text-base font-bold font-mono text-slate-900 tabular-nums">
                {formatRupiah(totalBilled)}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
              <span className="text-slate-500 text-[11px] block">Total Sudah Terbayar</span>
              <span className="text-sm sm:text-base font-bold font-mono text-teal-700 tabular-nums">
                {formatRupiah(totalPaid)}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
              <span className="text-slate-500 text-[11px] block">Sisa Piutang Terbuka</span>
              <span className={`text-sm sm:text-base font-bold font-mono tabular-nums ${
                totalOutstanding > 0 ? 'text-amber-800' : 'text-slate-600'
              }`}>
                {formatRupiah(totalOutstanding)}
              </span>
            </div>
          </div>

          {/* Tagihan History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-teal-600" />
                Riwayat Tagihan ({invoices.length})
              </h4>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCreateInvoiceForPatient(patient.id);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Tagihan Baru</span>
              </button>
            </div>

            {invoices.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-lg">
                Belum ada tagihan yang dibuat untuk pasien ini.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                    <tr>
                      <th className="py-2 px-3">No. Tagihan</th>
                      <th className="py-2 px-3">Tanggal</th>
                      <th className="py-2 px-3">Poli</th>
                      <th className="py-2 px-3">Layanan</th>
                      <th className="py-2 px-3 text-right">Total</th>
                      <th className="py-2 px-3 text-right">Sisa</th>
                      <th className="py-2 px-3 text-center">Status</th>
                      <th className="py-2 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map(inv => {
                      const isLunas = inv.status === 'Lunas';
                      const isSebagian = inv.status === 'Dibayar Sebagian';

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono font-medium text-slate-800">{inv.id}</td>
                          <td className="py-2 px-3 text-slate-600">{formatDateIndo(inv.date)}</td>
                          <td className="py-2 px-3 text-slate-700">{inv.poli}</td>
                          <td className="py-2 px-3 text-slate-600 max-w-[160px] truncate" title={inv.serviceDescription}>
                            {inv.serviceDescription}
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-900">
                            {formatRupiah(inv.totalAmount)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                            {formatRupiah(inv.remainingAmount)}
                          </td>
                          <td className="py-2 px-3 text-center">
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
                          <td className="py-2 px-3 text-right">
                            {!isLunas && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenRecordPayment(inv.id);
                                }}
                                className="px-2 py-0.5 text-[11px] font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors shadow-2xs"
                              >
                                Bayar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-teal-600" />
              Riwayat Pembayaran Diterima ({payments.length})
            </h4>

            {payments.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-lg">
                Belum ada transaksi pembayaran yang dicatat.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                    <tr>
                      <th className="py-2 px-3">No. Transaksi</th>
                      <th className="py-2 px-3">Tanggal</th>
                      <th className="py-2 px-3">Untuk Tagihan</th>
                      <th className="py-2 px-3">Metode</th>
                      <th className="py-2 px-3 text-right">Nominal Diterima</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-medium text-slate-800">{p.id}</td>
                        <td className="py-2 px-3 text-slate-600">{formatDateIndo(p.date)}</td>
                        <td className="py-2 px-3 font-mono text-teal-700">{p.invoiceId}</td>
                        <td className="py-2 px-3 text-slate-700">{p.paymentMethod}</td>
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

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg bg-white"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
