import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainStack';

const COLORS = {
  background: '#F5F5F5',
  header: '#FFD860',
  white: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#999999',
  border: '#E5E5E5',
  switchActive: '#4CD964',
};

interface SettingItemProps {
  title: string;
  showArrow?: boolean;
  showSwitch?: boolean;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  showArrow = true,
  showSwitch = false,
  onPress,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={showSwitch ? undefined : onPress}
      activeOpacity={showSwitch ? 1 : 0.6}
    >
      <Text style={styles.settingTitle}>{title}</Text>
      {showArrow && !showSwitch && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      )}
      {showSwitch && (
        <Switch
          trackColor={{ false: '#E5E5E5', true: COLORS.switchActive }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E5E5E5"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      )}
    </TouchableOpacity>
  );
};

const SettingScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.settingsGroup}>
          {/* 🔗 点击跳转主页 */}
          <SettingItem
            title="主页"
            onPress={() => navigation.navigate('SettingProfile')}
          />
          <View style={styles.separator} />

          {/* 🔗 点击跳转更改密码页 */}
          <SettingItem
            title="更改密码"
            onPress={() => navigation.navigate('ResetPassword')}
          />
          <View style={styles.separator} />

          <SettingItem title="通知" onPress={() => navigation.navigate('Notification')} />
          <View style={styles.separator} />

          <SettingItem
            title='显示 "发送" 按钮'
            showArrow={false}
            showSwitch={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.header,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  settingsGroup: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
  },
  settingTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 16,
  },
});

export default SettingScreen;
