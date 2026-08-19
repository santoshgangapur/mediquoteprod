import { db, doc, collection, getDocs, setDoc, deleteDoc, testFirestoreConnection } from './firebase';
import { SurgicalCase, AdminHospital, FamilyMember, MedicalRecord } from '../types';
import { initialCases, initialAdminHospitals, initialFamilyMembers, initialMedicalRecords } from '../data/mockData';

// Firestore collection names
const COLLECTIONS = {
  CASES: 'surgical_cases',
  HOSPITALS: 'hospitals',
  FAMILY_MEMBERS: 'family_members',
  RECORDS: 'vault_documents',
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
      // Seed initial cases
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
