import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Building, Equipment, Room } from '../types';
import { MOCK_ROOMS } from '../data/mockRooms';

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

  // User Session
  userEmail: string;

  // Admin Session
  isAdminLoggedIn: boolean;
  adminEmail: string;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Rooms List (Dynamic)
  rooms: Room[];
  addRoom: (roomData: Omit<Room, 'id'>) => Room;
  deleteRoom: (roomId: string) => void;

  // Bookings List
  bookings: Booking[];

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
  addBooking: (params: { roomId: string; roomName: string; building: Building; floor: number; date: string; slotId: string; slotTime: string }) => Booking | null;
  cancelBooking: (bookingId: string) => void;

  // Selector helper
  getFilteredRooms: () => Room[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      themeMode: 'light',
      toggleTheme: () => set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),

      userEmail: 'student.vku@vku.udn.vn',

      isAdminLoggedIn: false,
      adminEmail: 'admin@vku.udn.vn',

      loginAdmin: (password: string) => {
        if (password.trim() === 'admin' || password.trim() === 'admin123') {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },

      logoutAdmin: () => set({ isAdminLoggedIn: false }),

      rooms: MOCK_ROOMS,

      addRoom: (roomData) => {
        const newId = `room-custom-${Date.now()}`;
        const newRoom: Room = {
          id: newId,
          ...roomData,
        };
        set((state) => ({
          rooms: [newRoom, ...state.rooms],
        }));
        return newRoom;
      },

      deleteRoom: (roomId) => {
        set((state) => ({
          rooms: state.rooms.filter((r) => r.id !== roomId),
        }));
      },

      bookings: [],

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
          (b) => b.roomId === roomId && b.date === date && b.slotId === slotId
        );
      },

      // Global Slot Conflict Check: Block the time slot across ALL rooms for that date
      isSlotBooked: (_roomId, date, slotId) => {
        const { bookings } = get();
        return bookings.some(
          (b) => b.date === date && b.slotId === slotId
        );
      },

      // Strictly check if THIS specific room has a booking today in local timezone
      isRoomAvailableToday: (roomId) => {
        const { bookings } = get();
        const todayStr = getLocalTodayDateString();
        const hasBookingToday = bookings.some((b) => b.roomId === roomId && b.date === todayStr);
        return !hasBookingToday;
      },

      addBooking: ({ roomId, roomName, building, floor, date, slotId, slotTime }) => {
        const { isSlotBooked, userEmail, bookings } = get();

        // Prevent double-booking across any room for the same date & time slot
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
          userEmail,
          createdAt: new Date().toISOString(),
          qrCodeValue: `VKU-PASS-${bookingId}-${roomId}`
        };

        set({ bookings: [newBooking, ...bookings] });
        return newBooking;
      },

      cancelBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== bookingId),
        }));
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
    }),
    {
      name: 'vku-study-room-booking-store',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
