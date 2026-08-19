import { db, doc, collection, getDocs, setDoc, deleteDoc, testFirestoreConnection } from './firebase';
import { SurgicalCase, AdminHospital, FamilyMember, MedicalRecord, AdminUser, AuthUser } from '../types';
import { initialCases, initialAdminHospitals, initialFamilyMembers, initialMedicalRecords, initialAdminUsers } from '../data/mockData';

// Firestore collection names
const COLLECTIONS = {
  CASES: 'surgical_cases',
  HOSPITALS: 'hospitals',
  FAMILY_MEMBERS: 'family_members',
  RECORDS: 'vault_documents',
  USERS: 'users',
};

// Initial boot flag to avoid infinite seed loops
let isInitialized = false;

/**
 * Initialize and seed Firestore collections if empty
 */
export async function initializeDatabase(): Promise<{ success: boolean; cloudActive: boolean }> {
  if (isInitialized) return { success: true, cloudActive: true };

  try {
    const isOnline = await testFirestoreConnection();
    if (!isOnline) {
      console.info('Using local cache / server API sync.');
      return { success: true, cloudActive: false };
    }

    // Check if cases exist in Firestore
    const casesSnapshot = await getDocs(collection(db, COLLECTIONS.CASES));
    if (casesSnapshot.empty) {
      for (const item of initialCases) {
        await setDoc(doc(db, COLLECTIONS.CASES, item.id), item);
      }
    }

    // Check if hospitals exist
    const hospitalsSnapshot = await getDocs(collection(db, COLLECTIONS.HOSPITALS));
    if (hospitalsSnapshot.empty) {
      for (const item of initialAdminHospitals) {
        await setDoc(doc(db, COLLECTIONS.HOSPITALS, item.id), item);
      }
    }

    // Check if family members exist
    const familySnapshot = await getDocs(collection(db, COLLECTIONS.FAMILY_MEMBERS));
    if (familySnapshot.empty) {
      for (const item of initialFamilyMembers) {
        await setDoc(doc(db, COLLECTIONS.FAMILY_MEMBERS, item.id), item);
      }
    }

    // Check if records exist
    const recordsSnapshot = await getDocs(collection(db, COLLECTIONS.RECORDS));
    if (recordsSnapshot.empty) {
      for (const item of initialMedicalRecords) {
        await setDoc(doc(db, COLLECTIONS.RECORDS, item.id), item);
      }
    }

    // Check if users exist in Firestore
    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    if (usersSnapshot.empty) {
      for (const item of initialAdminUsers) {
        await setDoc(doc(db, COLLECTIONS.USERS, item.id), item);
      }
    }

    isInitialized = true;
    return { success: true, cloudActive: true };
  } catch (error) {
    console.warn('Firestore initialization fallback to local storage:', error);
    return { success: false, cloudActive: false };
  }
}

// ----------------- SURGICAL CASES -----------------

export async function fetchCasesFromCloud(): Promise<SurgicalCase[] | null> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CASES));
    if (!snapshot.empty) {
      const list: SurgicalCase[] = [];
      snapshot.forEach((d) => list.push(d.data() as SurgicalCase));
      return list;
    }
  } catch (err) {
    console.warn('Could not fetch cases from Firestore:', err);
  }
  return null;
}

export async function saveCaseToCloud(caseItem: SurgicalCase): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.CASES, caseItem.id), caseItem);
  } catch (err) {
    console.warn('Could not save case to Firestore:', err);
  }
}

export async function deleteCaseFromCloud(caseId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CASES, caseId));
  } catch (err) {
    console.warn('Could not delete case from Firestore:', err);
  }
}

// ----------------- HOSPITALS -----------------

export async function fetchHospitalsFromCloud(): Promise<AdminHospital[] | null> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.HOSPITALS));
    if (!snapshot.empty) {
      const list: AdminHospital[] = [];
      snapshot.forEach((d) => list.push(d.data() as AdminHospital));
      return list;
    }
  } catch (err) {
    console.warn('Could not fetch hospitals from Firestore:', err);
  }
  return null;
}

export async function saveHospitalToCloud(hospital: AdminHospital): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.HOSPITALS, hospital.id), hospital);
  } catch (err) {
    console.warn('Could not save hospital to Firestore:', err);
  }
}

export async function deleteHospitalFromCloud(hospitalId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.HOSPITALS, hospitalId));
  } catch (err) {
    console.warn('Could not delete hospital from Firestore:', err);
  }
}

// ----------------- FAMILY MEMBERS -----------------

export async function fetchFamilyMembersFromCloud(): Promise<FamilyMember[] | null> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.FAMILY_MEMBERS));
    if (!snapshot.empty) {
      const list: FamilyMember[] = [];
      snapshot.forEach((d) => list.push(d.data() as FamilyMember));
      return list;
    }
  } catch (err) {
    console.warn('Could not fetch family members from Firestore:', err);
  }
  return null;
}

export async function saveFamilyMemberToCloud(member: FamilyMember): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.FAMILY_MEMBERS, member.id), member);
  } catch (err) {
    console.warn('Could not save family member to Firestore:', err);
  }
}

export async function deleteFamilyMemberFromCloud(memberId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.FAMILY_MEMBERS, memberId));
  } catch (err) {
    console.warn('Could not delete family member from Firestore:', err);
  }
}

// ----------------- MEDICAL VAULT RECORDS -----------------

export async function fetchRecordsFromCloud(): Promise<MedicalRecord[] | null> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.RECORDS));
    if (!snapshot.empty) {
      const list: MedicalRecord[] = [];
      snapshot.forEach((d) => list.push(d.data() as MedicalRecord));
      return list;
    }
  } catch (err) {
    console.warn('Could not fetch records from Firestore:', err);
  }
  return null;
}

export async function saveRecordToCloud(record: MedicalRecord): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.RECORDS, record.id), record);
  } catch (err) {
    console.warn('Could not save record to Firestore:', err);
  }
}

export async function deleteRecordFromCloud(recordId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.RECORDS, recordId));
  } catch (err) {
    console.warn('Could not delete record from Firestore:', err);
  }
}

// ----------------- REGISTERED USERS -----------------

export async function fetchUsersFromCloud(): Promise<AdminUser[] | null> {
  const userMap = new Map<string, AdminUser>();

  // 1. Seed with default admin users
  initialAdminUsers.forEach((u) => {
    if (u.email) {
      userMap.set(u.email.toLowerCase(), u);
    }
  });

  // 2. Load cached users from localStorage for instant offline consistency
  try {
    const saved = localStorage.getItem('mediquote_cached_users');
    if (saved) {
      const parsed: AdminUser[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach((u) => {
          if (u.email) {
            const existing = userMap.get(u.email.toLowerCase());
            userMap.set(u.email.toLowerCase(), existing ? { ...existing, ...u } : u);
          }
        });
      }
    }
  } catch (_e) {}

  // 3. Fetch from Server Backend (/api/users)
  try {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (data && data.success && Array.isArray(data.users)) {
      data.users.forEach((u: any) => {
        if (!u || !u.email) return;
        const normalizedEmail = u.email.trim().toLowerCase();
        const roleLabel: 'System Admin' | 'Doctor' | 'Hospital Coordinator' | 'Patient' =
          u.role === 'admin'
            ? 'System Admin'
            : u.role === 'hospital'
            ? 'Hospital Coordinator'
            : u.role === 'doctor'
            ? 'Doctor'
            : 'Patient';

        const existing = userMap.get(normalizedEmail);
        const mappedUser: AdminUser = {
          id: u.id || existing?.id || `usr-${Date.now()}`,
          name: u.name || existing?.name || 'User',
          email: normalizedEmail,
          mobileNumber: u.mobileNumber || existing?.mobileNumber || '',
          role: roleLabel,
          status: u.status === 'BLOCKED' ? 'Blocked' : 'Active',
          joinedDate: u.createdAt
            ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : existing?.joinedDate || 'Just now',
          city: u.city || existing?.city || 'Bangalore',
          assignedHospital: u.organizationName || existing?.assignedHospital || (u.role === 'hospital' ? 'Apollo Hospitals' : undefined),
          casesSubmitted: existing?.casesSubmitted || 0,
        };
        userMap.set(normalizedEmail, mappedUser);
      });
    }
  } catch (err) {
    console.warn('Could not fetch users from server API:', err);
  }

  // 4. Fetch from Cloud Firestore (authoritative)
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    if (!snapshot.empty) {
      snapshot.forEach((d) => {
        const u = d.data() as any;
        if (u && u.email) {
          const normalizedEmail = u.email.trim().toLowerCase();
          const existing = userMap.get(normalizedEmail);
          const mappedRole =
            u.role === 'admin' || u.role === 'Admin' || u.role === 'System Admin'
              ? 'System Admin'
              : u.role === 'hospital' || u.role === 'Hospital Coordinator'
              ? 'Hospital Coordinator'
              : u.role === 'doctor' || u.role === 'Doctor'
              ? 'Doctor'
              : 'Patient';

          const mappedUser: AdminUser = {
            id: u.id || d.id || existing?.id || `usr-${Date.now()}`,
            name: u.name || existing?.name || 'User',
            email: normalizedEmail,
            mobileNumber: u.mobileNumber || existing?.mobileNumber || '',
            role: mappedRole,
            status: u.status === 'BLOCKED' || u.status === 'Blocked' ? 'Blocked' : 'Active',
            joinedDate: u.joinedDate || existing?.joinedDate || 'Just now',
            city: u.city || existing?.city || 'Bangalore',
            assignedHospital: u.assignedHospital || u.organizationName || existing?.assignedHospital,
            casesSubmitted: typeof u.casesSubmitted === 'number' ? u.casesSubmitted : existing?.casesSubmitted || 0,
          };
          userMap.set(normalizedEmail, mappedUser);
        } else if (u && u.id) {
          userMap.set(u.id, u as AdminUser);
        }
      });
    }
  } catch (err) {
    console.warn('Could not fetch users from Firestore:', err);
  }

  const resultList = Array.from(userMap.values());

  // Save merged list to localStorage
  try {
    localStorage.setItem('mediquote_cached_users', JSON.stringify(resultList));
  } catch (_e) {}

  return resultList;
}

export async function saveUserToCloud(user: AdminUser): Promise<void> {
  // Update localStorage cache first
  try {
    const saved = localStorage.getItem('mediquote_cached_users');
    const list: AdminUser[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase() || u.id === user.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...user };
    } else {
      list.unshift(user);
    }
    localStorage.setItem('mediquote_cached_users', JSON.stringify(list));
  } catch (_e) {}

  // Sync to Cloud Firestore
  try {
    const docId = user.id || `usr-${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    await setDoc(doc(db, COLLECTIONS.USERS, docId), {
      ...user,
      id: docId,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not save user to Firestore:', err);
  }

  // Also sync with server backend (/api/auth/register)
  try {
    const normalizedRole =
      user.role === 'Admin' || user.role === 'System Admin'
        ? 'admin'
        : user.role === 'Hospital Coordinator'
        ? 'hospital'
        : user.role === 'Doctor'
        ? 'doctor'
        : 'patient';

    await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber || '',
        role: normalizedRole,
        city: user.city || 'Bangalore',
        organizationName: user.assignedHospital || '',
        isPhoneVerified: !!user.mobileNumber,
      }),
    });
  } catch (_e) {}
}

export async function deleteUserFromCloud(userId: string): Promise<void> {
  // Update local cache
  try {
    const saved = localStorage.getItem('mediquote_cached_users');
    if (saved) {
      const list: AdminUser[] = JSON.parse(saved);
      const filtered = list.filter((u) => u.id !== userId);
      localStorage.setItem('mediquote_cached_users', JSON.stringify(filtered));
    }
  } catch (_e) {}

  // Delete from Firestore
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
  } catch (err) {
    console.warn('Could not delete user from Firestore:', err);
  }
}
