import React, { useState } from 'react';
import { AIClinicalAnalysis, SurgicalCase } from '../types';

interface AIClinicalAnalysisCardProps {
  currentCase: SurgicalCase;
  isCompact?: boolean;
  onOpenFullModal?: () => void;
  onRefreshAIAnalysis?: () => void;
  isRefreshingAI?: boolean;
}

export const AIClinicalAnalysisCard: React.FC<AIClinicalAnalysisCardProps> = ({
  currentCase,
  isCompact = false,
  onOpenFullModal,
  onRefreshAIAnalysis,
  isRefreshingAI = false,
}) => {
  const analysis: AIClinicalAnalysis | undefined = currentCase.aiClinicalAnalysis;
  const [activeTab, setActiveTab] = useState<'issues' | 'treatment' | 'severity' | 'prep'>('issues');

  if (!analysis) {
    return (
      <div className="bg-gradient-to-r from-[#003178] to-[#001d4a] rounded-2xl p-6 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#81f3e5] text-[24px]">auto_awesome</span>
          <h3 className="font-bold text-[18px]">AI Clinical Recommendation Summary</h3>
        </div>
        <p className="text-[14px] text-blue-100">{currentCase.aiPrimaryRecommendationReason}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#002255] via-[#003178] to-[#001a40] rounded-2xl p-6 text-white shadow-lg space-y-6 border border-[#006f66]/40 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#81f3e5]/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-[#81f3e5] text-[#006f66] rounded-2xl font-bold shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-[#81f3e5]/20 text-[#81f3e5] font-bold text-[11px] rounded tracking-wider uppercase border border-[#81f3e5]/30">
                COMPLETE AI CLINICAL DIAGNOSIS
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[11px] rounded font-mono-data border border-emerald-500/30">
                {currentCase.aiConfidencePercent}% CLINICAL MATCH
              </span>
              {analysis.overallHealthScore && (
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded font-mono-data border border-amber-500/30">
                  HEALTH SCORE: {analysis.overallHealthScore}/100
                </span>
              )}
            </div>

            <h2 className="text-[20px] font-bold text-white mt-1 flex items-center gap-2">
              <span>Diagnostic Report Analysis & AI Treatment Protocol</span>
            </h2>

            {analysis.reportSourceText && (
              <p className="text-[12px] text-blue-200 mt-0.5 flex items-center gap-1 font-mono-data">
                <span className="material-symbols-outlined text-[15px] text-[#81f3e5]">description</span>
                <span>Source: {analysis.reportSourceText}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onRefreshAIAnalysis && (
            <button
              onClick={onRefreshAIAnalysis}
              disabled={isRefreshingAI}
              className="px-3.5 py-2.5 bg-[#81f3e5]/20 hover:bg-[#81f3e5]/30 text-[#81f3e5] border border-[#81f3e5]/40 font-bold text-[13px] rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[18px] ${isRefreshingAI ? 'animate-spin' : 'text-[#81f3e5]'}`}>
                {isRefreshingAI ? 'refresh' : 'bolt'}
              </span>
              <span>{isRefreshingAI ? 'Querying Gemini AI...' : 'Re-Analyze with Gemini AI'}</span>
            </button>
          )}

          {onOpenFullModal && (
            <button
              onClick={onOpenFullModal}
              className="px-4 py-2.5 bg-[#81f3e5] text-[#006f66] font-bold text-[13px] rounded-xl hover:bg-white transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_full</span>
              <span>View Comprehensive Clinical Report</span>
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY BANNER */}
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-[14px] text-blue-50 leading-relaxed space-y-1">
        <strong className="text-[#81f3e5] font-bold block text-[12px] uppercase tracking-wider">
          AI CLINICAL EXECUTIVE SUMMARY:
        </strong>
        <p>{analysis.reportAnalysisSummary}</p>
      </div>

      {/* INTERACTIVE NAVIGATION TABS */}
      {!isCompact && (
        <div className="flex border-b border-white/15 space-x-2 md:space-x-6 overflow-x-auto pb-1 text-[13px] no-scrollbar">
          <button
            onClick={() => setActiveTab('issues')}
            className={`pb-2.5 font-bold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'issues'
                ? 'border-[#81f3e5] text-[#81f3e5]'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
            <span>1. Identified Health Issues ({analysis.healthIssuesDetected.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('treatment')}
            className={`pb-2.5 font-bold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'treatment'
                ? 'border-[#81f3e5] text-[#81f3e5]'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">medical_services</span>
            <span>2. Best Treatment & Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('severity')}
            className={`pb-2.5 font-bold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'severity'
                ? 'border-[#81f3e5] text-[#81f3e5]'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>3. Severity & Delayed Risks</span>
          </button>

          <button
            onClick={() => setActiveTab('prep')}
            className={`pb-2.5 font-bold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'prep'
                ? 'border-[#81f3e5] text-[#81f3e5]'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">checklist</span>
            <span>4. Pre & Post-Op Guidelines</span>
          </button>
        </div>
      )}

      {/* TAB 1: IDENTIFIED HEALTH ISSUES */}
      {(activeTab === 'issues' || isCompact) && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#81f3e5]">lab_research</span>
              <span>Health Issues Extracted From Reports & Vitals</span>
            </h3>
            <span className="text-[11px] text-blue-200 font-mono-data">
              {analysis.healthIssuesDetected.length} Diagnostic Conditions Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.healthIssuesDetected.map((issue, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-3 flex flex-col justify-between hover:bg-white/15 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-[14px] text-white leading-tight">{issue.conditionName}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        issue.severity === 'High / Serious' || issue.severity === 'Critical Emergency'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : issue.severity === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>

                  {issue.icdCode && (
                    <span className="inline-block px-2 py-0.5 bg-slate-900/60 text-slate-300 text-[11px] font-mono-data rounded border border-white/10">
                      ICD-10: {issue.icdCode}
                    </span>
                  )}

                  <div className="text-[12px] text-blue-100 bg-slate-900/40 p-2.5 rounded-lg border border-white/10 space-y-1">
                    <span className="text-[11px] text-[#81f3e5] font-bold block">REPORT FINDING:</span>
                    <p className="line-clamp-3">{issue.findingFromReport}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] space-y-1">
                  <div className="text-amber-300 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>{issue.urgencyText}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BEST TREATMENT & TIMELINE */}
      {!isCompact && activeTab === 'treatment' && (
        <div className="space-y-5 animate-in fade-in">
          {/* PRIMARY BEST TREATMENT BOX */}
          <div className="p-5 bg-emerald-950/40 rounded-xl border border-emerald-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[22px]">verified</span>
                <div>
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                    RECOMMENDED BEST PROCEDURE
                  </span>
                  <h3 className="text-[18px] font-bold text-white">
                    {analysis.treatmentRecommendation.bestTreatmentProcedure}
                  </h3>
                </div>
              </div>

              <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300 font-bold text-[12px] flex items-center gap-1.5 shrink-0">
                <span className="material-symbols-outlined text-[16px]">alarm</span>
                <span>Timeline: {analysis.treatmentRecommendation.urgencyTimelineDays}</span>
              </div>
            </div>

            <p className="text-[13px] text-emerald-100 leading-relaxed">
              <strong className="text-emerald-300 font-bold">Why This Is Best: </strong>
              {analysis.treatmentRecommendation.whyBestTreatment}
            </p>
          </div>

          {/* URGENCY TIMELINE & HOW EARLY TO DO TREATMENT */}
          <div className="p-4 bg-amber-950/30 rounded-xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[13px]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[20px]">hourglass_top</span>
                <strong className="text-amber-300 text-[14px]">
                  How Early To Do Treatment?
                </strong>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded uppercase">
                  {analysis.treatmentRecommendation.urgencyLevel}
                </span>
              </div>
              <p className="text-amber-100/90 text-[12px]">
                Target Window: <span className="font-bold text-white font-mono-data">{analysis.treatmentRecommendation.urgencyTimelineDays}</span>. Operating within this window significantly reduces open surgical conversion and avoids emergency ER admissions.
              </p>
            </div>
          </div>

          {/* ALTERNATIVE TREATMENTS EVALUATED */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#81f3e5]">compare_arrows</span>
              <span>Alternative Surgical Pathways Evaluated by AI</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.treatmentRecommendation.alternativeTreatmentsEvaluated.map((alt, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-2 text-[12px]"
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-bold text-white text-[13px]">{alt.treatmentName}</strong>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-bold rounded font-mono-data">
                      {alt.suitabilityScorePercent}% Fit
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#81f3e5]"
                      style={{ width: `${alt.suitabilityScorePercent}%` }}
                    />
                  </div>

                  <p className="text-blue-100 text-[11px] leading-snug">{alt.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEVERITY & RISKS IF DELAYED */}
      {!isCompact && activeTab === 'severity' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-red-400">warning_amber</span>
            <span>Severity & Risk Analysis If Treatment Is Delayed</span>
          </h3>

          <div className="space-y-3">
            {analysis.healthIssuesDetected.map((issue, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-900/70 rounded-xl border border-red-500/30 space-y-2 text-[13px]"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-[14px] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    <span>{issue.conditionName}</span>
                  </h4>
                  <span className="px-2.5 py-0.5 bg-red-500/20 text-red-300 font-bold text-[11px] rounded uppercase">
                    {issue.severity}
                  </span>
                </div>

                <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-red-200 text-[12px] space-y-1">
                  <strong className="text-red-300 font-bold block uppercase tracking-wider text-[11px]">
                    CONSEQUENCE OF DELAYING SURGERY:
                  </strong>
                  <p>{issue.riskIfDelayed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRE & POST-OP GUIDELINES */}
      {!isCompact && activeTab === 'prep' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          {/* Pre-Op Instructions */}
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/15 space-y-3 text-[13px] min-w-0">
            <h4 className="font-bold text-[#81f3e5] text-[14px] flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              <span>Pre-Operative Preparation Checklist</span>
            </h4>

            <ul className="space-y-2">
              {analysis.treatmentRecommendation.preOpPreparations.map((prep, idx) => (
                <li key={idx} className="flex items-start gap-2 text-blue-100 min-w-0">
                  <span className="material-symbols-outlined text-[#81f3e5] text-[16px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="break-words min-w-0 leading-relaxed">{prep}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Post-Op Instructions */}
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/15 space-y-3 text-[13px] min-w-0">
            <h4 className="font-bold text-[#81f3e5] text-[14px] flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="material-symbols-outlined text-[18px]">healing</span>
              <span>Post-Operative Recovery Guidelines</span>
            </h4>

            <ul className="space-y-2">
              {analysis.treatmentRecommendation.postOpCareInstructions.map((post, idx) => (
                <li key={idx} className="flex items-start gap-2 text-blue-100 min-w-0">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px] shrink-0 mt-0.5">
                    task_alt
                  </span>
                  <span className="break-words min-w-0 leading-relaxed">{post}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
