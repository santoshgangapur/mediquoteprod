import React, { useState } from 'react';
import { ViewMode, UserPersona, HospitalQuote } from '../types';

interface LandingViewProps {
  onNavigate: (view: ViewMode) => void;
  onStartNewCase: () => void;
  personas?: UserPersona[];
  onSelectPersona?: (persona: UserPersona) => void;
  onViewHospitalProfile?: (hospitalId: string) => void;
  onOpenAuthModal?: () => void;
  authUser?: { mobileNumber: string; role: 'admin' | 'patient' | 'hospital' | 'insurance' | 'finance'; name: string } | null;
}

interface ProcedureEstimate {
  id: string;
  name: string;
  category: string;
  icon: string;
  avgCostINR: number;
  costRangeText: string;
  estStay: string;
  topHospitalName: string;
  discountBadge: string;
  description: string;
}

const SAMPLE_PROCEDURES: ProcedureEstimate[] = [
  {
    id: 'proc-1',
    name: 'Total Knee Replacement (Bilateral)',
    category: 'Orthopedics',
    icon: 'orthopedics',
    avgCostINR: 285000,
    costRangeText: '₹2,40,000 - ₹3,30,000',
    estStay: '4-5 Days',
    topHospitalName: 'Apollo Hospitals Greams Road',
    discountBadge: 'Save ~₹45,000',
    description: 'Robotic-assisted joint replacement including US-FDA approved cobalt-chromium implants & 5-day stay.',
  },
  {
    id: 'proc-2',
    name: 'Laparoscopic Cholecystectomy',
    category: 'General Surgery',
    icon: 'medical_services',
    avgCostINR: 85000,
    costRangeText: '₹75,000 - ₹1,10,000',
    estStay: '1-2 Days',
    topHospitalName: 'Fortis Healthcare Bannerghatta',
    discountBadge: 'Save ~₹18,000',
    description: 'Minimally invasive gallbladder removal with 3D laparoscopy, fast recovery, and same-day discharge option.',
  },
  {
    id: 'proc-3',
    name: 'Coronary Angioplasty (1 Stent)',
    category: 'Cardiology',
    icon: 'favorite',
    avgCostINR: 195000,
    costRangeText: '₹1,70,000 - ₹2,30,000',
    estStay: '2-3 Days',
    topHospitalName: 'Max Super Speciality Saket',
    discountBadge: 'Save ~₹35,000',
    description: 'Includes Drug-Eluting Stent (DES), Cath lab charges, IVUS guidance, and ICU monitoring.',
  },
  {
    id: 'proc-4',
    name: 'Phaco Cataract Surgery (Multifocal IOL)',
    category: 'Ophthalmology',
    icon: 'visibility',
    avgCostINR: 42000,
    costRangeText: '₹35,000 - ₹55,000',
    estStay: 'Day Care (4 Hrs)',
    topHospitalName: 'Manipal Hospital Old Airport Rd',
    discountBadge: 'Save ~₹10,000',
    description: 'Stitchless laser cataract surgery with premium foldable multifocal intraocular lens implant.',
  },
];

const DEMO_PRESET_REPORTS = [
  {
    id: 'rep-1',
    title: 'MRI Knee - Grade III Meniscal Tear',
    patient: 'Rajesh Sharma (Age 52)',
    category: 'Orthopedics',
    findings: 'Complete longitudinal tear of posterior horn of medial meniscus with Joint space narrowing.',
    icdCode: 'ICD-10: M23.22',
    urgency: 'Recommended Soon (Within 14 Days)',
    procedure: 'Arthroscopic Meniscal Repair / Trim',
  },
  {
    id: 'rep-2',
    title: 'USG Abdomen - Acute Cholecystitis',
    patient: 'Ananya Verma (Age 38)',
    category: 'General Surgery',
    findings: 'Multiple gallstones largest measuring 14mm with gallbladder wall thickening (4.5mm).',
    icdCode: 'ICD-10: K80.00',
    urgency: 'Urgent (Within 48 Hours)',
    procedure: 'Laparoscopic Cholecystectomy',
  },
  {
    id: 'rep-3',
    title: 'Coronary Angiogram - 85% LAD Stenosis',
    patient: 'Suresh Kumar (Age 61)',
    category: 'Cardiology',
    findings: 'Significant 85% occlusion in mid-LAD artery. Normal LVEF 55%.',
    icdCode: 'ICD-10: I25.10',
    urgency: 'Urgent (Within 72 Hours)',
    procedure: 'Percutaneous Coronary Intervention (PCI)',
  },
];

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onStartNewCase,
  personas = [],
  onSelectPersona,
  onViewHospitalProfile,
  onOpenAuthModal,
  authUser,
}) => {
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureEstimate>(SAMPLE_PROCEDURES[0]);
  const [selectedDemoReport, setSelectedDemoReport] = useState(DEMO_PRESET_REPORTS[0]);
  const [isAnalyzingDemo, setIsAnalyzingDemo] = useState(false);
  const [showDemoAnalysis, setShowDemoAnalysis] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Quick Sign-up state
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestSuccessMsg, setGuestSuccessMsg] = useState(false);

  const handleRunDemoAnalysis = (report: typeof DEMO_PRESET_REPORTS[0]) => {
    setSelectedDemoReport(report);
    setIsAnalyzingDemo(true);
    setShowDemoAnalysis(false);

    setTimeout(() => {
      setIsAnalyzingDemo(false);
      setShowDemoAnalysis(true);
    }, 900);
  };

  const handleGuestSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setGuestSuccessMsg(true);
    setTimeout(() => {
      setGuestSuccessMsg(false);
      setShowAuthModal(false);
      onNavigate('dashboard');
    }, 1200);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-20 text-[#071e27]">
      {/* HERO SECTION FOR UNREGISTERED USERS */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#003178] via-[#071e27] to-[#002050] text-white p-6 sm:p-10 md:p-14 overflow-hidden shadow-xl border border-white/10">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#81f3e5]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[#81f3e5] text-[12px] font-bold tracking-wide font-mono-data">
            <span className="w-2 h-2 rounded-full bg-[#81f3e5] animate-ping" />
            <span>AI CLINICAL PROCUREMENT PLATFORM • GUEST ACCESS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-black tracking-tight leading-[1.1] text-white">
            Compare Surgical Costs & Get Instant AI Clinical Quotes
          </h1>

          <p className="text-[16px] sm:text-[18px] text-gray-200 leading-relaxed font-normal max-w-2xl">
            Upload diagnostic medical reports to receive automated AI clinical analysis, transparent package pricing from 120+ accredited NABH/JCI hospitals, and cashless TPA insurance approvals.
          </p>

          {/* CTAs Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              type="button"
              onClick={onStartNewCase}
              className="px-7 py-4 bg-[#81f3e5] text-[#006f66] hover:bg-white font-extrabold text-[15px] rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[22px]">add_notes</span>
              <span>Get Instant Quotes (Free)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('hospitals')}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[15px] rounded-2xl backdrop-blur transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">apartment</span>
              <span>Browse 120+ Hospitals</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('medical-tourism')}
              className="px-6 py-4 bg-[#81f3e5] hover:bg-[#62e4d4] text-[#003f3a] font-extrabold text-[15px] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
              <span>Medical Tourism India</span>
            </button>

            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-6 py-4 bg-white text-[#003178] hover:bg-blue-50 font-bold text-[15px] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">smartphone</span>
              <span>Sign In with Mobile</span>
            </button>
          </div>

          {/* Social Proof Stats Banner */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <span className="block text-[22px] sm:text-[26px] font-black font-mono-data text-[#81f3e5]">50,000+</span>
              <span className="text-[12px] text-gray-300 font-medium">Surgical Cases Analyzed</span>
            </div>
            <div>
              <span className="block text-[22px] sm:text-[26px] font-black font-mono-data text-[#81f3e5]">120+</span>
              <span className="text-[12px] text-gray-300 font-medium">NABH & JCI Hospitals</span>
            </div>
            <div>
              <span className="block text-[22px] sm:text-[26px] font-black font-mono-data text-[#81f3e5]">28% Avg</span>
              <span className="text-[12px] text-gray-300 font-medium">Package Cost Savings</span>
            </div>
            <div>
              <span className="block text-[22px] sm:text-[26px] font-black font-mono-data text-[#81f3e5]">30+ TPAs</span>
              <span className="text-[12px] text-gray-300 font-medium">Cashless Insurance Desk</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: INTERACTIVE PROCEDURE COST ESTIMATOR FOR UNREGISTERED USERS */}
      <section className="bg-white rounded-3xl border border-[#c3c6d4] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d4]/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 bg-[#e6f6ff] text-[#003178] font-bold text-[11px] rounded font-mono-data uppercase">
                GUEST ESTIMATOR
              </span>
              <span className="text-[12px] font-semibold text-[#006f66] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">price_check</span>
                Real-Time Package Rates
              </span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#003178]">
              Instant Surgical Cost Estimator
            </h2>
            <p className="text-[14px] text-[#434652]">
              Select a procedure below to check average package costs, duration of stay, and top recommended hospitals.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartNewCase}
            className="px-4 py-2.5 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 self-start md:self-center"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Request Custom Hospital Quote</span>
          </button>
        </div>

        {/* Procedure Buttons Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_PROCEDURES.map((proc) => {
            const isSelected = selectedProcedure.id === proc.id;
            return (
              <button
                key={proc.id}
                type="button"
                onClick={() => setSelectedProcedure(proc)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#003178] text-white border-[#003178] shadow-md scale-[1.01]'
                    : 'bg-[#f8fafc] text-[#071e27] border-[#c3c6d4] hover:bg-[#e6f6ff]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`material-symbols-outlined text-[22px] ${isSelected ? 'text-[#81f3e5]' : 'text-[#003178]'}`}>
                    {proc.icon}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-[#e6f6ff] text-[#003178]'}`}>
                    {proc.category}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[13px] leading-snug line-clamp-2">{proc.name}</h3>
                  <p className={`text-[11px] mt-1 font-mono-data ${isSelected ? 'text-gray-200' : 'text-[#737783]'}`}>
                    {proc.costRangeText}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Procedure Detailed Estimate Card */}
        <div className="p-6 bg-[#f3faff] rounded-2xl border border-[#003178]/20 space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#006f66] font-extrabold text-[11px] rounded font-mono-data">
                  {selectedProcedure.discountBadge}
                </span>
                <span className="text-[12px] text-[#737783] font-medium">Verified Package Estimates</span>
              </div>
              <h3 className="text-[20px] font-black text-[#003178]">{selectedProcedure.name}</h3>
              <p className="text-[13px] text-[#434652] mt-1">{selectedProcedure.description}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#c3c6d4] text-right shrink-0 shadow-sm">
              <span className="text-[11px] font-bold text-[#737783] uppercase tracking-wider block font-mono-data">ESTIMATED ALL-INCLUSIVE COST</span>
              <span className="text-[24px] font-black text-[#003178] font-mono-data">
                ₹{selectedProcedure.avgCostINR.toLocaleString('en-IN')}
              </span>
              <span className="block text-[11px] text-[#006f66] font-bold">Range: {selectedProcedure.costRangeText}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#003178]/10 text-[13px]">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#c3c6d4]/60">
              <span className="material-symbols-outlined text-[24px] text-[#003178]">bed</span>
              <div>
                <span className="text-[11px] text-[#737783] block">Average Hospital Stay</span>
                <strong className="text-[#071e27] font-mono-data">{selectedProcedure.estStay}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#c3c6d4]/60">
              <span className="material-symbols-outlined text-[24px] text-[#006f66]">apartment</span>
              <div>
                <span className="text-[11px] text-[#737783] block">Top Partner Facility</span>
                <strong className="text-[#071e27] truncate block">{selectedProcedure.topHospitalName}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#c3c6d4]/60">
              <span className="material-symbols-outlined text-[24px] text-amber-600">health_and_safety</span>
              <div>
                <span className="text-[11px] text-[#737783] block">Insurance Coverage</span>
                <strong className="text-[#071e27]">100% Cashless Eligible</strong>
              </div>
            </div>
          </div>

          {/* Action to create case directly */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#c3c6d4]">
            <p className="text-[13px] text-[#434652] font-medium">
              Want exact itemized quotes from Apollo, Fortis, Max, and Manipal for {selectedProcedure.name}?
            </p>
            <button
              type="button"
              onClick={onStartNewCase}
              className="px-5 py-2.5 bg-[#81f3e5] text-[#006f66] font-extrabold text-[13px] rounded-xl hover:bg-[#60ebd8] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Get 3 Verified Quotes</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED SHOWCASE SECTION: MEDICAL TOURISM INDIA HUB */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#002255] via-[#003178] to-[#071e27] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/60 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/15">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#81f3e5]/20 text-[#81f3e5] text-[12px] font-extrabold uppercase tracking-wider border border-[#81f3e5]/40 font-mono-data">
              <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
              <span>FEATURED HUB • MEDICAL TOURISM INDIA</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-black tracking-tight text-white leading-tight">
              World-Class Surgery in India at <span className="text-[#81f3e5]">50% to 90% Savings</span>
            </h2>
            <p className="text-[14px] sm:text-[15px] text-blue-100/90 leading-relaxed">
              Connect directly with JCI & NABH accredited hospital networks (Apollo, Fortis, Max, Manipal), get fast 24-48hr e-Medical Visa support, zero waiting lists, and dedicated international patient concierges.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('medical-tourism')}
            className="px-6 py-4 bg-[#81f3e5] hover:bg-white text-[#003f3a] font-extrabold text-[15px] rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[22px]">explore</span>
            <span>Open Medical Tourism Hub & Calculator</span>
          </button>
        </div>

        {/* Quick Cost Comparison Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 space-y-2">
            <span className="text-[11px] font-bold text-[#81f3e5] uppercase tracking-wider block font-mono-data">Heart Bypass (CABG)</span>
            <div className="flex items-baseline justify-between text-white">
              <span className="text-[12px] text-blue-200 line-through">US: $120,000</span>
              <strong className="text-[18px] font-black text-[#81f3e5] font-mono-data">$7,000</strong>
            </div>
            <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] rounded border border-emerald-400/30">
              Save 94% in India
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 space-y-2">
            <span className="text-[11px] font-bold text-[#81f3e5] uppercase tracking-wider block font-mono-data">Knee Replacement</span>
            <div className="flex items-baseline justify-between text-white">
              <span className="text-[12px] text-blue-200 line-through">US: $45,000</span>
              <strong className="text-[18px] font-black text-[#81f3e5] font-mono-data">$5,000</strong>
            </div>
            <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] rounded border border-emerald-400/30">
              Save 89% in India
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 space-y-2">
            <span className="text-[11px] font-bold text-[#81f3e5] uppercase tracking-wider block font-mono-data">IVF Fertility Cycle</span>
            <div className="flex items-baseline justify-between text-white">
              <span className="text-[12px] text-blue-200 line-through">US: $18,000</span>
              <strong className="text-[18px] font-black text-[#81f3e5] font-mono-data">$3,000</strong>
            </div>
            <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] rounded border border-emerald-400/30">
              Save 83% in India
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 space-y-2">
            <span className="text-[11px] font-bold text-[#81f3e5] uppercase tracking-wider block font-mono-data">e-Medical Visa Desk</span>
            <p className="text-[12px] text-blue-100 leading-snug">
              Official hospital invitation letters issued within 24 hours for instant visa approval.
            </p>
            <span className="inline-block px-2 py-0.5 bg-blue-500/30 text-blue-200 font-bold text-[10px] rounded border border-blue-400/30">
              Fast-Track Approval
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: GUEST DEMO REPORT ANALYZER */}
      <section className="bg-white rounded-3xl border border-[#c3c6d4] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d4]/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded font-mono-data uppercase">
                INTERACTIVE DEMO
              </span>
              <span className="text-[12px] font-semibold text-[#003178] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                MediQuote AI Intelligence Engine
              </span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#003178]">
              Test AI Clinical Report Extraction
            </h2>
            <p className="text-[14px] text-[#434652]">
              Select a sample diagnostic report below to see how MediQuote AI extracts ICD codes, clinical severity, and treatment recommendations instantly without login.
            </p>
          </div>
        </div>

        {/* Preset Sample Reports Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_PRESET_REPORTS.map((rep) => {
            const isSelected = selectedDemoReport.id === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => handleRunDemoAnalysis(rep)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#f3faff] border-[#003178] ring-2 ring-[#003178]/20 shadow-sm'
                    : 'bg-white border-[#c3c6d4] hover:border-[#003178]/50 hover:bg-[#f8fafc]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-[#003178] text-white text-[10px] font-bold rounded">
                      {rep.category}
                    </span>
                    <span className="text-[11px] font-mono-data text-[#737783]">{rep.icdCode}</span>
                  </div>
                  <h3 className="font-bold text-[14px] text-[#003178] leading-snug mb-1">{rep.title}</h3>
                  <p className="text-[12px] text-[#434652] line-clamp-2">{rep.findings}</p>
                </div>

                <div className="pt-3 border-t border-[#c3c6d4]/40 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#737783]">{rep.patient}</span>
                  <span className="text-[12px] font-bold text-[#006f66] flex items-center gap-1">
                    <span>Try Analysis</span>
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo AI Result Preview Card */}
        {isAnalyzingDemo ? (
          <div className="p-8 bg-[#071e27] text-white rounded-2xl flex flex-col items-center justify-center gap-3 text-center animate-pulse">
            <span className="material-symbols-outlined text-[40px] text-[#81f3e5] animate-spin">
              autorenew
            </span>
            <p className="font-bold text-[16px]">Analyzing Medical Diagnostic Report with Gemini Clinical AI...</p>
            <p className="text-[12px] text-gray-300">Extracting surgical parameters, severity scores, and hospital ICD classifications...</p>
          </div>
        ) : showDemoAnalysis && selectedDemoReport ? (
          <div className="p-6 bg-[#071e27] text-white rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 border border-[#81f3e5]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#81f3e5] text-[24px]">verified</span>
                <div>
                  <h3 className="font-extrabold text-[16px] text-[#81f3e5]">
                    AI Extraction Output for: {selectedDemoReport.title}
                  </h3>
                  <span className="text-[12px] text-gray-300">Patient: {selectedDemoReport.patient}</span>
                </div>
              </div>

              <span className="px-3 py-1 bg-[#81f3e5]/20 text-[#81f3e5] font-bold text-[12px] rounded-full border border-[#81f3e5]/40 font-mono-data">
                {selectedDemoReport.icdCode}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
              <div className="p-3.5 bg-white/10 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-[#81f3e5] uppercase font-mono-data">Key Diagnostic Findings</span>
                <p className="text-gray-200 leading-snug">{selectedDemoReport.findings}</p>
              </div>

              <div className="p-3.5 bg-white/10 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-[#81f3e5] uppercase font-mono-data">Recommended Treatment</span>
                <strong className="block text-white text-[14px]">{selectedDemoReport.procedure}</strong>
              </div>

              <div className="p-3.5 bg-white/10 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-[#81f3e5] uppercase font-mono-data">Clinical Urgency Timeline</span>
                <span className="block text-amber-300 font-bold">{selectedDemoReport.urgency}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[12px] text-gray-300">
                ⚡ Ready to receive actual hospital package quotations for this clinical report?
              </span>
              <button
                type="button"
                onClick={onStartNewCase}
                className="px-4 py-2 bg-[#81f3e5] text-[#006f66] font-extrabold text-[12px] rounded-lg hover:bg-white transition-all cursor-pointer shrink-0"
              >
                Create Free Surgical Case
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#f8fafc] rounded-2xl border border-dashed border-[#c3c6d4] text-center space-y-2">
            <span className="material-symbols-outlined text-[32px] text-[#003178]">touch_app</span>
            <p className="font-bold text-[14px] text-[#003178]">Click any report preset above to run real-time AI extraction</p>
            <p className="text-[12px] text-[#737783]">Or drag and drop your own PDF / photo report in the case creator.</p>
          </div>
        )}
      </section>

      {/* SECTION 3: WHY MEDIQUOTE AI (4 PILLARS) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 bg-[#81f3e5] text-[#006f66] font-extrabold text-[11px] rounded-full uppercase tracking-wider font-mono-data">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-[26px] sm:text-[32px] font-black text-[#003178]">
            Why Thousands of Patients Choose MediQuote AI
          </h2>
          <p className="text-[14px] text-[#434652]">
            Eliminate surgical cost uncertainty with transparent hospital bidding, AI diagnostic insights, and dedicated concierge support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#c3c6d4] shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#e6f6ff] text-[#003178] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">psychology</span>
            </div>
            <h3 className="font-bold text-[16px] text-[#003178]">AI Clinical Extraction</h3>
            <p className="text-[13px] text-[#434652] leading-relaxed">
              Gemini AI parses complex medical reports to determine exact ICD-10 codes, required surgical procedures, and clinical urgency.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#c3c6d4] shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006f66] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">request_quote</span>
            </div>
            <h3 className="font-bold text-[16px] text-[#003178]">Multi-Hospital Bidding</h3>
            <p className="text-[13px] text-[#434652] leading-relaxed">
              Compare transparent, itemized quotes from Apollo, Fortis, Max, and Manipal with surgeon credentials and room inclusion details.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#c3c6d4] shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">verified_user</span>
            </div>
            <h3 className="font-bold text-[16px] text-[#003178]">Cashless Insurance TPA</h3>
            <p className="text-[13px] text-[#434652] leading-relaxed">
              Direct verification with 30+ insurance providers and Star Health, Care, Niva Bupa to secure maximum pre-authorization coverage.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#c3c6d4] shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">support_agent</span>
            </div>
            <h3 className="font-bold text-[16px] text-[#003178]">24/7 Care Concierge</h3>
            <p className="text-[13px] text-[#434652] leading-relaxed">
              Dedicated medical coordinator guides you through hospital admission, surgeon consultation scheduling, and discharge assistance.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: PREMIER ACCREDITED HOSPITALS SHOWCASE */}
      <section className="bg-white rounded-3xl border border-[#c3c6d4] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d4]/60">
          <div>
            <span className="text-[11px] font-bold text-[#006f66] uppercase tracking-wider block font-mono-data mb-1">
              ACCREDITED HEALTHCARE NETWORK
            </span>
            <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#003178]">
              Top Accredited Partner Hospitals
            </h2>
            <p className="text-[14px] text-[#434652]">
              Direct network connectivity with JCI and NABH accredited super-specialty hospitals.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('hospitals')}
            className="px-4 py-2 bg-[#e6f6ff] text-[#003178] border border-[#003178]/30 font-bold text-[13px] rounded-xl hover:bg-[#dbf1fe] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-center"
          >
            <span>View All 120+ Hospitals</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'apollo-1',
              name: 'Apollo Hospitals',
              location: 'Greams Road, Chennai',
              rating: 4.9,
              reviews: 1420,
              beds: 560,
              badge: 'JCI Accredited',
              img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
            },
            {
              id: 'fortis-2',
              name: 'Fortis Healthcare',
              location: 'Bannerghatta, Bengaluru',
              rating: 4.8,
              reviews: 980,
              beds: 420,
              badge: 'NABH Certified',
              img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80',
            },
            {
              id: 'max-3',
              name: 'Max Super Speciality',
              location: 'Saket, New Delhi',
              rating: 4.9,
              reviews: 1150,
              beds: 500,
              badge: 'Robotic Surgery Hub',
              img: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=400&q=80',
            },
            {
              id: 'manipal-4',
              name: 'Manipal Hospital',
              location: 'Old Airport Road, Bengaluru',
              rating: 4.7,
              reviews: 890,
              beds: 600,
              badge: 'NABH Accredited',
              img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=400&q=80',
            },
          ].map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => {
                if (onViewHospitalProfile) {
                  onViewHospitalProfile(hosp.id);
                } else {
                  onNavigate('hospitals');
                }
              }}
              className="bg-[#f8fafc] rounded-2xl border border-[#c3c6d4] overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 relative overflow-hidden bg-slate-200">
                  <img
                    src={hosp.img}
                    alt={hosp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#003178] text-white text-[10px] font-bold rounded shadow-sm">
                    {hosp.badge}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-[15px] text-[#003178] group-hover:text-[#006f66] transition-colors leading-snug">
                    {hosp.name}
                  </h3>
                  <p className="text-[12px] text-[#737783] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="truncate">{hosp.location}</span>
                  </p>

                  <div className="flex items-center justify-between text-[12px] pt-1">
                    <span className="font-bold text-amber-600 flex items-center gap-1 font-mono-data">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <span>{hosp.rating} ({hosp.reviews})</span>
                    </span>
                    <span className="text-[#434652] font-mono-data">{hosp.beds} Beds</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border-t border-[#c3c6d4]/60 text-center">
                <span className="text-[12px] font-bold text-[#003178] group-hover:underline flex items-center justify-center gap-1">
                  <span>View Hospital Profile & Rates</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: PRODUCTION MOBILE AUTHENTICATION & ACCESS */}
      <section className="bg-gradient-to-r from-[#003178] to-[#071e27] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="px-3 py-1 bg-[#81f3e5] text-[#006f66] font-extrabold text-[11px] rounded-full uppercase tracking-wider font-mono-data">
            SECURE MOBILE AUTHENTICATION
          </span>
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight text-white">
            Ready to Compare Verified Hospital Quotations?
          </h2>
          <p className="text-[15px] text-gray-200">
            Log in using your mobile phone number with instant SMS OTP verification to access case details and hospital quotes.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#81f3e5] text-[#003178] flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-[36px]">smartphone</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-[22px] text-white">Mobile Number OTP Login</h3>
            <p className="text-[13px] text-gray-200">
              Patients and System Administrators (+919246195689) authenticate via encrypted SMS OTP.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-6 py-3.5 bg-[#81f3e5] hover:bg-white text-[#004f48] font-extrabold text-[15px] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span>Sign In with Mobile Number</span>
            </button>
            <button
              type="button"
              onClick={onStartNewCase}
              className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-[15px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get Immediate Quote</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
