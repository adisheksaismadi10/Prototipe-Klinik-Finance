import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  Settings, 
  Building2, 
  Wallet, 
  CreditCard, 
  ShieldCheck, 
  UserCheck, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    currentRole, 
    setCurrentRole, 
    resetToInitialData,
    illustrativeCashBalance
  } = useClinic();

  const [clinicName, setClinicName] = useState(settings.clinicName);
  const [initialBalance, setInitialBalance] = useState(String(settings.initialBalance));
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveBasic = (e: React.FormEvent) => {
    e.preventDefault();
    const numBalance = Number(initialBalance.replace(/\D/g, '')) || 0;
    updateSettings({
      clinicName: clinicName.trim() || 'Klinik Finance',
      initialBalance: numBalance
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Pengaturan & Konfigurasi Prototipe
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola parameter klinik, daftar layanan, akun demo, serta simulasi saldo kas awal
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
            <Settings className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Prototype Notice Box */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-start gap-3 text-xs text-teal-950">
        <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Informasi Transparansi Prototipe Visual:</p>
          <p className="leading-relaxed text-teal-900">
            Data pasien, transaksi, dan saldo kas dalam aplikasi ini merupakan simulasi fiktif untuk keperluan demonstrasi alur kerja calon klien. Tidak ada data pasien riil atau koneksi rekening bank yang digunakan.
          </p>
        </div>
      </div>

      {/* Master Configuration Form */}
      <form onSubmit={handleSaveBasic} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-700" />
          <span>Informasi Dasar Klinik</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Fasilitas Pelayanan Klinik
            </label>
            <input
              type="text"
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
              placeholder="Contoh: Klinik Pratama Sehat Mandiri"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Saldo Awal Ilustratif (Rupiah)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500">
                Rp
              </span>
              <input
                type="number"
                value={initialBalance}
                onChange={e => setInitialBalance(e.target.value)}
                className="w-full text-xs font-mono font-semibold pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                placeholder="25000000"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Saldo kas akhir terhitung saat ini: <strong>{formatRupiah(illustrativeCashBalance)}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          {isSaved && (
            <span className="text-xs text-teal-700 font-medium inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Tersimpan
            </span>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Master Data Pre-configured Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Unit Poli */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>Unit Poliklinik (3 Poli)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {settings.polis.map(p => (
              <li key={p} className="p-2 bg-slate-50 rounded-md border border-slate-100 font-medium flex items-center justify-between">
                <span>{p}</span>
                <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">Aktif</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Metode Pembayaran */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-100 pb-2">
            <CreditCard className="w-4 h-4 text-teal-700" />
            <span>Metode Transaksi</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {settings.paymentMethods.map(m => (
              <li key={m} className="p-2 bg-slate-50 rounded-md border border-slate-100 font-medium">
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Kategori Pengeluaran */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-rose-600" />
            <span>Kategori Biaya</span>
          </div>
          <div className="space-y-1 max-h-56 overflow-y-auto text-xs text-slate-700 pr-1">
            {settings.categories.map(c => (
              <div key={c} className="p-1.5 bg-slate-50 rounded border border-slate-100 text-[11px] truncate" title={c}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Switcher & Reset Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Pengaturan Peran Pengguna Demo</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setCurrentRole('pemilik')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentRole === 'pemilik'
                ? 'border-teal-600 bg-teal-50/50 shadow-2xs ring-1 ring-teal-600'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                Pemilik Klinik (Owner)
              </span>
              {currentRole === 'pemilik' && (
                <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                  Sedang Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fokus pada tinjauan eksekutif: memantau saldo kas ilustratif, total penerimaan per poli, piutang terbuka, dan unduh laporan.
            </p>
          </div>

          <div
            onClick={() => setCurrentRole('admin')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentRole === 'admin'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-700" />
                Admin Klinik (Staf Administrasi)
              </span>
              {currentRole === 'admin' && (
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                  Sedang Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fokus pada operasional harian: menginput pendaftaran pasien baru, menerbitkan faktur tagihan, mencatat pembayaran kasir, dan membukukan pengeluaran.
            </p>
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-900 text-xs block">Reset Data Simulasi Prototipe</span>
            <span className="text-[11px] text-slate-500">
              Mengembalikan seluruh data transaksi dummy ke kondisi default awal.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Data Awal</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Kembalikan Data Contoh?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seluruh penambahan pasien, tagihan, dan pembayaran baru selama sesi demonstrasi ini akan dihapus dan kembali ke data fiktif bawaan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToInitialData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
