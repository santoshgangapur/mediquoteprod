import React, { useState } from 'react';
import { ViewMode, MedicalRecord, SurgicalCase, HospitalQuote, FinancingOption, UserPersona, FamilyMember, PatientProfile } from './types';
import {
  initialPatientProfile,
  initialHealthMetrics,
  initialCases,
  initialMedicalRecords,
  initialAppointments,
  defaultFinancingOptions,
  initialAdminUsers,
  initialAdminHospitals,
  initialPersonas,
  initialFamilyMembers,
} from './data/mockData';

import { MobileAuthModal } from './components/MobileAuthModal';
import { VirtualSmsInboxWidget } from './components/VirtualSmsInboxWidget';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { FamilyProfilesView } from './components/FamilyProfilesView';
import { UploadCentralView } from './components/UploadCentralView';
import { QuotationComparisonView } from './components/QuotationComparisonView';
import { CheckoutView } from './components/CheckoutView';
import { RecommendationsMapView } from './components/RecommendationsMapView';
import { HospitalProfileView } from './components/HospitalProfileView';
import { NewCaseView } from './components/NewCaseView';
import { DoctorPortalView } from './components/DoctorPortalView';
import { AdminView } from './components/AdminView';
import { LandingView } from './components/LandingView';
import { MedicalTourismView } from './components/MedicalTourismView';
import { SecuredVaultView } from './components/SecuredVaultView';

import { NewCaseModal } from './components/NewCaseModal';
import { QuoteDetailsModal } from './components/QuoteDetailsModal';
import { ShareModal } from './components/ShareModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';

export const App: React.FC = () => {
  const [personas, setPersonas] = useState<UserPersona[]>(initialPersonas);
  const [activePersona, setActivePersona] = useState<UserPersona>(initialPersonas[0]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [activeFamilyMemberId, setActiveFamilyMemberId] = useState<string>(initialFamilyMembers[0]?.id || 'fam-1');

  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [patientProfile, setPatientProfile] = useState(initialPatientProfile);
  const [healthMetrics, setHealthMetrics] = useState(initialHealthMetrics);
  const [cases, setCases] = useState<SurgicalCase[]>(initialCases);
  const [records, setRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [adminHospitals, setAdminHospitals] = useState(initialAdminHospitals);

  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-1');
  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const [selectedHospitalForBooking, setSelectedHospitalForBooking] = useState<HospitalQuote>(
    activeCase?.hospitals[1] || activeCase?.hospitals[0]
  );
  const [selectedFinancing, setSelectedFinancing] = useState<FinancingOption>(defaultFinancingOptions[0]);
  const [selectedHospitalProfileId, setSelectedHospitalProfileId] = useState<string>('apollo-1');

  // Authentication State for Production Mobile Login (+919246195689 as Super Admin)
  const [authUser, setAuthUser] = useState<{
    mobileNumber: string;
    role: 'admin' | 'patient' | 'hospital' | 'insurance' | 'finance';
    name: string;
  } | null>({
    mobileNumber: '+919246195689',
    role: 'admin',
    name: 'Super Admin',
  });
  const [isMobileAuthModalOpen, setIsMobileAuthModalOpen] = useState(false);

  // Search Query state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isQuoteDetailsModalOpen, setIsQuoteDetailsModalOpen] = useState(false);
  const [selectedQuoteDetailsHospital, setSelectedQuoteDetailsHospital] = useState<HospitalQuote | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBookingSuccessModalOpen, setIsBookingSuccessModalOpen] = useState(false);

  // Handlers
  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateCase = (newCase: SurgicalCase) => {
    setCases([newCase, ...cases]);
    setSelectedCaseId(newCase.id);
    if (newCase.patientMemberId) {
      setActiveFamilyMemberId(newCase.patientMemberId);
    }
    setCurrentView('quotes');
  };

  const handleAddRecords = (newRecs: MedicalRecord[]) => {
    setRecords([...newRecs, ...records]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const handleSelectHospitalForBooking = (hospital: HospitalQuote) => {
    setSelectedHospitalForBooking(hospital);
    setCurrentView('checkout');
  };

  const handleViewQuoteDetails = (hospital: HospitalQuote) => {
    setSelectedQuoteDetailsHospital(hospital);
    setIsQuoteDetailsModalOpen(true);
  };

  const handleViewHospitalProfile = (hospitalId: string) => {
    // Map hospital IDs if needed
    if (hospitalId.includes('apollo')) {
      setSelectedHospitalProfileId('apollo-1');
    } else if (hospitalId.includes('fortis')) {
      setSelectedHospitalProfileId('fortis-1');
    } else if (hospitalId.includes('max')) {
      setSelectedHospitalProfileId('max-1');
    } else {
      setSelectedHospitalProfileId(hospitalId);
    }
    setCurrentView('hospital-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = (financing: FinancingOption) => {
    setSelectedFinancing(financing);
    setIsBookingSuccessModalOpen(true);
  };

  const handleUpdatePatientProfile = (updated: Partial<PatientProfile>) => {
    setPatientProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateCaseQuotation = (caseId: string, updatedQuote: HospitalQuote) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id === caseId) {
          const existingHospitals = c.hospitals || [];
          const exists = existingHospitals.some(
            (h) => h.hospitalName.toLowerCase() === updatedQuote.hospitalName.toLowerCase()
          );

          const updatedHospitals = exists
            ? existingHospitals.map((h) =>
                h.hospitalName.toLowerCase() === updatedQuote.hospitalName.toLowerCase() ? updatedQuote : h
              )
            : [updatedQuote, ...existingHospitals];

          return {
            ...c,
            hospitals: updatedHospitals,
            quotesReadyCount: updatedHospitals.length,
          };
        }
        return c;
      })
    );
  };

  const handleUpdateCaseAnalysis = (caseId: string, updatedAnalysis: any, updatedHospitals?: HospitalQuote[]) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            aiClinicalAnalysis: {
              overallHealthScore: updatedAnalysis.overallHealthScore || 85,
              reportSourceText: c.aiClinicalAnalysis?.reportSourceText || 'Uploaded Medical Documents & History',
              reportAnalysisSummary: updatedAnalysis.reportAnalysisSummary,
              hospitalSelectionReasoning: updatedAnalysis.hospitalSelectionReasoning,
              healthIssuesDetected: updatedAnalysis.healthIssuesDetected,
              treatmentRecommendation: updatedAnalysis.treatmentRecommendation,
            },
            hospitals: updatedHospitals && updatedHospitals.length > 0 ? updatedHospitals : c.hospitals,
            aiPrimaryRecommendationReason: `AI analyzed patient reports and symptoms. Primary recommendation: ${updatedAnalysis.treatmentRecommendation.bestTreatmentProcedure} for ${updatedAnalysis.conditionName || updatedAnalysis.selectedTitle}.`,
          };
        }
        return c;
      })
    );
  };

  const handleLogout = () => {
    setAuthUser(null);
    setCurrentView('landing');
    setIsMobileAuthModalOpen(true);
  };

  // Filter records and cases strictly by activeFamilyMemberId and searchQuery
  const memberRecords = records.filter((r) => r.patientMemberId === activeFamilyMemberId);
  const filteredRecords = memberRecords.filter((r) =>
    r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const memberCases = cases.filter((c) => c.patientMemberId === activeFamilyMemberId);

  return (
    <div className="min-h-screen bg-[#f3faff] text-[#071e27] font-sans antialiased selection:bg-[#81f3e5] selection:text-[#00201d]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        activePersona={activePersona}
        onNavigate={handleNavigate}
        onStartNewCase={() => handleNavigate('new-case')}
        authUser={authUser}
        onOpenAuthModal={() => setIsMobileAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Top Header */}
      <TopHeader
        currentView={currentView}
        patientProfile={patientProfile}
        searchQuery={searchQuery}
        familyMembers={familyMembers}
        activeFamilyMemberId={activeFamilyMemberId}
        onSelectFamilyMember={setActiveFamilyMemberId}
        onSearchChange={setSearchQuery}
        onNavigate={handleNavigate}
        onUpdatePatientProfile={handleUpdatePatientProfile}
        authUser={authUser}
        onOpenAuthModal={() => setIsMobileAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="lg:ml-64 pt-20 px-4 md:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] pb-20 lg:pb-12">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={handleNavigate}
            onStartNewCase={() => handleNavigate('new-case')}
            personas={personas}
            onSelectPersona={setActivePersona}
            onViewHospitalProfile={handleViewHospitalProfile}
            onOpenAuthModal={() => setIsMobileAuthModalOpen(true)}
            authUser={authUser}
          />
        )}

        {currentView === 'family' && (
          <FamilyProfilesView
            familyMembers={familyMembers}
            cases={cases}
            onAddFamilyMember={(newMember) => setFamilyMembers([...familyMembers, newMember])}
            onSelectMemberForNewCase={(member) => {
              handleNavigate('new-case');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'new-case' && (
          <NewCaseView
            existingRecords={records}
            familyMembers={familyMembers}
            onAddRecords={handleAddRecords}
            onCreateCase={handleCreateCase}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'doctor-portal' && (
          <DoctorPortalView
            cases={cases}
            medicalRecords={records}
            onUpdateCaseQuotation={handleUpdateCaseQuotation}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            users={adminUsers}
            hospitals={adminHospitals}
            medicalRecords={records}
            onUpdateUsers={setAdminUsers}
            onUpdateHospitals={setAdminHospitals}
            onUpdateRecords={setRecords}
            onNavigate={handleNavigate}
            authUser={authUser}
            onOpenAuthModal={() => setIsMobileAuthModalOpen(true)}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            patientProfile={patientProfile}
            healthMetrics={healthMetrics}
            activeCases={memberCases.length > 0 ? memberCases : cases}
            recentRecords={filteredRecords}
            appointments={appointments}
            familyMembers={familyMembers}
            activeFamilyMemberId={activeFamilyMemberId}
            onSelectFamilyMember={setActiveFamilyMemberId}
            onNavigate={handleNavigate}
            onStartNewCase={() => handleNavigate('new-case')}
            onSelectCase={(id) => {
              setSelectedCaseId(id);
              handleNavigate('quotes');
            }}
            onSelectRecord={(rec) => alert(`Downloading ${rec.fileName}...`)}
            onViewHospitalProfile={handleViewHospitalProfile}
          />
        )}

        {currentView === 'upload' && (
          <UploadCentralView
            records={records}
            familyMembers={familyMembers}
            activeFamilyMemberId={activeFamilyMemberId}
            onSelectFamilyMember={setActiveFamilyMemberId}
            onAddRecords={handleAddRecords}
            onDeleteRecord={handleDeleteRecord}
            onNavigate={handleNavigate}
          />
        )}

        {(currentView === 'quotes' || currentView === 'cases') && (
          <QuotationComparisonView
            currentCase={activeCase}
            onSelectHospitalForBooking={handleSelectHospitalForBooking}
            onViewQuoteDetails={handleViewQuoteDetails}
            onViewHospitalProfile={handleViewHospitalProfile}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onNavigate={handleNavigate}
            onUpdateCaseAnalysis={handleUpdateCaseAnalysis}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            selectedHospital={selectedHospitalForBooking}
            currentCase={activeCase}
            onConfirmBooking={handleConfirmBooking}
            onBackToQuotes={() => handleNavigate('quotes')}
          />
        )}

        {(currentView === 'hospitals' || currentView === 'hospital-profile' || currentView === 'recommendations') && (
          <HospitalProfileView
            selectedHospitalId={selectedHospitalProfileId}
            onSelectHospitalId={setSelectedHospitalProfileId}
            onNavigate={handleNavigate}
            onRequestQuoteForHospital={() => handleNavigate('new-case')}
            initialViewType={currentView === 'recommendations' ? 'map' : 'grid'}
          />
        )}

        {currentView === 'medical-tourism' && (
          <MedicalTourismView
            onNavigate={handleNavigate}
            onStartNewCase={() => handleNavigate('new-case')}
          />
        )}

        {currentView === 'records' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <SecuredVaultView
              currentUserMobile={authUser?.mobileNumber || '+919246195689'}
              familyMembers={familyMembers}
              onNavigateToUpload={() => handleNavigate('upload')}
              records={records}
              onAddRecords={handleAddRecords}
              onDeleteRecord={handleDeleteRecord}
            />
          </div>
        )}

        {currentView === 'account' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-[#c3c6d4]">
                <img
                  src={patientProfile.avatarUrl}
                  alt={patientProfile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#003178]"
                />
                <div>
                  <h2 className="text-[20px] font-bold text-[#071e27]">{patientProfile.name}</h2>
                  <p className="text-[13px] text-[#737783] font-mono-data">Patient ID: {patientProfile.patientId}</p>
                </div>
              </div>

              <div className="space-y-4 text-[14px]">
                <div className="flex justify-between py-2 border-b border-[#c3c6d4]/50">
                  <span className="text-[#434652] font-medium">Insurance Provider:</span>
                  <strong className="text-[#003178]">{patientProfile.insuranceProvider}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-[#c3c6d4]/50">
                  <span className="text-[#434652] font-medium">Policy Number:</span>
                  <strong className="text-[#071e27] font-mono-data">{patientProfile.insurancePolicyNumber}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-[#c3c6d4]/50">
                  <span className="text-[#434652] font-medium">Dedicated Care Concierge:</span>
                  <strong className="text-[#006f66]">+91-800-425-9921</strong>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="px-5 py-2.5 bg-[#003178] text-white font-bold text-[14px] rounded-xl hover:bg-[#0d47a1]"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Page Footer */}
      <div className="lg:ml-64">
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />

      {/* Interactive Modals */}
      <MobileAuthModal
        isOpen={isMobileAuthModalOpen}
        onClose={() => setIsMobileAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setAuthUser(user);
          if (user.role === 'admin') {
            handleNavigate('admin');
          } else if (user.role === 'hospital') {
            handleNavigate('doctor-portal');
          } else {
            handleNavigate('dashboard');
          }
        }}
        defaultMobile={authUser?.mobileNumber || '+919246195689'}
      />

      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        familyMembers={familyMembers}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCreateCase={handleCreateCase}
      />

      <QuoteDetailsModal
        hospital={selectedQuoteDetailsHospital}
        onClose={() => setIsQuoteDetailsModalOpen(false)}
        onProceedToBooking={handleSelectHospitalForBooking}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        caseCode={activeCase.caseCode}
      />

      <BookingSuccessModal
        isOpen={isBookingSuccessModalOpen}
        hospital={selectedHospitalForBooking}
        financing={selectedFinancing}
        onClose={() => {
          setIsBookingSuccessModalOpen(false);
          handleNavigate('dashboard');
        }}
      />

      {/* Floating Free SMS Telecom Receiver & Inbox Widget */}
      <VirtualSmsInboxWidget />
    </div>
  );
};

export default App;
