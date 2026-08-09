import React from 'react';
import { ViewMode } from '../types';

interface MobileBottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#c3c6d4] h-16 flex items-center justify-around z-40 px-1 shadow-2xl font-sans">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all min-w-0 ${
          currentView === 'dashboard' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
        title="Home Dashboard"
      >
        <span
          className={`material-symbols-outlined text-[20px] ${
            currentView === 'dashboard' ? 'material-symbols-filled' : ''
          }`}
        >
          dashboard
        </span>
        <span className={`text-[9px] sm:text-[10px] tracking-tight truncate ${currentView === 'dashboard' ? 'font-extrabold' : 'font-medium'}`}>
          Home
        </span>
      </button>

      <button
        onClick={() => onNavigate('hospitals')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all min-w-0 ${
          currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
        title="Hospitals Network"
      >
        <span
          className={`material-symbols-outlined text-[20px] ${
            currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'material-symbols-filled' : ''
          }`}
        >
          apartment
        </span>
        <span className={`text-[9px] sm:text-[10px] tracking-tight truncate ${currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'font-extrabold' : 'font-medium'}`}>
          Hospitals
        </span>
      </button>

      <button
        onClick={() => onNavigate('medical-tourism')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all min-w-0 ${
          currentView === 'medical-tourism' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
        title="Medical Tourism India"
      >
        <span
          className={`material-symbols-outlined text-[20px] ${
            currentView === 'medical-tourism' ? 'material-symbols-filled text-[#003178]' : ''
          }`}
        >
          flight_takeoff
        </span>
        <span className={`text-[9px] sm:text-[10px] tracking-tight truncate ${currentView === 'medical-tourism' ? 'font-extrabold text-[#003178]' : 'font-medium'}`}>
          Tourism
        </span>
      </button>

      {/* Prominent Center Action for New Case */}
      <button
        onClick={() => onNavigate('new-case')}
        className="flex flex-col items-center justify-center -mt-4 px-1 shrink-0"
        title="Start New Case"
      >
        <div className="w-11 h-11 rounded-full bg-[#003178] text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-[#003178]/20 transition-transform active:scale-95">
          <span className="material-symbols-outlined text-[22px]">add</span>
        </div>
        <span className={`text-[9px] tracking-tight mt-0.5 ${currentView === 'new-case' ? 'font-extrabold text-[#003178]' : 'font-semibold text-[#64748b]'}`}>
          New Case
        </span>
      </button>

      <button
        onClick={() => onNavigate('quotes')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all min-w-0 ${
          currentView === 'quotes' || currentView === 'checkout' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
        title="Clinical Quotes"
      >
        <span
          className={`material-symbols-outlined text-[20px] ${
            currentView === 'quotes' || currentView === 'checkout' ? 'material-symbols-filled' : ''
          }`}
        >
          medical_services
        </span>
        <span
          className={`text-[9px] sm:text-[10px] tracking-tight truncate ${
            currentView === 'quotes' || currentView === 'checkout' ? 'font-extrabold' : 'font-medium'
          }`}
        >
          Quotes
        </span>
      </button>

      <button
        onClick={() => onNavigate('records')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all min-w-0 ${
          currentView === 'records' ? 'text-[#003178]' : 'text-[#64748b] hover:text-[#003178]'
        }`}
        title="Secured Vault"
      >
        <span
          className={`material-symbols-outlined text-[20px] ${
            currentView === 'records' ? 'material-symbols-filled' : ''
          }`}
        >
          folder_shared
        </span>
        <span className={`text-[9px] sm:text-[10px] tracking-tight truncate ${currentView === 'records' ? 'font-extrabold' : 'font-medium'}`}>
          Vault
        </span>
      </button>
    </nav>
  );
};
