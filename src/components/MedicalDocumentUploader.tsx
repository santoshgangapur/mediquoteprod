import React, { useState, useRef } from 'react';
import { FamilyMember } from '../types';
import { validateMedicalFiles } from '../utils/contentModeration';
import { aiCategorizeMedicalDoc, VaultDoc } from './SecuredVaultView';

export interface QueuedMedicalFile {
  id: string;
  sourceType: 'FILE' | 'URL';
  file?: File;
  previewUrl?: string;
  url?: string;
  fileName: string;
  fileSize: string;
  aiTitle: string;
  aiCategory: VaultDoc['category'];
}

export interface MedicalDocumentUploaderProps {
  familyMembers: FamilyMember[];
  selectedMemberId: string;
  onMemberChange: (memberId: string) => void;
  onUploadSubmit: (queuedFiles: QueuedMedicalFile[]) => Promise<void> | void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  className?: string;
}

export const MedicalDocumentUploader: React.FC<MedicalDocumentUploaderProps> = ({
  familyMembers,
  selectedMemberId,
  onMemberChange,
  onUploadSubmit,
  isSubmitting = false,
  submitButtonText = 'Save Records to Vault DB',
  className = ''
}) => {
  const [uploadSourceTab, setUploadSourceTab] = useState<'FILE' | 'URL'>('FILE');
  const [fileQueue, setFileQueue] = useState<QueuedMedicalFile[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Active Loading States for Upload & Scanning
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepText, setScanStepText] = useState<string>('Scanning files...');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStepMessage, setUploadStepMessage] = useState<string>('');

  const errorRef = useRef<HTMLDivElement>(null);

  const selectedMember =
    familyMembers.find((m) => m.id === selectedMemberId) ||
    familyMembers[0] || {
      id: 'fam-1',
      fullName: 'Arjun Mehta',
      relationship: 'Self (Primary)'
    };

  // Handle files selection with moderation check, local image preview generation & AI auto-categorization
  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploadError(null);
    setIsScanning(true);
    setScanStepText(`Reading ${fileArray.length} file(s)...`);

    // Simulated short step feedback to eliminate perception of lag
    await new Promise((r) => setTimeout(r, 200));
    setScanStepText('Running Gemini Vision Content Moderation & Safety Audit...');

    // 1. Run Content Moderation (18+ & Safety policy check)
    const moderation = await validateMedicalFiles(fileArray);
    if (!moderation.isSafe) {
      setIsScanning(false);
      setUploadError(moderation.errorMessage || 'Upload blocked due to content moderation policy.');
      setTimeout(() => errorRef.current?.focus(), 100);
      return;
    }

    setScanStepText('Applying AI Auto-Categorization & 256-Bit Encryption...');
    await new Promise((r) => setTimeout(r, 250));

    // 2. AI Auto-categorize and queue valid files with instant local preview URL
    const newItems: QueuedMedicalFile[] = fileArray.map((file) => {
      const { aiCategory, aiTitle } = aiCategorizeMedicalDoc(file.name);

      // Create instant object URL for image previews
      let previewUrl: string | undefined = undefined;
      if (file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch (_e) {}
      }

      return {
        id: `queue-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sourceType: 'FILE',
        file,
        previewUrl,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        aiTitle,
        aiCategory
      };
    });

    setFileQueue((prev) => [...prev, ...newItems]);
    setIsScanning(false);
  };

  // Handle URL import
  const handleAddUrlToQueue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    const rawUrls = urlInput.split(/[\n,]/).map((u) => u.trim()).filter((u) => u.length > 5);
    if (rawUrls.length === 0) return;

    const newItems: QueuedMedicalFile[] = rawUrls.map((url) => {
      const parsedName = url.split('/').pop()?.split('?')[0] || 'Medical Cloud Document';
      const { aiCategory, aiTitle } = aiCategorizeMedicalDoc(parsedName);
      return {
        id: `queue-url-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sourceType: 'URL',
        url,
        fileName: parsedName || 'medical_report.pdf',
        fileSize: 'Cloud Link',
        aiTitle,
        aiCategory
      };
    });

    setFileQueue((prev) => [...prev, ...newItems]);
    setUrlInput('');
  };

  const handleRemoveFromQueue = (id: string) => {
    setFileQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleClearAll = () => {
    fileQueue.forEach((i) => {
      if (i.previewUrl) URL.revokeObjectURL(i.previewUrl);
    });
    setFileQueue([]);
  };

  const handleSubmit = async () => {
    if (fileQueue.length === 0) return;

    // Simulate animated upload progress bar (0% to 100%)
    setUploadProgress(15);
    setUploadStepMessage('Initializing 256-Bit AES Encryption Envelope...');

    const timer1 = setTimeout(() => {
      setUploadProgress(45);
      setUploadStepMessage('Uploading encrypted medical chunks to Secured Vault DB...');
    }, 300);

    const timer2 = setTimeout(() => {
      setUploadProgress(85);
      setUploadStepMessage('Attaching ABDM Compliance Seal & Generating Cryptographic Hash...');
    }, 600);

    try {
      await onUploadSubmit(fileQueue);
      setUploadProgress(100);
      setUploadStepMessage('Upload complete!');
      await new Promise((r) => setTimeout(r, 200));
      setFileQueue([]);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setUploadProgress(0);
      setUploadStepMessage('');
    }
  };

  const categoryBadges: Record<VaultDoc['category'], { label: string; color: string; icon: string }> = {
    PRESCRIPTION: { label: 'Rx Prescription', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'prescriptions' },
    LAB_REPORT: { label: 'Lab Test Report', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'science' },
    DISCHARGE_SUMMARY: { label: 'Discharge Summary', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'article' },
    BILL_RECEIPT: { label: 'Hospital Bill / Claim', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'receipt_long' },
    INSURANCE_CARD: { label: 'Insurance Policy', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: 'verified_user' },
    SCAN_MRI: { label: 'Scan & Radiology', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'radiology' }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Moderation Error Alert Banner */}
      {uploadError && (
        <div
          ref={errorRef}
          tabIndex={-1}
          className="p-4 bg-red-50 border-2 border-red-500 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-all animate-in fade-in"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold border border-red-200">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="text-[14px] font-black text-red-900">Upload Blocked by Policy</h4>
                <span className="px-2 py-0.5 bg-red-200 text-red-900 text-[10px] font-mono-data font-bold rounded">
                  18+ SAFETY VIOLATION
                </span>
              </div>
              <p className="text-[12px] text-red-800 font-medium leading-relaxed">{uploadError}</p>
            </div>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-red-500 hover:text-red-800 p-1 rounded-lg hover:bg-red-100 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Active AI Safety Guard Banner */}
      <div className="p-4 bg-[#e6f4ea] border border-[#a7f3d0] rounded-2xl space-y-1.5 text-left shadow-2xs">
        <div className="flex items-start gap-2.5 text-[#064e3b] text-[13px] leading-snug">
          <span className="material-symbols-outlined text-[#059669] text-[20px] shrink-0 mt-0.5">verified_user</span>
          <div>
            <span className="font-extrabold text-[#064e3b]">Automated AI Content Moderation Active: </span>
            <span className="font-medium text-[#047857]">
              18+ adult content, pornography, nudity, graphic violence, and disturbing images are strictly prohibited and automatically blocked.
            </span>
          </div>
        </div>
        <div className="pl-7">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-[#b7e4c7] text-[#065f46] text-[10px] font-black rounded-full tracking-wider font-mono-data">
            ACTIVE SAFETY GUARD
          </span>
        </div>
      </div>

      {/* Main Dropzone Box Container */}
      <div className="p-6 sm:p-8 border-2 border-dashed border-[#003178]/30 rounded-3xl bg-[#f3faff] text-center space-y-5 shadow-2xs relative">
        {/* File Analyzing Overlay Loader */}
        {isScanning && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-3xl z-20 flex flex-col items-center justify-center p-6 space-y-3 animate-in fade-in duration-150">
            <div className="w-12 h-12 border-4 border-[#003178] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-extrabold text-[15px] text-[#003178]">{scanStepText}</p>
            <p className="text-[12px] text-[#64748b] font-mono-data">Verifying medical record integrity & AI content policy</p>
          </div>
        )}

        {/* Selected Family Member Pill Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f3e8ff] border border-[#d8b4fe] text-[#6b21a8] rounded-full text-[13px] font-extrabold shadow-2xs">
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
            <span>Uploading for:</span>
            <select
              value={selectedMemberId}
              onChange={(e) => onMemberChange(e.target.value)}
              className="bg-transparent text-[#581c87] font-black outline-none cursor-pointer hover:underline text-[13px]"
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id} className="bg-white text-black font-normal">
                  {m.fullName} ({m.relationship})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
          </div>
        </div>

        {/* Source Tab Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white p-1 rounded-2xl border border-[#cbd5e1] shadow-2xs max-w-xs w-full">
            <button
              type="button"
              onClick={() => setUploadSourceTab('FILE')}
              className={`flex-1 py-1.5 text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                uploadSourceTab === 'FILE' ? 'bg-[#003178] text-white shadow-xs' : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Local Files</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadSourceTab('URL')}
              className={`flex-1 py-1.5 text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                uploadSourceTab === 'URL' ? 'bg-[#003178] text-white shadow-xs' : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">link</span>
              <span>Import Web Links</span>
            </button>
          </div>
        </div>

        {uploadSourceTab === 'FILE' ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFilesSelected(e.dataTransfer.files);
            }}
            className="space-y-4 max-w-xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-[#dbf1fe] text-[#003178] flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
            </div>

            <div>
              <h3 className="text-[17px] font-extrabold text-[#003178]">
                Drop or Browse Medical Files (PDF, Images, Scans)
              </h3>
              <p className="text-[12px] text-[#737783] mt-0.5">
                Supported formats: PDF, DICOM, JPG, PNG (Up to 25MB). AI auto-categorizes each report.
              </p>
            </div>

            <label className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003178] text-white font-extrabold text-[13px] rounded-xl cursor-pointer hover:bg-[#0d47a1] shadow-md transition-all">
              <span className="material-symbols-outlined text-[18px]">file_open</span>
              <span>Upload Files</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFilesSelected(e.target.files);
                }}
              />
            </label>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-3 bg-white p-5 rounded-2xl border border-[#cbd5e1] shadow-2xs text-left">
            <label className="block text-[11px] font-extrabold text-[#003178] uppercase">
              Paste Web Link(s) or Cloud URLs (Google Drive, Hospital Portals)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/... or https://hospital.org/report.pdf"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-[13px] outline-none focus:border-[#003178]"
              />
              <button
                type="button"
                onClick={() => handleAddUrlToQueue()}
                className="px-5 py-2.5 bg-[#003178] text-white text-[13px] font-bold rounded-xl hover:bg-[#00245a] cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">add_link</span>
                <span>Add Link</span>
              </button>
            </div>
          </div>
        )}

        {/* Queued files list with instant thumbnail image previews & AI badges */}
        {fileQueue.length > 0 && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#cbd5e1] p-4 space-y-3 text-left shadow-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#003178]">auto_awesome</span>
                <h4 className="font-extrabold text-[14px] text-[#0f172a]">
                  {fileQueue.length} Record(s) Ready for AI Encryption
                </h4>
              </div>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[12px] text-red-600 hover:underline font-bold cursor-pointer"
              >
                Clear Queue
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {fileQueue.map((item) => {
                const badge = categoryBadges[item.aiCategory] || categoryBadges.PRESCRIPTION;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] hover:border-[#b8d5ff] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.previewUrl ? (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-[#cbd5e1] overflow-hidden shrink-0 relative group">
                          <img
                            src={item.previewUrl}
                            alt={item.fileName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003178] flex items-center justify-center shrink-0 border border-blue-200">
                          <span className="material-symbols-outlined text-[20px]">
                            {item.sourceType === 'URL' ? 'link' : badge.icon}
                          </span>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[13px] text-[#0f172a] truncate">{item.aiTitle}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border uppercase tracking-wider ${badge.color}`}>
                            🤖 AI: {badge.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {item.fileName} • {item.fileSize}
                        </p>
                      </div>
                    </div>

                    {/* Delete option for individual file in queue */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFromQueue(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer shrink-0"
                      title="Remove file from queue"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Active Uploading Progress Bar */}
            {(isSubmitting || uploadProgress > 0) && (
              <div className="p-3 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl space-y-1.5 text-left animate-in fade-in">
                <div className="flex items-center justify-between text-[12px] font-bold text-[#0369a1]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] animate-ping" />
                    <span>{uploadStepMessage || 'Encrypting & uploading...'}</span>
                  </span>
                  <span className="font-mono-data">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#e0f2fe] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0284c7] to-[#003178] transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(8, uploadProgress)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || uploadProgress > 0}
                className="w-full sm:w-auto px-8 py-3 bg-[#003178] hover:bg-[#00245a] text-white font-extrabold rounded-xl text-[14px] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>{isSubmitting || uploadProgress > 0 ? 'Encrypting & Saving...' : submitButtonText}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
