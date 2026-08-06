import React, { useState } from 'react';
import { ViewMode } from '../types';

interface MedicalTourismViewProps {
  onNavigate: (view: ViewMode) => void;
  onStartNewCase: () => void;
}

type Currency = 'USD' | 'GBP' | 'EUR' | 'AED' | 'INR';

interface CurrencyRate {
  symbol: string;
  rateToUSD: number; // Multiply USD amount by this rate
  label: string;
}

const currencyConfig: Record<Currency, CurrencyRate> = {
  USD: { symbol: '$', rateToUSD: 1, label: 'USD ($)' },
  GBP: { symbol: '£', rateToUSD: 0.78, label: 'GBP (£)' },
  EUR: { symbol: '€', rateToUSD: 0.92, label: 'EUR (€)' },
  AED: { symbol: 'AED ', rateToUSD: 3.67, label: 'AED (د.إ)' },
  INR: { symbol: '₹', rateToUSD: 83.5, label: 'INR (₹)' },
};

interface CostRow {
  treatment: string;
  usaUsd: number;
  ukUsd: number;
  indiaMinUsd: number;
  indiaMaxUsd: number;
  savingsPercent: string;
  category: string;
}

const costData: CostRow[] = [
  {
    treatment: 'Heart Bypass (CABG)',
    usaUsd: 120000,
    ukUsd: 70000,
    indiaMinUsd: 7000,
    indiaMaxUsd: 10000,
    savingsPercent: '90-94%',
    category: 'Cardiac Surgery',
  },
  {
    treatment: 'Knee Replacement (Single)',
    usaUsd: 45000,
    ukUsd: 20000,
    indiaMinUsd: 5000,
    indiaMaxUsd: 7000,
    savingsPercent: '85-89%',
    category: 'Orthopedics',
  },
  {
    treatment: 'Hip Replacement (Single)',
    usaUsd: 40000,
    ukUsd: 18000,
    indiaMinUsd: 5000,
    indiaMaxUsd: 7000,
    savingsPercent: '82-87%',
    category: 'Orthopedics',
  },
  {
    treatment: 'IVF & Fertility (Per Cycle)',
    usaUsd: 18000,
    ukUsd: 8000,
    indiaMinUsd: 3000,
    indiaMaxUsd: 5000,
    savingsPercent: '72-83%',
    category: 'Reproductive Care',
  },
  {
    treatment: 'Cosmetic / Plastic Surgery',
    usaUsd: 15000,
    ukUsd: 10000,
    indiaMinUsd: 2000,
    indiaMaxUsd: 5000,
    savingsPercent: '70-86%',
    category: 'Aesthetic Surgery',
  },
  {
    treatment: 'Spine Surgery (Lumbar Fusion)',
    usaUsd: 65000,
    ukUsd: 32000,
    indiaMinUsd: 6000,
    indiaMaxUsd: 9000,
    savingsPercent: '86-90%',
    category: 'Neurosurgery & Spine',
  },
  {
    treatment: 'Cataract / Eye Surgery (Both Eyes)',
    usaUsd: 8500,
    ukUsd: 4200,
    indiaMinUsd: 1000,
    indiaMaxUsd: 1800,
    savingsPercent: '78-88%',
    category: 'Ophthalmology',
  },
  {
    treatment: 'Dental Implants (Full Arch)',
    usaUsd: 22000,
    ukUsd: 12000,
    indiaMinUsd: 2500,
    indiaMaxUsd: 4000,
    savingsPercent: '81-88%',
    category: 'Dental Sciences',
  },
];

const popularSpecialties = [
  {
    title: 'Cardiac Surgery',
    icon: 'favorite',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Bypass (CABG), Valve Replacement, Pediatric Cardiac Repair, Angioplasty',
    avgStay: '5-7 Days Hospital',
  },
  {
    title: 'Orthopedic Surgery',
    icon: 'orthopedics',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Robotic Total Knee & Hip Replacement, ACL Reconstruction, Arthroscopy',
    avgStay: '3-5 Days Hospital',
  },
  {
    title: 'Cancer Treatment (Oncology)',
    icon: 'genetics',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'CyberKnife Radiation, Immunotherapy, Bone Marrow Transplant, Tumor Resection',
    avgStay: '1-3 Weeks Protocol',
  },
  {
    title: 'Organ Transplant',
    icon: 'vital_signs',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Liver Transplant, Kidney Transplant, Heart & Lung Transplant (Legal Compliance)',
    avgStay: '2-4 Weeks Post-Op',
  },
  {
    title: 'IVF & Reproductive Medicine',
    icon: 'child_care',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    description: 'ICSI, Blastocyst Culture, Egg Freezing, PGT-A Genetic Screening',
    avgStay: '10-14 Days Visit',
  },
  {
    title: 'Cosmetic & Reconstruction',
    icon: 'face',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Rhinoplasty, Liposuction, Hair Transplant, Post-Bariatric Body Contouring',
    avgStay: '2-4 Days Hospital',
  },
  {
    title: 'Dental Care & Implants',
    icon: 'dentistry',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'All-on-4 Dental Implants, Zirconia Crowns, Full Mouth Rehabilitation',
    avgStay: '3-5 Days Stay',
  },
  {
    title: 'Ophthalmology (Eye)',
    icon: 'visibility',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    description: 'Femto-Laser Cataract, SMILE LASIK Vision Correction, Vitreoretinal Surgery',
    avgStay: 'Day Care Surgery',
  },
  {
    title: 'Spine Surgery',
    icon: 'accessibility_new',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Microdiscectomy, Scoliosis Correction, Endoscopic Spine Decompression',
    avgStay: '3-5 Days Hospital',
  },
  {
    title: 'Neurology & Neurosurgery',
    icon: 'psychology',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    description: 'Brain Tumor Craniotomy, Deep Brain Stimulation (DBS), Epilepsy Surgery',
    avgStay: '5-10 Days Hospital',
  },
  {
    title: 'Robotic Surgery',
    icon: 'smart_toy',
    color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    description: 'Da Vinci Xi Robotic Surgery for Prostate, Gynaecology & GI Procedures',
    avgStay: '2-3 Days Hospital',
  },
  {
    title: 'Wellness & Ayurveda',
    icon: 'spa',
    color: 'bg-lime-50 text-lime-800 border-lime-200',
    description: 'Panchakarma Detoxification, Post-Surgical Rehabilitation, Chronic Pain Management',
    avgStay: '7-21 Days Retreat',
  },
];

const targetCountries = [
  { region: 'South Asia', flag: '🌏', list: ['Bangladesh', 'Nepal', 'Sri Lanka', 'Maldives', 'Afghanistan'], flightTime: '1 - 3.5 Hours' },
  { region: 'Middle East & Gulf', flag: '🕌', list: ['UAE', 'Oman', 'Saudi Arabia', 'Kuwait', 'Iraq'], flightTime: '3 - 4.5 Hours' },
  { region: 'Africa', flag: '🌍', list: ['Nigeria', 'Kenya', 'Tanzania', 'Ethiopia'], flightTime: '5 - 8 Hours' },
  { region: 'Western & Americas', flag: '🗽', list: ['United Kingdom', 'USA', 'Canada (Select Procedures)'], flightTime: '9 - 15 Hours' },
];

export const MedicalTourismView: React.FC<MedicalTourismViewProps> = ({ onNavigate, onStartNewCase }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<'hospitals' | 'travel' | 'stay' | 'support' | 'followup'>('hospitals');

  // Interactive Estimator state
  const [originCountry, setOriginCountry] = useState('UAE');
  const [selectedProcedure, setSelectedProcedure] = useState('Knee Replacement (Single)');
  const [roomType, setRoomType] = useState<'deluxe' | 'suite' | 'standard'>('deluxe');
  const [stayDurationDays, setStayDurationDays] = useState(10);

  const curr = currencyConfig[selectedCurrency];

  const formatPrice = (usdAmount: number) => {
    const converted = Math.round(usdAmount * curr.rateToUSD);
    return `${curr.symbol}${converted.toLocaleString()}`;
  };

  // Find matching cost row
  const activeCostRow = costData.find((c) => c.treatment === selectedProcedure) || costData[1];
  const baseIndiaCostUsd = (activeCostRow.indiaMinUsd + activeCostRow.indiaMaxUsd) / 2;
  const roomMultiplier = roomType === 'suite' ? 1.25 : roomType === 'standard' ? 0.85 : 1.0;
  const calculatedHospitalCost = baseIndiaCostUsd * roomMultiplier;
  const estimatedFlightCost = originCountry === 'USA' || originCountry === 'Canada' || originCountry === 'United Kingdom' ? 1200 : originCountry === 'Nigeria' || originCountry === 'Kenya' ? 750 : 350;
  const accommodationPerNightUsd = roomType === 'suite' ? 110 : 65;
  const estimatedHotelCost = accommodationPerNightUsd * stayDurationDays;
  const totalPackageCostUsd = calculatedHospitalCost + estimatedFlightCost + estimatedHotelCost;
  const homeCountryAvgUsd = activeCostRow.usaUsd;
  const totalSavingsUsd = Math.max(0, homeCountryAvgUsd - totalPackageCostUsd);

  return (
    <div className="space-y-8 pb-16 selection:bg-[#81f3e5] max-w-7xl mx-auto">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#003178] via-[#002255] to-[#00173d] text-white rounded-3xl p-6 md:p-10 shadow-2xl border border-blue-900">
        <div className="relative z-10 space-y-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#81f3e5]/20 border border-[#81f3e5]/40 text-[#81f3e5] text-[12px] font-extrabold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
            <span>Global Medical Tourism Hub • India</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            World-Class Care in India at <span className="text-[#81f3e5]">50% – 90% Less Cost</span>
          </h1>

          <p className="text-blue-100/90 text-[15px] sm:text-[16px] leading-relaxed font-normal">
            Connect directly with JCI & NABH accredited Indian tertiary hospitals, world-renowned surgeons, zero waiting times, and end-to-end AI e-Medical Visa & travel concierge.
          </p>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[20px] font-extrabold text-[#81f3e5] block font-mono-data">50–90%</span>
              <span className="text-[11px] text-blue-100 font-medium block">Cost Savings</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[20px] font-extrabold text-[#81f3e5] block font-mono-data">JCI & NABH</span>
              <span className="text-[11px] text-blue-100 font-medium block">Accredited Hospitals</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[20px] font-extrabold text-[#81f3e5] block font-mono-data">Zero Wait</span>
              <span className="text-[11px] text-blue-100 font-medium block">Priority Scheduling</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[20px] font-extrabold text-[#81f3e5] block font-mono-data">e-Medical Visa</span>
              <span className="text-[11px] text-blue-100 font-medium block">24-48hr Fast-Track</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onStartNewCase}
              className="px-6 py-3.5 bg-[#81f3e5] hover:bg-[#62e4d4] text-[#003f3a] font-extrabold rounded-2xl transition-all shadow-lg text-[14px] flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">add_notes</span>
              <span>Submit Case for International Quotes</span>
            </button>

            <button
              onClick={() => onNavigate('hospitals')}
              className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl transition-all border border-white/20 text-[14px] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">apartment</span>
              <span>Explore Partner Hospitals</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-[#006f66]/30 blur-3xl pointer-events-none" />
      </div>

      {/* COST COMPARISON TABLE WITH CURRENCY SWITCHER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px] text-[#003178]">payments</span>
              <h2 className="text-2xl font-black text-[#071e27]">Treatment Cost Advantage: USA / UK vs. India</h2>
            </div>
            <p className="text-[13px] text-[#737783] mt-1">
              Compare average out-of-pocket costs for top procedures. India provides 50% to 90% savings with identical gold-standard clinical outcomes.
            </p>
          </div>

          {/* Currency Switcher Controls */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto">
            <span className="text-[11px] font-bold text-[#737783] pl-2 uppercase tracking-wider">Currency:</span>
            {(Object.keys(currencyConfig) as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCurrency(c)}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[12px] transition-all ${
                  selectedCurrency === c
                    ? 'bg-[#003178] text-white shadow-sm'
                    : 'text-[#434652] hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-[#737783] uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 rounded-l-xl">Medical Treatment / Procedure</th>
                <th className="py-3.5 px-4 text-slate-500">USA Average</th>
                <th className="py-3.5 px-4 text-slate-500">UK Average</th>
                <th className="py-3.5 px-4 text-[#006f66] bg-[#81f3e5]/20">India Package (Est.)</th>
                <th className="py-3.5 px-4 text-[#006f66] text-right rounded-r-xl">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {costData.map((row) => (
                <tr key={row.treatment} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#071e27]">
                    <div>{row.treatment}</div>
                    <span className="text-[11px] text-[#737783] font-normal">{row.category}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-mono-data">{formatPrice(row.usaUsd)}</td>
                  <td className="py-4 px-4 text-slate-600 font-mono-data">{formatPrice(row.ukUsd)}</td>
                  <td className="py-4 px-4 font-extrabold text-[#003178] bg-[#81f3e5]/10 font-mono-data">
                    {formatPrice(row.indiaMinUsd)} – {formatPrice(row.indiaMaxUsd)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Save {row.savingsPercent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 12 POPULAR MEDICAL SPECIALTIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#071e27]">Popular Medical Specialties</h2>
            <p className="text-[13px] text-[#737783]">Advanced tertiary care provided by internationally trained specialist doctors.</p>
          </div>
          <span className="text-[12px] font-bold text-[#003178] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            12 Major Specialties
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {popularSpecialties.map((spec) => (
            <div
              key={spec.title}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-[#003178] transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${spec.color}`}>
                    <span className="material-symbols-outlined text-[22px]">{spec.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {spec.avgStay}
                  </span>
                </div>

                <h3 className="font-extrabold text-[16px] text-[#071e27] group-hover:text-[#003178] transition-colors">
                  {spec.title}
                </h3>

                <p className="text-[12px] text-[#737783] leading-relaxed">
                  {spec.description}
                </p>
              </div>

              <button
                onClick={onStartNewCase}
                className="w-full py-2 bg-slate-50 hover:bg-[#003178] text-[#003178] hover:text-white font-bold text-[12px] rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-1 mt-2"
              >
                <span>Request Quote</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* INTERACTIVE GLOBAL CARE BUDGET CALCULATOR */}
      <div className="bg-gradient-to-br from-[#f3faff] via-white to-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-[#003178] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">calculate</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#071e27]">AI Global Travel & Medical Care Estimator</h2>
            <p className="text-[13px] text-[#737783]">Calculate full package cost including hospital surgery, flights, visa, and local stay.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls - Col 1-7 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">Patient Origin Country</label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-[13px] focus:ring-2 focus:ring-[#003178]"
                >
                  <option value="UAE">UAE (Dubai / Abu Dhabi)</option>
                  <option value="Oman">Oman (Muscat)</option>
                  <option value="Saudi Arabia">Saudi Arabia (Riyadh)</option>
                  <option value="Nigeria">Nigeria (Lagos / Abuja)</option>
                  <option value="Kenya">Kenya (Nairobi)</option>
                  <option value="Bangladesh">Bangladesh (Dhaka)</option>
                  <option value="United Kingdom">United Kingdom (London)</option>
                  <option value="USA">USA (New York / Chicago)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">Medical Procedure</label>
                <select
                  value={selectedProcedure}
                  onChange={(e) => setSelectedProcedure(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-[13px] focus:ring-2 focus:ring-[#003178]"
                >
                  {costData.map((c) => (
                    <option key={c.treatment} value={c.treatment}>
                      {c.treatment}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">Room Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setRoomType('standard')}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                      roomType === 'standard'
                        ? 'bg-[#003178] text-white border-[#003178]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Standard AC
                  </button>
                  <button
                    onClick={() => setRoomType('deluxe')}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                      roomType === 'deluxe'
                        ? 'bg-[#003178] text-white border-[#003178]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Deluxe Suite
                  </button>
                  <button
                    onClick={() => setRoomType('suite')}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                      roomType === 'suite'
                        ? 'bg-[#003178] text-white border-[#003178]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    VIP Luxury
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">
                  Estimated Total Stay Duration ({stayDurationDays} Days)
                </label>
                <input
                  type="range"
                  min={5}
                  max={21}
                  value={stayDurationDays}
                  onChange={(e) => setStayDurationDays(parseInt(e.target.value))}
                  className="w-full accent-[#003178] cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] text-[#737783] font-semibold mt-1">
                  <span>5 Days (Short)</span>
                  <span>14 Days (Standard)</span>
                  <span>21 Days (Rehab)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Result Card - Col 8-12 */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[12px] font-bold text-[#737783] uppercase tracking-wider">
                Estimated Total Trip Cost
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[11px] rounded-full">
                Save ~{formatPrice(totalSavingsUsd)}
              </span>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <div className="flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">apartment</span>
                  Hospital Surgical Package:
                </span>
                <strong className="font-mono-data text-[#071e27]">{formatPrice(calculatedHospitalCost)}</strong>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">flight</span>
                  Return Flights & e-Visa:
                </span>
                <strong className="font-mono-data text-[#071e27]">{formatPrice(estimatedFlightCost)}</strong>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-purple-600">hotel</span>
                  Hotel & Local Stay ({stayDurationDays}d):
                </span>
                <strong className="font-mono-data text-[#071e27]">{formatPrice(estimatedHotelCost)}</strong>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-extrabold text-[#071e27] text-[15px]">Estimated Grand Total:</span>
                <span className="text-[24px] font-black text-[#003178] font-mono-data">
                  {formatPrice(totalPackageCostUsd)}
                </span>
              </div>
            </div>

            <button
              onClick={onStartNewCase}
              className="w-full py-3 bg-[#003178] hover:bg-[#0d47a1] text-white font-extrabold rounded-xl transition-all shadow text-[13px] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Request Hospital Invitation & Quotes</span>
            </button>
          </div>
        </div>
      </div>

      {/* TARGET ORIGIN COUNTRIES & REGIONAL HUB SUPPORT */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-[#071e27]">Target Origin Patient Hubs</h2>
          <p className="text-[13px] text-[#737783]">India welcomes over 700,000 international patients annually from over 50 nations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {targetCountries.map((item) => (
            <div key={item.region} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="text-2xl">{item.flag}</span>
                <h3 className="font-extrabold text-[15px] text-[#071e27]">{item.region}</h3>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#737783] uppercase tracking-wider block">Key Countries:</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.list.map((c) => (
                    <span key={c} className="px-2.5 py-1 bg-slate-100 text-[#071e27] font-semibold text-[11px] rounded-lg border border-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#737783] flex items-center justify-between border-t border-slate-100">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">flight</span>
                  {item.flightTime} flight
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  24-48h e-Visa
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* END-TO-END BUSINESS ECOSYSTEM TABS */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-[#071e27]">360° Medical Tourism Business Ecosystem</h2>
          <p className="text-[13px] text-[#737783]">MediQuote AI coordinates every link in the international patient care journey.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'hospitals', label: 'Hospitals & Surgery', icon: 'apartment' },
            { id: 'travel', label: 'Travel & Visa Desk', icon: 'flight_takeoff' },
            { id: 'stay', label: 'Accommodation & Hotels', icon: 'hotel' },
            { id: 'support', label: 'Translators & Support', icon: 'translate' },
            { id: 'followup', label: 'Post-Care & Tele-Consult', icon: 'video_chat' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveEcosystemTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all cursor-pointer ${
                activeEcosystemTab === tab.id
                  ? 'bg-[#003178] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-[#dbf1fe] text-[#434652] hover:text-[#003178] border border-slate-200/80'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        {activeEcosystemTab === 'hospitals' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Multi-Specialty Hospitals</h4>
              <p className="text-[12px] text-[#737783]">
                JCI & NABH accredited tertiary medical centers (Apollo, Fortis, Manipal, Max, Medanta) equipped with 500+ beds, modular operating theaters, and dedicated international patient lounges.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Specialty Super-Clinics</h4>
              <p className="text-[12px] text-[#737783]">
                Focused single-specialty centers for Day-Care Surgery, Advanced Eye Care, Robotic Joint Replacement, and Hair & Cosmetic Restoration with rapid discharge protocols.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Reproductive & IVF Centers</h4>
              <p className="text-[12px] text-[#737783]">
                High-success fertility centers equipped with cleanrooms, time-lapse embryology, and comprehensive genetic counseling for international couples.
              </p>
            </div>
          </div>
        )}

        {activeEcosystemTab === 'travel' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Government e-Medical Visa</h4>
              <p className="text-[12px] text-[#737783]">
                MediQuote AI generates official hospital visa invitation letters required by Indian Embassies for fast 24 to 48-hour e-Medical Visa approval.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">24/7 Airport Pickup & Transport</h4>
              <p className="text-[12px] text-[#737783]">
                Complimentary private AC sedan or basic/advanced life support ambulance pickup directly at Delhi, Mumbai, Bangalore, or Chennai airport terminals.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Flight Rescheduling & Desk</h4>
              <p className="text-[12px] text-[#737783]">
                Flexible flight booking, stretcher seat arrangements, and fit-to-fly clearance certifications issued by chief hospital consultants.
              </p>
            </div>
          </div>
        )}

        {activeEcosystemTab === 'stay' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">5-Star & Partner Hotels</h4>
              <p className="text-[12px] text-[#737783]">
                Corporate rates with 4-star and 5-star hotel chains within 2km radius of hospital campus with wheelchair access and custom dietary menus.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Serviced Apartments</h4>
              <p className="text-[12px] text-[#737783]">
                Fully furnished 1BHK & 2BHK apartments with private kitchenettes, daily housekeeping, and laundry facilities for extended 14-30 day recoveries.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Patient Guest Houses</h4>
              <p className="text-[12px] text-[#737783]">
                Affordable, sanitized patient residences managed by hospital international desks offering home-like comfort for attendants and family members.
              </p>
            </div>
          </div>
        )}

        {activeEcosystemTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Native Medical Translators</h4>
              <p className="text-[12px] text-[#737783]">
                Dedicated multi-lingual interpreters for Arabic, Swahili, Bengali, French, Russian, and Persian assigned to assist during doctor consultations and surgery rounds.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">SIM, Currency & Local Transport</h4>
              <p className="text-[12px] text-[#737783]">
                Immediate local Indian SIM card activation upon arrival, transparent forex currency exchange, and dedicated chauffeur car hire services.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">International TPA Insurance</h4>
              <p className="text-[12px] text-[#737783]">
                Direct coordination with global health insurers (Cigna International, Bupa, Allianz, Oman Insurance) for cashless pre-authorization.
              </p>
            </div>
          </div>
        )}

        {activeEcosystemTab === 'followup' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Tele-Consultations</h4>
              <p className="text-[12px] text-[#737783]">
                HD video follow-up calls with operating chief surgeons after returning home to review wound healing, lab reports, and medication tapering.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Digital Health Vault</h4>
              <p className="text-[12px] text-[#737783]">
                All discharge summaries, operative notes, DICOM MRI/CT scans, and prescriptions accessible 24/7 on MediQuote AI platform.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-[15px] text-[#003178]">Home Doctor Handover</h4>
              <p className="text-[12px] text-[#737783]">
                Formal clinical handover summary issued for patient's local primary physician in home country to ensure seamless long-term continuity of care.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* GOVERNMENT OF INDIA E-MEDICAL VISA GUIDANCE */}
      <div className="bg-[#003178] text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[32px] text-[#81f3e5]">verified</span>
            <div>
              <h2 className="text-2xl font-black text-white">Government of India e-Medical Visa Portal Guide</h2>
              <p className="text-blue-200 text-[13px]">Fast-track electronic visa approval (e-MV) for international patients and up to 2 medical attendants.</p>
            </div>
          </div>

          <a
            href="https://indianvisaonline.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#81f3e5] hover:bg-[#62e4d4] text-[#003f3a] font-extrabold rounded-xl text-[12px] flex items-center gap-1.5 shrink-0"
          >
            <span>Official Visa Portal</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#81f3e5] text-[#003178] font-extrabold text-[12px] flex items-center justify-center">1</span>
            <h4 className="font-bold text-[14px] text-white">Request Visa Letter</h4>
            <p className="text-[12px] text-blue-100">
              Submit case details on MediQuote AI to receive an official Medical Invitation Letter signed by an accredited hospital.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#81f3e5] text-[#003178] font-extrabold text-[12px] flex items-center justify-center">2</span>
            <h4 className="font-bold text-[14px] text-white">Apply Online</h4>
            <p className="text-[12px] text-blue-100">
              Fill out the e-Medical Visa form at indianvisaonline.gov.in with passport copy and hospital letter.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#81f3e5] text-[#003178] font-extrabold text-[12px] flex items-center justify-center">3</span>
            <h4 className="font-bold text-[14px] text-white">24-48hr Approval</h4>
            <p className="text-[12px] text-blue-100">
              Receive Electronic Travel Authorization (ETA) directly via email. Valid for triple entry within 60 days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#81f3e5] text-[#003178] font-extrabold text-[12px] flex items-center justify-center">4</span>
            <h4 className="font-bold text-[14px] text-white">Airport Fast-Track</h4>
            <p className="text-[12px] text-blue-100">
              Present ETA printout at dedicated e-Visa immigration counters upon landing in India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
