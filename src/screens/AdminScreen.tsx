import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Building, Equipment, UserProfile, UserRole } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { WebHeader, ThemeSwitch } from '../components';
import { fetchAllUsers } from '../services';
import { styles } from '../styles/screens/AdminScreen.styles';

const BUILDINGS: Building[] = ['A', 'B', 'C', 'V'];
const EQUIPMENTS: Equipment[] = ['Projector', 'Whiteboard', 'High-spec PC', 'AC'];

const PRESET_IMAGES = [
  { label: 'AI & Data Lab', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop' },
  { label: 'Group Study Room', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop' },
  { label: 'Tech Innovation Hub', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop' },
  { label: 'Quiet Research Pod', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop' },
];

export const AdminScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;

  const {
    themeMode,
    currentUser,
    userRole,
    updateUserRole,
    addRoom,
    deleteRoom,
    rooms,
    bookings,
    checkInBooking,
    logoutUser,
  } = useBookingStore();
  const isDark = themeMode === 'dark';

  const [activeAdminTab, setActiveAdminTab] = useState<'rooms' | 'users' | 'checkin'>('rooms');

  // Add Room Form State
  const [name, setName] = useState('');
  const [building, setBuilding] = useState<Building>('A');
  const [floor, setFloor] = useState('1');
  const [capacity, setCapacity] = useState('10');
  const [selectedEquipments, setSelectedEquipments] = useState<Equipment[]>(['Whiteboard', 'AC']);
  const [imageMode, setImageMode] = useState<'preset' | 'url' | 'device'>('preset');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Users Management State
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Check-in Tool State
  const [checkInCode, setCheckInCode] = useState('');
  const [checkInMsg, setCheckInMsg] = useState('');

  const isActuallyAdmin = userRole === 'admin' || currentUser?.role === 'admin';

  useEffect(() => {
    if (activeAdminTab === 'users' && isActuallyAdmin) {
      loadUsers();
    }
  }, [activeAdminTab, isActuallyAdmin]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await fetchAllUsers();
      setUserList(users);
    } catch (e) {
      console.warn('Failed to load users:', e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUserRole = async (user: UserProfile) => {
    const newRole: UserRole = user.role === 'admin' ? 'student' : 'admin';
    const success = await updateUserRole(user.uid, newRole);
    if (success) {
      setUserList((prev) =>
        prev.map((u) => (u.uid === user.uid ? { ...u, role: newRole } : u))
      );
      const msg = `Đã cập nhật vai trò cho ${user.email} thành [${newRole}] trên Firebase!`;
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Thành công', msg);
    }
  };

  const pickImageFromDevice = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        const msg = 'Cần cấp quyền truy cập thư viện ảnh để tải ảnh!';
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Yêu cầu cấp quyền', msg);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUrl(result.assets[0].uri);
        setImageMode('device');
      }
    } catch (err) {
      console.log('Image picker error:', err);
    }
  };

  const toggleEquipment = (eq: Equipment) => {
    if (selectedEquipments.includes(eq)) {
      setSelectedEquipments(selectedEquipments.filter((e) => e !== eq));
    } else {
      setSelectedEquipments([...selectedEquipments, eq]);
    }
  };

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      const msg = 'Vui lòng nhập tên phòng học hợp lệ.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Thiếu thông tin', msg);
      return;
    }

    if (!description.trim()) {
      const msg = 'Vui lòng nhập mô tả chi tiết phòng học.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Thiếu thông tin', msg);
      return;
    }

    if (!imageUrl.trim()) {
      const msg = 'Vui lòng chọn hoặc cung cấp đường dẫn ảnh.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Thiếu ảnh', msg);
      return;
    }

    const parsedFloor = parseInt(floor, 10) || 1;
    const parsedCapacity = parseInt(capacity, 10) || 10;

    const newRoom = await addRoom({
      name: name.trim(),
      building,
      floor: parsedFloor,
      capacity: parsedCapacity,
      equipments: selectedEquipments,
      image: imageUrl.trim(),
      isAvailableNow: true,
      description: description.trim(),
    });

    setSuccessMessage(`Đã thêm phòng "${newRoom.name}" và đồng bộ lên Firebase!`);

    setName('');
    setDescription('');
    setFloor('1');
    setCapacity('10');

    setTimeout(() => {
      setSuccessMessage('');
    }, 2500);
  };

  const handleDeleteRoomPrompt = (roomId: string, roomName: string) => {
    const doDelete = async () => {
      await deleteRoom(roomId);
    };

    if (Platform.OS === 'web') {
      if (confirm(`Bạn có chắc chắn muốn xóa phòng "${roomName}" khỏi hệ thống Firebase?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Xóa phòng học',
        `Bạn có chắc chắn muốn xóa "${roomName}"?`,
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đồng ý xóa', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  const handleManualCheckIn = async () => {
    setCheckInMsg('');
    const code = checkInCode.trim();
    if (!code) {
      setCheckInMsg('Vui lòng nhập mã thẻ Pass Code hoặc mã ID lượt đặt.');
      return;
    }

    const booking = bookings.find(
      (b) => b.id.toLowerCase() === code.toLowerCase() || b.qrCodeValue.toLowerCase() === code.toLowerCase()
    );

    if (!booking) {
      setCheckInMsg('Không tìm thấy lượt đặt phòng nào với mã số này.');
      return;
    }

    if (booking.status === 'checked_in') {
      setCheckInMsg(`Vé này đã được check-in trước đó vào lúc ${booking.checkedInAt || 'hôm nay'}.`);
      return;
    }

    await checkInBooking(booking.id);
    setCheckInMsg(`✓ Check-in thành công cho sinh viên ${booking.userEmail} tại phòng ${booking.roomName}!`);
    setCheckInCode('');
  };

  // ==================== SCREEN CONTENT 1: PERMISSION GATEWAY ====================
  if (!isActuallyAdmin) {
    return (
      <ScrollView
        style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}
        contentContainerStyle={styles.centerScrollContent}
      >
        {isDesktop && (
          <View style={{ width: '100%', position: 'absolute', top: 0, left: 0, right: 0 }}>
            <WebHeader
              currentTab="Admin"
              onNavigateTab={(tab) => {
                if (tab === 'Explore') {
                  (navigation as any).navigate('Explore', { screen: 'HomeScreen' });
                } else if (tab === 'MyBookings') {
                  (navigation as any).navigate('MyBookingsTab');
                }
              }}
            />
          </View>
        )}

        <View style={[styles.loginCard, isDark ? styles.cardDark : styles.cardLight, { marginTop: isDesktop ? 60 : 0 }]}>
          <View style={styles.loginHeader}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#fee2e2',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Ionicons name="lock-closed" size={28} color="#ef4444" />
            </View>
            <Text style={[styles.loginTitle, isDark ? styles.textDark : styles.textLight]}>
              Khu Vực Quản Trị Hệ Thống
            </Text>
            <Text
              style={[
                styles.loginSubtitle,
                isDark ? styles.subtextDark : styles.subtextLight,
                { textAlign: 'center', marginTop: 8, lineHeight: 20 },
              ]}
            >
              Tài khoản ({currentUser?.email}) hiện đang có quyền [Sinh viên]. Chức năng quản lý phòng học và phân quyền người dùng chỉ dành cho Ban Quản trị được thiết lập bảo mật trên Cloud Firestore.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }]}
            onPress={() => (navigation as any).navigate('Explore', { screen: 'HomeScreen' })}
          >
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
            <Text style={styles.submitBtnText}>Quay lại Khám phá phòng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ==================== SCREEN CONTENT 2: ADMIN PORTAL DASHBOARD ====================
  return (
    <ScrollView
      style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}
      contentContainerStyle={styles.scrollContent}
    >
      {isDesktop && (
        <View style={{ width: '100%', marginBottom: 16 }}>
          <WebHeader
            currentTab="Admin"
            onNavigateTab={(tab) => {
              if (tab === 'Explore') {
                (navigation as any).navigate('Explore', { screen: 'HomeScreen' });
              } else if (tab === 'MyBookings') {
                (navigation as any).navigate('MyBookingsTab');
              }
            }}
          />
        </View>
      )}

      <View style={[styles.innerContent, isDesktop && styles.innerContentWide]}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
              Cổng Quản Trị Viên VKU
            </Text>
            <Text
              style={[styles.headerSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}
            >
              Quản trị viên: {currentUser?.email} • Đồng bộ Firebase Cloud
            </Text>
          </View>

          <View style={styles.headerRightRow}>
            <ThemeSwitch />
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.customLogoutBtn, isDark && styles.customLogoutBtnDark]}
              onPress={logoutUser}
            >
              <Text style={[styles.customLogoutBtnText, isDark && styles.customLogoutBtnTextDark]}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sub Navigation Tabs */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 20,
            borderRadius: 14,
            padding: 4,
            backgroundColor: isDark ? '#131b2e' : '#f1f5f9',
            borderWidth: 1,
            borderColor: isDark ? '#1e2a42' : '#e2e8f0',
          }}
        >
          <TouchableOpacity
            style={[
              { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
              activeAdminTab === 'rooms' && { backgroundColor: '#4f46e5' },
            ]}
            onPress={() => setActiveAdminTab('rooms')}
          >
            <Ionicons
              name="business"
              size={16}
              color={activeAdminTab === 'rooms' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: activeAdminTab === 'rooms' ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a',
              }}
            >
              Quản lý Phòng ({rooms.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
              activeAdminTab === 'users' && { backgroundColor: '#4f46e5' },
            ]}
            onPress={() => setActiveAdminTab('users')}
          >
            <Ionicons
              name="people"
              size={16}
              color={activeAdminTab === 'users' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: activeAdminTab === 'users' ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a',
              }}
            >
              Phân quyền Role Firebase
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
              activeAdminTab === 'checkin' && { backgroundColor: '#4f46e5' },
            ]}
            onPress={() => setActiveAdminTab('checkin')}
          >
            <Ionicons
              name="qr-code"
              size={16}
              color={activeAdminTab === 'checkin' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: activeAdminTab === 'checkin' ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a',
              }}
            >
              Quét Check-in Nhận phòng
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: QUẢN LÝ PHÒNG HỌC */}
        {activeAdminTab === 'rooms' && (
          <View>
            {/* Create Room Form */}
            <View style={[styles.createCard, isDark ? styles.cardDark : styles.cardLight]}>
              <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>
                Thêm Không Gian Học Tập Mới
              </Text>
              <Text style={[styles.cardSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
                Tạo phòng học, phòng lab AI hoặc không gian làm việc nhóm lên hệ thống Firebase
              </Text>

              {successMessage ? (
                <View style={styles.successBanner}>
                  <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                  <Text style={styles.successBannerText}>{successMessage}</Text>
                </View>
              ) : null}

              {/* Room Name */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                  Tên phòng học
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isDark ? styles.inputDark : styles.inputLight,
                    Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
                  ]}
                  placeholder="Ví dụ: Phòng V.502 - Smart AI Workstation Lab"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                />
              </View>

              {/* Building & Floor */}
              <View style={styles.rowTwoCols}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                    Tòa nhà
                  </Text>
                  <View style={styles.chipRow}>
                    {BUILDINGS.map((b) => (
                      <TouchableOpacity
                        key={b}
                        style={[
                          styles.buildingChip,
                          isDark ? styles.chipDark : styles.chipLight,
                          building === b && styles.buildingChipActive,
                        ]}
                        onPress={() => setBuilding(b)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isDark ? styles.textDark : styles.textLight,
                            building === b && styles.chipTextActive,
                          ]}
                        >
                          Khu {b}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                    Tầng lầu
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      isDark ? styles.inputDark : styles.inputLight,
                      Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
                    ]}
                    value={floor}
                    onChangeText={setFloor}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  />
                </View>
              </View>

              {/* Capacity */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                  Sức chứa (Số chỗ ngồi)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isDark ? styles.inputDark : styles.inputLight,
                    Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
                  ]}
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                />
              </View>

              {/* Equipments */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                  Trang thiết bị sẵn có
                </Text>
                <View style={styles.chipRow}>
                  {EQUIPMENTS.map((eq) => {
                    const isSelected = selectedEquipments.includes(eq);
                    return (
                      <TouchableOpacity
                        key={eq}
                        style={[
                          styles.equipmentChip,
                          isDark ? styles.chipDark : styles.chipLight,
                          isSelected && styles.equipmentChipActive,
                        ]}
                        onPress={() => toggleEquipment(eq)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isDark ? styles.textDark : styles.textLight,
                            isSelected && styles.chipTextActive,
                          ]}
                        >
                          {isSelected ? '✓ ' : ''}{eq}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Image Picker */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                  Hình ảnh đại diện phòng
                </Text>
                <View style={styles.chipRow}>
                  {PRESET_IMAGES.map((preset) => (
                    <TouchableOpacity
                      key={preset.label}
                      style={[
                        styles.presetChip,
                        isDark ? styles.chipDark : styles.chipLight,
                        imageUrl === preset.url && styles.presetChipActive,
                      ]}
                      onPress={() => {
                        setImageUrl(preset.url);
                        setImageMode('preset');
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isDark ? styles.textDark : styles.textLight,
                          imageUrl === preset.url && styles.chipTextActive,
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.devicePickerBtn, isDark && styles.devicePickerBtnDark]}
                    onPress={pickImageFromDevice}
                  >
                    <Ionicons name="camera" size={14} color="#4f46e5" />
                    <Text style={styles.devicePickerBtnText}>Tải từ thiết bị</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, isDark ? styles.subtextDark : styles.subtextLight]}>
                  Mô tả chi tiết phòng học
                </Text>
                <TextInput
                  style={[
                    styles.textArea,
                    isDark ? styles.inputDark : styles.inputLight,
                    Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
                  ]}
                  placeholder="Mô tả thông số máy tính, môi trường học tập..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                />
              </View>

              <TouchableOpacity style={styles.createBtn} onPress={handleCreateRoom}>
                <Ionicons name="add-circle" size={18} color="#ffffff" />
                <Text style={styles.createBtnText}>Lưu & Đăng tải Phòng Học lên Firebase</Text>
              </TouchableOpacity>
            </View>

            {/* Existing Rooms List */}
            <View style={{ marginTop: 24 }}>
              <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
                Danh sách phòng hiện có ({rooms.length})
              </Text>
              <View style={{ gap: 12, marginTop: 10 }}>
                {rooms.map((room) => (
                  <View
                    key={room.id}
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 14,
                        borderRadius: 14,
                        borderWidth: 1,
                      },
                      isDark
                        ? { backgroundColor: '#131b2e', borderColor: '#1e2a42' }
                        : { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                    ]}
                  >
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text
                        style={[{ fontSize: 15, fontWeight: '700' }, isDark ? styles.textDark : styles.textLight]}
                      >
                        {room.name}
                      </Text>
                      <Text
                        style={[{ fontSize: 12 }, isDark ? styles.subtextDark : styles.subtextLight]}
                      >
                        Tòa {room.building} • Tầng {room.floor} • Sức chứa {room.capacity} chỗ
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 8,
                        backgroundColor: '#fef2f2',
                        borderWidth: 1,
                        borderColor: '#fecaca',
                      }}
                      onPress={() => handleDeleteRoomPrompt(room.id, room.name)}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#ef4444' }}>
                        Xóa phòng
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: QUẢN LÝ PHÂN QUYỀN ROLE TRỰC TIẾP FIREBASE */}
        {activeAdminTab === 'users' && (
          <View style={[styles.createCard, isDark ? styles.cardDark : styles.cardLight]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>
                  Quản Lý Phân Quyền Người Dùng
                </Text>
                <Text style={[styles.cardSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
                  Dữ liệu được lưu trữ tại Firestore `users/&#123;uid&#125;`. Bạn có thể thay đổi Role tài khoản bất kỳ trực tiếp tại đây!
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 10,
                  backgroundColor: '#eef2ff',
                }}
                onPress={loadUsers}
              >
                <Ionicons name="refresh" size={14} color="#4f46e5" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#4f46e5' }}>Tải lại</Text>
              </TouchableOpacity>
            </View>

            {loadingUsers ? (
              <ActivityIndicator size="small" color="#4f46e5" style={{ paddingVertical: 20 }} />
            ) : (
              <View style={{ gap: 10 }}>
                {userList.map((user) => (
                  <View
                    key={user.uid}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
                      borderColor: isDark ? '#1e2a42' : '#e2e8f0',
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text
                        style={[{ fontSize: 14, fontWeight: '700' }, isDark ? styles.textDark : styles.textLight]}
                      >
                        {user.displayName || user.email.split('@')[0]}
                      </Text>
                      <Text
                        style={[{ fontSize: 12 }, isDark ? styles.subtextDark : styles.subtextLight]}
                      >
                        {user.email}
                      </Text>
                      <View
                        style={{
                          alignSelf: 'flex-start',
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                          borderRadius: 6,
                          marginTop: 4,
                          backgroundColor: user.role === 'admin' ? '#ecfdf5' : '#eef2ff',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '800',
                            color: user.role === 'admin' ? '#059669' : '#4f46e5',
                          }}
                        >
                          Quyền hiện tại: {user.role === 'admin' ? 'Quản trị viên (admin)' : 'Sinh viên (student)'}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 10,
                        backgroundColor: user.role === 'admin' ? '#fef2f2' : '#ecfdf5',
                        borderWidth: 1,
                        borderColor: user.role === 'admin' ? '#fecaca' : '#a7f3d0',
                      }}
                      onPress={() => handleToggleUserRole(user)}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: user.role === 'admin' ? '#ef4444' : '#059669',
                        }}
                      >
                        {user.role === 'admin' ? 'Chuyển về Sinh viên' : 'Nâng cấp thành Admin'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* TAB 3: CHECK-IN QUÉT MÃ QR NHẬN PHÒNG */}
        {activeAdminTab === 'checkin' && (
          <View style={[styles.createCard, isDark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>
              Công Cụ Check-In Nhận Phòng Học
            </Text>
            <Text style={[styles.cardSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
              Nhập mã Pass Code hoặc mã số thẻ QR của sinh viên khi đến nhận phòng để xác nhận
            </Text>

            {checkInMsg ? (
              <View
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: checkInMsg.startsWith('✓') ? '#ecfdf5' : '#fef2f2',
                  borderWidth: 1,
                  borderColor: checkInMsg.startsWith('✓') ? '#a7f3d0' : '#fecaca',
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: checkInMsg.startsWith('✓') ? '#059669' : '#ef4444',
                  }}
                >
                  {checkInMsg}
                </Text>
              </View>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              <TextInput
                style={[
                  styles.textInput,
                  { flex: 1 },
                  isDark ? styles.inputDark : styles.inputLight,
                  Platform.OS === 'web' && ({ outlineStyle: 'none', outlineWidth: 0 } as any),
                ]}
                placeholder="Nhập mã thẻ pass (VD: BOOK-1727...)"
                value={checkInCode}
                onChangeText={setCheckInCode}
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#4f46e5',
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleManualCheckIn}
              >
                <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }}>
                  Xác nhận Check-in
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight, { marginBottom: 10 }]}>
              Danh sách lượt đặt phòng đang chờ check-in ({bookings.filter((b) => b.status === 'confirmed').length})
            </Text>

            <View style={{ gap: 10 }}>
              {bookings
                .filter((b) => b.status === 'confirmed')
                .slice(0, 10)
                .map((b) => (
                  <View
                    key={b.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
                      borderWidth: 1,
                      borderColor: isDark ? '#1e2a42' : '#e2e8f0',
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={[{ fontSize: 14, fontWeight: '700' }, isDark ? styles.textDark : styles.textLight]}>
                        {b.roomName} • {b.slotTime}
                      </Text>
                      <Text style={[{ fontSize: 12 }, isDark ? styles.subtextDark : styles.subtextLight]}>
                        SV: {b.userEmail} • Ngày: {b.date} • Mã: {b.id}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 8,
                        backgroundColor: '#10b981',
                      }}
                      onPress={async () => {
                        await checkInBooking(b.id);
                        setCheckInMsg(`✓ Đã check-in thành công cho ${b.userEmail}!`);
                      }}
                    >
                      <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>
                        Check-in ngay
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
