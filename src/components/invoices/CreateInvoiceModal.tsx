import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PoliType } from '../../types/finance';
import { X, Receipt, AlertCircle, Plus } from 'lucide-react';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillPatientId?: string;
  onOpenCreatePatient?: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  prefillPatientId,
  onOpenCreatePatient
}) => {
  const { patients, createInvoice, settings } = useClinic();

  const [patientId, setPatientId] = useState('');
  const [poli, setPoli] = useState<PoliType>('Poli Umum');
  const [date, setDate] = useState('2024-10-18');
  const [serviceDescription, setServiceDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prefillPatientId) {
      setPatientId(prefillPatientId);
    } else if (patients.length > 0 && !patientId) {
      setPatientId(patients[0].id);
    }
  }, [prefillPatientId, patients, isOpen]);

  if (!isOpen) return null;

  // Preset services based on selected Poli to speed up demo input
  const getServicePresets = (selectedPoli: PoliType) => {
    switch (selectedPoli) {
      case 'Poli Umum':
        return [
          { label: 'Konsultasi & Resep Obat Flu', price: 180000 },
          { label: 'Pemeriksaan Hipertensi & Obat', price: 250000 },
          { label: 'Medical Check Up Dasar', price: 320000 },
          { label: 'Rawat Luka & Jahitan', price: 220000 }
        ];
      case 'Poli Gigi':
        return [
          { label: 'Scaling Karang Gigi (2 Rahang)', price: 350000 },
          { label: 'Penambalan Gigi Komposit', price: 300000 },
          { label: 'Cabut Gigi Molar / Bungsu', price: 750000 },
          { label: 'Perawatan Saluran Akar (PSA)', price: 500000 }
        ];
      case 'Poli Kandungan':
        return [
          { label: 'Pemeriksaan USG 2D & Konsultasi', price: 350000 },
          { label: 'Pemeriksaan USG 4D Trimester 3', price: 650000 },
          { label: 'Pemasangan IUD & Konsultasi KB', price: 550000 },
          { label: 'Pemeriksaan Antenatal Care (ANC)', price: 400000 }
        ];
    }
  };

  const handleApplyPreset = (label: string, price: number) => {
    setServiceDescription(label);
    setTotalAmount(String(price));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!patientId) newErrors.patientId = 'Pilih pasien terdaftar';
    if (!serviceDescription.trim()) newErrors.serviceDescription = 'Deskripsi pelayanan wajib diisi';
    
    const num = Number(totalAmount.replace(/\D/g, ''));
    if (!num || num <= 0) {
      newErrors.totalAmount = 'Nominal tagihan harus lebih besar dari Rp 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const num = Number(totalAmount.replace(/\D/g, ''));
    createInvoice({
      patientId,
      poli,
      serviceDescription,
      totalAmount: num,
      date,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Buat Tagihan Pasien Baru</h3>
              <p className="text-xs text-slate-500">
                Penerbitan faktur pelayanan kesehatan terhubung ke data pasien
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
          {/* Patient Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Pilih Pasien Terdaftar <span className="text-rose-500">*</span>
              </label>
              {onOpenCreatePatient && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreatePatient();
                  }}
                  className="text-xs text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Pasien Baru?
                </button>
              )}
            </div>

            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className={`w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-600 bg-white ${
                errors.patientId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            >
              <option value="">-- Pilih Pasien --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.name} ({p.phone})
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.patientId}
              </p>
            )}
          </div>

          {/* Poli & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Poliklinik Pelayanan <span className="text-rose-500">*</span>
              </label>
              <select
                value={poli}
                onChange={e => setPoli(e.target.value as PoliType)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
              >
                {settings.polis.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Tagihan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
              />
            </div>
          </div>

          {/* Service Description Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Deskripsi Layanan / Tindakan <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Pilih rekomendasi:</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {getServicePresets(poli).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset.label, preset.price)}
                  className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded text-slate-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={serviceDescription}
              onChange={e => setServiceDescription(e.target.value)}
              placeholder="Contoh: Konsultasi dokter umum, rawat luka, resep obat"
              className={`w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-600 ${
                errors.serviceDescription ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.serviceDescription && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.serviceDescription}
              </p>
            )}
          </div>

          {/* Nominal Tagihan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal Tagihan (Rupiah) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500">
                Rp
              </span>
              <input
                type="number"
                value={totalAmount}
                onChange={e => setTotalAmount(e.target.value)}
                placeholder="0"
                min="1000"
                step="5000"
                className={`w-full text-xs font-mono font-semibold pl-10 pr-3 py-2 border rounded-lg focus:outline-teal-600 ${
                  errors.totalAmount ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tarif diisi manual sesuai kebijakan prototipe dan tindakan klinik.
            </p>
            {errors.totalAmount && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.totalAmount}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Tagihan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: Jadwal kontrol minggu depan, menunggu pembayaran"
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
              Terbitkan Tagihan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
