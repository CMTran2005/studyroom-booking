import { Platform } from 'react-native';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dedicated Firebase Configuration for VKU Study Room Booking Project
// You can override these with EXPO_PUBLIC_FIREBASE_* in a .env file
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDEZQt1gvgiNmyfFAnf8lx00QFtfk5go4s",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "vku-study-room-booking-95c72.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "vku-study-room-booking-95c72",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "vku-study-room-booking-95c72.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "557533721369",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:557533721369:web:d945b1e415510d8063cb88",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-1ZJ3MJSEHH"
};

let app: FirebaseApp | null = null;
let auth: firebaseAuth.Auth | null = null;
let db: Firestore | null = null;
let isFirebaseLive = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  if (Platform.OS === 'web') {
    auth = firebaseAuth.getAuth(app);
  } else {
    try {
      const getRNPersistence = (firebaseAuth as any).getReactNativePersistence;
      if (typeof getRNPersistence === 'function') {
        auth = (firebaseAuth as any).initializeAuth(app, {
          persistence: getRNPersistence(AsyncStorage),
        });
      } else {
        auth = firebaseAuth.getAuth(app);
      }
    } catch {
      auth = firebaseAuth.getAuth(app);
    }
  }

  db = getFirestore(app);
  isFirebaseLive = true;
  console.log('[Firebase] Initialized dedicated instance for vku-studyroom-booking');
} catch (error) {
  console.warn('[Firebase] Notice: Running in resilient fallback mode (Local / Mock persistence):', error);
  isFirebaseLive = false;
}

export { app, auth, db, isFirebaseLive, firebaseConfig };
