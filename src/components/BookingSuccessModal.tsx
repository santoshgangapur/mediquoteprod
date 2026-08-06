import React from 'react';
import { HospitalQuote, FinancingOption } from '../types';

interface BookingSuccessModalProps {
  isOpen: boolean;
  hospital: HospitalQuote | null;
  financing: FinancingOption | null;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  hospital,
  financing,
  onClose,
}) => {
  if (!isOpen || !hospital) return null;

  const bookingCode = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-white rounded-2xl border border-[#c3c6d4] max-w-lg w-full p-6 shadow-2xl space-y-6 text-center relative">
        <div className="w-16 h-16 rounded-full bg-[#81f3e5] text-[#006f66] flex items-center justify-center mx-auto shadow-md">
          <span className="material-symbols-outlined text-[36px]">check_circle</span>
        </div>

        <div>
          <span className="px-3 py-1 bg-[#dbf1fe] text-[#003178] font-bold text-[12px] rounded font-mono-data">
            BOOKING CONFIRMED • {bookingCode}
          </span>
          <h2 className="text-[24px] font-bold text-[#003178] mt-2">Reservation Submitted</h2>
          <p className="text-[14px] text-[#434652] mt-1">
            Your clinical consultation and surgery slot at <strong>{hospital.hospitalName}</strong> has been reserved.
          </p>
        </div>

        <div className="p-4 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-left space-y-2 text-[13px]">
          <div className="flex justify-between py-1 border-b border-[#c3c6d4]/50">
            <span className="text-[#737783]">Hospital Facility:</span>
            <strong className="text-[#071e27]">{hospital.hospitalName}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-[#c3c6d4]/50">
            <span className="text-[#737783]">Attending Surgeon:</span>
            <strong className="text-[#071e27]">{hospital.doctorName}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-[#c3c6d4]/50">
            <span className="text-[#737783]">Selected Financing:</span>
            <strong className="text-[#003178]">{financing?.title || '12 Months No-Cost EMI'}</strong>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#737783]">Total Amount:</span>
            <strong className="text-[#003178] font-mono-data">₹{hospital.totalQuoteINR.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className="p-3 bg-[#dbf1fe] rounded-xl text-left text-[12px] text-[#003178] space-y-1">
          <p className="font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            MediQuote AI Concierge Desk Assigned
          </p>
          <p className="text-[#071e27]">
            Your dedicated care coordinator (+91-800-425-9921) will contact you within 30 minutes to verify pre-admission blood reports and room preferences.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#003178] text-white font-bold text-[14px] rounded-xl hover:bg-[#0d47a1] shadow-md"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
