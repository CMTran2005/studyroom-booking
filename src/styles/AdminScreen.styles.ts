import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  centerScrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  innerContent: {
    width: '100%',
    maxWidth: 950,
  },
  innerContentWide: {
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    gap: 4,
  },
  backLinkBtn: {
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  backLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customLogoutBtn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  customLogoutBtnDark: {
    backgroundColor: '#331515',
    borderColor: '#7f1d1d',
  },
  customLogoutBtnText: {
    color: '#dc2626',
    fontSize: 12.5,
    fontWeight: '700',
  },
  customLogoutBtnTextDark: {
    color: '#fca5a5',
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
  },
  loginHeader: {
    alignItems: 'center',
    gap: 6,
  },
  adminBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 4,
  },
  adminBadgeDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1d4ed8',
  },
  adminBadgeText: {
    color: '#2563eb',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  loginSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  successBanner: {
    backgroundColor: '#15803d',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  successBannerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  formCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 18,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  sectionHeadingTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  labelLight: {
    color: '#334155',
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  inputLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    color: '#0f172a',
  },
  inputDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    color: '#f8fafc',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCol: {
    flex: 1,
    minWidth: 160,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  chipDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  modeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  modeTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  modeTabLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  modeTabDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  modeTabActive: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  modeTabText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  devicePickerBox: {
    marginVertical: 4,
  },
  uploadBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  uploadBtnLight: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  uploadBtnDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1d4ed8',
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  uploadBtnTextLight: {
    color: '#2563eb',
  },
  uploadBtnTextDark: {
    color: '#93c5fd',
  },
  presetScroll: {
    flexDirection: 'row',
  },
  presetCard: {
    width: 140,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#cbd5e1',
  },
  presetCardActive: {
    borderColor: '#2563eb',
  },
  presetImage: {
    width: '100%',
    height: 80,
  },
  presetLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    color: '#ffffff',
  },
  previewContainer: {
    marginTop: 8,
    gap: 4,
  },
  previewLabel: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  previewImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '800',
  },
  roomListGrid: {
    gap: 10,
  },
  adminRoomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  adminRoomThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  adminRoomTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  adminRoomSub: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteRoomBtn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteRoomBtnDark: {
    backgroundColor: '#331515',
    borderColor: '#7f1d1d',
  },
  deleteRoomBtnText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteRoomBtnTextDark: {
    color: '#fca5a5',
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
});
