import React from 'react';
import { SurgicalCase, HospitalEmailDispatch } from '../types';

interface HospitalBroadcastStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: SurgicalCase;
  onResendBroadcast?: (hospitalId: string) => void;
}

export const HospitalBroadcastStatusModal: React.FC<HospitalBroadcastStatusModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  onResendBroadcast,
}) => {
  if (!isOpen) return null;

  const dispatches: HospitalEmailDispatch[] = currentCase.hospitalDispatches || [
    {
      hospitalId: 'apollo-hospitals',
      hospitalName: 'Apollo Hospitals Bannerghatta',
      email: 'quotes@apollohospitals.org',
      sentTimestamp: 'Just now',
      status: 'Quotation Offered',
      responseCostEstimateINR: 185000,
      responseTpaStatus: '100% Cashless Pre-Approved',
    },
    {
      hospitalId: 'fortis-hospital',
      hospitalName: 'Fortis Hospital Cunningham Rd',
      email: 'admissions@fortishospitals.in',
      sentTimestamp: 'Just now',
      status: 'Quotation Offered',
      responseCostEstimateINR: 152400,
      responseTpaStatus: '98% Cashless Rate (HDFC Optima)',
    },
    {
      hospitalId: 'max-healthcare',
      hospitalName: 'Max Super Speciality Hospital',
      email: 'quotes@maxhealthcare.com',
      sentTimestamp: 'Just now',
      status: 'Received & Opened',
      responseTpaStatus: 'Preparing Line-Item Estimate',
    },
    {
      hospitalId: 'manipal-hospitals',
      hospitalName: 'Manipal Hospitals Old Airport Rd',
      email: 'enquiry@manipalhospitals.com',
      sentTimestamp: 'Just now',
      status: 'Email Dispatched',
      responseTpaStatus: 'Awaiting Coordinator Review',
    },
  ];

  const totalDispatched = dispatches.length;
  const quotesOffered = dispatches.filter((d) => d.status === 'Quotation Offered').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#c3c6d4] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-[#003178] text-white p-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#81f3e5]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#81f3e5] text-[#006f66] rounded-xl font-bold">
                <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#81f3e5]/20 text-[#81f3e5] text-[11px] font-bold rounded uppercase font-mono-data">
                    {currentCase.caseCode}
                  </span>
                  <span className="text-[12px] text-emerald-300 font-bold font-mono-data">
                    {quotesOffered}/{totalDispatched} Quotations Received
                  </span>
                </div>
                <h2 className="text-[20px] font-bold text-white mt-0.5">
                  Hospital Quotation Dispatch & Email Log
                </h2>
                <p className="text-[12px] text-blue-100">
                  Case title: <span className="font-bold text-white">{currentCase.title}</span>
                  {currentCase.patientMemberName && ` (Patient: ${currentCase.patientMemberName})`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Banner */}
        <div className="bg-[#f0fdf4] border-b border-emerald-200 px-6 py-3 flex items-center justify-between text-[13px] text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">mark_as_unread</span>
            <span>
              <strong>Automated Case Email Broadcast:</strong> Case details, patient vitals, and diagnostic reports were securely dispatched to all registered hospitals in your selected area.
            </span>
          </div>
        </div>

        {/* Scrollable Hospital Dispatches List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {dispatches.map((disp, idx) => {
            let statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
            let icon = 'send';
            if (disp.status === 'Received & Opened') {
              statusColor = 'bg-amber-100 text-amber-800 border-amber-200';
              icon = 'drafts';
            } else if (disp.status === 'Quotation Offered') {
              statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              icon = 'verified';
            }

            return (
              <div
                key={idx}
                className="p-4 bg-white rounded-xl border border-[#c3c6d4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#003178] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[15px] text-[#071e27]">{disp.hospitalName}</h4>
                    <span className="text-[12px] text-[#737783] font-mono-data">({disp.email})</span>
                  </div>

                  <div className="flex items-center gap-2 text-[12px] text-[#434652]">
                    <span className="material-symbols-outlined text-[16px] text-[#006f66]">schedule</span>
                    <span>Dispatched: {disp.sentTimestamp}</span>
                    {disp.responseTpaStatus && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[11px] font-mono-data border">
                        TPA: {disp.responseTpaStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {disp.responseCostEstimateINR && (
                    <div className="text-right">
                      <span className="text-[10px] text-[#737783] block uppercase font-bold">Estimated Quote</span>
                      <strong className="text-[16px] font-bold text-[#003178] font-mono-data">
                        ₹{disp.responseCostEstimateINR.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}

                  <span className={`px-3 py-1 rounded-xl text-[12px] font-bold border flex items-center gap-1.5 ${statusColor}`}>
                    <span className="material-symbols-outlined text-[16px]">{icon}</span>
                    <span>{disp.status}</span>
                  </span>

                  {onResendBroadcast && disp.status === 'Email Dispatched' && (
                    <button
                      onClick={() => onResendBroadcast(disp.hospitalId)}
                      className="px-2.5 py-1 text-[11px] bg-[#003178] text-white font-bold rounded-lg hover:bg-[#0d47a1]"
                    >
                      Resend Email
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f3faff] border-t border-[#c3c6d4] flex items-center justify-between shrink-0 text-[12px] text-[#434652]">
          <span>Need to add another hospital email recipient? Contact support at support@mediquote.ai</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
