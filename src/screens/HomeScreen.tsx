import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ListRenderItem,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import {
  RoomCard,
  FilterChips,
  WebHeader,
  ThemeSwitch,
  UserProfileModal,
} from '../components';
import { Room, Building, Equipment } from '../types';
import { styles } from '../styles/screens/HomeScreen.styles';

const BUILDINGS: { label: string; value: Building | 'ALL' }[] = [
  { label: 'Tất cả tòa nhà', value: 'ALL' },
  { label: 'Tòa V (Smart Hub)', value: 'V' },
  { label: 'Tòa A (Trung tâm)', value: 'A' },
  { label: 'Tòa B (Thực hành)', value: 'B' },
  { label: 'Tòa C (Nghiên cứu)', value: 'C' },
];

const EQUIPMENTS: { label: string; value: Equipment; icon: string }[] = [
  { label: 'Lab Máy tính PC', value: 'High-spec PC', icon: 'desktop-outline' },
  { label: 'Bảng viết nhóm', value: 'Whiteboard', icon: 'create-outline' },
  { label: 'Máy chiếu HD', value: 'Projector', icon: 'videocam-outline' },
  { label: 'Máy lạnh điều hòa', value: 'AC', icon: 'snow-outline' },
];

export const HomeScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;

  // Responsive column count for room grid
  let numColumns = 1;
  if (width >= 1200) {
    numColumns = 3;
  } else if (width >= 800) {
    numColumns = 2;
  }

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const {
    themeMode,
    currentUser,
    userRole,
    bookings,
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

  const handleWebNavigate = (tab: 'Explore' | 'MyBookings' | 'Admin') => {
    if (tab === 'MyBookings') {
      (navigation as any).navigate('MyBookingsTab');
    } else if (tab === 'Admin') {
      (navigation as any).navigate('AdminTab');
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0b0f19' : '#ffffff'}
      />

      {/* TOP HEADER: Web Desktop Header vs Mobile App Bar */}
      {isDesktop ? (
        <WebHeader currentTab="Explore" onNavigateTab={handleWebNavigate} />
      ) : (
        <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
          <View style={styles.headerContentWrapper}>
            <View style={styles.headerLeft}>
              <View style={[styles.avatarCircle, isDark && styles.avatarCircleDark]}>
                <Ionicons
                  name="school"
                  size={20}
                  color={isDark ? '#818cf8' : '#4f46e5'}
                />
              </View>
              <View style={styles.headerLeftText}>
                <Text
                  style={[styles.appTitle, isDark ? styles.textDark : styles.textLight]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  VKU Smart Study
                </Text>
                <Text
                  style={[styles.appSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Hệ thống Đặt phòng học & Lab
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ThemeSwitch />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setProfileModalVisible(true)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: userRole === 'admin' ? '#7c3aed' : '#2563eb',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessibilityLabel="Hồ sơ tài khoản"
              >
                <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                  {currentUser?.displayName?.charAt(0).toUpperCase() ||
                    currentUser?.email?.charAt(0).toUpperCase() ||
                    'U'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setProfileModalVisible(true)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isDark ? '#334155' : '#f1f5f9',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessibilityLabel="Đăng xuất tài khoản"
              >
                <Ionicons name="log-out-outline" size={19} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* MAIN CONTENT AREA */}
      <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
        {isDesktop ? (
          // ================= DESKTOP LAYOUT (2 COLUMNS: SIDEBAR FILTER + ROOM GRID) =================
          <View style={desktopStyles.desktopLayoutContainer}>
            {/* Left Sidebar Filter */}
            <View
              style={[
                desktopStyles.sidebar,
                isDark ? desktopStyles.sidebarDark : desktopStyles.sidebarLight,
              ]}
            >
              <View style={desktopStyles.sidebarHeader}>
                <Ionicons
                  name="options-outline"
                  size={18}
                  color={isDark ? '#818cf8' : '#4f46e5'}
                />
                <Text
                  style={[
                    desktopStyles.sidebarTitle,
                    isDark ? styles.textDark : styles.textLight,
                  ]}
                >
                  Bộ lọc phòng học
                </Text>
              </View>

              {/* Tòa nhà */}
              <Text
                style={[
                  desktopStyles.filterGroupTitle,
                  isDark ? styles.subtextDark : styles.subtextLight,
                ]}
              >
                Khu vực tòa nhà
              </Text>
              <View style={{ gap: 6, marginBottom: 16 }}>
                {BUILDINGS.map((b) => {
                  const isSelected = selectedBuilding === b.value;
                  return (
                    <TouchableOpacity
                      key={b.value}
                      activeOpacity={0.7}
                      style={[
                        desktopStyles.filterOption,
                        isDark ? desktopStyles.optionDark : desktopStyles.optionLight,
                        isSelected && desktopStyles.optionActive,
                      ]}
                      onPress={() => setBuilding(b.value)}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={15}
                        color={isSelected ? '#4f46e5' : isDark ? '#64748b' : '#94a3b8'}
                      />
                      <Text
                        style={[
                          desktopStyles.optionText,
                          isDark ? styles.textDark : styles.textLight,
                          isSelected && desktopStyles.optionTextActive,
                        ]}
                      >
                        {b.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Trang thiết bị */}
              <Text
                style={[
                  desktopStyles.filterGroupTitle,
                  isDark ? styles.subtextDark : styles.subtextLight,
                ]}
              >
                Trang thiết bị phòng
              </Text>
              <View style={{ gap: 6, marginBottom: 16 }}>
                {EQUIPMENTS.map((eq) => {
                  const isSelected = selectedEquipment.includes(eq.value);
                  return (
                    <TouchableOpacity
                      key={eq.value}
                      activeOpacity={0.7}
                      style={[
                        desktopStyles.filterOption,
                        isDark ? desktopStyles.optionDark : desktopStyles.optionLight,
                        isSelected && desktopStyles.optionActive,
                      ]}
                      onPress={() => toggleEquipment(eq.value)}
                    >
                      <Ionicons
                        name={isSelected ? 'checkbox' : 'square-outline'}
                        size={16}
                        color={isSelected ? '#4f46e5' : isDark ? '#64748b' : '#94a3b8'}
                      />
                      <Text
                        style={[
                          desktopStyles.optionText,
                          isDark ? styles.textDark : styles.textLight,
                          isSelected && desktopStyles.optionTextActive,
                        ]}
                      >
                        {eq.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Sức chứa */}
              <Text
                style={[
                  desktopStyles.filterGroupTitle,
                  isDark ? styles.subtextDark : styles.subtextLight,
                ]}
              >
                Sức chứa tối thiểu
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                {[null, 4, 8, 15].map((cap) => {
                  const isSelected = minCapacity === cap;
                  return (
                    <TouchableOpacity
                      key={String(cap)}
                      style={[
                        desktopStyles.capacityChip,
                        isDark ? desktopStyles.chipDark : desktopStyles.chipLight,
                        isSelected && desktopStyles.chipActive,
                      ]}
                      onPress={() => setMinCapacity(cap)}
                    >
                      <Text
                        style={[
                          desktopStyles.chipText,
                          isDark ? styles.textDark : styles.textLight,
                          isSelected && desktopStyles.chipTextActive,
                        ]}
                      >
                        {cap === null ? 'Tất cả' : `≥ ${cap} chỗ`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={desktopStyles.sidebarResetBtn}
                onPress={resetFilters}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={14} color="#ef4444" />
                <Text style={desktopStyles.sidebarResetText}>Đặt lại toàn bộ lọc</Text>
              </TouchableOpacity>
            </View>

            {/* Right Main Grid */}
            <View style={desktopStyles.mainContent}>
              <View style={styles.sectionTitleRow}>
                <View>
                  <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
                    Danh mục Không gian học tập & Lab VKU
                  </Text>
                  <Text
                    style={[styles.appSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}
                  >
                    Hệ thống tự động phát hiện và ngăn chặn trùng lịch đặt phòng theo thời gian thực
                  </Text>
                </View>
                <View style={[styles.roomCountBadge, isDark && styles.roomCountBadgeDark]}>
                  <Text style={[styles.roomCountText, isDark && styles.roomCountTextDark]}>
                    {filteredRooms.length} phòng khả dụng
                  </Text>
                </View>
              </View>

              <FlatList
                key={`desktop-grid-${numColumns}`}
                numColumns={numColumns}
                data={filteredRooms}
                extraData={bookings}
                renderItem={renderRoomItem}
                keyExtractor={keyExtractor}
                columnWrapperStyle={desktopStyles.columnWrapper}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={[styles.emptyState, isDark ? styles.cardDark : styles.cardLight]}>
                    <Ionicons
                      name="search-outline"
                      size={48}
                      color={isDark ? '#64748b' : '#94a3b8'}
                    />
                    <Text style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
                      Không tìm thấy phòng phù hợp
                    </Text>
                    <Text
                      style={[
                        styles.emptySubtitle,
                        isDark ? styles.subtextDark : styles.subtextLight,
                      ]}
                    >
                      Thử bỏ bớt điều kiện lọc ở cột bên trái hoặc bấm "Đặt lại toàn bộ lọc".
                    </Text>
                    <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                      <Text style={styles.resetBtnText}>Đặt lại bộ lọc</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            </View>
          </View>
        ) : (
          // ================= MOBILE LAYOUT (COMPACT FEED & CATEGORIES) =================
          <View style={styles.feedWrapper}>
            <FlatList
              key="mobile-grid-1"
              numColumns={1}
              data={filteredRooms}
              extraData={bookings}
              renderItem={renderRoomItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
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
                  <View style={styles.sectionTitleRow}>
                    <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
                      Danh sách phòng học & Lab
                    </Text>
                    <View style={[styles.roomCountBadge, isDark && styles.roomCountBadgeDark]}>
                      <Text style={[styles.roomCountText, isDark && styles.roomCountTextDark]}>
                        {filteredRooms.length} phòng
                      </Text>
                    </View>
                  </View>
                </>
              }
              ListEmptyComponent={
                <View style={[styles.emptyState, isDark ? styles.cardDark : styles.cardLight]}>
                  <Ionicons
                    name="search-outline"
                    size={42}
                    color={isDark ? '#64748b' : '#94a3b8'}
                  />
                  <Text style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
                    Không tìm thấy phòng phù hợp
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtitle,
                      isDark ? styles.subtextDark : styles.subtextLight,
                    ]}
                  >
                    Thử thay đổi bộ lọc tìm kiếm hoặc nhấn "Đặt lại" để xem toàn bộ danh sách phòng.
                  </Text>
                  <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                    <Text style={styles.resetBtnText}>Đặt lại bộ lọc</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        )}
      </View>

      <UserProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const desktopStyles = StyleSheet.create({
  desktopLayoutContainer: {
    width: '100%',
    maxWidth: 1400,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 24,
    flex: 1,
  },
  sidebar: {
    width: 280,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sidebarLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  sidebarDark: {
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sidebarTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  filterGroupTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  optionDark: {
    backgroundColor: '#0b0f19',
    borderColor: '#1e2a42',
  },
  optionActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  optionText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  capacityChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  chipDark: {
    backgroundColor: '#0b0f19',
    borderColor: '#1e2a42',
  },
  chipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  sidebarResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  sidebarResetText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
  },
  columnWrapper: {
    gap: 16,
    justifyContent: 'flex-start',
  },
});
