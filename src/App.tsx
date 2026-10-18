import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { DashboardView } from './components/dashboard/DashboardView';
import { PatientsView } from './components/patients/PatientsView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { PaymentsView } from './components/payments/PaymentsView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { CreateInvoiceModal } from './components/invoices/CreateInvoiceModal';
import { RecordPaymentModal } from './components/payments/RecordPaymentModal';
import { RecordExpenseModal } from './components/expenses/RecordExpenseModal';
import { PatientModal } from './components/patients/PatientModal';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, addPatient } = useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global action modals state
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [invoicePrefillPatientId, setInvoicePrefillPatientId] = useState<string | undefined>();

  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentPrefillInvoiceId, setPaymentPrefillInvoiceId] = useState<string | undefined>();

  const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState(false);
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);

  // Handlers for cross-view actions
  const handleOpenCreateInvoiceForPatient = (patientId?: string) => {
    setInvoicePrefillPatientId(patientId);
    setIsCreateInvoiceOpen(true);
  };

  const handleOpenRecordPayment = (invoiceId?: string) => {
    setPaymentPrefillInvoiceId(invoiceId);
    setIsRecordPaymentOpen(true);
  };

  const handleSaveNewPatient = (data: {
    name: string;
    phone: string;
    gender: 'L' | 'P';
    birthDate: string;
    address?: string;
    notes?: string;
  }) => {
    const created = addPatient(data);
    // If was triggered to create an invoice, auto-open invoice modal for this new patient
    if (invoicePrefillPatientId === 'NEW') {
      setInvoicePrefillPatientId(created.id);
      setIsCreateInvoiceOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Header onOpenMobile={() => setMobileMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenCreateInvoice={() => handleOpenCreateInvoiceForPatient()}
              onOpenRecordPayment={handleOpenRecordPayment}
              onOpenRecordExpense={() => setIsRecordExpenseOpen(true)}
              onOpenCreatePatient={() => setIsCreatePatientOpen(true)}
            />
          )}

          {activeTab === 'pasien' && (
            <PatientsView
              onOpenCreateInvoiceForPatient={handleOpenCreateInvoiceForPatient}
              onOpenRecordPayment={handleOpenRecordPayment}
            />
          )}

          {activeTab === 'tagihan' && (
            <InvoicesView
              onOpenRecordPayment={handleOpenRecordPayment}
              onOpenCreatePatient={() => setIsCreatePatientOpen(true)}
            />
          )}

          {activeTab === 'pembayaran' && (
            <PaymentsView prefillInvoiceId={paymentPrefillInvoiceId} />
          )}

          {activeTab === 'pengeluaran' && (
            <ExpensesView />
          )}

          {activeTab === 'laporan' && (
            <ReportsView />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => {
          setIsCreateInvoiceOpen(false);
          setInvoicePrefillPatientId(undefined);
        }}
        prefillPatientId={invoicePrefillPatientId}
        onOpenCreatePatient={() => {
          setInvoicePrefillPatientId('NEW');
          setIsCreatePatientOpen(true);
        }}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => {
          setIsRecordPaymentOpen(false);
          setPaymentPrefillInvoiceId(undefined);
        }}
        prefillInvoiceId={paymentPrefillInvoiceId}
      />

      <RecordExpenseModal
        isOpen={isRecordExpenseOpen}
        onClose={() => setIsRecordExpenseOpen(false)}
      />

      <PatientModal
        isOpen={isCreatePatientOpen}
        onClose={() => setIsCreatePatientOpen(false)}
        onSubmit={handleSaveNewPatient}
      />

      {/* Floating Toast System */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <MainAppContent />
    </ClinicProvider>
  );
}
