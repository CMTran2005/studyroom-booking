import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  webWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  nativeLight: {
    backgroundColor: '#3D7EAE',
    borderColor: '#2b628b',
  },
  nativeDark: {
    backgroundColor: '#1D1F2C',
    borderColor: '#334155',
  },
  nativeCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  nativeCircleLight: {
    backgroundColor: '#ECCA2F',
  },
  nativeCircleDark: {
    backgroundColor: '#C4C9D1',
  },
  nativeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  textLight: {
    color: '#ffffff',
  },
  textDark: {
    color: '#ffffff',
  },
});
