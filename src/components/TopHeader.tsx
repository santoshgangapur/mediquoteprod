import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, PatientProfile, FamilyMember, AuthUser } from '../types';
import { PlayStoreExportModal } from './PlayStoreExportModal';
import { detailedHospitalsList, initialMedicalRecords, initialCases } from '../data/mockData';

interface TopHeaderProps {
  currentView: ViewMode;
  patientProfile: PatientProfile;
  searchQuery: string;
  familyMembers?: FamilyMember[];
  activeFamilyMemberId?: string;
  onSelectFamilyMember?: (id: string) => void;
  onSearchChange: (q: string) => void;
  onNavigate: (view: ViewMode) => void;
  onUpdatePatientProfile?: (updated: Partial<PatientProfile>) => void;
  authUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
  onOpenPhoneVerificationModal?: () => void;
  onLogout?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  patientProfile,
  searchQuery,
  familyMembers = [],
  activeFamilyMemberId = 'fam-1',
  onSelectFamilyMember,
  onSearchChange,
  onNavigate,
  onUpdatePatientProfile,
  authUser,
  onOpenAuthModal,
  onOpenPhoneVerificationModal,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<'all' | 'ai' | 'hospitals' | 'records' | 'cases' | 'patients'>('all');
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<{
    answer: string;
    keyTakeaways?: string[];
    suggestedView?: ViewMode;
    suggestedActionLabel?: string;
  } | null>(null);

  const familyDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (familyDropdownRef.current && !familyDropdownRef.current.contains(event.target as Node)) {
        setIsFamilyDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsFamilyDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Trigger AI search in header
  const handleAskAI = async (overrideQuery?: string) => {
    const textToSearch = overrideQuery !== undefined ? overrideQuery : searchQuery;
    if (!textToSearch.trim()) return;

    if (overrideQuery !== undefined) {
      onSearchChange(overrideQuery);
    }

    setSearchTab('ai');
    setAiSearchLoading(true);
    setAiSearchResult(null);

    try {
      const res = await fetch('/api/ai-header-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSearch }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSearchResult(data);
      } else {
        setAiSearchResult({
          answer: `MediQuote AI analyzed "${textToSearch}". Recommended JCI-accredited hospitals include Fortis, Apollo & Medanta with up to 70% surgical savings.`,
          keyTakeaways: ['JCI Accredited Facilities in Delhi & NCR', '70% Cost Savings vs USA/UK'],
          suggestedView: 'hospitals',
          suggestedActionLabel: 'Explore Recommended Hospitals',
        });
      }
    } catch (_err) {
      setAiSearchResult({
        answer: `MediQuote AI analyzed "${textToSearch}". We found verified hospital packages and records matching your inquiry.`,
        keyTakeaways: ['Verified Hospital Packages', 'Instant Medical Record Analysis'],
        suggestedView: 'hospitals',
        suggestedActionLabel: 'Explore Hospitals',
      });
    } finally {
      setAiSearchLoading(false);
    }
  };

  // Compute live search results across all entities
  const query = searchQuery.trim().toLowerCase();

  const filteredHospitals = query
    ? detailedHospitalsList.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          h.city.toLowerCase().includes(query) ||
          h.specialties.some((s) => s.toLowerCase().includes(query))
      )
    : [];

  const filteredRecords = query
    ? initialMedicalRecords.filter(
        (r) =>
          r.fileName.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          (r.patientMemberName && r.patientMemberName.toLowerCase().includes(query))
      )
    : [];

  const filteredCases = query
    ? initialCases.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.subtitle.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.caseCode.toLowerCase().includes(query)
      )
    : [];

  const filteredFamily = query
    ? familyMembers.filter(
        (m) =>
          m.fullName.toLowerCase().includes(query) ||
          m.relationship.toLowerCase().includes(query)
      )
    : [];

  const totalResultsCount =
    filteredHospitals.length +
    filteredRecords.length +
    filteredCases.length +
    filteredFamily.length;

  const getTitle = () => {
    switch (currentView) {
      case 'new-case':
        return 'Create New Case & Clinical Vitals';
      case 'family':
        return 'Centralized Patient Management & Family Profiles';
      case 'doctor-portal':
        return 'Doctor & Hospital Admission Desk';
      case 'admin':
        return 'System Administration & Management Desk';
      case 'landing':
        return 'Home & Guest Portal';
      case 'dashboard':
        return 'Dashboard Overview';
      case 'upload':
        return 'Upload Medical Reports';
      case 'quotes':
        return 'Quotation Comparison';
      case 'checkout':
        return 'Booking & Checkout';
      case 'recommendations':
      case 'hospitals':
      case 'hospital-profile':
        return 'Hospitals Network & Location Map';
      case 'cases':
        return 'My Surgical Cases';
      case 'records':
        return 'Medical DigiLocker';
      case 'account':
        return 'Patient Account & Insurance';
      case 'medical-tourism':
        return 'Medical Tourism India Hub & Global Care';
      default:
        return 'MediQuote AI';
    }
  };

  const getSearchPlaceholder = () => {
    switch (currentView) {
      case 'quotes':
      case 'recommendations':
        return 'Search hospitals...';
      case 'records':
        return 'Search records...';
      default:
        return 'Search hospitals, records, cases...';
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-30 flex justify-between items-center px-4 md:px-8 h-16 bg-[#f3faff] border-b border-[#c3c6d4]">
      {/* Title & Mobile Brand */}
      <div className="flex items-center gap-3">
        {/* Mobile menu logo */}
        <div className="lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-8 h-8 bg-[#003178] rounded-md flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[18px]">health_metrics</span>
          </div>
          <span className="font-bold text-[#003178] text-[16px]">MediQuote AI</span>
        </div>
        
        <h2 className="hidden md:block font-bold text-[18px] text-[#003178] tracking-tight">
          {getTitle()}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Android / Play Store App Button - Icon Only */}
        <button
          type="button"
          onClick={() => setIsPlayStoreModalOpen(true)}
          className="flex items-center justify-center px-3.5 py-1.5 bg-[#70f3e0] hover:bg-[#50ebd6] text-[#00382f] rounded-full transition-all shadow-xs cursor-pointer border border-[#4be0cc]/60 active:scale-95"
          title={authUser?.role === 'admin' ? "Play Console & Android Deployment Studio" : "Install MediQuote AI Mobile App"}
        >
          <span className="material-symbols-outlined text-[22px] text-[#00382f] leading-none">
            android
          </span>
        </button>

        {/* Hospitals Quick Access Button */}
        <button
          type="button"
          onClick={() => onNavigate('hospitals')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#003178] hover:bg-[#0d47a1] text-white font-extrabold text-[12px] rounded-full transition-all shadow-sm cursor-pointer"
          title="Explore Hospitals & Live Map"
        >
          <span className="material-symbols-outlined text-[18px] text-[#81f3e5]">apartment</span>
          <span>Hospitals</span>
        </button>

        {/* Search Icon Popover Dropdown (Desktop Only) */}
        <div className="hidden sm:block relative" ref={searchContainerRef}>
          <button
            type="button"
            onClick={() => {
              const nextState = !isSearchOpen;
              setIsSearchOpen(nextState);
              if (nextState) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }
            }}
            className={`p-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center border shadow-xs ${
              isSearchOpen
                ? 'bg-[#003178] text-white border-[#003178]'
                : 'bg-[#dbf1fe] hover:bg-[#003178] text-[#003178] hover:text-white border-[#c3c6d4]'
            }`}
            title="Search Hospitals, Records, Cases & Patients"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSearchOpen ? 'close' : 'search'}
            </span>
          </button>

          {/* Search Dropdown Popover Menu */}
          {isSearchOpen && (
            <div className="fixed inset-x-3 top-16 sm:absolute sm:top-auto sm:right-0 sm:left-auto mt-2 sm:w-[500px] md:w-[560px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-[#c3c6d4] z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
              {/* Search Input Header Row inside Dropdown */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <span className="material-symbols-outlined text-[#003178] text-[20px] absolute left-3 pointer-events-none">search</span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      if (searchTab === 'ai' && e.target.value.trim().length > 2) {
                        handleAskAI(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        handleAskAI();
                      }
                    }}
                    className="w-full bg-white border border-[#c3c6d4] focus:border-[#003178] focus:outline-none rounded-xl pl-9 pr-8 py-2 text-[13px] text-[#071e27] font-medium placeholder-[#737783] shadow-xs"
                    placeholder="Search hospitals, records, cases or ask AI..."
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        onSearchChange('');
                        setAiSearchResult(null);
                      }}
                      className="text-[#737783] hover:text-[#071e27] p-1 cursor-pointer absolute right-2"
                      title="Clear search"
                    >
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => handleAskAI()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#003178] hover:bg-[#0d47a1] text-white font-bold text-[12px] rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                  title="Ask MediQuote AI"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#81f3e5]">auto_awesome</span>
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </div>

              {/* Search Category Filter Tabs */}
              <div className="px-3 py-2 bg-white border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All', count: totalResultsCount },
                  { id: 'hospitals', label: 'Hospitals', count: filteredHospitals.length },
                  { id: 'records', label: 'Records', count: filteredRecords.length },
                  { id: 'cases', label: 'Cases', count: filteredCases.length },
                  { id: 'patients', label: 'Patients', count: filteredFamily.length },
                  { id: 'ai', label: '✨ Ask AI', count: null },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSearchTab(tab.id as any);
                      if (tab.id === 'ai' && !aiSearchResult && !aiSearchLoading) {
                        handleAskAI(searchQuery || 'Top Hospitals and Costs');
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      searchTab === tab.id
                        ? 'bg-[#003178] text-white shadow-xs'
                        : tab.id === 'ai'
                        ? 'bg-[#f0f7ff] text-[#003178] hover:bg-[#dbf1fe] border border-[#003178]/30'
                        : 'bg-slate-50 text-[#434652] hover:bg-[#dbf1fe] border border-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        searchTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/70 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Dropdown Content Body */}
              <div className="p-3 overflow-y-auto space-y-3.5 max-h-[calc(82vh-120px)]">
                {/* AI Search View Mode */}
                {searchTab === 'ai' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#003178]">
                        <span className="material-symbols-outlined text-[18px] text-[#003178]">auto_awesome</span>
                        <span>MediQuote AI Assistant</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#003178]/10 text-[#003178]">
                        Gemini 2.5 Flash
                      </span>
                    </div>

                    {/* AI Loading State */}
                    {aiSearchLoading ? (
                      <div className="p-6 rounded-2xl bg-[#f0f7ff] border border-[#c3c6d4] text-center space-y-3 animate-pulse">
                        <span className="material-symbols-outlined text-[36px] text-[#003178] animate-spin">
                          auto_awesome
                        </span>
                        <p className="text-[13px] font-bold text-[#003178]">
                          MediQuote AI is analyzing your medical query...
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Searching JCI hospital databases, package prices, and clinical records.
                        </p>
                      </div>
                    ) : aiSearchResult ? (
                      /* AI Search Result Card */
                      <div className="p-4 rounded-2xl bg-[#f0f7ff] border border-[#003178]/20 space-y-3 shadow-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#003178] text-white flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px]">psychology</span>
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <p className="text-[13px] font-semibold text-[#071e27] leading-relaxed">
                              {aiSearchResult.answer}
                            </p>
                            {aiSearchResult.keyTakeaways && aiSearchResult.keyTakeaways.length > 0 && (
                              <div className="pt-2 border-t border-slate-200/80 space-y-1">
                                <p className="text-[11px] font-bold text-[#003178] uppercase tracking-wider">
                                  Key Insights:
                                </p>
                                <ul className="space-y-1">
                                  {aiSearchResult.keyTakeaways.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-[12px] text-slate-700">
                                      <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {aiSearchResult.suggestedView && (
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                onNavigate(aiSearchResult.suggestedView!);
                                setIsSearchOpen(false);
                              }}
                              className="px-3.5 py-1.5 bg-[#003178] hover:bg-[#0d47a1] text-white text-[12px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <span>{aiSearchResult.suggestedActionLabel || 'Explore Further'}</span>
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* AI Prompts Launcher */
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <p className="text-[12px] font-bold text-slate-700">
                          Try asking MediQuote AI any question:
                        </p>
                        <div className="grid gap-2">
                          {[
                            'What is the cost of total knee replacement in Delhi?',
                            'Find JCI accredited heart surgery hospitals in Gurgaon',
                            'How do I request a complimentary medical visa letter?',
                            'Explain MRI scan findings for lumbar disc herniation'
                          ].map((promptText, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAskAI(promptText)}
                              className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#dbf1fe] border border-slate-200 hover:border-[#003178] text-[12px] text-[#071e27] font-medium transition-all cursor-pointer flex items-center gap-2 group"
                            >
                              <span className="material-symbols-outlined text-[16px] text-[#003178] group-hover:scale-110 transition-transform">
                                auto_awesome
                              </span>
                              <span className="truncate flex-1">{promptText}</span>
                              <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-[#003178]">
                                chevron_right
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : query.length === 0 ? (
                  <div className="p-2 space-y-3">
                    <p className="text-[11px] font-black text-[#003178] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                      <span>Quick Search Shortcuts</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      <button
                        type="button"
                        onClick={() => onSearchChange('Fortis')}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#dbf1fe] hover:border-[#003178] text-left border border-slate-200 text-[#071e27] font-semibold cursor-pointer transition-all flex items-center gap-2"
                      >
                        <span>🏥</span>
                        <span>Fortis Hospital</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearchChange('Apollo')}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#dbf1fe] hover:border-[#003178] text-left border border-slate-200 text-[#071e27] font-semibold cursor-pointer transition-all flex items-center gap-2"
                      >
                        <span>🏥</span>
                        <span>Apollo Hospital</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearchChange('Knee')}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#dbf1fe] hover:border-[#003178] text-left border border-slate-200 text-[#071e27] font-semibold cursor-pointer transition-all flex items-center gap-2"
                      >
                        <span>🩺</span>
                        <span>Knee Surgery</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearchChange('MRI')}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#dbf1fe] hover:border-[#003178] text-left border border-slate-200 text-[#071e27] font-semibold cursor-pointer transition-all flex items-center gap-2"
                      >
                        <span>📄</span>
                        <span>MRI Scan Report</span>
                      </button>
                    </div>
                  </div>
                ) : totalResultsCount === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <span className="material-symbols-outlined text-[48px] text-slate-300">search_off</span>
                    <p className="text-[14px] font-bold text-slate-700">No matching database records found</p>
                    <p className="text-[12px] text-slate-500 max-w-sm mx-auto">
                      We couldn't find exact directory matches for "{searchQuery}".
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAskAI()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#003178] text-white rounded-xl text-[12px] font-bold shadow-xs hover:bg-[#0d47a1] transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#81f3e5]">auto_awesome</span>
                      <span>Ask AI about "{searchQuery}"</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Hospitals Results */}
                    {(searchTab === 'all' || searchTab === 'hospitals') && filteredHospitals.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase text-[#003178] tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">apartment</span>
                          <span>Hospitals ({filteredHospitals.length})</span>
                        </h4>
                        <div className="grid gap-2">
                          {filteredHospitals.slice(0, 4).map((h) => (
                            <div
                              key={h.id}
                              onClick={() => {
                                onNavigate('hospitals');
                                setIsSearchOpen(false);
                              }}
                              className="p-3 rounded-xl bg-slate-50 hover:bg-[#ebf5ff] border border-slate-200 hover:border-[#003178] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-[#003178] text-white flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-[20px]">apartment</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-bold text-[#071e27] group-hover:text-[#003178] truncate">
                                    {h.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    📍 {h.city} • ⭐ {h.rating} • {h.specialties.slice(0, 2).join(', ')}
                                  </p>
                                </div>
                              </div>
                              <button className="px-2.5 py-1 bg-white group-hover:bg-[#003178] group-hover:text-white text-[#003178] font-bold text-[11px] rounded-lg border border-[#c3c6d4] transition-all shrink-0">
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Medical Records Results */}
                    {(searchTab === 'all' || searchTab === 'records') && filteredRecords.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase text-[#003178] tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">description</span>
                          <span>Medical Records & Reports ({filteredRecords.length})</span>
                        </h4>
                        <div className="grid gap-2">
                          {filteredRecords.slice(0, 4).map((r) => (
                            <div
                              key={r.id}
                              onClick={() => {
                                onNavigate('records');
                                setIsSearchOpen(false);
                              }}
                              className="p-3 rounded-xl bg-slate-50 hover:bg-[#ebf5ff] border border-slate-200 hover:border-[#003178] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-[20px]">folder_open</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-bold text-[#071e27] group-hover:text-[#003178] truncate">
                                    {r.fileName}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    📄 {r.category} • 👤 {r.patientMemberName || 'Patient'} • 🗓️ {r.uploadDate}
                                  </p>
                                </div>
                              </div>
                              <button className="px-2.5 py-1 bg-white group-hover:bg-[#003178] group-hover:text-white text-[#003178] font-bold text-[11px] rounded-lg border border-[#c3c6d4] transition-all shrink-0">
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Surgical Cases Results */}
                    {(searchTab === 'all' || searchTab === 'cases') && filteredCases.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase text-[#003178] tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">medical_services</span>
                          <span>Surgical Cases ({filteredCases.length})</span>
                        </h4>
                        <div className="grid gap-2">
                          {filteredCases.slice(0, 4).map((c) => (
                            <div
                              key={c.id}
                              onClick={() => {
                                onNavigate('cases');
                                setIsSearchOpen(false);
                              }}
                              className="p-3 rounded-xl bg-slate-50 hover:bg-[#ebf5ff] border border-slate-200 hover:border-[#003178] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-indigo-700 text-white flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-[20px]">stethoscope</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-bold text-[#071e27] group-hover:text-[#003178] truncate">
                                    {c.title}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    📋 Code: {c.caseCode} • {c.subtitle} • Status: {c.status}
                                  </p>
                                </div>
                              </div>
                              <button className="px-2.5 py-1 bg-white group-hover:bg-[#003178] group-hover:text-white text-[#003178] font-bold text-[11px] rounded-lg border border-[#c3c6d4] transition-all shrink-0">
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Family Patients Results */}
                    {(searchTab === 'all' || searchTab === 'patients') && filteredFamily.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase text-[#003178] tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">person</span>
                          <span>Family Patients ({filteredFamily.length})</span>
                        </h4>
                        <div className="grid gap-2">
                          {filteredFamily.slice(0, 4).map((m) => (
                            <div
                              key={m.id}
                              onClick={() => {
                                if (onSelectFamilyMember) onSelectFamilyMember(m.id);
                                onNavigate('family');
                                setIsSearchOpen(false);
                              }}
                              className="p-3 rounded-xl bg-slate-50 hover:bg-[#ebf5ff] border border-slate-200 hover:border-[#003178] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-full ${m.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-[13px] shrink-0`}>
                                  {m.fullName.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-bold text-[#071e27] group-hover:text-[#003178] truncate">
                                    {m.fullName}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    👤 {m.relationship} • {m.gender}, {m.age} yrs • Blood Group: {m.bloodGroup}
                                  </p>
                                </div>
                              </div>
                              <button className="px-2.5 py-1 bg-white group-hover:bg-[#003178] group-hover:text-white text-[#003178] font-bold text-[11px] rounded-lg border border-[#c3c6d4] transition-all shrink-0">
                                Select
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications (Desktop Only) */}
        <div className="hidden sm:block relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-[#434652] hover:text-[#003178] hover:bg-[#cfe6f2] transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-[#c3c6d4] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#c3c6d4]">
                <h4 className="font-bold text-[14px] text-[#003178]">Notifications (2)</h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#737783] hover:text-[#071e27] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <div
                  onClick={() => {
                    onNavigate('quotes');
                    setShowNotifications(false);
                  }}
                  className="p-2.5 rounded-lg bg-[#e6f6ff] hover:bg-[#dbf1fe] cursor-pointer transition-colors"
                >
                  <p className="text-[13px] font-bold text-[#003178]">3 Hospital Quotes Offered</p>
                  <p className="text-[12px] text-[#434652]">Fortis & Apollo uploaded transparent packages.</p>
                  <span className="text-[10px] text-[#737783]">Just now</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Control */}
        {authUser ? (
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 bg-white border border-[#c3c6d4] hover:border-[#003178] p-1 sm:pl-3 sm:pr-2 sm:py-1.5 rounded-full shadow-xs cursor-pointer transition-all"
              title="User Profile Menu"
            >
              <div className="hidden sm:flex flex-col text-right leading-tight min-w-0">
                <span className="text-[13px] font-extrabold text-[#003178] truncate max-w-[140px]">
                  {authUser.name
                    ? authUser.name.includes('(+91')
                      ? authUser.name.split('(')[0].trim()
                      : authUser.name
                    : 'User Profile'}
                </span>
                <span className="text-[10px] font-mono-data text-[#64748b] font-semibold flex items-center justify-end gap-1">
                  {authUser.isPhoneVerified && authUser.mobileNumber ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      <span>{authUser.mobileNumber}</span>
                    </span>
                  ) : authUser.email ? (
                    <span className="text-[#003178] truncate max-w-[120px]">{authUser.email}</span>
                  ) : (
                    <span>{authUser.mobileNumber || 'Guest'}</span>
                  )}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#003178] text-white flex items-center justify-center text-[13px] font-bold shadow-2xs shrink-0 relative">
                {authUser.avatarUrl ? (
                  <img src={authUser.avatarUrl} alt={authUser.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[18px]">person</span>
                )}
                {authUser.isPhoneVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Phone Verified" />
                )}
              </div>

              <span className="hidden sm:inline-block material-symbols-outlined text-[18px] text-[#737783]">
                {isProfileDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#c3c6d4] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                {/* User Info Header */}
                <div className="p-3 bg-[#f3faff] rounded-xl border border-[#c3c6d4]/60 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#003178] text-white flex items-center justify-center font-bold text-[16px] shadow-xs shrink-0 overflow-hidden">
                      {authUser.avatarUrl ? (
                        <img src={authUser.avatarUrl} alt={authUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">account_circle</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-[13px] text-[#0f172a] truncate">
                        {authUser.name || 'Registered User'}
                      </p>
                      {authUser.email && (
                        <p className="text-[11px] text-[#475569] truncate flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-emerald-600">verified</span>
                          <span>{authUser.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Status / Verification Prompt */}
                  <div className="p-2 bg-white rounded-lg border border-[#cbd5e1] text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748b] font-medium">Mobile Phone:</span>
                      {authUser.isPhoneVerified && authUser.mobileNumber ? (
                        <span className="font-mono-data text-emerald-700 font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          <span>{authUser.mobileNumber}</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                          Unverified
                        </span>
                      )}
                    </div>

                    {(!authUser.isPhoneVerified || !authUser.mobileNumber) && onOpenPhoneVerificationModal && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          onOpenPhoneVerificationModal();
                        }}
                        className="w-full mt-1 py-1.5 bg-[#003178] hover:bg-[#002256] text-white font-bold text-[11px] rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px]">phone_android</span>
                        <span>Verify Phone for Hospital Quotes</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-[#64748b] font-medium">Portal Role:</span>
                    <span className="px-2 py-0.5 font-mono-data font-black rounded bg-[#003178] text-white uppercase tracking-wider">
                      {authUser.role === 'admin' ? 'ADMIN' : authUser.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu Links */}
                <div className="space-y-0.5 text-[13px]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('account');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[#334155] hover:bg-[#f1f5f9] hover:text-[#003178] rounded-xl font-bold transition-all text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#003178]">manage_accounts</span>
                    <span>My Account & Insurance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('family');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[#334155] hover:bg-[#f1f5f9] hover:text-[#003178] rounded-xl font-bold transition-all text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#003178]">family_restroom</span>
                    <span>Family Profiles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('records');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[#334155] hover:bg-[#f1f5f9] hover:text-[#003178] rounded-xl font-bold transition-all text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#003178]">shield_lock</span>
                    <span>Secured Health Vault</span>
                  </button>
                </div>

                {/* Logout Action */}
                {onLogout && (
                  <div className="border-t border-[#e2e8f0] pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] font-extrabold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="p-2 sm:px-4 sm:py-2 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[13px] rounded-full transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            title="Sign In / Fast Sign Up"
          >
            <span className="material-symbols-outlined text-[19px]">account_circle</span>
            <span className="hidden sm:inline">Sign In / Register</span>
          </button>
        )}
      </div>

      <PlayStoreExportModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
        authUser={authUser}
      />
    </header>
  );
};

