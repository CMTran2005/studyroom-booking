import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { useBookingStore } from '../store/useBookingStore';
import { styles } from '../styles/AppNavigator.styles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} />
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const activeBookingsCount = useBookingStore((state) => state.bookings.length);
  const themeMode = useBookingStore((state) => state.themeMode);
  const isDark = themeMode === 'dark';

  // Elevate bottom bar generously for mobile devices
  const bottomPadding = Math.max(insets.bottom + 12, 26);
  const tabBarHeight = 50 + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          isDark ? styles.tabBarDark : styles.tabBarLight,
          {
            height: tabBarHeight,
            paddingBottom: bottomPadding,
          },
        ],
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDark ? '#60a5fa' : '#2563eb',
        tabBarInactiveTintColor: isDark ? '#64748b' : '#64748b',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={MainStack}
        listeners={({ navigation }) => ({
          tabPress: () => {
            // Reset Explore stack directly to HomeScreen when tapping Explore Rooms
            navigation.navigate('Explore', {
              screen: 'HomeScreen',
            });
          },
        })}
        options={{
          tabBarLabel: 'Explore Rooms',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="MyBookingsTab"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: `My Bookings (${activeBookingsCount})`,
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
};
