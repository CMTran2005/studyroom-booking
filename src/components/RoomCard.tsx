import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Room } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { styles } from '../styles/RoomCard.styles';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
}

export const RoomCard = memo(({ room, onPress }: RoomCardProps) => {
  const themeMode = useBookingStore((state) => state.themeMode);
  const isRoomAvailableToday = useBookingStore((state) => state.isRoomAvailableToday);

  // Dynamic real-time status check with safe fallback
  const isAvailable = typeof isRoomAvailableToday === 'function'
    ? isRoomAvailableToday(room.id)
    : (room.isAvailableNow ?? true);

  const isDark = themeMode === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
      ]}
      onPress={() => onPress(room)}
    >
      {/* Image Banner with Badges */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />

        {/* Dynamic Status Badge (Top Right) */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isAvailable ? '#15803d' : '#b91c1c' },
          ]}
        >
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {isAvailable ? 'Available' : 'Occupied'}
          </Text>
        </View>

        {/* Building & Floor Badge (Bottom Left Overlay) */}
        <View style={styles.buildingBadge}>
          <Text style={styles.buildingText}>Building {room.building} • Floor {room.floor}</Text>
        </View>
      </View>

      {/* Card Content Body */}
      <View style={styles.content}>
        {/* Room Title */}
        <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]} numberOfLines={1}>
          {room.name}
        </Text>

        {/* Room Description */}
        <Text style={[styles.description, isDark ? styles.subtextDark : styles.subtextLight]} numberOfLines={2}>
          {room.description}
        </Text>

        {/* Capacity & Equipment Badges Stack */}
        <View style={styles.footerStack}>
          {/* Capacity Pill Badge */}
          <View style={[styles.capacityContainer, isDark ? styles.capacityDark : styles.capacityLight]}>
            <Text style={[styles.capacityText, isDark ? styles.textDark : styles.capacityTextLight]}>
              Capacity: {room.capacity} seats
            </Text>
          </View>

          {/* Equipment Pill Badges Row */}
          <View style={styles.equipmentRow}>
            {room.equipments.map((eq, idx) => (
              <View key={idx} style={[styles.equipmentChip, isDark ? styles.equipmentChipDark : styles.equipmentChipLight]}>
                <Text style={[styles.equipmentChipText, isDark ? styles.textDark : styles.equipmentChipTextLight]}>
                  {eq}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});
