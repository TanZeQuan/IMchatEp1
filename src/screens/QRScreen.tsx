import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStack';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { colors, borders, typography } from "../styles";

const { width } = Dimensions.get('window');

const QRScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const viewShotRef = useRef<any>(null);

  const handleDownload = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要相册访问权限才能保存图片。');
      return;
    }

    try {
      if (!viewShotRef.current) {
        Alert.alert('错误', '无法找到要保存的区域。');
        return;
      }
      const uri = await viewShotRef.current.capture({ format: 'png', quality: 1, result: 'tmpfile' });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('保存成功', '二维码已成功保存到您的相册中。');
    } catch (e: any) {
      console.error(e);
      Alert.alert('保存失败', `保存二维码时发生错误: ${e.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的二维码</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.qrPanel}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
            <View style={styles.qrCard}>
              {/* User Info */}
              <View style={styles.userInfo}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>你的名字</Text>
                </View>
              </View>

              {/* QR Code Placeholder */}
              <View style={styles.qrCodePlaceholder}>
                <Text style={styles.qrText}>QR CODE</Text>
              </View>

              <Text style={styles.scanHint}>扫一扫上面的二维码，加我为好友</Text>
            </View>
          </ViewShot>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
              <View style={styles.actionIcon}>
                <Ionicons name="download-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.actionLabel}>下载图片</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.replace('ScanQRCode')}>
              <View style={styles.actionIcon}>
                <Ionicons name="scan-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.actionLabel}>扫描二维码</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text.blackAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
  },
  headerTitle: {
    color: colors.background.white,
    fontSize: typography.fontSize18,
    fontWeight: typography.fontWeightBold,
  },
  contentContainer: {
    flex: 1,
  },
  qrPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 150,
  },
  qrCard: {
    width: width * 0.7,
    aspectRatio: 0.7,
    backgroundColor: colors.background.yellow,
    borderRadius: borders.radius32,
    padding: 20,
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  userName: {
    fontSize: typography.fontSize18,
    fontWeight: typography.fontWeightBold,
    color: colors.text.black,
  },
  userLocation: {
    fontSize: typography.fontSize14,
    color: colors.text.darkGray,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: borders.radius50,
    backgroundColor: colors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.border.grayLight,
  },
  qrCodePlaceholder: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background.white,
    borderRadius: borders.radius12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: typography.fontSize24,
    fontWeight: typography.fontWeightBold,
    color: colors.text.black,
    letterSpacing: 2,
  },
  scanHint: {
    fontSize: typography.fontSize14,
    color: colors.text.darkGray,
    marginTop:20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 150,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: borders.radius28,
    backgroundColor: colors.background.transparentDark80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: colors.background.white,
    fontSize: typography.fontSize12,
  },
});

export default QRScreen;