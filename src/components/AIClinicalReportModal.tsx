import React, { useState } from 'react';
import { SurgicalCase } from '../types';

interface AIClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: SurgicalCase;
  onRequestQuote?: (hospitalName: string) => void;
}

export const AIClinicalReportModal: React.FC<AIClinicalReportModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  onRequestQuote,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'issues' | 'treatment' | 'preop'>('all');

  if (!isOpen) return null;

  const analysis = currentCase.aiClinicalAnalysis;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#c3c6d4] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-[#003178] text-white p-6 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#81f3e5]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-[#81f3e5] text-[#006f66] rounded-xl font-bold">
              <span className="material-symbols-outlined text-[28px]">clinical_notes</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#81f3e5]/20 text-[#81f3e5] font-bold text-[11px] rounded uppercase font-mono-data">
                  {currentCase.caseCode}
                </span>
                <span className="text-[12px] text-blue-200 font-mono-data">
                  Confidence: {currentCase.aiConfidencePercent}%
                </span>
              </div>
              <h2 className="text-[20px] font-bold text-white mt-0.5">{currentCase.title} - Full AI Clinical Report</h2>
              <p className="text-[12px] text-blue-100">
                Diagnostic Analysis, Severity Assessment, Recommended Treatment & Readiness Guidelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={handlePrint}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-[13px] font-bold flex items-center gap-1"
              title="Print Clinical Summary"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Filter Bar */}
        <div className="bg-[#f3faff] border-b border-[#c3c6d4] px-6 py-3 flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2 font-bold text-[#003178]">
            <span className="text-[#737783] font-normal">View Section:</span>
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeSection === 'all' ? 'bg-[#003178] text-white' : 'text-[#434652] hover:bg-white'
              }`}
            >
              All Sections
            </button>
            <button
              onClick={() => setActiveSection('issues')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeSection === 'issues' ? 'bg-[#003178] text-white' : 'text-[#434652] hover:bg-white'
              }`}
            >
              Health Issues
            </button>
            <button
              onClick={() => setActiveSection('treatment')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeSection === 'treatment' ? 'bg-[#003178] text-white' : 'text-[#434652] hover:bg-white'
              }`}
            >
              Treatment & Timeline
            </button>
            <button
              onClick={() => setActiveSection('preop')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeSection === 'preop' ? 'bg-[#003178] text-white' : 'text-[#434652] hover:bg-white'
              }`}
            >
              Pre & Post-Op Guidelines
            </button>
          </div>

          <span className="text-[12px] text-[#006f66] font-bold font-mono-data hidden md:inline">
            Verified by MediQuote AI Clinical Engine
          </span>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#071e27]">
          {/* Section 1: Executive Overview & Source */}
          <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-2">
            <h3 className="font-bold text-[15px] text-[#003178] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006f66]">description</span>
              <span>Case Description & Diagnostic Source</span>
            </h3>
            <p className="text-[14px] text-[#434652]">{currentCase.description}</p>
            {analysis?.reportSourceText && (
              <p className="text-[12px] text-[#006f66] font-mono-data font-bold">
                Source Document: {analysis.reportSourceText}
              </p>
            )}
          </div>

          {/* Section 2: Identified Health Issues */}
          {(activeSection === 'all' || activeSection === 'issues') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#c3c6d4]/60 pb-2">
                <h3 className="text-[17px] font-bold text-[#003178] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006f66]">health_and_safety</span>
                  <span>1. Health Issues Identified As Per Reports</span>
                </h3>
                <span className="text-[12px] text-[#737783] font-mono-data">
                  {analysis?.healthIssuesDetected.length || 0} Conditions Classified
                </span>
              </div>

              {analysis?.healthIssuesDetected.map((issue, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-[#c3c6d4] shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[16px] text-[#071e27]">{issue.conditionName}</h4>
                        {issue.icdCode && (
                          <span className="px-2 py-0.5 bg-[#f1f5f9] text-[#334155] text-[11px] font-mono-data rounded font-bold border">
                            ICD-10: {issue.icdCode}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#434652] mt-1 font-medium bg-[#f8fafc] p-2.5 rounded-lg border">
                        <strong>Diagnostic Finding: </strong> {issue.findingFromReport}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase shrink-0 ${
                        issue.severity === 'High / Serious' || issue.severity === 'Critical Emergency'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : issue.severity === 'Moderate'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[12px]">
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                      <strong className="block font-bold text-amber-800 mb-0.5">⏱️ Treatment Urgency:</strong>
                      <span>{issue.urgencyText}</span>
                    </div>

                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-900">
                      <strong className="block font-bold text-red-800 mb-0.5">🚨 Risk If Delayed:</strong>
                      <span>{issue.riskIfDelayed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section 3: Recommended Treatment & Timeline */}
          {(activeSection === 'all' || activeSection === 'treatment') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#c3c6d4]/60 pb-2">
                <h3 className="text-[17px] font-bold text-[#003178] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006f66]">medical_services</span>
                  <span>2. Recommended Best Treatment & Timeline</span>
                </h3>
              </div>

              {analysis?.treatmentRecommendation && (
                <div className="space-y-4">
                  {/* Recommended Procedure Highlight */}
                  <div className="p-5 bg-[#f0fdf4] border-2 border-emerald-600 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-700 text-[24px]">verified</span>
                        <h4 className="text-[18px] font-bold text-emerald-950">
                          {analysis.treatmentRecommendation.bestTreatmentProcedure}
                        </h4>
                      </div>

                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-[12px] rounded-xl border border-emerald-300 font-mono-data shrink-0">
                        Target Timeline: {analysis.treatmentRecommendation.urgencyTimelineDays}
                      </span>
                    </div>

                    <p className="text-[14px] text-emerald-900 leading-relaxed">
                      <strong>Clinical Justification: </strong>
                      {analysis.treatmentRecommendation.whyBestTreatment}
                    </p>
                  </div>

                  {/* Alternative Treatments Comparison */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-[14px] text-[#003178]">Alternative Treatment Pathways Evaluated:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysis.treatmentRecommendation.alternativeTreatmentsEvaluated.map((alt, idx) => (
                        <div key={idx} className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#c3c6d4] text-[13px] space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-[#071e27]">{alt.treatmentName}</strong>
                            <span className="text-[12px] font-bold text-[#003178] font-mono-data">
                              {alt.suitabilityScorePercent}% Fit
                            </span>
                          </div>
                          <p className="text-[12px] text-[#525866]">{alt.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Pre & Post-Op Guidelines */}
          {(activeSection === 'all' || activeSection === 'preop') && analysis?.treatmentRecommendation && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#c3c6d4]/60 pb-2">
                <h3 className="text-[17px] font-bold text-[#003178] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006f66]">checklist</span>
                  <span>3. Pre-Operative Preparation & Post-Op Recovery Guidelines</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f3faff] rounded-xl border border-[#c3c6d4] space-y-3 min-w-0">
                  <h4 className="font-bold text-[15px] text-[#003178] flex items-center gap-1.5 border-b pb-2">
                    <span className="material-symbols-outlined text-[20px]">checklist</span>
                    <span>Pre-Op Safety Checks</span>
                  </h4>
                  <ul className="space-y-2 text-[13px] text-[#434652]">
                    {analysis.treatmentRecommendation.preOpPreparations.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2 min-w-0">
                        <span className="material-symbols-outlined text-[#006f66] text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span className="break-words min-w-0 leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#f0fdf4] rounded-xl border border-emerald-200 space-y-3 min-w-0">
                  <h4 className="font-bold text-[15px] text-emerald-900 flex items-center gap-1.5 border-b border-emerald-200 pb-2">
                    <span className="material-symbols-outlined text-[20px]">healing</span>
                    <span>Post-Op Recovery Guidelines</span>
                  </h4>
                  <ul className="space-y-2 text-[13px] text-emerald-900">
                    {analysis.treatmentRecommendation.postOpCareInstructions.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2 min-w-0">
                        <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">
                          task_alt
                        </span>
                        <span className="break-words min-w-0 leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-[#f3faff] border-t border-[#c3c6d4] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[12px] text-[#434652]">
            Need help booking surgery or discussing with insurance advisor? Call <a href="tel:18001029988" className="text-[#003178] font-bold font-mono-data underline">1800-102-9988</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#c3c6d4] text-[#434652] font-bold text-[13px] rounded-xl hover:bg-gray-100 transition-all"
            >
              Close
            </button>
            {onRequestQuote && (
              <button
                onClick={() => {
                  onClose();
                  onRequestQuote(currentCase.hospitals[0]?.hospitalName || 'Apollo Hospitals');
                }}
                className="px-5 py-2 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1] transition-all shadow-md flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">request_quote</span>
                <span>Request Custom Hospital Quote</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
