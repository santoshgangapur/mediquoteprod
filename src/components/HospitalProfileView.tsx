import React, { useState } from 'react';
import { DetailedHospitalProfile, ViewMode } from '../types';
import { detailedHospitalsList } from '../data/mockData';

interface HospitalProfileViewProps {
  selectedHospitalId?: string;
  onSelectHospitalId: (id: string) => void;
  onNavigate: (view: ViewMode) => void;
  onRequestQuoteForHospital: (hospitalName: string) => void;
  initialViewType?: 'grid' | 'map' | 'detail';
}

export const HospitalProfileView: React.FC<HospitalProfileViewProps> = ({
  selectedHospitalId = 'apollo-1',
  onSelectHospitalId,
  onNavigate,
  onRequestQuoteForHospital,
  initialViewType = 'grid',
}) => {
  const [viewType, setViewType] = useState<'grid' | 'map' | 'detail'>(initialViewType);
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'insurance' | 'reviews' | 'location'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'beds' | 'cost'>('distance');
  const [selectedMapHospitalId, setSelectedMapHospitalId] = useState<string>(selectedHospitalId);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({
          lat,
          lng,
          label: `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationError('Unable to retrieve current location. Please allow browser location access.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const currentHospital: DetailedHospitalProfile =
    detailedHospitalsList.find((h) => h.id === selectedHospitalId) || detailedHospitalsList[0];

  // Filter & Sort Hospitals
  const filteredHospitals = detailedHospitalsList
    .filter((h) => {
      const matchSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCity = selectedCity === 'All' || h.city === selectedCity;
      return matchSearch && matchCity;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return (a.distanceKm || 99) - (b.distanceKm || 99);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'beds') return b.bedCapacity - a.bedCapacity;
      if (sortBy === 'cost') {
        const costA = a.costIndications[0]?.avgCostINR || 999999;
        const costB = b.costIndications[0]?.avgCostINR || 999999;
        return costA - costB;
      }
      return 0;
    });

  const handleOpenDetail = (id: string) => {
    onSelectHospitalId(id);
    setViewType('detail');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Header & View Mode Switcher */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[11px] rounded tracking-wider uppercase">
              PATIENT DIRECTORY
            </span>
            <span className="text-[12px] text-[#737783] font-medium font-mono-data">
              {filteredHospitals.length} HOSPITALS MATCHED
            </span>
          </div>
          <h1 className="text-[24px] font-bold text-[#003178] mt-1">Partner Hospitals & Surgical Centers</h1>
          <p className="text-[14px] text-[#434652]">
            Browse accredited medical centers with live distance calculations, verified ratings, emergency contacts, and direct quote requests.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#f3faff] border border-[#c3c6d4] rounded-2xl shrink-0">
          <button
            onClick={() => setViewType('grid')}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-all ${
              viewType === 'grid'
                ? 'bg-[#003178] text-white shadow-sm'
                : 'text-[#434652] hover:bg-[#dbf1fe]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            <span>Grid View</span>
          </button>

          <button
            onClick={() => setViewType('map')}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-all ${
              viewType === 'map'
                ? 'bg-[#003178] text-white shadow-sm'
                : 'text-[#434652] hover:bg-[#dbf1fe]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span>Map View</span>
          </button>

          <button
            onClick={() => setViewType('detail')}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-all ${
              viewType === 'detail'
                ? 'bg-[#003178] text-white shadow-sm'
                : 'text-[#434652] hover:bg-[#dbf1fe]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>Hospital Profile</span>
          </button>
        </div>
      </div>

      {/* SEARCH, SORTING & FILTERING BAR (Shown for Grid & Map Views) */}
      {viewType !== 'detail' && (
        <div className="bg-white rounded-2xl border border-[#c3c6d4] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737783] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hospital name, specialty, or city..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[14px] text-[#071e27] focus:outline-none focus:ring-2 focus:ring-[#003178]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* City Filter */}
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-[#737783] font-medium hidden sm:inline">City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[13px] font-bold text-[#003178] focus:outline-none"
              >
                <option value="All">All Cities</option>
                <option value="Bangalore">Bangalore</option>
                <option value="New Delhi">New Delhi</option>
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-[#737783] font-medium hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[13px] font-bold text-[#003178] focus:outline-none"
              >
                <option value="distance">📍 Distance: Nearest First</option>
                <option value="rating">⭐ Rating: Highest First</option>
                <option value="beds">🛏️ Bed Capacity: Highest</option>
                <option value="cost">💰 Surgery Cost: Lowest First</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: PATIENT HOSPITALS GRID VIEW (ONE BY ONE CARDS) */}
      {/* ========================================================================= */}
      {viewType === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHospitals.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl border border-[#c3c6d4] p-5 shadow-sm space-y-4 hover:border-[#003178] hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Card Top Row: Name, Status & Rating */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        onClick={() => handleOpenDetail(h.id)}
                        className="text-[18px] font-bold text-[#071e27] group-hover:text-[#003178] transition-colors cursor-pointer"
                      >
                        {h.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-[#d1fae5] text-[#065f46] text-[10px] font-bold rounded uppercase tracking-wider">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[13px] text-[#525866] mt-0.5 font-medium flex items-center gap-2 flex-wrap">
                      <span>{h.city}</span>
                      <span>•</span>
                      <span>Beds: {h.bedCapacity}</span>
                      <span>•</span>
                      <span className="text-[#006f66] font-bold font-mono-data bg-[#81f3e5]/40 px-1.5 py-0.2 rounded">
                        📍 {h.distanceKm || 1.5} km away
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-amber-600 font-bold text-[13px] bg-[#fffbeb] border border-[#fef3c7] px-2.5 py-1 rounded-xl shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 material-symbols-filled">
                      star
                    </span>
                    <span>{h.rating}</span>
                  </div>
                </div>

                {/* Accreditations Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {h.accreditation.map((acc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-[#f1f5f9] text-[#334155] text-[11px] font-medium rounded border border-[#e2e8f0]"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Middle Section: Contact & Operational Info Sub-card */}
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] text-[13px] text-[#434652] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div>
                    <span className="text-[#737783] font-medium">Contact: </span>
                    <strong className="text-[#071e27] font-bold">
                      {h.doctors[0]?.name ? `${h.doctors[0].name} / Admin` : 'Desk Coordinator'}
                    </strong>
                  </div>
                  <span className="text-[11px] font-bold text-[#006f66] bg-[#81f3e5]/50 px-2 py-0.5 rounded">
                    24x7 Emergency Care
                  </span>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div>
                    <span className="text-[#737783] font-medium">Phone: </span>
                    <a
                      href={`tel:${h.phone}`}
                      className="font-mono-data text-[#003178] font-bold hover:underline"
                    >
                      {h.phone}
                    </a>
                  </div>

                  <div>
                    <span className="text-[#737783] font-medium">Active Surgeons: </span>
                    <strong className="text-[#071e27] font-bold font-mono-data">
                      {h.doctors.length * 8 + 4}
                    </strong>
                  </div>
                </div>

                {/* Avg Laparoscopy Cost Benchmark */}
                {h.costIndications.length > 0 && (
                  <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[12px] flex-wrap gap-1">
                    <span className="text-[#737783]">Avg Laparoscopy Estimate:</span>
                    <strong className="text-[#003178] font-mono-data font-bold">
                      ₹{h.costIndications[0].avgCostINR.toLocaleString('en-IN')} ({h.costIndications[0].rangeText})
                    </strong>
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9] gap-2 flex-wrap">
                {h.websiteUrl ? (
                  <a
                    href={h.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#003178] font-bold text-[13px] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Visit Official Site</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                ) : (
                  <span className="text-[12px] text-gray-400">Verified Partner</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRequestQuoteForHospital(h.name)}
                    className="px-3 py-1.5 text-[12px] font-bold bg-[#81f3e5] text-[#006f66] hover:bg-[#6bead9] rounded-xl transition-all shadow-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">request_quote</span>
                    <span>Get Quote</span>
                  </button>

                  <button
                    onClick={() => handleOpenDetail(h.id)}
                    className="px-3.5 py-1.5 text-[12px] font-bold bg-[#003178] text-white hover:bg-[#0d47a1] rounded-xl transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>Full Profile</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: MAP VIEW WITH GOOGLE MAPS EMBED & SINGLE COLUMN LAYOUT */}
      {/* ========================================================================= */}
      {viewType === 'map' && (
        <div className="space-y-6 w-full">
          {/* Top Bar: Search + Current Location + Hospital Quick Selectors */}
          <div className="bg-white p-4 rounded-2xl border border-[#c3c6d4] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 px-3 py-2 rounded-xl border border-[#c3c6d4]">
                <span className="material-symbols-outlined text-[#003178] text-[20px]">search</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (userLocation) setUserLocation(null);
                  }}
                  placeholder="Search hospital or area on map..."
                  className="text-[13px] font-semibold text-[#071e27] bg-transparent border-none focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className={`px-3.5 py-2 rounded-xl text-[12px] font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                    userLocation
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-[#003178] hover:bg-[#0d47a1] text-white shadow-xs'
                  }`}
                  title="Detect current GPS location"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isLocating ? 'animate-spin' : ''}`}>
                    {isLocating ? 'sync' : 'my_location'}
                  </span>
                  <span>{isLocating ? 'Locating...' : userLocation ? 'GPS Connected' : 'Use My Location'}</span>
                </button>

                <span className="px-3 py-2 bg-[#dbf1fe] text-[#003178] text-[12px] font-bold rounded-xl flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  Google Maps
                </span>
              </div>
            </div>

            {/* GPS Live Location Active Banner */}
            {userLocation && (
              <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-2 rounded-xl text-[12px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                  </span>
                  <span>📍 Centered on Your Live Location: {userLocation.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUserLocation(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-bold text-[11px] underline cursor-pointer"
                >
                  Reset Location
                </button>
              </div>
            )}

            {/* Location Error Warning */}
            {locationError && (
              <div className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-2 rounded-xl text-[12px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-amber-700">warning</span>
                  <span>{locationError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLocationError(null)}
                  className="text-amber-800 hover:text-amber-950 font-bold text-[11px]"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Quick Hospital Pills Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Quick Pin:</span>
              {filteredHospitals.map((h) => {
                const isSelected = h.id === selectedMapHospitalId;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      setSelectedMapHospitalId(h.id);
                      if (userLocation) setUserLocation(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#003178] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">local_hospital</span>
                    <span>{h.shortName || h.name}</span>
                    <span className="text-[10px] opacity-80 font-mono">({h.distanceKm || 2.5}km)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Single Column Google Maps Container */}
          <div className="w-full h-[500px] rounded-2xl relative overflow-hidden bg-slate-100 border-2 border-[#003178] shadow-sm">
            {(() => {
              const selectedH =
                detailedHospitalsList.find((h) => h.id === selectedMapHospitalId) || detailedHospitalsList[0];
              
              const mapQuery = userLocation
                ? `${userLocation.lat},${userLocation.lng}`
                : searchTerm.trim()
                ? `${searchTerm} hospitals`
                : `${selectedH.name}, ${selectedH.location || selectedH.address || 'Bangalore India'}`;

              const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

              return (
                <iframe
                  title={`Google Maps - ${selectedH.name}`}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0 rounded-2xl"
                  loading="lazy"
                  allowFullScreen
                  src={embedUrl}
                ></iframe>
              );
            })()}
          </div>

          {/* Active Hospital Highlight Card */}
          {(() => {
            const selectedH =
              detailedHospitalsList.find((h) => h.id === selectedMapHospitalId) || detailedHospitalsList[0];
            const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${selectedH.name} ${selectedH.address}`
            )}`;

            return (
              <div className="bg-white rounded-2xl border border-[#c3c6d4] p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#81f3e5] text-[#006f66] font-bold text-[10px] rounded uppercase tracking-wider">
                        SELECTED HOSPITAL
                      </span>
                      <span className="text-[12px] font-bold text-amber-600 flex items-center gap-0.5">
                        ★ {selectedH.rating || 4.8} ({selectedH.reviewsCount || selectedH.reviews?.length || 120}+ reviews)
                      </span>
                    </div>
                    <h3 className="text-[20px] font-bold text-[#071e27]">{selectedH.name}</h3>
                    <p className="text-[13px] text-slate-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#003178]">location_on</span>
                      <span>{selectedH.address} • {selectedH.distanceKm || 2.5} km away</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#e6f6ff] border border-[#c3c6d4] text-[#003178] font-bold text-[13px] rounded-xl hover:bg-[#dbf1fe] transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">directions</span>
                      <span>Get Directions on Google Maps</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenDetail(selectedH.id)}
                      className="px-4 py-2.5 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1] transition-all shadow-xs"
                    >
                      View Hospital Profile
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Specialties</span>
                    <span className="font-bold text-slate-800">{selectedH.specialties?.slice(0, 3).join(', ') || 'Orthopedics, Cardiology, Oncology'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Bed Capacity</span>
                    <span className="font-bold text-slate-800">{selectedH.bedCapacity || 450}+ Beds • 24/7 Emergency</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Contact Phone</span>
                    <span className="font-bold text-[#003178] font-mono">{selectedH.phone || '+91 80 4000 1000'}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Network Hospitals Directory List (Single Column) */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-5 shadow-xs space-y-4">
            <h3 className="text-[16px] font-bold text-[#003178] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">apartment</span>
              <span>Network Hospitals ({filteredHospitals.length})</span>
            </h3>

            <div className="space-y-3">
              {filteredHospitals.map((h) => {
                const isSelected = h.id === selectedMapHospitalId;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedMapHospitalId(h.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#f0f9ff] border-2 border-[#003178] shadow-xs'
                        : 'bg-white border-[#c3c6d4] hover:border-[#003178]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[16px] text-[#071e27]">{h.name}</h4>
                        {isSelected && (
                          <span className="px-2 py-0.5 bg-[#003178] text-white font-bold text-[10px] rounded">
                            PINNED ON MAP
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span>{h.location} • {h.distanceKm || 2.5} km away</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <span className="text-[12px] font-bold text-amber-600 flex items-center gap-0.5 sm:justify-end">
                          ★ {h.rating || 4.8}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-bold block">{h.phone}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(h.id);
                        }}
                        className="px-3.5 py-1.5 bg-[#f3faff] border border-[#c3c6d4] text-[#003178] font-bold text-[12px] rounded-lg hover:bg-[#dbf1fe] cursor-pointer"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SINGLE HOSPITAL DETAILED PROFILE */}
      {/* ========================================================================= */}
      {viewType === 'detail' && (
        <div className="space-y-6">
          {/* Back Button to Grid */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewType('grid')}
              className="px-3.5 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[#003178] font-bold text-[13px] hover:bg-[#f3faff] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Hospitals Grid</span>
            </button>

            {/* Hospital Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#434652] hidden sm:inline">Switch Hospital:</span>
              <select
                value={currentHospital.id}
                onChange={(e) => onSelectHospitalId(e.target.value)}
                className="px-3 py-1.5 bg-white border border-[#c3c6d4] rounded-xl text-[13px] font-bold text-[#003178] focus:outline-none"
              >
                {detailedHospitalsList.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hospital Banner & Main Header Card */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] shadow-sm overflow-hidden">
            {/* Hero Image Banner */}
            <div className="h-48 md:h-60 w-full relative bg-gray-900">
              <img
                src={currentHospital.bannerUrl}
                alt={currentHospital.name}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Accreditations Badges top right */}
              <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10">
                {currentHospital.accreditation.map((acc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-[#003178] font-bold text-[11px] rounded-md shadow-md border border-[#c3c6d4]"
                  >
                    {acc}
                  </span>
                ))}
              </div>

              {/* Location pill bottom right */}
              <div className="absolute bottom-4 right-4 text-white text-[12px] font-medium bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#81f3e5]">location_on</span>
                <span>{currentHospital.location}</span>
              </div>
            </div>

            {/* Profile Details Bar */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-16 relative z-10">
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border-2 border-[#c3c6d4] p-2 shadow-xl shrink-0 flex items-center justify-center">
                    <img
                      src={currentHospital.logoUrl}
                      alt={currentHospital.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-[26px] font-bold text-[#003178] leading-tight">{currentHospital.name}</h1>
                    <p className="text-[14px] text-[#434652] font-medium">{currentHospital.tagline}</p>
                    <div className="flex items-center gap-3 text-[13px] pt-1">
                      <span className="flex items-center gap-1 font-bold text-[#003178]">
                        <span className="material-symbols-outlined text-[18px] text-amber-500">star</span>
                        <span>{currentHospital.rating}</span>
                        <span className="text-[#737783] font-normal">({currentHospital.reviewsCount} reviews)</span>
                      </span>
                      <span className="text-[#c3c6d4]">•</span>
                      <span className="text-[#006f66] font-bold bg-[#81f3e5] px-2 py-0.5 rounded text-[11px]">
                        VERIFIED CLINICAL PARTNER
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => onRequestQuoteForHospital(currentHospital.name)}
                    className="px-5 py-2.5 bg-[#81f3e5] text-[#006f66] font-bold text-[14px] rounded-xl hover:bg-[#6bead9] transition-all shadow-md flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">request_quote</span>
                    <span>Request Quotation</span>
                  </button>

                  <button
                    onClick={() => onNavigate('quotes')}
                    className="px-5 py-2.5 bg-[#003178] text-white font-bold text-[14px] rounded-xl hover:bg-[#002255] transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Compare vs Other Quotes</span>
                    <span className="material-symbols-outlined text-[20px]">equalizer</span>
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#f3faff] rounded-xl border border-[#c3c6d4]/60 text-[#003178]">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-[#737783] uppercase tracking-wider block">BED CAPACITY</span>
                  <p className="text-[18px] font-bold font-mono-data">{currentHospital.bedCapacity} Total Beds</p>
                  <p className="text-[11px] text-[#434652]">{currentHospital.icuBedsCount} Dedicated ICU Beds</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-[#737783] uppercase tracking-wider block">SURGICAL SUITES</span>
                  <p className="text-[18px] font-bold font-mono-data">{currentHospital.modularOTsCount} Modular OTs</p>
                  <p className="text-[11px] text-[#434652]">
                    {currentHospital.roboticSurgery ? 'Da Vinci Robotic' : 'Laparoscopic Tower'}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-[#737783] uppercase tracking-wider block">ESTABLISHED</span>
                  <p className="text-[18px] font-bold font-mono-data">Year {currentHospital.establishedYear}</p>
                  <p className="text-[11px] text-[#434652]">{2026 - currentHospital.establishedYear}+ Years Care</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-[#737783] uppercase tracking-wider block">EMERGENCY & TPA</span>
                  <p className="text-[18px] font-bold text-[#006f66]">24/7 ER Ready</p>
                  <p className="text-[11px] text-[#434652]">Cashless Approval Desk</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#c3c6d4] space-x-6 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview & Facilities', icon: 'info' },
                  { id: 'doctors', label: `Surgeons & Doctors (${currentHospital.doctors.length})`, icon: 'clinical_notes' },
                  { id: 'insurance', label: 'Insurance & Cashless TPAs', icon: 'verified_user' },
                  { id: 'reviews', label: `Patient Reviews (${currentHospital.reviews.length})`, icon: 'rate_review' },
                  { id: 'location', label: 'Contact & Location', icon: 'pin_drop' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 font-bold text-[14px] flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#003178] text-[#003178]'
                        : 'border-transparent text-[#737783] hover:text-[#003178]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* TAB CONTENT 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="space-y-3">
                    <h3 className="text-[18px] font-bold text-[#071e27]">About {currentHospital.name}</h3>
                    <p className="text-[15px] text-[#434652] leading-relaxed">{currentHospital.overviewText}</p>
                  </div>

                  {/* Key Highlights Grid */}
                  <div className="space-y-3">
                    <h3 className="text-[16px] font-bold text-[#071e27]">Clinical Highlights & Infrastructure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentHospital.keyHighlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#f3faff] rounded-xl border border-[#c3c6d4]/60 flex items-start gap-2 text-[14px] text-[#071e27]"
                        >
                          <span className="material-symbols-outlined text-[#006f66] text-[20px] shrink-0">
                            check_circle
                          </span>
                          <span className="font-medium">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Procedure Costs Benchmark */}
                  <div className="space-y-3">
                    <h3 className="text-[16px] font-bold text-[#071e27]">Cost Indications & Benchmark Guidance</h3>
                    <div className="bg-white rounded-xl border border-[#c3c6d4] overflow-hidden">
                      <table className="w-full text-left text-[14px]">
                        <thead className="bg-[#f3faff] text-[#003178] font-bold border-b border-[#c3c6d4]">
                          <tr>
                            <th className="p-3">Surgical Procedure</th>
                            <th className="p-3">Estimated Average</th>
                            <th className="p-3">Cost Range (Room Dependent)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#c3c6d4]/60">
                          {currentHospital.costIndications.map((c, idx) => (
                            <tr key={idx} className="hover:bg-[#f3faff]/50">
                              <td className="p-3 font-bold text-[#071e27]">{c.procedureName}</td>
                              <td className="p-3 font-mono-data text-[#003178] font-bold">
                                ₹{c.avgCostINR.toLocaleString('en-IN')}
                              </td>
                              <td className="p-3 text-[#434652] font-mono-data">{c.rangeText}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: DOCTORS */}
              {activeTab === 'doctors' && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-[18px] font-bold text-[#071e27]">Featured Senior Surgeons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentHospital.doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 bg-white rounded-xl border border-[#c3c6d4] shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-[16px] text-[#003178]">{doc.name}</h4>
                            <p className="text-[12px] text-[#006f66] font-bold">{doc.designation}</p>
                            <p className="text-[12px] text-[#434652] mt-0.5">{doc.qualification}</p>
                          </div>
                          <span className="flex items-center gap-1 font-bold text-[12px] text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            ⭐ {doc.rating}
                          </span>
                        </div>

                        <div className="text-[12px] text-[#434652] space-y-1 bg-[#f3faff] p-2.5 rounded-lg border border-[#c3c6d4]/50">
                          <div>Specialty: <strong className="text-[#071e27]">{doc.specialty}</strong></div>
                          <div>Experience: <strong className="text-[#071e27]">{doc.experienceYears}+ Years</strong></div>
                          <div>OPD Timings: <span className="font-mono-data text-[#003178]">{doc.opdTimings}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: INSURANCE */}
              {activeTab === 'insurance' && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-[18px] font-bold text-[#071e27]">Supported Cashless Insurance Providers</h3>
                  <p className="text-[14px] text-[#434652]">
                    This hospital features a dedicated 24/7 TPA Cashless Desk. Pre-authorization claims are processed on-site.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentHospital.supportedInsurances.map((ins, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-2 bg-[#dbf1fe] text-[#003178] font-bold text-[13px] rounded-xl border border-[#cfe6f2] flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#006f66]">verified</span>
                        <span>{ins}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 4: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-[18px] font-bold text-[#071e27]">Verified Patient Feedback</h3>
                  <div className="space-y-3">
                    {currentHospital.reviews.map((rev, idx) => (
                      <div key={idx} className="p-4 bg-[#f3faff] rounded-xl border border-[#c3c6d4]/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <strong className="text-[14px] text-[#071e27]">{rev.patientName}</strong>
                            <span className="text-[11px] text-[#737783]">• {rev.procedure}</span>
                          </div>
                          <span className="text-[12px] font-bold text-amber-600">⭐ {rev.rating} / 5</span>
                        </div>
                        <p className="text-[13px] text-[#434652] italic">"{rev.comment}"</p>
                        <p className="text-[11px] text-[#737783] text-right">{rev.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 5: LOCATION */}
              {activeTab === 'location' && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-[18px] font-bold text-[#071e27]">Hospital Address & Contact Information</h3>
                  <div className="p-4 bg-[#f3faff] rounded-xl border border-[#c3c6d4]/60 space-y-2 text-[14px]">
                    <div>Full Address: <strong className="text-[#071e27]">{currentHospital.address}</strong></div>
                    <div>Emergency Contact Phone: <a href={`tel:${currentHospital.phone}`} className="text-[#003178] font-bold font-mono-data">{currentHospital.phone}</a></div>
                    <div>Email Desk: <a href={`mailto:${currentHospital.email}`} className="text-[#003178] font-bold">{currentHospital.email}</a></div>
                    {currentHospital.websiteUrl && (
                      <div>Official Portal: <a href={currentHospital.websiteUrl} target="_blank" rel="noreferrer" className="text-[#006f66] font-bold underline">{currentHospital.websiteUrl}</a></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
