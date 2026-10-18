import React from 'react';
import { Payment } from '../../types/finance';
import { useClinic } from '../../context/ClinicContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { X, Printer, CheckCircle2, Building2 } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to convert number to Indonesian words (terbilang)
function terbilang(n: number): string {
  const angka = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  if (n < 12) return angka[n];
  if (n < 20) return terbilang(n - 10) + ' Belas';
  if (n < 100) return terbilang(Math.floor(n / 10)) + ' Puluh ' + terbilang(n % 10);
  if (n < 200) return 'Seratus ' + terbilang(n - 100);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + ' Ratus ' + terbilang(n % 100);
  if (n < 2000) return 'Seribu ' + terbilang(n - 1000);
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + ' Ribu ' + terbilang(n % 1000);
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + ' Juta ' + terbilang(n % 1000000);
  return String(n);
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  isOpen,
  onClose
}) => {
  const { settings, getInvoiceById } = useClinic();

  if (!isOpen || !payment) return null;

  const invoice = getInvoiceById(payment.invoiceId);
  const words = terbilang(payment.amount).trim() + ' Rupiah';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Modal Top Bar (hidden on print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 no-print">
          <span className="font-semibold text-slate-800 text-sm">Bukti Kwitansi Pembayaran</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kwitansi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kwitansi Body */}
        <div className="p-8 space-y-6 bg-white">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                {settings.clinicName}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Klinik Pratama Rawat Jalan · Poli Umum · Gigi · Kandungan
              </p>
              <p className="text-[11px] text-slate-500">
                Jl. Kesehatan Raya No. 12, Telp: (021) 789-0123
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-800 block">
                KWITANSI RESMI
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 block mt-1">
                {payment.id}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {formatDateIndo(payment.date, 'long')}
              </span>
            </div>
          </div>

          {/* Receipt Fields */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-4 gap-2 border-b border-dashed border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Telah Diterima Dari</span>
              <div className="col-span-3 font-bold text-slate-900 text-sm">
                : {payment.patientName} <span className="text-xs font-mono font-normal text-slate-500">({payment.patientId})</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-b border-dashed border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Uang Sejumlah</span>
              <div className="col-span-3 italic font-semibold text-teal-900 bg-teal-50/60 p-2 rounded border border-teal-100">
                "{words}"
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-b border-dashed border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Untuk Pembayaran</span>
              <div className="col-span-3 text-slate-800">
                : Pelayanan medis unit <strong>{payment.poli}</strong> ({payment.invoiceId})
                {invoice && (
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Tindakan: {invoice.serviceDescription}
                  </span>
                )}
                {payment.notes && (
                  <span className="block text-[11px] text-slate-500">
                    Keterangan: {payment.notes}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-b border-dashed border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Metode Transaksi</span>
              <div className="col-span-3 text-slate-800">
                : <strong className="text-slate-900">{payment.paymentMethod}</strong> (Lunas Diterima)
              </div>
            </div>
          </div>

          {/* Amount Box & Signatures */}
          <div className="flex items-end justify-between pt-2">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Jumlah Pembayaran:
              </span>
              <div className="px-4 py-2.5 bg-slate-900 text-white font-mono font-bold text-lg rounded-lg inline-block tabular-nums">
                {formatRupiah(payment.amount)}
              </div>
            </div>

            <div className="text-center w-48">
              <p className="text-[11px] text-slate-500">
                Petugas Kasir Administrasi,
              </p>
              <div className="h-14 flex items-center justify-center">
                <span className="text-teal-800/40 text-xs italic font-serif">Klinik Finance Verified</span>
              </div>
              <p className="text-xs font-bold text-slate-900 border-t border-slate-300 pt-1">
                ( Staf Kasir Klinik )
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (hidden on print) */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-2 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg bg-white"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
