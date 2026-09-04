import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabBarLight: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
  },
  tabBarDark: {
    backgroundColor: '#0f172a',
    borderTopColor: '#1e293b',
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    margin: 0,
    padding: 0,
  },
});
