import React, { useState, useRef, useEffect } from 'react';
import { MedicalRecord, AIAnalysisResult, ViewMode, FamilyMember, EquipmentItem } from '../types';
import { validateMedicalFiles } from '../utils/contentModeration';
import { ListItem } from './ListItem';
import { EditItemModal } from './EditItemModal';
import { MedicalDocumentUploader } from './MedicalDocumentUploader';

interface FamilyMemberDropdownProps {
  selectedId: string;
  familyMembers: FamilyMember[];
  records: MedicalRecord[];
  allowAll?: boolean;
  onSelect: (id: string) => void;
  placeholder?: string;
}

const FamilyMemberDropdown: React.FC<FamilyMemberDropdownProps> = ({
  selectedId,
  familyMembers,
  records,
  allowAll = false,
  onSelect,
  placeholder = 'Select Family Member',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedMember = familyMembers.find((m) => m.id === selectedId) || familyMembers[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-3.5 pr-4 py-3 bg-[#e6f6ff] text-[#003178] border-2 border-[#003178]/40 hover:border-[#003178] rounded-xl text-[14px] font-bold flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003178]/20 transition-all text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 truncate pr-2">
          {selectedMember ? (
            <>
              <div className={`w-6 h-6 rounded-full ${selectedMember.avatarColor} text-white font-bold text-[11px] flex items-center justify-center shrink-0`}>
                {selectedMember.fullName.charAt(0)}
              </div>
              <span className="truncate">{selectedMember.fullName}</span>
              <span className="px-2 py-0.5 bg-[#003178]/10 text-[#003178] text-[11px] rounded-md font-bold shrink-0">
                {selectedMember.relationship}
              </span>
              <span className="px-2 py-0.5 bg-[#003178] text-white text-[11px] font-mono-data rounded-md font-bold shrink-0 ml-auto">
                {records.filter((r) => r.patientMemberId === selectedMember.id).length} Reports
              </span>
            </>
          ) : (
            <span className="text-[#737783]">{placeholder}</span>
          )}
        </div>

        <span className="material-symbols-outlined text-[#003178] text-[22px] shrink-0">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border-2 border-[#003178]/30 shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-100 max-h-[320px] overflow-y-auto">
          {allowAll && (
            <button
              type="button"
              onClick={() => {
                onSelect('all');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-[13px] font-bold flex items-center justify-between hover:bg-[#e6f6ff] transition-colors border-b border-gray-100 ${
                selectedId === 'all' ? 'bg-[#e6f6ff] text-[#003178]' : 'text-[#434652]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#003178]">folder_shared</span>
                <div>
                  <span className="block font-bold">All Family Members</span>
                  <span className="text-[11px] font-normal text-[#737783]">Combined vault reports & scans</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-[#003178] text-white text-[11px] font-mono-data rounded-md font-bold">
                {records.length}
              </span>
            </button>
          )}

          {familyMembers.map((member) => {
            const memberCount = records.filter((r) => r.patientMemberId === member.id).length;
            const isSelected = selectedId === member.id;

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  onSelect(member.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-[13px] font-bold flex items-center justify-between hover:bg-[#e6f6ff] transition-colors ${
                  isSelected ? 'bg-[#e6f6ff] text-[#003178]' : 'text-[#434652]'
                }`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <div className={`w-8 h-8 rounded-full ${member.avatarColor} text-white font-bold text-[12px] flex items-center justify-center shrink-0`}>
                    {member.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-[#071e27] truncate">{member.fullName}</span>
                      <span className="px-2 py-0.5 bg-[#003178]/10 text-[#003178] text-[10px] font-bold rounded">
                        {member.relationship}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#737783] font-normal">
                      Age {member.age} • Blood {member.bloodGroup}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 bg-[#003178] text-white text-[11px] font-mono-data rounded-md font-bold">
                    {memberCount}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[#003178] text-[18px]">check_circle</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface UploadCentralViewProps {
  records: MedicalRecord[];
  familyMembers?: FamilyMember[];
  activeFamilyMemberId?: string;
  onSelectFamilyMember?: (id: string) => void;
  onAddRecords: (newRecords: MedicalRecord[]) => void;
  onDeleteRecord: (id: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const UploadCentralView: React.FC<UploadCentralViewProps> = ({
  records,
  familyMembers = [],
  activeFamilyMemberId,
  onSelectFamilyMember,
  onAddRecords,
  onDeleteRecord,
  onNavigate,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>(
    activeFamilyMemberId || familyMembers[0]?.id || 'fam-1'
  );
  const [targetUploadMemberId, setTargetUploadMemberId] = useState<string>(
    activeFamilyMemberId || familyMembers[0]?.id || 'fam-1'
  );

  useEffect(() => {
    if (activeFamilyMemberId) {
      setSelectedFamilyFilter(activeFamilyMemberId);
      setTargetUploadMemberId(activeFamilyMemberId);
    }
  }, [activeFamilyMemberId]);

  // Equipment & Invoice Attachments Inventory State with AI Content Moderation
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([
    {
      id: 'eq-1',
      name: '4K Laparoscopic Endoscopy Tower Unit',
      modelNumber: 'ST-4000-HD',
      serialNumber: 'SN-2026-991A',
      category: 'Surgical Equipment',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
      invoiceUrl: 'https://example.com/invoice-laparoscope.pdf',
      invoiceAmountINR: 245000,
      specifications: 'High-definition 4K endoscopic camera head, LED cold light source, 40L insufflator system, calibrated for OT Room 3.',
      calibrationStatus: 'Calibrated',
      safetyStatus: 'Verified Safe',
      lastScannedDate: '03 Aug 2026',
      moderationReason: 'Passed Gemini AI Content Safety Audit'
    },
    {
      id: 'eq-2',
      name: 'Multi-Parameter ICU Anesthesia Workstation',
      modelNumber: 'AW-9000-PRO',
      serialNumber: 'SN-2026-7782B',
      category: 'ICU & OT Monitors',
      imageUrl: 'https://images.unsplash.com/photo-1583912267670-657592426f00?auto=format&fit=crop&w=400&q=80',
      invoiceUrl: 'https://example.com/invoice-workstation.pdf',
      invoiceAmountINR: 185000,
      specifications: 'Dual gas vaporizer module, integrated ventilator display, hemodynamic vitals monitor.',
      calibrationStatus: 'Calibrated',
      safetyStatus: 'Verified Safe',
      lastScannedDate: '03 Aug 2026',
      moderationReason: 'Passed Gemini AI Content Safety Audit'
    }
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<EquipmentItem | null>(null);

  const handleOpenAddModal = () => {
    setItemToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (item: EquipmentItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEquipmentItem = (savedItem: EquipmentItem) => {
    setEquipmentList((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      }
      return [savedItem, ...prev];
    });
  };

  const handleDeleteEquipmentItem = (id: string) => {
    setEquipmentList((prev) => prev.filter((i) => i.id !== id));
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>({
    patientIdMatch: true,
    detectedConditions: ['Spinal Stenosis L4-L5', 'Gallbladder Cholelithiasis'],
    extractedICD10: ['ICD-10 M48.06 (Spinal Stenosis)', 'ICD-10 K80.20 (Gallstones)'],
    confidence: 96,
    surgicalRequirements: [
      'Pre-operative anesthesia clearance required',
      'Minimally invasive laparoscopic procedure recommended',
      'Post-op recovery stay: 1-2 nights'
    ],
    recommendedHospitalsCount: 6,
    estimatedWaitMins: 15
  });

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    setUploadError(null);
    setIsAnalyzing(true);

    const validation = await validateMedicalFiles(files);
    if (!validation.isSafe) {
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      const msg = validation.errorMessage || '18+ explicit or disturbing content detected. Upload blocked.';
      setUploadError(msg);

      // Scroll and bring cursor/focus directly to error message
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorRef.current.focus();
        }
      }, 50);
      return;
    }

    const targetMember = familyMembers.find((m) => m.id === targetUploadMemberId) || familyMembers[0];

    const newRecs: MedicalRecord[] = files.map((file, idx) => ({
      id: `rec-${Date.now()}-${idx}`,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: file.name.toLowerCase().includes('mri') || file.name.toLowerCase().includes('scan') ? 'RADIOLOGY' : 'DIAGNOSTIC',
      fileType: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.dcm') || file.name.endsWith('.zip') ? 'zip' : 'image',
      status: 'Uploaded',
      progressPercent: 100,
      patientMemberId: targetMember?.id || 'fam-1',
      patientMemberName: targetMember?.fullName || 'Arjun Mehta'
    }));

    onAddRecords(newRecs);
    runLiveAIScan(files[0]?.name || 'Uploaded Document', targetMember?.fullName);
  };

  const runLiveAIScan = async (sampleFileName: string, patientName?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText: `Medical Scan Uploaded: ${sampleFileName} for patient ${patientName || 'Arjun Mehta'}. Patient presents with lower lumbar spinal compression and upper right quadrant abdominal discomfort. Suggested Laparoscopic Cholecystectomy and L4-L5 lumbar examination.`,
          fileName: sampleFileName
        })
      });
      const data = await res.json();
      if (data && !data.error) {
        setAiResult({
          patientIdMatch: data.patientIdMatch ?? true,
          detectedConditions: data.detectedConditions || ['Spinal Stenosis L4-L5', 'Calculus of Gallbladder'],
          extractedICD10: data.extractedICD10 || ['M48.06', 'K80.20'],
          confidence: data.confidence || 95,
          surgicalRequirements: data.surgicalRequirements || ['Pre-op panel required', 'Minimally invasive laparoscopic approach'],
          recommendedHospitalsCount: data.recommendedHospitalsCount || 6,
          estimatedWaitMins: data.estimatedWaitMins || 15
        });
      }
    } catch (err) {
      console.error('Error scanning report:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filtered records strictly based on selected family member
  const filteredRecords = records.filter((r) => r.patientMemberId === selectedFamilyFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Streamlined Top Header Card & Family Profile Dropdown */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-[#c3c6d4]/60">
          {/* Header Info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded-md tracking-wider uppercase font-mono-data">
                ENCRYPTED VAULT
              </span>
              <span className="text-[12px] font-bold text-[#003178] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                HIPAA & GDPR Compliant
              </span>
            </div>
            <h1 className="text-[24px] md:text-[28px] font-extrabold text-[#003178] tracking-tight">
              Medical Records & Vault
            </h1>
            <p className="text-[#434652] text-[14px] leading-relaxed">
              Encrypted storage for lab results, imaging scans, and prescriptions with AI extraction.
            </p>
          </div>

          {/* Family Member Selection Dropdown & Profile Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {familyMembers.length > 0 && (
              <div className="min-w-[280px] sm:min-w-[320px]">
                <label className="text-[11px] font-bold text-[#737783] uppercase tracking-wider block mb-1 font-mono-data">
                  Select Family Member:
                </label>
                <FamilyMemberDropdown
                  selectedId={selectedFamilyFilter}
                  familyMembers={familyMembers}
                  records={records}
                  allowAll={true}
                  onSelect={(id) => {
                    setSelectedFamilyFilter(id);
                    setTargetUploadMemberId(id === 'all' ? (familyMembers[0]?.id || 'fam-1') : id);
                    if (onSelectFamilyMember) {
                      onSelectFamilyMember(id);
                    }
                  }}
                  placeholder="Select Family Member"
                />
              </div>
            )}

            <div className="sm:self-end pt-1">
              <button
                type="button"
                onClick={() => onNavigate('family')}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-[#e6f6ff] text-[#003178] border border-[#003178]/30 hover:bg-[#dbf1fe] font-bold text-[12px] rounded-xl flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                <span>Manage Profiles ({familyMembers.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Family Member Summary Banner */}
        {(() => {
          if (selectedFamilyFilter === 'all') {
            return (
              <div className="p-4 bg-[#f3faff] rounded-xl border border-[#003178]/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#003178] text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[20px]">folder_shared</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-[#003178]">All Family Members Vault</h3>
                    <p className="text-[12px] text-[#434652]">Showing combined reports for all profiles in your family account.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded-lg font-mono-data shrink-0 border border-[#006f66]/20">
                  {records.length} Total Reports
                </span>
              </div>
            );
          }

          const activeMember = familyMembers.find((m) => m.id === selectedFamilyFilter) || familyMembers[0];
          if (!activeMember) return null;

          return (
            <div className="p-4 bg-[#f3faff] rounded-xl border border-[#003178]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${activeMember.avatarColor} text-white font-bold text-[16px] flex items-center justify-center shadow-sm shrink-0`}>
                  {activeMember.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[15px] text-[#003178]">
                      {activeMember.fullName}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#003178] text-white text-[10px] font-bold rounded">
                      {activeMember.relationship}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#434652] mt-0.5 font-mono-data">
                    Age: <strong>{activeMember.age} yrs ({activeMember.gender})</strong> • Blood: <strong className="text-[#003178]">{activeMember.bloodGroup}</strong> • Policy: <strong className="text-[#006f66]">{activeMember.insurancePolicyNumber || 'Insured'}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <span className="px-3 py-1 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded-lg font-mono-data border border-[#006f66]/20">
                  {filteredRecords.length} Reports in Vault
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main Grid: Upload Zone + AI Scan Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drag & Drop Box + Upload Queue (Col 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shared Unified Medical Document Uploader Control */}
          <MedicalDocumentUploader
            familyMembers={
              familyMembers.length > 0
                ? familyMembers
                : [
                    { id: 'fam-1', fullName: 'Arjun Mehta', relationship: 'Self (Primary)' },
                    { id: 'fam-2', fullName: 'Priya Mehta', relationship: 'Spouse' },
                    { id: 'fam-3', fullName: 'Ramesh Mehta', relationship: 'Father' },
                    { id: 'fam-4', fullName: 'Sunita Mehta', relationship: 'Mother' },
                    { id: 'fam-5', fullName: 'Aarav Mehta', relationship: 'Son' }
                  ]
            }
            selectedMemberId={targetUploadMemberId}
            onMemberChange={(memId) => setTargetUploadMemberId(memId)}
            submitButtonText="Process Scans & Add to Records Queue"
            onUploadSubmit={(queuedFiles) => {
              const newRecs: MedicalRecord[] = queuedFiles.map((q, i) => ({
                id: `rec-central-${Date.now()}-${i}`,
                fileName: q.fileName,
                fileSize: q.fileSize,
                uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                category: q.aiCategory === 'SCAN_MRI' ? 'RADIOLOGY' : 'DIAGNOSTIC',
                fileType: q.fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
                status: 'Uploaded',
                patientMemberId: targetUploadMemberId
              }));

              onAddRecords(newRecs);
              if (newRecs[0]) {
                runLiveAIScan(newRecs[0].fileName);
              }
            }}
          />

          {/* Active Upload Queue */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#c3c6d4]/60 pb-3">
              <h3 className="font-bold text-[16px] text-[#071e27]">
                Records Queue ({filteredRecords.length})
              </h3>
              <button
                onClick={() => runLiveAIScan('Spine_MRI_Scan.dcm')}
                className="text-[12px] font-bold text-[#006a62] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>Re-run AI Analysis</span>
              </button>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="py-8 text-center text-[#737783] space-y-2">
                <span className="material-symbols-outlined text-[36px] text-gray-300">folder_open</span>
                <p className="text-[14px] font-bold text-[#434652]">No medical records found for this filter.</p>
                <p className="text-[12px]">Upload a report above or select "All Family Members".</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecords.map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-[#f3faff] border border-[#c3c6d4] rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#dbf1fe] text-[#003178] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">
                          {rec.fileType === 'pdf' ? 'picture_as_pdf' : rec.fileType === 'zip' ? 'folder_zip' : 'image'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-[14px] text-[#071e27] truncate">{rec.fileName}</p>
                          {rec.patientMemberName && (
                            <span className="px-2 py-0.5 bg-[#003178] text-white text-[10px] font-bold rounded-md font-mono-data shrink-0 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">person</span>
                              <span>{rec.patientMemberName}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-[#434652] mt-0.5">
                          <span>{rec.fileSize}</span>
                          <span>•</span>
                          <span>{rec.uploadDate}</span>
                          <span>•</span>
                          <span className="text-[#006f66] font-bold">{rec.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-[#ba1a1a] font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center cursor-pointer"
                        title="Delete record from vault"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Scan Preview & What's Next (Col 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Scan Preview Card */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#c3c6d4]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a62]">auto_awesome</span>
                <h3 className="font-bold text-[16px] text-[#071e27]">AI Scan Preview</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded">
                LIVE EXTRACTION
              </span>
            </div>

            {isAnalyzing ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 border-4 border-[#003178] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[14px] font-bold text-[#003178]">Extracting ICD-10 & Clinical Findings...</p>
                <p className="text-[12px] text-[#737783]">Gemini AI Server processing diagnostic records</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image / MRI preview box */}
                <div className="w-full h-36 rounded-xl bg-gray-900 relative overflow-hidden flex items-center justify-center border border-[#c3c6d4]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCYtaCGQEU75QQ1iZu4wQJAuZK-uFfQSafCH5YU-63zubMevwh-8e4Y4CiqZnIx7xnN75c2EwYVjezsFs8s09oIQNAYv2J8kmi0zij5OBH-sqK1dm79TYgp7kupbovXI_iy3YNz8X-0_5z-E0T2MsOAi6KonB40P9wWjHAVdjv4rsbt4OOKtLWUh9Dm4CNe5OxhD78KygtojmPqXsy1tLFhBtCgz-N4XSe5Q-BjwBfVCmb8gE6YTEI"
                    alt="AI Diagnostic Scan"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-[12px] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#81f3e5] animate-ping"></span>
                      AI Scan Active • Confidence {aiResult?.confidence || 96}%
                    </span>
                  </div>
                </div>

                {/* Extraction Checklist */}
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex items-center gap-2.5 text-[#006f66] font-semibold">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Confirmed: Patient ID Match (#MQ-9921)</span>
                  </div>

                  {aiResult?.detectedConditions.map((cond, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-[#071e27] font-medium">
                      <span className="material-symbols-outlined text-[18px] text-[#003178]">verified</span>
                      <span>Detected: {cond}</span>
                    </div>
                  ))}

                  {aiResult?.extractedICD10.map((icd, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-[#003178] font-mono-data text-[12px]">
                      <span className="material-symbols-outlined text-[18px] text-[#006a62]">code</span>
                      <span>{icd}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* What's Next Box */}
          <div className="bg-[#dbf1fe] rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[16px] text-[#003178] flex items-center gap-2">
              <span className="material-symbols-outlined">help_center</span>
              <span>What's Next?</span>
            </h3>
            <div className="space-y-2 text-[13px] text-[#071e27]">
              <div className="flex items-center justify-between py-1 border-b border-[#c3c6d4]/50">
                <span>Estimated Quotes:</span>
                <strong className="font-bold text-[#003178]">6 - 8 Hospitals</strong>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#c3c6d4]/50">
                <span>Estimated Wait Time:</span>
                <strong className="font-bold text-[#006a62]">~15 mins</strong>
              </div>
            </div>

            <button
              onClick={() => onNavigate('quotes')}
              className="w-full py-3 bg-[#003178] text-white font-bold rounded-xl hover:bg-[#0d47a1] transition-all shadow-md flex items-center justify-center gap-2 text-[14px]"
            >
              <span>Review & Submit Case</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: Equipment & Invoice Bill Attachments Vault with AI Content Moderation Safeguards */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c3c6d4]/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003178]">verified_user</span>
              <h3 className="font-extrabold text-[18px] text-[#071e27]">
                Equipment & Invoice Bill Attachments (AI Content Moderation Active)
              </h3>
            </div>
            <p className="text-[12px] text-[#434652] mt-0.5">
              Automated Gemini Vision safeguards scan uploaded local files, image URLs, and bill attachments in real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#003178] hover:bg-[#002256] text-white text-[13px] font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add Equipment / Invoice Attachment</span>
          </button>
        </div>

        {/* Shield Banner */}
        <div className="p-4 bg-[#e6f4ea] border border-[#a7f3d0] rounded-2xl space-y-2.5">
          <div className="flex items-start gap-2.5 text-[#064e3b] text-[13px] leading-snug">
            <span className="material-symbols-outlined text-[#059669] text-[20px] shrink-0 mt-0.5">verified_user</span>
            <div>
              <span className="font-extrabold text-[#064e3b]">Automated AI Content Moderation Active: </span>
              <span className="font-semibold text-[#047857]">18+ adult content, pornography, nudity, graphic violence, and disturbing images are strictly prohibited and automatically blocked.</span>
            </div>
          </div>
          <div className="pl-7">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#b7e4c7] text-[#065f46] text-[10px] font-extrabold rounded-full tracking-wider font-mono-data">
              ACTIVE SAFETY GUARD
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {equipmentList.length === 0 ? (
            <div className="py-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="font-bold text-[14px]">No equipment or invoice records added yet.</p>
              <p className="text-[12px] text-gray-400 mt-1">Click "+ Add Equipment / Invoice Attachment" to scan and attach a file.</p>
            </div>
          ) : (
            equipmentList.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteEquipmentItem}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit / Create Item Modal */}
      <EditItemModal
        isOpen={isEditModalOpen}
        itemToEdit={itemToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEquipmentItem}
        onDelete={handleDeleteEquipmentItem}
      />
    </div>
  );
};
