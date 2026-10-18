import { Patient, Invoice, Payment, Expense, ClinicSettings } from '../types/finance';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAS-001',
    name: 'Budi Santoso',
    phone: '0812-3456-7890',
    gender: 'L',
    birthDate: '1985-04-12',
    registeredAt: '2024-08-05',
    address: 'Jl. Merdeka No. 45, RT 02/05',
    notes: 'Alergi terhadap Amoksisilin'
  },
  {
    id: 'PAS-002',
    name: 'Siti Rahmawati',
    phone: '0813-8899-1234',
    gender: 'P',
    birthDate: '1992-09-21',
    registeredAt: '2024-08-10',
    address: 'Jl. Melati Indah Blk. C No. 12',
    notes: 'Ibu hamil trimester 2'
  },
  {
    id: 'PAS-003',
    name: 'Ahmad Fauzi',
    phone: '0857-1122-3344',
    gender: 'L',
    birthDate: '1978-11-30',
    registeredAt: '2024-08-15',
    address: 'Komplek Griya Asri No. 8',
    notes: 'Riwayat hipertensi'
  },
  {
    id: 'PAS-004',
    name: 'Dewi Lestari',
    phone: '0819-5566-7788',
    gender: 'P',
    birthDate: '1996-03-14',
    registeredAt: '2024-08-22',
    address: 'Jl. Anggrek No. 18',
    notes: 'Pasien kontrol gigi berkala'
  },
  {
    id: 'PAS-005',
    name: 'Hendra Setiawan',
    phone: '0821-9988-7766',
    gender: 'L',
    birthDate: '1990-07-08',
    registeredAt: '2024-08-28',
    address: 'Jl. Diponegoro No. 102',
    notes: 'Pemeriksaan kesehatan umum rutin'
  },
  {
    id: 'PAS-006',
    name: 'Nurul Hidayah',
    phone: '0852-4433-2211',
    gender: 'P',
    birthDate: '1994-12-05',
    registeredAt: '2024-09-02',
    address: 'Jl. Kenanga Mas No. 7A',
    notes: 'Ibu hamil trimester 3'
  },
  {
    id: 'PAS-007',
    name: 'Rudi Hartono',
    phone: '0812-7788-9900',
    gender: 'L',
    birthDate: '1982-01-19',
    registeredAt: '2024-09-08',
    address: 'Jl. Pahlawan Barat No. 23',
    notes: 'Perawatan saluran akar gigi'
  },
  {
    id: 'PAS-008',
    name: 'Rina Kusuma',
    phone: '0878-3344-5566',
    gender: 'P',
    birthDate: '1989-06-25',
    registeredAt: '2024-09-14',
    address: 'Jl. Mawar Elok No. 5',
    notes: 'Pemeriksaan ginekologi rutin'
  },
  {
    id: 'PAS-009',
    name: 'Agus Pratama',
    phone: '0813-2233-4455',
    gender: 'L',
    birthDate: '1995-10-10',
    registeredAt: '2024-09-20',
    address: 'Perumahan Graha Raya No. 14',
    notes: 'Pengobatan batuk pilek kronis'
  },
  {
    id: 'PAS-010',
    name: 'Sri Wahyuni',
    phone: '0856-7788-1122',
    gender: 'P',
    birthDate: '1987-02-18',
    registeredAt: '2024-09-26',
    address: 'Jl. Cempaka Putih No. 89',
    notes: 'Konsultasi KB dan pasang implant'
  },
  {
    id: 'PAS-011',
    name: 'Eko Prasetyo',
    phone: '0818-9900-1122',
    gender: 'L',
    birthDate: '1993-08-04',
    registeredAt: '2024-10-02',
    address: 'Jl. Sudirman Gg. Melati No. 4',
    notes: 'Scaling dan penambalan gigi berlubang'
  },
  {
    id: 'PAS-012',
    name: 'Fitri Handayani',
    phone: '0822-1133-5577',
    gender: 'P',
    birthDate: '1998-05-16',
    registeredAt: '2024-10-06',
    address: 'Jl. Dahlia Indah No. 31',
    notes: 'Pemeriksaan kehamilan pertama (ANC 1)'
  },
  {
    id: 'PAS-013',
    name: 'Bambang Irawan',
    phone: '0812-6655-4433',
    gender: 'L',
    birthDate: '1975-09-09',
    registeredAt: '2024-10-10',
    address: 'Jl. Veteran No. 60',
    notes: 'Cek gula darah dan asam urat berkala'
  },
  {
    id: 'PAS-014',
    name: 'Maya Safitri',
    phone: '0857-4455-6677',
    gender: 'P',
    birthDate: '1991-03-27',
    registeredAt: '2024-10-12',
    address: 'Jl. Teratai Mas No. 19',
    notes: 'Cabut gigi bungsu (odontektomi parsial)'
  },
  {
    id: 'PAS-015',
    name: 'Dian Permana',
    phone: '0813-9911-2244',
    gender: 'L',
    birthDate: '1988-11-12',
    registeredAt: '2024-10-15',
    address: 'Jl. Gatot Subroto No. 77',
    notes: 'Keluhan demam tifoid & laboratorium dasar'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  // --- Bulan Agustus 2024 ---
  {
    id: 'INV-2024-001',
    date: '2024-08-06',
    patientId: 'PAS-001',
    patientName: 'Budi Santoso',
    poli: 'Poli Umum',
    serviceDescription: 'Konsultasi Dokter Umum & Paket Obat Flu',
    totalAmount: 180000,
    paidAmount: 180000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas saat kunjungan'
  },
  {
    id: 'INV-2024-002',
    date: '2024-08-11',
    patientId: 'PAS-002',
    patientName: 'Siti Rahmawati',
    poli: 'Poli Kandungan',
    serviceDescription: 'Pemeriksaan USG 2D Kandungan + Vitamin Prenatal',
    totalAmount: 450000,
    paidAmount: 450000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas via Transfer BCA'
  },
  {
    id: 'INV-2024-003',
    date: '2024-08-16',
    patientId: 'PAS-003',
    patientName: 'Ahmad Fauzi',
    poli: 'Poli Umum',
    serviceDescription: 'Pemeriksaan Rutin Hipertensi & Obat 30 Hari',
    totalAmount: 250000,
    paidAmount: 250000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas tunai'
  },
  {
    id: 'INV-2024-004',
    date: '2024-08-23',
    patientId: 'PAS-004',
    patientName: 'Dewi Lestari',
    poli: 'Poli Gigi',
    serviceDescription: 'Pembersihan Karang Gigi (Scaling) Rahang Atas & Bawah',
    totalAmount: 350000,
    paidAmount: 350000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas via QRIS'
  },

  // --- Bulan September 2024 ---
  {
    id: 'INV-2024-005',
    date: '2024-09-03',
    patientId: 'PAS-006',
    patientName: 'Nurul Hidayah',
    poli: 'Poli Kandungan',
    serviceDescription: 'Pemeriksaan USG 4D Trimester 3 + Konsultasi Sp.OG',
    totalAmount: 650000,
    paidAmount: 650000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Pembayaran debit penuh'
  },
  {
    id: 'INV-2024-006',
    date: '2024-09-09',
    patientId: 'PAS-007',
    patientName: 'Rudi Hartono',
    poli: 'Poli Gigi',
    serviceDescription: 'Perawatan Saluran Akar (PSA) Gigi Tahap 1 + Tambal Sementara',
    totalAmount: 500000,
    paidAmount: 500000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas via Transfer Mandiri'
  },
  {
    id: 'INV-2024-007',
    date: '2024-09-15',
    patientId: 'PAS-008',
    patientName: 'Rina Kusuma',
    poli: 'Poli Kandungan',
    serviceDescription: 'Pemeriksaan Papsmear & Konsultasi Dokter Kandungan',
    totalAmount: 400000,
    paidAmount: 400000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas via QRIS'
  },
  {
    id: 'INV-2024-008',
    date: '2024-09-21',
    patientId: 'PAS-009',
    patientName: 'Agus Pratama',
    poli: 'Poli Umum',
    serviceDescription: 'Rawat Luka Ringan & Injeksi Antibiotik',
    totalAmount: 220000,
    paidAmount: 220000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas tunai'
  },
  {
    id: 'INV-2024-009',
    date: '2024-09-27',
    patientId: 'PAS-010',
    patientName: 'Sri Wahyuni',
    poli: 'Poli Kandungan',
    serviceDescription: 'Pemasangan IUD T-Copper & Obat Pasca Pemasangan',
    totalAmount: 550000,
    paidAmount: 300000,
    remainingAmount: 250000,
    status: 'Dibayar Sebagian',
    notes: 'DP Rp300.000 saat pasang, sisa dibayar saat kontrol'
  },

  // --- Bulan Oktober 2024 (Bulan Berjalan) ---
  {
    id: 'INV-2024-010',
    date: '2024-10-03',
    patientId: 'PAS-011',
    patientName: 'Eko Prasetyo',
    poli: 'Poli Gigi',
    serviceDescription: 'Penambalan Gigi Komposit 2 Titik & Scaling',
    totalAmount: 600000,
    paidAmount: 600000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas via QRIS'
  },
  {
    id: 'INV-2024-011',
    date: '2024-10-04',
    patientId: 'PAS-001',
    patientName: 'Budi Santoso',
    poli: 'Poli Umum',
    serviceDescription: 'Medical Check Up Dasar (Gula Darah, Kolesterol, Asam Urat)',
    totalAmount: 320000,
    paidAmount: 320000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas via Transfer BCA'
  },
  {
    id: 'INV-2024-012',
    date: '2024-10-07',
    patientId: 'PAS-012',
    patientName: 'Fitri Handayani',
    poli: 'Poli Kandungan',
    serviceDescription: 'Pemeriksaan USG Kandungan Trimester 1 & Suplemen Asam Folat',
    totalAmount: 480000,
    paidAmount: 480000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas Tunai'
  },
  {
    id: 'INV-2024-013',
    date: '2024-10-09',
    patientId: 'PAS-007',
    patientName: 'Rudi Hartono',
    poli: 'Poli Gigi',
    serviceDescription: 'Perawatan Saluran Akar Tahap 2 (Obturasi Gigi)',
    totalAmount: 700000,
    paidAmount: 350000,
    remainingAmount: 350000,
    status: 'Dibayar Sebagian',
    notes: 'Pasien membayar separuh, sisa saat kontrol akhir minggu depan'
  },
  {
    id: 'INV-2024-014',
    date: '2024-10-11',
    patientId: 'PAS-013',
    patientName: 'Bambang Irawan',
    poli: 'Poli Umum',
    serviceDescription: 'Konsultasi Dokter & Obat Lambung / Dispepsia',
    totalAmount: 210000,
    paidAmount: 210000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas tunai'
  },
  {
    id: 'INV-2024-015',
    date: '2024-10-12',
    patientId: 'PAS-014',
    patientName: 'Maya Safitri',
    poli: 'Poli Gigi',
    serviceDescription: 'Pencabutan Gigi Molar Belakang (Gigi Bungsu) Sederhana',
    totalAmount: 750000,
    paidAmount: 400000,
    remainingAmount: 350000,
    status: 'Dibayar Sebagian',
    notes: 'DP Rp400.000 tunai, sisa akan ditransfer saat buka benang jahitan'
  },
  {
    id: 'INV-2024-016',
    date: '2024-10-13',
    patientId: 'PAS-002',
    patientName: 'Siti Rahmawati',
    poli: 'Poli Kandungan',
    serviceDescription: 'Pemeriksaan Rutin Kehamilan & Tes Glukosa Darah',
    totalAmount: 350000,
    paidAmount: 350000,
    remainingAmount: 0,
    status: 'Lunas',
    notes: 'Lunas via QRIS'
  },
  {
    id: 'INV-2024-017',
    date: '2024-10-14',
    patientId: 'PAS-015',
    patientName: 'Dian Permana',
    poli: 'Poli Umum',
    serviceDescription: 'Pemeriksaan Demam, Terapi Infus Ringan & Cek Darah Rutin',
    totalAmount: 580000,
    paidAmount: 250000,
    remainingAmount: 330000,
    status: 'Dibayar Sebagian',
    notes: 'Deposit awal Rp250.000, sisa akan diselesaikan saat observasi selesai'
  },
  {
    id: 'INV-2024-018',
    date: '2024-10-15',
    patientId: 'PAS-004',
    patientName: 'Dewi Lestari',
    poli: 'Poli Gigi',
    serviceDescription: 'Pemasangan Splinting Gigi Goyang & Obat Pereda Nyeri',
    totalAmount: 450000,
    paidAmount: 0,
    remainingAmount: 450000,
    status: 'Belum Dibayar',
    notes: 'Pasien lupa bawa dompet, berjanji transfer hari ini'
  },
  {
    id: 'INV-2024-019',
    date: '2024-10-16',
    patientId: 'PAS-005',
    patientName: 'Hendra Setiawan',
    poli: 'Poli Umum',
    serviceDescription: 'Pemeriksaan Dokter Umum & Nebulisasi Asma + Obat Pulang',
    totalAmount: 290000,
    paidAmount: 0,
    remainingAmount: 290000,
    status: 'Belum Dibayar',
    notes: 'Tagihan menunggu pelunasan dari keluarga'
  },
  {
    id: 'INV-2024-020',
    date: '2024-10-17',
    patientId: 'PAS-008',
    patientName: 'Rina Kusuma',
    poli: 'Poli Kandungan',
    serviceDescription: 'Konsultasi Program Hamil & USG Transvaginal',
    totalAmount: 600000,
    paidAmount: 0,
    remainingAmount: 600000,
    status: 'Belum Dibayar',
    notes: 'Menunggu proses transfer mobile banking suami'
  },
  {
    id: 'INV-2024-021',
    date: '2024-10-18',
    patientId: 'PAS-003',
    patientName: 'Ahmad Fauzi',
    poli: 'Poli Umum',
    serviceDescription: 'Konsultasi Darurat Maag Akut & Injeksi Omeprazole',
    totalAmount: 260000,
    paidAmount: 0,
    remainingAmount: 260000,
    status: 'Belum Dibayar',
    notes: 'Baru dibuat hari ini'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  // --- Pembayaran Agustus 2024 ---
  {
    id: 'TRX-2024-001',
    date: '2024-08-06',
    invoiceId: 'INV-2024-001',
    patientId: 'PAS-001',
    patientName: 'Budi Santoso',
    poli: 'Poli Umum',
    amount: 180000,
    paymentMethod: 'Tunai',
    notes: 'Pembayaran lunas kasir'
  },
  {
    id: 'TRX-2024-002',
    date: '2024-08-11',
    invoiceId: 'INV-2024-002',
    patientId: 'PAS-002',
    patientName: 'Siti Rahmawati',
    poli: 'Poli Kandungan',
    amount: 450000,
    paymentMethod: 'Transfer BCA',
    notes: 'Bukti transfer nomor BCA-981203'
  },
  {
    id: 'TRX-2024-003',
    date: '2024-08-16',
    invoiceId: 'INV-2024-003',
    patientId: 'PAS-003',
    patientName: 'Ahmad Fauzi',
    poli: 'Poli Umum',
    amount: 250000,
    paymentMethod: 'Tunai',
    notes: 'Diterima tunai kasir'
  },
  {
    id: 'TRX-2024-004',
    date: '2024-08-23',
    invoiceId: 'INV-2024-004',
    patientId: 'PAS-004',
    patientName: 'Dewi Lestari',
    poli: 'Poli Gigi',
    amount: 350000,
    paymentMethod: 'QRIS',
    notes: 'QRIS settlement berhasil'
  },

  // --- Pembayaran September 2024 ---
  {
    id: 'TRX-2024-005',
    date: '2024-09-03',
    invoiceId: 'INV-2024-005',
    patientId: 'PAS-006',
    patientName: 'Nurul Hidayah',
    poli: 'Poli Kandungan',
    amount: 650000,
    paymentMethod: 'Kartu Debit',
    notes: 'EDC Mandiri Ref: 7721'
  },
  {
    id: 'TRX-2024-006',
    date: '2024-09-09',
    invoiceId: 'INV-2024-006',
    patientId: 'PAS-007',
    patientName: 'Rudi Hartono',
    poli: 'Poli Gigi',
    amount: 500000,
    paymentMethod: 'Transfer Mandiri',
    notes: 'Transfer via Livin Mandiri'
  },
  {
    id: 'TRX-2024-007',
    date: '2024-09-15',
    invoiceId: 'INV-2024-007',
    patientId: 'PAS-008',
    patientName: 'Rina Kusuma',
    poli: 'Poli Kandungan',
    amount: 400000,
    paymentMethod: 'QRIS',
    notes: 'QRIS ShopeePay/Gopay'
  },
  {
    id: 'TRX-2024-008',
    date: '2024-09-21',
    invoiceId: 'INV-2024-008',
    patientId: 'PAS-009',
    patientName: 'Agus Pratama',
    poli: 'Poli Umum',
    amount: 220000,
    paymentMethod: 'Tunai',
    notes: 'Pembayaran tunai lunas'
  },
  {
    id: 'TRX-2024-009',
    date: '2024-09-27',
    invoiceId: 'INV-2024-009',
    patientId: 'PAS-010',
    patientName: 'Sri Wahyuni',
    poli: 'Poli Kandungan',
    amount: 300000,
    paymentMethod: 'Transfer BCA',
    notes: 'Uang muka pemasangan IUD'
  },

  // --- Pembayaran Oktober 2024 ---
  {
    id: 'TRX-2024-010',
    date: '2024-10-03',
    invoiceId: 'INV-2024-010',
    patientId: 'PAS-011',
    patientName: 'Eko Prasetyo',
    poli: 'Poli Gigi',
    amount: 600000,
    paymentMethod: 'QRIS',
    notes: 'Lunas via QRIS BCA'
  },
  {
    id: 'TRX-2024-011',
    date: '2024-10-04',
    invoiceId: 'INV-2024-011',
    patientId: 'PAS-001',
    patientName: 'Budi Santoso',
    poli: 'Poli Umum',
    amount: 320000,
    paymentMethod: 'Transfer BCA',
    notes: 'Transfer lunas MCU dasar'
  },
  {
    id: 'TRX-2024-012',
    date: '2024-10-07',
    invoiceId: 'INV-2024-012',
    patientId: 'PAS-012',
    patientName: 'Fitri Handayani',
    poli: 'Poli Kandungan',
    amount: 480000,
    paymentMethod: 'Tunai',
    notes: 'Diterima kasir tunai'
  },
  {
    id: 'TRX-2024-013',
    date: '2024-10-09',
    invoiceId: 'INV-2024-013',
    patientId: 'PAS-007',
    patientName: 'Rudi Hartono',
    poli: 'Poli Gigi',
    amount: 350000,
    paymentMethod: 'Transfer BCA',
    notes: 'Cicilan 1 perawatan saluran akar'
  },
  {
    id: 'TRX-2024-014',
    date: '2024-10-11',
    invoiceId: 'INV-2024-014',
    patientId: 'PAS-013',
    patientName: 'Bambang Irawan',
    poli: 'Poli Umum',
    amount: 210000,
    paymentMethod: 'Tunai',
    notes: 'Lunas kasir'
  },
  {
    id: 'TRX-2024-015',
    date: '2024-10-12',
    invoiceId: 'INV-2024-015',
    patientId: 'PAS-014',
    patientName: 'Maya Safitri',
    poli: 'Poli Gigi',
    amount: 400000,
    paymentMethod: 'Tunai',
    notes: 'Uang muka cabut gigi molar'
  },
  {
    id: 'TRX-2024-016',
    date: '2024-10-13',
    invoiceId: 'INV-2024-016',
    patientId: 'PAS-002',
    patientName: 'Siti Rahmawati',
    poli: 'Poli Kandungan',
    amount: 350000,
    paymentMethod: 'QRIS',
    notes: 'Lunas QRIS'
  },
  {
    id: 'TRX-2024-017',
    date: '2024-10-14',
    invoiceId: 'INV-2024-017',
    patientId: 'PAS-015',
    patientName: 'Dian Permana',
    poli: 'Poli Umum',
    amount: 250000,
    paymentMethod: 'Transfer BCA',
    notes: 'Deposit awal observasi IGD & lab'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  // --- Agustus 2024 ---
  {
    id: 'EXP-2024-001',
    date: '2024-08-05',
    category: 'Obat dan Bahan Medis',
    description: 'Restok antibiotik, parasetamol & alkohol antiseptik',
    amount: 1450000,
    paymentMethod: 'Transfer Bank',
    notes: 'Distributor Kimia Farma Trading'
  },
  {
    id: 'EXP-2024-002',
    date: '2024-08-10',
    category: 'Listrik dan Utilitas',
    description: 'Tagihan Listrik PLN Klinik & Air PDAM Agustus',
    amount: 850000,
    paymentMethod: 'Transfer Bank',
    notes: 'Tagihan bulanan kantor klinik'
  },
  {
    id: 'EXP-2024-003',
    date: '2024-08-25',
    category: 'Gaji dan Tenaga Kerja',
    description: 'Honor jaga dokter pengganti & staf perawat 2 shift',
    amount: 4200000,
    paymentMethod: 'Transfer Bank',
    notes: 'Transfer payroll rekening staf'
  },

  // --- September 2024 ---
  {
    id: 'EXP-2024-004',
    date: '2024-09-02',
    category: 'Alat Kesehatan',
    description: 'Pembelian handpiece dental & jarum suntik disposable (5 box)',
    amount: 1200000,
    paymentMethod: 'Transfer Bank',
    notes: 'Peremajaan peralatan Poli Gigi'
  },
  {
    id: 'EXP-2024-005',
    date: '2024-09-08',
    category: 'Pemeliharaan',
    description: 'Servis rutin berkala Autoclave & AC Poli Kandungan',
    amount: 450000,
    paymentMethod: 'Tunai / Kas Kecil',
    notes: 'Teknisi servis resmi'
  },
  {
    id: 'EXP-2024-006',
    date: '2024-09-10',
    category: 'Listrik dan Utilitas',
    description: 'Tagihan Listrik PLN & Internet Wi-Fi Klinik',
    amount: 920000,
    paymentMethod: 'Transfer Bank',
    notes: 'PLN & Indihome'
  },
  {
    id: 'EXP-2024-007',
    date: '2024-09-20',
    category: 'Obat dan Bahan Medis',
    description: 'Pembelian gel USG, sarung tangan steril & kassa hidrofil',
    amount: 800000,
    paymentMethod: 'Transfer Bank',
    notes: 'Suplai bulanan Poli Kandungan & Umum'
  },
  {
    id: 'EXP-2024-008',
    date: '2024-09-26',
    category: 'Gaji dan Tenaga Kerja',
    description: 'Honor dokter jaga & staf administrasi September',
    amount: 4500000,
    paymentMethod: 'Transfer Bank',
    notes: 'Payroll reguler bulanan'
  },

  // --- Oktober 2024 ---
  {
    id: 'EXP-2024-009',
    date: '2024-10-02',
    category: 'Obat dan Bahan Medis',
    description: 'Restok strip tes gula/asam urat, jarum lancet & spuit 3cc',
    amount: 720000,
    paymentMethod: 'Transfer Bank',
    notes: 'Faktur Alkes Medika'
  },
  {
    id: 'EXP-2024-010',
    date: '2024-10-05',
    category: 'Administrasi',
    description: 'Cetak map rekam medis baru, kwitansi klinik & amplop obat',
    amount: 380000,
    paymentMethod: 'Tunai / Kas Kecil',
    notes: 'Percetakan Berkah Grafika'
  },
  {
    id: 'EXP-2024-011',
    date: '2024-10-10',
    category: 'Listrik dan Utilitas',
    description: 'Tagihan Listrik PLN Pasca Bayar & Wi-Fi Oktober',
    amount: 890000,
    paymentMethod: 'Transfer Bank',
    notes: 'Operasional bulanan'
  },
  {
    id: 'EXP-2024-012',
    date: '2024-10-12',
    category: 'Alat Kesehatan',
    description: 'Kalibrasi rutin alat tensimeter digital & timbangan bayi',
    amount: 350000,
    paymentMethod: 'Transfer Bank',
    notes: 'Jasa kalibrasi bersertifikat'
  },
  {
    id: 'EXP-2024-013',
    date: '2024-10-15',
    category: 'Pemeliharaan',
    description: 'Perbaikan minor pompa air cadangan & instalasi wastafel',
    amount: 250000,
    paymentMethod: 'Tunai / Kas Kecil',
    notes: 'Teknisi pipa air'
  },
  {
    id: 'EXP-2024-014',
    date: '2024-10-17',
    category: 'Lain-lain',
    description: 'Pembelian galon air minum, tissue roll & sabun cuci tangan steril',
    amount: 180000,
    paymentMethod: 'Tunai / Kas Kecil',
    notes: 'Kebutuhan pantry & ruang tunggu'
  }
];

export const INITIAL_SETTINGS: ClinicSettings = {
  clinicName: 'Klinik Pratama Sehat Mandiri',
  initialBalance: 25000000, // Rp 25.000.000 saldo awal ilustratif
  polis: ['Poli Umum', 'Poli Gigi', 'Poli Kandungan'],
  categories: [
    'Obat dan Bahan Medis',
    'Alat Kesehatan',
    'Gaji dan Tenaga Kerja',
    'Sewa',
    'Listrik dan Utilitas',
    'Pemeliharaan',
    'Administrasi',
    'Lain-lain'
  ],
  paymentMethods: [
    'Tunai',
    'Transfer BCA',
    'Transfer Mandiri',
    'QRIS',
    'Kartu Debit'
  ]
};
