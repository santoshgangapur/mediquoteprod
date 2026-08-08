import { PatientProfile, HealthMetrics, SurgicalCase, MedicalRecord, Appointment, FinancingOption, AdminUser, AdminHospital, DetailedHospitalProfile, UserPersona, FamilyMember, HospitalEmailDispatch } from '../types';

export const initialPersonas: UserPersona[] = [
  {
    id: 'patient',
    name: 'Arjun Mehta',
    roleTitle: 'Patient & Family Health Manager',
    email: 'arjun.mehta@gmail.com',
    badgeText: 'PATIENT PORTAL',
    description: 'Manage surgical cases, request quotes, compare hospital packages, and manage family health records.',
    allowedViews: ['dashboard', 'new-case', 'cases', 'family', 'quotes', 'records', 'hospitals', 'hospital-profile', 'checkout', 'recommendations', 'upload', 'account', 'medical-tourism'],
  },
  {
    id: 'hospital',
    name: 'Apollo Hospital Desk',
    roleTitle: 'Hospital Admissions & Quotations Desk',
    email: 'admissions@apollohospitals.org',
    hospitalName: 'Apollo Hospitals',
    badgeText: 'HOSPITAL ADMIN',
    description: 'Review incoming case broadcasts from patients, issue line-item surgical quotes, and manage bed capacity.',
    allowedViews: ['hospitals', 'hospital-profile', 'quotes', 'doctor-portal', 'admin', 'cases', 'medical-tourism'],
  },
  {
    id: 'insurance',
    name: 'HDFC ERGO TPA Desk',
    roleTitle: 'Insurance TPA & Cashless Pre-Auth Officer',
    email: 'tpa-claims@hdfcergo.com',
    badgeText: 'INSURANCE TPA DESK',
    description: 'Verify patient insurance policies, audit room tier caps, approve cashless pre-authorization, and review medical necessity.',
    allowedViews: ['admin', 'cases', 'quotes', 'dashboard', 'medical-tourism'],
  },
  {
    id: 'app_admin',
    name: 'Vikramaditya Sen',
    roleTitle: 'MediQuote System Super Admin',
    email: 'admin@mediquote.ai',
    badgeText: 'APP ADMIN',
    description: 'Global system administrator with full access to hospital empanelments, TPA audit logs, platform analytics, and user access control.',
    allowedViews: ['dashboard', 'new-case', 'cases', 'family', 'quotes', 'records', 'hospitals', 'hospital-profile', 'checkout', 'recommendations', 'upload', 'account', 'doctor-portal', 'admin', 'medical-tourism'],
  },
];

export const initialFamilyMembers: FamilyMember[] = [
  {
    id: 'fam-1',
    fullName: 'Arjun Mehta',
    relationship: 'Self (Primary)',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    preExistingConditions: ['Essential Hypertension (Stage 1)', 'Pre-diabetic (HbA1c 6.1%)'],
    allergies: ['Penicillin'],
    activeCasesCount: 1,
    avatarColor: 'bg-[#003178]',
    insurancePolicyNumber: 'HDFC-OPT-992014',
  },
  {
    id: 'fam-2',
    fullName: 'Priya Mehta',
    relationship: 'Spouse',
    age: 42,
    gender: 'Female',
    bloodGroup: 'A+',
    preExistingConditions: ['Hypothyroidism (Controlled)', 'Mild Anemia'],
    allergies: ['Sulfa Drugs'],
    activeCasesCount: 0,
    avatarColor: 'bg-purple-700',
    insurancePolicyNumber: 'HDFC-OPT-992014-DEP1',
  },
  {
    id: 'fam-3',
    fullName: 'Rameshwar Mehta',
    relationship: 'Father',
    age: 72,
    gender: 'Male',
    bloodGroup: 'B+',
    preExistingConditions: ['Bilateral Knee Osteoarthritis (Grade IV)', 'Type 2 Diabetes', 'Hypertension'],
    allergies: ['Aspirin'],
    activeCasesCount: 1,
    avatarColor: 'bg-amber-700',
    insurancePolicyNumber: 'HDFC-OPT-992014-DEP2',
  },
  {
    id: 'fam-4',
    fullName: 'Ananya Mehta',
    relationship: 'Daughter',
    age: 14,
    gender: 'Female',
    bloodGroup: 'O+',
    preExistingConditions: ['Allergic Rhinitis / Mild Asthma'],
    allergies: ['Dust Mites', 'Peanuts'],
    activeCasesCount: 0,
    avatarColor: 'bg-emerald-700',
    insurancePolicyNumber: 'HDFC-OPT-992014-DEP3',
  },
  {
    id: 'usr-pt-105',
    fullName: 'Sunita Verma',
    relationship: 'Dependent',
    age: 58,
    gender: 'Female',
    bloodGroup: 'AB+',
    preExistingConditions: ['Lumbar Spondylolisthesis', 'Osteopenia'],
    allergies: ['NSAIDs'],
    activeCasesCount: 1,
    avatarColor: 'bg-rose-700',
    insurancePolicyNumber: 'HDFC-OPT-992014-DEP4',
  },
  {
    id: 'usr-pt-106',
    fullName: 'Rajesh Malhotra',
    relationship: 'Dependent',
    age: 51,
    gender: 'Male',
    bloodGroup: 'O-',
    preExistingConditions: ['Fatty Liver Grade II', 'Hyperuricemia'],
    allergies: ['None'],
    activeCasesCount: 1,
    avatarColor: 'bg-teal-700',
    insurancePolicyNumber: 'STAR-HLTH-882190',
  }
];

export const initialPatientProfile: PatientProfile = {
  name: 'Arjun Mehta',
  patientId: '#MQ-9921',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  insurancePolicyNumber: 'HDFC-OPT-992014',
  insuranceProvider: 'HDFC Optima Restore',
  location: 'Bangalore, India',
  countryCode: 'IN',
  currency: 'INR',
  isInternationalPatient: false,
};

export const initialHealthMetrics: HealthMetrics = {
  bloodPressure: '128/84',
  glucoseFasting: 94,
  bmi: 24.2,
  bmiCategory: 'Normal',
  bpTrend: [122, 125, 121, 126, 130, 127, 128]
};

export const initialCases: SurgicalCase[] = [
  {
    id: 'case-1',
    caseCode: '#MQ-88291',
    title: 'Laparoscopic Cholecystectomy',
    subtitle: 'Minimally Invasive Gallbladder Resection',
    description: 'Patient complaining of recurrent acute right upper quadrant biliary colic post-fatty meal. USG confirms 3.8mm gallbladder wall thickening and 8mm gallstones.',
    status: 'ACTIVE',
    quotesReadyCount: 3,
    aiConfidencePercent: 94,
    aiPrimaryRecommendationReason: 'Based on USG findings and symptom progression, 3D laparoscopic gallbladder removal is the recommended gold-standard treatment with 98.4% success rate.',
    insuranceCompatibilityNotice: 'Your HDFC Optima Restore plan has 100% cashless coverage at Fortis Hospital and Apollo Hospitals for this procedure.',
    costDifferenceText: '₹32,600 cost difference',
    createdDate: '12 Oct 2023',
    patientMemberId: 'fam-1',
    patientMemberName: 'Arjun Mehta (Self - 45M)',
    attachedRecordIds: ['rec-1', 'rec-3'],
    hospitalDispatches: [
      {
        hospitalId: 'apollo-hospitals',
        hospitalName: 'Apollo Hospitals',
        email: 'quotes@apollohospitals.org',
        sentTimestamp: '12 Oct 2023, 09:15 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 185000,
        responseTpaStatus: 'Direct Cashless Pre-Approved (100%)',
      },
      {
        hospitalId: 'fortis-hospital',
        hospitalName: 'Fortis Hospital Cunningham Road',
        email: 'admissions@fortishospitals.in',
        sentTimestamp: '12 Oct 2023, 09:15 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 152400,
        responseTpaStatus: '98% Cashless Rate (HDFC Optima)',
      },
      {
        hospitalId: 'max-healthcare',
        hospitalName: 'Max Healthcare Centre',
        email: 'quotes@maxhealthcare.com',
        sentTimestamp: '12 Oct 2023, 09:15 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 168000,
        responseTpaStatus: 'Empanelled Cashless TPA',
      },
      {
        hospitalId: 'manipal-hospitals',
        hospitalName: 'Manipal Hospitals Old Airport Rd',
        email: 'enquiry@manipalhospitals.com',
        sentTimestamp: '12 Oct 2023, 09:16 AM',
        status: 'Received & Opened',
        responseTpaStatus: 'Under Medical Audit Review',
      },
    ],
    vitals: {
      bloodPressureStr: '128/84 mmHg',
      fastingSugarMgDl: 118,
      ppSugarMgDl: 154,
      hba1cPercent: 6.1,
      heartRateBpm: 76,
      spO2Percent: 98,
    },
    aiClinicalAnalysis: {
      overallHealthScore: 82,
      reportSourceText: 'USG Abdomen & Full Blood Panel (Clari diagnostic labs dated 10 Oct 2023)',
      reportAnalysisSummary: 'USG report confirms symptomatic cholelithiasis with 3.8mm gallbladder wall thickening indicative of acute-on-chronic cholecystitis. Blood panel shows WBC 11,200 and HbA1c 6.1%. Prompt laparoscopic resection recommended within 7-14 days.',
      hospitalSelectionReasoning: 'Fortis Hospital Cunningham Road offers 98% TPA cashless clearance for HDFC Optima Restore with GI laparoscopic team under Dr. Meera Rao.',
      healthIssuesDetected: [
        {
          conditionName: 'Symptomatic Cholelithiasis with Acute Wall Thickening',
          icdCode: 'K80.20 (Calculus of Gallbladder)',
          findingFromReport: 'Multiple radio-opaque gallstones (7-9 mm) in lumen; GB wall edema measured at 3.8 mm.',
          severity: 'High / Serious',
          severityBadgeColor: 'bg-red-100 text-red-800 border-red-200',
          urgencyText: 'Schedule surgery within 7 to 14 days',
          riskIfDelayed: 'Risk of stone migration into CBD causing Obstructive Jaundice or Acute Biliary Pancreatitis.'
        }
      ],
      treatmentRecommendation: {
        bestTreatmentProcedure: '3D Laparoscopic Cholecystectomy (Keyhole Gallbladder Excision)',
        whyBestTreatment: 'Gold-standard minimally invasive technique using 3 tiny 5mm incisions. 24-48 hr discharge with rapid recovery.',
        alternativeTreatmentsEvaluated: [],
        urgencyTimelineDays: 'Within 7 to 10 Days',
        urgencyLevel: 'Recommended Soon (Within 7-14 Days)',
        preOpPreparations: ['Fasting NPO 8 hours prior', 'Pre-Anesthetic Clearance (PAC) ECG check'],
        postOpCareInstructions: ['Low-fat diet for 3 weeks', 'Avoid heavy lifting for 3 weeks']
      }
    },
    hospitals: [
      {
        id: 'apollo-1',
        hospitalName: 'Apollo Hospitals',
        location: 'Bannerghatta Road, Bangalore',
        logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
        totalQuoteINR: 185000,
        badge: 'MOST EXPERIENCED',
        badgeType: 'neutral',
        roomInclusion: 'Private AC Deluxe Suite',
        roomSubtext: 'Attending: Dr. S. K. Nair • 2 Nights Stay',
        doctorName: 'Dr. S. K. Nair',
        doctorExp: '22+ Years Surgery Exp.',
        doctorSpecialty: 'Sr. Laparoscopic Surgeon',
        estStay: '2 Nights Stay',
        supportedInsurance: ['HDFC Ergo', 'Star Health', 'ICICI Lombard'],
        rating: 4.8,
        reviewsCount: 1200,
        distanceKm: 1.2,
        costRangeText: '₹1.85L - ₹2.2L',
        details: {
          surgicalProcedure: 110000,
          roomRent: 40000,
          implantsEquipment: 25000,
          consultationLabs: 15000,
          platformDiscount: 5000
        }
      },
      {
        id: 'fortis-1',
        hospitalName: 'Fortis Hospital',
        location: 'Cunningham Road, Bangalore',
        logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUoaDfXwgwTwAhL-iEtHW7HNmamkQXxPApgBT6AwVIuZTywxYyk3q7_8u8KTBgIlMfGW_D2DiTbymH5cgFDvvRjjDg1m4py5LhXzZGeX5VPy5ME5dNwR_5YZagBqmRmaeg-Fl-jJoCwUKVJH14oPRmormTZUnjiw4lXALmHYN_pxaZj0LTyeb9ivOIxVAHlU0YpI4uQaoR6Mgt95H8kZfJuNBFeT1CFwdBtreoMbXD_25bOI3S0zii',
        totalQuoteINR: 152400,
        badge: 'AI RECOMMENDED',
        badgeType: 'secondary',
        roomInclusion: 'Semi-Private AC Room',
        roomSubtext: 'Attending: Dr. Meera Rao • 1 Night Stay',
        doctorName: 'Dr. Meera Rao',
        doctorExp: 'Gastrointestinal Specialist',
        doctorSpecialty: 'Gastroenterology & GI Surgery',
        estStay: '1 Night Stay',
        supportedInsurance: ['All Major TPA', 'ICICI Lombard'],
        rating: 4.6,
        reviewsCount: 890,
        savingsVsAvgPercentage: 18,
        distanceKm: 2.1,
        costRangeText: '₹1.5L - ₹1.8L',
        details: {
          surgicalProcedure: 95000,
          roomRent: 30000,
          implantsEquipment: 22000,
          consultationLabs: 11400,
          platformDiscount: 6000
        }
      }
    ]
  },
  {
    id: 'case-2',
    caseCode: '#MQ-77102',
    title: 'Robotic Total Knee Replacement',
    subtitle: 'Bilateral Knee Arthroplasty (Grade IV Osteoarthritis)',
    description: 'Severe joint friction and chronic right knee pain restricting gait for 14 months. Weight-bearing X-rays reveal complete medial compartment joint space loss.',
    status: 'ACTIVE',
    quotesReadyCount: 3,
    aiConfidencePercent: 96,
    aiPrimaryRecommendationReason: 'Bilateral Grade IV osteoarthritis requires 3D CT-guided Robotic Knee Arthroplasty to eliminate bone-on-bone pain and restore leg alignment.',
    insuranceCompatibilityNotice: 'Apollo Saket and Max Smart provide 100% pre-authorization approval under HDFC Optima Senior policy.',
    createdDate: '28 Sep 2023',
    patientMemberId: 'fam-3',
    patientMemberName: 'Rameshwar Mehta (Father - 72M)',
    attachedRecordIds: ['rec-2'],
    hospitalDispatches: [
      {
        hospitalId: 'apollo-hospitals',
        hospitalName: 'Apollo Hospitals Saket',
        email: 'knee.quotes@apollohospitals.org',
        sentTimestamp: '28 Sep 2023, 11:30 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 345000,
        responseTpaStatus: 'Cashless Approval Pre-Cleared',
      },
      {
        hospitalId: 'max-healthcare',
        hospitalName: 'Max Smart Super Speciality',
        email: 'ortho@maxhealthcare.com',
        sentTimestamp: '28 Sep 2023, 11:30 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 310000,
        responseTpaStatus: '100% Cashless TPA Approved',
      },
      {
        hospitalId: 'fortis-hospital',
        hospitalName: 'Fortis Escorts Heart & Spine',
        email: 'ortho.admissions@fortishospitals.in',
        sentTimestamp: '28 Sep 2023, 11:31 AM',
        status: 'Received & Opened',
        responseTpaStatus: 'Preparing Detailed Quote',
      },
    ],
    vitals: {
      bloodPressureStr: '132/86 mmHg',
      fastingSugarMgDl: 104,
      ppSugarMgDl: 138,
      hba1cPercent: 5.8,
      heartRateBpm: 72,
      spO2Percent: 99,
    },
    aiClinicalAnalysis: {
      overallHealthScore: 78,
      reportSourceText: 'Bilateral Knee Weight-Bearing X-Rays & MRI Joints (dated 20 Sep 2023)',
      reportAnalysisSummary: 'Severe Grade IV Osteoarthritis of the Right Knee with complete medial joint space loss and subchondral sclerosis. Total Knee Arthroplasty with robotic alignment guide is strongly indicated.',
      hospitalSelectionReasoning: 'Apollo Saket is recommended for Mako Robotic Precision Knee Replacement under Dr. Rajesh Kumar.',
      healthIssuesDetected: [
        {
          conditionName: 'Severe Right Knee Primary Osteoarthritis (Grade IV)',
          icdCode: 'M17.11 (Primary osteoarthritis, right knee)',
          findingFromReport: 'X-ray reveals severe narrowing of medial tibiofemoral joint space with osteophyte formation.',
          severity: 'High / Serious',
          severityBadgeColor: 'bg-red-100 text-red-800 border-red-200',
          urgencyText: 'Schedule elective surgery within 14 to 30 days',
          riskIfDelayed: 'Progressive muscle atrophy and contralateral joint stress.'
        }
      ],
      treatmentRecommendation: {
        bestTreatmentProcedure: 'Robotic-Assisted Unilateral Total Knee Arthroplasty (TKA)',
        whyBestTreatment: '3D CT-guided precision ensures sub-millimeter leg alignment and soft-tissue balancing.',
        alternativeTreatmentsEvaluated: [],
        urgencyTimelineDays: 'Within 14 to 30 Days',
        urgencyLevel: 'Elective (Within 30 Days)',
        preOpPreparations: ['Quadriceps strengthening exercises', 'Dental clearance to prevent infection'],
        postOpCareInstructions: ['CPM machine physical therapy Day 1', 'Walker support for 2 weeks']
      }
    },
    hospitals: [
      {
        id: 'apollo-knee',
        hospitalName: 'Apollo Hospitals Saket',
        location: 'Saket, New Delhi',
        logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
        totalQuoteINR: 345000,
        badge: 'AI RECOMMENDED',
        badgeType: 'secondary',
        roomInclusion: 'Private Deluxe Suite',
        roomSubtext: 'Attending: Dr. Rajesh Kumar • 4 Nights Stay',
        doctorName: 'Dr. Rajesh Kumar',
        doctorExp: '25+ Yrs Ortho Exp.',
        doctorSpecialty: 'Sr. Joint Replacement Specialist',
        estStay: '4-5 Days Stay',
        supportedInsurance: ['HDFC Ergo', 'Max Bupa', 'Star Health'],
        rating: 4.9,
        reviewsCount: 1420,
        distanceKm: 1.5,
        costRangeText: '₹3.2L - ₹3.6L',
        details: {
          surgicalProcedure: 245000,
          roomRent: 85000,
          implantsEquipment: 50000,
          consultationLabs: 10000,
          platformDiscount: 8000
        }
      }
    ]
  },
  {
    id: 'case-3',
    caseCode: '#MQ-66304',
    title: 'Lumbar Microdiscectomy (Back Pain & Sciatica)',
    subtitle: 'Minimally Invasive L4-L5 Spinal Decompression',
    description: 'Patient complaining of severe lower back pain radiating down left leg to foot for 8 weeks. MRI Lumbar Spine demonstrates L4-L5 left paracentral disc herniation compressing the S1 nerve root.',
    status: 'ACTIVE',
    quotesReadyCount: 3,
    aiConfidencePercent: 96,
    aiPrimaryRecommendationReason: 'MRI findings confirm L4-L5 disc protrusion compressing the nerve root. Minimally invasive lumbar microdiscectomy is the primary recommendation with 96% clinical success.',
    insuranceCompatibilityNotice: 'Apollo Hospitals and Fortis Hospital provide 100% cashless pre-authorization approval under HDFC Optima Restore.',
    costDifferenceText: '₹40,000 cost difference',
    createdDate: '18 Oct 2023',
    patientMemberId: 'fam-1',
    patientMemberName: 'Arjun Mehta (Self - 45M)',
    attachedRecordIds: ['rec-1', 'rec-2'],
    hospitalDispatches: [
      {
        hospitalId: 'apollo-hospitals',
        hospitalName: 'Apollo Hospitals',
        email: 'spine.quotes@apollohospitals.org',
        sentTimestamp: '18 Oct 2023, 10:15 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 198000,
        responseTpaStatus: 'Direct Cashless Pre-Approved (100%)',
      },
      {
        hospitalId: 'fortis-hospital',
        hospitalName: 'Fortis Hospital Cunningham Road',
        email: 'spine.admissions@fortishospitals.in',
        sentTimestamp: '18 Oct 2023, 10:15 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 168000,
        responseTpaStatus: '98% Cashless Rate (HDFC Optima)',
      },
      {
        hospitalId: 'max-healthcare',
        hospitalName: 'Max Healthcare Centre',
        email: 'spine@maxhealthcare.com',
        sentTimestamp: '18 Oct 2023, 10:15 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 158000,
        responseTpaStatus: 'Empanelled Cashless TPA',
      },
    ],
    vitals: {
      bloodPressureStr: '124/80 mmHg',
      fastingSugarMgDl: 102,
      ppSugarMgDl: 140,
      hba1cPercent: 5.9,
      heartRateBpm: 74,
      spO2Percent: 98,
    },
    aiClinicalAnalysis: {
      overallHealthScore: 78,
      reportSourceText: 'MRI Lumbar Spine 3.0T High-Res Scan & Neurological Examination (dated 14 Oct 2023)',
      reportAnalysisSummary: 'MRI Lumbar Spine confirms L4-L5 left herniated disc causing nerve root compression, severe mechanical lower back pain, and radicular sciatica. Minimally invasive microdiscectomy and endoscopic nerve decompression recommended within 7 to 14 days.',
      hospitalSelectionReasoning: 'Apollo Hospitals and Fortis Hospital are top-rated for Spine & Neurosurgery under senior surgeons Dr. H. S. Chhabra and Dr. B. S. Murthy.',
      healthIssuesDetected: [
        {
          conditionName: 'Lumbar Disc Herniation with S1 Sciatic Nerve Compression',
          icdCode: 'M51.26 (Lumbar Disc Displacement)',
          findingFromReport: '3.0T MRI reveals L4-L5 left posterior disc protrusion compressing the traversing S1 spinal nerve root with localized epidural fat effacement.',
          severity: 'High / Serious',
          severityBadgeColor: 'bg-red-100 text-red-800 border-red-200',
          urgencyText: 'Schedule microdiscectomy within 7 to 14 days',
          riskIfDelayed: 'Risk of permanent neurological weakness, foot drop, or severe chronic radicular pain syndrome.'
        }
      ],
      treatmentRecommendation: {
        bestTreatmentProcedure: 'Minimally Invasive Lumbar Microdiscectomy & Endoscopic Decompression',
        whyBestTreatment: 'Gold-standard spinal decompression. Relieves nerve root pressure through a 18mm micro-incision, preserves spinal muscle attachments, and allows walking on Day 1.',
        alternativeTreatmentsEvaluated: [
          {
            treatmentName: 'Epidural Steroid Injection & Core Stabilization Physio',
            suitabilityScorePercent: 68,
            notes: 'Temporary relief (3-6 months); does not resolve mechanical disc compression.'
          },
          {
            treatmentName: 'Open Laminectomy with Pedicle Screw Fusion',
            suitabilityScorePercent: 52,
            notes: 'More invasive approach with hardware implantation; reserved for structural spinal instability.'
          }
        ],
        urgencyTimelineDays: 'Within 7 to 14 Days',
        urgencyLevel: 'Recommended Soon (Within 7-14 Days)',
        preOpPreparations: [
          'High-resolution MRI Lumbar Spine review by Spine Anesthesiologist',
          'Pre-Anesthetic Clearance (PAC) ECG & Blood Coagulation Check',
          'Discontinue NSAIDs / blood thinners 5 days prior'
        ],
        postOpCareInstructions: [
          'Wear lumbar corset support belt during standing and walking for 3 weeks',
          'Avoid forward bending, twisting, or lifting heavy weights (>5kg) for 4 weeks',
          'Begin supervised core-strengthening physical therapy at 2 weeks post-op'
        ]
      }
    },
    hospitals: [
      {
        id: 'apollo-spine',
        hospitalName: 'Apollo Hospitals',
        location: 'Bannerghatta Road, Bangalore',
        logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
        totalQuoteINR: 198000,
        badge: 'MOST EXPERIENCED',
        badgeType: 'neutral',
        roomInclusion: 'Private AC Deluxe Suite',
        roomSubtext: 'Attending: Dr. H. S. Chhabra • 2 Nights Stay',
        doctorName: 'Dr. H. S. Chhabra',
        doctorExp: '24+ Years Senior Spine Director',
        doctorSpecialty: 'Spine & Neurosurgery',
        estStay: '2 Nights Stay',
        supportedInsurance: ['HDFC Ergo', 'Star Health', 'ICICI Lombard'],
        rating: 4.9,
        reviewsCount: 1380,
        distanceKm: 1.8,
        costRangeText: '₹1.85L - ₹2.25L',
        details: {
          surgicalProcedure: 125000,
          roomRent: 38000,
          implantsEquipment: 22000,
          consultationLabs: 18000,
          platformDiscount: 5000
        }
      },
      {
        id: 'fortis-spine',
        hospitalName: 'Fortis Hospital',
        location: 'Cunningham Road, Bangalore',
        logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUoaDfXwgwTwAhL-iEtHW7HNmamkQXxPApgBT6AwVIuZTywxYyk3q7_8u8KTBgIlMfGW_D2DiTbymH5cgFDvvRjjDg1m4py5LhXzZGeX5VPy5ME5dNwR_5YZagBqmRmaeg-Fl-jJoCwUKVJH14oPRmormTZUnjiw4lXALmHYN_pxaZj0LTyeb9ivOIxVAHlU0YpI4uQaoR6Mgt95H8kZfJuNBFeT1CFwdBtreoMbXD_25bOI3S0zii',
        totalQuoteINR: 168000,
        badge: 'AI RECOMMENDED',
        badgeType: 'secondary',
        roomInclusion: 'Semi-Private AC Room',
        roomSubtext: 'Attending: Dr. B. S. Murthy • 1 Night Stay',
        doctorName: 'Dr. B. S. Murthy',
        doctorExp: '20+ Years Chief Spine Consultant',
        doctorSpecialty: 'Orthopaedic Spine Surgery',
        estStay: '1 Night Stay',
        supportedInsurance: ['All Major TPAs', 'ICICI Lombard'],
        rating: 4.8,
        reviewsCount: 1020,
        savingsVsAvgPercentage: 15,
        distanceKm: 2.4,
        costRangeText: '₹1.55L - ₹1.80L',
        details: {
          surgicalProcedure: 108000,
          roomRent: 28000,
          implantsEquipment: 20000,
          consultationLabs: 18000,
          platformDiscount: 6000
        }
      }
    ]
  },
  {
    id: 'case-4',
    caseCode: '#MQ-55209',
    title: 'Coblation Adenotonsillectomy',
    subtitle: 'Pediatric Plasma Coblation Tonsillectomy & Adenoidectomy',
    description: '14-year-old patient experiencing recurrent severe streptococcal tonsillitis (6 episodes in 12 months) and nighttime mouth breathing with snoring.',
    status: 'ACTIVE',
    quotesReadyCount: 2,
    aiConfidencePercent: 95,
    aiPrimaryRecommendationReason: 'Plasma coblation technique operates at low temperatures (60°C), significantly reducing post-operative pediatric pain and bleeding compared to electrocautery.',
    insuranceCompatibilityNotice: 'Covered under dependent child clause on HDFC Optima policy.',
    createdDate: '01 Aug 2023',
    patientMemberId: 'fam-4',
    patientMemberName: 'Ananya Mehta (Daughter - 14F)',
    attachedRecordIds: ['rec-5'],
    hospitalDispatches: [
      {
        hospitalId: 'apollo-hospitals',
        hospitalName: 'Apollo Childrens Hospital',
        email: 'peds.ent@apollohospitals.org',
        sentTimestamp: '01 Aug 2023, 10:00 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 98000,
        responseTpaStatus: 'Direct Cashless Pre-Approved',
      },
      {
        hospitalId: 'fortis-hospital',
        hospitalName: 'Fortis Hospital',
        email: 'pediatrics@fortishospitals.in',
        sentTimestamp: '01 Aug 2023, 10:01 AM',
        status: 'Quotation Offered',
        responseCostEstimateINR: 88000,
        responseTpaStatus: 'Cashless Approval Cleared',
      }
    ],
    vitals: {
      bloodPressureStr: '110/70 mmHg',
      fastingSugarMgDl: 88,
      ppSugarMgDl: 112,
      hba1cPercent: 5.1,
      heartRateBpm: 82,
      spO2Percent: 99,
    },
    aiClinicalAnalysis: {
      overallHealthScore: 92,
      reportSourceText: 'Pediatric ENT Diagnostic Endoscopy (dated 28 Jul 2023)',
      reportAnalysisSummary: 'Grade III bilateral palatine tonsillar hypertrophy and 75% adenoidal airway occlusion. Coblation plasma excision recommended.',
      hospitalSelectionReasoning: 'Apollo Childrens Hospital has specialized pediatric ENT ward and day-care discharge protocol.',
      healthIssuesDetected: [
        {
          conditionName: 'Chronic Recurrent Tonsillitis & Adenoid Hypertrophy',
          icdCode: 'J35.01 (Chronic tonsillitis)',
          findingFromReport: 'Enlarged tonsils obstructing posterior pharynx; adenoids causing nasal airway resistance.',
          severity: 'Moderate',
          severityBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          urgencyText: 'Schedule during upcoming school break',
          riskIfDelayed: 'Restless sleep, impaired concentration, and chronic ear infections.'
        }
      ],
      treatmentRecommendation: {
        bestTreatmentProcedure: 'Plasma Coblation Adenotonsillectomy',
        whyBestTreatment: 'Low-temperature plasma technology minimizes tissue thermal damage and reduces recovery period to 3-5 days.',
        alternativeTreatmentsEvaluated: [],
        urgencyTimelineDays: 'Within 14 to 30 Days',
        urgencyLevel: 'Elective (Within 30 Days)',
        preOpPreparations: ['Coagulation blood profile (PT/INR, APTT)', 'Avoid aspirin/blood thinners'],
        postOpCareInstructions: ['Soft cold food diet (ice cream, jellies)', 'Avoid strenuous sports for 10 days']
      }
    },
    hospitals: [
      {
        id: 'apollo-peds',
        hospitalName: 'Apollo Childrens Hospital',
        location: 'Greams Road, Chennai',
        logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
        totalQuoteINR: 98000,
        badge: 'AI RECOMMENDED',
        badgeType: 'secondary',
        roomInclusion: 'Pediatric Deluxe Suite',
        roomSubtext: 'Attending: Dr. R. Ananthakrishnan • 1 Day Care Stay',
        doctorName: 'Dr. R. Ananthakrishnan',
        doctorExp: '20+ Yrs Pediatric ENT',
        doctorSpecialty: 'Sr. Pediatric ENT Surgeon',
        estStay: '1 Day Care Stay',
        supportedInsurance: ['HDFC Ergo', 'Star Health'],
        rating: 4.9,
        reviewsCount: 650,
        distanceKm: 3.1,
        costRangeText: '₹90,000 - ₹1.05L',
        details: {
          surgicalProcedure: 62000,
          roomRent: 18000,
          implantsEquipment: 12000,
          consultationLabs: 8000,
          platformDiscount: 2000
        }
      }
    ]
  }
];

export const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec-1',
    fileName: 'Blood_Report_Oct23.pdf',
    fileSize: '1.2 MB',
    uploadDate: '03 Oct 2023',
    category: 'DIAGNOSTIC',
    fileType: 'pdf',
    fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'fam-1',
    patientMemberName: 'Arjun Mehta'
  },
  {
    id: 'rec-2',
    fileName: 'Knee_MRI_Lateral.jpg',
    fileSize: '4.8 MB',
    uploadDate: '28 Sep 2023',
    category: 'RADIOLOGY',
    fileType: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'fam-3',
    patientMemberName: 'Rameshwar Mehta'
  },
  {
    id: 'rec-3',
    fileName: 'Physio_Prescription.pdf',
    fileSize: '85 KB',
    uploadDate: '15 Sep 2023',
    category: 'PRESCRIPTION',
    fileType: 'pdf',
    fileUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'fam-1',
    patientMemberName: 'Arjun Mehta'
  },
  {
    id: 'rec-4',
    fileName: 'Thyroid_Panel_Lab_Report.pdf',
    fileSize: '1.5 MB',
    uploadDate: '20 Sep 2023',
    category: 'DIAGNOSTIC',
    fileType: 'pdf',
    fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'fam-2',
    patientMemberName: 'Priya Mehta'
  },
  {
    id: 'rec-5',
    fileName: 'Pediatric_Vaccination_Record.pdf',
    fileSize: '620 KB',
    uploadDate: '01 Aug 2023',
    category: 'HISTORY',
    fileType: 'pdf',
    fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'fam-4',
    patientMemberName: 'Ananya Mehta'
  },
  {
    id: 'rec-6',
    fileName: 'Spine_Lumbar_MRI_3T_Scan.pdf',
    fileSize: '3.4 MB',
    uploadDate: '05 Nov 2023',
    category: 'RADIOLOGY',
    fileType: 'pdf',
    fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-105',
    patientMemberName: 'Sunita Verma'
  },
  {
    id: 'rec-7',
    fileName: 'ECG_12_Lead_Cardiology_Report.pdf',
    fileSize: '820 KB',
    uploadDate: '06 Nov 2023',
    category: 'DIAGNOSTIC',
    fileType: 'pdf',
    fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-105',
    patientMemberName: 'Sunita Verma'
  },
  {
    id: 'rec-8',
    fileName: 'Pre_Op_Blood_Coagulation_Panel.pdf',
    fileSize: '1.1 MB',
    uploadDate: '08 Nov 2023',
    category: 'LAB_REPORT',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-105',
    patientMemberName: 'Sunita Verma'
  },
  {
    id: 'rec-9',
    fileName: 'USG_Abdomen_Pelvis_Scan_Report.pdf',
    fileSize: '2.1 MB',
    uploadDate: '18 Nov 2023',
    category: 'RADIOLOGY',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-106',
    patientMemberName: 'Rajesh Malhotra'
  },
  {
    id: 'rec-10',
    fileName: 'Hospital_Discharge_Summary_2023.pdf',
    fileSize: '1.8 MB',
    uploadDate: '22 Nov 2023',
    category: 'DISCHARGE_SUMMARY',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-106',
    patientMemberName: 'Rajesh Malhotra'
  },
  {
    id: 'rec-11',
    fileName: 'Bilateral_Mammography_Screening.pdf',
    fileSize: '4.2 MB',
    uploadDate: '02 Dec 2023',
    category: 'SCAN_MRI',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-107',
    patientMemberName: 'Kavita Reddy'
  },
  {
    id: 'rec-12',
    fileName: 'Pre_Anesthetic_Clearance_Fitness_Cert.pdf',
    fileSize: '650 KB',
    uploadDate: '04 Dec 2023',
    category: 'HISTORY',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-107',
    patientMemberName: 'Kavita Reddy'
  },
  {
    id: 'rec-13',
    fileName: 'Coronary_Angiography_CD_Diagnostic.pdf',
    fileSize: '5.6 MB',
    uploadDate: '10 Dec 2023',
    category: 'DIAGNOSTIC',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-108',
    patientMemberName: 'Deepak Sharma'
  },
  {
    id: 'rec-14',
    fileName: 'Lipid_Profile_and_Kidney_Function.pdf',
    fileSize: '980 KB',
    uploadDate: '12 Dec 2023',
    category: 'LAB_REPORT',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'usr-pt-108',
    patientMemberName: 'Deepak Sharma'
  },
  {
    id: 'rec-15',
    fileName: 'HDFC_Ergo_Cashless_Health_Card.pdf',
    fileSize: '410 KB',
    uploadDate: '15 Dec 2023',
    category: 'INSURANCE_CARD',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'fam-1',
    patientMemberName: 'Arjun Mehta'
  },
  {
    id: 'rec-16',
    fileName: 'Post_Op_Surgical_Billing_Receipt.pdf',
    fileSize: '730 KB',
    uploadDate: '18 Dec 2023',
    category: 'BILL_RECEIPT',
    fileType: 'pdf',
    status: 'Uploaded',
    progressPercent: 100,
    patientMemberId: 'fam-3',
    patientMemberName: 'Rameshwar Mehta'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Kavita Sharma',
    title: 'Pre-Surgery Consultation',
    dateDay: '14',
    dateMonth: 'OCT',
    time: '10:30 AM',
    locationOrLink: 'Telehealth Video Session',
    type: 'video'
  },
  {
    id: 'apt-2',
    doctorName: 'Physio Evaluation',
    title: 'Fortis Memorial Research',
    dateDay: '21',
    dateMonth: 'OCT',
    time: '02:15 PM',
    locationOrLink: 'OPD Building 2, Floor 3',
    type: 'in-person'
  }
];

export const defaultFinancingOptions: FinancingOption[] = [
  {
    id: '12m_nocost',
    badge: 'BEST VALUE',
    title: '12 Months No-Cost EMI',
    monthlyAmountINR: 32500,
    subtext: 'Total Payable: ₹3,90,000',
    totalPayableINR: 390000
  },
  {
    id: '24m_emi',
    badge: 'FLEXIBLE',
    title: '24 Months EMI',
    monthlyAmountINR: 18200,
    subtext: 'At 9.5% reducing p.a.',
    totalPayableINR: 436800
  },
  {
    id: 'full',
    badge: 'ONE-TIME',
    title: 'Pay Full Amount',
    monthlyAmountINR: 382000,
    subtext: '2% early payment discount applied',
    totalPayableINR: 382000
  }
];

export const nearbyHospitalsList = [
  {
    id: 'apollo-spectra',
    name: 'Apollo Spectra Hospitals',
    category: 'RECOMMENDED',
    rating: 4.9,
    distanceKm: 1.2,
    locationName: 'Kailash Colony, New Delhi',
    costRange: '₹85,000 - ₹1.2L',
    websiteUrl: 'https://www.apollospectra.com',
    isPrimary: true
  },
  {
    id: 'max-speciality',
    name: 'Max Super Speciality',
    category: 'PREMIUM PARTNER',
    rating: 4.7,
    distanceKm: 3.5,
    locationName: 'Saket, New Delhi',
    costRange: '₹1.4L - ₹2.1L',
    websiteUrl: 'https://www.maxhealthcare.in',
    isPrimary: false
  },
  {
    id: 'city-life',
    name: 'City Life Hospital',
    category: 'BUDGET FRIENDLY',
    rating: 4.2,
    distanceKm: 0.8,
    locationName: 'Lajpat Nagar, New Delhi',
    costRange: '₹45,000 - ₹70,000',
    websiteUrl: 'https://www.apollohospitals.com',
    isPrimary: false
  },
  {
    id: 'fortis-cunningham',
    name: 'Fortis Hospital',
    category: 'BEST VALUE',
    rating: 4.8,
    distanceKm: 4.1,
    locationName: 'Cunningham Road, Bangalore',
    costRange: '₹1.5L - ₹1.8L',
    websiteUrl: 'https://www.fortishealthcare.com',
    isPrimary: false
  }
];

export const detailedHospitalsList: DetailedHospitalProfile[] = [
  {
    id: 'apollo-1',
    name: 'Apollo Hospitals',
    shortName: 'Apollo Bangalore',
    tagline: 'Leading Multi-Speciality Tertiary Care Hospital',
    location: 'Bannerghatta Road, Bangalore',
    address: '#154/11, Opp. IIM-B, Bannerghatta Road, Bangalore, Karnataka 560076',
    city: 'Bangalore',
    distanceKm: 1.2,
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
    bannerUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    accreditation: ['JCI Accredited', 'NABH Certified', 'NABL Pathology', 'Green Hospital'],
    rating: 4.8,
    reviewsCount: 1240,
    establishedYear: 2007,
    bedCapacity: 500,
    icuBedsCount: 90,
    modularOTsCount: 14,
    emergencyCare24x7: true,
    roboticSurgery: true,
    phone: '+91 80 2630 4050',
    email: 'concierge@apollohospitals.com',
    websiteUrl: 'https://www.apollohospitals.com',
    specialties: [
      'Gastroenterology & GI Surgery',
      'Joint Replacement & Orthopaedics',
      'Cardiology & Cardiac Surgery',
      'Oncology (Cancer Institute)',
      'Neurology & Neurosurgery',
      'Urology & Nephrology'
    ],
    supportedInsurances: [
      'HDFC Ergo',
      'Star Health',
      'ICICI Lombard',
      'Max Bupa / Niva Bupa',
      'Care Health',
      'Bajaj Allianz',
      'Tata AIG'
    ],
    doctors: [
      {
        id: 'dr-sk-nair',
        name: 'Dr. S. K. Nair',
        designation: 'Senior Director - Laparoscopic & GI Surgery',
        specialty: 'Minimal Access Surgery & Hepatobiliary',
        qualification: 'MBBS, MS (Gen Surg), FRCS (Glasgow)',
        experienceYears: 22,
        rating: 4.9,
        opdTimings: 'Mon - Sat: 10:00 AM - 02:00 PM'
      },
      {
        id: 'dr-prakash-rao',
        name: 'Dr. Prakash Rao',
        designation: 'Head of Department - Orthopaedics',
        specialty: 'Robotic Knee & Hip Joint Replacement',
        qualification: 'MBBS, MS (Ortho), MCh (Ortho, UK)',
        experienceYears: 26,
        rating: 4.8,
        opdTimings: 'Mon - Fri: 11:30 AM - 04:00 PM'
      }
    ],
    overviewText: 'Apollo Hospitals Bannerghatta Road is a premier 500-bedded tertiary care super speciality hospital equipped with state-of-the-art robotic surgical suites, advanced 3T MRI diagnostic imaging, and an integrated 24/7 emergency care center. It holds dual international JCI and national NABH accreditations.',
    keyHighlights: [
      'Dedicated 24/7 Cashless Insurance Approval Desk',
      'Da Vinci Xi Robotic Surgery Platform',
      'Zero-Infection Modular Operation Theatres with HEPA Filters',
      'International Patient Lounge & Personal Medical Concierge'
    ],
    costIndications: [
      { procedureName: 'Laparoscopic Cholecystectomy', avgCostINR: 185000, rangeText: '₹1.75L - ₹2.10L' },
      { procedureName: 'Total Knee Replacement (Unilateral)', avgCostINR: 345000, rangeText: '₹3.20L - ₹3.70L' },
      { procedureName: 'Angioplasty with Stent', avgCostINR: 220000, rangeText: '₹2.00L - ₹2.50L' }
    ],
    reviews: [
      {
        patientName: 'Ramesh K.',
        procedure: 'Laparoscopic Gallbladder Surgery',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Outstanding care by Dr. S. K. Nair and the surgical nursing team. The TPA cashless desk processed my HDFC Ergo claim in under 45 minutes without any hassle.'
      },
      {
        patientName: 'Priya Sundaram',
        procedure: 'Robotic Knee Replacement',
        rating: 5,
        date: '1 month ago',
        comment: 'Clean single deluxe room, compassionate staff, and pain-free recovery guidance. Highly recommend Apollo Bannerghatta.'
      }
    ]
  },
  {
    id: 'fortis-1',
    name: 'Fortis Hospital',
    shortName: 'Fortis Cunningham',
    tagline: 'Excellence in Minimal Access Surgery & GI Sciences',
    location: 'Cunningham Road, Bangalore',
    address: '14, Cunningham Rd, Vasanth Nagar, Bangalore, Karnataka 560052',
    city: 'Bangalore',
    distanceKm: 2.1,
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUoaDfXwgwTwAhL-iEtHW7HNmamkQXxPApgBT6AwVIuZTywxYyk3q7_8u8KTBgIlMfGW_D2DiTbymH5cgFDvvRjjDg1m4py5LhXzZGeX5VPy5ME5dNwR_5YZagBqmRmaeg-Fl-jJoCwUKVJH14oPRmormTZUnjiw4lXALmHYN_pxaZj0LTyeb9ivOIxVAHlU0YpI4uQaoR6Mgt95H8kZfJuNBFeT1CFwdBtreoMbXD_25bOI3S0zii',
    bannerUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    accreditation: ['NABH Accredited', 'NABL Pathology', 'ISO 9001:2015'],
    rating: 4.6,
    reviewsCount: 890,
    establishedYear: 2011,
    bedCapacity: 280,
    icuBedsCount: 55,
    modularOTsCount: 9,
    emergencyCare24x7: true,
    roboticSurgery: false,
    phone: '+91 80 4199 4444',
    email: 'contact.cunningham@fortishealthcare.com',
    websiteUrl: 'https://www.fortishealthcare.com',
    specialties: [
      'Gastroenterology & GI Surgery',
      'General & Laparoscopic Surgery',
      'Cardiology & Vascular Medicine',
      'Urology & Kidney Care',
      'Orthopaedics & Joint Care'
    ],
    supportedInsurances: [
      'All Major TPAs',
      'ICICI Lombard',
      'HDFC Ergo',
      'Star Health',
      'Niva Bupa',
      'Religare Health'
    ],
    doctors: [
      {
        id: 'dr-meera-rao',
        name: 'Dr. Meera Rao',
        designation: 'Senior Consultant - Surgical Gastroenterology',
        specialty: 'Advanced Laparoscopic & Bariatric Surgery',
        qualification: 'MBBS, MS, DNB (Surg Gastro)',
        experienceYears: 18,
        rating: 4.8,
        opdTimings: 'Mon - Sat: 09:30 AM - 01:30 PM'
      }
    ],
    overviewText: 'Fortis Hospital Cunningham Road is a renowned multi-speciality hospital recognized for high success rates in minimally invasive laparoscopic surgeries, comprehensive gastroenterology care, and transparent patient pricing.',
    keyHighlights: [
      'Transparent Itemized Pricing & AI Procurement Match',
      '98% Cashless Pre-Approval Rate with Major TPAs',
      'Comprehensive Day-Care Surgical Center',
      'Personalized Post-Operative Rehabilitation Program'
    ],
    costIndications: [
      { procedureName: 'Laparoscopic Cholecystectomy', avgCostINR: 152400, rangeText: '₹1.45L - ₹1.70L' },
      { procedureName: 'Laparoscopic Hernia Repair', avgCostINR: 135000, rangeText: '₹1.25L - ₹1.50L' }
    ],
    reviews: [
      {
        patientName: 'Anil Deshmukh',
        procedure: 'Gallbladder Removal',
        rating: 5,
        date: '3 weeks ago',
        comment: 'Dr. Meera Rao explained the entire procedure transparently. Surgery went smoothly and I was discharged in under 36 hours!'
      }
    ]
  },
  {
    id: 'max-1',
    name: 'Max Super Speciality Hospital',
    shortName: 'Max Super Speciality',
    tagline: 'World-Class Clinical Expertise & Surgical Innovation',
    location: 'Saket / Sarita Vihar, New Delhi',
    address: '1, 2, Press Enclave Marg, Saket Institutional Area, New Delhi 110017',
    city: 'New Delhi',
    distanceKm: 3.5,
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoiT5b80PFlkR3VAlxIYks2T3SDDCp70m3QXrZ4DubkXZi9U1gDgEmbXPGdfwii2LG9sBsjYsPXyQuQjF17TPWpnDnQPSLg74NJiiFOFZalnuwBFlIikdAnlvMKGijnKhZRVMUsQ39b6I1Q_XqLBvJnxHb7Yy3KVFiTHYc6t8pAatQ7eJbjqSatS9POZ38UKpogrsGsHYn0o0vNvTYzbQ-KqFqXd7JRgfXOjDpd3pbx6eK3C1ixVvy',
    bannerUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    accreditation: ['JCI Accredited', 'NABH Accredited', 'NABL Certified'],
    rating: 4.9,
    reviewsCount: 1580,
    establishedYear: 2006,
    bedCapacity: 550,
    icuBedsCount: 110,
    modularOTsCount: 18,
    emergencyCare24x7: true,
    roboticSurgery: true,
    phone: '+91 11 2651 5050',
    email: 'info.saket@maxhealthcare.com',
    websiteUrl: 'https://www.maxhealthcare.in',
    specialties: [
      'Surgical Gastroenterology',
      'Robotic Surgery Sciences',
      'Orthopaedics & Joint Replacement',
      'Cardiology & Cardiac Surgery',
      'Nephrology & Renal Transplant'
    ],
    doctors: [
      {
        id: 'dr-aman-gupta',
        name: 'Dr. Aman Gupta',
        designation: 'HOD - Surgical Gastroenterology & Bariatric Unit',
        specialty: 'Robotic & GI Minimal Invasive Surgery',
        qualification: 'MBBS, MS, Fellowship Robotic Surgery (USA)',
        experienceYears: 24,
        rating: 4.9,
        opdTimings: 'Mon - Fri: 10:00 AM - 03:00 PM'
      }
    ],
    supportedInsurances: ['Niva Bupa', 'Care Health', 'HDFC Ergo', 'Star Health', 'ICICI Lombard'],
    overviewText: 'Max Super Speciality Hospital Saket is one of North India’s premier healthcare destinations, featuring 550 beds, advanced Da Vinci robotic surgical platforms, comprehensive organ transplant institutes, and round-the-clock emergency care.',
    keyHighlights: [
      'Suite & Private Deluxe Deluxe Room Packages',
      'Robotic Navigation & Minimal Infiltration Surgical Suites',
      'International Patient Desk & Multilingual Interpreters',
      'Onsite Pharmacy & Advanced Diagnostic Imaging Hub'
    ],
    costIndications: [
      { procedureName: 'Robotic Cholecystectomy', avgCostINR: 210000, rangeText: '₹1.90L - ₹2.30L' },
      { procedureName: 'Bilateral Total Knee Replacement', avgCostINR: 480000, rangeText: '₹4.50L - ₹5.20L' }
    ],
    reviews: [
      {
        patientName: 'Sunil Malhotra',
        procedure: 'Robotic Laparoscopic Surgery',
        rating: 5,
        date: '1 month ago',
        comment: 'Dr. Aman Gupta and team delivered top tier treatment. Private room amenities felt like a luxury hotel, and recovery was completely seamless.'
      }
    ]
  },
  {
    id: 'apollo-spectra',
    name: 'Apollo Spectra Hospitals',
    shortName: 'Apollo Spectra',
    tagline: 'Specialized Short-Stay Surgical Center',
    location: 'Kailash Colony, New Delhi',
    address: 'A-19, Kailash Colony, New Delhi, Delhi 110048',
    city: 'New Delhi',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
    bannerUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
    accreditation: ['NABH Accredited', 'NABL Certified'],
    rating: 4.9,
    reviewsCount: 620,
    establishedYear: 2014,
    bedCapacity: 60,
    icuBedsCount: 12,
    modularOTsCount: 4,
    emergencyCare24x7: true,
    roboticSurgery: false,
    phone: '+91 11 4000 0100',
    email: 'spectra.kailash@apollohospitals.com',
    websiteUrl: 'https://www.apollospectra.com',
    specialties: [
      'General & Laparoscopic Surgery',
      'Bariatric Surgery',
      'ENT & Head-Neck Surgery',
      'Orthopaedics & Arthroscopy',
      'Urology & Day-care Surgery'
    ],
    doctors: [
      {
        id: 'dr-kavita-sharma',
        name: 'Dr. Kavita Sharma',
        designation: 'Senior Laparoscopic Consultant',
        specialty: 'Minimal Invasive Day-Care Surgery',
        qualification: 'MBBS, MS (Gen Surg)',
        experienceYears: 16,
        rating: 4.9,
        opdTimings: 'Mon - Sat: 11:00 AM - 03:00 PM'
      }
    ],
    supportedInsurances: ['HDFC Ergo', 'Star Health', 'ICICI Lombard', 'Care Health'],
    overviewText: 'Apollo Spectra Hospitals provides state-of-the-art short-stay surgical care with simplified admissions, high infection control standards, and budget-friendly day-care surgical packages.',
    keyHighlights: [
      'Simplified 30-Minute Admission & Discharge Workflow',
      'Dedicated Single-Patient Recovery Bays',
      'High Cost Affordability & Direct Cashless Desk',
      'Personalized One-on-One Nursing Care'
    ],
    costIndications: [
      { procedureName: 'Laparoscopic Cholecystectomy', avgCostINR: 115000, rangeText: '₹85,000 - ₹1.25L' },
      { procedureName: 'Laparoscopic Hernioplasty', avgCostINR: 95000, rangeText: '₹80,000 - ₹1.10L' }
    ],
    reviews: [
      {
        patientName: 'Vikas Sharma',
        procedure: 'Day-care Gallbladder Surgery',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Super fast admission, zero waiting time, extremely clean environment, and very affordable pricing compared to corporate giants.'
      }
    ]
  }
];

export const initialAdminUsers: AdminUser[] = [
  {
    id: 'usr-admin-super',
    name: 'Super Admin (+919246195689)',
    email: 'admin@mediquote.ai',
    role: 'System Admin',
    status: 'Active',
    joinedDate: 'Production Active',
    casesSubmitted: 156
  },
  {
    id: 'fam-1',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@gmail.com',
    role: 'Patient',
    status: 'Active',
    joinedDate: '12 Oct 2023',
    casesSubmitted: 2
  },
  {
    id: 'fam-3',
    name: 'Rameshwar Mehta',
    email: 'rameshwar.m@gmail.com',
    role: 'Patient',
    status: 'Active',
    joinedDate: '20 Sep 2023',
    casesSubmitted: 1
  },
  {
    id: 'fam-2',
    name: 'Priya Mehta',
    email: 'priya.m@gmail.com',
    role: 'Patient',
    status: 'Active',
    joinedDate: '15 Sep 2023',
    casesSubmitted: 1
  },
  {
    id: 'fam-4',
    name: 'Ananya Mehta',
    email: 'ananya.m@gmail.com',
    role: 'Patient',
    status: 'Active',
    joinedDate: '01 Aug 2023',
    casesSubmitted: 1
  },
  {
    id: 'usr-pt-105',
    name: 'Sunita Verma',
    email: 'sunita.verma@yahoo.in',
    role: 'Patient',
    status: 'Active',
    joinedDate: '05 Nov 2023',
    casesSubmitted: 1
  },
  {
    id: 'usr-pt-106',
    name: 'Rajesh Malhotra',
    email: 'rajesh.malhotra@hotmail.com',
    role: 'Patient',
    status: 'Active',
    joinedDate: '18 Nov 2023',
    casesSubmitted: 1
  },
  {
    id: 'usr-pt-107',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@gmail.com',
    role: 'Patient',
    status: 'Active',
    joinedDate: '02 Dec 2023',
    casesSubmitted: 1
  },
  {
    id: 'usr-pt-108',
    name: 'Deepak Sharma',
    email: 'deepak.sharma@outlook.com',
    role: 'Patient',
    status: 'Active',
    joinedDate: '10 Dec 2023',
    casesSubmitted: 1
  },
  {
    id: 'usr-102',
    name: 'Dr. S. K. Nair',
    email: 'dr.sknair@apollohospitals.com',
    role: 'Doctor',
    status: 'Active',
    assignedHospital: 'Apollo Hospitals',
    joinedDate: '15 Jan 2022',
    casesSubmitted: 42
  },
  {
    id: 'usr-103',
    name: 'Dr. Meera Rao',
    email: 'dr.meera@fortis.com',
    role: 'Doctor',
    status: 'Active',
    assignedHospital: 'Fortis Hospital',
    joinedDate: '02 Mar 2022',
    casesSubmitted: 28
  },
  {
    id: 'usr-104',
    name: 'Priya Sharma (Admission Desk)',
    email: 'admissions@maxhealthcare.in',
    role: 'Hospital Coordinator',
    status: 'Active',
    assignedHospital: 'Max Super Speciality Hospital',
    joinedDate: '18 Aug 2023',
    casesSubmitted: 110
  }
];

export const initialAdminHospitals: AdminHospital[] = [
  {
    id: 'hosp-admin-1',
    name: 'Apollo Hospitals Bannerghatta',
    city: 'Bangalore',
    status: 'Active',
    rating: 4.8,
    bedCapacity: 500,
    websiteUrl: 'https://www.apollohospitals.com',
    contactPerson: 'Dr. S. K. Nair / Admin',
    phone: '+91 80 2630 4050',
    activeSurgeonsCount: 24
  },
  {
    id: 'hosp-admin-2',
    name: 'Fortis Hospital Cunningham',
    city: 'Bangalore',
    status: 'Active',
    rating: 4.6,
    bedCapacity: 280,
    websiteUrl: 'https://www.fortishealthcare.com',
    contactPerson: 'Pooja Reddy / Desk',
    phone: '+91 80 4199 4444',
    activeSurgeonsCount: 18
  },
  {
    id: 'hosp-admin-3',
    name: 'Max Super Speciality Saket',
    city: 'New Delhi',
    status: 'Active',
    rating: 4.9,
    bedCapacity: 550,
    websiteUrl: 'https://www.maxhealthcare.in',
    contactPerson: 'Priya Sharma Coordinator',
    phone: '+91 11 2651 5050',
    activeSurgeonsCount: 32
  },
  {
    id: 'hosp-admin-4',
    name: 'Apollo Spectra Kailash Colony',
    city: 'New Delhi',
    status: 'Active',
    rating: 4.9,
    bedCapacity: 60,
    websiteUrl: 'https://www.apollospectra.com',
    contactPerson: 'Dr. Kavita Sharma',
    phone: '+91 11 4000 0100',
    activeSurgeonsCount: 8
  },
  {
    id: 'hosp-admin-5',
    name: 'City Care Uncertified Nursing Home',
    city: 'Mumbai',
    status: 'Blocked',
    rating: 2.1,
    bedCapacity: 15,
    websiteUrl: 'http://citycarenursing.org',
    contactPerson: 'Unverified Admin',
    phone: '+91 22 9999 8888',
    activeSurgeonsCount: 1
  }
];

