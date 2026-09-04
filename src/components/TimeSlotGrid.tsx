import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TIME_SLOTS } from '../data/mockRooms';
import { TimeSlot } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { styles } from '../styles/TimeSlotGrid.styles';

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
  const themeMode = useBookingStore((state) => state.themeMode);
  const isDark = themeMode === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
        Select Time Slot (2-Hour Sessions)
      </Text>
      <View style={styles.grid}>
        {TIME_SLOTS.map((slot) => {
          const isRoomBooked = isRoomSlotBooked ? isRoomSlotBooked(slot.id) : false;
          const isGlobalConflict = isSlotBooked(slot.id);
          const isDisabled = isRoomBooked || isGlobalConflict;
          const isSelected = selectedSlotId === slot.id;

          let statusLabel = 'Available';
          let statusStyle = styles.statusAvailable;

          if (isRoomBooked) {
            statusLabel = 'Booked';
            statusStyle = styles.statusBooked;
          } else if (isGlobalConflict) {
            statusLabel = 'Time Conflict';
            statusStyle = styles.statusConflict;
          } else if (isSelected) {
            statusLabel = 'Selected';
            statusStyle = styles.textSelected;
          }

          return (
            <TouchableOpacity
              key={slot.id}
              activeOpacity={0.7}
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

              <Text
                style={[
                  styles.slotStatus,
                  isSelected && styles.textSelected,
                  statusStyle,
                ]}
              >
                {statusLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
