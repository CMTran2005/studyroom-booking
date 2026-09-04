import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Building, Equipment } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { styles } from '../styles/FilterChips.styles';

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

const BUILDINGS: { label: string; value: Building | 'ALL' }[] = [
  { label: 'All Buildings', value: 'ALL' },
  { label: 'Building A', value: 'A' },
  { label: 'Building B', value: 'B' },
  { label: 'Building C', value: 'C' },
  { label: 'Building V', value: 'V' },
];

const EQUIPMENTS: Equipment[] = ['Projector', 'Whiteboard', 'High-spec PC', 'AC'];

const CAPACITIES = [
  { label: 'All Seats', value: null },
  { label: '≥ 4 Seats', value: 4 },
  { label: '≥ 8 Seats', value: 8 },
  { label: '≥ 15 Seats', value: 15 },
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
  const { width } = useWindowDimensions();
  const themeMode = useBookingStore((state) => state.themeMode);
  const isDark = themeMode === 'dark';

  const isWideScreen = width >= 768;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'building' | 'equipment' | 'capacity' | null>(null);

  const toggleDropdown = (type: 'building' | 'equipment' | 'capacity') => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* Search Input */}
      <View
        style={[
          styles.searchBar,
          isDark ? styles.searchBarDark : styles.searchBarLight,
          isSearchFocused && (isDark ? styles.searchBarFocusedDark : styles.searchBarFocusedLight),
        ]}
      >
        <TextInput
          style={[
            styles.searchInput,
            isDark ? styles.searchInputDark : styles.searchInputLight,
            Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
          ]}
          placeholder="Search room name, Building A, B, C, V..."
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => onSearchChange('')}
            activeOpacity={0.7}
          >
            <Text style={[styles.clearIcon, isDark && styles.textDark]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Responsive Dropdowns Bar */}
      <View style={[styles.dropdownsRow, isWideScreen ? styles.dropdownsRowWide : styles.dropdownsRowMobile]}>
        {/* Dropdown 1: Building */}
        <View style={styles.dropdownCol}>
          <Text style={[styles.dropdownLabel, isDark ? styles.textDark : styles.labelLight]}>Building</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.dropdownButton,
              isDark ? styles.dropdownBtnDark : styles.dropdownBtnLight,
              selectedBuilding !== 'ALL' && styles.dropdownBtnActive,
              activeDropdown === 'building' && styles.dropdownBtnOpen,
            ]}
            onPress={() => toggleDropdown('building')}
          >
            <Text
              style={[
                styles.dropdownBtnText,
                isDark ? styles.textDark : styles.textLight,
                selectedBuilding !== 'ALL' && styles.textActive,
              ]}
              numberOfLines={1}
            >
              {selectedBuilding === 'ALL' ? 'All Buildings' : `Building ${selectedBuilding}`}
            </Text>
            <Text style={[styles.arrowIcon, isDark && styles.textDark]}>
              {activeDropdown === 'building' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown 2: Equipment */}
        <View style={styles.dropdownCol}>
          <Text style={[styles.dropdownLabel, isDark ? styles.textDark : styles.labelLight]}>Equipment</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.dropdownButton,
              isDark ? styles.dropdownBtnDark : styles.dropdownBtnLight,
              selectedEquipment.length > 0 && styles.dropdownBtnActive,
              activeDropdown === 'equipment' && styles.dropdownBtnOpen,
            ]}
            onPress={() => toggleDropdown('equipment')}
          >
            <Text
              style={[
                styles.dropdownBtnText,
                isDark ? styles.textDark : styles.textLight,
                selectedEquipment.length > 0 && styles.textActive,
              ]}
              numberOfLines={1}
            >
              {selectedEquipment.length === 0
                ? 'All Equipment'
                : `${selectedEquipment.length} Selected`}
            </Text>
            <Text style={[styles.arrowIcon, isDark && styles.textDark]}>
              {activeDropdown === 'equipment' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown 3: Capacity */}
        <View style={styles.dropdownCol}>
          <Text style={[styles.dropdownLabel, isDark ? styles.textDark : styles.labelLight]}>Capacity</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.dropdownButton,
              isDark ? styles.dropdownBtnDark : styles.dropdownBtnLight,
              minCapacity !== null && styles.dropdownBtnActive,
              activeDropdown === 'capacity' && styles.dropdownBtnOpen,
            ]}
            onPress={() => toggleDropdown('capacity')}
          >
            <Text
              style={[
                styles.dropdownBtnText,
                isDark ? styles.textDark : styles.textLight,
                minCapacity !== null && styles.textActive,
              ]}
              numberOfLines={1}
            >
              {minCapacity === null ? 'All Capacities' : `≥ ${minCapacity} Seats`}
            </Text>
            <Text style={[styles.arrowIcon, isDark && styles.textDark]}>
              {activeDropdown === 'capacity' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reset Filters Button */}
        <View style={[styles.dropdownCol, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.resetButton, isDark && styles.resetButtonDark]}
            onPress={onReset}
          >
            <Text style={[styles.resetButtonText, isDark && styles.resetButtonTextDark]}>
              Reset Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- INLINE COMPACT CHIPS PANEL --- */}
      {activeDropdown && (
        <View style={[styles.popoverPanel, isDark ? styles.popoverDark : styles.popoverLight]}>
          {/* PANEL 1: BUILDING */}
          {activeDropdown === 'building' && (
            <View>
              <Text style={[styles.popoverTitle, isDark ? styles.textDark : styles.textLight]}>
                Filter by Building:
              </Text>
              <View style={styles.compactWrap}>
                {BUILDINGS.map((b) => {
                  const isSelected = selectedBuilding === b.value;
                  return (
                    <TouchableOpacity
                      key={b.value}
                      activeOpacity={0.7}
                      style={[
                        styles.compactChip,
                        isDark ? styles.chipDark : styles.chipLight,
                        isSelected && styles.chipActive,
                      ]}
                      onPress={() => onBuildingSelect(b.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isDark ? styles.textDark : styles.textLight,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {isSelected ? '✓ ' : ''}{b.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* PANEL 2: EQUIPMENT */}
          {activeDropdown === 'equipment' && (
            <View>
              <Text style={[styles.popoverTitle, isDark ? styles.textDark : styles.textLight]}>
                Filter by Equipment:
              </Text>
              <View style={styles.compactWrap}>
                {EQUIPMENTS.map((eq) => {
                  const isSelected = selectedEquipment.includes(eq);
                  return (
                    <TouchableOpacity
                      key={eq}
                      activeOpacity={0.7}
                      style={[
                        styles.compactChip,
                        isDark ? styles.chipDark : styles.chipLight,
                        isSelected && styles.chipActive,
                      ]}
                      onPress={() => onEquipmentToggle(eq)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isDark ? styles.textDark : styles.textLight,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {isSelected ? '✓ ' : ''}{eq}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* PANEL 3: CAPACITY */}
          {activeDropdown === 'capacity' && (
            <View>
              <Text style={[styles.popoverTitle, isDark ? styles.textDark : styles.textLight]}>
                Filter by Capacity:
              </Text>
              <View style={styles.compactWrap}>
                {CAPACITIES.map((cap) => {
                  const isSelected = minCapacity === cap.value;
                  return (
                    <TouchableOpacity
                      key={cap.label}
                      activeOpacity={0.7}
                      style={[
                        styles.compactChip,
                        isDark ? styles.chipDark : styles.chipLight,
                        isSelected && styles.chipActive,
                      ]}
                      onPress={() => onCapacitySelect(cap.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isDark ? styles.textDark : styles.textLight,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {isSelected ? '✓ ' : ''}{cap.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
