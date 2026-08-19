import React, { useState, useEffect } from 'react';
import { SurgicalCase, FamilyMember, HospitalEmailDispatch } from '../types';

interface NewCaseModalProps {
  isOpen: boolean;
  familyMembers?: FamilyMember[];
  onClose: () => void;
  onCreateCase: (newCase: SurgicalCase) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  familyMembers = [],
  onClose,
  onCreateCase,
}) => {
  const [caseTitle, setCaseTitle] = useState('Gallbladder Surgery Request');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(familyMembers[0]?.id || 'fam-1');
  const [title, setTitle] = useState('Laparoscopic Cholecystectomy');
  const [subtitle, setSubtitle] = useState('Gallbladder Removal Surgery');
  const [description, setDescription] = useState('Comparing specialized surgical teams with pre-op clearance & post-op hospital stay.');
  const [insuranceProvider, setInsuranceProvider] = useState('HDFC Optima Restore');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
    ];

    const created: SurgicalCase = {
      id: `case-${Date.now()}`,
      caseCode: `#MQ-${Math.floor(10000 + Math.random() * 90000)}`,
      title: caseTitle.trim() || title,
      subtitle,
      description,
      status: 'ACTIVE',
      quotesReadyCount: 3,
      aiConfidencePercent: 95,
      aiPrimaryRecommendationReason: 'Clinical procurement analysis matched specialized surgical facilities with high patient satisfaction scores.',
      insuranceCompatibilityNotice: `Based on policy "${insuranceProvider}", Fortis Hospital & Apollo offer direct cashless authorization.`,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      patientMemberId: selectedMemberId,
      patientMemberName: memberName,
      hospitalDispatches: defaultDispatches,
      aiClinicalAnalysis: {
        overallHealthScore: 84,
        reportSourceText: 'Uploaded Medical Diagnostic Records',
        reportAnalysisSummary: `Clinical report analysis confirms indications for ${title}. Procedure recommended within 7 to 14 days to prevent acute escalation.`,
        hospitalSelectionReasoning: 'Selected accredited medical centers based on surgical expertise and insurance cashless network.',
        healthIssuesDetected: [
          {
            conditionName: `Primary Clinical Indication: ${title}`,
            icdCode: 'Surgical Evaluation',
            findingFromReport: description || 'Clinical findings indicate necessity for surgical procedure.',
            severity: 'Moderate',
            severityBadgeColor: 'bg-amber-100 text-amber-800',
            urgencyText: 'Schedule surgery within 7 to 14 days',
            riskIfDelayed: 'Delay in procedure may lead to symptom aggravation or acute complication.'
          }
        ],
        treatmentRecommendation: {
          bestTreatmentProcedure: `Minimally Invasive ${title}`,
          whyBestTreatment: `Gold-standard surgical approach offering high success rate, reduced infection risk, and faster recovery.`,
          alternativeTreatmentsEvaluated: [
            {
              treatmentName: 'Medical / Non-Surgical Therapy',
              suitabilityScorePercent: 40,
              notes: 'Provides temporary relief but does not resolve underlying condition.'
            }
          ],
          urgencyTimelineDays: 'Within 7 to 14 Days',
          urgencyLevel: 'Recommended Soon (Within 7-14 Days)',
          preOpPreparations: [
            'Standard 8-hour NPO fasting prior to surgery',
            'Pre-Anesthetic Clearance (PAC)',
            'Verification of insurance pre-authorization'
          ],
          postOpCareInstructions: [
            'Follow post-op dietary and activity restrictions',
            'Schedule wound check 7 days post-discharge'
          ]
        }
      },
      hospitals: [
        {
          id: `hosp-${Date.now()}-1`,
          hospitalName: 'Fortis Hospital',
          location: 'Cunningham Road, Bangalore',
          logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUoaDfXwgwTwAhL-iEtHW7HNmamkQXxPApgBT6AwVIuZTywxYyk3q7_8u8KTBgIlMfGW_D2DiTbymH5cgFDvvRjjDg1m4py5LhXzZGeX5VPy5ME5dNwR_5YZagBqmRmaeg-Fl-jJoCwUKVJH14oPRmormTZUnjiw4lXALmHYN_pxaZj0LTyeb9ivOIxVAHlU0YpI4uQaoR6Mgt95H8kZfJuNBFeT1CFwdBtreoMbXD_25bOI3S0zii',
          totalQuoteINR: 152400,
          badge: 'AI RECOMMENDED',
          badgeType: 'secondary',
          roomInclusion: 'Semi-Private AC',
          roomSubtext: 'Surgeon + Post-Op Kit',
          doctorName: 'Dr. Meera Rao',
          doctorExp: 'Gastrointestinal Specialist',
          doctorSpecialty: 'Gastroenterology & GI Surgery',
          estStay: '1 Night Stay',
          supportedInsurance: ['HDFC Ergo', 'ICICI Lombard'],
          rating: 4.8,
          reviewsCount: 890,
          details: {
            surgicalProcedure: 95000,
            roomRent: 30000,
            implantsEquipment: 22000,
            consultationLabs: 11400,
            platformDiscount: 6000
          }
        },
        {
          id: `hosp-${Date.now()}-2`,
          hospitalName: 'Apollo Hospitals',
          location: 'Bannerghatta Road, Bangalore',
          logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
          totalQuoteINR: 185000,
          badge: 'MOST EXPERIENCED',
          badgeType: 'neutral',
          roomInclusion: 'Private AC Deluxe',
          roomSubtext: 'Surgeon + OT + Nursing',
          doctorName: 'Dr. S. K. Nair',
          doctorExp: '22+ Years Surgery Exp.',
          doctorSpecialty: 'Laparoscopic Surgeon',
          estStay: '2 Nights Stay',
          supportedInsurance: ['Star Health', 'HDFC Ergo'],
          rating: 4.9,
          reviewsCount: 1200,
          details: {
            surgicalProcedure: 110000,
            roomRent: 40000,
            implantsEquipment: 25000,
            consultationLabs: 15000,
            platformDiscount: 5000
          }
        }
      ]
    };

    onCreateCase(created);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex justify-center items-start sm:items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl border border-[#c3c6d4] max-w-lg w-full p-6 shadow-2xl space-y-6 relative my-auto cursor-default"
      >
        <div className="flex justify-between items-center border-b border-[#c3c6d4]/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003178]">add_circle</span>
            <h3 className="font-bold text-[18px] text-[#003178]">Start New Surgical Case</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#737783] hover:text-[#071e27]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#003178] uppercase mb-1">
              New Case Title *
            </label>
            <input
              type="text"
              required
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] text-[14px] text-[#071e27] focus:outline-none focus:border-[#003178] bg-[#f8fafc]"
              placeholder="e.g. Gallbladder Surgery Quotation Request"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#003178] uppercase mb-1">
              Patient Profile (Family Dependent) *
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] text-[14px] text-[#071e27] focus:outline-none focus:border-[#003178] bg-[#f8fafc]"
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} — {m.relationship} (Age {m.age})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#434652] uppercase mb-1">
              Procedure Name / Surgical Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] text-[14px] text-[#071e27] focus:outline-none focus:border-[#003178]"
              placeholder="e.g. Laparoscopic Cholecystectomy"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#434652] uppercase mb-1">
              Subtitle / Medical Scope
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] text-[14px] text-[#071e27] focus:outline-none focus:border-[#003178]"
              placeholder="e.g. Gallbladder removal surgery"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#434652] uppercase mb-1">
              Description & Clinical Requirements
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] text-[14px] text-[#071e27] focus:outline-none focus:border-[#003178]"
              placeholder="Describe surgical timeline, doctor preferences, or room tier requirements..."
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#434652] uppercase mb-1">
              Insurance Policy / TPA
            </label>
            <input
              type="text"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] text-[14px] text-[#071e27] focus:outline-none focus:border-[#003178]"
              placeholder="e.g. HDFC Optima Restore / Star Health"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[14px] font-bold text-[#434652] hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#003178] text-white font-bold text-[14px] rounded-xl hover:bg-[#0d47a1] shadow-md"
            >
              Generate Quotations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
