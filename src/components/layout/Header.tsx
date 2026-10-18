import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PeriodFilter, UserRole } from '../../types/finance';
import { 
  Menu, 
  Calendar, 
  RotateCcw, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const { 
    activeTab, 
    periodFilter, 
    setPeriodFilter, 
    customStartDate, 
    customEndDate, 
    currentRole, 
    setCurrentRole, 
    resetToInitialData,
    settings 
  } = useClinic();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [tempStart, setTempStart] = useState(customStartDate);
  const [tempEnd, setTempEnd] = useState(customEndDate);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Eksekutif Keuangan';
      case 'pasien': return 'Data Pasien Terdaftar';
      case 'tagihan': return 'Daftar Tagihan & Pelayanan';
      case 'pembayaran': return 'Riwayat Pembayaran Pasien';
      case 'pengeluaran': return 'Catatan Pengeluaran Operasional';
      case 'laporan': return 'Laporan Ringkasan Keuangan';
      case 'pengaturan': return 'Pengaturan & Konfigurasi Demo';
      default: return 'Klinik Finance';
    }
  };

  const getPageSubtitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Ringkasan penerimaan, pengeluaran, piutang, dan saldo kas simulasi';
      case 'pasien': return 'Manajemen identitas pasien dan riwayat administrasi 3 poli';
      case 'tagihan': return 'Penerbitan tagihan pasien, status sisa, dan pemantauan piutang';
      case 'pembayaran': return 'Pencatatan uang masuk riil dan verifikasi pelunasan tagihan';
      case 'pengeluaran': return 'Pencatatan biaya operasional, logistik medis, dan utilitas klinik';
      case 'laporan': return 'Rekapitulasi operasional keuangan dan kinerja per poli pelayanan';
      case 'pengaturan': return 'Data master klinik, akun demo, dan pengaturan saldo awal dummy';
      default: return '';
    }
  };

  const handleApplyCustomDates = () => {
    setPeriodFilter('kustom', tempStart, tempEnd);
    setShowCustomDateModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-2xs">
        {/* Left Section: Mobile Menu Button & Titles */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {getPageTitle(activeTab)}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded">
                Prototipe
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {getPageSubtitle(activeTab)}
            </p>
          </div>
        </div>

        {/* Right Section: Period Filter & Profile Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end md:self-auto">
          {/* Period Filter Selector (Relevant for Dashboard & Reports & Transactions) */}
          {['dashboard', 'pembayaran', 'pengeluaran', 'laporan'].includes(activeTab) && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5 hidden sm:inline" />
              
              <button
                type="button"
                onClick={() => setPeriodFilter('hari_ini')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  periodFilter === 'hari_ini'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hari Ini
              </button>

              <button
                type="button"
                onClick={() => setPeriodFilter('bulan_ini')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  periodFilter === 'bulan_ini'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulan Ini
              </button>

              <button
                type="button"
                onClick={() => setPeriodFilter('bulan_lalu')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  periodFilter === 'bulan_lalu'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulan Lalu
              </button>

              <button
                type="button"
                onClick={() => setPeriodFilter('semua')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  periodFilter === 'semua'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempStart(customStartDate);
                  setTempEnd(customEndDate);
                  setShowCustomDateModal(true);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  periodFilter === 'kustom'
                    ? 'bg-white text-teal-800 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kustom...
              </button>
            </div>
          )}

          {/* Quick Profile Badge / Switch */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentRole(currentRole === 'pemilik' ? 'admin' : 'pemilik')}
              title="Klik untuk beralih profil demo"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                currentRole === 'pemilik'
                  ? 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100'
                  : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              {currentRole === 'pemilik' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Pemilik Klinik</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Admin Staf</span>
                </>
              )}
            </button>

            {/* Prototype Help Button */}
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              title="Informasi Prototipe"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Reset Dummy Data Button */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 text-slate-400 hover:text-amber-700 rounded-lg hover:bg-amber-50"
              title="Reset Data Simulasi"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Custom Date Range Modal */}
      {showCustomDateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">Pilih Rentang Tanggal Kustom</h3>
              <button onClick={() => setShowCustomDateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Dari Tanggal</label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={e => setTempStart(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Sampai Tanggal</label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={e => setTempEnd(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCustomDateModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyCustomDates}
                className="px-4 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info / Prototype Disclaimer Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="font-semibold text-slate-900 text-base">Tentang Prototipe Klinik Finance</h3>
              </div>
              <button onClick={() => setShowInfoModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Aplikasi ini adalah <strong>prototipe visual interaktif</strong> untuk demonstrasi sistem administrasi keuangan klinik kesehatan dengan 3 poli:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Poli Umum</strong>: Konsultasi dokter umum, rawat luka, lab dasar.</li>
                <li><strong>Poli Gigi</strong>: Scaling, penambalan komposit, cabut gigi.</li>
                <li><strong>Poli Kandungan</strong>: USG 2D/4D, antenatal care, KB & IUD.</li>
              </ul>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-slate-700">
                <p className="font-medium text-slate-900">Peran Pengguna Demo:</p>
                <p>• <strong>Pemilik</strong>: Meninjau dashboard, saldo kas simulasi, piutang, dan laporan per poli.</p>
                <p>• <strong>Admin</strong>: Menginput pasien baru, membuat tagihan, dan mencatat transaksi pembayaran & pengeluaran.</p>
              </div>
              <p className="text-[11px] text-slate-500">
                Data disimpan dalam browser lokal (LocalStorage). Saldo kas dan tarif merupakan simulasi demonstratif dan bukan saldo bank sesungguhnya.
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Kembalikan Data Simulasi?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tindakan ini akan mengembalikan data pasien, tagihan, pembayaran, dan pengeluaran ke dataset awal dummy. Perubahan yang Anda input selama demo akan direset.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
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
    </>
  );
};
