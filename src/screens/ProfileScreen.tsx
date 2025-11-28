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

      // Load avatar from AsyncStorage
      const avatar = await AsyncStorage.getItem(`userAvatar_${currentUserId}`);
      if (avatar) {
        setAvatarUri(avatar);
      }

      const email = await AsyncStorage.getItem(`userEmail_${currentUserId}`);
      const phone = await AsyncStorage.getItem(`userPhone_${currentUserId}`);
      console.log("Profile loaded info:", { currentUserId, nickname, avatar, email, phone });
    };

    loadUserData();
    
    // Add focus listener to reload data when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  // -------- 上传头像 --------
  const saveAvatar = async (uri: string) => {
    if (!userId) return;

    try {
      // First save to AsyncStorage immediately
      await AsyncStorage.setItem(`userAvatar_${userId}`, uri);
      setAvatarUri(uri);

      // Then upload to server
      const payload = {
        user_id: userId,
        name: userName,
        about: '',
        image: { uri, name: 'avatar.jpg', type: 'image/jpeg' },
      };

      const res = await updateProfile(payload);
      const serverAvatar = res?.data?.avatar || res?.avatar || uri;

      // Update with server URL if different
      if (serverAvatar !== uri) {
        await AsyncStorage.setItem(`userAvatar_${userId}`, serverAvatar);
        setAvatarUri(serverAvatar);
      }

      Alert.alert('成功', '头像已更新');
      console.log('Avatar saved:', serverAvatar);
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
    <LinearGradient colors={colors.background.gradientYellow} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileLeft}>
              <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={28} color={colors.text.white} />
                  </View>
                )}
                <View style={styles.cameraOverlay}>
                  <Ionicons name="camera" size={10} color={colors.text.white} />
                </View>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userName}</Text>
                <Text style={styles.profileId}>账号ID：{userId}</Text>
              </View>
            </View>
            <View style={styles.profileRight}>
              <TouchableOpacity style={styles.qrButton} onPress={() => navigation.navigate('MyQRCode')}>
                <Ionicons name="qr-code-outline" size={20} color={colors.text.dark} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.menuItem}
                onPress={() => item.navigateTo && navigation.navigate(item.navigateTo)}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={22} color={colors.text.dark} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.gray} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>退出</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  safeArea: { 
    flex: 1 
  },
  scrollContent: {
    paddingBottom: responsive.h(30),
  },
  profileCard: {
    backgroundColor: colors.background.yellowLight,
    paddingTop: responsive.h(60),
    paddingBottom: responsive.h(20),
    paddingHorizontal: responsive.w(20),
    marginBottom: responsive.h(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  avatarContainer: {
    position: 'relative',
    width: responsive.w(60),
    height: responsive.w(60),
  },
  avatar: { 
    width: responsive.w(60), 
    height: responsive.w(60), 
    borderRadius: responsive.w(10),
  },
  avatarPlaceholder: { 
    width: responsive.w(60), 
    height: responsive.w(60), 
    backgroundColor: colors.text.dark, 
    borderRadius: responsive.w(10), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: responsive.w(18),
    height: responsive.w(18),
    borderRadius: responsive.w(9),
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  profileInfo: { 
    marginLeft: responsive.w(12), 
    flex: 1 
  },
  profileName: { 
    fontSize: responsive.f(16), 
    fontWeight: '600', 
    color: colors.text.dark, 
    marginBottom: responsive.h(2) 
  },
  profileId: { 
    fontSize: responsive.f(12), 
    color: colors.text.gray 
  },
  profileRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrButton: {
    width: responsive.w(32),
    height: responsive.w(32),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: responsive.w(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    paddingHorizontal: responsive.w(16),
  },
  menuItem: {
    backgroundColor: colors.background.white,
    borderRadius: responsive.w(12),
    paddingVertical: responsive.h(16),
    paddingHorizontal: responsive.w(20),
    marginBottom: responsive.h(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuLabel: { 
    marginLeft: responsive.w(12), 
    fontSize: responsive.f(15), 
    color: colors.text.dark,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: colors.background.yellowLight,
    borderRadius: responsive.w(25),
    paddingVertical: responsive.h(14),
    marginHorizontal: responsive.w(40),
    marginTop: responsive.h(30),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: responsive.f(16),
    fontWeight: '500',
    color: colors.text.dark,
  },
});

export default ProfileMenu;