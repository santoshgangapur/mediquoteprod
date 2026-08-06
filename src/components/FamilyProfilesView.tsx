import React, { useState } from 'react';
import { FamilyMember, SurgicalCase, ViewMode } from '../types';

interface FamilyProfilesViewProps {
  familyMembers: FamilyMember[];
  cases: SurgicalCase[];
  onAddFamilyMember: (newMember: FamilyMember) => void;
  onSelectMemberForNewCase: (member: FamilyMember) => void;
  onNavigate: (view: ViewMode) => void;
}

export const FamilyProfilesView: React.FC<FamilyProfilesViewProps> = ({
  familyMembers,
  cases,
  onAddFamilyMember,
  onSelectMemberForNewCase,
  onNavigate,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTabMemberId, setActiveTabMemberId] = useState<string>('all');

  // Form State for New Member
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('Spouse');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [conditionsText, setConditionsText] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [insurancePolicy, setInsurancePolicy] = useState('HDFC-OPT-992014-DEP');

  const handleCreateMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newMem: FamilyMember = {
      id: `fam-${Date.now()}`,
      fullName: fullName.trim(),
      relationship,
      age: Number(age) || 30,
      gender,
      bloodGroup,
      preExistingConditions: conditionsText ? conditionsText.split(',').map((s) => s.trim()) : ['None Reported'],
      allergies: allergiesText ? allergiesText.split(',').map((s) => s.trim()) : ['None'],
      activeCasesCount: 0,
      avatarColor: 'bg-teal-700',
      insurancePolicyNumber: insurancePolicy || 'HDFC-OPT-992014',
    };

    onAddFamilyMember(newMem);
    setIsAddModalOpen(false);

    // Reset Form
    setFullName('');
    setConditionsText('');
    setAllergiesText('');
  };

  const filteredCases = activeTabMemberId === 'all'
    ? cases
    : cases.filter((c) => c.patientMemberId === activeTabMemberId);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c3c6d4]/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#003178] text-white text-[11px] font-bold rounded uppercase tracking-wider font-mono-data">
              CENTRALIZED PATIENT MANAGEMENT
            </span>
            <span className="text-[12px] text-[#006f66] font-bold font-mono-data">
              {familyMembers.length} Family Members Registered
            </span>
          </div>

          <h1 className="text-[26px] font-bold text-[#003178] mt-1">
            Family Health Profiles & Dependents
          </h1>
          <p className="text-[14px] text-[#434652]">
            Manage medical records, pre-existing health conditions, insurance policies, and surgical cases for your whole family.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-[#003178] text-white font-bold text-[14px] rounded-xl hover:bg-[#0d47a1] transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span>Add Family Dependent</span>
        </button>
      </div>

      {/* FAMILY MEMBERS CARDS - SINGLE COLUMN LAYOUT */}
      <div className="flex flex-col gap-4">
        {familyMembers.map((member) => {
          const memberCases = cases.filter((c) => c.patientMemberId === member.id);
          const activeCaseCount = memberCases.length;

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-[#c3c6d4] p-5 shadow-sm hover:shadow-md hover:border-[#003178] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
            >
              {/* Member Info & Vitals */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className={`w-12 h-12 rounded-2xl ${member.avatarColor} text-white font-bold text-[18px] flex items-center justify-center shadow-sm shrink-0`}
                  >
                    {member.fullName.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[17px] text-[#071e27] leading-tight">
                        {member.fullName}
                      </h3>
                      <span className="px-2 py-0.5 bg-[#f3faff] text-[#003178] font-bold text-[11px] rounded border border-[#c3c6d4]">
                        {member.relationship}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-[#434652] mt-1 font-mono-data">
                      <span>Age: <strong>{member.age} yrs ({member.gender})</strong></span>
                      <span>•</span>
                      <span>Blood: <strong className="text-[#003178]">{member.bloodGroup}</strong></span>
                      <span>•</span>
                      <span className="text-[#006f66] font-bold">{member.insurancePolicyNumber || 'Insurance Covered'}</span>
                    </div>
                  </div>
                </div>

                {/* Pre-existing conditions & Allergies */}
                <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-[#c3c6d4]/60 pt-3 sm:pt-0 sm:pl-4">
                  <span className="font-bold text-[#737783] block uppercase text-[10px] tracking-wider mb-1">
                    HEALTH CONDITIONS & ALLERGIES:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.preExistingConditions.map((cond, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] rounded font-medium"
                      >
                        {cond}
                      </span>
                    ))}
                    {member.allergies.map((allg, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-red-50 text-red-900 border border-red-200 text-[11px] rounded font-medium"
                      >
                        Allergy: {allg}
                      </span>
                    ))}
                    {member.preExistingConditions.length === 0 && member.allergies.length === 0 && (
                      <span className="text-[12px] text-gray-400 italic">No pre-existing conditions listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#c3c6d4]/60 gap-3 shrink-0">
                {activeCaseCount > 0 ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-300 font-mono-data">
                    {activeCaseCount} Active Surgical Case
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded border">
                    No Active Case
                  </span>
                )}

                <button
                  onClick={() => onSelectMemberForNewCase(member)}
                  className="px-4 py-2 bg-[#003178] text-white font-bold text-[12px] rounded-xl hover:bg-[#0d47a1] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add_notes</span>
                  <span>Start Surgical Case</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER & SURGICAL CASES LINKED TO FAMILY */}
      <div className="bg-white rounded-2xl border border-[#c3c6d4] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c3c6d4]/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003178] text-[24px]">surgical</span>
            <h2 className="text-[18px] font-bold text-[#003178]">
              Active Surgical Cases by Family Member
            </h2>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[12px]">
            <span className="text-[#737783] font-bold mr-1">Filter Member:</span>
            <button
              onClick={() => setActiveTabMemberId('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTabMemberId === 'all'
                  ? 'bg-[#003178] text-white'
                  : 'bg-slate-100 text-[#434652] hover:bg-slate-200'
              }`}
            >
              All Family Cases ({cases.length})
            </button>

            {familyMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveTabMemberId(m.id)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTabMemberId === m.id
                    ? 'bg-[#003178] text-white'
                    : 'bg-slate-100 text-[#434652] hover:bg-slate-200'
                }`}
              >
                {m.fullName.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-[#737783] space-y-2">
            <span className="material-symbols-outlined text-[40px] text-slate-300">search_off</span>
            <p className="font-bold text-[15px]">No active surgical cases for this family member.</p>
            <p className="text-[13px]">Click "Start Surgical Case" above to create a new quote request.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-[#f8fafc] rounded-xl border border-[#c3c6d4] space-y-3 hover:border-[#003178] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#003178] text-white text-[10px] font-bold rounded font-mono-data uppercase">
                        {c.caseCode}
                      </span>
                      <span className="text-[12px] font-bold text-[#006f66]">
                        {c.patientMemberName || 'Primary Profile'}
                      </span>
                    </div>
                    <h3 className="font-bold text-[16px] text-[#071e27] mt-1">{c.title}</h3>
                    <p className="text-[12px] text-[#434652]">{c.subtitle}</p>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-300 shrink-0 font-mono-data">
                    {c.quotesReadyCount} Quotes Received
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border text-[12px] text-[#434652] line-clamp-2">
                  <strong>AI Assessment: </strong>{c.aiPrimaryRecommendationReason}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#737783] font-mono-data">Created: {c.createdDate}</span>
                  <button
                    onClick={() => onNavigate('quotes')}
                    className="px-3 py-1.5 bg-[#81f3e5] text-[#006f66] font-bold text-[12px] rounded-lg hover:bg-[#003178] hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>View Quotations Matrix</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD FAMILY MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#c3c6d4] shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#003178] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#81f3e5]">person_add</span>
                <h3 className="font-bold text-[18px]">Add Family Dependent Profile</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white hover:text-blue-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateMemberSubmit} className="p-6 space-y-4 text-[13px] text-[#071e27]">
              <div>
                <label className="block font-bold mb-1 text-[#003178]">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Mehta"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[#003178]">Relationship *</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as FamilyMember['relationship'])}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Dependent">Other Dependent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#003178]">Age (Years) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={110}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[#003178]">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#003178]">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#003178]">Pre-Existing Health Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Diabetes (comma separated)"
                  value={conditionsText}
                  onChange={(e) => setConditionsText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#003178]">Known Drug / Food Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, Dust Mites"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#003178]">Insurance Dependent Member ID</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC-OPT-992014-DEP1"
                  value={insurancePolicy}
                  onChange={(e) => setInsurancePolicy(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c3c6d4] focus:outline-none focus:border-[#003178]"
                />
              </div>

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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
