import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { DateItem } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { styles } from '../styles/DateSelector.styles';

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateSelect: (dateStr: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateSelect }) => {
  const themeMode = useBookingStore((state) => state.themeMode);
  const isDark = themeMode === 'dark';

  const datesList: DateItem[] = useMemo(() => {
    const list: DateItem[] = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${day}`;

      list.push({
        fullDate,
        dayName: i === 0 ? 'Today' : dayNames[d.getDay()],
        dayNumber: day,
        isToday: i === 0,
      });
    }

    return list;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
        Select Booking Date (Next 7 Days)
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        {datesList.map((item) => {
          const isSelected = selectedDate === item.fullDate;
          return (
            <TouchableOpacity
              key={item.fullDate}
              activeOpacity={0.7}
              style={[
                styles.dateCard,
                isDark ? styles.dateCardDark : styles.dateCardLight,
                isSelected && styles.dateCardSelected,
              ]}
              onPress={() => onDateSelect(item.fullDate)}
            >
              <Text
                style={[
                  styles.dayName,
                  isDark ? styles.subtextDark : styles.subtextLight,
                  isSelected && styles.dayNameSelected,
                ]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isDark ? styles.textDark : styles.textLight,
                  isSelected && styles.dayNumberSelected,
                ]}
              >
                {item.dayNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
