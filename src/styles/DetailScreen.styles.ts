import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: '#f8fafc',
  },
  bgDark: {
    backgroundColor: '#0f172a',
  },
  topHeader: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  topHeaderLight: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e8f0',
  },
  topHeaderDark: {
    backgroundColor: '#0f172a',
    borderBottomColor: '#1e293b',
  },
  headerInner: {
    width: '100%',
    maxWidth: 1200,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  backBtnLight: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  backBtnDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  splitContainer: {
    width: '100%',
    maxWidth: 1200,
    gap: 16,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftBox: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  leftBoxWide: {
    flex: 1,
  },
  rightBox: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  rightBoxWide: {
    flex: 1.1,
  },
  boxLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  boxDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  imageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
    backgroundColor: '#cbd5e1',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
  statusTag: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusTagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  roomMainInfo: {
    padding: 18,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  locationSubtitle: {
    fontSize: 13.5,
    marginBottom: 14,
  },
  specsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  specsGridLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  specsGridDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  specCell: {
    flex: 1,
  },
  specDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 10,
  },
  specCellLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  specCellValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 14,
  },
  equipmentWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  eqChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  eqChipLight: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  eqChipDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1d4ed8',
  },
  eqChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eqChipTextLight: {
    color: '#1d4ed8',
  },
  eqChipTextDark: {
    fontSize: 12,
    color: '#93c5fd',
    fontWeight: '600',
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  summaryBox: {
    marginTop: 16,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  summaryLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  summaryDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12.5,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  confirmBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  confirmBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
