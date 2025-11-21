import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const SCAN_BOX_SIZE = 250;
const OVERLAY_COLOR = "rgba(0,0,0,0.6)";

const FriendScan: React.FC = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    Alert.alert("扫描成功", `类型: ${type}\n内容: ${data}`, [
      { text: "确定", onPress: () => setScanned(false) },
    ]);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert("图片选择", "真实扫码需要额外库处理图片，这里仅作示例");
    }
  };

  const handleMyQRCode = () => {
    Alert.alert("我的二维码", "跳转到显示自己的二维码页面");
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>请求相机权限中...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>没有相机权限，请允许访问相机</Text>
      </View>
    );
  }

const offset = 100; // 想往上移动 100px
const verticalOverlayHeightTop = (screenHeight - SCAN_BOX_SIZE)/2 - offset;
const verticalOverlayHeightBottom = (screenHeight - SCAN_BOX_SIZE)/2 + offset;
  const horizontalOverlayWidth = (screenWidth - SCAN_BOX_SIZE) / 2;

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Overlay */}
      <View style={StyleSheet.absoluteFillObject}>
        {/* Top */}
        <View
          style={{
            width: screenWidth,
            height: verticalOverlayHeightTop,
            backgroundColor: OVERLAY_COLOR,
          }}
        />
        {/* Middle row */} 
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: horizontalOverlayWidth,
              height: SCAN_BOX_SIZE,
              backgroundColor: OVERLAY_COLOR,
            }}
          />
          {/* 扫描区域 */}
          <View style={{ width: SCAN_BOX_SIZE, height: SCAN_BOX_SIZE }} />
          <View
            style={{
              width: horizontalOverlayWidth,
              height: SCAN_BOX_SIZE,
              backgroundColor: OVERLAY_COLOR,
            }}
          />
        </View>
        {/* Bottom */}
        <View
          style={{
            width: screenWidth,
            height: verticalOverlayHeightBottom,
            backgroundColor: OVERLAY_COLOR,
          }}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 40 }}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>扫描二维码</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleMyQRCode}>
          <Ionicons name="qr-code-outline" size={28} color="white" />
          <Text style={styles.footerButtonText}>我的二维码</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={handlePickImage}>
          <Ionicons name="images-outline" size={28} color="white" />
          <Text style={styles.footerButtonText}>相册</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#232323" },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 200,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  footerButton: { alignItems: "center" },
  footerButtonText: { color: "#fff", fontSize: 14, marginTop: 5 },
  permissionText: { color: "#fff", textAlign: "center", marginTop: 20 },
});

export default FriendScan;
