import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Building, Equipment } from '../../types';
import { useBookingStore } from '../../store/useBookingStore';
import { styles } from '../../styles/components/FilterChips.styles';

interface FilterChipsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBuilding: Building | 'ALL';
  onBuildingSelect: (b: Building | 'ALL') => void;
  selectedEquipment: Equipment[];
  onEquipmentToggle: (eq: Equipment) => void;
  minCapacity: number | null;
  onCapacitySelect: (cap: number | null) => void;
  onReset: () => void;
}

const CATEGORIES: {
  id: string;
  label: string;
  icon: string;
  building?: Building | 'ALL';
  equipment?: Equipment;
}[] = [
  { id: 'all', label: 'Tất cả phòng', icon: 'apps-outline', building: 'ALL' },
  { id: 'b-v', label: 'Tòa V (Smart Hub)', icon: 'business-outline', building: 'V' },
  { id: 'b-a', label: 'Tòa A', icon: 'business-outline', building: 'A' },
  { id: 'b-b', label: 'Tòa B', icon: 'business-outline', building: 'B' },
  { id: 'b-c', label: 'Tòa C', icon: 'business-outline', building: 'C' },
  { id: 'pc', label: 'Lab Máy tính PC', icon: 'desktop-outline', equipment: 'High-spec PC' },
  { id: 'discuss', label: 'Thảo luận nhóm', icon: 'people-outline', equipment: 'Whiteboard' },
  { id: 'ac', label: 'Có máy lạnh', icon: 'snow-outline', equipment: 'AC' },
  { id: 'proj', label: 'Máy chiếu HD', icon: 'videocam-outline', equipment: 'Projector' },
];

const CAPACITIES = [
  { label: 'Tất cả chỗ', value: null },
  { label: '≥ 4 chỗ', value: 4 },
  { label: '≥ 8 chỗ', value: 8 },
  { label: '≥ 15 chỗ', value: 15 },
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  searchQuery,
  onSearchChange,
  selectedBuilding,
  onBuildingSelect,
  selectedEquipment,
  onEquipmentToggle,
  minCapacity,
  onCapacitySelect,
  onReset,
}) => {
  const themeMode = useBookingStore((state) => state.themeMode);
  const isDark = themeMode === 'dark';
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedBuilding !== 'ALL' ||
    selectedEquipment.length > 0 ||
    minCapacity !== null;

  return (
    <View style={styles.container}>
      {/* Modern Search Bar */}
      <View
        style={[
          styles.searchBar,
          isDark ? styles.searchBarDark : styles.searchBarLight,
          isSearchFocused && (isDark ? styles.searchBarFocusedDark : styles.searchBarFocusedLight),
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={isDark ? '#64748b' : '#94a3b8'}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            isDark ? styles.searchInputDark : styles.searchInputLight,
            Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
          ]}
          placeholder="Tìm phòng học, Tòa V, A, B, C, Lab AI..."
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => onSearchChange('')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={isDark ? '#94a3b8' : '#94a3b8'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          let isActive = false;
          if (cat.id === 'all') {
            isActive = selectedBuilding === 'ALL' && selectedEquipment.length === 0;
          } else if (cat.building) {
            isActive = selectedBuilding === cat.building;
          } else if (cat.equipment) {
            isActive = selectedEquipment.includes(cat.equipment);
          }

          const handlePress = () => {
            if (cat.id === 'all') {
              onBuildingSelect('ALL');
              if (selectedEquipment.length > 0) {
                onReset();
              }
            } else if (cat.building) {
              onBuildingSelect(selectedBuilding === cat.building ? 'ALL' : cat.building);
            } else if (cat.equipment) {
              onEquipmentToggle(cat.equipment);
            }
          };

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              style={[
                styles.categoryPill,
                isDark ? styles.categoryPillDark : styles.categoryPillLight,
                isActive && (isDark ? styles.categoryPillActiveDark : styles.categoryPillActive),
              ]}
              onPress={handlePress}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={
                  isActive
                    ? '#ffffff'
                    : isDark
                    ? '#94a3b8'
                    : '#475569'
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  isDark ? styles.categoryTextDark : styles.categoryTextLight,
                  isActive && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Capacity Sub-filters & Reset Button */}
      <View style={styles.subFilterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.capacityScroll}
          contentContainerStyle={styles.capacityContent}
        >
          {CAPACITIES.map((cap) => {
            const isSelected = minCapacity === cap.value;
            return (
              <TouchableOpacity
                key={cap.label}
                activeOpacity={0.7}
                style={[
                  styles.capacityPill,
                  isDark ? styles.capacityPillDark : styles.capacityPillLight,
                  isSelected &&
                    (isDark ? styles.capacityPillActiveDark : styles.capacityPillActive),
                ]}
                onPress={() => onCapacitySelect(cap.value)}
              >
                <Text
                  style={[
                    styles.capacityText,
                    isDark ? styles.capacityTextDark : styles.capacityTextLight,
                    isSelected &&
                      (isDark ? styles.capacityTextActiveDark : styles.capacityTextActive),
                  ]}
                >
                  {cap.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {hasActiveFilters && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.resetPill, isDark && styles.resetPillDark]}
            onPress={onReset}
          >
            <Ionicons name="refresh" size={13} color={isDark ? '#fca5a5' : '#ef4444'} />
            <Text style={[styles.resetText, isDark && styles.resetTextDark]}>
              Đặt lại
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
