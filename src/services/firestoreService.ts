import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseLive } from './firebaseConfig';
import { Booking, Room } from '../types';
import { MOCK_ROOMS } from '../data/mockRooms';

const ROOMS_COLLECTION = 'rooms';
const BOOKINGS_COLLECTION = 'bookings';

function withTimeout<T>(promise: Promise<T>, ms: number = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_FIRESTORE')), ms)
    ),
  ]);
}

let isAlreadySeeded = false;

/**
 * Seed initial study rooms if collection is empty
 * Optimized for non-blocking background write and fast timeout
 */
export async function seedRoomsIfEmpty(): Promise<Room[]> {
  if (!db || !isFirebaseLive) return MOCK_ROOMS;
  if (isAlreadySeeded) return MOCK_ROOMS;

  try {
    const colRef = collection(db, ROOMS_COLLECTION);
    const snap = await withTimeout(getDocs(colRef), 1500);

    if (snap.empty && !isAlreadySeeded) {
      isAlreadySeeded = true;
      console.log('[Firestore] Seeding study rooms to Cloud Firestore (background)...');
      // Parallel background save
      Promise.allSettled(
        MOCK_ROOMS.map((r) => setDoc(doc(db!, ROOMS_COLLECTION, r.id), r))
      ).catch((e) => console.warn('[Firestore] Background seed notice:', e));
      return MOCK_ROOMS;
    }

    const rooms: Room[] = [];
    snap.forEach((d) => {
      rooms.push(d.data() as Room);
    });
    return rooms.length > 0 ? rooms : MOCK_ROOMS;
  } catch (err) {
    console.warn('[Firestore] Fast fallback to MOCK_ROOMS (offline / quick-load):', err);
    return MOCK_ROOMS;
  }
}

/**
 * Real-time listener for Rooms in Firestore
 * Instantly renders local rooms, then syncs with Firestore in background
 */
export function subscribeRoomsRealtime(onRoomsUpdated: (rooms: Room[]) => void): () => void {
  // 1. Instantly deliver MOCK_ROOMS to UI (0ms delay)
  onRoomsUpdated(MOCK_ROOMS);

  if (!db || !isFirebaseLive) {
    return () => {};
  }

  try {
    const colRef = collection(db, ROOMS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snap) => {
        if (snap.empty) {
          seedRoomsIfEmpty().then(onRoomsUpdated);
        } else {
          const rooms: Room[] = [];
          snap.forEach((d) => {
            rooms.push(d.data() as Room);
          });
          onRoomsUpdated(rooms);
        }
      },
      (err) => {
        console.warn('[Firestore] Rooms snapshot notice (offline/test mode):', err);
        // Fallback already delivered immediately above
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn('[Firestore] subscribeRoomsRealtime notice:', error);
    return () => {};
  }
}

/**
 * Real-time listener for Bookings in Firestore
 */
export function subscribeBookingsRealtime(onBookingsUpdated: (bookings: Booking[]) => void): () => void {
  if (!db || !isFirebaseLive) {
    return () => {};
  }

  try {
    const colRef = collection(db, BOOKINGS_COLLECTION);
    const unsubscribe = onSnapshot(colRef, (snap) => {
      const bookings: Booking[] = [];
      snap.forEach((d) => {
        bookings.push(d.data() as Booking);
      });
      // Sort newest first
      bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onBookingsUpdated(bookings);
    }, (err) => {
      console.warn('[Firestore] Bookings snapshot error:', err);
    });

    return unsubscribe;
  } catch (error) {
    console.warn('[Firestore] subscribeBookingsRealtime error:', error);
    return () => {};
  }
}

/**
 * Add Room to Firestore
 */
export async function addRoomToFirestore(room: Room): Promise<boolean> {
  if (!db || !isFirebaseLive) return true;

  try {
    await setDoc(doc(db, ROOMS_COLLECTION, room.id), room);
    return true;
  } catch (err) {
    console.warn('[Firestore] addRoomToFirestore error:', err);
    return false;
  }
}

/**
 * Delete Room from Firestore
 */
export async function deleteRoomFromFirestore(roomId: string): Promise<boolean> {
  if (!db || !isFirebaseLive) return true;

  try {
    await deleteDoc(doc(db, ROOMS_COLLECTION, roomId));
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteRoomFromFirestore error:', err);
    return false;
  }
}

/**
 * Create Booking in Firestore
 */
export async function createBookingInFirestore(booking: Booking): Promise<boolean> {
  if (!db || !isFirebaseLive) return true;

  try {
    await setDoc(doc(db, BOOKINGS_COLLECTION, booking.id), booking);
    return true;
  } catch (err) {
    console.warn('[Firestore] createBookingInFirestore error:', err);
    return false;
  }
}

/**
 * Cancel Booking in Firestore
 */
export async function cancelBookingInFirestore(bookingId: string): Promise<boolean> {
  if (!db || !isFirebaseLive) return true;

  try {
    await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
      status: 'cancelled',
    });
    return true;
  } catch (err) {
    console.warn('[Firestore] cancelBookingInFirestore error:', err);
    return false;
  }
}

/**
 * Check-in Booking in Firestore (Admin function)
 */
export async function checkInBookingInFirestore(bookingId: string): Promise<boolean> {
  if (!db || !isFirebaseLive) return true;

  try {
    await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
      status: 'checked_in',
      checkedInAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('[Firestore] checkInBookingInFirestore error:', err);
    return false;
  }
}
