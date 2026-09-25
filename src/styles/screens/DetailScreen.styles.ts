import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: '#f8fafc',
  },
  bgDark: {
    backgroundColor: '#0b0f19',
  },
  topHeader: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  topHeaderLight: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#f1f5f9',
  },
  topHeaderDark: {
    backgroundColor: '#0b0f19',
    borderBottomColor: '#172136',
  },
  headerInner: {
    width: '100%',
    maxWidth: 1000,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  backBtnLight: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  backBtnDark: {
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerRoomTitle: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: 220,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    alignItems: 'center',
  },
  splitContainer: {
    width: '100%',
    maxWidth: 1000,
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
    padding: 18,
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
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  imageContainer: {
    height: 210,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusTagText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  roomMainInfo: {
    padding: 18,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  locationSubtitle: {
    fontSize: 13.5,
    marginBottom: 16,
  },
  specsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  specsGridLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  specsGridDark: {
    backgroundColor: '#0b0f19',
    borderColor: '#172136',
  },
  specCell: {
    flex: 1,
    alignItems: 'center',
  },
  specCellIcon: {
    marginBottom: 4,
  },
  specCellLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  specCellValue: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  specDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e2e8f0',
  },
  specDividerDark: {
    backgroundColor: '#1e2a42',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 6,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  equipmentWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  eqChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  eqChipLight: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  eqChipDark: {
    backgroundColor: '#1e1b4b',
    borderColor: '#3730a3',
  },
  eqChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eqChipTextLight: {
    color: '#4f46e5',
  },
  eqChipTextDark: {
    color: '#a5b4fc',
  },
  bookingTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  floatingBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  floatingBottomLight: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
  },
  floatingBottomDark: {
    backgroundColor: '#0d1322',
    borderTopColor: '#1e2a42',
  },
  floatingInfoCol: {
    flex: 1,
    marginRight: 14,
  },
  floatingSlotLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  floatingSlotValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  confirmBtn: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 14,
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
    color: '#94a3b8',
  },
});
