import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Booking } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { styles } from '../styles/QRModal.styles';

interface QRModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ visible, booking, onClose }) => {
  const themeMode = useBookingStore((state) => state.themeMode);
  const isDark = themeMode === 'dark';

  if (!booking) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          {/* Header Ticket Badge */}
          <View style={styles.ticketHeader}>
            <Text style={styles.badgeText}>VKU SMART CHECK-IN PASS</Text>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
              Room Access Pass
            </Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <QRCode
              value={booking.qrCodeValue || booking.id}
              size={170}
              backgroundColor="#ffffff"
              color="#0f172a"
            />
          </View>

          {/* Booking Summary breakdown */}
          <View style={[styles.infoBox, isDark ? styles.infoDark : styles.infoLight]}>
            <Text style={[styles.roomName, isDark ? styles.textDark : styles.textLight]}>
              {booking.roomName}
            </Text>
            <Text style={[styles.infoText, isDark ? styles.subtextDark : styles.subtextLight]}>
              Building {booking.building} • Floor {booking.floor}
            </Text>
            <Text style={[styles.infoText, isDark ? styles.subtextDark : styles.subtextLight]}>
              Date: {booking.date}
            </Text>
            <Text style={[styles.slotText, isDark ? styles.slotTextDark : styles.slotTextLight]}>
              Session: {booking.slotTime}
            </Text>
            <Text style={styles.codeText}>Pass Code: {booking.id}</Text>
          </View>

          <Text style={[styles.instruction, isDark ? styles.subtextDark : styles.subtextLight]}>
            Please present this QR code to the scanner at the room door to unlock automatically.
          </Text>

          {/* Close Action Button */}
          <TouchableOpacity activeOpacity={0.8} style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Confirm & Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
