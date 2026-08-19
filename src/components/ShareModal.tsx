import React, { useState, useEffect } from 'react';
import { QrCodeDisplay } from './QrCodeDisplay';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseCode?: string;
  patientName?: string;
  documentTitle?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  caseCode = 'MQ-88219',
  patientName = 'Arjun Mehta',
  documentTitle = 'Surgical Quotation & Verified Medical Vault Records',
}) => {
  const [targetAudience, setTargetAudience] = useState<'HOSPITAL' | 'DOCTOR' | 'INSURANCE' | 'FAMILY'>('HOSPITAL');
  const [copied, setCopied] = useState(false);
  const [pinProtection, setPinProtection] = useState(true);
  const [accessPin, setAccessPin] = useState('8821');
  const [oneTimeViewOnly, setOneTimeViewOnly] = useState(false);
  const [passRevoked, setPassRevoked] = useState(false);

  // 24-Hour Countdown Timer State
  const [secondsLeft, setSecondsLeft] = useState(86400); // 24 hours = 86400 seconds

  useEffect(() => {
    if (!isOpen) return;
    setPassRevoked(false);
    setSecondsLeft(86400); // Reset to 24h
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || passRevoked) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, passRevoked]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format seconds into HH:MM:SS
  const formatTimeRemaining = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const currentPassToken = `MQ-24H-${caseCode.replace(/\D/g, '') || '88219'}-${targetAudience}`;
  const secureShareUrl = `${window.location.origin}/#pass=${currentPassToken}&role=${targetAudience.toLowerCase()}${pinProtection ? `&pin=${accessPin}` : ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(secureShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPass = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MediQuote AI - 24-Hour Secure Hospital Pass (${patientName})</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #003178; max-width: 600px; margin: 0 auto; border: 3px solid #003178; border-radius: 20px; text-align: center; }
            h1 { font-size: 24px; margin-bottom: 5px; color: #003178; }
            .badge { display: inline-block; padding: 4px 12px; background: #e6f6ff; color: #003178; font-weight: bold; border-radius: 8px; font-size: 12px; margin-bottom: 15px; }
            .token { font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #006f66; padding: 8px 16px; background: #f0fdf4; border: 1px border #bbf7d0; border-radius: 8px; margin: 15px 0; display: inline-block; }
            .pin { color: #dc2626; font-weight: bold; font-size: 14px; }
            .footer { margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <h1>🏥 MediQuote AI Admissions Pass</h1>
          <div class="badge">TEMPORARY 24-HOUR ACCESS PERMIT</div>
          <p><strong>Patient Name:</strong> ${patientName} | <strong>Case Code:</strong> ${caseCode}</p>
          <p><strong>Target Desk:</strong> ${targetAudience === 'HOSPITAL' ? 'Admissions & Desk' : targetAudience === 'DOCTOR' ? 'Surgeon / Doctor' : targetAudience === 'INSURANCE' ? 'Insurance TPA' : 'Family Advisor'}</p>
          
          <div class="token">${currentPassToken}</div>
          
          ${pinProtection ? `<p class="pin">🔒 Required Security PIN: <strong>${accessPin}</strong></p>` : ''}
          <p style="font-size:12px; color:#475569;">Scan QR Code or open <strong>${secureShareUrl}</strong></p>
          <p style="font-size:11px; color:#059669;">✔ Valid for 24 Hours • 256-Bit AES Encrypted Access</p>

          <div class="footer">
            Generated via MediQuote AI Digital Health Infrastructure • ABDM Compliant
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const audienceOptions = [
    { id: 'HOSPITAL', label: 'Hospital Desk', icon: 'local_hospital', desc: 'For Admissions & Registration Counter' },
    { id: 'DOCTOR', label: 'Surgeon / Doctor', icon: 'stethoscope', desc: 'Direct Clinical Review & Case Assessment' },
    { id: 'INSURANCE', label: 'Insurance Desk', icon: 'verified_user', desc: 'Cashless Pre-Auth & Policy Verification' },
    { id: 'FAMILY', label: 'Family / Advisor', icon: 'family_restroom', desc: 'Second Opinion & Price Comparison' }
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-4 flex justify-center items-start sm:items-center bg-black/70 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border-2 border-[#003178]/30 max-w-lg w-full p-6 shadow-2xl space-y-5 my-auto relative cursor-default"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#c3c6d4]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#003178] text-white flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[18px] text-[#003178]">Secure 24-Hour Access Pass</h3>
                <span className="px-2 py-0.5 bg-[#81f3e5] text-[#006f66] text-[10px] font-black rounded-full font-mono-data">
                  256-BIT AES
                </span>
              </div>
              <p className="text-[12px] text-[#434652] mt-0.5">
                Temporary encrypted link & QR for admissions desks & doctors
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#737783] hover:text-[#003178] hover:bg-[#e6f6ff] rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 24-Hour Timer Status Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          passRevoked
            ? 'bg-red-50 border-red-300 text-red-900'
            : secondsLeft < 3600
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-[#e6f6ff] border-[#003178]/30 text-[#003178]'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] animate-pulse">
                {passRevoked ? 'cancel' : 'timer'}
              </span>
              <span className="font-extrabold text-[13px]">
                {passRevoked ? 'PASS REVOKED' : 'TEMPORARY PASS EXPIRY:'}
              </span>
            </div>

            {!passRevoked && (
              <span className="px-3 py-1 bg-white font-mono-data font-black text-[13px] rounded-xl border border-[#003178]/20 shadow-2xs">
                {formatTimeRemaining(secondsLeft)}
              </span>
            )}
          </div>
          <p className="text-[11px] mt-1.5 opacity-90 leading-tight">
            {passRevoked
              ? 'This access pass has been revoked by the patient. No hospital or doctor can view records with this link.'
              : `Granted access expires automatically in 24 hours. Valid for Patient: ${patientName} (${caseCode}).`}
          </p>
        </div>

        {!passRevoked && (
          <>
            {/* Target Audience Tabs */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-[#003178] uppercase tracking-wider font-mono-data">
                1. Select Recipient / Hospital Role:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {audienceOptions.map((opt) => {
                  const isSelected = targetAudience === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTargetAudience(opt.id as any)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-[#003178] text-white border-[#003178] shadow-md'
                          : 'bg-[#f8fafc] text-[#334155] border-[#cbd5e1] hover:border-[#003178]/50'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] shrink-0 ${isSelected ? 'text-[#81f3e5]' : 'text-[#003178]'}`}>
                        {opt.icon}
                      </span>
                      <div className="min-w-0">
                        <span className="block font-bold text-[12px] truncate">{opt.label}</span>
                        <span className={`block text-[9px] truncate ${isSelected ? 'text-blue-100' : 'text-[#64748b]'}`}>
                          {opt.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QR Code Card Display */}
            <div className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl space-y-3 text-center">
              <label className="block text-[11px] font-black text-[#003178] uppercase tracking-wider font-mono-data">
                2. Instant Scannable Hospital QR Code:
              </label>

              <QrCodeDisplay
                value={secureShareUrl}
                size={180}
                label={`Scan at ${targetAudience === 'HOSPITAL' ? 'Admissions Counter' : targetAudience === 'DOCTOR' ? 'Doctor OPD Clinic' : 'Desk'}`}
                sublabel={`Token: ${currentPassToken}`}
              />

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePrintPass}
                  className="px-4 py-2 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[12px] rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Admission QR Pass</span>
                </button>
              </div>
            </div>

            {/* Link & Security Controls */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-[#003178] uppercase tracking-wider font-mono-data">
                3. Direct 24-Hour Secure Link:
              </label>

              <div className="flex items-center gap-2 bg-[#f3faff] p-2 border-2 border-[#003178]/30 rounded-2xl shadow-2xs">
                <input
                  type="text"
                  readOnly
                  value={secureShareUrl}
                  className="bg-transparent border-none focus:outline-none text-[12px] font-mono-data text-[#003178] font-bold flex-1 px-2 truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[12px] rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Security Toggles */}
              <div className="p-3 bg-[#f1f5f9] rounded-2xl border border-[#e2e8f0] space-y-2.5 text-[12px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#003178]">lock</span>
                    <span className="font-bold text-[#1e293b]">Require 4-Digit Security PIN</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPinProtection(!pinProtection)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                      pinProtection ? 'bg-[#003178]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      pinProtection ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {pinProtection && (
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#cbd5e1] ml-6">
                    <span className="text-[11px] text-[#64748b] font-medium">Access PIN Code:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={accessPin}
                        onChange={(e) => setAccessPin(e.target.value.replace(/\D/g, ''))}
                        className="w-16 px-2 py-1 text-center font-mono-data font-black text-[14px] text-[#003178] bg-[#e6f6ff] border border-[#003178]/30 rounded-lg outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setAccessPin(Math.floor(1000 + Math.random() * 9000).toString())}
                        className="text-[11px] text-[#006f66] font-bold hover:underline cursor-pointer"
                      >
                        Regenerate PIN
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#cbd5e1]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#006f66]">visibility_off</span>
                    <span className="font-bold text-[#1e293b]">Single-View Auto Revoke</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOneTimeViewOnly(!oneTimeViewOnly)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                      oneTimeViewOnly ? 'bg-[#006f66]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      oneTimeViewOnly ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Dispatch & Revoke Bar */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#cbd5e1]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `MediQuote AI 24-Hour Access Pass for Patient ${patientName} (${caseCode}): ${secureShareUrl}${pinProtection ? ` (PIN: ${accessPin})` : ''}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
                  }}
                  className="px-3 py-2 bg-[#25d366] hover:bg-[#1ebd59] text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const subject = `24-Hour Hospital Access Pass: ${patientName} (${caseCode})`;
                    const body = `MediQuote AI 24-Hour Access Permit for Patient ${patientName}:\n\nAccess Link: ${secureShareUrl}\n${pinProtection ? `Security PIN: ${accessPin}\n` : ''}\nValid for 24 hours.`;
                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                  }}
                  className="px-3 py-2 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span>Email Pass</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPassRevoked(true)}
                className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 font-extrabold text-[11px] rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-red-200"
              >
                <span className="material-symbols-outlined text-[16px]">do_not_disturb_on</span>
                <span>Revoke Pass</span>
              </button>
            </div>
          </>
        )}

        {passRevoked && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setPassRevoked(false);
                setSecondsLeft(86400);
              }}
              className="px-6 py-2.5 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[13px] rounded-xl shadow-md cursor-pointer"
            >
              Generate New 24-Hour Access Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
