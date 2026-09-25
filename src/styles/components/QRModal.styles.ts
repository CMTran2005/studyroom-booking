import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeRowDark: {
    backgroundColor: '#1e1b4b',
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 0.8,
  },
  badgeTextDark: {
    color: '#a5b4fc',
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoBox: {
    width: '100%',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    gap: 3,
  },
  infoLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  infoDark: {
    backgroundColor: '#0b0f19',
    borderColor: '#172136',
  },
  roomName: {
    fontSize: 15.5,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12.5,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4f46e5',
    marginTop: 2,
  },
  slotTextDark: {
    color: '#818cf8',
  },
  codeBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  codeBadgeDark: {
    backgroundColor: '#172136',
  },
  codeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  instruction: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 17,
  },
  closeBtn: {
    width: '100%',
    backgroundColor: '#4f46e5',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  closeBtnText: {
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
