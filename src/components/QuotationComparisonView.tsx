import React, { useState, useEffect } from 'react';
import { SurgicalCase, HospitalQuote, ViewMode } from '../types';
import { AIClinicalAnalysisCard } from './AIClinicalAnalysisCard';
import { AIClinicalReportModal } from './AIClinicalReportModal';

interface QuotationComparisonViewProps {
  currentCase: SurgicalCase;
  onSelectHospitalForBooking: (hospital: HospitalQuote) => void;
  onViewQuoteDetails: (hospital: HospitalQuote) => void;
  onViewHospitalProfile?: (hospitalId: string) => void;
  onOpenShareModal: () => void;
  onNavigate: (view: ViewMode) => void;
  onRequestQuoteForHospital?: (hospitalName: string) => void;
  onUpdateCaseAnalysis?: (caseId: string, updatedAnalysis: any, updatedHospitals?: HospitalQuote[]) => void;
}

export const QuotationComparisonView: React.FC<QuotationComparisonViewProps> = ({
  currentCase,
  onSelectHospitalForBooking,
  onViewQuoteDetails,
  onViewHospitalProfile,
  onOpenShareModal,
  onRequestQuoteForHospital,
  onUpdateCaseAnalysis,
}) => {
  const [aiAdviceText, setAiAdviceText] = useState<string | null>(null);
  const [isLoadingAiAdvice, setIsLoadingAiAdvice] = useState(false);
  const [isRefreshingAI, setIsRefreshingAI] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMapHospitalId, setSelectedMapHospitalId] = useState<string>(currentCase.hospitals[0]?.id || '');

  const handleRefreshAIAnalysis = async () => {
    setIsRefreshingAI(true);
    try {
      const res = await fetch('/api/generate-case-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: currentCase.title,
          procedureTitle: currentCase.title,
          symptomsDescription: currentCase.description,
          urgency: 'Moderate',
          preferredCity: 'Bangalore',
          insuranceProvider: currentCase.insuranceCompatibilityNotice || 'HDFC Optima Restore',
          policyNumber: 'HDFC-OPT-992014',
          vitalsSummaryText: currentCase.vitals?.bloodPressureStr ? `BP ${currentCase.vitals.bloodPressureStr}` : 'Vitals logged',
          attachedRecordCount: currentCase.attachedRecordIds?.length || 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.treatmentRecommendation && onUpdateCaseAnalysis) {
          onUpdateCaseAnalysis(currentCase.id, data, data.hospitals);
        }
      }
    } catch (err) {
      console.error('Error refreshing AI analysis:', err);
    } finally {
      setIsRefreshingAI(false);
    }
  };

  useEffect(() => {
    if (currentCase?.hospitals?.[0]?.id) {
      setSelectedMapHospitalId(currentCase.hospitals[0].id);
    }
  }, [currentCase?.id]);

  const downloadCSV = () => {
    const csvRows = [
      ['Hospital Name', 'Total Quote (INR)', 'Room Category', 'Lead Doctor', 'Est. Stay', 'Rating'],
      ...currentCase.hospitals.map((h) => [
        `"${h.hospitalName}"`,
        h.totalQuoteINR,
        `"${h.roomInclusion}"`,
        `"${h.doctorName}"`,
        `"${h.estStay}"`,
        h.rating
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MediQuote_Case_${currentCase.caseCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchAiAdvice = async () => {
    setIsLoadingAiAdvice(true);
    try {
      const res = await fetch('/api/ai-procurement-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: currentCase.title,
          insurancePolicy: currentCase.insuranceCompatibilityNotice || 'HDFC Optima Restore',
          userQuery: `Compare cashless coverage, surgical team experience, and pricing for ${currentCase.title}.`
        })
      });
      const data = await res.json();
      if (data && data.advice) {
        setAiAdviceText(data.advice);
      }
    } catch (err) {
      console.error('Error fetching AI advice:', err);
    } finally {
      setIsLoadingAiAdvice(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Header Info Bar - Designed like Hospital Page (`#00201d` Teal Theme) */}
      <div className="bg-[#00201d] text-white rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#006f66]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#006f66] text-[#81f3e5] font-extrabold text-[11px] rounded font-mono-data border border-[#81f3e5]/30">
                CASE: {currentCase.caseCode}
              </span>
              <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#00201d] font-bold text-[11px] rounded">
                3 QUOTES RECEIVED & COMPARED
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[11px] rounded">
                SAVED TO DOSSIER
              </span>
            </div>

            <h1 className="text-[24px] md:text-[28px] font-extrabold text-white tracking-tight">
              {currentCase.title}
            </h1>
            <p className="text-gray-300 text-[14px] max-w-3xl">
              {currentCase.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all text-[13px]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#81f3e5]">download</span>
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#81f3e5] text-[#00201d] hover:bg-[#6bead9] font-extrabold rounded-xl transition-all text-[13px] shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION & CLINICAL REPORT CARD */}
      <AIClinicalAnalysisCard
        currentCase={currentCase}
        onOpenFullModal={() => setIsReportModalOpen(true)}
        onRefreshAIAnalysis={handleRefreshAIAnalysis}
        isRefreshingAI={isRefreshingAI}
      />

      {/* FULL DETAILED CLINICAL REPORT MODAL */}
      <AIClinicalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentCase={currentCase}
        onRequestQuote={onRequestQuoteForHospital}
      />

      {/* Hospital Quotation Header & View Switcher */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#c3c6d4]">
          <h2 className="text-[18px] font-extrabold text-[#003178] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006f66]">payments</span>
            <span>Hospital Quotations ({currentCase.hospitals.length} Available)</span>
          </h2>

          {/* View Mode Toggle Buttons */}
          <div className="inline-flex items-center p-1 bg-[#e6f6ff] rounded-xl border border-[#c3c6d4] self-start sm:self-center">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#003178] text-white shadow-sm'
                  : 'text-[#434652] hover:text-[#003178]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#003178] text-white shadow-sm'
                  : 'text-[#434652] hover:text-[#003178]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* MAP VIEW RENDER */}
        {viewMode === 'map' ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Interactive Map Block */}
            <div className="bg-white rounded-2xl border border-[#c3c6d4] p-4 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8fafc] p-3 rounded-xl border border-[#c3c6d4]">
                <div className="flex items-center gap-2 text-[#003178]">
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                  <span className="font-bold text-[14px]">Hospital Locations & Distance Comparison</span>
                </div>
                <span className="text-[12px] text-[#737783] font-medium">Click any pin to inspect quote details</span>
              </div>

              {/* Map Graphic Box */}
              <div className="w-full h-80 rounded-xl relative overflow-hidden bg-gray-200 border border-[#c3c6d4] flex items-center justify-center">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMDcRwS9Bk9wbKXBp3tQ1yS_E999nCh-r2XOdh88C6TCyhBR5AOCOP7J2xrhGcvFBHq1SLTYupk3AmYTfWz0CR_r5DyiGi5pNs7nQ5QFU_3U1vnh-NVgaPVHqQxp14xUIpGiO8QUw8_N_v8EVCpagoBPvlNendm1rXSokS-qbxJNf6DwyahkhoanAL8RLnLo8QhWKgxACaiyIjvVTt0dsf34XSo6ZN2H6lQzZtSA5f8HBHZ1j0LdE1"
                  alt="Hospital Quotes Map"
                  className="w-full h-full object-cover"
                />

                {/* Simulated Pins for each hospital */}
                {currentCase.hospitals.map((h, idx) => {
                  const isSelected = selectedMapHospitalId === h.id || (idx === 0 && !selectedMapHospitalId);
                  const pinPositions = [
                    'top-1/3 left-1/3',
                    'top-1/2 left-2/3',
                    'bottom-1/3 left-1/2',
                    'top-1/4 left-1/2',
                  ];
                  const pos = pinPositions[idx % pinPositions.length];
                  const isAiRecommended = h.badge === 'AI RECOMMENDED' || h.badge === 'BEST VALUE';

                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedMapHospitalId(h.id)}
                      className={`absolute ${pos} transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl shadow-xl border-2 transition-all cursor-pointer flex items-center gap-2 ${
                        isAiRecommended
                          ? 'bg-[#006f66] text-white border-[#81f3e5]'
                          : 'bg-[#003178] text-white border-white'
                      } ${isSelected ? 'scale-110 ring-4 ring-[#81f3e5] z-20' : 'hover:scale-105 opacity-90'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">local_hospital</span>
                      <div className="text-left font-sans pr-1">
                        <span className="block font-extrabold text-[11px] leading-tight truncate max-w-[120px]">
                          {h.hospitalName}
                        </span>
                        <span className="block text-[10px] font-mono-data font-bold text-[#81f3e5]">
                          ₹{(h.totalQuoteINR / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer Pins Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {currentCase.hospitals.map((h) => {
                  const isSelected = selectedMapHospitalId === h.id || (!selectedMapHospitalId && h === currentCase.hospitals[0]);
                  return (
                    <button
                      key={h.id}
                      onClick={() => setSelectedMapHospitalId(h.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#003178] text-white border-[#003178] shadow-md'
                          : 'bg-[#f8fafc] text-[#071e27] border-[#c3c6d4] hover:bg-[#e6f6ff]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[22px] ${isSelected ? 'text-[#81f3e5]' : 'text-[#003178]'}`}>
                        location_on
                      </span>
                      <div className="overflow-hidden">
                        <span className="font-bold text-[13px] block truncate">{h.hospitalName}</span>
                        <span className={`text-[11px] block font-mono-data ${isSelected ? 'text-gray-200' : 'text-[#737783]'}`}>
                          ₹{h.totalQuoteINR.toLocaleString('en-IN')} • {h.distanceKm || 2.5} km away
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Highlighted Quote Card below map */}
            {(() => {
              const selectedHosp = currentCase.hospitals.find((h) => h.id === selectedMapHospitalId) || currentCase.hospitals[0];
              if (!selectedHosp) return null;
              const isAiRecommended = selectedHosp.badge === 'AI RECOMMENDED' || selectedHosp.badge === 'BEST VALUE';

              return (
                <div
                  className={`bg-white rounded-2xl p-6 transition-all relative ${
                    isAiRecommended
                      ? 'border-2 border-[#006a62] shadow-xl ring-4 ring-[#81f3e5]/20'
                      : 'border border-[#c3c6d4] shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#c3c6d4]/60">
                    <span className="px-3 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded uppercase font-mono-data">
                      SELECTED ON MAP
                    </span>
                    <span className="text-[13px] font-bold text-[#003178]">{selectedHosp.hospitalName}</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Hospital Header & Logo - Col 1-4 */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white border border-[#c3c6d4] p-2 flex items-center justify-center shrink-0 shadow-sm">
                          <img
                            src={selectedHosp.logoUrl}
                            alt={selectedHosp.hospitalName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-[18px] text-[#071e27]">{selectedHosp.hospitalName}</h3>
                          <p className="text-[12px] text-[#737783] flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[16px] text-[#003178]">location_on</span>
                            <span>{selectedHosp.location} • {selectedHosp.distanceKm || 2.1} km away</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 font-bold text-[11px] rounded-md tracking-wider uppercase ${
                            isAiRecommended
                              ? 'bg-[#81f3e5] text-[#006f66] font-extrabold'
                              : 'bg-[#dbf1fe] text-[#003178]'
                          }`}
                        >
                          {selectedHosp.badge || 'PARTNER'}
                        </span>
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold rounded-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">star</span>
                          <span>{selectedHosp.rating} ({selectedHosp.reviewsCount} reviews)</span>
                        </span>
                      </div>

                      <div className="py-2.5 px-4 bg-[#f3faff] rounded-xl border border-[#c3c6d4]">
                        <span className="text-[10px] font-bold text-[#737783] uppercase tracking-wider block">
                          ITEMIZED PACKAGE ESTIMATE
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-[26px] font-extrabold text-[#003178] font-mono-data">
                            ₹{selectedHosp.totalQuoteINR.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hospital Details - Col 5-8 */}
                    <div className="lg:col-span-5 space-y-3 text-[13px] bg-[#f8fafc] p-4 rounded-xl border border-[#c3c6d4]/60">
                      <div className="flex items-start gap-2.5 text-[#071e27]">
                        <span className="material-symbols-outlined text-[18px] text-[#003178] shrink-0 mt-0.5">hotel</span>
                        <div>
                          <strong className="block font-bold">{selectedHosp.roomInclusion}</strong>
                          <span className="text-[11px] text-[#737783]">{selectedHosp.roomSubtext}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-[#071e27]">
                        <span className="material-symbols-outlined text-[18px] text-[#003178] shrink-0 mt-0.5">person</span>
                        <div>
                          <strong className="block font-bold">{selectedHosp.doctorName}</strong>
                          <span className="text-[11px] text-[#737783]">{selectedHosp.doctorExp} • {selectedHosp.doctorSpecialty}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-[#071e27]">
                        <span className="material-symbols-outlined text-[18px] text-[#003178] shrink-0 mt-0.5">schedule</span>
                        <div>
                          <strong className="block font-bold">{selectedHosp.estStay}</strong>
                          <span className="text-[11px] text-[#737783]">In-hospital stay period</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions - Col 9-12 */}
                    <div className="lg:col-span-3 space-y-3">
                      <button
                        onClick={() => onSelectHospitalForBooking(selectedHosp)}
                        className="w-full py-2.5 bg-[#003178] hover:bg-[#0d47a1] text-white font-extrabold rounded-xl transition-all shadow-md text-[13px] flex items-center justify-center gap-1.5"
                      >
                        <span>Book Consultation</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>

                      <button
                        onClick={() => onViewQuoteDetails(selectedHosp)}
                        className="w-full py-2 bg-[#f3faff] hover:bg-[#dbf1fe] text-[#003178] font-bold text-[12px] rounded-xl border border-[#c3c6d4] transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        <span>Itemized Breakdown</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* STANDARD LIST VIEW RENDER */
          <div className="space-y-5">
            {currentCase.hospitals.map((hospital) => {
              const isAiRecommended = hospital.badge === 'AI RECOMMENDED' || hospital.badge === 'BEST VALUE';

              return (
                <div
                  key={hospital.id}
                  className={`bg-white rounded-2xl p-5 md:p-6 transition-all relative space-y-4 ${
                    isAiRecommended
                      ? 'border-2 border-[#006a62] shadow-lg ring-4 ring-[#81f3e5]/20'
                      : 'border border-slate-200 shadow-sm hover:border-[#003178] hover:shadow-md'
                  }`}
                >
                  {/* Card Header: Hospital Info + Price */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                        <img
                          src={hospital.logoUrl}
                          alt={hospital.hospitalName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-[17px] text-[#071e27]">{hospital.hospitalName}</h3>
                          <span
                            className={`px-2.5 py-0.5 font-bold text-[10px] rounded-full tracking-wide uppercase ${
                              isAiRecommended
                                ? 'bg-[#81f3e5] text-[#006f66]'
                                : 'bg-slate-100 text-[#003178]'
                            }`}
                          >
                            {hospital.badge || 'PARTNER'}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#737783] flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-0.5 text-[#003178] font-medium">
                            <span className="material-symbols-outlined text-[15px]">location_on</span>
                            <span>{hospital.location} ({hospital.distanceKm || 2.1} km away)</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                            <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1">star</span>
                            <span>{hospital.rating} ({hospital.reviewsCount} reviews)</span>
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Price Estimate */}
                    <div className="text-left md:text-right shrink-0 bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-none border-slate-100">
                      <span className="text-[10px] font-bold text-[#737783] uppercase tracking-wider block">
                        ITEMIZED PACKAGE ESTIMATE
                      </span>
                      <div className="flex items-baseline md:justify-end gap-2 mt-0.5">
                        <span className="text-[24px] font-extrabold text-[#003178] font-mono-data">
                          ₹{hospital.totalQuoteINR.toLocaleString('en-IN')}
                        </span>
                        {hospital.savingsVsAvgPercentage && (
                          <span className="text-[10px] font-bold text-[#006f66] bg-[#81f3e5] px-2 py-0.5 rounded">
                            Save {hospital.savingsVsAvgPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Section: Unboxed Clean 3-Column Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px] py-1">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003178] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#737783] font-medium block">Lead Specialist</span>
                        <strong className="font-bold text-[#071e27] block">{hospital.doctorName}</strong>
                        <span className="text-[11px] text-[#737783]">{hospital.doctorExp} • {hospital.doctorSpecialty}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006f66] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">hotel</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#737783] font-medium block">Room & Stay</span>
                        <strong className="font-bold text-[#071e27] block">{hospital.roomInclusion}</strong>
                        <span className="text-[11px] text-[#737783]">{hospital.estStay} ({hospital.roomSubtext})</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006f66] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#737783] font-medium block">Insurance TPAs</span>
                        <strong className="font-bold text-[#071e27] block">Cashless Pre-Auth</strong>
                        <span className="text-[11px] text-[#737783] truncate block max-w-[200px]">
                          {hospital.supportedInsurance.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Toolbar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi ${hospital.hospitalName}, I am inquiring about the quote for ${currentCase.title} (${currentCase.caseCode}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[12px] rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">chat_bubble</span>
                        <span>WhatsApp Desk</span>
                      </a>

                      <a
                        href="tel:+919876543210"
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#003178] font-bold text-[12px] rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">call</span>
                        <span>Call Hospital</span>
                      </a>

                      {onViewHospitalProfile && (
                        <button
                          onClick={() => onViewHospitalProfile(hospital.id)}
                          className="px-2.5 py-1.5 text-[#006f66] font-bold text-[12px] hover:underline"
                        >
                          Profile →
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onViewQuoteDetails(hospital)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#071e27] font-bold text-[12px] rounded-xl transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        <span>Itemized Breakdown</span>
                      </button>

                      <button
                        onClick={() => onSelectHospitalForBooking(hospital)}
                        className="px-5 py-2 bg-[#003178] hover:bg-[#0d47a1] text-white font-extrabold text-[13px] rounded-xl shadow transition-all flex items-center gap-1.5"
                      >
                        <span>Book Consultation</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Analysis Banner */}
      <div className="bg-[#dbf1fe] rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006a62] text-[24px]">auto_awesome</span>
            <h3 className="font-bold text-[18px] text-[#003178]">MediQuote AI Policy Analysis</h3>
          </div>

          <button
            onClick={fetchAiAdvice}
            disabled={isLoadingAiAdvice}
            className="px-3.5 py-1.5 bg-[#003178] text-white text-[12px] font-bold rounded-lg hover:bg-[#0d47a1] transition-all"
          >
            {isLoadingAiAdvice ? 'Analyzing...' : 'Ask AI Specialist'}
          </button>
        </div>

        <p className="text-[14px] text-[#071e27] leading-relaxed">
          {aiAdviceText || currentCase.insuranceCompatibilityNotice}
        </p>
      </div>
    </div>
  );
};
