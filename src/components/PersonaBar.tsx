import React, { useState } from 'react';
import { UserPersona, ViewMode } from '../types';

interface PersonaBarProps {
  personas: UserPersona[];
  activePersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  onAddPersona: (newPersona: UserPersona) => void;
}

export const PersonaBar: React.FC<PersonaBarProps> = ({
  personas,
  activePersona,
  onSelectPersona,
  onAddPersona,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Persona Form State
  const [name, setName] = useState('');
  const [roleType, setRoleType] = useState<'patient' | 'hospital' | 'insurance' | 'app_admin'>('patient');
  const [roleTitle, setRoleTitle] = useState('');
  const [email, setEmail] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [badgeText, setBadgeText] = useState('CUSTOM USER');

  const handleCreatePersonaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let allowedViews: ViewMode[] = ['dashboard', 'new-case', 'cases', 'family', 'quotes', 'records', 'hospitals', 'hospital-profile', 'checkout', 'recommendations', 'upload', 'account'];
    if (roleType === 'hospital') {
      allowedViews = ['hospitals', 'hospital-profile', 'quotes', 'doctor-portal', 'admin', 'cases'];
    } else if (roleType === 'insurance') {
      allowedViews = ['admin', 'cases', 'quotes', 'dashboard'];
    } else if (roleType === 'app_admin') {
      allowedViews = ['dashboard', 'new-case', 'cases', 'family', 'quotes', 'records', 'hospitals', 'hospital-profile', 'checkout', 'recommendations', 'upload', 'account', 'doctor-portal', 'admin'];
    }

    const newPersona: UserPersona = {
      id: `persona-${Date.now()}`,
      name: name.trim(),
      roleTitle: roleTitle.trim() || `${roleType.toUpperCase()} USER`,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@mediquote.ai`,
      hospitalName: hospitalName.trim() || undefined,
      badgeText: badgeText.trim().toUpperCase() || 'USER',
      description: `Custom registered ${roleType} profile in MediQuote AI system.`,
      allowedViews,
    };

    onAddPersona(newPersona);
    onSelectPersona(newPersona);

    // Reset Form
    setIsAddModalOpen(false);
    setIsDropdownOpen(false);
    setName('');
    setRoleTitle('');
    setEmail('');
    setHospitalName('');
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-gradient-to-r from-[#001d4a] via-[#003178] to-[#001d4a] text-white px-4 border-b border-[#006f66]/50 text-[13px] shadow-md flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-2">
          {/* Left Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#81f3e5] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#81f3e5]" />
            </span>
            <span className="font-bold text-[11px] text-[#81f3e5] uppercase tracking-wider font-mono-data">
              LIVE PROTOTYPE PERSONA SWITCHER
            </span>
            <span className="hidden md:inline text-blue-200/80 text-[11px]">| Switch role or add persona</span>
          </div>

          {/* Persona Dropdown Container */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[12px] font-bold flex items-center gap-2 transition-all"
            >
              <span className="text-blue-200 text-[11px] font-normal hidden sm:inline">Active Role:</span>
              <span className="text-[#81f3e5] font-bold">{activePersona.name}</span>
              <span className="px-1.5 py-0.2 bg-[#006f66] text-white text-[9px] font-mono-data font-extrabold rounded uppercase">
                {activePersona.badgeText}
              </span>
              <span className="material-symbols-outlined text-[16px] text-blue-200">
                {isDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
            </button>

            {/* Dropdown Menu Popover */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-11 w-72 bg-white text-[#071e27] rounded-xl shadow-2xl border border-[#c3c6d4] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-[#003178] text-white p-3 border-b border-[#006f66]/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#81f3e5] text-[18px]">group</span>
                    <span className="font-bold text-[12px]">Select or Add Persona</span>
                  </div>
                  <span className="text-[10px] text-blue-200 font-mono-data">{personas.length} Loaded</span>
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-1">
                  {personas.map((p) => {
                    const isActive = p.id === activePersona.id;
                    let iconName = 'person';
                    if (p.id.includes('app_admin') || p.badgeText.includes('APP ADMIN') || p.badgeText.includes('SUPER ADMIN')) {
                      iconName = 'admin_panel_settings';
                    } else if (p.id.includes('hospital') || p.badgeText.includes('HOSPITAL')) {
                      iconName = 'local_hospital';
                    } else if (p.id.includes('insurance') || p.badgeText.includes('INSURANCE')) {
                      iconName = 'verified_user';
                    }

                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectPersona(p);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                          isActive
                            ? 'bg-[#e6f6ff] border-l-4 border-[#003178]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg text-white text-[16px] shrink-0 ${
                          isActive ? 'bg-[#003178]' : 'bg-slate-600'
                        }`}>
                          <span className="material-symbols-outlined text-[18px]">{iconName}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-[13px] text-[#003178] truncate">{p.name}</h4>
                            <span className="px-1.5 py-0.2 bg-slate-100 text-[#006f66] text-[9px] font-mono-data font-bold rounded uppercase shrink-0 border">
                              {p.badgeText}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#434652] truncate">{p.roleTitle}</p>
                          <p className="text-[10px] text-[#737783] font-mono-data truncate">{p.email}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom User Button at Bottom of Dropdown */}
                <div className="p-2 bg-[#f8fafc] border-t border-[#c3c6d4]">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsAddModalOpen(true);
                    }}
                    className="w-full py-2 bg-[#003178] text-white font-bold text-[12px] rounded-lg hover:bg-[#0d47a1] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span>+ Add Custom User / Persona</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Persona / User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#c3c6d4] shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-[#003178] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#81f3e5]">person_add</span>
                <h3 className="font-bold text-[18px]">Add Custom User Persona</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white hover:text-blue-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePersonaSubmit} className="p-6 space-y-4 text-[13px] text-[#071e27]">
              <div>
                <label className="block font-bold mb-1 text-[#003178]">User Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[#003178]">Persona Role *</label>
                  <select
                    value={roleType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setRoleType(val);
                      if (val === 'patient') setBadgeText('PATIENT PORTAL');
                      if (val === 'hospital') setBadgeText('HOSPITAL ADMIN');
                      if (val === 'insurance') setBadgeText('INSURANCE TPA');
                      if (val === 'app_admin') setBadgeText('APP ADMIN');
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                  >
                    <option value="patient">Patient / Family</option>
                    <option value="hospital">Hospital Admissions</option>
                    <option value="insurance">Insurance TPA Desk</option>
                    <option value="app_admin">App Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#003178]">Badge Text</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. CONSULTANT"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#003178]">Role Title / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Medical Coordinator"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#003178]">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rajesh@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                />
              </div>

              {roleType === 'hospital' && (
                <div>
                  <label className="block font-bold mb-1 text-[#003178]">Hospital / Facility Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Manipal Hospital Old Airport Rd"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                  />
                </div>
              )}

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-[#434652] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003178] text-white font-bold rounded-xl hover:bg-[#0d47a1]"
                >
                  Save & Switch to Persona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
