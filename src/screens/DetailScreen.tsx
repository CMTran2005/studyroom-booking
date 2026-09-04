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
import { useBookingStore, getLocalTodayDateString } from '../store/useBookingStore';
import { DateSelector } from '../components/DateSelector';
import { TimeSlotGrid } from '../components/TimeSlotGrid';
import { QRModal } from '../components/QRModal';
import { scheduleCheckInNotification } from '../utils/notifications';
import { Booking, Room, TimeSlot } from '../types';
import { styles } from '../styles/DetailScreen.styles';

export const DetailScreen = ({ route, navigation }: any) => {
  const room: Room = route.params.room;
  const { width } = useWindowDimensions();
  const { themeMode, isSlotBooked, isRoomSlotBooked, isRoomAvailableToday, addBooking } = useBookingStore();
  const isDark = themeMode === 'dark';

  const isWide = width >= 850;

  // Selected date defaults to today YYYY-MM-DD
  const todayStr = getLocalTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // QR Modal state
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
      const msg = 'Please select an available 2-hour study session!';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('No Session Selected', msg);
      return;
    }

    if (checkSlotIsBooked(selectedSlot.id)) {
      const msg = 'This session has a schedule conflict (already booked in a room). Please choose another session.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Slot Conflict!', msg);
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
    });

    if (!booking) {
      const msg = 'An error occurred or schedule conflict detected.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Booking Failed', msg);
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

  return (
    <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0f172a' : '#ffffff'} />

      {/* Top Floating Header Bar */}
      <View style={[styles.topHeader, isDark ? styles.topHeaderDark : styles.topHeaderLight]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.backBtn, isDark ? styles.backBtnDark : styles.backBtnLight]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backBtnText, isDark ? styles.textDark : styles.textLight]}>
              ← Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.splitContainer, isWide && styles.splitRow]}>

          {/* LEFT HALF / TOP BOX: Room Info & Photos */}
          <View style={[styles.leftBox, isWide && styles.leftBoxWide, isDark ? styles.boxDark : styles.boxLight]}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: room.image }} style={styles.roomImage} resizeMode="cover" />
              <View
                style={[
                  styles.statusTag,
                  { backgroundColor: isRoomAvailableToday(room.id) ? '#15803d' : '#b91c1c' },
                ]}
              >
                <Text style={styles.statusTagText}>
                  {isRoomAvailableToday(room.id) ? 'Available' : 'Occupied'}
                </Text>
              </View>
            </View>

            <View style={styles.roomMainInfo}>
              <Text style={[styles.roomTitle, isDark ? styles.textDark : styles.textLight]}>
                {room.name}
              </Text>
              <Text style={[styles.locationSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
                Building {room.building} • Floor {room.floor}
              </Text>

              {/* Specs Grid */}
              <View style={[styles.specsGrid, isDark ? styles.specsGridDark : styles.specsGridLight]}>
                <View style={styles.specCell}>
                  <Text style={[styles.specCellLabel, isDark ? styles.subtextDark : styles.subtextLight]}>Capacity</Text>
                  <Text style={[styles.specCellValue, isDark ? styles.textDark : styles.textLight]}>{room.capacity} seats</Text>
                </View>
                <View style={styles.specDivider} />
                <View style={styles.specCell}>
                  <Text style={[styles.specCellLabel, isDark ? styles.subtextDark : styles.subtextLight]}>Location</Text>
                  <Text style={[styles.specCellValue, isDark ? styles.textDark : styles.textLight]}>Floor {room.floor}, Building {room.building}</Text>
                </View>
              </View>

              <Text style={[styles.sectionHeading, isDark ? styles.textDark : styles.textLight]}>Room Description</Text>
              <Text style={[styles.descriptionText, isDark ? styles.subtextDark : styles.subtextLight]}>
                {room.description}
              </Text>

              <Text style={[styles.sectionHeading, isDark ? styles.textDark : styles.textLight]}>Available Equipment</Text>
              <View style={styles.equipmentWrap}>
                {room.equipments.map((eq, i) => (
                  <View key={i} style={[styles.eqChip, isDark ? styles.eqChipDark : styles.eqChipLight]}>
                    <Text style={[styles.eqChipText, isDark ? styles.eqChipTextDark : styles.eqChipTextLight]}>
                      ✓ {eq}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* RIGHT HALF / BOTTOM BOX: Date & Slot Booking Selector */}
          <View style={[styles.rightBox, isWide && styles.rightBoxWide, isDark ? styles.boxDark : styles.boxLight]}>
            <Text style={[styles.bookingTitle, isDark ? styles.textDark : styles.textLight]}>
              Book Study Session
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

            {/* Action Box Summary */}
            <View style={[styles.summaryBox, isDark ? styles.summaryDark : styles.summaryLight]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, isDark ? styles.subtextDark : styles.subtextLight]}>Selected Session:</Text>
                <Text style={[styles.summaryValue, isDark ? styles.textDark : styles.textLight]}>
                  {selectedSlot ? selectedSlot.label : 'None selected'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, isDark ? styles.subtextDark : styles.subtextLight]}>Registration Date:</Text>
                <Text style={[styles.summaryValue, isDark ? styles.textDark : styles.textLight]}>{selectedDate}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.confirmBtn, !selectedSlot && styles.confirmBtnDisabled]}
                onPress={handleConfirmBooking}
              >
                <Text style={styles.confirmBtnText}>Confirm Study Room Booking</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* QR Pass Check-in Modal */}
      <QRModal
        visible={qrModalVisible}
        booking={createdBooking}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};
