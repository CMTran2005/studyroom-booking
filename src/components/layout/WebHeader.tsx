import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../store/useBookingStore';
import { ThemeSwitch } from './ThemeSwitch';

interface WebHeaderProps {
  currentTab: 'Explore' | 'MyBookings' | 'Admin';
  onNavigateTab: (tab: 'Explore' | 'MyBookings' | 'Admin') => void;
}

export const WebHeader: React.FC<WebHeaderProps> = ({ currentTab, onNavigateTab }) => {
  const { themeMode, currentUser, userRole, bookings, logoutUser } = useBookingStore();
  const isDark = themeMode === 'dark';

  const activeBookingsCount = bookings.filter((b) => b.status !== 'cancelled').length;

  return (
    <View style={[styles.headerContainer, isDark ? styles.headerDark : styles.headerLight]}>
      <View style={styles.headerInner}>
        {/* Brand Left */}
        <TouchableOpacity
          style={styles.brandRow}
          activeOpacity={0.8}
          onPress={() => onNavigateTab('Explore')}
        >
          <View style={[styles.logoBadge, isDark && styles.logoBadgeDark]}>
            <Ionicons name="school" size={20} color={isDark ? '#818cf8' : '#4f46e5'} />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.brandTitle, isDark ? styles.textDark : styles.textLight]}>
                VKU Smart Study
              </Text>
              <View style={[styles.campusBadge, isDark && styles.campusBadgeDark]}>
                <Text style={[styles.campusBadgeText, isDark && styles.campusBadgeTextDark]}>
                  CAMPUS
                </Text>
              </View>
            </View>
            <Text style={[styles.brandSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
              Hệ thống Đặt phòng học & Không gian làm việc nhóm
            </Text>
          </View>
        </TouchableOpacity>

        {/* Center Nav Links */}
        <View style={styles.navLinksRow}>
          <TouchableOpacity
            style={[styles.navLinkItem, currentTab === 'Explore' && styles.navLinkActive]}
            onPress={() => onNavigateTab('Explore')}
          >
            <Ionicons
              name={currentTab === 'Explore' ? 'compass' : 'compass-outline'}
              size={17}
              color={currentTab === 'Explore' ? '#ffffff' : isDark ? '#94a3b8' : '#475569'}
            />
            <Text
              style={[
                styles.navLinkText,
                isDark ? styles.textDark : styles.textLight,
                currentTab === 'Explore' && styles.navLinkTextActive,
              ]}
            >
              Khám phá phòng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navLinkItem, currentTab === 'MyBookings' && styles.navLinkActive]}
            onPress={() => onNavigateTab('MyBookings')}
          >
            <Ionicons
              name={currentTab === 'MyBookings' ? 'calendar' : 'calendar-outline'}
              size={17}
              color={currentTab === 'MyBookings' ? '#ffffff' : isDark ? '#94a3b8' : '#475569'}
            />
            <Text
              style={[
                styles.navLinkText,
                isDark ? styles.textDark : styles.textLight,
                currentTab === 'MyBookings' && styles.navLinkTextActive,
              ]}
            >
              Lịch của tôi
            </Text>
            {activeBookingsCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{activeBookingsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {userRole === 'admin' && (
            <TouchableOpacity
              style={[styles.navLinkItem, currentTab === 'Admin' && styles.navLinkActive]}
              onPress={() => onNavigateTab('Admin')}
            >
              <Ionicons
                name={currentTab === 'Admin' ? 'shield-checkmark' : 'shield-checkmark-outline'}
                size={17}
                color={currentTab === 'Admin' ? '#ffffff' : isDark ? '#94a3b8' : '#475569'}
              />
              <Text
                style={[
                  styles.navLinkText,
                  isDark ? styles.textDark : styles.textLight,
                  currentTab === 'Admin' && styles.navLinkTextActive,
                ]}
              >
                Quản trị (Admin)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right User Bar */}
        <View style={styles.rightActionsRow}>
          {/* User Profile Badge */}
          {currentUser && (
            <View style={[styles.userChip, isDark ? styles.userChipDark : styles.userChipLight]}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
              <View style={{ marginRight: 6 }}>
                <Text
                  style={[styles.userEmail, isDark ? styles.textDark : styles.textLight]}
                  numberOfLines={1}
                >
                  {currentUser.email}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View
                    style={[
                      styles.roleTag,
                      userRole === 'admin' ? styles.roleAdmin : styles.roleStudent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTagText,
                        userRole === 'admin' ? styles.roleAdminText : styles.roleStudentText,
                      ]}
                    >
                      {userRole === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <ThemeSwitch />

          {/* Logout Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.logoutBtn, isDark && styles.logoutBtnDark]}
            onPress={logoutUser}
          >
            <Ionicons name="log-out-outline" size={16} color={isDark ? '#fca5a5' : '#ef4444'} />
            <Text style={[styles.logoutBtnText, isDark && styles.logoutBtnTextDark]}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    borderBottomWidth: 1,
    paddingVertical: 10,
    zIndex: 100,
  },
  headerLight: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e8f0',
  },
  headerDark: {
    backgroundColor: '#0d1322',
    borderBottomColor: '#1e2a42',
  },
  headerInner: {
    width: '100%',
    maxWidth: 1400,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  logoBadgeDark: {
    backgroundColor: '#1e1b4b',
    borderColor: '#3730a3',
  },
  brandTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  campusBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  campusBadgeDark: {
    backgroundColor: '#1e293b',
  },
  campusBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#4f46e5',
  },
  campusBadgeTextDark: {
    color: '#a5b4fc',
  },
  brandSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  navLinkActive: {
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  navLinkText: {
    fontSize: 13,
    fontWeight: '700',
  },
  navLinkTextActive: {
    color: '#ffffff',
  },
  tabBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    marginLeft: 4,
  },
  tabBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  userChipLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  userChipDark: {
    backgroundColor: '#131b2e',
    borderColor: '#1e2a42',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 160,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  roleStudent: {
    backgroundColor: '#eef2ff',
  },
  roleAdmin: {
    backgroundColor: '#ecfdf5',
  },
  roleTagText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  roleStudentText: {
    color: '#4f46e5',
  },
  roleAdminText: {
    color: '#059669',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutBtnDark: {
    backgroundColor: '#450a0a',
    borderColor: '#7f1d1d',
  },
  logoutBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtnTextDark: {
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
    color: '#94a3b8',
  },
});
