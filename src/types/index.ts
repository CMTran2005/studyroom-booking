export type Building = 'A' | 'B' | 'C' | 'V';

export type Equipment = 'Projector' | 'Whiteboard' | 'High-spec PC' | 'AC';

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'cancelled';

export type BookingPurpose =
  | 'Học nhóm & Thuyết trình'
  | 'Nghiên cứu & Lập trình AI'
  | 'Luyện thi & Đồ án Capstone'
  | 'Tự học yên tĩnh';

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number; // 2 to 20 students
  equipments: Equipment[];
  image: string;
  isAvailableNow: boolean;
  description: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "07:30"
  endTime: string;   // e.g. "09:30"
  label: string;     // e.g. "07:30 - 09:30"
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: Building;
  floor: number;
  date: string; // YYYY-MM-DD
  slotId: string;
  slotTime: string;
  userId?: string;
  userEmail: string;
  createdAt: string;
  qrCodeValue: string;
  status: BookingStatus;
  purpose?: string;
  checkedInAt?: string;
}

export interface DateItem {
  fullDate: string; // YYYY-MM-DD
  dayName: string;  // e.g. "Thứ 2" / "Mon"
  dayNumber: string; // e.g. "04"
  isToday: boolean;
}
