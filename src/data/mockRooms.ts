import { Room, TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-1', startTime: '07:30', endTime: '09:30', label: '07:30 - 09:30 (Slot 1)' },
  { id: 'slot-2', startTime: '09:30', endTime: '11:30', label: '09:30 - 11:30 (Slot 2)' },
  { id: 'slot-3', startTime: '13:00', endTime: '15:00', label: '13:00 - 15:00 (Slot 3)' },
  { id: 'slot-4', startTime: '15:00', endTime: '17:00', label: '15:00 - 17:00 (Slot 4)' },
];

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-v301',
    name: 'Room V.301 - AI & Cloud Lab',
    building: 'V',
    floor: 3,
    capacity: 15,
    equipments: ['High-spec PC', 'AC', 'Projector', 'Whiteboard'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    isAvailableNow: true,
    description: 'Equipped with 15 high-performance workstations for AI modeling, mobile app development, and VKU cloud research.'
  },
  {
    id: 'room-a204',
    name: 'Room A.204 - Group Discussion Room',
    building: 'A',
    floor: 2,
    capacity: 8,
    equipments: ['Whiteboard', 'AC', 'Projector'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    isAvailableNow: true,
    description: 'Quiet collaborative space ideal for team projects of 6-8 students, equipped with magnetic whiteboard and HD projector.'
  },
  {
    id: 'room-b102',
    name: 'Room B.102 - Computer Practice Lab',
    building: 'B',
    floor: 1,
    capacity: 20,
    equipments: ['High-spec PC', 'AC', 'Projector'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    isAvailableNow: true,
    description: 'General practice lab with 20 PC workstations optimized for multi-platform programming and UI/UX design.'
  },
  {
    id: 'room-c405',
    name: 'Room C.405 - Quiet Research Pod',
    building: 'C',
    floor: 4,
    capacity: 4,
    equipments: ['AC', 'Whiteboard'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    isAvailableNow: true,
    description: 'Focused small-group study room for 2-4 students, perfect for capstone thesis preparation and literature review.'
  },
  {
    id: 'room-v402',
    name: 'Room V.402 - Tech Innovation Hub',
    building: 'V',
    floor: 4,
    capacity: 12,
    equipments: ['High-spec PC', 'Projector', 'Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    isAvailableNow: true,
    description: 'Dedicated innovation hub tailored for Hackathon teams and tech startup project acceleration.'
  },
  {
    id: 'room-a101',
    name: 'Room A.101 - Self-Study Room',
    building: 'A',
    floor: 1,
    capacity: 6,
    equipments: ['Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=800&auto=format&fit=crop',
    isAvailableNow: true,
    description: 'Convenient ground-floor study room in Building A, ideal for daily study sessions and exam prep.'
  }
];
