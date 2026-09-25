import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  searchBarLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchBarDark: {
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  searchBarFocusedLight: {
    borderColor: '#4f46e5',
    backgroundColor: '#ffffff',
  },
  searchBarFocusedDark: {
    borderColor: '#6366f1',
    backgroundColor: '#131b2e',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    padding: 0,
  },
  searchInputLight: {
    color: '#0f172a',
  },
  searchInputDark: {
    color: '#f8fafc',
  },
  clearBtn: {
    padding: 4,
  },
  horizontalScroll: {
    paddingVertical: 4,
    marginBottom: 10,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 2,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryPillLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryPillDark: {
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  categoryPillActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryPillActiveDark: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextLight: {
    color: '#475569',
  },
  categoryTextDark: {
    color: '#94a3b8',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  subFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  capacityScroll: {
    flex: 1,
  },
  capacityContent: {
    gap: 6,
    alignItems: 'center',
  },
  capacityPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  capacityPillLight: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  capacityPillDark: {
    backgroundColor: '#172136',
    borderColor: '#22304d',
  },
  capacityPillActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#4f46e5',
  },
  capacityPillActiveDark: {
    backgroundColor: '#1e1b4b',
    borderColor: '#6366f1',
  },
  capacityText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  capacityTextLight: {
    color: '#64748b',
  },
  capacityTextDark: {
    color: '#94a3b8',
  },
  capacityTextActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  capacityTextActiveDark: {
    color: '#a5b4fc',
    fontWeight: '700',
  },
  resetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginLeft: 8,
  },
  resetPillDark: {
    backgroundColor: '#450a0a',
    borderColor: '#7f1d1d',
  },
  resetText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#ef4444',
  },
  resetTextDark: {
    color: '#fca5a5',
  },
});
