import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../store/useBookingStore';
import { ThemeSwitch } from '../layout/ThemeSwitch';
import { COLORS } from '../../styles/theme';

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ visible, onClose }) => {
  const { currentUser, userRole, themeMode, bookings, logoutUser } = useBookingStore();
  const isDark = themeMode === 'dark';

  const activeBookingsCount = bookings.filter((b) => b.status !== 'cancelled').length;

  const handleLogout = () => {
    const doLogout = async () => {
      onClose();
      await logoutUser();
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản VKU?')) {
        doLogout();
      }
    } else {
      Alert.alert(
        'Đăng xuất',
        'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản VKU Smart Study?',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Đăng xuất',
            style: 'destructive',
            onPress: doLogout,
          },
        ]
      );
    }
  };

  const initial =
    currentUser?.displayName?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    'U';

  const isAdmin = userRole === 'admin';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, isDark ? styles.cardDark : styles.cardLight]}>
              {/* Header with Close Button */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalHeaderTitle, isDark ? styles.textDark : styles.textLight]}>
                  Hồ Sơ Tài Khoản
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  style={[styles.closeBtn, isDark && styles.closeBtnDark]}
                >
                  <Ionicons name="close" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                </TouchableOpacity>
              </View>

              {/* User Avatar & Info */}
              <View style={styles.profileSection}>
                <View
                  style={[
                    styles.avatarWrapper,
                    isAdmin ? styles.avatarAdmin : styles.avatarStudent,
                  ]}
                >
                  <Text style={styles.avatarText}>{initial}</Text>
                  <View
                    style={[
                      styles.roleDot,
                      { backgroundColor: isAdmin ? '#8b5cf6' : '#3b82f6' },
                    ]}
                  >
                    <Ionicons
                      name={isAdmin ? 'shield' : 'school'}
                      size={11}
                      color="#ffffff"
                    />
                  </View>
                </View>

                <Text style={[styles.userName, isDark ? styles.textDark : styles.textLight]}>
                  {currentUser?.displayName || 'Sinh viên VKU'}
                </Text>
                <Text style={[styles.userEmail, isDark ? styles.subtextDark : styles.subtextLight]}>
                  {currentUser?.email || 'Chưa xác thực'}
                </Text>

                {/* Role Pill */}
                <View
                  style={[
                    styles.roleBadge,
                    isAdmin
                      ? isDark
                        ? styles.roleAdminDark
                        : styles.roleAdminLight
                      : isDark
                      ? styles.roleStudentDark
                      : styles.roleStudentLight,
                  ]}
                >
                  <Ionicons
                    name={isAdmin ? 'shield-checkmark' : 'school-outline'}
                    size={14}
                    color={isAdmin ? (isDark ? '#c084fc' : '#7c3aed') : (isDark ? '#93c5fd' : '#2563eb')}
                  />
                  <Text
                    style={[
                      styles.roleBadgeText,
                      {
                        color: isAdmin
                          ? isDark
                            ? '#c084fc'
                            : '#7c3aed'
                          : isDark
                          ? '#93c5fd'
                          : '#2563eb',
                      },
                    ]}
                  >
                    {isAdmin ? 'Quản trị viên hệ thống' : 'Sinh viên VKU'}
                  </Text>
                </View>
              </View>

              {/* Stats & Theme Row */}
              <View style={[styles.infoRow, isDark ? styles.infoRowDark : styles.infoRowLight]}>
                <View style={styles.statCol}>
                  <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
                    {activeBookingsCount}
                  </Text>
                  <Text style={[styles.statLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                    Lịch đặt
                  </Text>
                </View>

                <View style={[styles.statDivider, isDark && styles.dividerDark]} />

                <View style={styles.statCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={styles.activeDot} />
                    <Text style={[styles.statValue, { fontSize: 13, color: '#10b981' }]}>
                      Firebase
                    </Text>
                  </View>
                  <Text style={[styles.statLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                    Đồng bộ Cloud
                  </Text>
                </View>

                <View style={[styles.statDivider, isDark && styles.dividerDark]} />

                <View style={styles.statCol}>
                  <ThemeSwitch />
                </View>
              </View>

              {/* Security Notice */}
              <View style={[styles.noticeBox, isDark ? styles.noticeBoxDark : styles.noticeBoxLight]}>
                <Ionicons
                  name="shield-outline"
                  size={15}
                  color={isDark ? '#94a3b8' : '#64748b'}
                />
                <Text style={[styles.noticeText, isDark ? styles.subtextDark : styles.subtextLight]}>
                  Phân quyền tài khoản được bảo mật và quản lý tập trung trên Firebase Cloud.
                </Text>
              </View>

              {/* Logout Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.logoutBtn}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={19} color="#ffffff" />
                <Text style={styles.logoutBtnText}>Đăng Xuất Tài Khoản</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDark: {
    backgroundColor: '#334155',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  avatarStudent: {
    backgroundColor: '#2563eb',
  },
  avatarAdmin: {
    backgroundColor: '#7c3aed',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  roleDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleStudentLight: {
    backgroundColor: '#eff6ff',
  },
  roleStudentDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },
  roleAdminLight: {
    backgroundColor: '#faf5ff',
  },
  roleAdminDark: {
    backgroundColor: 'rgba(124, 58, 237, 0.18)',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  infoRowLight: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRowDark: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#cbd5e1',
  },
  dividerDark: {
    backgroundColor: '#334155',
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  noticeBoxLight: {
    backgroundColor: '#f8fafc',
  },
  noticeBoxDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  noticeText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 15,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    paddingVertical: 13,
    borderRadius: 14,
  },
  logoutBtnText: {
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
