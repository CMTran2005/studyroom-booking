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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
  },
  slotLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  slotDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  slotSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  slotDisabledLight: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    opacity: 0.7,
  },
  slotDisabledDark: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    opacity: 0.6,
  },
  slotHeader: {
    marginBottom: 4,
  },
  slotLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  slotLabelLight: {
    color: '#0f172a',
  },
  slotStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusAvailable: {
    color: '#16a34a',
  },
  statusBooked: {
    color: '#dc2626',
  },
  statusConflict: {
    color: '#d97706',
  },
  textSelected: {
    color: '#ffffff',
  },
  textDisabled: {
    color: '#94a3b8',
  },
});
