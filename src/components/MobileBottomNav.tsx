import React from 'react';
import { ViewMode } from '../types';

interface MobileBottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#c3c6d4] h-16 flex items-center justify-around z-40 px-2 shadow-2xl font-sans">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
          currentView === 'dashboard' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'dashboard' ? 'material-symbols-filled' : ''
          }`}
        >
          dashboard
        </span>
        <span className={`text-[10px] tracking-tight ${currentView === 'dashboard' ? 'font-extrabold' : 'font-medium'}`}>
          Home
        </span>
      </button>

      <button
        onClick={() => onNavigate('hospitals')}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
          currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'material-symbols-filled' : ''
          }`}
        >
          apartment
        </span>
        <span className={`text-[10px] tracking-tight ${currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'font-extrabold' : 'font-medium'}`}>
          Hospitals
        </span>
      </button>

      {/* Prominent Center Action for New Case */}
      <button
        onClick={() => onNavigate('new-case')}
        className="flex flex-col items-center justify-center -mt-4"
      >
        <div className="w-12 h-12 rounded-full bg-[#003178] text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-[#003178]/20 transition-transform active:scale-95">
          <span className="material-symbols-outlined text-[24px]">add</span>
        </div>
        <span className={`text-[10px] tracking-tight mt-0.5 ${currentView === 'new-case' ? 'font-extrabold text-[#003178]' : 'font-semibold text-[#64748b]'}`}>
          New Case
        </span>
      </button>

      <button
        onClick={() => onNavigate('quotes')}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
          currentView === 'quotes' || currentView === 'checkout' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'quotes' || currentView === 'checkout' ? 'material-symbols-filled' : ''
          }`}
        >
          medical_services
        </span>
        <span
          className={`text-[10px] tracking-tight ${
            currentView === 'quotes' || currentView === 'checkout' ? 'font-extrabold' : 'font-medium'
          }`}
        >
          Quotes
        </span>
      </button>

      <button
        onClick={() => onNavigate('records')}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
          currentView === 'records' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'records' ? 'material-symbols-filled' : ''
          }`}
        >
          folder_shared
        </span>
        <span className={`text-[10px] tracking-tight ${currentView === 'records' ? 'font-extrabold' : 'font-medium'}`}>
          Vault
        </span>
      </button>
    </nav>
  );
};
