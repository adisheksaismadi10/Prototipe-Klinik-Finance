import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { ExpenseCategory } from '../../types/finance';
import { X, ArrowUpRight, AlertCircle } from 'lucide-react';

interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordExpenseModal: React.FC<RecordExpenseModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addExpense, settings } = useClinic();

  const [category, setCategory] = useState<ExpenseCategory>('Obat dan Bahan Medis');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [date, setDate] = useState('2024-10-18');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Preset quick examples for speed during demonstration
  const quickPresets: Record<ExpenseCategory, string[]> = {
    'Obat dan Bahan Medis': ['Restok infus & spuit steril', 'Bahan tambal komposit & etsa gigi', 'Suplai kassa & alkohol antiseptik'],
    'Alat Kesehatan': ['Kalibrasi tensimeter & USG probe', 'Peremajaan instrumen sonde gigi', 'Baterai alat medis & timbangan'],
    'Gaji dan Tenaga Kerja': ['Honor dokter jaga shift malam', 'Insentif perawat poli tindakan', 'Uang lembur staf kasir administrasi'],
    'Sewa': ['Biaya sewa ruko klinik bulan berjalan', 'Biaya sewa genset darurat'],
    'Listrik dan Utilitas': ['Tagihan listrik PLN klinik', 'Tagihan air PDAM', 'Tagihan internet Wi-Fi operasional'],
    'Pemeliharaan': ['Servis rutin AC ruang tunggu & dokter', 'Perbaikan pipa wastafel cuci tangan', 'Servis autoclave sterilisasi'],
    'Administrasi': ['Cetak formulir rekam medis & amplop obat', 'Kertas thermal kasir & map pasien', 'Perpanjangan izin operasional dinas'],
    'Lain-lain': ['Kebutuhan air galon ruang tunggu', 'Tissue roll & sabun cuci tangan medis', 'Konsumsi rapat koordinasi mingguan']
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) {
      newErrors.description = 'Deskripsi pengeluaran wajib diisi';
    }

    const numAmount = Number(amount.replace(/\D/g, ''));
    if (!numAmount || numAmount <= 0) {
      newErrors.amount = 'Nominal pengeluaran harus lebih besar dari Rp 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numAmount = Number(amount.replace(/\D/g, ''));
    addExpense({
      date,
      category,
      description,
      amount: numAmount,
      paymentMethod,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Catat Pengeluaran Klinik</h3>
              <p className="text-xs text-slate-500">
                Pencatatan beban operasional, logistik medis, dan utilitas klinik
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
          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Pengeluaran <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
              >
                {settings.categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

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
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Contoh cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {(quickPresets[category] || []).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDescription(preset)}
                  className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Pengeluaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Contoh: Pembelian obat anestesi lokal & spuit disposable"
              className={`w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-600 ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
              </p>
            )}
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal Biaya (Rupiah) <span className="text-rose-500">*</span>
            </label>
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

          {/* Payment Method & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Metode Pembayaran <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
              >
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="Tunai / Kas Kecil">Tunai / Kas Kecil</option>
                <option value="Kartu Debit">Kartu Debit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan / No. Bukti / Vendor
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Contoh: Faktur Kimia Farma No. 1029"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
              />
            </div>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              Simpan Pengeluaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
