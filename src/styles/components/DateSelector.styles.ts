import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  textLight: {
    color: '#0f172a',
  },
  textDark: {
    color: '#f8fafc',
  },
  subtextLight: {
    color: '#64748b',
  },
  subtextDark: {
    color: '#94a3b8',
  },
  scrollRow: {
    flexDirection: 'row',
  },
  dateCard: {
    width: 66,
    height: 78,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1.5,
  },
  dateCardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dateCardDark: {
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  dateCardSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  dayName: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#c7d2fe',
  },
  dayNumber: {
    fontSize: 19,
    fontWeight: '800',
  },
  dayNumberSelected: {
    color: '#ffffff',
  },
});
