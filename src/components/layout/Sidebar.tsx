import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  CreditCard, 
  ArrowUpRight, 
  BarChart3, 
  Settings, 
  Activity,
  ShieldCheck,
  UserCheck,
  X,
  Building2
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    activeTab, 
    setActiveTab, 
    invoices, 
    currentRole, 
    setCurrentRole,
    settings 
  } = useClinic();

  const unpaidCount = invoices.filter(i => i.status !== 'Lunas').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pasien', label: 'Pasien', icon: Users },
    { 
      id: 'tagihan', 
      label: 'Tagihan', 
      icon: Receipt,
      badge: unpaidCount > 0 ? unpaidCount : undefined 
    },
    { id: 'pembayaran', label: 'Pembayaran', icon: CreditCard },
    { id: 'pengeluaran', label: 'Pengeluaran', icon: ArrowUpRight },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base leading-tight block tracking-tight">
                Klinik Finance
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">
                {settings.clinicName || 'Administrasi Klinik'}
              </span>
            </div>
          </div>
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poliklinik Indicator Banner */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            3 Poli Terpadu
          </span>
          <span className="text-[11px] text-slate-400">Umum · Gigi · Kandungan</span>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-teal-50 text-teal-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums ${
                    isActive 
                      ? 'bg-teal-200/70 text-teal-950 font-bold'
                      : 'bg-amber-100 text-amber-800 font-semibold'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Role Switcher Demo Box */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Peran Pengguna Demo</span>
              <span className="text-[10px] text-slate-400">Simulasi UI</span>
            </div>
            
            <div className="grid grid-cols-2 gap-1 p-1 bg-white border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => setCurrentRole('pemilik')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  currentRole === 'pemilik'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pemilik</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentRole('admin')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  currentRole === 'admin'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div className="px-2 py-1.5 bg-amber-50/80 border border-amber-200/70 rounded-md">
            <p className="text-[11px] text-amber-900 leading-tight">
              <strong>Catatan Demo:</strong> Hak akses disimulasikan untuk visualisasi presentasi klien.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
