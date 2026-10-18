import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PaymentMethod } from '../../types/finance';
import { formatRupiah } from '../../utils/formatters';
import { X, CreditCard, AlertCircle, CheckCircle2, ArrowDownLeft } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillInvoiceId?: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  prefillInvoiceId
}) => {
  const { invoices, recordPayment, settings } = useClinic();

  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [date, setDate] = useState('2024-10-18');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // List of invoices that are NOT fully paid yet
  const eligibleInvoices = invoices.filter(i => i.status !== 'Lunas');

  useEffect(() => {
    if (prefillInvoiceId) {
      setInvoiceId(prefillInvoiceId);
      const inv = invoices.find(i => i.id === prefillInvoiceId);
      if (inv) {
        setAmount(String(inv.remainingAmount));
      }
    } else if (eligibleInvoices.length > 0 && !invoiceId) {
      const first = eligibleInvoices[0];
      setInvoiceId(first.id);
      setAmount(String(first.remainingAmount));
    }
  }, [prefillInvoiceId, invoices, isOpen]);

  // Selected invoice
  const currentInvoice = invoices.find(i => i.id === invoiceId);

  const handleSelectInvoice = (id: string) => {
    setInvoiceId(id);
    const inv = invoices.find(i => i.id === id);
    if (inv) {
      setAmount(String(inv.remainingAmount));
    }
    setErrors({});
  };

  const handlePayFull = () => {
    if (currentInvoice) {
      setAmount(String(currentInvoice.remainingAmount));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!invoiceId) {
      newErrors.invoiceId = 'Pilih tagihan yang akan dibayar';
    }

    if (!currentInvoice) {
      newErrors.invoiceId = 'Tagihan tidak valid';
      setErrors(newErrors);
      return false;
    }

    const numAmount = Number(amount.replace(/\D/g, ''));
    if (!numAmount || numAmount <= 0) {
      newErrors.amount = 'Nominal pembayaran harus lebih besar dari Rp 0';
    } else if (numAmount > currentInvoice.remainingAmount) {
      newErrors.amount = `Nominal tidak boleh melebihi sisa tagihan (${formatRupiah(currentInvoice.remainingAmount)})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !currentInvoice) return;

    const numAmount = Number(amount.replace(/\D/g, ''));
    const result = recordPayment({
      invoiceId: currentInvoice.id,
      amount: numAmount,
      paymentMethod,
      date,
      notes
    });

    if (result) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Catat Pembayaran Pasien</h3>
              <p className="text-xs text-slate-500">
                Verifikasi penerimaan uang kas masuk dan perbarui sisa piutang
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Select Invoice */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Tagihan yang Belum Lunas <span className="text-rose-500">*</span>
            </label>

            {eligibleInvoices.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Seluruh tagihan saat ini telah berstatus Lunas. Tidak ada piutang terbuka.</span>
              </div>
            ) : (
              <select
                value={invoiceId}
                onChange={e => handleSelectInvoice(e.target.value)}
                className={`w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-600 bg-white ${
                  errors.invoiceId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              >
                <option value="">-- Pilih Tagihan Pasien --</option>
                {eligibleInvoices.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {inv.patientName} ({inv.poli}) - Sisa: {formatRupiah(inv.remainingAmount)}
                  </option>
                ))}
              </select>
            )}

            {errors.invoiceId && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.invoiceId}
              </p>
            )}
          </div>

          {/* Invoice Summary Card if selected */}
          {currentInvoice && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Pasien:</span>
                <span className="font-semibold text-slate-900">{currentInvoice.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unit Poli:</span>
                <span className="text-slate-700">{currentInvoice.poli}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Nilai Tagihan:</span>
                <span className="font-mono">{formatRupiah(currentInvoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-teal-700">
                <span>Sudah Dibayar:</span>
                <span className="font-mono">{formatRupiah(currentInvoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900">
                <span>Sisa Tagihan Maksimum:</span>
                <span className="font-mono text-amber-900">{formatRupiah(currentInvoice.remainingAmount)}</span>
              </div>
            </div>
          )}

          {/* Nominal Payment Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Nominal Pembayaran Diterima <span className="text-rose-500">*</span>
              </label>
              {currentInvoice && (
                <button
                  type="button"
                  onClick={handlePayFull}
                  className="text-xs text-teal-700 hover:text-teal-900 font-medium"
                >
                  Bayar Lunas Penuh
                </button>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500">
                Rp
              </span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                min="1000"
                step="5000"
                className={`w-full text-xs font-mono font-semibold pl-10 pr-3 py-2 border rounded-lg focus:outline-teal-600 ${
                  errors.amount ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.amount}
              </p>
            )}
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Transaksi <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Metode Pembayaran <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
              >
                {settings.paymentMethods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Transaksi / Referensi (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: No. ref EDC Mandiri 7721, QRIS ShopeePay, uang pas"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={eligibleInvoices.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs"
            >
              Simpan Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
