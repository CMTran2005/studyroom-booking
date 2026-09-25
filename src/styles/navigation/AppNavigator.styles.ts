import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabBarLight: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
  },
  tabBarDark: {
    backgroundColor: '#0d1322',
    borderTopColor: '#1e2a42',
  },
  tabBarItem: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    lineHeight: 16,
    textAlign: 'center',
  },
});
