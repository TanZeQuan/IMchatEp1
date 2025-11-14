import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../store/userStore';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  navigateTo?: string; // 可选导航路径
}

const ProfileMenu: React.FC = () => {
  const navigation = useNavigation<any>();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { icon: 'star-outline', label: '我的收藏' },
    { icon: 'person-outline', label: '联系客服' },
    { icon: 'help-circle-outline', label: '帮助中心' },
    { icon: 'settings-outline', label: '设置', navigateTo: 'Setting' },
    { icon: 'people-outline', label: '会议',  navigateTo: 'MeetingScreen' },
  ];

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleAvatarPress = () => {
    Alert.alert('Change Avatar', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleMenuPress = (item: MenuItem) => {
    if (item.navigateTo) {
      navigation.navigate(item.navigateTo as never);
    } else {
      console.log(`Pressed: ${item.label}`);
    }
  };

  const { setUserToken } = useUserStore();
  const handleLogout = async () => {
    setUserToken(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.8} onPress={() => console.log('Profile pressed')}>
          <View style={styles.profileLeft}>
            <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8} onPress={handleAvatarPress}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={32} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Mym</Text>
              <Text style={styles.profileId}>账号ID：123456</Text>
            </View>
          </View>
          <View style={styles.profileRight}>
            <TouchableOpacity style={styles.qrButton} activeOpacity={0.7} onPress={() => navigation.navigate('QRScan')}>
              <Ionicons name="qr-code-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" style={styles.chevron} />
          </View>
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={20} color="#1F2937" />
                </View>
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>退出</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// 样式
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF3C7' },
  scrollView: { flex: 1 },
  profileCard: { backgroundColor: '#FCD34D', padding: 20, paddingTop: 60, paddingBottom: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarContainer: { width: 56, height: 56, borderRadius: 16, overflow: 'hidden' },
  avatar: { width: 56, height: 56, borderRadius: 16 },
  avatarPlaceholder: { width: 56, height: 56, backgroundColor: '#1F2937', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  profileInfo: { marginLeft: 12, flex: 1 },
  profileName: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  profileId: { fontSize: 13, color: '#6B7280' },
  profileRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qrButton: { width: 32, height: 32, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  chevron: { marginLeft: 4 },
  menuContainer: { gap: 12, paddingHorizontal: 16 },
  menuItem: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 32, height: 32, backgroundColor: 'transparent', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  menuItemText: { fontSize: 15, fontWeight: '400', color: '#1F2937', marginLeft: 12 },
  logoutButton: { backgroundColor: '#FCD34D', borderRadius: 20, padding: 16, marginTop: 24, marginBottom: 24, marginHorizontal: 16, alignItems: 'center' },
  logoutButtonText: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
});

export default ProfileMenu;
