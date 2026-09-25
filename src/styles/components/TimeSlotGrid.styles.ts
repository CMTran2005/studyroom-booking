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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '48%',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
  },
  slotLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  slotDark: {
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  slotSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  slotDisabledLight: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    opacity: 0.65,
  },
  slotDisabledDark: {
    backgroundColor: '#0b0f19',
    borderColor: '#172136',
    opacity: 0.55,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  slotLabel: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  slotLabelLight: {
    color: '#0f172a',
  },
  slotStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slotStatus: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  statusAvailable: {
    color: '#10b981',
  },
  statusBooked: {
    color: '#ef4444',
  },
  statusConflict: {
    color: '#f59e0b',
  },
  textSelected: {
    color: '#ffffff',
  },
  textDisabled: {
    color: '#94a3b8',
  },
});
