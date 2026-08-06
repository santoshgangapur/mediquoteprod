import React, { useState } from 'react';
import { PatientProfile, HealthMetrics, SurgicalCase, MedicalRecord, Appointment, ViewMode, FamilyMember } from '../types';
import { HospitalBroadcastStatusModal } from './HospitalBroadcastStatusModal';

interface DashboardViewProps {
  patientProfile: PatientProfile;
  healthMetrics: HealthMetrics;
  activeCases: SurgicalCase[];
  recentRecords: MedicalRecord[];
  appointments: Appointment[];
  familyMembers?: FamilyMember[];
  activeFamilyMemberId?: string;
  onSelectFamilyMember?: (id: string) => void;
  onNavigate: (view: ViewMode) => void;
  onStartNewCase: () => void;
  onSelectCase: (caseId: string) => void;
  onSelectRecord: (record: MedicalRecord) => void;
  onViewHospitalProfile?: (hospitalId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patientProfile,
  healthMetrics,
  activeCases,
  recentRecords,
  appointments,
  familyMembers = [],
  activeFamilyMemberId = 'fam-1',
  onSelectFamilyMember,
  onNavigate,
  onStartNewCase,
  onSelectCase,
  onSelectRecord,
  onViewHospitalProfile,
}) => {
  const [showAllCasesExpanded, setShowAllCasesExpanded] = useState(false);
  const [selectedCaseForDispatchModal, setSelectedCaseForDispatchModal] = useState<SurgicalCase | null>(null);

  const activeMember = familyMembers.find((m) => m.id === activeFamilyMemberId) || familyMembers[0];
  const displayedCases = showAllCasesExpanded ? activeCases : activeCases.slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Banner & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded tracking-wider uppercase">
              PATIENT DASHBOARD
            </span>
            <span className="text-[12px] text-[#003178] font-bold">
              Showing records for {activeMember?.fullName || patientProfile.name}
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#003178] tracking-tight">
            Namaste, {activeMember?.fullName ? activeMember.fullName.split(' ')[0] : patientProfile.name.split(' ')[0]}
          </h1>
          <p className="text-[#434652] text-[15px] mt-0.5">
            Overview of clinical cases, quotes, and reports specifically for {activeMember?.fullName || 'this profile'}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#003178] text-[#003178] font-bold hover:bg-[#003178]/5 transition-all text-[14px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">upload</span>
            <span>Upload Reports</span>
          </button>
          <button
            onClick={onStartNewCase}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003178] text-white font-bold hover:bg-[#0d47a1] transition-all shadow-md text-[14px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Start New Case</span>
          </button>
        </div>
      </div>

      {/* FAMILY MEMBER QUICK SELECTOR RIBBON */}
      {familyMembers.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#003178] text-[20px]">family_history</span>
            <span className="text-[13px] font-bold text-[#003178] uppercase tracking-wider font-mono-data">
              Family Patient Selector:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {familyMembers.map((member) => {
              const isSelected = member.id === activeMember?.id;
              const casesCount = activeCases.filter((c) => c.patientMemberId === member.id).length;
              return (
                <button
                  key={member.id}
                  onClick={() => {
                    if (onSelectFamilyMember) {
                      onSelectFamilyMember(member.id);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#003178] text-white shadow-md ring-2 ring-[#003178]/30'
                      : 'bg-[#f3faff] text-[#434652] hover:bg-[#dbf1fe] border border-[#c3c6d4]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${member.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                    {member.fullName.charAt(0)}
                  </div>
                  <span>{member.fullName}</span>
                  <span className={`text-[10px] font-mono-data px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#003178]/10 text-[#003178]'
                  }`}>
                    {member.relationship}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* HOSPITALS NETWORK & MAP - PRIMARY REVENUE PORTAL BANNER */}
      <div className="bg-gradient-to-r from-[#003178] via-[#0d47a1] to-[#004f48] text-white rounded-2xl p-5 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-emerald-400/30">
        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-400/20 text-emerald-200 font-bold text-[11px] rounded border border-emerald-400/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              2,850+ Accredited Hospitals Active
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#81f3e5] text-[26px]">apartment</span>
            <span>Hospitals Network & Live GPS Location Map</span>
          </h2>
          <p className="text-blue-100 text-[13px] leading-relaxed">
            Explore NABH/JCI accredited surgical hospitals, live GPS bed tracking, NABH quality ratings, cash-back package quotes, and direct emergency admissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onNavigate('hospitals')}
            className="flex-1 md:flex-none px-5 py-3 bg-[#81f3e5] text-[#003f3a] hover:bg-[#6be8d8] font-black rounded-xl transition-all shadow-md text-[13px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
            <span>Explore Hospitals Map</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('hospitals')}
            className="flex-1 md:flex-none px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-[13px] flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Compare Hospitals</span>
          </button>
        </div>
      </div>

      <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#003178] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006f66]">folder_open</span>
              <span>All Active Patient Cases ({activeCases.length})</span>
            </h2>

            {activeCases.length > 2 && (
              <button
                onClick={() => setShowAllCasesExpanded(!showAllCasesExpanded)}
                className="px-3 py-1.5 bg-[#dbf1fe] text-[#003178] font-bold text-[13px] rounded-xl hover:bg-[#b8e2fc] transition-all flex items-center gap-1"
              >
                <span>{showAllCasesExpanded ? 'Collapse List' : `Show All Cases (${activeCases.length})`}</span>
                <span className="material-symbols-outlined text-[16px]">
                  {showAllCasesExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            )}
          </div>

          {activeCases.length > 0 ? (
            displayedCases.map((singleCase, caseIndex) => (
              <div
                key={singleCase.id}
                className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-5 relative overflow-hidden transition-all hover:border-[#003178]"
              >
                {/* Case Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-4 border-b border-[#c3c6d4]/60">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="inline-block px-2.5 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded tracking-wider uppercase">
                        {caseIndex === 0 ? 'PRIMARY ACTIVE' : 'ACTIVE CASE'}
                      </span>
                      <span className="px-2.5 py-0.5 bg-[#dbf1fe] text-[#003178] font-bold text-[11px] rounded font-mono-data">
                        {singleCase.caseCode}
                      </span>
                      {singleCase.patientMemberName && (
                        <span className="px-2 py-0.5 bg-[#003178] text-white font-bold text-[11px] rounded font-mono-data">
                          Patient: {singleCase.patientMemberName}
                        </span>
                      )}
                      <span className="text-[11px] text-[#737783] font-medium">
                        Created: {singleCase.createdDate}
                      </span>
                    </div>
                    <h3 className="text-[20px] font-bold text-[#071e27]">{singleCase.title}</h3>
                    <p className="text-[13px] text-[#434652] mt-0.5 line-clamp-1">{singleCase.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedCaseForDispatchModal(singleCase)}
                      className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[12px] font-bold rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
                      <span>Hospital Email Log ({singleCase.hospitalDispatches?.length || 4})</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectCase(singleCase.id);
                        onNavigate('quotes');
                      }}
                      className="px-4 py-2 bg-[#003178] text-white text-[13px] font-bold rounded-xl hover:bg-[#0d47a1] transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                      <span>View Quotes Matrix</span>
                    </button>
                  </div>
                </div>

                {/* Patient Vitals Pill Bar */}
                {singleCase.vitals && (
                  <div className="p-3 bg-[#f3faff] rounded-xl border border-[#c3c6d4]/60 flex flex-wrap items-center gap-4 text-[12px]">
                    <div className="flex items-center gap-1.5 font-bold text-[#003178]">
                      <span className="material-symbols-outlined text-[16px] text-red-500">favorite</span>
                      <span>BP: {singleCase.vitals.bloodPressureStr || '120/80 mmHg'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#003178]">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">water_drop</span>
                      <span>Fasting: {singleCase.vitals.fastingSugarMgDl || 95} mg/dL</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#003178]">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">bloodtype</span>
                      <span>PP Sugar: {singleCase.vitals.ppSugarMgDl || 135} mg/dL</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#003178]">
                      <span className="material-symbols-outlined text-[16px] text-purple-600">analytics</span>
                      <span>HbA1c: {singleCase.vitals.hba1cPercent || 5.7}%</span>
                    </div>
                  </div>
                )}

                {/* AI CLINICAL DIAGNOSIS PREVIEW SUMMARY */}
                {singleCase.aiClinicalAnalysis && (
                  <div className="p-4 bg-gradient-to-r from-[#002255] to-[#003178] rounded-xl text-white border border-[#006f66]/40 space-y-2 text-[13px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#81f3e5] text-[18px]">psychology</span>
                        <strong className="text-white font-bold">AI Clinical Analysis & Protocol</strong>
                        <span className="px-2 py-0.5 bg-[#81f3e5]/20 text-[#81f3e5] text-[10px] font-bold rounded">
                          {singleCase.aiConfidencePercent}% MATCH
                        </span>
                      </div>

                      <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[11px] font-bold rounded border border-amber-500/30 font-mono-data">
                        Target: {singleCase.aiClinicalAnalysis.treatmentRecommendation.urgencyTimelineDays}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] pt-1">
                      <div>
                        <span className="text-[#81f3e5] font-bold block text-[11px]">DETECTED DIAGNOSIS:</span>
                        <span className="text-blue-100 font-medium">
                          {singleCase.aiClinicalAnalysis.healthIssuesDetected[0]?.conditionName} ({singleCase.aiClinicalAnalysis.healthIssuesDetected[0]?.severity})
                        </span>
                      </div>

                      <div>
                        <span className="text-[#81f3e5] font-bold block text-[11px]">BEST TREATMENT RECOMMENDED:</span>
                        <span className="text-blue-100 font-medium">
                          {singleCase.aiClinicalAnalysis.treatmentRecommendation.bestTreatmentProcedure}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          onSelectCase(singleCase.id);
                          onNavigate('quotes');
                        }}
                        className="text-[12px] font-bold text-[#81f3e5] hover:underline flex items-center gap-1"
                      >
                        <span>View All Health Issues & Pre-Op Guidelines →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Hospital Quotes Sub-cards */}
                <div className="space-y-3">
                  <h4 className="text-[12px] font-bold text-[#737783] uppercase tracking-wider">
                    HOSPITAL QUOTATIONS MATCHED ({singleCase.hospitals.length}):
                  </h4>
                  {singleCase.hospitals.slice(0, 2).map((hospital, idx) => (
                    <div
                      key={hospital.id}
                      onClick={() => {
                        onSelectCase(singleCase.id);
                        onNavigate('quotes');
                      }}
                      className="p-3.5 bg-[#f3faff] border border-[#c3c6d4] rounded-xl flex items-center justify-between hover:border-[#003178] hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border border-[#c3c6d4] flex items-center justify-center p-1 shrink-0">
                          <img
                            src={hospital.logoUrl}
                            alt={hospital.hospitalName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-[14px] text-[#071e27] group-hover:text-[#003178] transition-colors">
                              {hospital.hospitalName}
                            </h5>
                            {onViewHospitalProfile && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewHospitalProfile(hospital.id);
                                }}
                                className="text-[10px] font-bold text-[#006f66] hover:underline bg-[#81f3e5]/50 px-1.5 py-0.5 rounded"
                              >
                                Profile
                              </button>
                            )}
                          </div>
                          <p className="text-[12px] text-[#434652]">
                            Quote: <strong className="text-[#003178] font-mono-data">₹{hospital.totalQuoteINR.toLocaleString('en-IN')}</strong> • {hospital.roomInclusion}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                            idx === 0 ? 'bg-[#81f3e5] text-[#006f66]' : 'bg-[#cfe6f2] text-[#003178]'
                          }`}
                        >
                          {hospital.badge || (idx === 0 ? 'AI RECOMMENDED' : 'MATCHING')}
                        </span>
                        <span className="material-symbols-outlined text-[#737783] group-hover:text-[#003178] group-hover:translate-x-0.5 transition-all text-[20px]">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-[#c3c6d4] p-8 text-center space-y-4">
              <span className="material-symbols-outlined text-[48px] text-[#003178]">medical_services</span>
              <h3 className="text-[20px] font-bold text-[#071e27]">No active surgical cases</h3>
              <p className="text-[14px] text-[#434652] max-w-md mx-auto">
                Start a new case or upload your medical reports to get instant quotes from top hospitals.
              </p>
              <button
                onClick={onStartNewCase}
                className="px-6 py-2.5 bg-[#003178] text-white font-bold rounded-xl"
              >
                Create New Case
              </button>
            </div>
          )}
        </div>

      {/* Bottom Grid: Appointments & Recent Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments Widget (Col 1-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#c3c6d4]/60 pb-3">
            <span className="material-symbols-outlined text-[#003178]">calendar_today</span>
            <h3 className="font-bold text-[16px] text-[#071e27]">Appointments</h3>
          </div>

          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#f3faff] border border-[#c3c6d4]/50">
                <div className="w-14 h-14 rounded-xl bg-[#dbf1fe] border border-[#003178]/20 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#003178] uppercase tracking-wider">{apt.dateMonth}</span>
                  <span className="text-[20px] font-bold text-[#003178] leading-none font-mono-data">{apt.dateDay}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[15px] text-[#071e27] truncate">{apt.doctorName}</h4>
                  <p className="text-[12px] text-[#434652] truncate">{apt.title}</p>
                  <p className="text-[11px] text-[#003178] font-semibold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">
                      {apt.type === 'video' ? 'videocam' : 'location_on'}
                    </span>
                    <span>{apt.time}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('account')}
              className="text-[13px] font-bold text-[#003178] hover:underline"
            >
              View Schedule
            </button>
          </div>
        </div>

        {/* Recent Records Table (Col 6-12) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#c3c6d4]/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003178]">folder_shared</span>
              <h3 className="font-bold text-[16px] text-[#071e27]">Recent Records</h3>
            </div>
            <button
              onClick={() => onNavigate('records')}
              className="text-[13px] font-bold text-[#003178] hover:underline"
            >
              See All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#c3c6d4] text-[11px] font-bold text-[#737783] uppercase tracking-wider">
                  <th className="pb-3 pr-2">DOCUMENT NAME</th>
                  <th className="pb-3 px-2">DATE</th>
                  <th className="pb-3 px-2">CATEGORY</th>
                  <th className="pb-3 pl-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d4]/40">
                {recentRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#f3faff] transition-colors">
                    <td className="py-3 pr-2 font-semibold text-[#071e27] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#003178] text-[20px]">
                        {rec.fileType === 'pdf'
                          ? 'picture_as_pdf'
                          : rec.fileType === 'image'
                          ? 'image'
                          : 'description'}
                      </span>
                      <span className="truncate max-w-[160px] md:max-w-[200px]">{rec.fileName}</span>
                    </td>
                    <td className="py-3 px-2 text-[#434652] whitespace-nowrap font-mono-data">{rec.uploadDate}</td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          rec.category === 'DIAGNOSTIC'
                            ? 'bg-[#cfe6f2] text-[#003178]'
                            : rec.category === 'RADIOLOGY'
                            ? 'bg-[#81f3e5] text-[#006f66]'
                            : 'bg-gray-200 text-[#434652]'
                        }`}
                      >
                        {rec.category}
                      </span>
                    </td>
                    <td className="py-3 pl-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectRecord(rec)}
                        className="p-1.5 text-[#434652] hover:text-[#003178] hover:bg-[#cfe6f2] rounded-lg transition-colors"
                        title="Download / View"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {rec.fileType === 'image' ? 'visibility' : 'download'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Health Snapshot Single Column Section at Bottom */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c3c6d4]/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003178] text-[24px]">analytics</span>
            <div>
              <h3 className="font-extrabold text-[18px] text-[#071e27]">Health Snapshot & Vital Metrics</h3>
              <p className="text-[12px] text-[#434652]">Real-time patient vital baseline and historical trends</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#81f3e5]/50 text-[#006f66] font-bold text-[12px] rounded-full self-start sm:self-auto font-mono-data">
            Status: Stable Baseline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Blood Pressure */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#f3faff] border border-[#c3c6d4]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px] text-red-500">favorite</span>
              </div>
              <div>
                <span className="text-[13px] text-[#434652] font-semibold block">Blood Pressure</span>
                <span className="text-[11px] text-[#737783]">Systolic / Diastolic</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[18px] font-extrabold text-[#071e27] font-mono-data">{healthMetrics.bloodPressure}</span>
              <span className="text-[11px] text-[#737783] ml-1">mmHg</span>
            </div>
          </div>

          {/* Glucose */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#f3faff] border border-[#c3c6d4]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003178] flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px] text-[#003178]">water_drop</span>
              </div>
              <div>
                <span className="text-[13px] text-[#434652] font-semibold block">Glucose (Fasting)</span>
                <span className="text-[11px] text-[#737783]">Fasting Blood Sugar</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[18px] font-extrabold text-[#071e27] font-mono-data">{healthMetrics.glucoseFasting}</span>
              <span className="text-[11px] text-[#737783] ml-1">mg/dL</span>
            </div>
          </div>

          {/* BMI */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#f3faff] border border-[#c3c6d4]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px] text-amber-600">monitor_weight</span>
              </div>
              <div>
                <span className="text-[13px] text-[#434652] font-semibold block">Body Mass Index (BMI)</span>
                <span className="text-[11px] text-[#006f66] font-bold">{healthMetrics.bmiCategory}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[18px] font-extrabold text-[#071e27] font-mono-data">{healthMetrics.bmi}</span>
            </div>
          </div>
        </div>

        {/* Sparkline Recent Trends Chart */}
        <div className="pt-2 border-t border-[#c3c6d4]/60">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-[#737783] uppercase tracking-wider">RECENT VITAL TRENDS (30-DAY TIMELINE)</span>
            <span className="text-[11px] text-[#006f66] font-bold">Stable Trend Analysis</span>
          </div>
          <div className="w-full h-24 bg-[#e6f6ff] rounded-xl p-3 relative overflow-hidden flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
              <path
                d="M 0,32 Q 20,28 35,35 T 70,15 T 100,10"
                fill="none"
                stroke="#003178"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0,32 Q 20,28 35,35 T 70,15 T 100,10 L 100,40 L 0,40 Z"
                fill="url(#trendGrad)"
                opacity="0.2"
              />
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#003178" />
                  <stop offset="100%" stopColor="#003178" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="pt-6 border-t border-[#c3c6d4] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#737783]">
        <p>© 2023 MediQuote AI Clinical Procurement Systems</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#003178]">Privacy Policy</a>
          <a href="#" className="hover:text-[#003178]">Terms of Service</a>
          <a href="#" className="hover:text-[#003178]">Contact Support</a>
        </div>
      </footer>

      {/* Hospital Email Dispatch Status Modal */}
      {selectedCaseForDispatchModal && (
        <HospitalBroadcastStatusModal
          isOpen={!!selectedCaseForDispatchModal}
          onClose={() => setSelectedCaseForDispatchModal(null)}
          currentCase={selectedCaseForDispatchModal}
        />
      )}
    </div>
  );
};
