# 🏫 VKU Study Room Booking Application

A modern, cross-platform mobile and web application for reserving study rooms, collaborative spaces, and computer labs at Vietnam-Korea University of Information and Communication Technology (VKU).

[![Expo](https://img.shields.io/badge/Expo-SDK%2057-black?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## 🌟 Key Features

### 👨‍🎓 For Students:
- **Interactive Room Catalog**: Filter study rooms by building (`V`, `A`, `B`, `C`), capacity, and equipment (High-spec PC, Projector, AC, Whiteboard).
- **Real-Time Conflict Engine**:
  - Differentiates between **Booked** (room-specific slots) and **Time Conflict** (global clashes across other rooms).
  - Dynamic availability indicators (`Available` vs `Occupied`).
- **QR Code Digital Pass**: Generates a scannable digital QR pass upon booking confirmation.
- **My Bookings Dashboard**: Multi-device responsive grid layout supporting 1, 2, or 3-column views with real-time cancelation.
- **Local Notifications**: Automatic 15-minute check-in alert triggers (`expo-notifications` with Expo Go fallback).
- **Theme Engine**: Sleek Dark Mode & Light Mode support.

### 🛡️ For Administrators:
- **Admin Portal**: Authentication interface (`admin@vku.udn.vn`).
- **Room Management**: Add new rooms with custom specs, equipment, capacity, and custom image URLs or device photos.
- **Delete & Maintain Rooms**: Real-time removal of outdated room listings.

---

## 🛠️ Technology Stack

| Component | Technology Used |
| :--- | :--- |
| **Framework** | Expo SDK 57, React Native 0.86 |
| **Language** | TypeScript |
| **State Management** | Zustand with `safeStorage` (localStorage / AsyncStorage adapter) |
| **Navigation** | React Navigation 7 (Native Stack & Bottom Tabs) |
| **Styling** | Modular Vanilla StyleSheets with Design Tokens |
| **QR Generation** | `react-native-qrcode-svg` & `react-native-svg` |
| **Notifications** | `expo-notifications` with safe cross-platform wrapper |

---

## 📁 Project Architecture

```
mini-project-2-study-room-booking/
├── App.tsx                     # Entry point & Safe Area Provider
├── vercel.json                 # SPA Routing & Vercel deployment config
├── src/
│   ├── components/             # Reusable UI components (RoomCard, TimeSlotGrid, QRModal, etc.)
│   ├── data/                   # Initial room catalog & mock data
│   ├── navigation/             # AppNavigator & BottomTabNavigator with Safe Insets
│   ├── screens/                # HomeScreen, DetailScreen, MyBookingsScreen, AdminScreen, AddRoomScreen
│   ├── store/                  # useBookingStore (Zustand state & conflict engine)
│   ├── styles/                 # Modular CSS-in-JS style files
│   ├── types/                  # TypeScript interface definitions
│   └── utils/                  # Safe local notification utilities
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on iOS/Android (for testing on mobile devices)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/CMTran2005/studyroom-booking.git

# Navigate into project directory
cd studyroom-booking

# Install dependencies
npm install
```

### 3. Run Locally

#### 📱 Mobile Development (Expo Go):
```bash
npm start
```
*Scan the generated QR code using the **Expo Go** app on Android or iOS.*

#### 🌐 Web Development:
```bash
npm run web
```
*Opens app in browser at `http://localhost:8081`.*

---

## 🌐 Web Production Build & Deployment

### Build Web Static Bundle:
```bash
npm run build:web
```
*Outputs static web build files inside the `dist/` directory.*

### Deploying to Vercel:
1. Connect your GitHub repository (`CMTran2005/studyroom-booking`) to **Vercel**.
2. Vercel automatically detects `vercel.json` with build settings:
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `dist`
3. Click **Deploy**.

---

## 📝 License

Distributed under the MIT License. Developed for VKU Mobile Application Development.
