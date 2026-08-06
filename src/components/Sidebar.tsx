import React from 'react';
import { ViewMode, UserPersona } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  activePersona?: UserPersona;
  onNavigate: (view: ViewMode) => void;
  onStartNewCase: () => void;
  authUser?: { mobileNumber: string; role: 'admin' | 'patient' | 'hospital' | 'insurance' | 'finance'; name: string } | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activePersona,
  onNavigate,
  onStartNewCase,
  authUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const allNavItems: { id: ViewMode; label: string; icon: string; badge?: string }[] = [
    { id: 'landing' as ViewMode, label: 'Home', icon: 'home' },
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: 'dashboard' },
    { id: 'hospitals' as ViewMode, label: 'Hospitals Network & Map', icon: 'apartment' },
    { id: 'medical-tourism' as ViewMode, label: 'Medical Tourism India', icon: 'flight_takeoff' },
    { id: 'family' as ViewMode, label: 'Family Profiles', icon: 'family_restroom' },
    { id: 'doctor-portal' as ViewMode, label: 'Doctor & Hospital Desk', icon: 'stethoscope' },
    { id: 'records' as ViewMode, label: 'Medical DigiLocker', icon: 'shield_lock' },
    { id: 'admin' as ViewMode, label: 'Admin Desk', icon: 'admin_panel_settings', badge: authUser?.role === 'admin' ? 'ADMIN' : undefined },
  ];

  const navItems = allNavItems;

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 p-3 z-40 bg-[#e6f6ff] border-r border-[#c3c6d4] selection:bg-[#81f3e5] justify-between">
      {/* Top Section */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Header */}
        <div className="mb-4 flex items-center gap-2.5 px-2 cursor-pointer shrink-0" onClick={() => onNavigate('landing')}>
          <div className="w-9 h-9 bg-[#003178] rounded-lg flex items-center justify-center shadow-md text-white shrink-0">
            <span className="material-symbols-outlined text-[22px]">health_metrics</span>
          </div>
          <div>
            <h1 className="font-bold text-[20px] leading-tight text-[#003178] tracking-tight">MediQuote AI</h1>
            <p className="text-[11px] text-[#434652] font-medium">Clinical Procurement</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-0.5">
          {navItems.map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === 'cases' && (currentView === 'quotes' || currentView === 'checkout')) ||
              (item.id === 'hospitals' && (currentView === 'hospital-profile' || currentView === 'recommendations'));
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl font-medium transition-all text-left text-[13px] cursor-pointer ${
                  isActive
                    ? 'bg-[#81f3e5] text-[#004f48] font-extrabold shadow-xs'
                    : item.id === 'medical-tourism'
                    ? 'bg-[#003178] text-white font-extrabold shadow-xs hover:bg-[#002255]'
                    : 'text-[#434652] hover:bg-[#cfe6f2] hover:text-[#003178]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[19px] shrink-0 ${
                      isActive ? 'material-symbols-filled' : ''
                    } ${item.id === 'medical-tourism' && !isActive ? 'text-[#81f3e5]' : ''}`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[8px] font-mono-data font-black bg-[#81f3e5] text-[#003f3a] rounded uppercase tracking-wider shrink-0 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Start New Case Button */}
          <div className="pt-2 pb-1">
            <button
              onClick={onStartNewCase}
              className="w-full py-2.5 px-3 bg-[#003178] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0d47a1] active:scale-[0.98] transition-all shadow-sm text-[13px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Start New Case</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Footer Action */}
      <div className="pt-2 border-t border-[#c3c6d4] shrink-0 space-y-1">
        {!authUser && (
          <button
            onClick={onOpenAuthModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#003178] text-white hover:bg-[#002256] transition-all rounded-xl font-bold text-[12px] shadow-xs cursor-pointer mb-1"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
            <span>Mobile Sign In</span>
          </button>
        )}

        <button
          onClick={() => alert('MediQuote AI Concierge Support: 24/7 Helpline +91-800-425-9921')}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-[#434652] hover:bg-[#cfe6f2] transition-all rounded-lg font-medium text-[13px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          <span>Support & Helpline</span>
        </button>
      </div>
    </aside>
  );
};
