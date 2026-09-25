import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TIME_SLOTS } from '../../data/mockRooms';
import { TimeSlot } from '../../types';
import { useBookingStore } from '../../store/useBookingStore';
import { styles } from '../../styles/components/TimeSlotGrid.styles';

interface TimeSlotGridProps {
  selectedSlotId: string | null;
  onSlotSelect: (slot: TimeSlot) => void;
  isSlotBooked: (slotId: string) => boolean;
  isRoomSlotBooked?: (slotId: string) => boolean;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedSlotId,
  onSlotSelect,
  isSlotBooked,
  isRoomSlotBooked,
}) => {
  const { themeMode } = useBookingStore();
  const isDark = themeMode === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
        Chọn ca học (2 tiếng / ca)
      </Text>
      <View style={styles.grid}>
        {TIME_SLOTS.map((slot) => {
          const isRoomBooked = isRoomSlotBooked ? isRoomSlotBooked(slot.id) : false;
          const isGlobalConflict = isSlotBooked(slot.id);
          const isDisabled = isRoomBooked || isGlobalConflict;
          const isSelected = selectedSlotId === slot.id;

          let statusLabel = 'Còn trống';
          let statusIcon: any = 'checkmark-circle';
          let statusStyle = styles.statusAvailable;

          if (isRoomBooked) {
            statusLabel = 'Đã kín';
            statusIcon = 'close-circle';
            statusStyle = styles.statusBooked;
          } else if (isGlobalConflict) {
            statusLabel = 'Trùng lịch';
            statusIcon = 'alert-circle';
            statusStyle = styles.statusConflict;
          } else if (isSelected) {
            statusLabel = 'Đang chọn';
            statusIcon = 'radio-button-on';
            statusStyle = styles.textSelected;
          }

          return (
            <TouchableOpacity
              key={slot.id}
              activeOpacity={0.75}
              disabled={isDisabled}
              style={[
                styles.slotCard,
                isDark ? styles.slotDark : styles.slotLight,
                isSelected && styles.slotSelected,
                isDisabled && (isDark ? styles.slotDisabledDark : styles.slotDisabledLight),
              ]}
              onPress={() => onSlotSelect(slot)}
            >
              <View style={styles.slotHeader}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={
                    isSelected
                      ? '#ffffff'
                      : isDisabled
                      ? '#94a3b8'
                      : isDark
                      ? '#818cf8'
                      : '#4f46e5'
                  }
                />
                <Text
                  style={[
                    styles.slotLabel,
                    isDark ? styles.textDark : styles.slotLabelLight,
                    isSelected && styles.textSelected,
                    isDisabled && styles.textDisabled,
                  ]}
                >
                  {slot.startTime} - {slot.endTime}
                </Text>
              </View>

              <View style={styles.slotStatusRow}>
                <Ionicons
                  name={statusIcon}
                  size={13}
                  color={
                    isSelected
                      ? '#ffffff'
                      : isRoomBooked
                      ? '#ef4444'
                      : isGlobalConflict
                      ? '#f59e0b'
                      : '#10b981'
                  }
                />
                <Text
                  style={[
                    styles.slotStatus,
                    isSelected && styles.textSelected,
                    statusStyle,
                  ]}
                >
                  {statusLabel}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
