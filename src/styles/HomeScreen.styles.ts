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
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerContentWrapper: {
    width: '100%',
    maxWidth: 1400,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adminPortalBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  adminPortalBtnLight: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  adminPortalBtnDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  adminPortalBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  headerLight: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#f1f5f9',
  },
  headerDark: {
    backgroundColor: '#0f172a',
    borderBottomColor: '#1e293b',
  },
  vkuBadge: {
    backgroundColor: '#eff6ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 4,
  },
  vkuBadgeDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1d4ed8',
  },
  vkuBadgeText: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vkuBadgeTextDark: {
    color: '#93c5fd',
  },
  welcomeText: {
    fontSize: 19,
    fontWeight: '800',
  },
  subtitleText: {
    fontSize: 12,
    marginTop: 1,
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
  feedWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1400,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 16,
    justifyContent: 'flex-start',
  },
  emptyState: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  resetBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
