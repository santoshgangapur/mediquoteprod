import React, { useState, useEffect } from 'react';

interface PlayStoreExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreExportModal: React.FC<PlayStoreExportModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const appUrl = window.location.href;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install directly on Android:\n1. Open browser menu (⋮)\n2. Tap 'Add to Home screen' or 'Install app'.");
    }
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c3c6d4] space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#737783] hover:text-[#003178] hover:bg-[#e6f6ff] rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#c3c6d4] pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#003178] to-[#006f66] text-white flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-[28px]">android</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded font-mono-data uppercase">
                PLAY STORE & MOBILE READY
              </span>
            </div>
            <h2 className="text-[20px] font-extrabold text-[#003178]">
              Deploy MediQuote AI to Google Play Store & Android
            </h2>
          </div>
        </div>

        {/* OPTION 1: 1-CLICK PHONE INSTALL */}
        <div className="p-5 bg-gradient-to-r from-[#e6f6ff] to-[#f3faff] rounded-2xl border border-[#003178]/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003178] text-[24px]">phone_android</span>
              <h3 className="font-extrabold text-[15px] text-[#003178]">
                Option 1: Direct Install on Android / iOS
              </h3>
            </div>
            {isInstalled && (
              <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-bold text-[11px] rounded-full">
                ✓ Installed
              </span>
            )}
          </div>

          <p className="text-[13px] text-[#434652] leading-relaxed">
            This app is built as an offline-capable Progressive Web App (PWA) with a manifest and Service Worker. You or your users can install it instantly onto your phone's home screen.
          </p>

          <button
            onClick={handleInstallClick}
            className="w-full py-3 bg-[#003178] hover:bg-[#0d47a1] text-white font-extrabold text-[14px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
            <span>{isInstalled ? 'App Installed on Device' : 'Install App on My Phone Now'}</span>
          </button>
        </div>

        {/* OPTION 2: GOOGLE PLAY STORE AAB/APK GENERATION */}
        <div className="p-5 bg-[#071e27] text-white rounded-2xl space-y-4 shadow-lg border border-[#81f3e5]/20">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#81f3e5] text-[24px]">storefront</span>
              <h3 className="font-extrabold text-[16px] text-[#81f3e5]">
                Option 2: Generate Play Store Package (.aab)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 bg-[#81f3e5]/20 text-[#81f3e5] font-bold text-[11px] rounded-md font-mono-data">
              NO CODING REQUIRED
            </span>
          </div>

          <p className="text-[13px] text-gray-200 leading-relaxed">
            Convert this app into an official Google Play Store Android Package (<code className="bg-white/10 px-1.5 py-0.5 rounded text-[#81f3e5]">.aab</code>) in 1 click using Microsoft PWABuilder:
          </p>

          <div className="space-y-2 text-[12px] bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#81f3e5] text-[#006f66] font-extrabold flex items-center justify-center text-[11px] shrink-0 mt-0.5">1</span>
              <span>Click the button below to open <strong>PWABuilder.com</strong> with your app pre-loaded.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#81f3e5] text-[#006f66] font-extrabold flex items-center justify-center text-[11px] shrink-0 mt-0.5">2</span>
              <span>Click <strong>"Package for Stores"</strong> → Select <strong>Android / Google Play</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#81f3e5] text-[#006f66] font-extrabold flex items-center justify-center text-[11px] shrink-0 mt-0.5">3</span>
              <span>Download your generated <strong>.aab</strong> package and upload it to your <strong>Google Play Console</strong> account!</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 bg-[#81f3e5] hover:bg-white text-[#006f66] font-black text-[13px] rounded-xl text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Generate Android Package on PWABuilder</span>
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>

            <button
              onClick={copyAppUrl}
              className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-[13px] rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              <span>{copiedUrl ? 'Copied URL!' : 'Copy Web App URL'}</span>
            </button>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#c3c6d4] space-y-2 text-[12px] text-[#434652]">
          <strong className="block font-bold text-[#003178] text-[13px]">
            What you need to publish to Google Play Store:
          </strong>
          <ul className="list-disc list-inside space-y-1 text-[#737783]">
            <li>A Google Play Developer Account ($25 one-time fee from Google).</li>
            <li>The generated <code className="bg-gray-200 px-1 rounded text-[#071e27]">.aab</code> package from PWABuilder above.</li>
            <li>Short description, screenshots of the app, and standard app privacy policy URL.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
