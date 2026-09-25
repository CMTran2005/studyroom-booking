import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../../types';
import { useBookingStore } from '../../store/useBookingStore';
import { styles } from '../../styles/components/QRModal.styles';

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
            <View style={[styles.badgeRow, isDark && styles.badgeRowDark]}>
              <Ionicons
                name="shield-checkmark"
                size={13}
                color={isDark ? '#a5b4fc' : '#4f46e5'}
              />
              <Text style={[styles.badgeText, isDark && styles.badgeTextDark]}>
                VKU SMART CHECK-IN PASS
              </Text>
            </View>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
              Thẻ Nhận Phòng Học
            </Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <QRCode
              value={booking.qrCodeValue || booking.id}
              size={170}
              backgroundColor="#ffffff"
              color="#0b0f19"
            />
          </View>

          {/* Booking Summary breakdown */}
          <View style={[styles.infoBox, isDark ? styles.infoDark : styles.infoLight]}>
            <Text style={[styles.roomName, isDark ? styles.textDark : styles.textLight]}>
              {booking.roomName}
            </Text>
            <Text style={[styles.infoText, isDark ? styles.subtextDark : styles.subtextLight]}>
              Tòa {booking.building} • Tầng {booking.floor}
            </Text>
            <Text style={[styles.infoText, isDark ? styles.subtextDark : styles.subtextLight]}>
              Ngày học: {booking.date}
            </Text>
            <Text style={[styles.slotText, isDark && styles.slotTextDark]}>
              Ca học: {booking.slotTime}
            </Text>
            <View style={[styles.codeBadge, isDark && styles.codeBadgeDark]}>
              <Text
                style={[
                  styles.codeText,
                  { color: isDark ? '#a5b4fc' : '#4f46e5' },
                ]}
              >
                Mã thẻ: {booking.id}
              </Text>
            </View>
          </View>

          <Text style={[styles.instruction, isDark ? styles.subtextDark : styles.subtextLight]}>
            Xuất trình mã QR này tại máy quét trước cửa phòng hoặc cho ban quản lý để mở khóa nhận phòng.
          </Text>

          {/* Close Action Button */}
          <TouchableOpacity activeOpacity={0.85} style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.closeBtnText}>Xác nhận & Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
