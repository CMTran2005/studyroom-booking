import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import {
  QRModal,
  WebHeader,
  ThemeSwitch,
  UserProfileModal,
} from '../components';
import { Booking } from '../types';
import { styles } from '../styles/screens/MyBookingsScreen.styles';

export const MyBookingsScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;

  let numColumns = 1;
  if (width >= 1100) {
    numColumns = 3;
  } else if (width >= 700) {
    numColumns = 2;
  }

  const { bookings, cancelBooking, themeMode, currentUser, userRole } = useBookingStore();
  const isDark = themeMode === 'dark';
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'confirmed' | 'checked_in' | 'cancelled'>('ALL');

  // Filter user's bookings (or all if admin)
  const userBookings = bookings.filter((b) => {
    // If regular user, only show their bookings
    if (currentUser?.email && currentUser.role !== 'admin') {
      if (b.userEmail.toLowerCase() !== currentUser.email.toLowerCase()) {
        return false;
      }
    }
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  const handleOpenQR = (booking: Booking) => {
    setSelectedBookingForQR(booking);
    setQrModalVisible(true);
  };

  const triggerCancelConfirm = (booking: Booking) => {
    if (Platform.OS === 'web') {
      setBookingToCancel(booking);
    } else {
      Alert.alert(
        'Hủy lịch đặt phòng',
        `Bạn có chắc chắn muốn hủy lịch đặt tại ${booking.roomName} (${booking.slotTime})?`,
        [
          { text: 'Giữ lại lịch', style: 'cancel' },
          {
            text: 'Đồng ý hủy',
            style: 'destructive',
            onPress: () => performCancel(booking.id),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const performCancel = (id: string) => {
    cancelBooking(id);
    setBookingToCancel(null);
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isCancelled = item.status === 'cancelled';
    const isCheckedIn = item.status === 'checked_in';

    return (
      <View
        style={[
          styles.card,
          isDark ? styles.cardDark : styles.cardLight,
          isCancelled && { opacity: 0.65 },
        ]}
      >
        {/* Card Header: Room Title + Status Tag */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.roomName, isDark ? styles.textDark : styles.textLight]}
              numberOfLines={1}
            >
              {item.roomName}
            </Text>
            <View style={[styles.locationPill, isDark && styles.locationPillDark]}>
              <Ionicons
                name="location"
                size={12}
                color={isDark ? '#a5b4fc' : '#4f46e5'}
              />
              <Text style={[styles.locationText, isDark && styles.locationTextDark]}>
                Tòa {item.building} • Tầng {item.floor}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.activeTag,
              isCheckedIn
                ? { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe', borderColor: '#bfdbfe' }
                : isCancelled
                ? { backgroundColor: isDark ? '#334155' : '#f1f5f9', borderColor: '#cbd5e1' }
                : isDark
                ? styles.activeTagDark
                : undefined,
            ]}
          >
            <View
              style={[
                styles.greenDot,
                isCheckedIn && { backgroundColor: '#3b82f6' },
                isCancelled && { backgroundColor: '#94a3b8' },
              ]}
            />
            <Text
              style={[
                styles.activeTagText,
                isCheckedIn && { color: '#2563eb' },
                isCancelled && { color: '#64748b' },
                isDark && !isCheckedIn && !isCancelled && styles.activeTagTextDark,
              ]}
            >
              {isCheckedIn
                ? 'Đã nhận phòng'
                : isCancelled
                ? 'Đã hủy lịch'
                : 'Đã xác nhận'}
            </Text>
          </View>
        </View>

        {/* Purpose Badge if specified */}
        {item.purpose && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
              backgroundColor: isDark ? '#1e1b4b' : '#f5f3ff',
              alignSelf: 'flex-start',
              marginBottom: 10,
            }}
          >
            <Ionicons name="bookmark-outline" size={11} color="#8b5cf6" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#8b5cf6' }}>
              Mục đích: {item.purpose}
            </Text>
          </View>
        )}

        {/* Info Breakdown Grid */}
        <View style={[styles.detailsContainer, isDark ? styles.detailsDark : styles.detailsLight]}>
          <View style={styles.detailGridRow}>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                Ngày học
              </Text>
              <Text style={[styles.detailValue, isDark ? styles.textDark : styles.textLight]}>
                {item.date}
              </Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                Ca học
              </Text>
              <Text style={[styles.detailValue, isDark ? styles.textDark : styles.textLight]}>
                {item.slotTime}
              </Text>
            </View>
          </View>

          <View style={styles.detailGridRow}>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                Tài khoản
              </Text>
              <Text
                style={[styles.detailValue, isDark ? styles.textDark : styles.textLight]}
                numberOfLines={1}
              >
                {item.userEmail}
              </Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                Mã thẻ pass
              </Text>
              <Text style={styles.codeText}>{item.id}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {!isCancelled && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.cancelBtn, isDark && styles.cancelBtnDark]}
              onPress={() => triggerCancelConfirm(item)}
            >
              <Ionicons
                name="trash-outline"
                size={14}
                color={isDark ? '#fca5a5' : '#ef4444'}
              />
              <Text style={[styles.cancelBtnText, isDark && styles.cancelBtnTextDark]}>
                Hủy lịch
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.qrBtn}
              onPress={() => handleOpenQR(item)}
            >
              <Ionicons name="qr-code-outline" size={15} color="#ffffff" />
              <Text style={styles.qrBtnText}>Thẻ QR Check-in</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
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

      {isDesktop ? (
        <WebHeader
          currentTab="MyBookings"
          onNavigateTab={(tab) => {
            if (tab === 'Explore') {
              (navigation as any).navigate('Explore', { screen: 'HomeScreen' });
            } else if (tab === 'Admin') {
              (navigation as any).navigate('AdminTab');
            }
          }}
        />
      ) : (
        <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
          <View style={styles.headerContentWrapper}>
            <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
              <Text
                style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Lịch Đặt Phòng Của Tôi
              </Text>
              <Text
                style={[styles.headerSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {userBookings.length} lịch đặt phòng trong hệ thống
              </Text>
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

      <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
        {/* Status Filter Tab (Horizontal Scrollable to eliminate overflow on mobile) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%', flexGrow: 0 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 4,
            gap: 8,
          }}
        >
          {[
            { label: 'Tất cả', value: 'ALL' },
            { label: 'Đã xác nhận', value: 'confirmed' },
            { label: 'Đã nhận phòng', value: 'checked_in' },
            { label: 'Đã hủy', value: 'cancelled' },
          ].map((tab) => {
            const isSelected = statusFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                activeOpacity={0.7}
                style={[
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 10,
                    borderWidth: 1,
                  },
                  isDark
                    ? {
                        backgroundColor: isSelected ? '#4f46e5' : '#131b2e',
                        borderColor: isSelected ? '#4f46e5' : '#1e2a42',
                      }
                    : {
                        backgroundColor: isSelected ? '#4f46e5' : '#ffffff',
                        borderColor: isSelected ? '#4f46e5' : '#e2e8f0',
                      },
                ]}
                onPress={() => setStatusFilter(tab.value as any)}
              >
                <Text
                  style={[
                    { fontSize: 12, fontWeight: '700' },
                    isSelected
                      ? { color: '#ffffff' }
                      : isDark
                      ? styles.textDark
                      : styles.textLight,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.feedWrapper}>
          <FlatList
            key={`my-bookings-grid-${numColumns}`}
            numColumns={numColumns}
            data={userBookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBookingItem}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={[styles.emptyState, isDark ? styles.cardDark : styles.cardLight]}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={46}
                  color={isDark ? '#64748b' : '#94a3b8'}
                />
                <Text style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
                  Không có lịch đặt phòng nào
                </Text>
                <Text
                  style={[styles.emptySubtitle, isDark ? styles.subtextDark : styles.subtextLight]}
                >
                  Hãy khám phá danh sách các phòng học & Lab AI có sẵn để đăng ký buổi học ngay hôm nay!
                </Text>
                <TouchableOpacity
                  style={styles.goToHomeBtn}
                  onPress={() => {
                    navigation.navigate('Explore', { screen: 'HomeScreen' });
                  }}
                >
                  <Text style={styles.goToHomeBtnText}>Khám phá phòng học</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>

        {/* QR Pass Check-in Modal */}
        <QRModal
          visible={qrModalVisible}
          booking={selectedBookingForQR}
          onClose={() => setQrModalVisible(false)}
        />

        {/* Cancellation Confirmation Modal */}
        {bookingToCancel && (
          <Modal transparent animationType="fade" visible={true}>
            <View style={styles.modalOverlay}>
              <View style={[styles.confirmBox, isDark && styles.confirmBoxDark]}>
                <Text style={styles.confirmTitle}>Xác nhận hủy lịch đặt</Text>
                <Text style={[styles.confirmDesc, isDark ? styles.textDark : styles.textLight]}>
                  Bạn có chắc chắn muốn hủy lịch đặt tại{' '}
                  <Text style={{ fontWeight: '700' }}>{bookingToCancel.roomName}</Text> (
                  {bookingToCancel.slotTime})?
                </Text>
                <Text
                  style={[styles.confirmSubdesc, isDark ? styles.subtextDark : styles.subtextLight]}
                >
                  Khung giờ này sẽ ngay lập tức mở lại cho các sinh viên khác đăng ký trên toàn hệ thống.
                </Text>

                <View style={styles.confirmBtnRow}>
                  <TouchableOpacity
                    style={[styles.modalCancelBtn, isDark && styles.modalCancelBtnDark]}
                    onPress={() => setBookingToCancel(null)}
                  >
                    <Text style={[styles.modalCancelBtnText, isDark && styles.textDark]}>
                      Giữ lại
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    onPress={() => performCancel(bookingToCancel.id)}
                  >
                    <Text style={styles.modalConfirmBtnText}>Đồng ý hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>

      <UserProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </SafeAreaView>
  );
};
