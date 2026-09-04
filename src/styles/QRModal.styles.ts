import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
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
  qrContainer: {
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  infoBox: {
    width: '100%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
  },
  infoLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#f1f5f9',
  },
  infoDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  roomName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12.5,
    marginTop: 2,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  slotTextLight: {
    color: '#2563eb',
  },
  slotTextDark: {
    color: '#60a5fa',
  },
  codeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 4,
  },
  instruction: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 17,
  },
  closeBtn: {
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
