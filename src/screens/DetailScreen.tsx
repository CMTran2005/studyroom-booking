import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore, getLocalTodayDateString } from '../store/useBookingStore';
import { DateSelector, TimeSlotGrid, QRModal, WebHeader } from '../components';
import { scheduleCheckInNotification } from '../utils/notifications';
import { Booking, Room, TimeSlot, BookingPurpose } from '../types';
import { styles } from '../styles/screens/DetailScreen.styles';

const EQUIPMENT_ICONS: Record<string, string> = {
  'High-spec PC': 'desktop-outline',
  'Whiteboard': 'create-outline',
  'Projector': 'videocam-outline',
  'AC': 'snow-outline',
};

const PURPOSES: { label: BookingPurpose; icon: string }[] = [
  { label: 'Học nhóm & Thuyết trình', icon: 'people-outline' },
  { label: 'Nghiên cứu & Lập trình AI', icon: 'code-slash-outline' },
  { label: 'Luyện thi & Đồ án Capstone', icon: 'book-outline' },
  { label: 'Tự học yên tĩnh', icon: 'headset-outline' },
];

export const DetailScreen = ({ route, navigation }: any) => {
  const room: Room = route.params.room;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;

  const { isSlotBooked, isRoomSlotBooked, isRoomAvailableToday, addBooking, themeMode } =
    useBookingStore();
  const isDark = themeMode === 'dark';

  const todayStr = getLocalTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<BookingPurpose>(
    'Học nhóm & Thuyết trình'
  );

  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);

  const checkSlotIsBooked = useCallback(
    (slotId: string) => {
      return isSlotBooked(room.id, selectedDate, slotId);
    },
    [isSlotBooked, room.id, selectedDate]
  );

  const checkRoomSlotIsBooked = useCallback(
    (slotId: string) => {
      return isRoomSlotBooked(room.id, selectedDate, slotId);
    },
    [isRoomSlotBooked, room.id, selectedDate]
  );

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      const msg = 'Vui lòng chọn một ca học 2 tiếng trước khi tiếp tục!';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Chưa chọn ca học', msg);
      return;
    }

    if (checkSlotIsBooked(selectedSlot.id)) {
      const msg =
        'Ca học này đã bị trùng lịch với phòng khác bạn đã đặt. Vui lòng chọn ca học khác.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Trùng lịch đặt phòng!', msg);
      return;
    }

    const booking = addBooking({
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      floor: room.floor,
      date: selectedDate,
      slotId: selectedSlot.id,
      slotTime: selectedSlot.label,
      purpose: selectedPurpose,
    });

    if (!booking) {
      const msg = 'Đã xảy ra lỗi hoặc phát hiện trùng lịch đặt.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Đặt phòng thất bại', msg);
      return;
    }

    await scheduleCheckInNotification(room.name, selectedSlot.label, selectedDate);
    setCreatedBooking(booking);
    setQrModalVisible(true);
  };

  const handleCloseModal = () => {
    setQrModalVisible(false);
    if (navigation.canGoBack()) {
      navigation.popToTop();
    }
    navigation.navigate('MyBookingsTab');
  };

  const isAvailable = isRoomAvailableToday(room.id);

  return (
    <SafeAreaView
      style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0b0f19' : '#ffffff'}
      />

      {/* Web Header or Back Button */}
      {isDesktop ? (
        <WebHeader
          currentTab="Explore"
          onNavigateTab={(tab) => {
            if (tab === 'Explore') (navigation as any).navigate('HomeScreen');
            else if (tab === 'MyBookings') (navigation as any).navigate('MyBookingsTab');
            else if (tab === 'Admin') (navigation as any).navigate('AdminTab');
          }}
        />
      ) : (
        <View style={[styles.topHeader, isDark ? styles.topHeaderDark : styles.topHeaderLight]}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.backBtn, isDark ? styles.backBtnDark : styles.backBtnLight]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color={isDark ? '#f8fafc' : '#0f172a'}
              />
              <Text style={[styles.backBtnText, isDark ? styles.textDark : styles.textLight]}>
                Quay lại
              </Text>
            </TouchableOpacity>

            <Text
              style={[styles.headerRoomTitle, isDark ? styles.textDark : styles.textLight]}
              numberOfLines={1}
            >
              {room.name}
            </Text>

            <View style={{ width: 60 }} />
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.splitContainer, isDesktop && styles.splitRow]}>
          {/* Room Info Card */}
          <View
            style={[
              styles.leftBox,
              isDesktop && styles.leftBoxWide,
              isDark ? styles.boxDark : styles.boxLight,
            ]}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: room.image }} style={styles.roomImage} resizeMode="cover" />
              <View
                style={[
                  styles.statusTag,
                  { backgroundColor: isAvailable ? '#10b981' : '#ef4444' },
                ]}
              >
                <Ionicons
                  name={isAvailable ? 'checkmark-circle' : 'close-circle'}
                  size={14}
                  color="#ffffff"
                />
                <Text style={styles.statusTagText}>
                  {isAvailable ? 'Hôm nay còn chỗ' : 'Kín lịch hôm nay'}
                </Text>
              </View>
            </View>

            <View style={styles.roomMainInfo}>
              <Text style={[styles.roomTitle, isDark ? styles.textDark : styles.textLight]}>
                {room.name}
              </Text>
              <Text
                style={[
                  styles.locationSubtitle,
                  isDark ? styles.subtextDark : styles.subtextLight,
                ]}
              >
                Tòa nhà {room.building} • Tầng {room.floor} • VKU Smart Campus
              </Text>

              {/* Specs Grid */}
              <View
                style={[
                  styles.specsGrid,
                  isDark ? styles.specsGridDark : styles.specsGridLight,
                ]}
              >
                <View style={styles.specCell}>
                  <Ionicons
                    name="people-outline"
                    size={18}
                    color={isDark ? '#818cf8' : '#4f46e5'}
                    style={styles.specCellIcon}
                  />
                  <Text
                    style={[
                      styles.specCellLabel,
                      isDark ? styles.subtextDark : styles.subtextLight,
                    ]}
                  >
                    Sức chứa
                  </Text>
                  <Text
                    style={[styles.specCellValue, isDark ? styles.textDark : styles.textLight]}
                  >
                    {room.capacity} chỗ
                  </Text>
                </View>

                <View style={[styles.specDivider, isDark && styles.specDividerDark]} />

                <View style={styles.specCell}>
                  <Ionicons
                    name="business-outline"
                    size={18}
                    color={isDark ? '#818cf8' : '#4f46e5'}
                    style={styles.specCellIcon}
                  />
                  <Text
                    style={[
                      styles.specCellLabel,
                      isDark ? styles.subtextDark : styles.subtextLight,
                    ]}
                  >
                    Tòa nhà
                  </Text>
                  <Text
                    style={[styles.specCellValue, isDark ? styles.textDark : styles.textLight]}
                  >
                    Khu {room.building}
                  </Text>
                </View>

                <View style={[styles.specDivider, isDark && styles.specDividerDark]} />

                <View style={styles.specCell}>
                  <Ionicons
                    name="layers-outline"
                    size={18}
                    color={isDark ? '#818cf8' : '#4f46e5'}
                    style={styles.specCellIcon}
                  />
                  <Text
                    style={[
                      styles.specCellLabel,
                      isDark ? styles.subtextDark : styles.subtextLight,
                    ]}
                  >
                    Tầng
                  </Text>
                  <Text
                    style={[styles.specCellValue, isDark ? styles.textDark : styles.textLight]}
                  >
                    Tầng {room.floor}
                  </Text>
                </View>

                <View style={[styles.specDivider, isDark && styles.specDividerDark]} />

                <View style={styles.specCell}>
                  <Ionicons
                    name="wifi-outline"
                    size={18}
                    color="#10b981"
                    style={styles.specCellIcon}
                  />
                  <Text
                    style={[
                      styles.specCellLabel,
                      isDark ? styles.subtextDark : styles.subtextLight,
                    ]}
                  >
                    Mạng
                  </Text>
                  <Text
                    style={[styles.specCellValue, isDark ? styles.textDark : styles.textLight]}
                  >
                    Miễn phí
                  </Text>
                </View>
              </View>

              <Text
                style={[styles.sectionHeading, isDark ? styles.textDark : styles.textLight]}
              >
                Mô tả phòng học
              </Text>
              <Text
                style={[
                  styles.descriptionText,
                  isDark ? styles.subtextDark : styles.subtextLight,
                ]}
              >
                {room.description}
              </Text>

              <Text
                style={[styles.sectionHeading, isDark ? styles.textDark : styles.textLight]}
              >
                Trang thiết bị sẵn có
              </Text>
              <View style={styles.equipmentWrap}>
                {room.equipments.map((eq, i) => (
                  <View
                    key={i}
                    style={[styles.eqChip, isDark ? styles.eqChipDark : styles.eqChipLight]}
                  >
                    <Ionicons
                      name={(EQUIPMENT_ICONS[eq] || 'checkmark-circle-outline') as any}
                      size={14}
                      color={isDark ? '#a5b4fc' : '#4f46e5'}
                    />
                    <Text
                      style={[
                        styles.eqChipText,
                        isDark ? styles.eqChipTextDark : styles.eqChipTextLight,
                      ]}
                    >
                      {eq}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Date & Slot Booking Selector Card */}
          <View
            style={[
              styles.rightBox,
              isDesktop && styles.rightBoxWide,
              isDark ? styles.boxDark : styles.boxLight,
            ]}
          >
            <Text style={[styles.bookingTitle, isDark ? styles.textDark : styles.textLight]}>
              Đăng ký lịch học
            </Text>

            {/* Interactive Date Selector */}
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={(dateStr) => {
                setSelectedDate(dateStr);
                setSelectedSlot(null);
              }}
            />

            {/* Interactive Time Slot Selector */}
            <TimeSlotGrid
              selectedSlotId={selectedSlot?.id || null}
              onSlotSelect={setSelectedSlot}
              isSlotBooked={checkSlotIsBooked}
              isRoomSlotBooked={checkRoomSlotIsBooked}
            />

            {/* Purpose Selection */}
            <Text
              style={[
                styles.sectionHeading,
                { marginTop: 16, marginBottom: 8 },
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              Mục đích sử dụng phòng
            </Text>
            <View style={{ gap: 8, marginBottom: 20 }}>
              {PURPOSES.map((p) => {
                const isSelected = selectedPurpose === p.label;
                return (
                  <TouchableOpacity
                    key={p.label}
                    activeOpacity={0.75}
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        paddingVertical: 9,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                      },
                      isDark
                        ? {
                            backgroundColor: isSelected ? '#1e1b4b' : '#0b0f19',
                            borderColor: isSelected ? '#6366f1' : '#1e2a42',
                          }
                        : {
                            backgroundColor: isSelected ? '#eef2ff' : '#f8fafc',
                            borderColor: isSelected ? '#4f46e5' : '#e2e8f0',
                          },
                    ]}
                    onPress={() => setSelectedPurpose(p.label)}
                  >
                    <Ionicons
                      name={p.icon as any}
                      size={16}
                      color={
                        isSelected ? '#4f46e5' : isDark ? '#94a3b8' : '#64748b'
                      }
                    />
                    <Text
                      style={[
                        { fontSize: 13, fontWeight: '600' },
                        isDark ? styles.textDark : styles.textLight,
                        isSelected && {
                          color: isDark ? '#a5b4fc' : '#4f46e5',
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Desktop Direct Confirmation Box */}
            {isDesktop && (
              <View
                style={{
                  padding: 16,
                  borderRadius: 14,
                  backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
                  borderWidth: 1,
                  borderColor: isDark ? '#1e2a42' : '#e2e8f0',
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={[{ fontSize: 12.5 }, isDark ? styles.subtextDark : styles.subtextLight]}
                  >
                    Ngày học:
                  </Text>
                  <Text
                    style={[{ fontSize: 13, fontWeight: '700' }, isDark ? styles.textDark : styles.textLight]}
                  >
                    {selectedDate}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={[{ fontSize: 12.5 }, isDark ? styles.subtextDark : styles.subtextLight]}
                  >
                    Ca học:
                  </Text>
                  <Text
                    style={[{ fontSize: 13, fontWeight: '700' }, isDark ? styles.textDark : styles.textLight]}
                  >
                    {selectedSlot ? selectedSlot.label : 'Chưa chọn'}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={!selectedSlot}
                  style={[styles.confirmBtn, !selectedSlot && styles.confirmBtnDisabled]}
                  onPress={handleConfirmBooking}
                >
                  <Ionicons name="shield-checkmark" size={17} color="#ffffff" />
                  <Text style={styles.confirmBtnText}>Xác nhận đặt phòng</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar (Mobile Only) */}
      {!isDesktop && (
        <View
          style={[
            styles.floatingBottomBar,
            isDark ? styles.floatingBottomDark : styles.floatingBottomLight,
          ]}
        >
          <View style={styles.floatingInfoCol}>
            <Text
              style={[
                styles.floatingSlotLabel,
                isDark ? styles.subtextDark : styles.subtextLight,
              ]}
            >
              {selectedDate}
            </Text>
            <Text
              style={[
                styles.floatingSlotValue,
                isDark ? styles.textDark : styles.textLight,
                !selectedSlot && { color: isDark ? '#64748b' : '#94a3b8' },
              ]}
              numberOfLines={1}
            >
              {selectedSlot ? selectedSlot.label : 'Chưa chọn ca học'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!selectedSlot}
            style={[styles.confirmBtn, !selectedSlot && styles.confirmBtnDisabled]}
            onPress={handleConfirmBooking}
          >
            <Ionicons name="shield-checkmark" size={17} color="#ffffff" />
            <Text style={styles.confirmBtnText}>Xác nhận đặt</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* QR Pass Check-in Modal */}
      <QRModal
        visible={qrModalVisible}
        booking={createdBooking}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};
