import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../../types';
import { useBookingStore } from '../../store/useBookingStore';
import { styles } from '../../styles/components/RoomCard.styles';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
}

const EQUIPMENT_ICONS: Record<string, string> = {
  'High-spec PC': 'desktop-outline',
  'Whiteboard': 'create-outline',
  'Projector': 'videocam-outline',
  'AC': 'snow-outline',
};

export const RoomCard = memo(({ room, onPress }: RoomCardProps) => {
  const themeMode = useBookingStore((state) => state.themeMode);
  // Reactively subscribe to bookings array so status badge updates instantly on add/cancel
  const bookings = useBookingStore((state) => state.bookings);
  const isRoomAvailableToday = useBookingStore((state) => state.isRoomAvailableToday);

  const isAvailable = isRoomAvailableToday(room.id);
  const isDark = themeMode === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
      onPress={() => onPress(room)}
    >
      {/* Image Banner with Badges */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />

        {/* Capacity Badge (Top Right) */}
        <View style={styles.capacityBadge}>
          <Ionicons name="people" size={13} color="#ffffff" />
          <Text style={styles.capacityText}>{room.capacity} chỗ</Text>
        </View>

        {/* Building & Floor Badge (Bottom Left Overlay) */}
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={12} color="#ffffff" />
          <Text style={styles.locationText}>
            Tòa {room.building} • Tầng {room.floor}
          </Text>
        </View>
      </View>

      {/* Card Content Body */}
      <View style={styles.content}>
        {/* Title & Availability Badge */}
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, isDark ? styles.textDark : styles.textLight]}
            numberOfLines={1}
          >
            {room.name}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isAvailable
                  ? isDark
                    ? '#064e3b'
                    : '#ecfdf5'
                  : isDark
                  ? '#450a0a'
                  : '#fef2f2',
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isAvailable ? '#10b981' : '#ef4444' },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: isAvailable
                    ? isDark
                      ? '#6ee7b7'
                      : '#059669'
                    : isDark
                    ? '#fca5a5'
                    : '#dc2626',
                },
              ]}
            >
              {isAvailable ? 'Còn chỗ' : 'Kín lịch'}
            </Text>
          </View>
        </View>

        {/* Room Description */}
        <Text
          style={[styles.description, isDark ? styles.subtextDark : styles.subtextLight]}
          numberOfLines={2}
        >
          {room.description}
        </Text>

        {/* Footer: Equipment Chips + Book Now CTA */}
        <View
          style={[
            styles.footer,
            isDark ? styles.footerBorderDark : styles.footerBorderLight,
          ]}
        >
          <View style={styles.equipmentRow}>
            {room.equipments.slice(0, 3).map((eq, idx) => (
              <View
                key={idx}
                style={[
                  styles.equipmentChip,
                  isDark ? styles.equipmentChipDark : styles.equipmentChipLight,
                ]}
              >
                <Ionicons
                  name={(EQUIPMENT_ICONS[eq] || 'checkmark-circle-outline') as any}
                  size={12}
                  color={isDark ? '#818cf8' : '#4f46e5'}
                />
                <Text
                  style={[
                    styles.equipmentChipText,
                    isDark ? styles.equipmentChipTextDark : styles.equipmentChipTextLight,
                  ]}
                >
                  {eq}
                </Text>
              </View>
            ))}
            {room.equipments.length > 3 && (
              <View
                style={[
                  styles.equipmentChip,
                  isDark ? styles.equipmentChipDark : styles.equipmentChipLight,
                ]}
              >
                <Text
                  style={[
                    styles.equipmentChipText,
                    isDark ? styles.equipmentChipTextDark : styles.equipmentChipTextLight,
                  ]}
                >
                  +{room.equipments.length - 3}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bookNowBtn}>
            <Text style={styles.bookNowBtnText}>Đặt phòng</Text>
            <Ionicons name="arrow-forward" size={12} color="#ffffff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});
