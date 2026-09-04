import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  containerLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  searchBarLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  searchBarDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  searchBarFocusedLight: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  searchBarFocusedDark: {
    borderColor: '#60a5fa',
    backgroundColor: '#0f172a',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
  clearIcon: {
    color: '#94a3b8',
    fontSize: 14,
  },
  dropdownsRow: {
    gap: 10,
  },
  dropdownsRowWide: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dropdownsRowMobile: {
    flexDirection: 'column',
  },
  dropdownCol: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelLight: {
    color: '#64748b',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  dropdownBtnLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  dropdownBtnDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  dropdownBtnActive: {
    borderColor: '#2563eb',
  },
  dropdownBtnOpen: {
    borderColor: '#2563eb',
  },
  dropdownBtnText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  arrowIcon: {
    fontSize: 9,
    color: '#94a3b8',
    marginLeft: 6,
  },
  textLight: {
    color: '#334155',
  },
  textDark: {
    color: '#f8fafc',
  },
  textActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonDark: {
    backgroundColor: '#331515',
    borderColor: '#7f1d1d',
  },
  resetButtonText: {
    color: '#dc2626',
    fontSize: 12.5,
    fontWeight: '700',
  },
  resetButtonTextDark: {
    color: '#fca5a5',
  },
  popoverPanel: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  popoverLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  popoverDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  popoverTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compactWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  compactChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chipLight: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
  },
  chipDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  chipActive: {
    borderColor: '#2563eb',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
