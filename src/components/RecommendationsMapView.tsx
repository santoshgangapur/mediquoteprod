import React, { useState } from 'react';
import { nearbyHospitalsList } from '../data/mockData';
import { ViewMode, SurgicalCase, HospitalQuote } from '../types';
import { AIClinicalAnalysisCard } from './AIClinicalAnalysisCard';

interface RecommendationsMapViewProps {
  currentCase?: SurgicalCase;
  onNavigate: (view: ViewMode) => void;
  onRequestCustomQuote: () => void;
  onViewHospitalProfile?: (hospitalId: string) => void;
  onSelectHospitalForBooking?: (hospital: HospitalQuote) => void;
}

export const RecommendationsMapView: React.FC<RecommendationsMapViewProps> = ({
  currentCase,
  onNavigate,
  onRequestCustomQuote,
  onViewHospitalProfile,
  onSelectHospitalForBooking,
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('apollo-spectra');
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setIsLocating(false);
      },
      (err) => {
        console.warn(err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const caseTitle = currentCase?.title || 'Laparoscopic Cholecystectomy';
  const confidenceScore = currentCase?.aiConfidencePercent || 94;
  const caseReason =
    currentCase?.aiPrimaryRecommendationReason ||
    currentCase?.aiClinicalAnalysis?.reportAnalysisSummary ||
    'High implant longevity match and certified surgical unit with 24/7 ICU recovery support.';

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Hospital Network & Location Map Header */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 bg-[#dbf1fe] text-[#003178] font-bold text-[11px] rounded tracking-wider uppercase">
              NETWORK MAP
            </span>
            <span className="text-[12px] font-bold text-[#006f66] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Empaneled & Verified Hospitals
            </span>
          </div>
          <h1 className="text-[22px] font-bold text-[#003178]">Hospital Location Map</h1>
          <p className="text-[13px] text-[#434652]">
            Explore nearby partner hospitals, check distance, location details, and request direct surgical quotes.
          </p>
        </div>

        <button
          onClick={() => onNavigate('quotes')}
          className="px-4 py-2.5 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1] transition-all shrink-0 cursor-pointer shadow-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">request_quote</span>
          <span>Compare Quotations</span>
        </button>
      </div>

      {/* Main Layout: Full-Width Single Column Interactive Hospital Map */}
      <div className="space-y-6 w-full">
        {/* Full-Width Map Card (Single Column Layout) */}
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-5 shadow-sm flex flex-col gap-4 w-full relative overflow-hidden">
          {/* Map Header & Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#f8fafc] p-3.5 rounded-xl border border-[#c3c6d4]">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-white px-3 py-2 rounded-lg border border-[#c3c6d4] shadow-xs">
              <span className="material-symbols-outlined text-[#003178] text-[20px]">location_on</span>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value);
                  if (userLocation) setUserLocation(null);
                }}
                className="text-[13px] font-semibold text-[#071e27] bg-transparent border-none focus:outline-none w-full"
                placeholder="Search location, hospital, or pincode..."
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                  userLocation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#003178] hover:bg-[#0d47a1] text-white'
                }`}
                title="Use current GPS location"
              >
                <span className={`material-symbols-outlined text-[16px] ${isLocating ? 'animate-spin' : ''}`}>
                  {isLocating ? 'sync' : 'my_location'}
                </span>
                <span>{isLocating ? 'Locating...' : userLocation ? 'GPS Connected' : 'Use My Location'}</span>
              </button>

              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#c3c6d4]">
                <button
                  type="button"
                  onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                  className="w-8 h-8 rounded-md bg-[#f3faff] hover:bg-[#dbf1fe] text-[#003178] font-bold flex items-center justify-center text-[18px] cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <span className="px-2 text-[12px] font-mono font-bold text-slate-600">{mapZoom}x</span>
                <button
                  type="button"
                  onClick={() => setMapZoom(Math.max(mapZoom - 1, 10))}
                  className="w-8 h-8 rounded-md bg-[#f3faff] hover:bg-[#dbf1fe] text-[#003178] font-bold flex items-center justify-center text-[18px] cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>
          </div>

          {/* Map Container (Full Width Single Column with Google Maps Embed) */}
          <div className="w-full h-[480px] rounded-xl relative overflow-hidden bg-slate-100 border border-[#c3c6d4] shadow-inner">
            {(() => {
              const selectedHosp = nearbyHospitalsList.find((h) => h.id === selectedHospitalId) || nearbyHospitalsList[0];
              const searchQuery = userLocation
                ? `${userLocation.lat},${userLocation.lng}`
                : locationSearch.trim()
                ? `${locationSearch} hospitals`
                : `${selectedHosp.name}, ${selectedHosp.locationName}`;
              const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;

              return (
                <iframe
                  title="Google Maps Hospital Location"
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0 rounded-xl"
                  loading="lazy"
                  allowFullScreen
                  src={embedUrl}
                ></iframe>
              );
            })()}
          </div>

          {/* Map Legend & Summary Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 text-[12px] text-[#434652] z-10 border-t border-[#c3c6d4]/60">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#006a62] border border-white shadow-xs"></span>
                <span className="font-bold text-slate-800">Primary Empaneled Facility</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#003178] border border-white shadow-xs"></span>
                <span className="font-bold text-slate-800">Partner Empaneled Hospital</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-white shadow-xs"></span>
                <span className="font-bold text-slate-800">General Network Facility</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-bold">Showing {nearbyHospitalsList.length} verified hospitals on map</span>
          </div>
        </div>

        {/* Selected Hospital Detail Banner (Single Column) */}
        {(() => {
          const activeHosp = nearbyHospitalsList.find((h) => h.id === selectedHospitalId) || nearbyHospitalsList[0];
          return (
            <div className="bg-white rounded-2xl border-2 border-[#003178] p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-wider ${
                        activeHosp.category === 'RECOMMENDED'
                          ? 'bg-[#81f3e5] text-[#006f66]'
                          : activeHosp.category === 'PREMIUM PARTNER'
                          ? 'bg-[#dbf1fe] text-[#003178]'
                          : 'bg-gray-200 text-[#434652]'
                      }`}
                    >
                      {activeHosp.category}
                    </span>
                    <span className="text-[12px] font-bold text-amber-600 flex items-center gap-0.5">
                      <span>★</span> {activeHosp.rating} Rating
                    </span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#071e27]">{activeHosp.name}</h3>
                  <p className="text-[13px] text-slate-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#003178]">location_on</span>
                    <span>{activeHosp.locationName} • {activeHosp.distanceKm} km away from patient</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-left md:text-right bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">INDICATIVE PACKAGE COST</span>
                    <span className="text-[16px] font-black text-[#003178] font-mono-data">{activeHosp.costRange}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onViewHospitalProfile && (
                      <button
                        type="button"
                        onClick={() => onViewHospitalProfile(activeHosp.id)}
                        className="px-4 py-2.5 bg-[#f3faff] border border-[#c3c6d4] text-[#003178] font-bold text-[13px] rounded-xl hover:bg-[#dbf1fe] cursor-pointer transition-all"
                      >
                        View Full Profile
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onNavigate('quotes')}
                      className="px-4 py-2.5 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1] cursor-pointer shadow-xs transition-all"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Info Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Bed Capacity</span>
                  <span className="font-bold text-slate-800">450+ Beds • 24/7 ICU</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Cashless Insurance</span>
                  <span className="font-bold text-slate-800">Star Health, HDFC Ergo, ICICI</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Accreditation</span>
                  <span className="font-bold text-slate-800">NABH & JCI Certified</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Nearby Hospitals List (Single Column Layout) */}
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-[18px] text-[#003178] flex items-center gap-2">
              <span className="material-symbols-outlined">local_hospital</span>
              <span>Nearby Network Hospitals ({nearbyHospitalsList.length})</span>
            </h3>
            <button
              onClick={() => onNavigate('quotes')}
              className="text-[12px] font-bold text-[#003178] hover:underline cursor-pointer"
            >
              View Full Comparison Matrix →
            </button>
          </div>

          <div className="space-y-3">
            {nearbyHospitalsList.map((h) => {
              const isSelected = selectedHospitalId === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedHospitalId(h.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#006a62] bg-[#f3faff] shadow-md'
                      : 'border-[#c3c6d4] bg-white hover:border-[#003178]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            h.category === 'RECOMMENDED'
                              ? 'bg-[#81f3e5] text-[#006f66]'
                              : h.category === 'PREMIUM PARTNER'
                              ? 'bg-[#dbf1fe] text-[#003178]'
                              : 'bg-gray-200 text-[#434652]'
                          }`}
                        >
                          {h.category}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 bg-[#006a62] text-white font-bold text-[10px] rounded">
                            SELECTED ON MAP
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-[16px] text-[#071e27]">{h.name}</h4>
                      <p className="text-[12px] text-[#737783] flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span>{h.locationName} • {h.distanceKm} km away</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <span className="text-[13px] font-bold text-[#003178] flex items-center gap-0.5 sm:justify-end">
                          <span>★</span> {h.rating}
                        </span>
                        <span className="text-[12px] font-bold text-[#071e27] font-mono-data block mt-0.5">
                          {h.costRange}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {onViewHospitalProfile && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewHospitalProfile(h.id);
                            }}
                            className="px-3 py-1.5 bg-[#f3faff] border border-[#c3c6d4] text-[#003178] font-bold text-[11px] rounded-lg hover:bg-[#dbf1fe] cursor-pointer"
                          >
                            Profile
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('quotes');
                          }}
                          className="px-3.5 py-1.5 bg-[#003178] text-white font-bold text-[12px] rounded-lg hover:bg-[#0d47a1] cursor-pointer"
                        >
                          Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bespoke Quote Callout (Single Column) */}
        <div className="bg-[#e6f6ff] rounded-2xl border border-[#c3c6d4] p-5 text-center space-y-2">
          <h4 className="font-bold text-[15px] text-[#003178]">Need a bespoke quote from another hospital?</h4>
          <p className="text-[13px] text-[#434652] max-w-xl mx-auto">
            Our clinical procurement desk can reach out to any NABH / JCI accredited hospital on your behalf.
          </p>
          <button
            onClick={onRequestCustomQuote}
            className="px-5 py-2.5 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1] cursor-pointer shadow-xs"
          >
            Request Custom Quotation
          </button>
        </div>
      </div>

      {/* Your Next Steps Section */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-[18px] text-[#003178] flex items-center gap-2">
          <span className="material-symbols-outlined">checklist</span>
          <span>Your Next Steps</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#f3faff] border border-[#c3c6d4] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#003178] font-bold text-[14px]">
              <span className="material-symbols-outlined">videocam</span>
              <span>1. Telehealth Consultation</span>
            </div>
            <p className="text-[12px] text-[#434652]">
              Schedule a 15-min pre-op video consultation with Dr. Meera Rao or Dr. S. K. Nair.
            </p>
            <button
              onClick={() => alert('Telehealth consultation slot requested.')}
              className="text-[12px] font-bold text-[#003178] hover:underline"
            >
              Book Video Call →
            </button>
          </div>

          <div className="p-4 bg-[#f3faff] border border-[#c3c6d4] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#006a62] font-bold text-[14px]">
              <span className="material-symbols-outlined">verified_user</span>
              <span>2. Verify Insurance Policy</span>
            </div>
            <p className="text-[12px] text-[#434652]">
              Confirm TPA pre-authorization requirements for HDFC Optima Restore policy.
            </p>
            <button
              onClick={() => alert('Insurance verification status synced.')}
              className="text-[12px] font-bold text-[#006a62] hover:underline"
            >
              Check TPA Policy →
            </button>
          </div>

          <div className="p-4 bg-[#f3faff] border border-[#c3c6d4] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#003178] font-bold text-[14px]">
              <span className="material-symbols-outlined">upload_file</span>
              <span>3. Pre-Auth Document Upload</span>
            </div>
            <p className="text-[12px] text-[#434652]">
              Upload government ID proof (Aadhaar / PAN) for cashless claim registration.
            </p>
            <button
              onClick={() => onNavigate('upload')}
              className="text-[12px] font-bold text-[#003178] hover:underline"
            >
              Upload ID Docs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
