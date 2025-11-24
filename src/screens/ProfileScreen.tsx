import React, { useState, useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../store/userStore';
import responsive from '../utils/responsive';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  navigateTo?: string;
}

const ProfileMenu: React.FC = () => {
  const navigation = useNavigation<any>();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { setUserToken } = useUserStore();

  const menuItems: MenuItem[] = [
    { icon: 'star-outline', label: '我的收藏' },
    { icon: 'person-outline', label: '联系客服' },
    { icon: 'help-circle-outline', label: '帮助中心' },
    { icon: 'settings-outline', label: '设置', navigateTo: 'Setting' },
    { icon: 'people-outline', label: '会议', navigateTo: 'MeetingScreen' },
  ];

  useEffect(() => {
    AsyncStorage.getItem('userAvatar').then(uri => {
      if (uri) setAvatarUri(uri);
    });
  }, []);

  const saveAvatar = async (uri: string) => {
    await AsyncStorage.setItem('userAvatar', uri);
    setAvatarUri(uri);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      saveAvatar(result.assets[0].uri);
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
      saveAvatar(result.assets[0].uri);
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
    if (item.navigateTo) navigation.navigate(item.navigateTo as never);
    else console.log(`Pressed: ${item.label}`);
  };

  const handleLogout = () => {
    setUserToken(null);
  };

  return (
    <LinearGradient colors={['#FFEFB0', '#FFF9E5']} style={styles.safeArea}>
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
                    <Ionicons name="person" size={responsive.f(32)} color="#fff" />
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
                <Ionicons name="qr-code-outline" size={responsive.f(20)} color="#6B7280" />
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={responsive.f(20)} color="#6B7280" style={{ marginLeft: responsive.w(4) }} />
            </View>
          </TouchableOpacity>

          {/* Menu Items */}
          <View style={{ paddingHorizontal: responsive.s(16), marginBottom: responsive.h(60), gap: responsive.h(12) }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7} onPress={() => handleMenuPress(item)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: responsive.w(32), height: responsive.w(32), justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={item.icon} size={responsive.f(20)} color="#1F2937" />
                  </View>
                  <Text style={{ fontSize: responsive.f(15), fontWeight: '400', marginLeft: responsive.w(12), color: '#1F2937' }}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={responsive.f(20)} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
            <Text style={{ fontSize: responsive.f(16), fontWeight: '500', color: '#1F2937' }}>退出</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollView: { flex: 1 },
  profileCard: {
    backgroundColor: '#FCD34D',
    paddingTop: responsive.h(60),
    paddingBottom: responsive.h(20),
    paddingHorizontal: responsive.s(20),
    marginBottom: responsive.h(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarContainer: { width: responsive.w(56), height: responsive.w(56), borderRadius: responsive.w(16), overflow: 'hidden' },
  avatar: { width: responsive.w(56), height: responsive.w(56), borderRadius: responsive.w(16) },
  avatarPlaceholder: { width: responsive.w(56), height: responsive.w(56), backgroundColor: '#1F2937', borderRadius: responsive.w(16), justifyContent: 'center', alignItems: 'center' },
  profileInfo: { marginLeft: responsive.w(12), flex: 1 },
  profileName: { fontSize: responsive.f(18), fontWeight: '600', color: '#1F2937', marginBottom: responsive.h(2) },
  profileId: { fontSize: responsive.f(13), color: '#6B7280' },
  profileRight: { flexDirection: 'row', alignItems: 'center' },
  qrButton: { width: responsive.w(32), height: responsive.w(32), backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: responsive.w(8), justifyContent: 'center', alignItems: 'center' },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: responsive.w(20),
    padding: responsive.h(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#898989',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#FCD34D',
    borderRadius: responsive.w(20),
    padding: responsive.h(16),
    marginHorizontal: responsive.s(16),
    marginTop: responsive.h(24),
    marginBottom: responsive.h(24),
    alignItems: 'center',
  },
});

export default ProfileMenu;
