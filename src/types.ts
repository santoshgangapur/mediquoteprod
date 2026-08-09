export type ViewMode = 'landing' | 'dashboard' | 'cases' | 'family' | 'upload' | 'quotes' | 'checkout' | 'recommendations' | 'records' | 'account' | 'hospitals' | 'hospital-profile' | 'new-case' | 'doctor-portal' | 'admin' | 'medical-tourism' | 'privacy' | 'terms' | 'disclaimer' | 'abha-guide' | 'copyright' | 'legal';

export type PersonaRole = 'patient' | 'hospital' | 'insurance' | 'doctor';

export interface UserPersona {
  id: string;
  name: string;
  roleTitle: string;
  avatarUrl?: string;
  email: string;
  hospitalName?: string;
  badgeText: string;
  description: string;
  allowedViews: ViewMode[];
}

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: 'Self (Primary)' | 'Spouse' | 'Father' | 'Mother' | 'Son' | 'Daughter' | 'Dependent';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  preExistingConditions: string[];
  allergies: string[];
  activeCasesCount: number;
  avatarColor: string;
  insurancePolicyNumber?: string;
}

export interface HospitalEmailDispatch {
  hospitalId: string;
  hospitalName: string;
  email: string;
  sentTimestamp: string;
  status: 'Email Dispatched' | 'Received & Opened' | 'Preparing Quote' | 'Quotation Offered';
  responseCostEstimateINR?: number;
  responseTpaStatus?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Patient' | 'Doctor' | 'Hospital Coordinator' | 'System Admin';
  status: 'Active' | 'Blocked' | 'Pending Verification';
  joinedDate: string;
  assignedHospital?: string;
  casesSubmitted: number;
}

export interface AdminHospital {
  id: string;
  name: string;
  city: string;
  status: 'Active' | 'Blocked' | 'Under Audit';
  rating: number;
  bedCapacity: number;
  websiteUrl: string;
  contactPerson: string;
  phone: string;
  activeSurgeonsCount: number;
}

export interface PatientVitals {
  systolicBP?: number;
  diastolicBP?: number;
  bloodPressureStr?: string; // e.g. "128/84 mmHg"
  fastingSugarMgDl?: number;
  ppSugarMgDl?: number;
  hba1cPercent?: number;
  heartRateBpm?: number;
  spO2Percent?: number;
  weightKg?: number;
  heightCm?: number;
  allergies?: string[];
  preExistingConditions?: string[];
  symptomsList?: string[];
  symptomsDuration?: string;
  notesForDoctor?: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  designation: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  imageUrl?: string;
  opdTimings: string;
}

export interface DetailedHospitalProfile {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  location: string;
  address: string;
  city: string;
  distanceKm?: number;
  logoUrl: string;
  bannerUrl: string;
  accreditation: string[]; // e.g. ['NABH Accredited', 'JCI Certified', 'NABL Lab']
  rating: number;
  reviewsCount: number;
  establishedYear: number;
  bedCapacity: number;
  icuBedsCount: number;
  modularOTsCount: number;
  emergencyCare24x7: boolean;
  roboticSurgery: boolean;
  phone: string;
  email: string;
  websiteUrl?: string;
  specialties: string[];
  supportedInsurances: string[];
  doctors: DoctorProfile[];
  overviewText: string;
  keyHighlights: string[];
  costIndications: {
    procedureName: string;
    avgCostINR: number;
    rangeText: string;
  }[];
  reviews: {
    patientName: string;
    procedure: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export interface PatientProfile {
  name: string;
  patientId: string;
  avatarUrl: string;
  insurancePolicyNumber?: string;
  insuranceProvider?: string;
  location?: string;
  countryCode?: string;
  currency?: 'INR' | 'USD' | 'AED' | 'GBP' | 'EUR';
  isInternationalPatient?: boolean;
}

export interface HealthMetrics {
  bloodPressure: string;
  glucoseFasting: number;
  bmi: number;
  bmiCategory: 'Normal' | 'Overweight' | 'Underweight' | 'Elevated';
  bpTrend: number[]; // Trend points for sparkline
}

export interface HospitalQuote {
  id: string;
  hospitalName: string;
  location: string;
  logoUrl: string;
  totalQuoteINR: number;
  badge?: 'AI RECOMMENDED' | 'MOST EXPERIENCED' | 'BEST VALUE' | 'MATCHING' | 'BUDGET FRIENDLY' | 'PREMIUM PARTNER';
  badgeType?: 'primary' | 'secondary' | 'accent' | 'neutral';
  roomInclusion: string;
  roomSubtext: string;
  doctorName: string;
  doctorExp: string;
  doctorSpecialty: string;
  estStay: string;
  supportedInsurance: string[];
  rating: number;
  reviewsCount: number;
  savingsVsAvgPercentage?: number;
  distanceKm?: number;
  costRangeText?: string;
  details: {
    surgicalProcedure: number;
    roomRent: number;
    implantsEquipment: number;
    consultationLabs: number;
    platformDiscount: number;
  };
}

export interface AIConditionAnalysis {
  conditionName: string;
  icdCode?: string;
  findingFromReport: string;
  severity: 'Mild' | 'Moderate' | 'High / Serious' | 'Critical Emergency';
  severityBadgeColor?: string;
  urgencyText: string;
  riskIfDelayed: string;
}

export interface AITreatmentRecommendation {
  bestTreatmentProcedure: string;
  whyBestTreatment: string;
  alternativeTreatmentsEvaluated: {
    treatmentName: string;
    suitabilityScorePercent: number;
    notes: string;
  }[];
  urgencyTimelineDays: string;
  urgencyLevel: 'Elective (Within 30 Days)' | 'Recommended Soon (Within 7-14 Days)' | 'Urgent (Within 48-72 Hours)' | 'Immediate Emergency';
  preOpPreparations: string[];
  postOpCareInstructions: string[];
}

export interface AIClinicalAnalysis {
  overallHealthScore: number;
  reportSourceText?: string;
  healthIssuesDetected: AIConditionAnalysis[];
  treatmentRecommendation: AITreatmentRecommendation;
  reportAnalysisSummary: string;
  hospitalSelectionReasoning: string;
}

export interface SurgicalCase {
  id: string;
  caseCode: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'ACTIVE' | 'ANALYZING' | 'QUOTES_READY' | 'BOOKED' | 'COMPLETED';
  quotesReadyCount: number;
  hospitals: HospitalQuote[];
  aiConfidencePercent: number;
  aiPrimaryRecommendationReason: string;
  insuranceCompatibilityNotice: string;
  costDifferenceText?: string;
  createdDate: string;
  vitals?: PatientVitals;
  attachedRecordIds?: string[];
  uploadedFilesCount?: number;
  aiClinicalAnalysis?: AIClinicalAnalysis;
  patientMemberId?: string;
  patientMemberName?: string;
  hospitalDispatches?: HospitalEmailDispatch[];
}

export interface MedicalRecord {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  category: 'DIAGNOSTIC' | 'RADIOLOGY' | 'PRESCRIPTION' | 'HISTORY' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'BILL_RECEIPT' | 'INSURANCE_CARD' | 'SCAN_MRI';
  fileType: 'pdf' | 'image' | 'zip' | 'docx';
  downloadUrl?: string;
  fileUrl?: string;
  status: 'Uploaded' | 'Uploading' | 'Error';
  progressPercent?: number;
  patientMemberId?: string;
  patientMemberName?: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  title: string;
  dateDay: string;
  dateMonth: string;
  time: string;
  locationOrLink: string;
  type: 'video' | 'in-person';
}

export interface FinancingOption {
  id: '12m_nocost' | '24m_emi' | 'full';
  badge?: string;
  title: string;
  monthlyAmountINR: number;
  subtext: string;
  totalPayableINR: number;
}

export interface AIAnalysisResult {
  patientIdMatch: boolean;
  detectedConditions: string[];
  extractedICD10: string[];
  confidence: number;
  surgicalRequirements: string[];
  recommendedHospitalsCount: number;
  estimatedWaitMins: number;
}

export interface ModerationResponse {
  isSafe: boolean;
  flagCategory?: 'ADULT_EXPLICIT' | 'GRAPHIC_VIOLENCE' | 'DISTURBING_NON_MEDICAL' | 'DANGEROUS_MATERIAL' | 'NONE' | 'SYSTEM_ERROR';
  reason?: string;
  blockedFileName?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  modelNumber: string;
  serialNumber: string;
  category: string;
  imageUrl?: string;
  invoiceUrl?: string;
  invoiceAmountINR?: number;
  specifications: string;
  calibrationStatus: 'Calibrated' | 'Pending Calibration' | 'Maintenance Required';
  safetyStatus: 'Verified Safe' | 'Pending Safety Moderation' | 'Blocked (Safety Violation)';
  lastScannedDate?: string;
  moderationReason?: string;
}

