import React, { useState, useEffect } from 'react';

interface SmsLogItem {
  id: string;
  mobileNumber: string;
  otp: string;
  purpose: string;
  smsText: string;
  provider: string;
  status: string;
  timestamp: string;
}

interface VirtualSmsInboxWidgetProps {
  onAutoFillOtp?: (otp: string) => void;
}

export const VirtualSmsInboxWidget: React.FC<VirtualSmsInboxWidgetProps> = ({ onAutoFillOtp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [latestSms, setLatestSms] = useState<SmsLogItem | null>(null);
  const [smsHistory, setSmsHistory] = useState<SmsLogItem[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [isWidgetDismissed, setIsWidgetDismissed] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/sms-logs');
      const data = await res.json();
      if (data && data.logs && data.logs.length > 0) {
        const newest = data.logs[0];
        setSmsHistory(data.logs);

        // Check if new message arrived
        if (!latestSms || newest.id !== latestSms.id) {
          setLatestSms(newest);
          setShowNotification(true);
          setIsMinimized(false);
        }
      }
    } catch (_err) {}
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [latestSms]);

  if (!latestSms || isWidgetDismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 font-sans">
      {/* Pop-up Live SMS Receiver Banner */}
      {showNotification && (
        <div className="bg-[#071e27] text-white p-4 rounded-2xl shadow-2xl border-2 border-[#81f3e5] max-w-sm w-full animate-bounce-in relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#81f3e5] via-blue-400 to-[#81f3e5] animate-pulse" />

          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#81f3e5] text-[#003178] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">smartphone</span>
              </div>
              <div>
                <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#81f3e5] block font-bold">
                  Free Live SMS Receiver
                </span>
                <span className="text-[13px] font-extrabold font-mono-data">{latestSms.mobileNumber}</span>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <p className="text-[12px] bg-white/10 p-2.5 rounded-xl border border-white/10 text-gray-100 font-medium leading-relaxed mb-3">
            "{latestSms.smsText}"
          </p>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-gray-400 font-mono-data">
              OTP: <strong className="text-[#81f3e5] text-[13px]">{latestSms.otp}</strong>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(latestSms.otp);
                  alert(`Copied OTP code ${latestSms.otp} to clipboard!`);
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">content_copy</span>
                <span>Copy</span>
              </button>
              {onAutoFillOtp && (
                <button
                  onClick={() => {
                    onAutoFillOtp(latestSms.otp);
                    setShowNotification(false);
                  }}
                  className="px-2.5 py-1 bg-[#81f3e5] hover:bg-white text-[#003178] rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[12px]">bolt</span>
                  <span>Auto-Fill</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="flex items-center gap-1 bg-[#003178] text-white rounded-full shadow-2xl border border-[#81f3e5]/50 pl-4 pr-1.5 py-1.5">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotification(false);
          }}
          className="text-[13px] font-extrabold flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-[#81f3e5]">sms</span>
          <span>Live Free SMS Receiver</span>
          <span className="w-5 h-5 rounded-full bg-[#81f3e5] text-[#003178] text-[10px] font-extrabold flex items-center justify-center">
            {smsHistory.length}
          </span>
        </button>
        <button
          onClick={() => {
            setIsWidgetDismissed(true);
            setIsOpen(false);
            setShowNotification(false);
          }}
          className="p-1 text-[#81f3e5] hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer ml-1"
          title="Dismiss Live SMS Receiver"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      {/* Expanded Handset Drawer */}
      {isOpen && (
        <div className="bg-white border-2 border-[#003178] rounded-3xl shadow-2xl w-80 max-h-96 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-[#003178] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#81f3e5] text-[20px]">phone_iphone</span>
              <span className="font-extrabold text-[13px]">Handset SMS Inbox</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="p-3 bg-blue-50 border-b border-blue-100 text-[11px] text-[#003178]">
            <p className="font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">info</span>
              <span>Free Telecom SMS Receiver</span>
            </p>
            <p className="text-[10px] text-gray-600 leading-tight">
              All SMS verification dispatches arrive here in real-time without requiring paid gateway keys.
            </p>
          </div>

          <div className="p-3 overflow-y-auto space-y-2 flex-1">
            {smsHistory.map((msg) => (
              <div key={msg.id} className="p-2.5 bg-[#f8fafc] border border-gray-200 rounded-xl space-y-1 text-[11px]">
                <div className="flex justify-between items-center text-gray-500 font-mono-data">
                  <span className="font-bold text-[#003178]">{msg.mobileNumber}</span>
                  <span className="text-[9px]">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-gray-800 font-medium">{msg.smsText}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">
                    Code: {msg.otp}
                  </span>
                  {onAutoFillOtp && (
                    <button
                      onClick={() => {
                        onAutoFillOtp(msg.otp);
                        setIsOpen(false);
                      }}
                      className="text-[#003178] font-bold hover:underline text-[10px] cursor-pointer"
                    >
                      Use Code →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
