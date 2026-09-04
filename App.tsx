import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { requestNotificationPermissions } from './src/utils/notifications';

// Ignore non-fatal Expo Go dev server warnings on physical mobile devices
LogBox.ignoreLogs([
  'expo-notifications',
  'Cannot connect to Expo CLI',
  'Android Push notifications',
  'warnOfExpoGoPushUsage',
]);

export default function App() {
  useEffect(() => {
    // Request notification permissions safely on app startup
    requestNotificationPermissions().catch((err) => {
      console.log('[VKU App] Notification setup info:', err);
    });
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
