import React, { useState } from 'react';
import { HospitalQuote, SurgicalCase, FinancingOption } from '../types';
import { defaultFinancingOptions } from '../data/mockData';

interface CheckoutViewProps {
  selectedHospital: HospitalQuote;
  currentCase: SurgicalCase;
  onConfirmBooking: (selectedFinancing: FinancingOption) => void;
  onBackToQuotes: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  selectedHospital,
  currentCase,
  onConfirmBooking,
  onBackToQuotes,
}) => {
  const [selectedFinancing, setSelectedFinancing] = useState<FinancingOption>(defaultFinancingOptions[0]);
  const [linkedInsurance, setLinkedInsurance] = useState<string>('HDFC Optima Restore (HDFC-OPT-992014)');
  const [isLinkingNewInsurance, setIsLinkingNewInsurance] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToQuotes}>
            <div className="w-8 h-8 rounded-full bg-[#006f66] text-white flex items-center justify-center font-bold text-[14px]">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <span className="font-bold text-[14px] text-[#006f66] hidden sm:inline">1. SELECT</span>
          </div>

          <div className="h-1 flex-1 bg-[#003178] mx-4 rounded"></div>

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#003178] text-white flex items-center justify-center font-bold text-[14px]">
              2
            </div>
            <span className="font-bold text-[14px] text-[#003178]">2. CHECKOUT</span>
          </div>

          <div className="h-1 flex-1 bg-[#c3c6d4] mx-4 rounded"></div>

          {/* Step 3 */}
          <div className="flex items-center gap-2 text-[#737783]">
            <div className="w-8 h-8 rounded-full bg-[#c3c6d4] text-white flex items-center justify-center font-bold text-[14px]">
              3
            </div>
            <span className="font-medium text-[14px] hidden sm:inline">3. CONFIRM</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hospital Summary, Insurance, Financing (Col 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selected Hospital Summary Card */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between border-b border-[#c3c6d4]/60 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-[#c3c6d4] p-2 flex items-center justify-center shrink-0">
                  <img
                    src={selectedHospital.logoUrl}
                    alt={selectedHospital.hospitalName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded uppercase">
                    {selectedHospital.badge || 'SELECTED PROVIDER'}
                  </span>
                  <h2 className="text-[20px] font-bold text-[#071e27] mt-1">{selectedHospital.hospitalName}</h2>
                  <p className="text-[13px] text-[#434652] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#003178]">location_on</span>
                    <span>{selectedHospital.location}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onBackToQuotes}
                className="text-[12px] font-bold text-[#003178] hover:underline shrink-0"
              >
                Change Provider
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div className="p-3 bg-[#f3faff] rounded-xl border border-[#c3c6d4]/60">
                <span className="text-[11px] font-bold text-[#737783] uppercase block">SURGICAL PROCEDURE</span>
                <span className="font-bold text-[#071e27]">{currentCase.title}</span>
              </div>
              <div className="p-3 bg-[#f3faff] rounded-xl border border-[#c3c6d4]/60">
                <span className="text-[11px] font-bold text-[#737783] uppercase block">LEAD SURGEON</span>
                <span className="font-bold text-[#071e27]">{selectedHospital.doctorName}</span>
              </div>
            </div>
          </div>

          {/* Insurance & TPA Verification Section */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#c3c6d4]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003178]">verified_user</span>
                <h3 className="font-bold text-[16px] text-[#071e27]">Insurance & Cashless TPA</h3>
              </div>
              <span className="text-[12px] font-bold text-[#006f66] bg-[#81f3e5] px-2 py-0.5 rounded">
                Verified Linked
              </span>
            </div>

            <div className="p-3.5 bg-[#f3faff] border border-[#c3c6d4] rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-[14px] text-[#071e27]">{linkedInsurance}</p>
                <p className="text-[12px] text-[#434652]">Pre-authorization documents auto-synced</p>
              </div>
              <button
                onClick={() => setIsLinkingNewInsurance(!isLinkingNewInsurance)}
                className="text-[12px] font-bold text-[#003178] hover:underline"
              >
                Update Policy
              </button>
            </div>

            {/* AI Insight Likelihood */}
            <div className="p-4 bg-[#dbf1fe] rounded-xl border border-[#c3c6d4]/80 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#006a62] text-[22px] shrink-0 mt-0.5">auto_awesome</span>
              <div>
                <h4 className="font-bold text-[14px] text-[#003178]">92% Cashless Pre-Approval Likelihood</h4>
                <p className="text-[12px] text-[#071e27] mt-0.5">
                  Our AI verified that your policy includes full coverage for laparoscopic gallbladder procedures at Fortis Hospital with zero co-pay.
                </p>
              </div>
            </div>
          </div>

          {/* Flexible Financing Options */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[16px] text-[#071e27] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003178]">payments</span>
              <span>Flexible Payment & Financing Options</span>
            </h3>

            <div className="space-y-3">
              {defaultFinancingOptions.map((opt) => {
                const isSelected = selectedFinancing.id === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedFinancing(opt)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#003178] bg-[#f3faff] shadow-sm'
                        : 'border-[#c3c6d4] hover:border-[#003178]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#003178] bg-[#003178]' : 'border-[#c3c6d4]'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[15px] text-[#071e27]">{opt.title}</h4>
                          {opt.badge && (
                            <span className="px-2 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[10px] rounded">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#434652]">{opt.subtext}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[16px] text-[#003178] font-mono-data">
                        ₹{opt.monthlyAmountINR.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-[#737783] block">
                        {opt.id === 'full' ? 'one-time' : '/ month'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Payment Breakdown & Confirm (Col 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-md space-y-6 sticky top-20">
            <h3 className="font-bold text-[18px] text-[#003178] border-b border-[#c3c6d4]/60 pb-3">
              Payment Summary
            </h3>

            {/* Line items */}
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between text-[#434652]">
                <span>Surgical Procedure & OT Fee</span>
                <span className="font-mono-data font-semibold text-[#071e27]">
                  ₹{selectedHospital.details.surgicalProcedure.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#434652]">
                <span>Room Rent & Nursing ({selectedHospital.estStay})</span>
                <span className="font-mono-data font-semibold text-[#071e27]">
                  ₹{selectedHospital.details.roomRent.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#434652]">
                <span>Implants & Surgical Equipment</span>
                <span className="font-mono-data font-semibold text-[#071e27]">
                  ₹{selectedHospital.details.implantsEquipment.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#434652]">
                <span>Consultation & Pre-Op Labs</span>
                <span className="font-mono-data font-semibold text-[#071e27]">
                  ₹{selectedHospital.details.consultationLabs.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#006f66] font-bold">
                <span>MediQuote Platform Savings</span>
                <span className="font-mono-data">
                  -₹{selectedHospital.details.platformDiscount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Total Divider */}
            <div className="pt-4 border-t-2 border-[#003178] flex items-center justify-between">
              <div>
                <span className="text-[12px] font-bold text-[#737783] uppercase block">TOTAL AMOUNT</span>
                <span className="text-[26px] font-bold text-[#003178] font-mono-data">
                  ₹{selectedHospital.totalQuoteINR.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#006f66] bg-[#81f3e5] px-2.5 py-1 rounded">
                All Inclusive
              </span>
            </div>

            {/* Confirm & Pay CTA */}
            <button
              onClick={() => onConfirmBooking(selectedFinancing)}
              className="w-full py-3.5 bg-[#003178] text-white font-bold text-[16px] rounded-xl hover:bg-[#0d47a1] transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">lock</span>
              <span>Confirm & Reserve Slot</span>
            </button>

            {/* Security Badges */}
            <div className="pt-4 border-t border-[#c3c6d4]/60 text-center space-y-3">
              <p className="text-[11px] text-[#737783] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#006f66]">shield_lock</span>
                <span>256-Bit SSL Encrypted • NABH Partner Hospital</span>
              </p>
              <div className="flex items-center justify-center gap-4 opacity-75">
                <span className="text-[11px] font-bold text-[#003178] border px-2 py-0.5 rounded">NABH ACCREDITED</span>
                <span className="text-[11px] font-bold text-[#003178] border px-2 py-0.5 rounded">PCI-DSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
