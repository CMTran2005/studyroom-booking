import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  textLight: {
    color: '#1e293b',
  },
  textDark: {
    color: '#f8fafc',
  },
  subtextLight: {
    color: '#64748b',
  },
  subtextDark: {
    color: '#cbd5e1',
  },
  scrollRow: {
    flexDirection: 'row',
  },
  dateCard: {
    width: 64,
    height: 74,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
  },
  dateCardLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  dateCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  dateCardSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#dbeafe',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  dayNumberSelected: {
    color: '#ffffff',
  },
});
