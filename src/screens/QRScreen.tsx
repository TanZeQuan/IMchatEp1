import React, { useState, useEffect } from 'react';
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
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

const SCAN_BOX_SIZE = width * 0.65;
const OVERLAY_COLOR = 'rgba(0,0,0,0.6)';

const QRScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'myQR' | 'scan'>('myQR');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    Alert.alert('扫描成功', `类型: ${type}\n内容: ${data}`, [
      { text: '确定', onPress: () => setScanned(false) },
    ]);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('图片选择', '真实扫码需要额外库处理图片，这里仅作示例');
    }
  };

  const renderScanContent = () => {
    if (hasPermission === null) {
      return <Text style={styles.permissionText}>请求相机权限中...</Text>;
    }
    if (hasPermission === false) {
      return <Text style={styles.permissionText}>没有相机权限</Text>;
    }

    const offset = 100; // Offset to move the box up
    const verticalOverlayHeightTop =
      (screenHeight - SCAN_BOX_SIZE) / 2 - offset;
    const verticalOverlayHeightBottom =
      (screenHeight - SCAN_BOX_SIZE) / 2 + offset;
    const horizontalOverlayWidth = (width - SCAN_BOX_SIZE) / 2;

    return (
      <View style={styles.scanPanel}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          enableTorch={torch}
        />

        {/* Overlay */}
        <View style={StyleSheet.absoluteFillObject}>
          <View
            style={{
              height: verticalOverlayHeightTop,
              backgroundColor: OVERLAY_COLOR,
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                width: horizontalOverlayWidth,
                height: SCAN_BOX_SIZE,
                backgroundColor: OVERLAY_COLOR,
              }}
            />
            <View style={styles.scanBox} />
            <View
              style={{
                width: horizontalOverlayWidth,
                height: SCAN_BOX_SIZE,
                backgroundColor: OVERLAY_COLOR,
              }}
            />
          </View>
          <View
            style={{ flex: 1, backgroundColor: OVERLAY_COLOR }}
          />
        </View>

        <Text style={styles.scanHint}>请将二维码放于框中央</Text>

        {/* Bottom Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setTorch(!torch)}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name={torch ? 'flashlight' : 'flashlight-outline'}
                size={28}
                color="#fff"
              />
            </View>
            <Text style={styles.actionLabel}>手电筒</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePickImage}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="image-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>相册</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={activeTab === 'myQR' ? 'dark-content' : 'light-content'}
        backgroundColor="#1a1a1a"
      />

      {/* Header */}
      <View style={styles.headerRow}>
        {/* Back Button */}
       <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 40 }}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'myQR' && styles.activeTab]}
            onPress={() => setActiveTab('myQR')}
          >
            <Text style={[styles.tabText, activeTab === 'myQR' && { color: '#E8E9EB' }]}>
  我的二维码
</Text>

          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
            onPress={() => setActiveTab('scan')}
          >
            <Text style={[styles.tabText, activeTab === 'myQR' && { color: '#E8E9EB' }]}>
  扫描二维码
</Text>

          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'myQR' ? (
          <View style={styles.qrPanel}>
            <View style={styles.qrCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar} />
              </View>
              <View style={styles.qrCodePlaceholder}>
                <Text style={styles.qrText}>QR CODE</Text>
              </View>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="id-card-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>名片</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="download-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>下载/保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          renderScanContent()
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomColor: '#FFE08A',
  },
  tabText: {
     color: "#FFE08A", fontSize: 18, fontWeight: "bold"
  },
  contentContainer: {
    flex: 1,
  },
  qrPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCard: {
    width: width * 0.6,
    aspectRatio: 0.7,
    backgroundColor: '#F4D03F',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e0e0e0',
  },
  qrCodePlaceholder: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  scanPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    borderWidth: 2,
    borderColor: '#fff',
  },
  scanHint: {
    color: 'white',
    fontSize: 14,
    marginTop: 20,
    position: 'absolute',
    bottom: 200,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 80,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(74, 74, 74, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default QRScreen;