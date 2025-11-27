import React, { useState, useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from '../store/userStorage';
import { updateProfile } from '../api/UserApi';
import { colors, borders, typography } from '../styles';
import responsive from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  navigateTo?: string;
}

interface Props {
  setUserToken: (token: string | null) => void;
}

const ProfileMenu: React.FC<Props> = ({ setUserToken }) => {
  const navigation = useNavigation<any>();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('未命名用户');
  const [userId, setUserId] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { icon: 'star-outline', label: '我的收藏' },
    { icon: 'person-outline', label: '联系客服' },
    { icon: 'help-circle-outline', label: '帮助中心' },
    { icon: 'settings-outline', label: '设置', navigateTo: 'Setting' },
    { icon: 'people-outline', label: '会议', navigateTo: 'MeetingScreen' },
  ];

  // -------- 加载用户数据 --------
  useEffect(() => {
    const loadUserData = async () => {
      const currentUserId = await AsyncStorage.getItem('userId');
      if (!currentUserId) return;

      setUserId(currentUserId);

      const nickname = await AsyncStorage.getItem(`userName_${currentUserId}`);
      setUserName(nickname || '未命名用户');

      const avatar = await AsyncStorage.getItem(`userAvatar_${currentUserId}`);
      setAvatarUri(avatar || null);

      const email = await AsyncStorage.getItem(`userEmail_${currentUserId}`);
      const phone = await AsyncStorage.getItem(`userPhone_${currentUserId}`);
      console.log("Profile loaded info:", { currentUserId, nickname, avatar, email, phone });
    };

    loadUserData();
  }, []);


  // -------- 上传头像 --------
  const saveAvatar = async (uri: string) => {
    if (!userId) return;

    try {
      const payload = {
        user_id: userId,
        name: userName,
        about: '',
        image: { uri, name: 'avatar.jpg', type: 'image/jpeg' },
      };

      const res = await updateProfile(payload);
      const serverAvatar = res?.data?.avatar || res?.avatar || uri;

      await Storage.setUserAvatar(userId, serverAvatar);
      setAvatarUri(serverAvatar);
      Alert.alert('成功', '头像已更新');
    } catch (err) {
      console.warn('头像上传失败', err);
      Alert.alert('错误', '头像上传失败');
    }
  };

  // -------- 上传名字 --------
  const saveName = async (name: string) => {
    if (!userId) return;

    try {
      await Storage.setUserName(userId, name);
      setUserName(name);
      await updateProfile({ user_id: userId, name, about: '', image: null });
    } catch (err) {
      console.warn('更新名字失败', err);
    }
  };

  // -------- 选择图片 --------
  const pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('权限不足', '无法访问相册');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        saveAvatar(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('选择图片失败', err);
    }
  };

  const takePhoto = async () => {
    try {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert('权限不足', '无法使用相机');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        saveAvatar(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('拍照失败', err);
    }
  };

  const handleAvatarPress = () => {
    Alert.alert('更换头像', '请选择操作', [
      { text: '拍照', onPress: takePhoto },
      { text: '从相册选择', onPress: pickImage },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert('确认登出', '确定要退出吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: async () => {
          try {
            await Storage.removeUserToken();
            setUserToken(null);
          } catch (err) {
            console.warn('登出失败', err);
          }
        },
      },
    ]);
  };

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.profileCard} onPress={handleAvatarPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={32} color={colors.text.white} />
                </View>
              )}
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.dark }}>{userName}</Text>
                <Text style={{ fontSize: 13, color: colors.text.gray }}>账号ID：{userId}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.gray} />
          </TouchableOpacity>

          {/* Menu */}
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Ionicons name={item.icon} size={20} color={colors.text.dark} />
              <Text style={{ marginLeft: 12, fontSize: 15, color: colors.text.dark }}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text.dark }}>退出</Text>
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
    backgroundColor: colors.background.yellowLight,
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
  avatarPlaceholder: { width: responsive.w(56), height: responsive.w(56), backgroundColor: colors.text.dark, borderRadius: responsive.w(16), justifyContent: 'center', alignItems: 'center' },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: responsive.w(20),
    height: responsive.w(20),
    borderRadius: responsive.w(10),
    backgroundColor: '#000', // black circle
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff', // white border for better visibility
  },
  profileInfo: { marginLeft: responsive.w(12), flex: 1 },
  profileName: { fontSize: responsive.f(18), fontWeight: typography.fontWeight600, color: colors.text.dark, marginBottom: responsive.h(2) },
  profileId: { fontSize: responsive.f(13), color: colors.text.gray },
  profileRight: { flexDirection: 'row', alignItems: 'center' },
  qrButton: { width: responsive.w(32), height: responsive.w(32), backgroundColor: colors.background.transparentWhite50, borderRadius: responsive.w(8), justifyContent: 'center', alignItems: 'center' },
  menuItem: {
    backgroundColor: colors.background.white,
    borderRadius: responsive.w(20),
    padding: responsive.h(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: colors.background.yellowLight,
    borderRadius: responsive.w(20),
    padding: responsive.h(16),
    marginHorizontal: responsive.s(16),
    marginTop: responsive.h(24),
    marginBottom: responsive.h(24),
    alignItems: 'center',
  },
});

export default ProfileMenu;

