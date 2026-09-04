import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../store/useBookingStore';
import { QRModal } from '../components/QRModal';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { Booking } from '../types';
import { styles } from '../styles/MyBookingsScreen.styles';

export const MyBookingsScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  let numColumns = 1;
  if (width >= 1100) {
    numColumns = 3;
  } else if (width >= 700) {
    numColumns = 2;
  }

  const { bookings, cancelBooking, themeMode } = useBookingStore();
  const isDark = themeMode === 'dark';

  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const handleOpenQR = (booking: Booking) => {
    setSelectedBookingForQR(booking);
    setQrModalVisible(true);
  };

  const triggerCancelConfirm = (booking: Booking) => {
    if (Platform.OS === 'web') {
      setBookingToCancel(booking);
    } else {
      Alert.alert(
        'Cancel Booking',
        `Are you sure you want to cancel your booking for ${booking.roomName} (${booking.slotTime})?`,
        [
          { text: 'Keep Booking', style: 'cancel' },
          {
            text: 'Yes, Cancel',
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

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      {/* Card Header: Room Title + Location Badge & Active Reserved Tag */}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.roomName, isDark ? styles.textDark : styles.textLight]} numberOfLines={1}>
            {item.roomName}
          </Text>
          <View style={[styles.locationPill, isDark && styles.locationPillDark]}>
            <Text style={[styles.locationText, isDark && styles.locationTextDark]}>
              Building {item.building} • Floor {item.floor}
            </Text>
          </View>
        </View>

        <View style={styles.activeTag}>
          <View style={styles.greenDot} />
          <Text style={styles.activeTagText}>Reserved</Text>
        </View>
      </View>

      {/* Info Breakdown Grid (Structured 2-column layout) */}
      <View style={[styles.detailsContainer, isDark ? styles.detailsDark : styles.detailsLight]}>
        <View style={styles.detailGridRow}>
          <View style={styles.detailCol}>
            <Text style={[styles.detailLabel, isDark ? styles.subtextDark : styles.subtextLight]}>Date</Text>
            <Text style={[styles.detailValue, isDark ? styles.textDark : styles.textLight]}>{item.date}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={[styles.detailLabel, isDark ? styles.subtextDark : styles.subtextLight]}>2-Hour Session</Text>
            <Text style={[styles.detailValue, isDark ? styles.textDark : styles.textLight]}>{item.slotTime}</Text>
          </View>
        </View>

        <View style={styles.detailGridRow}>
          <View style={styles.detailCol}>
            <Text style={[styles.detailLabel, isDark ? styles.subtextDark : styles.subtextLight]}>Student Email</Text>
            <Text style={[styles.detailValue, isDark ? styles.textDark : styles.textLight]} numberOfLines={1}>
              {item.userEmail}
            </Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={[styles.detailLabel, isDark ? styles.subtextDark : styles.subtextLight]}>Pass Code</Text>
            <Text style={styles.codeText}>{item.id}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.cancelBtn, isDark && styles.cancelBtnDark]}
          onPress={() => triggerCancelConfirm(item)}
        >
          <Text style={[styles.cancelBtnText, isDark && styles.cancelBtnTextDark]}>Cancel Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.qrBtn}
          onPress={() => handleOpenQR(item)}
        >
          <Text style={styles.qrBtnText}>QR Check-in Pass</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0f172a' : '#ffffff'} />
      <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
        {/* Top Bar Header */}
        <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
          <View style={styles.headerContentWrapper}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>My Bookings</Text>
              <Text style={[styles.headerSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
                {bookings.length} active study room reservation{bookings.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {/* Animated Sun/Moon Theme Switch */}
            <ThemeSwitch />
          </View>
        </View>

        <View style={styles.feedWrapper}>
          <FlatList
            key={`my-bookings-grid-${numColumns}`}
            numColumns={numColumns}
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBookingItem}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={[styles.emptyState, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
                  No Study Room Bookings Yet
                </Text>
                <Text style={[styles.emptySubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
                  You have no active study room reservations. Explore available rooms and reserve a session!
                </Text>
                <TouchableOpacity
                  style={styles.goToHomeBtn}
                  onPress={() => {
                    if (navigation && navigation.navigate) {
                      navigation.navigate('Explore', { screen: 'HomeScreen' });
                    }
                  }}
                >
                  <Text style={styles.goToHomeBtnText}>Explore Available Rooms</Text>
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

        {/* Universal Cancellation Modal */}
        {bookingToCancel && (
          <Modal transparent animationType="fade" visible={true}>
            <View style={styles.modalOverlay}>
              <View style={[styles.confirmBox, isDark && styles.confirmBoxDark]}>
                <Text style={styles.confirmTitle}>Cancel Room Booking</Text>
                <Text style={[styles.confirmDesc, isDark ? styles.textDark : styles.textLight]}>
                  Are you sure you want to cancel your booking for <Text style={{ fontWeight: '700' }}>{bookingToCancel.roomName}</Text> ({bookingToCancel.slotTime})?
                </Text>
                <Text style={[styles.confirmSubdesc, isDark ? styles.subtextDark : styles.subtextLight]}>
                  This time slot will immediately become available for other students to register.
                </Text>

                <View style={styles.confirmBtnRow}>
                  <TouchableOpacity
                    style={[styles.modalCancelBtn, isDark && styles.modalCancelBtnDark]}
                    onPress={() => setBookingToCancel(null)}
                  >
                    <Text style={[styles.modalCancelBtnText, isDark && styles.textDark]}>Keep Booking</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    onPress={() => performCancel(bookingToCancel.id)}
                  >
                    <Text style={styles.modalConfirmBtnText}>Yes, Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};
