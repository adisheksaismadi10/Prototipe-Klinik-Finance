export type PoliType = 'Poli Umum' | 'Poli Gigi' | 'Poli Kandungan';

export type UserRole = 'pemilik' | 'admin';

export type InvoiceStatus = 'Belum Dibayar' | 'Dibayar Sebagian' | 'Lunas';

export type PaymentMethod = 
  | 'Tunai' 
  | 'Transfer BCA' 
  | 'Transfer Mandiri' 
  | 'QRIS' 
  | 'Kartu Debit';

export type ExpenseCategory = 
  | 'Obat dan Bahan Medis'
  | 'Alat Kesehatan'
  | 'Gaji dan Tenaga Kerja'
  | 'Sewa'
  | 'Listrik dan Utilitas'
  | 'Pemeliharaan'
  | 'Administrasi'
  | 'Lain-lain';

export interface Patient {
  id: string; // e.g. PAS-001
  name: string;
  phone: string;
  gender: 'L' | 'P';
  birthDate: string; // YYYY-MM-DD
  registeredAt: string; // YYYY-MM-DD
  address?: string;
  notes?: string;
}

export interface Invoice {
  id: string; // e.g. INV-2024-001
  date: string; // YYYY-MM-DD
  patientId: string;
  patientName: string;
  poli: PoliType;
  serviceDescription: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  notes?: string;
}

export interface Payment {
  id: string; // e.g. TRX-2024-001
  date: string; // YYYY-MM-DD
  invoiceId: string;
  patientId: string;
  patientName: string;
  poli: PoliType;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Expense {
  id: string; // e.g. EXP-2024-001
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

export interface ClinicSettings {
  clinicName: string;
  initialBalance: number;
  polis: PoliType[];
  categories: ExpenseCategory[];
  paymentMethods: PaymentMethod[];
}

export type PeriodFilter = 'hari_ini' | 'bulan_ini' | 'bulan_lalu' | 'tahun_ini' | 'semua' | 'kustom';
