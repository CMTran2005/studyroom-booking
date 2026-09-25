import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  HomeScreen,
  DetailScreen,
  MyBookingsScreen,
  AdminScreen,
  AuthScreen,
} from '../screens';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS } from '../styles/theme';
import { styles } from '../styles/navigation/AppNavigator.styles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStack() {
  const userRole = useBookingStore((state) => state.userRole);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      {userRole === 'admin' && (
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
      )}
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const activeBookingsCount = useBookingStore(
    (state) => state.bookings.filter((b) => b.status !== 'cancelled').length
  );
  const themeMode = useBookingStore((state) => state.themeMode);
  const userRole = useBookingStore((state) => state.userRole);
  const isDark = themeMode === 'dark';

  const bottomPadding = Math.max(insets.bottom + 8, 16);
  const tabBarHeight = 54 + bottomPadding;

  const activeColor = isDark ? '#818cf8' : COLORS.primary;
  const inactiveColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          isDark ? styles.tabBarDark : styles.tabBarLight,
          {
            height: isDesktop ? 0 : tabBarHeight,
            paddingBottom: isDesktop ? 0 : bottomPadding,
            display: isDesktop ? 'none' : 'flex',
          },
        ],
        tabBarShowLabel: true,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={MainStack}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Explore', {
              screen: 'HomeScreen',
            });
          },
        })}
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyBookingsTab"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: 'Lịch đặt',
          tabBarBadge: activeBookingsCount > 0 ? activeBookingsCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />
      {userRole === 'admin' && (
        <Tab.Screen
          name="AdminTab"
          component={AdminScreen}
          options={{
            tabBarLabel: 'Quản trị',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'}
                size={size || 24}
                color={color}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  const { isAuthenticated, initRealtimeSync } = useBookingStore();

  useEffect(() => {
    const cleanup = initRealtimeSync();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initRealtimeSync]);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
};
