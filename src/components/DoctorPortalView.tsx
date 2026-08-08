import React, { useState } from 'react';
import { PDFViewer } from './PDFViewer';
import { SurgicalCase, HospitalQuote, ViewMode, DetailedHospitalProfile, MedicalRecord } from '../types';
import { detailedHospitalsList, initialMedicalRecords } from '../data/mockData';

interface DoctorPortalViewProps {
  cases: SurgicalCase[];
  onUpdateCaseQuotation: (caseId: string, updatedQuote: HospitalQuote) => void;
  onNavigate: (view: ViewMode) => void;
  medicalRecords?: MedicalRecord[];
}

export const DoctorPortalView: React.FC<DoctorPortalViewProps> = ({
  cases,
  onUpdateCaseQuotation,
  onNavigate,
  medicalRecords = initialMedicalRecords
}) => {
  // Hospital Switcher State
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('apollo-1');
  const activeHospitalProfile: DetailedHospitalProfile =
    detailedHospitalsList.find((h) => h.id === selectedHospitalId) || detailedHospitalsList[0];

  // Active Status Filter Tab
  const [activeTab, setActiveTab] = useState<'all' | 'incoming' | 'submitted' | 'more_info'>('all');

  // Multi-channel Communication Modal States
  const [whatsappModalCase, setWhatsappModalCase] = useState<SurgicalCase | null>(null);
  const [callModalCase, setCallModalCase] = useState<SurgicalCase | null>(null);
  const [chatModalCase, setChatModalCase] = useState<SurgicalCase | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sentMessageSuccess, setSentMessageSuccess] = useState(false);

  // Patient Scan & Reports Inspector Modal State
  const [scanInspectorCase, setScanInspectorCase] = useState<SurgicalCase | null>(null);
  const [activeInspectorDocId, setActiveInspectorDocId] = useState<string>('rec-1');
  const [inspectorZoom, setInspectorZoom] = useState<number>(100);
  const [inspectorContrast, setInspectorContrast] = useState<boolean>(false);
  const [doctorNoteInput, setDoctorNoteInput] = useState<string>('');

  // 24-Hour Pass Redemption & Scan State
  const [passTokenInput, setPassTokenInput] = useState<string>('');
  const [passPinInput, setPassPinInput] = useState<string>('');
  const [verifiedPass, setVerifiedPass] = useState<{
    caseCode: string;
    patientName: string;
    role: string;
    expiresAt: string;
  } | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const handleVerify24HourPass = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPassError(null);
    if (!passTokenInput.trim()) return;

    const raw = passTokenInput.trim();
    if (raw.length < 5) {
      setPassError('Invalid 24-Hour Pass Token. Please enter a valid token (e.g. MQ-24H-88219-HOSPITAL)');
      return;
    }

    const matchedCase = cases.find((c) => raw.toUpperCase().includes((c.caseCode || '').toUpperCase().replace(/\D/g, ''))) || cases[0];

    setVerifiedPass({
      caseCode: matchedCase.caseCode || '#MQ-88219',
      patientName: matchedCase.patientMemberName || 'Arjun Mehta',
      role: raw.toUpperCase().includes('DOCTOR') ? 'Attending Surgeon / Doctor' : 'Hospital Admissions Counter',
      expiresAt: 'In 23 Hours 58 Minutes'
    });
    setScanInspectorCase(matchedCase);
  };

  // Quote Preparation Form Modal State
  const [quoteModalCase, setQuoteModalCase] = useState<SurgicalCase | null>(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>('Dr. S. K. Nair');
  const [surgicalFee, setSurgicalFee] = useState<number>(110000);
  const [roomRent, setRoomRent] = useState<number>(40000);
  const [implantsFee, setImplantsFee] = useState<number>(25000);
  const [consultationLabs, setConsultationLabs] = useState<number>(15000);
  const [discountFee, setDiscountFee] = useState<number>(5000);
  const [roomTier, setRoomTier] = useState<string>('Private AC Deluxe Suite');
  const [estStayDays, setEstStayDays] = useState<string>('2 Nights Stay');
  const [isQuoteSentSuccess, setIsQuoteSentSuccess] = useState(false);

  // Calculated quote total in ₹ INR
  const totalQuoteCalculated = Math.max(0, surgicalFee + roomRent + implantsFee + consultationLabs - discountFee);

  const handleOpenQuoteModal = (c: SurgicalCase) => {
    setQuoteModalCase(c);

    // Look for existing quote issued by active hospital
    const existing = c.hospitals.find(
      (h) => h.hospitalName.toLowerCase().includes(activeHospitalProfile.name.toLowerCase().split(' ')[0])
    );

    if (existing) {
      setSurgicalFee(existing.details.surgicalProcedure || 110000);
      setRoomRent(existing.details.roomRent || 40000);
      setImplantsFee(existing.details.implantsEquipment || 25000);
      setConsultationLabs(existing.details.consultationLabs || 15000);
      setDiscountFee(existing.details.platformDiscount || 5000);
      setSelectedDoctorName(existing.doctorName || activeHospitalProfile.doctors[0]?.name || 'Dr. S. K. Nair');
      setRoomTier(existing.roomInclusion || 'Private AC Deluxe Suite');
    } else {
      setSurgicalFee(110000);
      setRoomRent(40000);
      setImplantsFee(25000);
      setConsultationLabs(15000);
      setDiscountFee(5000);
      setSelectedDoctorName(activeHospitalProfile.doctors[0]?.name || 'Dr. S. K. Nair');
    }
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalCase) return;

    const issuedQuote: HospitalQuote = {
      id: `${activeHospitalProfile.id}-quote-${Date.now()}`,
      hospitalName: activeHospitalProfile.name,
      location: activeHospitalProfile.location,
      logoUrl: activeHospitalProfile.logoUrl,
      totalQuoteINR: totalQuoteCalculated,
      badge: 'PREMIUM PARTNER',
      badgeType: 'primary',
      roomInclusion: roomTier,
      roomSubtext: `Attending: ${selectedDoctorName} • ${estStayDays}`,
      doctorName: selectedDoctorName,
      doctorExp: activeHospitalProfile.doctors[0]?.experienceYears + ' Yrs Exp' || '20+ Yrs Exp.',
      doctorSpecialty: activeHospitalProfile.doctors[0]?.specialty || 'Surgical Specialist',
      estStay: estStayDays,
      supportedInsurance: activeHospitalProfile.supportedInsurances.slice(0, 3),
      rating: activeHospitalProfile.rating,
      reviewsCount: activeHospitalProfile.reviewsCount,
      distanceKm: 2.1,
      costRangeText: `₹${totalQuoteCalculated.toLocaleString('en-IN')} Itemized Package`,
      details: {
        surgicalProcedure: surgicalFee,
        roomRent: roomRent,
        implantsEquipment: implantsFee,
        consultationLabs: consultationLabs,
        platformDiscount: discountFee,
      },
    };

    onUpdateCaseQuotation(quoteModalCase.id, issuedQuote);
    setIsQuoteSentSuccess(true);
    setTimeout(() => {
      setIsQuoteSentSuccess(false);
      setQuoteModalCase(null);
    }, 400);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSentMessageSuccess(true);
    setTimeout(() => {
      setSentMessageSuccess(false);
      setMessageText('');
      setChatModalCase(null);
    }, 400);
  };

  // Filter cases based on active tab & hospital profile
  const submittedCases = cases.filter((c) =>
    c.hospitals.some((h) =>
      h.hospitalName.toLowerCase().includes(activeHospitalProfile.name.toLowerCase().split(' ')[0])
    )
  );

  const incomingCases = cases.filter((c) =>
    !c.hospitals.some((h) =>
      h.hospitalName.toLowerCase().includes(activeHospitalProfile.name.toLowerCase().split(' ')[0])
    )
  );

  const moreInfoCases = cases.filter((c) => c.status === 'MORE_INFO_NEEDED');

  const displayedCases =
    activeTab === 'all'
      ? cases
      : activeTab === 'submitted'
      ? submittedCases
      : activeTab === 'incoming'
      ? incomingCases
      : moreInfoCases;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {/* Top Banner Container - Hospital Quotation Response Desk (App Theme `#00201d`) */}
      <div className="bg-[#00201d] text-white rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#006f66]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#81f3e5] text-[18px]">local_hospital</span>
              <span className="text-[#81f3e5] font-extrabold text-[11px] tracking-wider uppercase font-mono-data">
                HOSPITAL QUOTATION RESPONSE DESK
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[24px] md:text-[28px] font-extrabold text-white tracking-tight">
                {activeHospitalProfile.name}
              </h1>
              <span className="px-2.5 py-0.5 bg-[#006f66] text-[#81f3e5] font-bold text-[11px] rounded border border-[#81f3e5]/30">
                ACTIVE ADMISSIONS DESK
              </span>
            </div>

            <p className="text-gray-300 text-[14px]">
              Review family patient cases, inspect diagnostic DICOM scans & lab reports, and issue official itemized quotations.
            </p>
          </div>

          {/* Hospital Active Desk Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 relative z-10">
            <div className="px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-xl text-[12px] font-medium text-gray-200 flex items-center gap-2">
              <span>Desk Response:</span>
              <span className="text-[#81f3e5] font-bold">15 Mins Avg</span>
            </div>

            <div className="px-3.5 py-1.5 bg-[#006f66]/80 border border-[#81f3e5]/40 rounded-xl text-[12px] font-bold text-[#81f3e5] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admissions Desk Active</span>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs (Submitted, Pending, New, Required More Information) */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/15 relative z-10 text-[12px]">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#81f3e5] text-[#00201d] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            All Requests ({cases.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'incoming'
                ? 'bg-[#81f3e5] text-[#00201d] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            🆕 New / Pending Review ({incomingCases.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submitted')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'submitted'
                ? 'bg-[#81f3e5] text-[#00201d] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            📋 Submitted Quotations ({submittedCases.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('more_info')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'more_info'
                ? 'bg-[#81f3e5] text-[#00201d] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            ❓ Required More Info ({moreInfoCases.length})
          </button>
        </div>
      </div>

      {/* 24-Hour Temporary Access Pass Verification Bar */}
      <div className="p-5 bg-white rounded-2xl border-2 border-[#003178]/30 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#cbd5e1] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#003178] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] text-[#003178]">Scan / Redeem 24-Hour Patient Access Pass</h3>
              <p className="text-[11px] text-[#64748b]">Enter temporary 24-hour token or QR pass provided by patient at hospital desk</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-[#e6f6ff] text-[#003178] text-[10px] font-black rounded-full uppercase tracking-wider font-mono-data shrink-0">
            24-HR ADMISSIONS PERMIT
          </span>
        </div>

        <form onSubmit={handleVerify24HourPass} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Paste Token (e.g. MQ-24H-88219-HOSPITAL)"
            value={passTokenInput}
            onChange={(e) => setPassTokenInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-[#f8fafc] border border-[#cbd5e1] focus:border-[#003178] rounded-xl text-[13px] outline-none font-mono-data font-bold uppercase"
          />
          <input
            type="password"
            maxLength={4}
            placeholder="PIN (Optional)"
            value={passPinInput}
            onChange={(e) => setPassPinInput(e.target.value)}
            className="w-28 px-3 py-2.5 bg-[#f8fafc] border border-[#cbd5e1] focus:border-[#003178] rounded-xl text-[13px] text-center outline-none font-mono-data"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[13px] rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Verify & Unlock Case</span>
          </button>
        </form>

        {passError && (
          <p className="text-[12px] font-bold text-red-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{passError}</span>
          </p>
        )}

        {verifiedPass && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-emerald-950 animate-in fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[22px] text-emerald-600 shrink-0">check_circle</span>
              <div className="min-w-0">
                <p className="text-[13px] font-extrabold truncate">
                  ✔ 24-Hour Pass Active: <span className="font-mono-data text-[#003178]">{verifiedPass.patientName} ({verifiedPass.caseCode})</span>
                </p>
                <p className="text-[11px] text-emerald-800">
                  Target: {verifiedPass.role} • Valid {verifiedPass.expiresAt}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const matched = cases.find((c) => c.code === verifiedPass.caseCode);
                if (matched) setScanInspectorCase(matched);
              }}
              className="px-3 py-1.5 bg-[#003178] text-white text-[11px] font-bold rounded-lg hover:bg-[#002256] shrink-0"
            >
              Open Records
            </button>
          </div>
        )}
      </div>

      {/* Cases List Display */}
      <div className="space-y-5">
        {displayedCases.length === 0 ? (
          <div className="p-10 bg-white rounded-2xl border border-[#c3c6d4] text-center space-y-3">
            <span className="material-symbols-outlined text-[48px] text-slate-300">folder_off</span>
            <p className="font-bold text-[#003178] text-[16px]">No cases matching this status filter.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 bg-[#003178] text-white font-bold text-[12px] rounded-xl"
            >
              View All Dispatched Cases
            </button>
          </div>
        ) : (
          displayedCases.map((c) => {
            const existingQuote = c.hospitals.find((h) =>
              h.hospitalName.toLowerCase().includes(activeHospitalProfile.name.toLowerCase().split(' ')[0])
            );
            const hasIssuedQuote = !!existingQuote;

            return (
              <div
                key={c.id}
                className="bg-white border border-[#c3c6d4] rounded-2xl p-6 shadow-sm space-y-5 hover:border-[#003178]/60 transition-all relative"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c3c6d4]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#003178] text-white font-mono-data text-[11px] font-bold rounded">
                      {c.caseCode}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded">
                      {c.patientMemberName || 'Patient Case'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasIssuedQuote ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[12px] font-bold rounded-lg border border-emerald-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Quote Issued: ₹{existingQuote.totalQuoteINR.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[12px] font-bold rounded-lg border border-amber-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">pending</span>
                        Pending Hospital Quote
                      </span>
                    )}
                  </div>
                </div>

                {/* Patient Disease Title & Symptoms */}
                <div>
                  <h3 className="text-[20px] font-extrabold text-[#003178]">{c.title}</h3>
                  <p className="text-[13px] text-[#434652] mt-0.5">{c.subtitle} • {c.description}</p>
                </div>

                {/* Patient Vitals Bar */}
                {c.vitals && (
                  <div className="p-3 bg-[#f3faff] rounded-xl border border-[#c3c6d4] grid grid-cols-2 sm:grid-cols-5 gap-3 text-[12px]">
                    <div>
                      <span className="text-[#737783] block font-bold text-[10px]">BLOOD PRESSURE:</span>
                      <strong className="text-[#071e27] font-mono-data">{c.vitals.bloodPressureStr}</strong>
                    </div>
                    <div>
                      <span className="text-[#737783] block font-bold text-[10px]">FASTING SUGAR:</span>
                      <strong className="text-[#071e27] font-mono-data">{c.vitals.fastingSugarMgDl} mg/dL</strong>
                    </div>
                    <div>
                      <span className="text-[#737783] block font-bold text-[10px]">HbA1c LEVEL:</span>
                      <strong className="text-[#006f66] font-mono-data">{c.vitals.hba1cPercent}%</strong>
                    </div>
                    <div>
                      <span className="text-[#737783] block font-bold text-[10px]">HEART RATE:</span>
                      <strong className="text-[#071e27] font-mono-data">{c.vitals.heartRateBpm} bpm</strong>
                    </div>
                    <div>
                      <span className="text-[#737783] block font-bold text-[10px]">SpO2 LEVEL:</span>
                      <strong className="text-emerald-700 font-mono-data">{c.vitals.spO2Percent}%</strong>
                    </div>
                  </div>
                )}

                {/* AI Recommendation & Clinical Triage Insights for Hospital Admin */}
                <div className="p-4 bg-gradient-to-r from-[#00201d] to-[#003d38] text-white rounded-xl border border-[#81f3e5]/30 space-y-3 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#81f3e5]/20 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#81f3e5] text-[20px]">psychology</span>
                      <span className="font-extrabold text-[12px] text-[#81f3e5] uppercase tracking-wider font-mono-data">
                        GEMINI AI TRIAGE & CLINICAL RECOMMENDATION
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#00201d] text-[11px] font-extrabold rounded-full font-mono-data">
                        {c.aiConfidencePercent}% AI Match
                      </span>
                      {c.aiClinicalAnalysis?.treatmentRecommendation?.urgencyLevel && (
                        <span className="px-2.5 py-0.5 bg-amber-400 text-amber-950 text-[11px] font-extrabold rounded-full">
                          {c.aiClinicalAnalysis.treatmentRecommendation.urgencyLevel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[13px]">
                    <p className="text-gray-100 font-medium leading-relaxed">
                      <strong className="text-[#81f3e5]">Recommended Clinical Pathway:</strong> {c.aiPrimaryRecommendationReason}
                    </p>
                    {c.aiClinicalAnalysis?.reportAnalysisSummary && (
                      <p className="text-gray-300 text-[12px] leading-relaxed">
                        <strong className="text-white">AI Diagnostic Summary:</strong> {c.aiClinicalAnalysis.reportAnalysisSummary}
                      </p>
                    )}
                  </div>

                  {c.aiClinicalAnalysis?.treatmentRecommendation && (
                    <div className="pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                      <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                        <span className="text-[#81f3e5] font-bold block text-[10px] uppercase">OPTIMAL SURGICAL PROCEDURE:</span>
                        <strong className="text-white">{c.aiClinicalAnalysis.treatmentRecommendation.bestTreatmentProcedure}</strong>
                      </div>
                      <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                        <span className="text-[#81f3e5] font-bold block text-[10px] uppercase">MANDATORY PRE-OP PREPARATIONS:</span>
                        <span className="text-gray-200">{c.aiClinicalAnalysis.treatmentRecommendation.preOpPreparations?.join(' • ') || 'Standard Pre-Op PAC Clearance'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attached Medical Scans & Diagnostic Reports Section */}
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#c3c6d4] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#003178] text-[12px] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">radiology</span>
                      <span>Patient DICOM Scans & Diagnostic Reports</span>
                    </span>

                    <button
                      onClick={() => setScanInspectorCase(c)}
                      className="px-3 py-1 bg-[#003178] text-white font-bold text-[11px] rounded-lg hover:bg-[#0d47a1] flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span>Inspect Scans & Medical File</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto pb-1 text-[12px]">
                    <div className="p-2.5 bg-white rounded-lg border border-[#c3c6d4] flex items-center gap-2 shrink-0">
                      <span className="material-symbols-outlined text-amber-600">image</span>
                      <div>
                        <strong className="block text-[#071e27]">Radiology DICOM Scan</strong>
                        <span className="text-[10px] text-[#737783]">4.8 MB • High Resolution</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-[#c3c6d4] flex items-center gap-2 shrink-0">
                      <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                      <div>
                        <strong className="block text-[#071e27]">Pathology Blood Lab Report</strong>
                        <span className="text-[10px] text-[#737783]">1.2 MB • Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Multi-Channel Contact Suite (WhatsApp, Call, In-App Chat) */}
                <div className="pt-2 border-t border-[#c3c6d4]/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-[12px]">
                    <span className="font-bold text-[#737783] mr-1">Contact Patient:</span>

                    {/* 🟢 WhatsApp Button */}
                    <button
                      onClick={() => setWhatsappModalCase(c)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                      <span>WhatsApp</span>
                    </button>

                    {/* 📞 Direct Call Button */}
                    <button
                      onClick={() => setCallModalCase(c)}
                      className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>Direct Call</span>
                    </button>

                    {/* 💬 In-App Chat Button */}
                    <button
                      onClick={() => setChatModalCase(c)}
                      className="px-3.5 py-2 bg-[#003178] hover:bg-[#0d47a1] text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">forum</span>
                      <span>In-App Chat</span>
                    </button>
                  </div>

                  {/* Issue / Revise Itemized Quote Button */}
                  <button
                    onClick={() => handleOpenQuoteModal(c)}
                    className="px-5 py-2.5 bg-[#006f66] hover:bg-[#004f48] text-white font-extrabold text-[13px] rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {hasIssuedQuote ? 'edit_note' : 'add_task'}
                    </span>
                    <span>{hasIssuedQuote ? 'Revise Official Quotation' : 'Prepare Itemized Quote'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* WHATSAPP CONTACT MODAL */}
      {whatsappModalCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#c3c6d4] max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">chat_bubble</span>
                <h3 className="font-bold text-[16px]">Connect via WhatsApp</h3>
              </div>
              <button onClick={() => setWhatsappModalCase(null)} className="text-white hover:text-emerald-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4 text-[13px] text-[#071e27]">
              <p>
                Initiating WhatsApp conversation with patient: <strong>{whatsappModalCase.patientMemberName}</strong>
              </p>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-mono-data text-[12px]">
                "Hello {whatsappModalCase.patientMemberName}, greetings from {activeHospitalProfile.name} Admissions Desk regarding your surgical inquiry for {whatsappModalCase.title}."
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setWhatsappModalCase(null)}
                  className="px-4 py-2 border rounded-xl font-bold text-[#434652]"
                >
                  Cancel
                </button>
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello ${whatsappModalCase.patientMemberName}, greetings from ${activeHospitalProfile.name} regarding case ${whatsappModalCase.caseCode}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <span>Launch WhatsApp Web</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT CALL MODAL */}
      {callModalCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#c3c6d4] max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-blue-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">call</span>
                <h3 className="font-bold text-[16px]">Direct Call Patient Dialer</h3>
              </div>
              <button onClick={() => setCallModalCase(null)} className="text-white hover:text-blue-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[32px]">phone_in_talk</span>
              </div>

              <div>
                <h4 className="font-bold text-[18px] text-[#003178]">{callModalCase.patientMemberName}</h4>
                <p className="text-[14px] font-mono-data font-bold text-[#006f66] mt-1">+91 98765 43210</p>
                <p className="text-[12px] text-[#737783] mt-1">Verified Primary Phone Contact</p>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={() => setCallModalCase(null)}
                  className="px-4 py-2 border rounded-xl font-bold text-[#434652]"
                >
                  Close
                </button>
                <a
                  href="tel:+919876543210"
                  className="px-6 py-2 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 flex items-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Dial Phone Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP CHAT MODAL */}
      {chatModalCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#c3c6d4] max-w-lg w-full overflow-hidden shadow-2xl space-y-4">
            <div className="bg-[#003178] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#81f3e5]">forum</span>
                <h3 className="font-bold text-[16px]">In-App Direct Messenger</h3>
              </div>
              <button onClick={() => setChatModalCase(null)} className="text-white hover:text-blue-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4 text-[13px]">
              <div className="p-3 bg-[#f3faff] rounded-xl border border-[#c3c6d4] flex items-center justify-between">
                <div>
                  <strong className="block text-[#003178]">{chatModalCase.patientMemberName}</strong>
                  <span className="text-[11px] text-[#737783]">Case: {chatModalCase.title} ({chatModalCase.caseCode})</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  ONLINE NOW
                </span>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type official clinical message, pre-op instructions, or appointment details..."
                  className="w-full p-3 bg-white border border-[#c3c6d4] rounded-xl focus:outline-none focus:border-[#003178]"
                />

                <div className="flex items-center justify-between">
                  {sentMessageSuccess ? (
                    <span className="text-emerald-700 font-bold text-[12px]">✓ Message delivered to patient app!</span>
                  ) : <span />}

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#003178] text-white font-bold rounded-xl hover:bg-[#0d47a1]"
                  >
                    Send In-App Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PATIENT SCAN & REPORTS CLINICAL INSPECTOR POPUP MODAL */}
      {scanInspectorCase && (() => {
        const caseRecords = medicalRecords.filter(
          (r) =>
            (scanInspectorCase.attachedRecordIds || []).includes(r.id) ||
            r.patientMemberId === scanInspectorCase.patientMemberId
        );
        const availableRecords = caseRecords.length > 0 ? caseRecords : medicalRecords;
        const activeDoc = availableRecords.find((r) => r.id === activeInspectorDocId) || availableRecords[0];

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-[#c3c6d4] max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col my-auto">
              {/* Inspector Header */}
              <div className="p-4 sm:p-5 bg-[#00245a] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                    <span className="material-symbols-outlined text-[24px] text-[#81f3e5]">radiology</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-[#81f3e5] text-[#00201d] text-[10px] font-black rounded uppercase font-mono">
                        DOCTOR CLINICAL INSPECTOR
                      </span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-200 border border-blue-300/30 text-[10px] font-bold rounded">
                        Case: {scanInspectorCase.caseCode}
                      </span>
                    </div>
                    <h3 className="text-[18px] font-extrabold truncate text-white mt-0.5">
                      {scanInspectorCase.title} — {scanInspectorCase.patientMemberName || 'Patient Record'}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setScanInspectorCase(null)}
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[22px]">close</span>
                  </button>
                </div>
              </div>

              {/* Patient Uploaded Document Selection Bar */}
              <div className="bg-[#f1f5f9] border-b border-[#cbd5e1] p-3 overflow-x-auto shrink-0 flex items-center gap-2 text-[12px]">
                <span className="font-extrabold text-[#003178] uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1 mr-1">
                  <span className="material-symbols-outlined text-[16px]">folder_shared</span>
                  <span>Uploaded Files ({availableRecords.length}):</span>
                </span>

                <div className="flex items-center gap-2">
                  {availableRecords.map((doc) => {
                    const isSelected = activeDoc?.id === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setActiveInspectorDocId(doc.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-[#003178] text-white border-[#003178] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {doc.category === 'SCAN_MRI' || doc.category === 'RADIOLOGY'
                            ? 'radiology'
                            : doc.category === 'PRESCRIPTION'
                            ? 'pill'
                            : 'description'}
                        </span>
                        <span className="truncate max-w-[140px]">{doc.fileName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inspector Content Body Grid */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left 2-Cols: Document Viewer & Canvas */}
                <div className="lg:col-span-2 space-y-3 flex flex-col">
                  {/* Canvas Controls Header */}
                  <div className="bg-white p-2.5 rounded-2xl border border-slate-300 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#003178]">description</span>
                      <span className="truncate">{activeDoc?.fileName || 'Medical File'}</span>
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setInspectorZoom((z) => Math.max(50, z - 25))}
                        className="p-1 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                        title="Zoom Out"
                      >
                        <span className="material-symbols-outlined text-[16px]">zoom_out</span>
                      </button>
                      <span className="text-[10px] font-mono font-bold w-10 text-center text-gray-700">
                        {inspectorZoom}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setInspectorZoom((z) => Math.min(250, z + 25))}
                        className="p-1 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                        title="Zoom In"
                      >
                        <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectorZoom(100)}
                        className="px-1.5 py-0.5 text-[9px] font-bold bg-gray-200 rounded text-gray-700 cursor-pointer"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectorContrast((c) => !c)}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-all flex items-center gap-0.5 ${
                          inspectorContrast
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">contrast</span>
                        <span>DICOM Invert</span>
                      </button>
                    </div>
                  </div>

                  {/* Document Canvas Display Box */}
                  <div className="bg-slate-950 rounded-2xl p-4 min-h-[360px] flex items-center justify-center relative overflow-hidden border border-slate-800 shadow-inner flex-1">
                    <div
                      className="transition-all duration-200 max-w-full"
                      style={{
                        transform: `scale(${inspectorZoom / 100})`,
                        transformOrigin: 'center center',
                        filter: inspectorContrast
                          ? 'contrast(220%) grayscale(100%) invert(90%)'
                          : 'none'
                      }}
                    >
                      {activeDoc?.fileUrl ? (
                        activeDoc.fileUrl.startsWith('data:image') ||
                        (!activeDoc.fileName.toLowerCase().endsWith('.pdf') &&
                          (activeDoc.fileUrl.startsWith('blob:') ||
                            activeDoc.fileUrl.match(/\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i) ||
                            activeDoc.category === 'SCAN_MRI' ||
                            activeDoc.category === 'RADIOLOGY')) ? (
                          <img
                            src={activeDoc.fileUrl}
                            alt={activeDoc.fileName}
                            className="max-h-[460px] object-contain rounded-xl shadow-2xl mx-auto"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          /* Interactive Native Canvas PDF Viewer */
                          <div className="space-y-4 max-w-2xl mx-auto text-left w-full">
                            <PDFViewer url={activeDoc.fileUrl} fileName={activeDoc.fileName} />

                            {/* Formatted Medical Report Sheet with Extracted Findings */}
                            <div className="bg-white text-slate-900 rounded-xl p-6 shadow-2xl border border-slate-300 space-y-4 text-[12px] font-sans">
                              {/* Header */}
                              <div className="border-b-2 border-[#003178] pb-3 flex justify-between items-start gap-3">
                                <div>
                                  <div className="flex items-center gap-1.5 text-[#003178] font-black text-[15px]">
                                    <span className="material-symbols-outlined text-[22px]">local_hospital</span>
                                    <span>ABDM CLINICAL REPORT INSPECTOR</span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 font-mono">
                                    AI-Extracted Diagnostics & Digital Health Record
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[9px] rounded uppercase">
                                    VALIDATED BY PATHOLOGY / RADIOLOGY
                                  </span>
                                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                    Date: {activeDoc?.uploadDate || 'Today'}
                                  </p>
                                </div>
                              </div>

                              {/* Patient Banner */}
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 text-[11px]">
                                <div>
                                  <span className="text-gray-400 block font-bold text-[9px] uppercase">PATIENT</span>
                                  <strong className="text-[#003178]">
                                    {activeDoc?.patientMemberName || scanInspectorCase.patientMemberName || 'Arjun Mehta'}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-gray-400 block font-bold text-[9px] uppercase">CATEGORY</span>
                                  <span className="font-bold text-slate-800">{activeDoc?.category || 'LAB_REPORT'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 block font-bold text-[9px] uppercase">ABHA ID</span>
                                  <span className="font-mono text-slate-700 font-bold">91-9246-1956-89</span>
                                </div>
                              </div>

                              {/* Extracted Clinical Findings Table */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h6 className="font-bold text-[#003178] text-[12px] flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">analytics</span>
                                    <span>Extracted Clinical Test Parameters</span>
                                  </h6>
                                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    OCR Confidence 99.4%
                                  </span>
                                </div>

                                {activeDoc?.category === 'SCAN_MRI' || activeDoc?.category === 'RADIOLOGY' ? (
                                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-[11px] text-slate-800">
                                    <div className="flex justify-between font-bold text-[10px] text-slate-500 border-b pb-1">
                                      <span>FINDING AREA</span>
                                      <span>IMPRESSION</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <span className="font-bold text-[#003178]">L4-L5 Disc Region</span>
                                      <span className="col-span-2 text-slate-700">Mild posterior disc bulge with neural foraminal narrowing</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 border-t pt-1">
                                      <span className="font-bold text-[#003178]">Spinal Cord Signal</span>
                                      <span className="col-span-2 text-slate-700">Normal caliber, no focal signal intensity alteration</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 border-t pt-1">
                                      <span className="font-bold text-[#003178]">Facet Joints</span>
                                      <span className="col-span-2 text-slate-700">Mild arthropathy noted bilaterally</span>
                                    </div>
                                  </div>
                                ) : activeDoc?.category === 'PRESCRIPTION' ? (
                                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-[11px] text-slate-800">
                                    <div className="grid grid-cols-3 font-bold text-[10px] text-slate-500 border-b pb-1">
                                      <span>MEDICATION</span>
                                      <span>DOSAGE & FREQ</span>
                                      <span>DURATION</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <span className="font-bold text-[#003178]">Tab. Augmentin 625mg</span>
                                      <span>1 - 0 - 1 (After Meal)</span>
                                      <span className="text-emerald-700 font-bold">5 Days</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 border-t pt-1">
                                      <span className="font-bold text-[#003178]">Tab. Pan-40</span>
                                      <span>1 - 0 - 0 (Before Breakfast)</span>
                                      <span className="text-emerald-700 font-bold">5 Days</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 border-t pt-1">
                                      <span className="font-bold text-[#003178]">Tab. Paracetamol 650mg</span>
                                      <span>1 - 0 - 1 (SOS for Fever)</span>
                                      <span className="text-slate-600 font-bold">As Needed</span>
                                    </div>
                                  </div>
                                ) : (
                                  <table className="w-full text-left text-[11px] border-collapse bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                                    <thead>
                                      <tr className="bg-slate-200/70 text-slate-700 font-bold text-[10px]">
                                        <th className="p-2 border-b border-slate-300">Test Parameter</th>
                                        <th className="p-2 border-b border-slate-300">Result Value</th>
                                        <th className="p-2 border-b border-slate-300">Ref Range</th>
                                        <th className="p-2 border-b border-slate-300">Flag</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-800">
                                      <tr>
                                        <td className="p-2 font-bold text-[#003178]">Hemoglobin (Hb)</td>
                                        <td className="p-2 font-mono font-bold">14.2 g/dL</td>
                                        <td className="p-2 text-slate-500 font-mono">13.0 - 17.0</td>
                                        <td className="p-2">
                                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded">Normal</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-bold text-[#003178]">Fasting Blood Sugar</td>
                                        <td className="p-2 font-mono font-bold text-amber-700">118 mg/dL</td>
                                        <td className="p-2 text-slate-500 font-mono">70 - 100</td>
                                        <td className="p-2">
                                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-[9px] rounded">⚠️ High</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-bold text-[#003178]">Total Leucocyte Count (TLC)</td>
                                        <td className="p-2 font-mono font-bold">7,800 /cumm</td>
                                        <td className="p-2 text-slate-500 font-mono">4000 - 11000</td>
                                        <td className="p-2">
                                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded">Normal</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-bold text-[#003178]">Serum Creatinine</td>
                                        <td className="p-2 font-mono font-bold">0.92 mg/dL</td>
                                        <td className="p-2 text-slate-500 font-mono">0.60 - 1.20</td>
                                        <td className="p-2">
                                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded">Normal</span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                )}
                              </div>

                              {/* Digital Stamp */}
                              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                                <span className="font-mono">ABDM Digital Hash: 0x8a92f...41e</span>
                                <span className="font-bold text-emerald-700 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px]">verified</span>
                                  Digitally Signed by Lab Director
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        /* Formatted Clinical Sheet for Doctor Review */
                        <div className="bg-white text-slate-900 rounded-xl p-6 max-w-xl mx-auto shadow-2xl border border-slate-300 space-y-4 text-[12px] font-sans">
                          <div className="border-b-2 border-[#003178] pb-3 flex justify-between items-start gap-3">
                            <div>
                              <div className="flex items-center gap-1.5 text-[#003178] font-black text-[14px]">
                                <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                                <span>ABDM CERTIFIED CLINICAL FILE</span>
                              </div>
                              <p className="text-[10px] text-gray-500 font-mono">
                                Category: {activeDoc?.category || 'LAB_REPORT'}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[9px] rounded uppercase">
                              AUTHENTICATED
                            </span>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-gray-500 block font-bold text-[9px]">PATIENT NAME</span>
                              <strong className="text-[#003178]">
                                {activeDoc?.patientMemberName || scanInspectorCase.patientMemberName || 'Arjun Mehta'}
                              </strong>
                            </div>
                            <div>
                              <span className="text-gray-500 block font-bold text-[9px]">UPLOAD DATE</span>
                              <span className="font-mono text-slate-800 font-bold">{activeDoc?.uploadDate || '03 Oct 2023'}</span>
                            </div>
                          </div>

                          {/* Render Report Data Table */}
                          {activeDoc?.category === 'PRESCRIPTION' ? (
                            <div className="space-y-2">
                              <h5 className="font-bold text-[#003178] text-[12px] border-b pb-1">Medication Schedule:</h5>
                              <p className="text-slate-800 font-medium text-[11px]">
                                1. Tab. Metformin 500mg — 1-0-1 (30 days)<br />
                                2. Tab. Telmisartan 40mg — 1-0-0 (30 days)<br />
                                3. Cap. Atorvastatin 10mg — 0-0-1 (30 days)
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <h5 className="font-bold text-[#003178] text-[12px] border-b pb-1">Lab Test Pathology Results:</h5>
                              <table className="w-full text-left text-[11px]">
                                <tbody className="divide-y text-slate-800 font-medium">
                                  <tr>
                                    <td className="p-1 font-bold">HbA1c Glycated Hemoglobin</td>
                                    <td className="p-1 font-mono text-amber-700 font-bold">6.8 %</td>
                                    <td className="p-1 text-gray-500">(Elevated)</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 font-bold">Fasting Blood Glucose</td>
                                    <td className="p-1 font-mono text-amber-700 font-bold">128 mg/dL</td>
                                    <td className="p-1 text-gray-500">(Borderline)</td>
                                  </tr>
                                  <tr>
                                    <td className="p-1 font-bold">Serum Creatinine</td>
                                    <td className="p-1 font-mono text-emerald-700 font-bold">0.9 mg/dL</td>
                                    <td className="p-1 text-gray-500">(Normal)</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="pt-2 border-t text-[10px] text-gray-500 flex justify-between items-center font-mono">
                            <span>SHA-256 Verified</span>
                            <span className="text-emerald-700 font-bold">ABDM ID Sealed</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Col: AI Clinical Triage & Doctor Annotation Notes */}
                <div className="space-y-4">
                  {/* AI Diagnostic Breakdown */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs space-y-3 text-[12px]">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <span className="material-symbols-outlined text-[#006f66] text-[20px]">psychology</span>
                      <h4 className="font-extrabold text-[#003178]">Gemini AI Clinical Extraction</h4>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-blue-950">
                      <strong className="text-[#003178] font-bold block text-[11px]">Report Analysis Summary:</strong>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        {scanInspectorCase.aiClinicalAnalysis?.reportAnalysisSummary ||
                          'High-fidelity digital document authenticated. Vitals and lab findings cross-verified for pre-operative PAC clearance.'}
                      </p>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <span className="text-gray-500 font-bold block">RECOMMENDED PROCEDURE:</span>
                      <strong className="text-emerald-800 block">
                        {scanInspectorCase.aiClinicalAnalysis?.treatmentRecommendation?.bestTreatmentProcedure ||
                          scanInspectorCase.title}
                      </strong>
                    </div>
                  </div>

                  {/* Doctor Hospital Annotation Note Input */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs space-y-2 text-[12px]">
                    <label className="font-extrabold text-[#003178] block flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                      <span>Doctor Clinical Impression & Notes:</span>
                    </label>
                    <textarea
                      rows={3}
                      value={doctorNoteInput}
                      onChange={(e) => setDoctorNoteInput(e.target.value)}
                      placeholder="Type private surgeon / hospital notes regarding this scan or report..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[12px] outline-none focus:border-[#003178] resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!doctorNoteInput.trim()) return;
                        alert('✔ Clinical note saved to hospital EMR case history');
                      }}
                      className="w-full py-1.5 bg-[#003178] hover:bg-[#002256] text-white font-bold rounded-xl text-[11px] transition-all cursor-pointer"
                    >
                      Save Clinical Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Inspector Modal Action Footer */}
              <div className="p-4 bg-white border-t border-[#cbd5e1] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                    <span>ABDM Cryptographic Integrity Confirmed</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 text-[12px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print Clinical Copy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScanInspectorCase(null);
                      setQuoteModalCase(scanInspectorCase);
                    }}
                    className="px-4 py-2 bg-[#006f66] hover:bg-[#00524b] text-white text-[12px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">request_quote</span>
                    <span>Issue Hospital Quote</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScanInspectorCase(null)}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-[12px] font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Close Inspector
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ITEMIZED QUOTATION FORM MODAL */}
      {quoteModalCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white border border-[#c3c6d4] text-[#071e27] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#c3c6d4] pb-3">
              <div>
                <span className="text-[#006f66] text-[11px] font-extrabold font-mono-data uppercase">
                  OFFICIAL HOSPITAL ITEMIZATION DESK
                </span>
                <h3 className="text-[20px] font-bold text-[#003178]">
                  Issue Quotation for {quoteModalCase.title}
                </h3>
              </div>
              <button onClick={() => setQuoteModalCase(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-4 text-[13px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#737783] uppercase mb-1">
                    ATTENDING SURGEON
                  </label>
                  <select
                    value={selectedDoctorName}
                    onChange={(e) => setSelectedDoctorName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[#071e27] font-bold"
                  >
                    {activeHospitalProfile.doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#737783] uppercase mb-1">
                    ROOM TIER & ACCOMMODATION
                  </label>
                  <select
                    value={roomTier}
                    onChange={(e) => setRoomTier(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[#071e27] font-bold"
                  >
                    <option value="Private AC Deluxe Suite">Private AC Deluxe Suite</option>
                    <option value="Semi-Private AC Room">Semi-Private AC Room</option>
                    <option value="Executive Presidential Suite">Executive Presidential Suite</option>
                    <option value="Daycare Short Stay Bay">Daycare Short Stay Bay</option>
                  </select>
                </div>
              </div>

              {/* Itemized Cost Inputs (₹ INR) */}
              <div className="bg-[#f8fafc] border border-[#c3c6d4] rounded-xl p-4 space-y-3">
                <h4 className="text-[#003178] font-extrabold text-[12px] uppercase tracking-wider">
                  Itemized Cost Breakdown (₹ INR)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#737783] font-bold mb-1">
                      SURGICAL PROCEDURE FEE (₹)
                    </label>
                    <input
                      type="number"
                      value={surgicalFee}
                      onChange={(e) => setSurgicalFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl font-mono-data font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#737783] font-bold mb-1">
                      ROOM RENT & NURSING (₹)
                    </label>
                    <input
                      type="number"
                      value={roomRent}
                      onChange={(e) => setRoomRent(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl font-mono-data font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#737783] font-bold mb-1">
                      IMPLANTS & CONSUMABLES (₹)
                    </label>
                    <input
                      type="number"
                      value={implantsFee}
                      onChange={(e) => setImplantsFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl font-mono-data font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#006f66] font-bold mb-1">
                      PLATFORM DISCOUNT (-) (₹)
                    </label>
                    <input
                      type="number"
                      value={discountFee}
                      onChange={(e) => setDiscountFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 text-[#006f66] rounded-xl font-mono-data font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#003178] text-white rounded-xl flex items-center justify-between">
                  <span className="text-[12px] font-bold text-blue-100">TOTAL QUOTATION (INR):</span>
                  <span className="text-[22px] font-extrabold text-[#81f3e5] font-mono-data">
                    ₹{totalQuoteCalculated.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalCase(null)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#006f66] hover:bg-[#004f48] text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>{isQuoteSentSuccess ? '✓ Quotation Sent!' : 'Submit Official Quote'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
