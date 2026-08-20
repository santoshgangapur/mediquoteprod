import React, { useState, useEffect } from 'react';
import {
  ViewMode,
  MedicalRecord,
  SurgicalCase,
  HospitalQuote,
  FinancingOption,
  UserPersona,
  FamilyMember,
  PatientProfile,
  AuthUser,
} from './types';
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
import {
  initializeDatabase,
  fetchCasesFromCloud,
  fetchHospitalsFromCloud,
  fetchFamilyMembersFromCloud,
  fetchRecordsFromCloud,
  fetchUsersFromCloud,
  saveCaseToCloud,
  deleteCaseFromCloud,
  saveHospitalToCloud,
  deleteHospitalFromCloud,
  saveFamilyMemberToCloud,
  deleteFamilyMemberFromCloud,
  saveRecordToCloud,
  deleteRecordFromCloud,
  saveUserToCloud,
} from './lib/dbService';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { MobileAuthModal } from './components/MobileAuthModal';
import { PhoneVerificationModal } from './components/PhoneVerificationModal';
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
import { LegalLandingPagesView } from './components/LegalLandingPagesView';

import { NewCaseModal } from './components/NewCaseModal';
import { QuoteDetailsModal } from './components/QuoteDetailsModal';
import { ShareModal } from './components/ShareModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { PlayStoreExportModal } from './components/PlayStoreExportModal';

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
    activeCase?.hospitals?.[1] || activeCase?.hospitals?.[0] || initialCases[0]?.hospitals?.[0]
  );
  const [selectedFinancing, setSelectedFinancing] = useState<FinancingOption>(defaultFinancingOptions[0]);
  const [selectedHospitalProfileId, setSelectedHospitalProfileId] = useState<string>('apollo-1');

  // Authentication State with Google OAuth + Email first & deferred phone verification (persisted in localStorage)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('mediquote_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_e) {}
    return null;
  });

  // Sync authUser with localStorage
  useEffect(() => {
    if (authUser) {
      try {
        localStorage.setItem('mediquote_auth_user', JSON.stringify(authUser));
      } catch (_e) {}
    } else {
      localStorage.removeItem('mediquote_auth_user');
    }
  }, [authUser]);

  // Firebase Auth State Listener to maintain persistent session on refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const cleanEmail = firebaseUser.email.trim().toLowerCase();
        const isAdmin = cleanEmail === 'santoshgangapur@gmail.com' || cleanEmail.includes('admin');
        setAuthUser((prev) => {
          if (prev && prev.email && prev.email.toLowerCase() === cleanEmail) {
            return prev;
          }
          const restored: AuthUser = {
            id: firebaseUser.uid || `usr-${Date.now()}`,
            name: firebaseUser.displayName || prev?.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            emailVerified: firebaseUser.emailVerified || true,
            role: isAdmin ? 'admin' : (prev?.role || 'patient'),
            authProvider: 'google',
            avatarUrl: firebaseUser.photoURL || prev?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.displayName || cleanEmail)}`,
            mobileNumber: firebaseUser.phoneNumber || prev?.mobileNumber || '',
            isPhoneVerified: !!firebaseUser.phoneNumber || !!prev?.isPhoneVerified,
            city: prev?.city || 'Bangalore',
            organizationName: prev?.organizationName,
            registrationNo: prev?.registrationNo,
          };
          return restored;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const [isMobileAuthModalOpen, setIsMobileAuthModalOpen] = useState(false);
  const [isPhoneVerificationModalOpen, setIsPhoneVerificationModalOpen] = useState(false);
  const [isPlayStoreExportModalOpen, setIsPlayStoreExportModalOpen] = useState(false);
  const [phoneVerificationPrompt, setPhoneVerificationPrompt] = useState(
    '📱 Please verify your mobile number so hospitals can contact you regarding your quotation.'
  );
  const [pendingActionAfterPhoneVerification, setPendingActionAfterPhoneVerification] = useState<(() => void) | null>(null);

  // Search Query state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isQuoteDetailsModalOpen, setIsQuoteDetailsModalOpen] = useState(false);
  const [selectedQuoteDetailsHospital, setSelectedQuoteDetailsHospital] = useState<HospitalQuote | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBookingSuccessModalOpen, setIsBookingSuccessModalOpen] = useState(false);

  const [isCloudSyncActive, setIsCloudSyncActive] = useState<boolean>(false);

  // Initialize and load persistent data from Cloud Firestore & Server Backend
  useEffect(() => {
    async function loadCloudDatabase() {
      const initResult = await initializeDatabase();
      setIsCloudSyncActive(initResult.cloudActive);

      try {
        const [cloudCases, cloudHospitals, cloudFamily, cloudRecords, cloudUsers] = await Promise.all([
          fetchCasesFromCloud(),
          fetchHospitalsFromCloud(),
          fetchFamilyMembersFromCloud(),
          fetchRecordsFromCloud(),
          fetchUsersFromCloud(),
        ]);

        if (cloudCases && cloudCases.length > 0) setCases(cloudCases);
        if (cloudHospitals && cloudHospitals.length > 0) setAdminHospitals(cloudHospitals);
        if (cloudFamily && cloudFamily.length > 0) setFamilyMembers(cloudFamily);
        if (cloudRecords && cloudRecords.length > 0) setRecords(cloudRecords);
        if (cloudUsers && cloudUsers.length > 0) setAdminUsers(cloudUsers);
      } catch (err) {
        console.warn('Error loading cloud database:', err);
      }
    }

    loadCloudDatabase();
  }, []);

  const handleRefreshUsers = async () => {
    try {
      const cloudUsers = await fetchUsersFromCloud();
      if (cloudUsers && cloudUsers.length > 0) {
        setAdminUsers(cloudUsers);
      }
    } catch (err) {
      console.warn('Error refreshing cloud users:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (_e) {}
    localStorage.removeItem('mediquote_auth_user');
    setAuthUser(null);
    handleNavigate('landing');
  };

  // Handlers
  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateCase = (newCase: SurgicalCase) => {
    setCases([newCase, ...cases]);
    saveCaseToCloud(newCase);
    setSelectedCaseId(newCase.id);
    if (newCase.patientMemberId) {
      setActiveFamilyMemberId(newCase.patientMemberId);
    }
    setCurrentView('quotes');
  };

  const handleAddRecords = (newRecs: MedicalRecord[]) => {
    setRecords([...newRecs, ...records]);
    newRecs.forEach((r) => saveRecordToCloud(r));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
    deleteRecordFromCloud(id);
  };

  const handleDeleteFamilyMember = (memberId: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== memberId));
    deleteFamilyMemberFromCloud(memberId);
    if (activeFamilyMemberId === memberId) {
      const remaining = familyMembers.filter((m) => m.id !== memberId);
      if (remaining.length > 0) {
        setActiveFamilyMemberId(remaining[0].id);
      }
    }
  };

  const handleDeleteCase = (caseId: string) => {
    setCases((prev) => prev.filter((c) => c.id !== caseId));
    deleteCaseFromCloud(caseId);
    if (selectedCaseId === caseId) {
      const remaining = cases.filter((c) => c.id !== caseId);
      if (remaining.length > 0) {
        setSelectedCaseId(remaining[0].id);
      }
    }
  };

  // Guard for actions requiring hospital quotation telephone contact
  const handleSelectHospitalForBooking = (hospital: HospitalQuote) => {
    setSelectedHospitalForBooking(hospital);

    // If the patient has not verified their phone number yet, prompt just-in-time
    if (!authUser?.isPhoneVerified || !authUser?.mobileNumber) {
      setPhoneVerificationPrompt('📱 Please verify your mobile number so hospitals can contact you regarding your quotation.');
      setPendingActionAfterPhoneVerification(() => () => {
        setCurrentView('checkout');
      });
      setIsPhoneVerificationModalOpen(true);
      return;
    }

    setCurrentView('checkout');
  };

  const handleViewQuoteDetails = (hospital: HospitalQuote) => {
    setSelectedQuoteDetailsHospital(hospital);
    setIsQuoteDetailsModalOpen(true);
  };

  const handleViewHospitalProfile = (hospitalId: string) => {
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

    if (!authUser?.isPhoneVerified || !authUser?.mobileNumber) {
      setPhoneVerificationPrompt('📱 Verify your mobile number to lock in your surgical slot and receive emergency hospital confirmation.');
      setPendingActionAfterPhoneVerification(() => () => {
        setIsBookingSuccessModalOpen(true);
      });
      setIsPhoneVerificationModalOpen(true);
      return;
    }

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
          const exists = existingHospitals.some((h) => h.id === updatedQuote.id);
          const newHospitals = exists
            ? existingHospitals.map((h) => (h.id === updatedQuote.id ? updatedQuote : h))
            : [...existingHospitals, updatedQuote];
          return { ...c, hospitals: newHospitals };
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
            aiClinicalAnalysis: updatedAnalysis || c.aiClinicalAnalysis,
            aiPrimaryRecommendationReason:
              updatedAnalysis?.treatmentRecommendation?.whyBestTreatment || c.aiPrimaryRecommendationReason,
            insuranceCompatibilityNotice:
              updatedAnalysis?.insurancePreAuthEstimate || c.insuranceCompatibilityNotice,
            hospitals: updatedHospitals && updatedHospitals.length > 0 ? updatedHospitals : c.hospitals,
          };
        }
        return c;
      })
    );
  };

  const handlePhoneVerificationSuccess = (updatedUser: AuthUser) => {
    setAuthUser(updatedUser);

    // Update in admin directory as well
    setAdminUsers((prev) => {
      const existing = prev.find((u) => u.email.toLowerCase() === updatedUser.email.toLowerCase() || u.id === updatedUser.id);
      if (existing) {
        const updated = {
          ...existing,
          mobileNumber: updatedUser.mobileNumber,
          status: 'Active' as const,
        };
        saveUserToCloud(updated);
        return prev.map((u) => (u.id === existing.id ? updated : u));
      }
      return prev;
    });

    if (pendingActionAfterPhoneVerification) {
      const action = pendingActionAfterPhoneVerification;
      setPendingActionAfterPhoneVerification(null);
      action();
    }
  };

  // Filter records and cases by active family member
  const filteredRecords = records.filter(
    (r) => !r.patientMemberId || r.patientMemberId === activeFamilyMemberId
  );
  const memberCases = cases.filter(
    (c) => !c.patientMemberId || c.patientMemberId === activeFamilyMemberId
  );

  return (
    <div className="min-h-screen bg-[#f3faff] flex flex-col font-sans text-[#071e27]">
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
        onOpenPhoneVerificationModal={() => {
          setPhoneVerificationPrompt('📱 Verify your mobile number so hospitals can contact you regarding your quotation.');
          setPendingActionAfterPhoneVerification(null);
          setIsPhoneVerificationModalOpen(true);
        }}
        onOpenPlayStoreModal={() => setIsPlayStoreExportModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Sidebar for Desktop Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onStartNewCase={() => handleNavigate('new-case')}
        activeCasesCount={cases.length}
        recordsCount={records.length}
        familyMembersCount={familyMembers.length}
        userRole={authUser?.role || 'patient'}
        onRoleChange={(newRole) => {
          if (authUser) {
            setAuthUser({ ...authUser, role: newRole as any });
          }
        }}
        onOpenAuthModal={() => setIsMobileAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 px-4 py-6 pt-20 md:px-6 md:pt-22 lg:px-8 lg:pt-24 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={handleNavigate}
            onStartNewCase={() => handleNavigate('new-case')}
            onOpenAuthModal={() => setIsMobileAuthModalOpen(true)}
            onOpenLogin={() => setIsMobileAuthModalOpen(true)}
            onViewHospitalProfile={handleViewHospitalProfile}
            authUser={authUser}
          />
        )}

        {currentView === 'new-case' && (
          <NewCaseView
            existingRecords={records}
            familyMembers={familyMembers}
            activeFamilyMemberId={activeFamilyMemberId}
            onSelectFamilyMember={setActiveFamilyMemberId}
            onAddRecords={handleAddRecords}
            onCreateCase={handleCreateCase}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'family' && (
          <FamilyProfilesView
            familyMembers={familyMembers}
            cases={cases}
            activeMemberId={activeFamilyMemberId}
            onSelectMember={setActiveFamilyMemberId}
            onSelectMemberForNewCase={(member) => {
              setActiveFamilyMemberId(member.id);
              handleNavigate('new-case');
            }}
            onAddMember={(newMem) => setFamilyMembers([...familyMembers, newMem])}
            onUpdateMember={(updatedMem) =>
              setFamilyMembers(
                familyMembers.map((m) => (m.id === updatedMem.id ? updatedMem : m))
              )
            }
            onDeleteMember={handleDeleteFamilyMember}
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
            onRefreshUsers={handleRefreshUsers}
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
            onSelectRecord={(rec) => {
              handleNavigate('records');
            }}
            onViewHospitalProfile={handleViewHospitalProfile}
            onDeleteCase={handleDeleteCase}
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
            onDeleteCase={handleDeleteCase}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            selectedHospital={selectedHospitalForBooking}
            currentCase={activeCase}
            onConfirmBooking={handleConfirmBooking}
            onBackToQuotes={() => handleNavigate('quotes')}
            authUser={authUser}
            onOpenPhoneVerification={() => {
              setPhoneVerificationPrompt('📱 Please verify your mobile number so hospitals can contact you regarding your quotation.');
              setIsPhoneVerificationModalOpen(true);
            }}
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
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#003178] bg-slate-100 flex items-center justify-center">
                  {authUser?.avatarUrl ? (
                    <img
                      src={authUser.avatarUrl}
                      alt={authUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[32px] text-[#003178]">person</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-bold text-[#071e27] truncate">
                      {authUser?.name || patientProfile.name}
                    </h2>
                    <span className="px-2 py-0.5 bg-[#003178] text-white text-[10px] font-black rounded uppercase">
                      {authUser?.role || 'Patient'}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#737783] font-mono-data">
                    Auth Provider: {authUser?.authProvider ? authUser.authProvider.toUpperCase() : 'GOOGLE'}
                  </p>
                </div>
              </div>

              {/* Verified Identity & Contact Matrix */}
              <div className="space-y-3 bg-[#f8fafc] p-4 rounded-xl border border-[#c3c6d4]">
                <h3 className="text-[12px] font-bold text-[#003178] uppercase tracking-wider">
                  Authentication & Contact Verification
                </h3>

                {/* Email Verification Status */}
                <div className="flex items-center justify-between py-2 border-b border-[#c3c6d4]/50 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#003178]">mail</span>
                    <span className="text-[#434652] font-medium">Email Address:</span>
                    <strong className="text-[#071e27]">{authUser?.email || 'alex.turner@gmail.com'}</strong>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Verified</span>
                  </span>
                </div>

                {/* Phone Verification Status */}
                <div className="flex items-center justify-between py-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#003178]">smartphone</span>
                    <span className="text-[#434652] font-medium">Mobile Phone:</span>
                    {authUser?.isPhoneVerified && authUser.mobileNumber ? (
                      <strong className="text-emerald-800 font-mono-data">{authUser.mobileNumber}</strong>
                    ) : (
                      <span className="text-amber-700 italic">Optional (Required for quotations)</span>
                    )}
                  </div>
                  {authUser?.isPhoneVerified && authUser.mobileNumber ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      <span>Verified</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneVerificationPrompt('📱 Verify your mobile number so hospitals can contact you regarding your quotation.');
                        setIsPhoneVerificationModalOpen(true);
                      }}
                      className="px-3 py-1 bg-[#003178] hover:bg-[#002256] text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      <span>Verify Phone via SMS</span>
                    </button>
                  )}
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
                  className="px-5 py-2.5 bg-[#003178] text-white font-bold text-[14px] rounded-xl hover:bg-[#0d47a1] cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {['privacy', 'terms', 'disclaimer', 'abha-guide', 'copyright', 'legal'].includes(currentView) && (
          <LegalLandingPagesView
            initialTab={currentView as any}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Page Footer */}
      <div className="lg:ml-64">
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />

      {/* Authentication Modals */}
      <MobileAuthModal
        isOpen={isMobileAuthModalOpen}
        onClose={() => setIsMobileAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setAuthUser(user);

          // Map signed in user into AdminUser format and add to directory if not present
          const userRoleLabel: 'System Admin' | 'Doctor' | 'Hospital Coordinator' | 'Patient' =
            user.role === 'admin'
              ? 'System Admin'
              : user.role === 'hospital'
              ? 'Hospital Coordinator'
              : 'Patient';

          const newAdminUser: any = {
            id: user.id || `usr-${Date.now()}`,
            name: user.name || 'User',
            email: user.email.toLowerCase(),
            role: userRoleLabel,
            status: 'Active',
            joinedDate: 'Just now',
            assignedHospital: user.organizationName || (user.role === 'hospital' ? 'Apollo Hospitals' : undefined),
            casesSubmitted: 0,
            mobileNumber: user.mobileNumber || '',
            city: user.city || 'Bangalore',
          };

          setAdminUsers((prev) => {
            const exists = prev.some((u) => u.email.toLowerCase() === newAdminUser.email.toLowerCase() || u.id === newAdminUser.id);
            if (!exists) {
              saveUserToCloud(newAdminUser);
              return [newAdminUser, ...prev];
            } else {
              saveUserToCloud(newAdminUser);
              return prev.map((u) => (u.email.toLowerCase() === newAdminUser.email.toLowerCase() ? { ...u, ...newAdminUser } : u));
            }
          });

          if (user.role === 'admin') {
            handleNavigate('admin');
          } else if (user.role === 'hospital') {
            handleNavigate('doctor-portal');
          } else {
            handleNavigate('dashboard');
          }
        }}
        defaultMobile={authUser?.mobileNumber || ''}
      />

      {/* Just-in-Time Deferred Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={isPhoneVerificationModalOpen}
        onClose={() => {
          setIsPhoneVerificationModalOpen(false);
          setPendingActionAfterPhoneVerification(null);
        }}
        authUser={authUser}
        onSuccess={handlePhoneVerificationSuccess}
        actionContext={phoneVerificationPrompt}
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
        caseCode={activeCase?.caseCode || '#MQ-78291'}
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

      <PlayStoreExportModal
        isOpen={isPlayStoreExportModalOpen}
        onClose={() => setIsPlayStoreExportModalOpen(false)}
        authUser={authUser}
      />

      {/* Floating Free SMS Telecom Receiver & Inbox Widget */}
      <VirtualSmsInboxWidget />
    </div>
  );
};

export default App;
