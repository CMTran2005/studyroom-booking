import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { isValidVkuEmail } from '../services';
import { ThemeSwitch } from '../components';
import { styles } from '../styles/screens/AuthScreen.styles';

export const AuthScreen: React.FC = () => {
  const { themeMode, loginUser, registerUser } = useBookingStore();
  const isDark = themeMode === 'dark';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    if (!isValidVkuEmail(trimmedEmail)) {
      setErrorMessage(
        'Quyền truy cập bị từ chối: Bắt buộc sử dụng tài khoản email nội bộ trường Đại học CNTT & TT Việt - Hàn có đuôi kết thúc bằng @vku.udn.vn (Ví dụ: student@vku.udn.vn hoặc ten.mssv@vku.udn.vn).'
      );
      return;
    }

    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu tài khoản.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await loginUser(trimmedEmail, password);
      } else {
        await registerUser(trimmedEmail, password, displayName);
      }
    } catch (err: any) {
      console.warn('[AuthScreen] submit error:', err);
      let userMsg = err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
      if (err.code === 'auth/configuration-not-found') {
        userMsg = '⚠️ Firebase Authentication chưa được bật trong Firebase Console! Vui lòng vào Firebase Console -> Authentication -> Bấm "Get Started" và bật "Email/Password".';
      } else if (err.code === 'auth/email-already-in-use') {
        userMsg = 'Email này đã tồn tại tài khoản. Vui lòng chuyển sang tab Đăng Nhập.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        userMsg = 'Email hoặc mật khẩu không chính xác.';
      } else if (err.code === 'auth/weak-password') {
        userMsg = 'Mật khẩu quá ngắn hoặc yếu. Vui lòng đặt tối thiểu 6 ký tự.';
      } else if (err.code === 'auth/user-not-found') {
        userMsg = 'Tài khoản không tồn tại. Vui lòng chọn tab Đăng Ký để tạo tài khoản mới.';
      }
      setErrorMessage(userMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = () => {
    setEmail('student@vku.udn.vn');
    setPassword('vku123456');
    setErrorMessage('');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@vku.udn.vn');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0b0f19' : '#ffffff'}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ position: 'absolute', top: 16, right: 20 }}>
          <ThemeSwitch />
        </View>

        <View style={[styles.authCard, isDark ? styles.cardDark : styles.cardLight]}>
          {/* Brand Header */}
          <View style={styles.logoRow}>
            <View style={[styles.logoBadge, isDark && styles.logoBadgeDark]}>
              <Ionicons
                name="school"
                size={28}
                color={isDark ? '#818cf8' : '#4f46e5'}
              />
            </View>
            <View style={[styles.vkuBadge, isDark && styles.vkuBadgeDark]}>
              <Text style={[styles.vkuBadgeText, isDark && styles.vkuBadgeTextDark]}>
                VKU SMART CAMPUS
              </Text>
            </View>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
              Hệ Thống Đặt Phòng Học
            </Text>
            <Text
              style={[styles.subtitle, isDark ? styles.subtextDark : styles.subtextLight]}
            >
              Cổng thông tin đặt phòng tự học, phòng lab và không gian làm việc nhóm
            </Text>
          </View>

          {/* Segment Toggle */}
          <View style={[styles.segmentTab, isDark ? styles.segmentTabDark : styles.segmentTabLight]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabBtn, mode === 'signin' && styles.tabBtnActive]}
              onPress={() => {
                setMode('signin');
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  isDark ? styles.textDark : styles.textLight,
                  mode === 'signin' && styles.tabTextActive,
                ]}
              >
                Đăng nhập
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabBtn, mode === 'signup' && styles.tabBtnActive]}
              onPress={() => {
                setMode('signup');
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  isDark ? styles.textDark : styles.textLight,
                  mode === 'signup' && styles.tabTextActive,
                ]}
              >
                Tạo tài khoản
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={[styles.errorBox, isDark && styles.errorBoxDark]}>
              <Ionicons
                name="alert-circle"
                size={18}
                color={isDark ? '#fca5a5' : '#ef4444'}
              />
              <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Display Name Input (Only on Sign Up) */}
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDark ? styles.subtextDark : styles.subtextLight,
                ]}
              >
                Họ và tên
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  isDark ? styles.inputWrapperDark : styles.inputWrapperLight,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={isDark ? '#64748b' : '#94a3b8'}
                />
                <TextInput
                  style={[
                    styles.input,
                    isDark ? styles.textDark : styles.textLight,
                    Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
                  ]}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                />
              </View>
            </View>
          )}

          {/* VKU Email Input */}
          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text
                style={[
                  styles.inputLabel,
                  isDark ? styles.subtextDark : styles.subtextLight,
                ]}
              >
                Email sinh viên / cán bộ VKU
              </Text>
              <View style={[styles.domainHint, isDark && styles.domainHintDark]}>
                <Text style={{ fontSize: 10.5, fontWeight: '700', color: isDark ? '#a5b4fc' : '#4f46e5' }}>
                  @vku.udn.vn
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.inputWrapper,
                isDark ? styles.inputWrapperDark : styles.inputWrapperLight,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={isDark ? '#64748b' : '#94a3b8'}
              />
              <TextInput
                style={[
                  styles.input,
                  isDark ? styles.textDark : styles.textLight,
                  Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
                ]}
                placeholder="ten.mssv@vku.udn.vn"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errorMessage) setErrorMessage('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.inputLabel,
                isDark ? styles.subtextDark : styles.subtextLight,
              ]}
            >
              Mật khẩu
            </Text>
            <View
              style={[
                styles.inputWrapper,
                isDark ? styles.inputWrapperDark : styles.inputWrapperLight,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={isDark ? '#64748b' : '#94a3b8'}
              />
              <TextInput
                style={[
                  styles.input,
                  isDark ? styles.textDark : styles.textLight,
                  Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
                ]}
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={isDark ? '#64748b' : '#94a3b8'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading}
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>
                  {mode === 'signin' ? 'Đăng nhập vào hệ thống' : 'Đăng ký tài khoản VKU'}
                </Text>
                <Ionicons name="arrow-forward" size={17} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Quick Demo Shortcuts */}
          <View style={styles.demoDivider}>
            <View style={[styles.dividerLine, isDark ? styles.dividerLineDark : styles.dividerLineLight]} />
            <Text style={[styles.dividerText, isDark ? styles.subtextDark : styles.subtextLight]}>
              Tài khoản mẫu thử nghiệm
            </Text>
            <View style={[styles.dividerLine, isDark ? styles.dividerLineDark : styles.dividerLineLight]} />
          </View>

          <View style={styles.demoBtnRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.demoBtn, isDark ? styles.demoBtnDark : styles.demoBtnLight]}
              onPress={handleDemoStudent}
            >
              <Ionicons name="person" size={14} color="#4f46e5" />
              <Text style={[styles.demoBtnText, isDark ? styles.textDark : styles.textLight]}>
                Sinh viên mẫu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.demoBtn, isDark ? styles.demoBtnDark : styles.demoBtnLight]}
              onPress={handleDemoAdmin}
            >
              <Ionicons name="shield-checkmark" size={14} color="#10b981" />
              <Text style={[styles.demoBtnText, isDark ? styles.textDark : styles.textLight]}>
                Admin mẫu
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.footerNote, isDark ? styles.subtextDark : styles.subtextLight]}
          >
            Dữ liệu tài khoản & quyền hạn được lưu trữ và đồng bộ hóa tự động qua Firebase Cloud Firestore.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
