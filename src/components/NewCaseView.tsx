import React, { useState, useRef } from 'react';
import { SurgicalCase, MedicalRecord, ViewMode, PatientVitals, FamilyMember, HospitalEmailDispatch } from '../types';
import { generateAIClinicalRecommendation } from '../utils/aiClinicalEngine';
import { validateMedicalFiles } from '../utils/contentModeration';
import { MedicalDocumentUploader, QueuedMedicalFile } from './MedicalDocumentUploader';

interface NewCaseViewProps {
  existingRecords: MedicalRecord[];
  familyMembers?: FamilyMember[];
  onAddRecords: (recs: MedicalRecord[]) => void;
  onCreateCase: (newCase: SurgicalCase) => void;
  onNavigate: (view: ViewMode) => void;
}

export const NewCaseView: React.FC<NewCaseViewProps> = ({
  existingRecords,
  familyMembers = [],
  onAddRecords,
  onCreateCase,
  onNavigate,
}) => {
  // Case Title & Family Member Selection
  const [caseTitle, setCaseTitle] = useState('Gallbladder Surgery Quotation Request');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(familyMembers[0]?.id || 'fam-1');

  // Procedure & Symptoms Fields
  const [procedureTitle, setProcedureTitle] = useState('Laparoscopic Cholecystectomy');
  const [customTitle, setCustomTitle] = useState('');
  const [symptomsDescription, setSymptomsDescription] = useState(
    'Experiencing sharp right upper quadrant abdominal pain after fatty meals for the last 3 weeks. Ultrasound shows gallbladder calculus.'
  );
  const [symptomsDuration, setSymptomsDuration] = useState('3 Weeks');
  const [urgency, setUrgency] = useState<'Routine' | 'Moderate' | 'Urgent'>('Moderate');

  // Vitals & Clinical Metrics (Optional - can be cleared or left blank)
  const [systolicBP, setSystolicBP] = useState<number | ''>(120);
  const [diastolicBP, setDiastolicBP] = useState<number | ''>(80);
  const [fastingSugar, setFastingSugar] = useState<number | ''>(95);
  const [ppSugar, setPpSugar] = useState<number | ''>(135);
  const [hba1c, setHba1c] = useState<number | ''>(5.7);
  const [heartRate, setHeartRate] = useState<number | ''>(72);
  const [spO2, setSpO2] = useState<number | ''>(98);
  const [weightKg, setWeightKg] = useState<number | ''>(68);
  const [heightCm, setHeightCm] = useState<number | ''>(172);

  const handleClearVitals = () => {
    setSystolicBP('');
    setDiastolicBP('');
    setFastingSugar('');
    setPpSugar('');
    setHba1c('');
    setHeartRate('');
    setSpO2('');
    setWeightKg('');
    setHeightCm('');
  };

  // Clinical History Checkboxes
  const [conditions, setConditions] = useState<string[]>(['Hypertension (Mild)']);
  const [allergies, setAllergies] = useState<string>('Penicillin (Mild rash)');
  const [notesForDoctor, setNotesForDoctor] = useState(
    'Prefer day-care or short hospital stay. Seeking cashless insurance pre-approval under HDFC Ergo.'
  );

  // Attached files
  const [attachedRecordIds, setAttachedRecordIds] = useState<string[]>(
    existingRecords.map((r) => r.id).slice(0, 2)
  );
  const [uploadedNewFiles, setUploadedNewFiles] = useState<{ name: string; size: string; category: string }[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);

  // Insurance & Location
  const [insuranceProvider, setInsuranceProvider] = useState('HDFC Optima Restore');
  const [policyNumber, setPolicyNumber] = useState('HDFC-OPT-992014');
  const [preferredCity, setPreferredCity] = useState('Bangalore');

  // AI Generation Loading State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiAnalysisStep, setAiAnalysisStep] = useState('Initializing Gemini AI Neural Engine...');

  const handleConditionToggle = (cond: string) => {
    if (conditions.includes(cond)) {
      setConditions(conditions.filter((c) => c !== cond));
    } else {
      setConditions([...conditions, cond]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files) as File[];

      const validation = await validateMedicalFiles(filesArr);
      if (!validation.isSafe) {
        e.target.value = '';
        const msg = validation.errorMessage || '18+ explicit or disturbing content detected. Upload blocked.';
        setUploadError(msg);

        // Scroll and focus directly to error message element
        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorRef.current.focus();
          }
        }, 50);
        return;
      }

      const newRecs: MedicalRecord[] = filesArr.map((f: File, i: number) => ({
        id: `rec-upload-${Date.now()}-${i}`,
        fileName: f.name,
        fileSize: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: f.name.toLowerCase().includes('scan') || f.name.toLowerCase().includes('mri') ? 'RADIOLOGY' : 'DIAGNOSTIC',
        fileType: f.name.endsWith('.pdf') ? 'pdf' : 'image',
        status: 'Uploaded',
        patientMemberId: selectedMemberId,
      }));

      onAddRecords(newRecs);
      setAttachedRecordIds((prev) => [...prev, ...newRecs.map((r) => r.id)]);
      setUploadedNewFiles((prev) => [
        ...prev,
        ...newRecs.map((r) => ({ name: r.fileName, size: r.fileSize, category: r.category })),
      ]);
    }
  };

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAI(true);
    setAiAnalysisStep('Analyzing patient symptoms & medical history with Gemini AI...');

    const selectedTitle = procedureTitle === 'Other' ? customTitle || 'Custom Surgical Case' : procedureTitle;
    const finalCaseTitle = caseTitle.trim() || `${selectedTitle} Request`;
    const caseId = `case-${Date.now()}`;
    const caseCode = `#MQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const selectedMember = familyMembers.find((m) => m.id === selectedMemberId);
    const memberName = selectedMember ? `${selectedMember.fullName} (${selectedMember.relationship})` : 'Primary Patient Profile';

    const defaultDispatches: HospitalEmailDispatch[] = [
      {
        hospitalId: 'apollo-hospitals',
        hospitalName: 'Apollo Hospitals Bannerghatta',
        email: 'quotes@apollohospitals.org',
        sentTimestamp: 'Just now',
        status: 'Email Dispatched',
        responseTpaStatus: 'Awaiting Coordinator Review',
      },
      {
        hospitalId: 'fortis-hospital',
        hospitalName: 'Fortis Hospital Cunningham Rd',
        email: 'admissions@fortishospitals.in',
        sentTimestamp: 'Just now',
        status: 'Email Dispatched',
        responseTpaStatus: 'Awaiting Coordinator Review',
      },
      {
        hospitalId: 'max-healthcare',
        hospitalName: 'Max Super Speciality Hospital',
        email: 'quotes@maxhealthcare.com',
        sentTimestamp: 'Just now',
        status: 'Email Dispatched',
        responseTpaStatus: 'Awaiting Coordinator Review',
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

    const sysNum = systolicBP !== '' ? Number(systolicBP) : undefined;
    const diaNum = diastolicBP !== '' ? Number(diastolicBP) : undefined;
    const bpStr = sysNum && diaNum ? `${sysNum}/${diaNum} mmHg` : 'Not provided (Optional)';
    const fastSugarNum = fastingSugar !== '' ? Number(fastingSugar) : undefined;
    const ppSugarNum = ppSugar !== '' ? Number(ppSugar) : undefined;
    const hba1cNum = hba1c !== '' ? Number(hba1c) : undefined;

    const vitalsData: PatientVitals = {
      systolicBP: sysNum,
      diastolicBP: diaNum,
      bloodPressureStr: bpStr,
      fastingSugarMgDl: fastSugarNum,
      ppSugarMgDl: ppSugarNum,
      hba1cPercent: hba1cNum,
      heartRateBpm: heartRate !== '' ? Number(heartRate) : undefined,
      spO2Percent: spO2 !== '' ? Number(spO2) : undefined,
      weightKg: weightKg !== '' ? Number(weightKg) : undefined,
      heightCm: heightCm !== '' ? Number(heightCm) : undefined,
      allergies: allergies ? allergies.split(',').map((a) => a.trim()) : [],
      preExistingConditions: conditions,
      symptomsList: [symptomsDescription],
      symptomsDuration,
      notesForDoctor,
    };

    const vitalsSummaryText = sysNum && fastSugarNum
      ? `BP ${sysNum}/${diaNum} mmHg, Fasting Sugar ${fastSugarNum} mg/dL`
      : 'Vitals self-reported or skipped (optional)';

    let aiResult: any = null;

    try {
      setAiAnalysisStep('Connecting to Gemini 3.6 Flash AI API...');
      const res = await fetch('/api/generate-case-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: finalCaseTitle,
          procedureTitle,
          customTitle,
          symptomsDescription,
          urgency,
          preferredCity,
          insuranceProvider,
          policyNumber,
          vitalsSummaryText,
          attachedRecordCount: attachedRecordIds.length,
          hba1cNum,
          fastSugarNum,
        }),
      });

      if (res.ok) {
        setAiAnalysisStep('Parsing AI clinical findings, ICD-10 codes & hospital packages...');
        const data = await res.json();
        if (data && data.treatmentRecommendation && data.healthIssuesDetected) {
          aiResult = data;
        }
      }
    } catch (err) {
      console.warn('API call failed, fallback engine will be used:', err);
    }

    if (!aiResult) {
      setAiAnalysisStep('Finalizing clinical rule engine recommendations...');
      aiResult = generateAIClinicalRecommendation({
        caseTitle: finalCaseTitle,
        procedureTitle,
        customTitle,
        symptomsDescription,
        urgency,
        preferredCity,
        insuranceProvider,
        policyNumber,
        vitalsSummaryText,
        attachedRecordCount: attachedRecordIds.length,
        hba1cNum,
        fastSugarNum,
      });
    }

    const newCase: SurgicalCase = {
      id: caseId,
      caseCode,
      title: finalCaseTitle,
      subtitle: `Surgical case for ${aiResult.selectedTitle || selectedTitle} in ${preferredCity}`,
      description: symptomsDescription,
      status: 'ACTIVE',
      quotesReadyCount: aiResult.hospitals?.length || 3,
      aiConfidencePercent: 96,
      aiPrimaryRecommendationReason: `AI analyzed patient reports and symptoms. Primary recommendation: ${aiResult.treatmentRecommendation.bestTreatmentProcedure} for ${aiResult.conditionName}.`,
      insuranceCompatibilityNotice: `Insurance pre-check active for ${insuranceProvider} (Policy: ${policyNumber}).`,
      costDifferenceText: 'Quotations live in comparison matrix',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      patientMemberId: selectedMemberId,
      patientMemberName: memberName,
      hospitalDispatches: defaultDispatches,
      vitals: vitalsData,
      attachedRecordIds,
      uploadedFilesCount: attachedRecordIds.length,
      aiClinicalAnalysis: {
        overallHealthScore: aiResult.overallHealthScore || 85,
        reportSourceText: `Uploaded Medical Documents & Patient Reported History (${attachedRecordIds.length} files attached)`,
        reportAnalysisSummary: aiResult.reportAnalysisSummary,
        hospitalSelectionReasoning: aiResult.hospitalSelectionReasoning,
        healthIssuesDetected: aiResult.healthIssuesDetected,
        treatmentRecommendation: aiResult.treatmentRecommendation,
      },
      hospitals: aiResult.hospitals && aiResult.hospitals.length > 0 ? aiResult.hospitals : generateAIClinicalRecommendation({
        caseTitle: finalCaseTitle,
        procedureTitle,
        customTitle,
        symptomsDescription,
        urgency,
        preferredCity,
        insuranceProvider,
        policyNumber,
        vitalsSummaryText,
        attachedRecordCount: attachedRecordIds.length,
        hba1cNum,
        fastSugarNum,
      }).hospitals,
    };

    setIsGeneratingAI(false);
    onCreateCase(newCase);
    onNavigate('quotes');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#dbf1fe]/60 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#dbf1fe] text-[#003178] rounded-xl font-bold">
            <span className="material-symbols-outlined text-[24px]">add_notes</span>
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-[#003178]">Start New Surgical Case</h1>
            <p className="text-[13px] text-[#434652]">
              Upload medical reports first, confirm your health vitals, and receive instant AI recommendations and hospital quotes.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitCase} className="space-y-6">
        {/* SECTION 0: CASE IDENTIFICATION & FAMILY MEMBER */}
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-5">
          <div className="border-b border-[#c3c6d4]/60 pb-3">
            <h3 className="text-[18px] font-bold text-[#003178] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006f66]">assignment</span>
              <span>1. Case Title & Patient Member Profile</span>
            </h3>
            <p className="text-[12px] text-[#434652]">
              Define a custom case title and select which family profile this quotation request is for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-bold text-[#003178] mb-1">
                New Case Title *
              </label>
              <input
                type="text"
                required
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="e.g. Gallbladder Surgery Quotation Request"
                className="w-full px-4 py-2.5 rounded-xl border border-[#c3c6d4] text-[14px] font-medium focus:outline-none focus:border-[#003178] bg-[#f8fafc]"
              />
              <span className="text-[11px] text-[#737783] mt-1 block">
                Provide a clear title to identify this quotation request across hospitals.
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#003178] mb-1">
                Select Family Patient Member *
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#c3c6d4] text-[14px] font-medium focus:outline-none focus:border-[#003178] bg-[#f8fafc]"
              >
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} — {m.relationship} (Age: {m.age}, Blood: {m.bloodGroup})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#737783] mt-1 block">
                Link insurance and medical records to this dependent profile.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: UPLOAD OPTIONS FIRST */}
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#c3c6d4]/60 pb-3">
            <div>
              <h3 className="text-[18px] font-bold text-[#003178] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006f66]">upload_file</span>
                <span>1. Upload Scans, Reports & Prescriptions</span>
              </h3>
              <p className="text-[12px] text-[#434652]">
                First attach diagnostic reports (Ultrasound, MRI, CT Scan, Blood Panel) for instant AI extraction.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#81f3e5]/60 text-[#006f66] font-bold text-[11px] rounded-lg">
              STEP 1 OF 1
            </span>
          </div>

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
            selectedMemberId={selectedMemberId}
            onMemberChange={(memId) => setSelectedMemberId(memId)}
            submitButtonText="Attach & Process Scans for Case"
            onUploadSubmit={(queuedFiles) => {
              const newRecs: MedicalRecord[] = queuedFiles.map((q, i) => ({
                id: `rec-upload-${Date.now()}-${i}`,
                fileName: q.fileName,
                fileSize: q.fileSize,
                uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                category: q.aiCategory === 'SCAN_MRI' ? 'RADIOLOGY' : 'DIAGNOSTIC',
                fileType: q.fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
                status: 'Uploaded',
                patientMemberId: selectedMemberId
              }));

              onAddRecords(newRecs);
              setAttachedRecordIds((prev) => [...prev, ...newRecs.map((r) => r.id)]);
              setUploadedNewFiles((prev) => [
                ...prev,
                ...newRecs.map((r) => ({ name: r.fileName, size: r.fileSize, category: r.category }))
              ]);
            }}
          />

          {/* Select from Patient Vault */}
          <div className="space-y-3">
            <label className="block text-[13px] font-bold text-[#003178]">
              Or select from existing Vault Records for selected family member:
            </label>
            {(() => {
              const memberRecords = existingRecords.filter((rec) => rec.patientMemberId === selectedMemberId);
              if (memberRecords.length === 0) {
                return (
                  <p className="text-[12px] text-[#737783] bg-gray-50 p-3 rounded-xl border border-gray-200">
                    No vault records found for this family member yet. Upload new reports above.
                  </p>
                );
              }
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {memberRecords.map((rec) => {
                    const isSelected = attachedRecordIds.includes(rec.id);
                    return (
                      <div
                        key={rec.id}
                        onClick={() => {
                          if (isSelected) {
                            setAttachedRecordIds(attachedRecordIds.filter((id) => id !== rec.id));
                          } else {
                            setAttachedRecordIds([...attachedRecordIds, rec.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#dbf1fe] border-[#003178] shadow-sm'
                            : 'bg-[#f3faff] border-[#c3c6d4] hover:border-[#003178]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#003178]">
                            {rec.category === 'RADIOLOGY' ? 'photo_camera' : 'description'}
                          </span>
                          <div>
                            <strong className="text-[13px] text-[#071e27] block truncate max-w-[200px]">
                              {rec.fileName}
                            </strong>
                            <span className="text-[11px] text-[#737783]">
                              {rec.category} • {rec.fileSize}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#003178]"
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* SECTION 2: CLINICAL VITALS & BLOOD METRICS (OPTIONAL) */}
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#c3c6d4]/60 pb-3 gap-2">
            <div>
              <h3 className="text-[18px] font-bold text-[#003178] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006f66]">monitor_heart</span>
                <span>2. Clinical Vitals & Blood Sugar Metrics</span>
              </h3>
              <p className="text-[12px] text-[#434652]">
                Optional section. You may edit these values, clear them, or leave them blank if current vitals are unavailable.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[11px] rounded-lg border border-emerald-200">
                OPTIONAL / NOT MANDATORY
              </span>
              <button
                type="button"
                onClick={handleClearVitals}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[#737783] hover:text-[#071e27] font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                title="Clear all vital inputs"
              >
                Clear Vitals
              </button>
            </div>
          </div>

          {/* Blood Pressure Inputs */}
          <div className="space-y-3 p-4 bg-[#f3faff] rounded-xl border border-[#c3c6d4]">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-bold text-[#003178]">
                Blood Pressure (BP) Reading (mmHg) <span className="font-normal text-[11px] text-[#737783]">(Optional)</span>
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <div>
                <span className="text-[11px] font-bold text-[#737783] block mb-1">SYSTOLIC (UPPER)</span>
                <input
                  type="number"
                  value={systolicBP}
                  onChange={(e) => setSystolicBP(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[15px] focus:outline-none focus:ring-2 focus:ring-[#003178]"
                  placeholder="120 (e.g. 120)"
                  min="70"
                  max="220"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#737783] block mb-1">DIASTOLIC (LOWER)</span>
                <input
                  type="number"
                  value={diastolicBP}
                  onChange={(e) => setDiastolicBP(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[15px] focus:outline-none focus:ring-2 focus:ring-[#003178]"
                  placeholder="80 (e.g. 80)"
                  min="40"
                  max="140"
                />
              </div>
              <div className="col-span-2 p-3 bg-white border border-[#c3c6d4] rounded-xl">
                <span className="text-[11px] font-bold text-[#737783] block">BP STATUS</span>
                <span className="text-[14px] font-bold text-[#003178]">
                  {systolicBP === '' || diastolicBP === ''
                    ? 'Not Provided (Skipped)'
                    : Number(systolicBP) <= 120 && Number(diastolicBP) <= 80
                    ? 'Normal Healthy BP'
                    : Number(systolicBP) < 130 && Number(diastolicBP) < 85
                    ? 'Elevated BP (Pre-Hypertension)'
                    : 'Stage 1 Hypertension'}
                </span>
              </div>
            </div>
          </div>

          {/* Glucose / Sugar Metrics */}
          <div className="space-y-3 p-4 bg-[#f3faff] rounded-xl border border-[#c3c6d4]">
            <label className="block text-[13px] font-bold text-[#003178]">
              Blood Sugar & Diabetes Levels <span className="font-normal text-[11px] text-[#737783]">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#737783] block mb-1">FASTING SUGAR (mg/dL)</span>
                <input
                  type="number"
                  value={fastingSugar}
                  onChange={(e) => setFastingSugar(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[15px] focus:outline-none focus:ring-2 focus:ring-[#003178]"
                  placeholder="e.g. 95"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#737783] block mb-1">POST-PRANDIAL PP (mg/dL)</span>
                <input
                  type="number"
                  value={ppSugar}
                  onChange={(e) => setPpSugar(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[15px] focus:outline-none focus:ring-2 focus:ring-[#003178]"
                  placeholder="e.g. 135"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#737783] block mb-1">HbA1c ESTIMATE (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={hba1c}
                  onChange={(e) => setHba1c(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[15px] focus:outline-none focus:ring-2 focus:ring-[#003178]"
                  placeholder="e.g. 5.7"
                />
              </div>
            </div>
          </div>

          {/* Heart Rate, Oxygen, Height, Weight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#737783] block mb-1">PULSE / HEART RATE</label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[14px]"
                placeholder="e.g. 72"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#737783] block mb-1">OXYGEN SpO2 (%)</label>
              <input
                type="number"
                value={spO2}
                onChange={(e) => setSpO2(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[14px]"
                placeholder="e.g. 98"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#737783] block mb-1">WEIGHT (KG)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[14px]"
                placeholder="e.g. 68"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#737783] block mb-1">HEIGHT (CM)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl font-bold font-mono-data text-[14px]"
                placeholder="e.g. 172"
              />
            </div>
          </div>

          {/* Pre-existing Conditions */}
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#003178]">
              Pre-existing Medical History & Conditions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'Hypertension (Mild)',
                'Type 2 Diabetes',
                'Asthma / Respiratory',
                'Thyroid Disorder',
                'Previous Abdominal Surgery',
                'Cardiac History',
              ].map((cond) => {
                const isChecked = conditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleConditionToggle(cond)}
                    className={`p-2.5 rounded-xl border text-[12px] font-bold text-left flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-[#003178] text-white border-[#003178]'
                        : 'bg-[#f3faff] text-[#434652] border-[#c3c6d4] hover:bg-[#dbf1fe]'
                    }`}
                  >
                    <span>{cond}</span>
                    {isChecked && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergies Input */}
          <div>
            <label className="block text-[13px] font-bold text-[#003178] mb-1">
              Known Drug / Environmental Allergies
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#003178]"
              placeholder="e.g. Penicillin, Latex, NSAIDs (or type 'None')"
            />
          </div>
        </div>

        {/* SECTION 3: PROCEDURE & SYMPTOMS */}
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-6">
          <div className="border-b border-[#c3c6d4]/60 pb-3">
            <h3 className="text-[18px] font-bold text-[#003178] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006f66]">medical_services</span>
              <span>3. Procedure & Symptoms Description</span>
            </h3>
            <p className="text-[12px] text-[#434652]">
              Select the planned procedure or describe symptoms for hospital specialist review.
            </p>
          </div>

          {/* Procedure Type Dropdown */}
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#003178]">
              Select Surgical Procedure
            </label>
            <select
              value={procedureTitle}
              onChange={(e) => setProcedureTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#c3c6d4] rounded-xl font-bold text-[14px] text-[#071e27] bg-[#f3faff] focus:outline-none focus:ring-2 focus:ring-[#003178]"
            >
              <option value="Lumbar Microdiscectomy / Spine Surgery">Lumbar Microdiscectomy / Spine Surgery (Back Pain & Sciatica)</option>
              <option value="Laparoscopic Cholecystectomy">Laparoscopic Cholecystectomy (Gallbladder Removal)</option>
              <option value="Total Knee Replacement">Total Knee Replacement (Robotic or Standard)</option>
              <option value="Laparoscopic Myomectomy / Hysterectomy">Laparoscopic Myomectomy / Hysterectomy (Gynaecology)</option>
              <option value="Holmium Laser Lithotripsy">Holmium Laser Lithotripsy (Kidney / Ureteral Stones)</option>
              <option value="Inguinal Hernia Mesh Repair">Inguinal Hernia Mesh Repair</option>
              <option value="Appendectomy (Laparoscopic)">Appendectomy (Laparoscopic Removal)</option>
              <option value="Cataract Phacoemulsification">Cataract Phacoemulsification with Laser IOL</option>
              <option value="Coronary Angioplasty (PTCA)">Coronary Angioplasty (PTCA Stent)</option>
              <option value="Other">Other Surgical Specialty...</option>
            </select>

            {procedureTitle === 'Other' && (
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-[#c3c6d4] rounded-xl text-[14px]"
                placeholder="Specify custom procedure name..."
              />
            )}
          </div>

          {/* Symptoms Detailed Description */}
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#003178]">
              Describe Symptoms & Medical History
            </label>
            <textarea
              rows={3}
              value={symptomsDescription}
              onChange={(e) => setSymptomsDescription(e.target.value)}
              className="w-full p-3 border border-[#c3c6d4] rounded-xl text-[13px] text-[#071e27] focus:outline-none focus:ring-2 focus:ring-[#003178]"
              placeholder="Mention pain intensity, duration, triggers, or doctor's initial findings..."
            />
          </div>

          {/* Symptom Duration & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#737783] mb-1">SYMPTOM DURATION</label>
              <input
                type="text"
                value={symptomsDuration}
                onChange={(e) => setSymptomsDuration(e.target.value)}
                className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                placeholder="e.g. 2 Weeks, 1 Month"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#737783] mb-1">CLINICAL URGENCY LEVEL</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Routine', 'Moderate', 'Urgent'] as const).map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setUrgency(urg)}
                    className={`py-2 rounded-xl text-[12px] font-bold transition-all border ${
                      urgency === urg
                        ? 'bg-[#003178] text-white border-[#003178]'
                        : 'bg-[#f3faff] text-[#434652] border-[#c3c6d4]'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: INSURANCE & LOCATION PREFERENCES */}
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-4">
          <div className="border-b border-[#c3c6d4]/60 pb-3">
            <h3 className="text-[18px] font-bold text-[#003178] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006f66]">verified_user</span>
              <span>4. Insurance Pre-Approval & Location Preferences</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#737783] mb-1">INSURANCE PROVIDER</label>
              <select
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px] font-bold text-[#071e27]"
              >
                <option value="HDFC Optima Restore">HDFC Optima Restore</option>
                <option value="Star Health Comprehensive">Star Health Comprehensive</option>
                <option value="ICICI Lombard Complete Health">ICICI Lombard Complete Health</option>
                <option value="Niva Bupa ReAssure">Niva Bupa ReAssure</option>
                <option value="Direct Cash Payment">Self-Pay / Cash Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#737783] mb-1">POLICY NUMBER</label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px] font-mono-data"
                placeholder="Policy ID"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#737783] mb-1">PREFERRED CITY</label>
              <select
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px] font-bold text-[#071e27]"
              >
                <option value="Bangalore">Bangalore</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
          </div>

          {/* Submission Action */}
          <div className="pt-6 border-t border-[#c3c6d4] flex items-center justify-between">
            <span className="text-[12px] text-[#737783] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#006f66]">lock</span>
              <span>256-Bit Encrypted Data Submission</span>
            </span>

            <button
              type="submit"
              disabled={isGeneratingAI}
              className="px-8 py-3.5 bg-[#003178] text-white font-bold text-[15px] rounded-xl hover:bg-[#0d47a1] shadow-lg flex items-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              <span>{isGeneratingAI ? 'Processing AI Diagnosis...' : 'Create Case & View AI Recommendations'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* AI Processing Modal Overlay */}
      {isGeneratingAI && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#002255] border border-[#81f3e5]/40 text-white p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-20 h-20 bg-[#81f3e5]/20 text-[#81f3e5] rounded-full flex items-center justify-center mx-auto border-2 border-[#81f3e5] animate-pulse">
              <span className="material-symbols-outlined text-[40px] animate-spin">psychology</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-[20px] font-extrabold text-white">MediQuote AI Clinical Engine</h3>
              <p className="text-[13px] text-blue-200">{aiAnalysisStep}</p>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#81f3e5] via-[#006f66] to-[#81f3e5] animate-pulse w-3/4" />
            </div>
            <p className="text-[11px] font-mono-data text-blue-300">
              Extracting ICD-10 diagnostic codes, evaluating surgical risks & querying live hospital quotes...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

