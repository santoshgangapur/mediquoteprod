import React, { useState } from 'react';
import { AdminUser, AdminHospital, ViewMode, MedicalRecord } from '../types';
import { SmsGatewayManagerModal } from './SmsGatewayManagerModal';
import { PlayStoreExportModal } from './PlayStoreExportModal';
import { initialMedicalRecords } from '../data/mockData';

interface AdminViewProps {
  users: AdminUser[];
  hospitals: AdminHospital[];
  medicalRecords?: MedicalRecord[];
  onUpdateUsers: (users: AdminUser[]) => void;
  onUpdateHospitals: (hospitals: AdminHospital[]) => void;
  onUpdateRecords?: (records: MedicalRecord[]) => void;
  onNavigate: (view: ViewMode) => void;
  authUser?: { mobileNumber: string; role: 'admin' | 'patient' | 'hospital' | 'insurance' | 'finance'; name: string } | null;
  onOpenAuthModal?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  users,
  hospitals,
  medicalRecords = initialMedicalRecords,
  onUpdateUsers,
  onUpdateHospitals,
  onUpdateRecords,
  onNavigate,
  authUser,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'hospitals' | 'metrics'>('users');
  const [isSmsManagerOpen, setIsSmsManagerOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);

  // Check if current authenticated user is super admin
  const isAdmin = authUser?.role === 'admin' || authUser?.mobileNumber === '+919246195689';

  // Toast / Status state
  const [managingReportsUser, setManagingReportsUser] = useState<AdminUser | null>(null);

  // Search & Filter state
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('ALL');

  const [hospitalSearch, setHospitalSearch] = useState('');
  const [hospitalStatusFilter, setHospitalStatusFilter] = useState<string>('ALL');

  // Add User Modal / Form State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Patient' | 'Doctor' | 'Hospital Coordinator' | 'System Admin'>('Patient');

  // Add Hospital Modal / Form State
  const [isAddHospitalModalOpen, setIsAddHospitalModalOpen] = useState(false);
  const [newHospName, setNewHospName] = useState('');
  const [newHospCity, setNewHospCity] = useState('Bangalore');
  const [newHospPhone, setNewHospPhone] = useState('+91 80 1234 5678');
  const [newHospWebsite, setNewHospWebsite] = useState('https://www.hospital.org');
  const [newHospBeds, setNewHospBeds] = useState(250);

  // Edit User State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Edit Hospital State
  const [editingHospital, setEditingHospital] = useState<AdminHospital | null>(null);

  // HELPER: GET USER REPORTS
  const getUserReports = (userName: string, userId: string) => {
    return medicalRecords.filter(
      (r) =>
        (r.patientMemberName && r.patientMemberName.toLowerCase() === userName.toLowerCase()) ||
        r.patientMemberId === userId
    );
  };

  // USER ACTIONS
  const handleToggleBlockUser = (userId: string) => {
    onUpdateUsers(
      users.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Blocked' ? 'Active' : 'Blocked';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    const reportsCount = getUserReports(targetUser.name, targetUser.id).length;
    const confirmMsg = reportsCount > 0
      ? `Are you sure you want to permanently delete user "${targetUser.name}" AND delete their ${reportsCount} uploaded medical report(s)?`
      : `Are you sure you want to permanently delete user "${targetUser.name}"?`;

    if (confirm(confirmMsg)) {
      // 1. Delete user from admin users list
      onUpdateUsers(users.filter((u) => u.id !== userId));

      // 2. Delete user's medical reports if callback available
      if (onUpdateRecords && reportsCount > 0) {
        onUpdateRecords(
          medicalRecords.filter(
            (r) =>
              (r.patientMemberName && r.patientMemberName.toLowerCase() !== targetUser.name.toLowerCase()) &&
              r.patientMemberId !== targetUser.id
          )
        );
      }
    }
  };

  const handleDeleteUserReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this medical report?')) {
      if (onUpdateRecords) {
        onUpdateRecords(medicalRecords.filter((r) => r.id !== reportId));
      }
    }
  };

  const handleDeleteAllReportsForUser = (user: AdminUser) => {
    const reports = getUserReports(user.name, user.id);
    if (reports.length === 0) return;

    if (confirm(`Are you sure you want to delete all ${reports.length} medical report(s) uploaded for "${user.name}"?`)) {
      if (onUpdateRecords) {
        onUpdateRecords(
          medicalRecords.filter(
            (r) =>
              (r.patientMemberName && r.patientMemberName.toLowerCase() !== user.name.toLowerCase()) &&
              r.patientMemberId !== user.id
          )
        );
      }
    }
  };

  const handleSaveAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const createdUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      joinedDate: 'Just now',
      casesSubmitted: 0,
    };

    onUpdateUsers([createdUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserModalOpen(false);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
  };

  // HOSPITAL ACTIONS
  const handleToggleBlockHospital = (hospId: string) => {
    onUpdateHospitals(
      hospitals.map((h) => {
        if (h.id === hospId) {
          const nextStatus = h.status === 'Blocked' ? 'Active' : 'Blocked';
          return { ...h, status: nextStatus };
        }
        return h;
      })
    );
  };

  const handleDeleteHospital = (hosp: AdminHospital) => {
    alert(
      `Unable to delete hospitals: Institutional network policy prevents deleting hospital records (${hosp.name}) to maintain statutory healthcare audit logs.\n\nTip: You can set the hospital status to 'Blocked' or 'Under Audit' to restrict access instead.`
    );
  };

  const handleSaveAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName.trim()) return;

    const createdHosp: AdminHospital = {
      id: `hosp-admin-${Date.now()}`,
      name: newHospName,
      city: newHospCity,
      status: 'Active',
      rating: 4.8,
      bedCapacity: newHospBeds,
      websiteUrl: newHospWebsite,
      contactPerson: 'Admin Desk',
      phone: newHospPhone,
      activeSurgeonsCount: 12,
    };

    onUpdateHospitals([createdHosp, ...hospitals]);
    setNewHospName('');
    setIsAddHospitalModalOpen(false);
  };

  const handleSaveEditHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;

    onUpdateHospitals(hospitals.map((h) => (h.id === editingHospital.id ? editingHospital : h)));
    setEditingHospital(null);
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
    return matchesQuery && matchesRole && matchesStatus;
  });

  const filteredHospitals = hospitals.filter((h) => {
    const matchesQuery =
      h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.city.toLowerCase().includes(hospitalSearch.toLowerCase());
    const matchesStatus = hospitalStatusFilter === 'ALL' || h.status === hospitalStatusFilter;
    return matchesQuery && matchesStatus;
  });

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-[#c3c6d4] shadow-xl p-8 text-center space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 bg-amber-100 border border-amber-300 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[36px]">admin_panel_settings</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-[24px] font-extrabold text-[#071e27]">Admin Desk Authorization Required</h2>
          <p className="text-[14px] text-[#434652] max-w-md mx-auto">
            You are currently signed in as a patient profile. The System Control Panel is restricted strictly to the designated Super Admin mobile number.
          </p>
        </div>

        <div className="bg-[#f3faff] border border-[#003178]/20 rounded-2xl p-4 text-left space-y-2 font-mono-data text-[13px]">
          <div className="flex justify-between items-center">
            <span className="text-[#434652]">Designated System Admin:</span>
            <span className="font-extrabold text-[#003178]">+919246195689</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#434652]">Current Signed In Number:</span>
            <span className="font-bold text-[#071e27]">{authUser?.mobileNumber || 'Not Logged In'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={onOpenAuthModal}
            className="px-6 py-3 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[14px] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">smartphone</span>
            <span>Sign In as Admin (+919246195689)</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-[#e6f6ff] hover:bg-[#cfe6f2] text-[#003178] font-bold text-[14px] rounded-xl transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Admin Header */}
      <div className="bg-[#0f172a] text-white rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-rose-500 text-white font-bold text-[11px] rounded tracking-wider uppercase">
                SYSTEM CONTROL PANEL
              </span>
              <span className="text-gray-400 text-[12px]">• Administrative Access</span>
            </div>
            <h1 className="text-[24px] font-bold text-white">System Administration Desk</h1>
            <p className="text-[13px] text-gray-300">
              Manage accounts, verify healthcare providers, toggle access blocks, and edit active hospital credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPlayStoreModalOpen(true)}
              className="px-3.5 py-2 rounded-full text-[13px] font-extrabold bg-[#70f3e0] hover:bg-[#50ebd6] text-[#00382f] shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-[#4be0cc]/60"
              title="Google Play Store & Android Package Management Studio"
            >
              <span className="material-symbols-outlined text-[20px] text-[#00382f]">android</span>
              <span>Play Store & Android Desk</span>
            </button>

            <button
              onClick={() => setIsSmsManagerOpen(true)}
              className="px-3.5 py-2 rounded-xl text-[13px] font-bold bg-[#003178] hover:bg-[#002256] text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">sms</span>
              <span>SMS Gateway Config</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              User Operations ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === 'hospitals'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              Hospitals Network ({hospitals.length})
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-slate-100">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">TOTAL REGISTERED USERS</span>
            <span className="text-[20px] font-bold text-white font-mono-data">{users.length}</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">ACTIVE HOSPITALS</span>
            <span className="text-[20px] font-bold text-emerald-400 font-mono-data">
              {hospitals.filter((h) => h.status === 'Active').length}
            </span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">BLOCKED ACCOUNTS</span>
            <span className="text-[20px] font-bold text-rose-400 font-mono-data">
              {users.filter((u) => u.status === 'Blocked').length +
                hospitals.filter((h) => h.status === 'Blocked').length}
            </span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">PENDING VERIFICATIONS</span>
            <span className="text-[20px] font-bold text-amber-400 font-mono-data">
              {users.filter((u) => u.status === 'Pending Verification').length}
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Patient Delete Guidance Note */}
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-[12px] text-blue-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003178] text-[20px]">manage_accounts</span>
              <span>
                <strong>Patient & Account Management:</strong> System Admins can permanently delete any patient profile, user, or uploaded medical report. Use the <em>'Delete Patient'</em> or <em>'Medical Reports'</em> buttons under the <strong>Actions</strong> column.
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#c3c6d4] rounded-xl text-[13px] focus:outline-none focus:border-blue-600"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 bg-[#f8fafc] border border-[#c3c6d4] rounded-xl text-[13px] font-medium text-[#071e27]"
              >
                <option value="ALL">All Roles</option>
                <option value="Patient">Patients</option>
                <option value="Doctor">Doctors</option>
                <option value="Hospital Coordinator">Coordinators</option>
                <option value="System Admin">Admins</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#f8fafc] border border-[#c3c6d4] rounded-xl text-[13px] font-medium text-[#071e27]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
                <option value="Pending Verification">Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#003178] text-white font-bold rounded-xl text-[13px] hover:bg-[#0d47a1] transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Add New User</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#f1f5f9] border-b border-[#c3c6d4] font-bold text-[#003178] uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-4">User Details</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Assigned Unit</th>
                    <th className="p-4 text-center">Cases</th>
                    <th className="p-4 text-center">Medical Reports</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.map((u) => {
                    const reports = getUserReports(u.name, u.id);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <strong className="text-[14px] text-slate-900 block">{u.name}</strong>
                          <span className="text-[12px] text-slate-500 font-mono-data">{u.email}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {u.status === 'Active' && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                              Active
                            </span>
                          )}
                          {u.status === 'Blocked' && (
                            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-full">
                              Blocked
                            </span>
                          )}
                          {u.status === 'Pending Verification' && (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600">{u.assignedHospital || 'N/A (Patient)'}</td>
                        <td className="p-4 text-center font-bold text-slate-800 font-mono-data">
                          {u.casesSubmitted}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => setManagingReportsUser(u)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 mx-auto border ${
                              reports.length > 0
                                ? 'bg-blue-50 text-[#003178] border-blue-200 hover:bg-blue-100'
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                            }`}
                            title="Manage & Delete User Reports"
                          >
                            <span className="material-symbols-outlined text-[15px]">description</span>
                            <span>{reports.length} File(s)</span>
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingUser(u)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="Edit User Role"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleToggleBlockUser(u.id)}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                                u.status === 'Blocked'
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {u.status === 'Blocked' ? 'Unblock' : 'Block'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer flex items-center justify-center transition-all"
                              title={`Delete ${u.role === 'Patient' ? 'patient' : 'user'} account and all associated medical reports`}
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No users match the selected search query or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOSPITAL MANAGEMENT */}
      {activeTab === 'hospitals' && (
        <div className="space-y-6">
          {/* Hospital protection compliance note */}
          <div className="p-3 bg-[#f8fafc] border border-slate-300 rounded-xl text-[12px] text-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">shield</span>
              <span>
                <strong>Institutional Network Protection:</strong> Registered hospital units cannot be deleted from the database to comply with medical audit records. You can restrict access by setting status to <em>'Blocked'</em> or <em>'Under Audit'</em>.
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-[#c3c6d4] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={hospitalSearch}
                  onChange={(e) => setHospitalSearch(e.target.value)}
                  placeholder="Search hospital or city..."
                  className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#c3c6d4] rounded-xl text-[13px] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <select
                value={hospitalStatusFilter}
                onChange={(e) => setHospitalStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#f8fafc] border border-[#c3c6d4] rounded-xl text-[13px] font-medium text-[#071e27]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
                <option value="Under Audit">Under Audit</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddHospitalModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#006f66] text-white font-bold rounded-xl text-[13px] hover:bg-[#00524c] transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              <span>Register Hospital</span>
            </button>
          </div>

          {/* Hospitals Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {filteredHospitals.map((h) => (
              <div
                key={h.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3.5 relative transition-all hover:border-[#003178] ${
                  h.status === 'Blocked' ? 'border-rose-300 bg-rose-50/20' : 'border-[#c3c6d4]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[17px] font-bold text-[#071e27] leading-tight">{h.name}</h3>
                      {h.status === 'Active' ? (
                        <span className="px-2 py-0.5 bg-[#d1fae5] text-[#065f46] text-[10px] font-bold rounded uppercase tracking-wider">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded uppercase tracking-wider">
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#525866] mt-0.5 font-medium">{h.city} • Beds: {h.bedCapacity}</p>
                  </div>

                  <div className="flex items-center gap-1 text-amber-600 font-bold text-[13px] bg-[#fffbeb] border border-[#fef3c7] px-2.5 py-1 rounded-xl shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 material-symbols-filled">star</span>
                    <span>{h.rating}</span>
                  </div>
                </div>

                <div className="text-[12px] text-[#525866] space-y-1.5 bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2e8f0]">
                  <div>Contact: <strong className="text-[#0f172a] font-bold">{h.contactPerson}</strong></div>
                  <div>Phone: <span className="font-mono-data text-[#0f172a]">{h.phone}</span></div>
                  <div>Active Surgeons: <strong className="text-[#0f172a] font-bold">{h.activeSurgeonsCount}</strong></div>
                </div>

                {/* Website Link & Admin Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
                  <a
                    href={h.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-bold text-[#003178] hover:underline flex items-center gap-1"
                  >
                    <span>Visit Official Site</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingHospital(h)}
                      className="px-3 py-1.5 text-[11px] font-bold bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0] rounded-lg transition-colors cursor-pointer"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleToggleBlockHospital(h.id)}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                        h.status === 'Blocked'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a]'
                      }`}
                    >
                      {h.status === 'Blocked' ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteHospital(h)}
                      className="px-2.5 py-1.5 text-[11px] font-bold bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-slate-200"
                      title="Unable to delete hospitals - Click to view compliance note"
                    >
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      <span>Delete Disabled</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-[18px] font-bold text-[#003178]">Add New User Account</h3>
            <form onSubmit={handleSaveAddUser} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. rajesh@hospital.com"
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Hospital Coordinator">Hospital Coordinator</option>
                  <option value="System Admin">System Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-[13px] hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD HOSPITAL */}
      {isAddHospitalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-[18px] font-bold text-[#006f66]">Register Partner Hospital</h3>
            <form onSubmit={handleSaveAddHospital} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Hospital Full Name</label>
                <input
                  type="text"
                  required
                  value={newHospName}
                  onChange={(e) => setNewHospName(e.target.value)}
                  placeholder="e.g. Manipal Super Speciality"
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#071e27] block mb-1">City</label>
                  <input
                    type="text"
                    value={newHospCity}
                    onChange={(e) => setNewHospCity(e.target.value)}
                    className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#071e27] block mb-1">Beds</label>
                  <input
                    type="number"
                    value={newHospBeds}
                    onChange={(e) => setNewHospBeds(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Official Website URL</label>
                <input
                  type="url"
                  value={newHospWebsite}
                  onChange={(e) => setNewHospWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddHospitalModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-[13px] hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006f66] text-white font-bold text-[13px] rounded-xl hover:bg-[#00524c]"
                >
                  Register Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-[18px] font-bold text-[#003178]">Edit User: {editingUser.name}</h3>
            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Hospital Coordinator">Hospital Coordinator</option>
                  <option value="System Admin">System Admin</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Status</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                >
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Pending Verification">Pending Verification</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-600 font-bold text-[13px] hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003178] text-white font-bold text-[13px] rounded-xl hover:bg-[#0d47a1]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT HOSPITAL MODAL */}
      {editingHospital && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-[18px] font-bold text-[#006f66]">Edit Hospital Details</h3>
            <form onSubmit={handleSaveEditHospital} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={editingHospital.name}
                  onChange={(e) => setEditingHospital({ ...editingHospital, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#071e27] block mb-1">Website URL</label>
                <input
                  type="url"
                  value={editingHospital.websiteUrl}
                  onChange={(e) => setEditingHospital({ ...editingHospital, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-[#c3c6d4] rounded-xl text-[13px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingHospital(null)}
                  className="px-4 py-2 text-slate-600 font-bold text-[13px] hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006f66] text-white font-bold text-[13px] rounded-xl hover:bg-[#00524c]"
                >
                  Update Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: USER MEDICAL REPORTS MANAGER */}
      {managingReportsUser && (() => {
        const userReports = getUserReports(managingReportsUser.name, managingReportsUser.id);
        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#003178] tracking-wider font-mono">USER MEDICAL REPORTS MANAGER</span>
                  <h3 className="text-[18px] font-extrabold text-[#071e27]">{managingReportsUser.name} — Uploaded Reports</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setManagingReportsUser(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {userReports.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-2">
                  <span className="material-symbols-outlined text-[36px] text-slate-400">folder_off</span>
                  <p className="text-[13px] font-bold">No active medical reports found for this user.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  <div className="flex justify-between items-center text-[12px] text-slate-600 font-bold px-1">
                    <span>{userReports.length} Document(s) Uploaded</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAllReportsForUser(managingReportsUser)}
                      className="text-rose-600 hover:text-rose-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete_forever</span>
                      <span>Delete All Reports for User</span>
                    </button>
                  </div>

                  {userReports.map((rec) => (
                    <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-[12px]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-[22px] text-[#003178]">description</span>
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-900 truncate">{rec.fileName}</h5>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {rec.category} • Uploaded {rec.uploadDate} • {rec.fileSize}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteUserReport(rec.id)}
                        className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center border border-rose-200 shrink-0"
                        title="Delete medical report"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleDeleteUser(managingReportsUser.id)}
                  className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl border border-rose-200 cursor-pointer flex items-center justify-center transition-all"
                  title="Delete user and all data"
                >
                  <span className="material-symbols-outlined text-[18px]">person_remove</span>
                </button>

                <button
                  type="button"
                  onClick={() => setManagingReportsUser(null)}
                  className="px-5 py-2 bg-[#003178] text-white font-bold rounded-xl text-[12px] hover:bg-[#0d47a1] cursor-pointer"
                >
                  Close Manager
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SMS Gateway Config & Tester Modal */}
      <SmsGatewayManagerModal
        isOpen={isSmsManagerOpen}
        onClose={() => setIsSmsManagerOpen(false)}
      />

      {/* Play Store & Android Deployment Studio Modal */}
      <PlayStoreExportModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
        authUser={authUser}
      />
    </div>
  );
};
