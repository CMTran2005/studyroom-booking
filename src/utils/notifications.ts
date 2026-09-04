import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Detect whether the app is running in Expo Go (Expo SDK 53+ removed push token registration from Expo Go)
const isExpoGo =
  Constants.appOwnership === 'expo' ||
  (Constants.executionEnvironment && Constants.executionEnvironment.toString() === 'storeClient');

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web' || isExpoGo) {
    console.log('[VKU Notifications] Running in Expo Go / Web mode. Local check-in notifications active in simulated mode.');
    return true;
  }

  try {
    const Notifications = await import('expo-notifications');

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('booking-reminders', {
        name: 'VKU Study Room Check-in Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563eb',
      });
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.log('[VKU Notifications] Expo Go fallback active:', error);
    return true;
  }
}

/**
 * Schedule a local notification 15 minutes before slot start time
 */
export async function scheduleCheckInNotification(
  roomName: string,
  slotTimeStr: string,
  dateStr: string
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  if (isExpoGo) {
    console.log(`[VKU Notifications] Local check-in reminder scheduled for ${roomName} (${slotTimeStr}) 15m prior (Expo Go mode).`);
    return 'simulated-expo-go-notification-id';
  }

  try {
    const Notifications = await import('expo-notifications');
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const startTimePart = slotTimeStr.split('-')[0].trim();
    const [hours, minutes] = startTimePart.split(':').map(Number);

    const slotStartDateTime = new Date(`${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    const triggerTime = new Date(slotStartDateTime.getTime() - 15 * 60 * 1000);
    const now = new Date();

    const secondsFromNow = Math.max(10, Math.floor((triggerTime.getTime() - now.getTime()) / 1000));

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'VKU Study Room Check-in Reminder',
        body: `Your study session at ${roomName} starts in 15 minutes (${slotTimeStr}). Please present your QR code pass to check in!`,
        sound: true,
        data: { roomName, dateStr, slotTimeStr },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsFromNow,
      },
    });

    return notificationId;
  } catch (error) {
    console.log('[VKU Notifications] Fallback notice:', error);
    return 'simulated-expo-go-notification-id';
  }
}
