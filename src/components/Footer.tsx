import React from 'react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#001d4a] text-white pt-12 pb-8 px-4 md:px-8 mt-16 border-t-4 border-[#81f3e5] selection:bg-[#81f3e5] selection:text-[#00201d]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand & ABDM Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 bg-[#81f3e5] rounded-xl flex items-center justify-center text-[#001d4a] font-black shadow-md">
              <span className="material-symbols-outlined text-[24px]">health_metrics</span>
            </div>
            <div>
              <h3 className="font-extrabold text-[20px] text-white tracking-tight leading-tight">MediQuote AI</h3>
              <p className="text-[11px] text-[#81f3e5] font-mono-data font-bold">ABDM INTEGRATED & ISO 27001</p>
            </div>
          </div>
          <p className="text-[13px] text-[#b0c4de] leading-relaxed">
            India’s premier AI-powered clinical procurement and surgical concierge platform. Connecting patients, hospitals, doctors, and insurance networks for transparent medical care.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#002b66] border border-[#1e4d8c] rounded-full text-[11px] font-mono-data font-bold text-[#81f3e5]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ABDM Gateway Active
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#002b66] border border-[#1e4d8c] rounded-full text-[11px] font-mono-data font-extrabold text-amber-300">
              ⚡ 256-Bit SSL
            </span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-[14px] font-extrabold text-[#81f3e5] uppercase tracking-wider font-mono-data">
            Platform Navigation
          </h4>
          <ul className="space-y-2 text-[13px] text-[#d0e1fd]">
            <li>
              <button
                onClick={() => onNavigate('landing')}
                className="hover:text-[#81f3e5] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>Home & Guest Portal</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:text-[#81f3e5] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>Clinical Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('medical-tourism')}
                className="hover:text-[#81f3e5] transition-colors flex items-center gap-1.5 cursor-pointer text-amber-300 font-bold"
              >
                <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
                <span>Medical Tourism India Hub</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('hospitals')}
                className="hover:text-[#81f3e5] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>Hospital Network Directory</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('doctor-portal')}
                className="hover:text-[#81f3e5] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>Doctor & Hospital Admission Desk</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('records')}
                className="hover:text-[#81f3e5] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>Secured Health Vault (ABHA)</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Emergency & Helpline Contact */}
        <div className="space-y-3">
          <h4 className="text-[14px] font-extrabold text-[#81f3e5] uppercase tracking-wider font-mono-data">
            Emergency & Support
          </h4>
          <div className="bg-[#00285e] border border-[#1a4a8c] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2.5 text-amber-300">
              <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
              <span className="font-extrabold text-[15px]">24/7 Clinical Concierge</span>
            </div>
            <p className="font-mono-data text-[16px] font-black text-white tracking-wide">
              +91-800-425-9921
            </p>
            <p className="text-[11px] text-[#90b3e0] leading-snug">
              Instant assistance for surgical emergencies, hospital transfer, and cost estimation.
            </p>
          </div>
          <div className="text-[12px] text-[#b0c4de] space-y-1 pt-1">
            <p className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">mail</span>
              <span>concierge@mediquote.ai</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#81f3e5]">location_on</span>
              <span>New Delhi • Mumbai • Bengaluru • Hyderabad</span>
            </p>
          </div>
        </div>

        {/* Col 4: Regulatory Compliance & Badges */}
        <div className="space-y-3">
          <h4 className="text-[14px] font-extrabold text-[#81f3e5] uppercase tracking-wider font-mono-data">
            Regulatory Compliance
          </h4>
          <div className="space-y-2">
            <div className="p-2.5 bg-[#00285e] border border-[#1a4a8c] rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#81f3e5] text-[20px]">verified</span>
              <div>
                <p className="text-[12px] font-extrabold text-white">NHA & ABHA Compliant</p>
                <p className="text-[10px] text-[#8faecf]">National Health Authority Data Standard</p>
              </div>
            </div>
            <div className="p-2.5 bg-[#00285e] border border-[#1a4a8c] rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-400 text-[20px]">security</span>
              <div>
                <p className="text-[12px] font-extrabold text-white">HIPAA & DPDP Act 2023</p>
                <p className="text-[10px] text-[#8faecf]">End-to-End Encrypted Health Records</p>
              </div>
            </div>
            <div className="p-2.5 bg-[#00285e] border border-[#1a4a8c] rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-amber-300 text-[20px]">local_hospital</span>
              <div>
                <p className="text-[12px] font-extrabold text-white">NABH & JCI Accredited</p>
                <p className="text-[10px] text-[#8faecf]">Verified Partner Hospitals Network</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#1a4a8c] pt-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#8faecf]">
        <p>© {new Date().getFullYear()} MediQuote AI Technologies Pvt. Ltd. All Rights Reserved.</p>

        <div className="flex items-center gap-4 flex-wrap justify-center font-medium">
          <button onClick={() => alert('Privacy Policy: All patient medical records and personal data are encrypted under the Digital Personal Data Protection (DPDP) Act 2023.')} className="hover:text-white transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <span>•</span>
          <button onClick={() => alert('Terms of Service: MediQuote AI provides surgical procurement assistance and cost comparisons. Medical decisions should be made in consultation with certified doctors.')} className="hover:text-white transition-colors cursor-pointer">
            Terms of Service
          </button>
          <span>•</span>
          <button onClick={() => alert('Medical Disclaimer: Quotations are indicative and based on hospital tariffs. Final billing is finalized upon clinical diagnosis.')} className="hover:text-white transition-colors cursor-pointer">
            Clinical Disclaimer
          </button>
          <span>•</span>
          <button onClick={() => alert('ABDM Integration: Connect your ABHA ID to sync records seamlessly across Indian health providers.')} className="hover:text-[#81f3e5] transition-colors cursor-pointer text-[#81f3e5]">
            ABHA Sync Guide
          </button>
        </div>
      </div>
    </footer>
  );
};
