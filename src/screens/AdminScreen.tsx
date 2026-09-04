import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Building, Equipment } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { styles } from '../styles/AdminScreen.styles';

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
  const isWideScreen = width >= 768;

  const { themeMode, isAdminLoggedIn, adminEmail, loginAdmin, logoutAdmin, addRoom, deleteRoom, rooms } = useBookingStore();
  const isDark = themeMode === 'dark';

  // Admin Login Form State - Blank initial email and no passcode hints
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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

  const handleAdminLogin = () => {
    setLoginError('');
    if (!inputEmail.trim()) {
      setLoginError('Please enter admin email address.');
      return;
    }
    if (!inputPassword) {
      setLoginError('Please enter passcode.');
      return;
    }

    const success = loginAdmin(inputPassword);
    if (!success) {
      setLoginError('Authentication failed. Invalid passcode.');
    } else {
      setInputPassword('');
    }
  };

  const pickImageFromDevice = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        const msg = 'Permission to access media library is required!';
        if (Platform.OS === 'web') alert(msg); else Alert.alert('Permission Required', msg);
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

  const handleCreateRoom = () => {
    if (!name.trim()) {
      const msg = 'Please enter a valid room name.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Missing Field', msg);
      return;
    }

    if (!description.trim()) {
      const msg = 'Please enter a room description.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Missing Field', msg);
      return;
    }

    if (!imageUrl.trim()) {
      const msg = 'Please select or provide a thumbnail image.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Missing Image', msg);
      return;
    }

    const parsedFloor = parseInt(floor, 10) || 1;
    const parsedCapacity = parseInt(capacity, 10) || 10;

    const newRoom = addRoom({
      name: name.trim(),
      building,
      floor: parsedFloor,
      capacity: parsedCapacity,
      equipments: selectedEquipments,
      image: imageUrl.trim(),
      isAvailableNow: true,
      description: description.trim(),
    });

    setSuccessMessage(`Room "${newRoom.name}" created successfully!`);

    // Reset Form
    setName('');
    setDescription('');
    setFloor('1');
    setCapacity('10');

    setTimeout(() => {
      setSuccessMessage('');
      navigation.navigate('HomeScreen');
    }, 1500);
  };

  const handleDeleteRoomPrompt = (roomId: string, roomName: string) => {
    if (Platform.OS === 'web') {
      if (confirm(`Are you sure you want to delete room "${roomName}"?`)) {
        deleteRoom(roomId);
      }
    } else {
      Alert.alert(
        'Delete Room',
        `Are you sure you want to delete "${roomName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteRoom(roomId) },
        ]
      );
    }
  };

  // ==================== SCREEN CONTENT 1: ADMIN LOGIN GATEWAY ====================
  if (!isAdminLoggedIn) {
    return (
      <ScrollView
        style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}
        contentContainerStyle={styles.centerScrollContent}
      >
        <View style={[styles.loginCard, isDark ? styles.cardDark : styles.cardLight]}>
          {/* Back to App Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backLinkBtn}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={[styles.backLinkText, isDark ? styles.subtextDark : styles.subtextLight]}>
              ← Return to App
            </Text>
          </TouchableOpacity>

          <View style={styles.loginHeader}>
            <View style={[styles.adminBadge, isDark && styles.adminBadgeDark]}>
              <Text style={styles.adminBadgeText}>VKU ADMINISTRATION</Text>
            </View>
            <Text style={[styles.loginTitle, isDark ? styles.textDark : styles.textLight]}>
              Admin Portal Access
            </Text>
            <Text style={[styles.loginSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
              Enter authorized administrator credentials to manage study rooms.
            </Text>
          </View>

          {loginError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{loginError}</Text>
            </View>
          ) : null}

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Admin Email</Text>
            <TextInput
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
              ]}
              placeholder="admin@vku.udn.vn"
              placeholderTextColor="#94a3b8"
              value={inputEmail}
              onChangeText={setInputEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Passcode</Text>
            <TextInput
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
              ]}
              secureTextEntry
              placeholder="Enter passcode"
              placeholderTextColor="#94a3b8"
              value={inputPassword}
              onChangeText={setInputPassword}
              onSubmitEditing={handleAdminLogin}
            />
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.primaryBtn} onPress={handleAdminLogin}>
            <Text style={styles.primaryBtnText}>Sign In to Admin Portal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ==================== SCREEN CONTENT 2: ADMIN DASHBOARD & ADD ROOM FORM ====================
  return (
    <ScrollView
      style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContent, isWideScreen && styles.innerContentWide]}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.backLinkBtn}
              onPress={() => navigation.navigate('HomeScreen')}
            >
              <Text style={[styles.backLinkText, isDark ? styles.subtextDark : styles.subtextLight]}>
                ← Return to App
              </Text>
            </TouchableOpacity>

            <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
              Admin Room Management
            </Text>
            <Text style={[styles.headerSubtitle, isDark ? styles.subtextDark : styles.subtextLight]}>
              Administrator: {adminEmail || 'admin@vku.udn.vn'}
            </Text>
          </View>

          <View style={styles.headerRightRow}>
            <ThemeSwitch />
            {/* Custom Minimalist Logout Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.customLogoutBtn, isDark && styles.customLogoutBtnDark]}
              onPress={logoutAdmin}
            >
              <Text style={[styles.customLogoutBtnText, isDark && styles.customLogoutBtnTextDark]}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Success Alert Banner */}
        {successMessage ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successMessage}</Text>
          </View>
        ) : null}

        {/* Add Room Form Card */}
        <View style={[styles.formCard, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.sectionHeadingTitle, isDark ? styles.textDark : styles.textLight]}>
            Add New Study Room
          </Text>

          {/* Section 1: Room Name */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Room Name *</Text>
            <TextInput
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
              ]}
              placeholder="Room A.302 - Embedded Systems & Robotics Lab"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Section 2: Building & Floor & Capacity */}
          <View style={styles.rowGrid}>
            <View style={[styles.formGroup, styles.gridCol]}>
              <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Building *</Text>
              <View style={styles.chipRow}>
                {BUILDINGS.map((b) => (
                  <TouchableOpacity
                    key={b}
                    activeOpacity={0.7}
                    style={[
                      styles.choiceChip,
                      isDark ? styles.chipDark : styles.chipLight,
                      building === b && styles.chipActive,
                    ]}
                    onPress={() => setBuilding(b)}
                  >
                    <Text style={[styles.chipText, isDark ? styles.textDark : styles.textLight, building === b && styles.chipTextActive]}>
                      Building {b}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.formGroup, styles.gridCol]}>
              <View style={styles.rowGrid}>
                <View style={styles.gridCol}>
                  <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Floor *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      isDark ? styles.inputDark : styles.inputLight,
                      Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
                    ]}
                    keyboardType="numeric"
                    value={floor}
                    onChangeText={setFloor}
                  />
                </View>
                <View style={styles.gridCol}>
                  <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Capacity (Seats) *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      isDark ? styles.inputDark : styles.inputLight,
                      Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
                    ]}
                    keyboardType="numeric"
                    value={capacity}
                    onChangeText={setCapacity}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Section 3: Available Equipments */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Available Equipment</Text>
            <View style={styles.chipWrap}>
              {EQUIPMENTS.map((eq) => {
                const isSelected = selectedEquipments.includes(eq);
                return (
                  <TouchableOpacity
                    key={eq}
                    activeOpacity={0.7}
                    style={[
                      styles.choiceChip,
                      isDark ? styles.chipDark : styles.chipLight,
                      isSelected && styles.chipActive,
                    ]}
                    onPress={() => toggleEquipment(eq)}
                  >
                    <Text style={[styles.chipText, isDark ? styles.textDark : styles.textLight, isSelected && styles.chipTextActive]}>
                      {eq}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 4: Multi-Source Image Selector (Zero Emojis) */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Thumbnail Image Source</Text>

            {/* Mode Switch Tabs */}
            <View style={styles.modeTabsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modeTab, isDark ? styles.modeTabDark : styles.modeTabLight, imageMode === 'preset' && styles.modeTabActive]}
                onPress={() => setImageMode('preset')}
              >
                <Text style={[styles.modeTabText, isDark ? styles.textDark : styles.textLight, imageMode === 'preset' && styles.modeTabTextActive]}>
                  Presets
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modeTab, isDark ? styles.modeTabDark : styles.modeTabLight, imageMode === 'device' && styles.modeTabActive]}
                onPress={() => {
                  setImageMode('device');
                  pickImageFromDevice();
                }}
              >
                <Text style={[styles.modeTabText, isDark ? styles.textDark : styles.textLight, imageMode === 'device' && styles.modeTabTextActive]}>
                  From Device
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modeTab, isDark ? styles.modeTabDark : styles.modeTabLight, imageMode === 'url' && styles.modeTabActive]}
                onPress={() => setImageMode('url')}
              >
                <Text style={[styles.modeTabText, isDark ? styles.textDark : styles.textLight, imageMode === 'url' && styles.modeTabTextActive]}>
                  Custom URL
                </Text>
              </TouchableOpacity>
            </View>

            {/* MODE 1: PRESET IMAGES */}
            {imageMode === 'preset' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                {PRESET_IMAGES.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    style={[styles.presetCard, imageUrl === item.url && styles.presetCardActive]}
                    onPress={() => setImageUrl(item.url)}
                  >
                    <Image source={{ uri: item.url }} style={styles.presetImage} />
                    <Text numberOfLines={1} style={styles.presetLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* MODE 2: PICK FROM DEVICE BUTTON */}
            {imageMode === 'device' && (
              <View style={styles.devicePickerBox}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.uploadBtn, isDark ? styles.uploadBtnDark : styles.uploadBtnLight]}
                  onPress={pickImageFromDevice}
                >
                  <Text style={[styles.uploadBtnText, isDark ? styles.uploadBtnTextDark : styles.uploadBtnTextLight]}>
                    Upload Image File From Device
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* MODE 3: CUSTOM IMAGE URL INPUT */}
            {imageMode === 'url' && (
              <TextInput
                style={[
                  styles.input,
                  isDark ? styles.inputDark : styles.inputLight,
                  Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
                ]}
                placeholder="https://images.unsplash.com/photo-..."
                placeholderTextColor="#94a3b8"
                value={imageUrl}
                onChangeText={setImageUrl}
              />
            )}

            {/* LIVE IMAGE PREVIEW BOX */}
            {imageUrl ? (
              <View style={styles.previewContainer}>
                <Text style={[styles.previewLabel, isDark ? styles.subtextDark : styles.subtextLight]}>Image Preview:</Text>
                <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
              </View>
            ) : null}
          </View>

          {/* Section 5: Description */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark ? styles.textDark : styles.labelLight]}>Description & Specifications *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                isDark ? styles.inputDark : styles.inputLight,
                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
              ]}
              multiline
              numberOfLines={3}
              placeholder="Describe room features, equipment specs, and study group target..."
              placeholderTextColor="#94a3b8"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity activeOpacity={0.8} style={styles.primaryBtn} onPress={handleCreateRoom}>
            <Text style={styles.primaryBtnText}>Create Study Room</Text>
          </TouchableOpacity>
        </View>

        {/* Existing Registered Rooms List Section */}
        <View style={[styles.formCard, isDark ? styles.cardDark : styles.cardLight, { marginTop: 24 }]}>
          <Text style={[styles.sectionHeadingTitle, isDark ? styles.textDark : styles.textLight]}>
            Active Registered Rooms ({rooms.length})
          </Text>

          <View style={styles.roomListGrid}>
            {rooms.map((r) => (
              <View key={r.id} style={[styles.adminRoomItem, isDark ? styles.chipDark : styles.chipLight]}>
                <Image source={{ uri: r.image }} style={styles.adminRoomThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.adminRoomTitle, isDark ? styles.textDark : styles.textLight]} numberOfLines={1}>
                    {r.name}
                  </Text>
                  <Text style={[styles.adminRoomSub, isDark ? styles.subtextDark : styles.subtextLight]}>
                    Building {r.building} • Floor {r.floor} • {r.capacity} Seats
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.deleteRoomBtn, isDark && styles.deleteRoomBtnDark]}
                  onPress={() => handleDeleteRoomPrompt(r.id, r.name)}
                >
                  <Text style={[styles.deleteRoomBtnText, isDark && styles.deleteRoomBtnTextDark]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
