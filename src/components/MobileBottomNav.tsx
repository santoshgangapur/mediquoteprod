import React from 'react';
import { ViewMode } from '../types';

interface MobileBottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#f3faff] border-t border-[#c3c6d4] h-16 flex items-center justify-around z-50 shadow-lg">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'dashboard' ? 'text-[#003178]' : 'text-[#737783]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'dashboard' ? 'material-symbols-filled' : ''
          }`}
        >
          dashboard
        </span>
        <span className={`text-[10px] ${currentView === 'dashboard' ? 'font-bold' : 'font-medium'}`}>
          Home
        </span>
      </button>

      <button
        onClick={() => onNavigate('hospitals')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'text-[#003178]' : 'text-[#737783]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'material-symbols-filled' : ''
          }`}
        >
          apartment
        </span>
        <span className={`text-[10px] ${currentView === 'hospitals' || currentView === 'recommendations' || currentView === 'hospital-profile' ? 'font-bold' : 'font-medium'}`}>
          Hospitals
        </span>
      </button>

      <button
        onClick={() => onNavigate('new-case')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'new-case' ? 'text-[#003178]' : 'text-[#737783]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'new-case' ? 'material-symbols-filled' : ''
          }`}
        >
          add_notes
        </span>
        <span className={`text-[10px] ${currentView === 'new-case' ? 'font-bold' : 'font-medium'}`}>
          New Case
        </span>
      </button>

      <button
        onClick={() => onNavigate('family')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'family' ? 'text-[#003178]' : 'text-[#737783]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'family' ? 'material-symbols-filled' : ''
          }`}
        >
          family_restroom
        </span>
        <span className={`text-[10px] ${currentView === 'family' ? 'font-bold' : 'font-medium'}`}>
          Family
        </span>
      </button>

      <button
        onClick={() => onNavigate('quotes')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'quotes' || currentView === 'checkout' ? 'text-[#003178]' : 'text-[#737783]'
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
          className={`text-[10px] ${
            currentView === 'quotes' || currentView === 'checkout' ? 'font-bold' : 'font-medium'
          }`}
        >
          Quotes
        </span>
      </button>

      <button
        onClick={() => onNavigate('medical-tourism')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'medical-tourism' ? 'text-[#003178]' : 'text-[#737783]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'medical-tourism' ? 'material-symbols-filled' : ''
          }`}
        >
          flight_takeoff
        </span>
        <span className={`text-[10px] ${currentView === 'medical-tourism' ? 'font-bold' : 'font-medium'}`}>
          Tourism
        </span>
      </button>

      <button
        onClick={() => onNavigate('records')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'records' ? 'text-[#003178]' : 'text-[#737783]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'records' ? 'material-symbols-filled' : ''
          }`}
        >
          folder_shared
        </span>
        <span className={`text-[10px] ${currentView === 'records' ? 'font-bold' : 'font-medium'}`}>
          Records
        </span>
      </button>
    </nav>
  );
};
