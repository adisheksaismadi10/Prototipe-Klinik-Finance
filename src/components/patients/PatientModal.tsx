import React, { useState, useEffect } from 'react';
import { Patient } from '../../types/finance';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    gender: 'L' | 'P';
    birthDate: string;
    address?: string;
    notes?: string;
  }) => void;
  editPatient?: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editPatient
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editPatient) {
      setName(editPatient.name);
      setPhone(editPatient.phone);
      setGender(editPatient.gender);
      setBirthDate(editPatient.birthDate);
      setAddress(editPatient.address || '');
      setNotes(editPatient.notes || '');
    } else {
      setName('');
      setPhone('');
      setGender('L');
      setBirthDate('1992-05-15');
      setAddress('');
      setNotes('');
    }
    setErrors({});
  }, [editPatient, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nama lengkap pasien wajib diisi';
    if (!phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (phone.length < 8) {
      newErrors.phone = 'Nomor telepon minimal 8 digit';
    }
    if (!birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name,
      phone,
      gender,
      birthDate,
      address,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              {editPatient ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {editPatient ? `Edit Pasien: ${editPatient.id}` : 'Tambah Pasien Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan data identitas untuk administrasi pembayaran
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
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Pasien <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Rahmat Hidayat"
              className={`w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-600 ${
                errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className={`w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-600 ${
                  errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('L')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                    gender === 'L'
                      ? 'bg-teal-50 text-teal-800 border-teal-600 font-semibold'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Laki-laki
                </button>
                <button
                  type="button"
                  onClick={() => setGender('P')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                    gender === 'P'
                      ? 'bg-teal-50 text-teal-800 border-teal-600 font-semibold'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Perempuan
                </button>
              </div>
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Lahir <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Domisili (Opsional)
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Jl. Nama Jalan No. XX, Kelurahan..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Administrasi Khusus (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: Pasien rujukan, riwayat alergi umum"
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
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
            >
              {editPatient ? 'Simpan Perubahan' : 'Daftarkan Pasien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
