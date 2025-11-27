import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borders, typography } from "../styles";

// Define your navigation stack param types
type RootStackParamList = {
  ProfileSettings: { chatName?: string; userId?: string } | undefined;
  ChatHistory: { chatName?: string; userId?: string };
};

// Notification switch settings type
interface NotificationSettings {
  carPickup: boolean;
  taxiRide: boolean;
  activity: boolean;
}

interface SettingItem {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  type?: 'switch' | 'navigate';
  key?: keyof NotificationSettings;
  navigateTo?: keyof RootStackParamList;
}

const ProfileSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProfileSettings'>>();
  const params = route?.params;

  const profileName = params?.chatName ?? '未命名用户';

  const [notifications, setNotifications] = useState<NotificationSettings>({
    carPickup: true,
    taxiRide: false,
    activity: true,
  });

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationSettings: SettingItem[] = [
    {
      title: '长打开',
      subtitle: '允许打开开关',
      icon: 'warning-outline',
      type: 'switch',
      key: 'taxiRide',
    },
    {
      title: '事声',
      subtitle: '开关',
      icon: 'notifications',
      type: 'switch',
      key: 'activity',
    },
    {
      title: '强提醒',
      subtitle: '场链接可打开',
      icon: 'shield-checkmark-outline',
      type: 'switch',
      key: 'carPickup',
    },
  ];

  const renderSwitchItem = (item: SettingItem, index: number) => (
    <View
      key={index}
      style={[styles.settingItem, index !== notificationSettings.length - 1 && styles.borderBottom]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={20} color="#fff" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <Switch
        value={item.key ? notifications[item.key] : false}
        onValueChange={() => item.key && toggleNotification(item.key)}
        trackColor={{ false: colors.border.gray, true: colors.functional.greenBright }}
        thumbColor={colors.background.white}
      />
    </View>
  );

  const handleSearchChatHistory = () => {
    navigation.navigate('ChatHistory', {
      chatName: profileName,
      userId: params?.userId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>个人中心</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: "https://postimg.cc/34y84VvN" }}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.profileName}>{profileName}</Text>
        </View>

        {/* Chat History Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设置推告</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={handleSearchChatHistory}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={20} color="#fff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>查询聊天记录</Text>
                <Text style={styles.settingSubtitle}>推送提醒消息</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* More Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>更多设置</Text>
          <View style={styles.card}>
            {notificationSettings.map((item, index) => renderSwitchItem(item, index))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>危险区</Text>
          <TouchableOpacity style={styles.card}>
            <View style={styles.settingItem}>
              <View style={[styles.iconContainer, styles.dangerIcon]}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.dangerTitle}>清空账号记录</Text>
                <Text style={styles.dangerSubtitle}>清除本地用户记录</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.chatBg },
  scrollView: { flex: 1 },
  header: {
    backgroundColor: colors.background.yellowLight,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: typography.fontSize18, fontWeight: typography.fontWeight600, color: colors.text.black },
  profileCard: {
    backgroundColor: colors.background.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: borders.radius12,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: colors.functional.avatarBg,
    borderRadius: borders.radius12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
  },
  profileName: { fontSize: typography.fontSize16, fontWeight: typography.fontWeight500, color: colors.text.dark },
  section: { marginTop: 16, marginHorizontal: 16 },
  sectionTitle: { fontSize: typography.fontSize14, color: colors.text.gray, marginBottom: 8, paddingHorizontal: 8 },
  card: { backgroundColor: colors.background.white, borderRadius: borders.radius12, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  borderBottom: { borderBottomWidth: borders.width1, borderBottomColor: colors.border.light },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#FBBF24",
    borderRadius: borders.radius20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerIcon: { backgroundColor: colors.functional.redMedium },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: typography.fontSize16, fontWeight: typography.fontWeight500, color: colors.text.dark, marginBottom: 2 },
  settingSubtitle: { fontSize: typography.fontSize12, color: colors.text.grayLight },
  dangerTitle: { fontSize: typography.fontSize16, fontWeight: typography.fontWeight500, color: colors.functional.redMedium, marginBottom: 2 },
  dangerSubtitle: { fontSize: typography.fontSize12, color: colors.functional.redLight },
});

export default ProfileSettingsScreen;
