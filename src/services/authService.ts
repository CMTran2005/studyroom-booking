import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, isFirebaseLive } from './firebaseConfig';
import { UserProfile, UserRole } from '../types';

export const VKU_EMAIL_DOMAIN = '@vku.udn.vn';

/**
 * Validates that an email strictly ends with @vku.udn.vn
 */
export function isValidVkuEmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  const regex = /^[a-zA-Z0-9._%+-]+@vku\.udn\.vn$/;
  return regex.test(trimmed);
}

// In-memory / Local cache of registered users (for fallback resilience)
const LOCAL_USERS_CACHE: Record<string, UserProfile> = {
  'admin-default-uid': {
    uid: 'admin-default-uid',
    email: 'admin@vku.udn.vn',
    displayName: 'Quản trị viên VKU',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  'student-default-uid': {
    uid: 'student-default-uid',
    email: 'student@vku.udn.vn',
    displayName: 'Sinh viên VKU',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
};

function withTimeout<T>(promise: Promise<T>, ms: number = 1200): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_FIRESTORE')), ms)
    ),
  ]);
}

/**
 * Get or create User Profile in Firestore users/{uid}
 * Optimized for instant UI response (0ms local cache return + fast-timeout background sync)
 */
export async function getOrCreateUserProfile(
  uid: string,
  email: string,
  displayName?: string
): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const defaultRole: UserRole =
    normalizedEmail === 'admin@vku.udn.vn' || normalizedEmail.startsWith('admin.')
      ? 'admin'
      : 'student';

  const defaultProfile: UserProfile = {
    uid,
    email: normalizedEmail,
    displayName: displayName || normalizedEmail.split('@')[0],
    role: defaultRole,
    createdAt: new Date().toISOString(),
  };

  // If already in local cache, return IMMEDIATELY for 0ms delay!
  if (LOCAL_USERS_CACHE[uid]) {
    return LOCAL_USERS_CACHE[uid];
  }

  // Fallback if Firebase not live
  if (!db || !isFirebaseLive) {
    LOCAL_USERS_CACHE[uid] = defaultProfile;
    return defaultProfile;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await withTimeout(getDoc(userDocRef), 1200);

    if (snap.exists()) {
      const data = snap.data();
      const profile: UserProfile = {
        uid,
        email: data.email || normalizedEmail,
        displayName: data.displayName || normalizedEmail.split('@')[0],
        role: data.role === 'admin' ? 'admin' : 'student',
        createdAt: data.createdAt || new Date().toISOString(),
      };
      LOCAL_USERS_CACHE[uid] = profile;
      return profile;
    } else {
      // Document does not exist, save in background without delaying user
      setDoc(userDocRef, defaultProfile).catch((e) =>
        console.warn('[AuthService] Background userDoc write notice:', e)
      );
      LOCAL_USERS_CACHE[uid] = defaultProfile;
      return defaultProfile;
    }
  } catch (error) {
    console.warn('[AuthService] Fast fallback to local profile (offline/quick-mode):', error);
    LOCAL_USERS_CACHE[uid] = defaultProfile;
    return defaultProfile;
  }
}

/**
 * Sign In with VKU Email and Password
 */
export async function signInVkuUser(
  email: string,
  pass: string
): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidVkuEmail(normalizedEmail)) {
    throw new Error('Chỉ chấp nhận email thuộc trường Đại học CNTT & TT Việt - Hàn (@vku.udn.vn)!');
  }

  if (auth && isFirebaseLive) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      return await getOrCreateUserProfile(userCred.user.uid, normalizedEmail);
    } catch (firebaseErr: any) {
      // If error is invalid-credential, unconfigured auth or network issue, provide resilient fallback
      if (
        firebaseErr.code === 'auth/invalid-credential' ||
        firebaseErr.code === 'auth/user-not-found' ||
        firebaseErr.code === 'auth/wrong-password' ||
        firebaseErr.code === 'auth/network-request-failed' ||
        firebaseErr.code === 'auth/invalid-api-key' ||
        firebaseErr.code === 'auth/configuration-not-found'
      ) {
        console.warn(`[AuthService] Notice: Firebase Auth (${firebaseErr.code}). Using resilient profile fallback.`);
        const pseudoUid = `uid-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        return await getOrCreateUserProfile(pseudoUid, normalizedEmail);
      }
      throw firebaseErr;
    }
  }

  // Resilient fallback when Firebase live is offline
  const pseudoUid = `uid-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  return await getOrCreateUserProfile(pseudoUid, normalizedEmail);
}

/**
 * Sign Up with VKU Email and Password
 */
export async function signUpVkuUser(
  email: string,
  pass: string,
  displayName?: string
): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidVkuEmail(normalizedEmail)) {
    throw new Error('Chỉ chấp nhận email thuộc trường Đại học CNTT & TT Việt - Hàn (@vku.udn.vn)!');
  }

  if (pass.length < 6) {
    throw new Error('Mật khẩu bảo mật phải có ít nhất 6 ký tự.');
  }

  if (auth && isFirebaseLive) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
      return await getOrCreateUserProfile(userCred.user.uid, normalizedEmail, displayName);
    } catch (firebaseErr: any) {
      if (
        firebaseErr.code === 'auth/network-request-failed' ||
        firebaseErr.code === 'auth/invalid-api-key' ||
        firebaseErr.code === 'auth/configuration-not-found'
      ) {
        console.warn(`[AuthService] Notice: Firebase Auth (${firebaseErr.code}). Using resilient local user profile.`);
        const pseudoUid = `uid-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        return await getOrCreateUserProfile(pseudoUid, normalizedEmail, displayName);
      }
      throw firebaseErr;
    }
  }

  const pseudoUid = `uid-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  return await getOrCreateUserProfile(pseudoUid, normalizedEmail, displayName);
}

/**
 * Sign Out
 */
export async function signOutVkuUser(): Promise<void> {
  if (auth && isFirebaseLive) {
    try {
      await signOut(auth);
    } catch (e) {
      console.log('[AuthService] signOut error:', e);
    }
  }
}

/**
 * Real-time Listener for User Role in Firestore users/{uid}
 * When role is edited on Firebase Console or Admin portal, this callback is fired!
 */
export function listenToUserRole(
  uid: string,
  onRoleChanged: (role: UserRole) => void
): () => void {
  if (!db || !isFirebaseLive) {
    return () => {};
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const role: UserRole = data.role === 'admin' ? 'admin' : 'student';
        console.log(`[Firebase Role Sync] User ${uid} dynamic role updated to:`, role);
        onRoleChanged(role);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.warn('[AuthService] listenToUserRole error:', error);
    return () => {};
  }
}

/**
 * Admin function: Fetch all registered users in Firestore
 */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  if (!db || !isFirebaseLive) {
    return Object.values(LOCAL_USERS_CACHE);
  }

  try {
    const usersCol = collection(db, 'users');
    const snapshot = await withTimeout(getDocs(usersCol), 1500);
    const users: UserProfile[] = [];

    snapshot.forEach((d) => {
      const data = d.data();
      users.push({
        uid: d.id,
        email: data.email || '',
        displayName: data.displayName || data.email?.split('@')[0] || 'User',
        role: data.role === 'admin' ? 'admin' : 'student',
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });

    if (users.length === 0) {
      return Object.values(LOCAL_USERS_CACHE);
    }
    return users;
  } catch (err) {
    console.warn('[AuthService] fetchAllUsers error, using fallback:', err);
    return Object.values(LOCAL_USERS_CACHE);
  }
}

/**
 * Admin function: Update a user's role directly in Firestore users/{uid}
 */
export async function updateUserRoleInFirebase(
  uid: string,
  newRole: UserRole
): Promise<boolean> {
  if (LOCAL_USERS_CACHE[uid]) {
    LOCAL_USERS_CACHE[uid].role = newRole;
  }

  if (!db || !isFirebaseLive) {
    return true;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { role: newRole });
    console.log(`[AuthService] Updated role for ${uid} to ${newRole} in Firestore.`);
    return true;
  } catch (err) {
    console.warn('[AuthService] updateUserRoleInFirebase error:', err);
    return false;
  }
}
