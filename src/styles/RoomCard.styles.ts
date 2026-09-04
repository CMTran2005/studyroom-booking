import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    height: 165,
    width: '100%',
    position: 'relative',
    backgroundColor: '#cbd5e1',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginRight: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  buildingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  buildingText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
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
    color: '#cbd5e1',
  },
  footerStack: {
    gap: 8,
  },
  capacityContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  capacityLight: {
    backgroundColor: '#e2e8f0',
  },
  capacityDark: {
    backgroundColor: '#334155',
  },
  capacityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  capacityTextLight: {
    color: '#1e293b',
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  equipmentChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  equipmentChipLight: {
    backgroundColor: '#eff6ff',
    borderColor: '#dbeafe',
  },
  equipmentChipDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1d4ed8',
  },
  equipmentChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  equipmentChipTextLight: {
    color: '#1d4ed8',
  },
});
