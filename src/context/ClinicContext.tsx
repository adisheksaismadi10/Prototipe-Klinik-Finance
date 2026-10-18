import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Patient, 
  Invoice, 
  Payment, 
  Expense, 
  ClinicSettings, 
  UserRole, 
  PeriodFilter, 
  PoliType, 
  PaymentMethod, 
  ExpenseCategory,
  InvoiceStatus
} from '../types/finance';
import { 
  INITIAL_PATIENTS, 
  INITIAL_INVOICES, 
  INITIAL_PAYMENTS, 
  INITIAL_EXPENSES, 
  INITIAL_SETTINGS 
} from '../data/initialData';
import { isDateInPeriod } from '../utils/formatters';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ClinicContextType {
  // Data
  patients: Patient[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  settings: ClinicSettings;
  currentRole: UserRole;
  periodFilter: PeriodFilter;
  customStartDate: string;
  customEndDate: string;
  activeTab: string;
  toasts: ToastNotification[];

  // Navigation & Role
  setActiveTab: (tab: string) => void;
  setCurrentRole: (role: UserRole) => void;
  setPeriodFilter: (period: PeriodFilter, customStart?: string, customEnd?: string) => void;

  // Actions
  addPatient: (data: { name: string; phone: string; gender: 'L' | 'P'; birthDate: string; address?: string; notes?: string }) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  createInvoice: (data: { patientId: string; poli: PoliType; serviceDescription: string; totalAmount: number; date: string; notes?: string }) => Invoice;
  recordPayment: (data: { invoiceId: string; amount: number; paymentMethod: PaymentMethod; date: string; notes?: string }) => Payment | null;
  addExpense: (data: { date: string; category: ExpenseCategory; description: string; amount: number; paymentMethod: string; notes?: string }) => Expense;
  deleteExpense: (id: string) => void;
  updateSettings: (updates: Partial<ClinicSettings>) => void;
  resetToInitialData: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Computed Financial Metrics
  filteredPayments: Payment[];
  filteredExpenses: Expense[];
  filteredInvoices: Invoice[];
  totalPaymentsInPeriod: number;
  totalExpensesInPeriod: number;
  netCashFlowInPeriod: number;
  totalReceivables: number;
  illustrativeCashBalance: number;
  allTimeTotalPayments: number;
  allTimeTotalExpenses: number;

  // Helper selectors
  getPatientById: (id: string) => Patient | undefined;
  getInvoiceById: (id: string) => Invoice | undefined;
  getPaymentsByInvoiceId: (invoiceId: string) => Payment[];
  getInvoicesByPatientId: (patientId: string) => Invoice[];
  getPaymentsByPatientId: (patientId: string) => Payment[];
}

const STORAGE_KEYS = {
  PATIENTS: 'klinik_finance_patients_v1',
  INVOICES: 'klinik_finance_invoices_v1',
  PAYMENTS: 'klinik_finance_payments_v1',
  EXPENSES: 'klinik_finance_expenses_v1',
  SETTINGS: 'klinik_finance_settings_v1',
  ROLE: 'klinik_finance_role_v1',
};

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or fallback to initial dummy data
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [settings, setSettings] = useState<ClinicSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as UserRole) || 'pemilik';
    } catch {
      return 'pemilik';
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [periodFilter, setPeriodFilterState] = useState<PeriodFilter>('bulan_ini');
  const [customStartDate, setCustomStartDate] = useState<string>('2024-10-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2024-10-31');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [currentRole]);

  // Toast notifications handler
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    showToast(
      'Peran Pengguna Diubah',
      `Profil aktif beralih ke mode ${role === 'pemilik' ? 'Pemilik Klinik (Owner)' : 'Admin Klinik (Staf Administrasi)'}.`,
      'info'
    );
  };

  const setPeriodFilter = (period: PeriodFilter, customStart?: string, customEnd?: string) => {
    setPeriodFilterState(period);
    if (customStart) setCustomStartDate(customStart);
    if (customEnd) setCustomEndDate(customEnd);
  };

  // Reference date for simulation (October 18, 2024 to align with dummy dataset)
  const simulationRefDate = useMemo(() => new Date('2024-10-18'), []);

  // Filtered lists based on period
  const filteredPayments = useMemo(() => {
    return payments.filter(p => isDateInPeriod(p.date, periodFilter, customStartDate, customEndDate, simulationRefDate));
  }, [payments, periodFilter, customStartDate, customEndDate, simulationRefDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => isDateInPeriod(e.date, periodFilter, customStartDate, customEndDate, simulationRefDate));
  }, [expenses, periodFilter, customStartDate, customEndDate, simulationRefDate]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => isDateInPeriod(inv.date, periodFilter, customStartDate, customEndDate, simulationRefDate));
  }, [invoices, periodFilter, customStartDate, customEndDate, simulationRefDate]);

  // Financial calculations
  const totalPaymentsInPeriod = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [filteredPayments]);

  const totalExpensesInPeriod = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const netCashFlowInPeriod = totalPaymentsInPeriod - totalExpensesInPeriod;

  // Total Piutang (Receivables) = Sum of remaining balance from all non-lunas invoices
  const totalReceivables = useMemo(() => {
    return invoices.reduce((sum, inv) => {
      if (inv.status !== 'Lunas') {
        return sum + Math.max(0, inv.remainingAmount);
      }
      return sum;
    }, 0);
  }, [invoices]);

  // All-time totals for true illustrative cash balance calculation:
  // Saldo akhir = Saldo awal + Total Semua Penerimaan Aktual - Total Semua Pengeluaran
  const allTimeTotalPayments = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const allTimeTotalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const illustrativeCashBalance = useMemo(() => {
    return settings.initialBalance + allTimeTotalPayments - allTimeTotalExpenses;
  }, [settings.initialBalance, allTimeTotalPayments, allTimeTotalExpenses]);

  // Actions
  const addPatient = (data: { name: string; phone: string; gender: 'L' | 'P'; birthDate: string; address?: string; notes?: string }): Patient => {
    const nextNum = patients.length + 1;
    const id = `PAS-${String(nextNum).padStart(3, '0')}`;
    const todayStr = '2024-10-18';

    const newPatient: Patient = {
      id,
      name: data.name.trim(),
      phone: data.phone.trim(),
      gender: data.gender,
      birthDate: data.birthDate,
      registeredAt: todayStr,
      address: data.address?.trim(),
      notes: data.notes?.trim()
    };

    setPatients(prev => [newPatient, ...prev]);
    showToast('Pasien Berhasil Didaftarkan', `${newPatient.name} (${newPatient.id}) telah ditambahkan ke data pasien.`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    }));

    // If patient name changed, sync in invoices and payments
    if (updates.name) {
      setInvoices(prev => prev.map(inv => inv.patientId === id ? { ...inv, patientName: updates.name! } : inv));
      setPayments(prev => prev.map(pay => pay.patientId === id ? { ...pay, patientName: updates.name! } : pay));
    }

    showToast('Data Pasien Diperbarui', `Informasi pasien ${id} berhasil diperbarui.`);
  };

  const createInvoice = (data: {
    patientId: string;
    poli: PoliType;
    serviceDescription: string;
    totalAmount: number;
    date: string;
    notes?: string;
  }): Invoice => {
    const targetPatient = patients.find(p => p.id === data.patientId);
    const patientName = targetPatient ? targetPatient.name : 'Pasien Umum';

    const nextInvoiceNum = invoices.length + 1;
    const id = `INV-2024-${String(nextInvoiceNum).padStart(3, '0')}`;

    const newInvoice: Invoice = {
      id,
      date: data.date,
      patientId: data.patientId,
      patientName,
      poli: data.poli,
      serviceDescription: data.serviceDescription.trim(),
      totalAmount: data.totalAmount,
      paidAmount: 0,
      remainingAmount: data.totalAmount,
      status: 'Belum Dibayar',
      notes: data.notes?.trim()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    showToast(
      'Tagihan Berhasil Dibuat',
      `Tagihan ${newInvoice.id} sebesar Rp ${newInvoice.totalAmount.toLocaleString('id-ID')} untuk ${patientName} berhasil dicatat.`
    );
    return newInvoice;
  };

  const recordPayment = (data: {
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date: string;
    notes?: string;
  }): Payment | null => {
    const invoice = invoices.find(inv => inv.id === data.invoiceId);
    if (!invoice) {
      showToast('Gagal Mencatat Pembayaran', 'Tagihan tidak ditemukan dalam sistem.', 'error');
      return null;
    }

    // Business rule validation: payment cannot exceed remaining balance
    if (data.amount <= 0) {
      showToast('Gagal Mencatat Pembayaran', 'Nominal pembayaran harus lebih besar dari Rp 0.', 'error');
      return null;
    }

    if (data.amount > invoice.remainingAmount) {
      showToast(
        'Nominal Melebihi Sisa Tagihan',
        `Nominal Rp ${data.amount.toLocaleString('id-ID')} melebihi sisa tagihan (Rp ${invoice.remainingAmount.toLocaleString('id-ID')}).`,
        'error'
      );
      return null;
    }

    const nextPayNum = payments.length + 1;
    const paymentId = `TRX-2024-${String(nextPayNum).padStart(3, '0')}`;

    const newPayment: Payment = {
      id: paymentId,
      date: data.date,
      invoiceId: invoice.id,
      patientId: invoice.patientId,
      patientName: invoice.patientName,
      poli: invoice.poli,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      notes: data.notes?.trim()
    };

    // Calculate new invoice financial state
    const newPaidAmount = invoice.paidAmount + data.amount;
    const newRemainingAmount = invoice.totalAmount - newPaidAmount;
    
    let newStatus: InvoiceStatus = 'Belum Dibayar';
    if (newPaidAmount >= invoice.totalAmount) {
      newStatus = 'Lunas';
    } else if (newPaidAmount > 0) {
      newStatus = 'Dibayar Sebagian';
    }

    // Update state
    setPayments(prev => [newPayment, ...prev]);
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoice.id) {
        return {
          ...inv,
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          status: newStatus
        };
      }
      return inv;
    }));

    showToast(
      'Pembayaran Berhasil Dicatat',
      `Transaksi ${newPayment.id} sebesar Rp ${data.amount.toLocaleString('id-ID')} berhasil disimpan. Status tagihan kini: ${newStatus}.`,
      'success'
    );

    return newPayment;
  };

  const addExpense = (data: {
    date: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }): Expense => {
    const nextExpNum = expenses.length + 1;
    const id = `EXP-2024-${String(nextExpNum).padStart(3, '0')}`;

    const newExpense: Expense = {
      id,
      date: data.date,
      category: data.category,
      description: data.description.trim(),
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      notes: data.notes?.trim()
    };

    setExpenses(prev => [newExpense, ...prev]);
    showToast(
      'Pengeluaran Berhasil Dicatat',
      `Pengeluaran ${newExpense.id} sebesar Rp ${data.amount.toLocaleString('id-ID')} (${data.category}) berhasil disimpan.`
    );
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    const target = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Pengeluaran Dihapus', `Transaksi pengeluaran ${id} berhasil dihapus dari simulasi.`);
  };

  const updateSettings = (updates: Partial<ClinicSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    showToast('Pengaturan Disimpan', 'Konfigurasi klinik berhasil diperbarui.');
  };

  const resetToInitialData = () => {
    setPatients(INITIAL_PATIENTS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setExpenses(INITIAL_EXPENSES);
    setSettings(INITIAL_SETTINGS);
    setCurrentRoleState('pemilik');
    setPeriodFilterState('bulan_ini');
    try {
      localStorage.removeItem(STORAGE_KEYS.PATIENTS);
      localStorage.removeItem(STORAGE_KEYS.INVOICES);
      localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
      localStorage.removeItem(STORAGE_KEYS.EXPENSES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
    } catch {
      // ignore
    }
    showToast('Data Simulasi Direset', 'Semua data contoh telah dikembalikan ke kondisi awal prototipe.', 'info');
  };

  // Helper selectors
  const getPatientById = (id: string) => patients.find(p => p.id === id);
  const getInvoiceById = (id: string) => invoices.find(inv => inv.id === id);
  const getPaymentsByInvoiceId = (invoiceId: string) => payments.filter(p => p.invoiceId === invoiceId);
  const getInvoicesByPatientId = (patientId: string) => invoices.filter(inv => inv.patientId === patientId);
  const getPaymentsByPatientId = (patientId: string) => payments.filter(p => p.patientId === patientId);

  return (
    <ClinicContext.Provider
      value={{
        patients,
        invoices,
        payments,
        expenses,
        settings,
        currentRole,
        periodFilter,
        customStartDate,
        customEndDate,
        activeTab,
        toasts,
        setActiveTab,
        setCurrentRole,
        setPeriodFilter,
        addPatient,
        updatePatient,
        createInvoice,
        recordPayment,
        addExpense,
        deleteExpense,
        updateSettings,
        resetToInitialData,
        showToast,
        removeToast,
        filteredPayments,
        filteredExpenses,
        filteredInvoices,
        totalPaymentsInPeriod,
        totalExpensesInPeriod,
        netCashFlowInPeriod,
        totalReceivables,
        illustrativeCashBalance,
        allTimeTotalPayments,
        allTimeTotalExpenses,
        getPatientById,
        getInvoiceById,
        getPaymentsByInvoiceId,
        getInvoicesByPatientId,
        getPaymentsByPatientId
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
