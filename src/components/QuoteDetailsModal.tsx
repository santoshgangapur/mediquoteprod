import React from 'react';
import { HospitalQuote } from '../types';

interface QuoteDetailsModalProps {
  hospital: HospitalQuote | null;
  onClose: () => void;
  onProceedToBooking: (hospital: HospitalQuote) => void;
}

export const QuoteDetailsModal: React.FC<QuoteDetailsModalProps> = ({
  hospital,
  onClose,
  onProceedToBooking,
}) => {
  if (!hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#c3c6d4] max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <div className="flex justify-between items-center border-b border-[#c3c6d4]/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-[#c3c6d4] p-1 flex items-center justify-center">
              <img src={hospital.logoUrl} alt={hospital.hospitalName} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#071e27]">{hospital.hospitalName}</h3>
              <p className="text-[12px] text-[#737783]">{hospital.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#737783] hover:text-[#071e27]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Doctor & Room Overview */}
        <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#c3c6d4] space-y-2 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-[#737783] font-bold uppercase">Attending Doctor:</span>
            <strong className="text-[#003178]">{hospital.doctorName} ({hospital.doctorSpecialty})</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737783] font-bold uppercase">Room Accommodation:</span>
            <strong className="text-[#071e27]">{hospital.roomInclusion}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737783] font-bold uppercase">Estimated Stay:</span>
            <strong className="text-[#006f66]">{hospital.estStay}</strong>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[12px] font-bold text-[#737783] uppercase tracking-wider">
            Itemized Quotation Breakdown (₹ INR)
          </h4>

          <div className="space-y-2 text-[13px] bg-[#f3faff] p-4 rounded-xl border border-[#c3c6d4]">
            <div className="flex justify-between text-[#434652]">
              <span>Surgical Procedure Fee:</span>
              <span className="font-mono-data font-bold text-[#071e27]">
                ₹{hospital.details.surgicalProcedure.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[#434652]">
              <span>Room Rent & Nursing ({hospital.estStay}):</span>
              <span className="font-mono-data font-bold text-[#071e27]">
                ₹{hospital.details.roomRent.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[#434652]">
              <span>Implants & Surgical Equipment:</span>
              <span className="font-mono-data font-bold text-[#071e27]">
                ₹{hospital.details.implantsEquipment.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[#434652]">
              <span>Consultation & Pre-Op Diagnostics:</span>
              <span className="font-mono-data font-bold text-[#071e27]">
                ₹{hospital.details.consultationLabs.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[#006f66] font-bold pt-1 border-t border-[#c3c6d4]">
              <span>Platform Savings & TPA Discount:</span>
              <span className="font-mono-data">
                -₹{hospital.details.platformDiscount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#dbf1fe] rounded-xl flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#003178] uppercase">Final Estimated Total</span>
            <span className="text-[20px] font-bold text-[#003178] font-mono-data">
              ₹{hospital.totalQuoteINR.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Contact Hospital Channels */}
        <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#c3c6d4] space-y-2">
          <span className="text-[11px] font-bold text-[#737783] uppercase block">
            Direct Hospital Desk Contacts:
          </span>

          <div className="flex items-center gap-2 text-[12px]">
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello ${hospital.hospitalName}, I am inquiring regarding the quotation.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-center flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
              <span>WhatsApp</span>
            </a>

            <a
              href="tel:+919876543210"
              className="flex-1 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-center flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>Direct Call</span>
            </a>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#c3c6d4]/60">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-bold text-[#434652] hover:bg-gray-100 rounded-xl"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onProceedToBooking(hospital);
            }}
            className="px-5 py-2 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1] shadow-md flex items-center gap-1.5"
          >
            <span>Proceed to Booking</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
