import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ListRenderItem,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../store/useBookingStore';
import { RoomCard } from '../components/RoomCard';
import { FilterChips } from '../components/FilterChips';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { Room } from '../types';
import { styles } from '../styles/HomeScreen.styles';

export const HomeScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Dynamic responsive columns calculation based on device screen width
  let numColumns = 1;
  if (width >= 1280) {
    numColumns = 4;
  } else if (width >= 960) {
    numColumns = 3;
  } else if (width >= 600) {
    numColumns = 2;
  }

  const {
    themeMode,
    bookings,
    rooms,
    searchQuery,
    setSearchQuery,
    selectedBuilding,
    setBuilding,
    selectedEquipment,
    toggleEquipment,
    minCapacity,
    setMinCapacity,
    resetFilters,
    getFilteredRooms,
  } = useBookingStore();

  const isDark = themeMode === 'dark';
  const filteredRooms = getFilteredRooms();

  const handleRoomPress = useCallback(
    (room: Room) => {
      navigation.navigate('DetailScreen', { room });
    },
    [navigation]
  );

  const renderRoomItem: ListRenderItem<Room> = useCallback(
    ({ item }) => <RoomCard room={item} onPress={handleRoomPress} />,
    [handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0f172a' : '#ffffff'} />
      <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
        {/* Top Header */}
        <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
          <View style={styles.headerContentWrapper}>
            <View style={{ flex: 1 }}>
              <View style={[styles.vkuBadge, isDark && styles.vkuBadgeDark]}>
                <Text style={[styles.vkuBadgeText, isDark && styles.vkuBadgeTextDark]}>
                  VKU SMART CAMPUS
                </Text>
              </View>
              <Text style={[styles.welcomeText, isDark ? styles.textDark : styles.textLight]}>
                Real-Time Study Room Booking
              </Text>
              <Text style={[styles.subtitleText, isDark ? styles.subtextDark : styles.subtextLight]}>
                Search study rooms & prevent schedule conflicts automatically
              </Text>
            </View>

            {/* Header Right Actions: Admin Access + Theme Switch */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.adminPortalBtn, isDark ? styles.adminPortalBtnDark : styles.adminPortalBtnLight]}
                onPress={() => navigation.navigate('AdminScreen')}
              >
                <Text style={[styles.adminPortalBtnText, isDark ? styles.textDark : styles.textLight]}>
                  Admin Portal
                </Text>
              </TouchableOpacity>
              <ThemeSwitch />
            </View>
          </View>
        </View>

        {/* Responsive FlatList Feed */}
        <View style={styles.feedWrapper}>
          <FlatList
            key={`grid-${numColumns}`}
            numColumns={numColumns}
            data={filteredRooms}
            extraData={bookings}
            renderItem={renderRoomItem}
            keyExtractor={keyExtractor}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={12}
            windowSize={5}
            removeClippedSubviews={true}
            ListHeaderComponent={
              <FilterChips
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedBuilding={selectedBuilding}
                onBuildingSelect={setBuilding}
                selectedEquipment={selectedEquipment}
                onEquipmentToggle={toggleEquipment}
                minCapacity={minCapacity}
                onCapacitySelect={setMinCapacity}
                onReset={resetFilters}
              />
            }
            ListEmptyComponent={
              <View style={[styles.emptyState, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
                  No matching study rooms found
                </Text>
                <Text style={[styles.emptySubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
                  Try adjusting your filter options or click "Reset Filters" to view all available rooms.
                </Text>
                <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                  <Text style={styles.resetBtnText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
