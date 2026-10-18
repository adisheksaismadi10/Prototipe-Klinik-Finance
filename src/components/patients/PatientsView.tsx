import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Patient } from '../../types/finance';
import { formatDateIndo, formatRupiah } from '../../utils/formatters';
import { PatientModal } from './PatientModal';
import { PatientDetailModal } from './PatientDetailModal';
import { 
  Search, 
  UserPlus, 
  Users, 
  Eye, 
  Edit3, 
  Receipt, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface PatientsViewProps {
  onOpenCreateInvoiceForPatient: (patientId: string) => void;
  onOpenRecordPayment: (invoiceId?: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  onOpenCreateInvoiceForPatient,
  onOpenRecordPayment
}) => {
  const { patients, addPatient, updatePatient, invoices } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'L' | 'P'>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<Patient | null>(null);

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery);

      const matchGender = genderFilter === 'all' || p.gender === genderFilter;

      return matchSearch && matchGender;
    });
  }, [patients, searchQuery, genderFilter]);

  // Handle submit patient (create or update)
  const handleSavePatient = (data: {
    name: string;
    phone: string;
    gender: 'L' | 'P';
    birthDate: string;
    address?: string;
    notes?: string;
  }) => {
    if (editingPatient) {
      updatePatient(editingPatient.id, data);
      setEditingPatient(null);
    } else {
      addPatient(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card with Quick Stats */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Manajemen Data Pasien
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data pendaftaran pasien, nomor kontak, serta riwayat tagihan dan pembayaran 3 poli
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingPatient(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pasien Baru</span>
          </button>
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Total Pasien Terdaftar:</span>
            <strong className="text-slate-900 font-mono text-sm">{patients.length} Pasien</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Total Berkas Tagihan:</span>
            <strong className="text-slate-900 font-mono text-sm">{invoices.length} Faktur</strong>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block">Tagihan Tertunda:</span>
            <strong className="text-amber-700 font-mono text-sm">
              {invoices.filter(i => i.status !== 'Lunas').length} Berkas
            </strong>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama, no. pasien (PAS-001), atau HP..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-slate-50/50"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-slate-500">Filter Kelamin:</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                genderFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setGenderFilter('L')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                genderFilter === 'L' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Laki-laki
            </button>
            <button
              onClick={() => setGenderFilter('P')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                genderFilter === 'P' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Perempuan
            </button>
          </div>
        </div>
      </div>

      {/* Patients Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">Tidak ada pasien yang cocok</p>
            <p>Silakan sesuaikan kata kunci pencarian Anda atau daftarkan pasien baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="py-3 px-4">Nomor Pasien</th>
                  <th className="py-3 px-4">Nama Lengkap Pasien</th>
                  <th className="py-3 px-4">Kelamin</th>
                  <th className="py-3 px-4">No. Telepon / WhatsApp</th>
                  <th className="py-3 px-4">Tgl Terdaftar</th>
                  <th className="py-3 px-4">Status Piutang</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map(patient => {
                  const patientInvoices = invoices.filter(inv => inv.patientId === patient.id);
                  const patientPiutang = patientInvoices.reduce((sum, inv) => {
                    return inv.status !== 'Lunas' ? sum + inv.remainingAmount : sum;
                  }, 0);

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {patient.id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {patient.address ? patient.address.substring(0, 30) + '...' : 'Tidak ada alamat'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-700">
                          {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-700">
                        {patient.phone}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {formatDateIndo(patient.registeredAt)}
                      </td>

                      <td className="py-3 px-4">
                        {patientPiutang > 0 ? (
                          <div className="font-mono font-bold text-amber-800 tabular-nums">
                            {formatRupiah(patientPiutang)}
                            <span className="block text-[10px] text-amber-700 font-sans font-normal">
                              Belum lunas
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">Rp 0</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Detail */}
                          <button
                            type="button"
                            onClick={() => setSelectedPatientForDetail(patient)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                            title="Lihat Detail & Riwayat Pasien"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPatient(patient);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Data Pasien"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Create Invoice Shortcut */}
                          <button
                            type="button"
                            onClick={() => onOpenCreateInvoiceForPatient(patient.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors shadow-2xs ml-1"
                            title="Buat Tagihan Baru untuk Pasien Ini"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Tagihan</span>
                          </button>
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

      {/* Add / Edit Patient Modal */}
      <PatientModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={handleSavePatient}
        editPatient={editingPatient}
      />

      {/* Detail Patient Modal */}
      <PatientDetailModal
        patient={selectedPatientForDetail}
        isOpen={!!selectedPatientForDetail}
        onClose={() => setSelectedPatientForDetail(null)}
        onOpenCreateInvoiceForPatient={onOpenCreateInvoiceForPatient}
        onOpenRecordPayment={onOpenRecordPayment}
      />
    </div>
  );
};
