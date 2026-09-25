import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Building, Equipment, Room, UserProfile, UserRole } from '../types';
import { MOCK_ROOMS } from '../data/mockRooms';
import {
  signInVkuUser,
  signUpVkuUser,
  signOutVkuUser,
  listenToUserRole,
  updateUserRoleInFirebase,
} from '../services/authService';
import {
  subscribeRoomsRealtime,
  subscribeBookingsRealtime,
  addRoomToFirestore,
  deleteRoomFromFirestore,
  createBookingInFirestore,
  cancelBookingInFirestore,
  checkInBookingInFirestore,
} from '../services/firestoreService';

export type ThemeMode = 'light' | 'dark';

// Local date string generator YYYY-MM-DD in user's timezone
export const getLocalTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Cross-platform safe storage backend (Web + Native fallback)
const safeStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return typeof window !== 'undefined' ? window.localStorage.getItem(name) : null;
      } catch (e) {
        return null;
      }
    }
    try {
      return await AsyncStorage.getItem(name);
    } catch (e) {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(name, value);
        }
      } catch (e) {}
      return;
    }
    try {
      await AsyncStorage.setItem(name, value);
    } catch (e) {}
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(name);
        }
      } catch (e) {}
      return;
    }
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      console.log('[SafeStorage] removeItem notice:', e);
    }
  },
};

interface BookingState {
  // Theme Mode (Light / Dark)
  themeMode: ThemeMode;
  toggleTheme: () => void;

  // VKU Authentication & Dynamic Role
  currentUser: UserProfile | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  loginUser: (email: string, pass: string) => Promise<UserProfile>;
  registerUser: (email: string, pass: string, displayName?: string) => Promise<UserProfile>;
  logoutUser: () => Promise<void>;
  updateUserRole: (uid: string, newRole: UserRole) => Promise<boolean>;

  // Legacy / Direct Admin Flag (True if userRole === 'admin')
  isAdminLoggedIn: boolean;

  // Rooms List (Dynamic from Firebase / MOCK)
  rooms: Room[];
  addRoom: (roomData: Omit<Room, 'id'>) => Promise<Room>;
  deleteRoom: (roomId: string) => Promise<void>;

  // Bookings List (Synced with Firestore)
  bookings: Booking[];
  bookingFilterStatus: 'ALL' | 'confirmed' | 'checked_in' | 'cancelled';
  setBookingFilterStatus: (status: 'ALL' | 'confirmed' | 'checked_in' | 'cancelled') => void;

  // Filter States
  searchQuery: string;
  selectedBuilding: Building | 'ALL';
  minCapacity: number | null;
  selectedEquipment: Equipment[];

  // Filter Actions
  setSearchQuery: (query: string) => void;
  setBuilding: (building: Building | 'ALL') => void;
  setMinCapacity: (capacity: number | null) => void;
  toggleEquipment: (equipment: Equipment) => void;
  resetFilters: () => void;

  // Real-time Availability & Conflict Engine
  isRoomSlotBooked: (roomId: string, date: string, slotId: string) => boolean;
  isSlotBooked: (roomId: string, date: string, slotId: string) => boolean;
  isRoomAvailableToday: (roomId: string) => boolean;
  addBooking: (params: {
    roomId: string;
    roomName: string;
    building: Building;
    floor: number;
    date: string;
    slotId: string;
    slotTime: string;
    purpose?: string;
  }) => Booking | null;
  cancelBooking: (bookingId: string) => void;
  checkInBooking: (bookingId: string) => Promise<boolean>;

  // Selector helper
  getFilteredRooms: () => Room[];
  initRealtimeSync: () => () => void;
}

let roleUnsubscribe: (() => void) | null = null;
let roomsUnsubscribe: (() => void) | null = null;
let bookingsUnsubscribe: (() => void) | null = null;

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      themeMode: 'light',
      toggleTheme: () =>
        set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),

      currentUser: null,
      userRole: 'student',
      isAuthenticated: false,
      isAdminLoggedIn: false,

      loginUser: async (email, pass) => {
        const user = await signInVkuUser(email, pass);
        set({
          currentUser: user,
          userRole: user.role,
          isAuthenticated: true,
          isAdminLoggedIn: user.role === 'admin',
        });

        // Listen for real-time role changes in Firestore
        if (roleUnsubscribe) roleUnsubscribe();
        roleUnsubscribe = listenToUserRole(user.uid, (newRole) => {
          set({
            userRole: newRole,
            isAdminLoggedIn: newRole === 'admin',
            currentUser: get().currentUser
              ? { ...get().currentUser!, role: newRole }
              : null,
          });
        });

        return user;
      },

      registerUser: async (email, pass, displayName) => {
        const user = await signUpVkuUser(email, pass, displayName);
        set({
          currentUser: user,
          userRole: user.role,
          isAuthenticated: true,
          isAdminLoggedIn: user.role === 'admin',
        });

        if (roleUnsubscribe) roleUnsubscribe();
        roleUnsubscribe = listenToUserRole(user.uid, (newRole) => {
          set({
            userRole: newRole,
            isAdminLoggedIn: newRole === 'admin',
            currentUser: get().currentUser
              ? { ...get().currentUser!, role: newRole }
              : null,
          });
        });

        return user;
      },

      logoutUser: async () => {
        await signOutVkuUser();
        if (roleUnsubscribe) {
          roleUnsubscribe();
          roleUnsubscribe = null;
        }
        set({
          currentUser: null,
          userRole: 'student',
          isAuthenticated: false,
          isAdminLoggedIn: false,
        });
      },

      updateUserRole: async (uid, newRole) => {
        const success = await updateUserRoleInFirebase(uid, newRole);
        if (success && get().currentUser?.uid === uid) {
          set({
            userRole: newRole,
            isAdminLoggedIn: newRole === 'admin',
            currentUser: { ...get().currentUser!, role: newRole },
          });
        }
        return success;
      },

      rooms: MOCK_ROOMS,

      addRoom: async (roomData) => {
        const newId = `room-custom-${Date.now()}`;
        const newRoom: Room = {
          id: newId,
          ...roomData,
        };
        set((state) => ({
          rooms: [newRoom, ...state.rooms],
        }));
        await addRoomToFirestore(newRoom);
        return newRoom;
      },

      deleteRoom: async (roomId) => {
        set((state) => ({
          rooms: state.rooms.filter((r) => r.id !== roomId),
        }));
        await deleteRoomFromFirestore(roomId);
      },

      bookings: [],
      bookingFilterStatus: 'ALL',
      setBookingFilterStatus: (status) => set({ bookingFilterStatus: status }),

      searchQuery: '',
      selectedBuilding: 'ALL',
      minCapacity: null,
      selectedEquipment: [],

      setSearchQuery: (query) => set({ searchQuery: query }),
      setBuilding: (building) => set({ selectedBuilding: building }),
      setMinCapacity: (capacity) => set({ minCapacity: capacity }),

      toggleEquipment: (eq) =>
        set((state) => {
          const exists = state.selectedEquipment.includes(eq);
          return {
            selectedEquipment: exists
              ? state.selectedEquipment.filter((item) => item !== eq)
              : [...state.selectedEquipment, eq],
          };
        }),

      resetFilters: () =>
        set({
          searchQuery: '',
          selectedBuilding: 'ALL',
          minCapacity: null,
          selectedEquipment: [],
        }),

      // Direct check if THIS specific room is booked for the given date & slot
      isRoomSlotBooked: (roomId, date, slotId) => {
        const { bookings } = get();
        return bookings.some(
          (b) =>
            b.roomId === roomId &&
            b.date === date &&
            b.slotId === slotId &&
            b.status !== 'cancelled'
        );
      },

      // Global Slot Conflict Check
      isSlotBooked: (_roomId, date, slotId) => {
        const { bookings } = get();
        return bookings.some(
          (b) => b.date === date && b.slotId === slotId && b.status !== 'cancelled'
        );
      },

      // Check if room has an active booking today
      isRoomAvailableToday: (roomId) => {
        const { bookings } = get();
        const todayStr = getLocalTodayDateString();
        const hasBookingToday = bookings.some(
          (b) => b.roomId === roomId && b.date === todayStr && b.status !== 'cancelled'
        );
        return !hasBookingToday;
      },

      addBooking: ({
        roomId,
        roomName,
        building,
        floor,
        date,
        slotId,
        slotTime,
        purpose,
      }) => {
        const { isSlotBooked, currentUser, bookings } = get();

        if (isSlotBooked(roomId, date, slotId)) {
          return null;
        }

        const bookingId = `BOOK-${Date.now()}`;
        const newBooking: Booking = {
          id: bookingId,
          roomId,
          roomName,
          building,
          floor,
          date,
          slotId,
          slotTime,
          userId: currentUser?.uid || 'guest-uid',
          userEmail: currentUser?.email || 'student@vku.udn.vn',
          createdAt: new Date().toISOString(),
          qrCodeValue: `VKU-PASS-${bookingId}-${roomId}`,
          status: 'confirmed',
          purpose: purpose || 'Học nhóm & Thuyết trình',
        };

        set({ bookings: [newBooking, ...bookings] });
        createBookingInFirestore(newBooking);
        return newBooking;
      },

      cancelBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          ),
        }));
        cancelBookingInFirestore(bookingId);
      },

      checkInBooking: async (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? { ...b, status: 'checked_in', checkedInAt: new Date().toISOString() }
              : b
          ),
        }));
        return await checkInBookingInFirestore(bookingId);
      },

      getFilteredRooms: () => {
        const { searchQuery, selectedBuilding, minCapacity, selectedEquipment, rooms } = get();
        const roomList = rooms && rooms.length > 0 ? rooms : MOCK_ROOMS;

        return roomList.filter((room) => {
          if (
            searchQuery &&
            !room.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !room.building.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !room.description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return false;
          }

          if (selectedBuilding !== 'ALL' && room.building !== selectedBuilding) {
            return false;
          }

          if (minCapacity !== null && room.capacity < minCapacity) {
            return false;
          }

          if (selectedEquipment.length > 0) {
            const hasAllEquipment = selectedEquipment.every((eq) =>
              room.equipments.includes(eq)
            );
            if (!hasAllEquipment) return false;
          }

          return true;
        });
      },

      initRealtimeSync: () => {
        if (!roomsUnsubscribe) {
          roomsUnsubscribe = subscribeRoomsRealtime((rooms) => {
            set({ rooms });
          });
        }

        if (!bookingsUnsubscribe) {
          bookingsUnsubscribe = subscribeBookingsRealtime((bookings) => {
            set({ bookings });
          });
        }

        // Return cleanup
        return () => {
          if (roomsUnsubscribe) {
            roomsUnsubscribe();
            roomsUnsubscribe = null;
          }
          if (bookingsUnsubscribe) {
            bookingsUnsubscribe();
            bookingsUnsubscribe = null;
          }
          if (roleUnsubscribe) {
            roleUnsubscribe();
            roleUnsubscribe = null;
          }
        };
      },
    }),
    {
      name: 'vku-study-room-booking-store-v2',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        currentUser: state.currentUser,
        userRole: state.userRole,
        isAuthenticated: state.isAuthenticated,
        isAdminLoggedIn: state.isAdminLoggedIn,
        bookings: state.bookings,
        rooms: state.rooms,
      }),
    }
  )
);
