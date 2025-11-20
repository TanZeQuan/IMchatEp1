import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { updateProfile } from '../api/UserApi';
import { MainStackParamList } from "../navigation/MainStack"; // adjust path

interface ProfileItemProps {
  label: string;
  value: string;
  onPress?: () => void;
  showArrow?: boolean;
  imageUri?: string | null;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  onPress,
  showArrow = true,
  imageUri,
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueContainer}>
      {label === "头像" ? (
        <View style={styles.avatar}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : { uri: "https://via.placeholder.com/40" }
            }
            style={styles.avatarImage}
          />
        </View>
      ) : label === "QR" ? (
        <Ionicons
          name="qr-code-outline"
          size={24}
          color="#666"
          style={styles.qrIcon}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#999" />}
    </View>
  </TouchableOpacity>
);

const ProfileScreen: React.FC = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('权限被拒绝', '需要访问相册权限以更换头像');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri); // 本地显示

      try {
        const response = await updateProfile({
          user_id: '12345678', // 替换为实际用户ID
          image: { uri, name: 'avatar.jpg', type: 'image/jpeg' },
        });
        console.log('上传成功', response);
        Alert.alert('成功', '头像已更新');
      } catch (err) {
        console.error(err);
        Alert.alert('失败', '头像上传失败');
      }
    }
  };

  return (
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()} // Go back
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>主页</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Items */}
        <View style={styles.content}>
          <ProfileItem
            label="头像"
            value=""
            onPress={handlePickAvatar}
            imageUri={avatarUri}
          />
          <ProfileItem
            label="名字"
            value="Mym"
            onPress={() => navigation.navigate("EditName")} // navigate to EditName screen
          />
          <ProfileItem
            label="手机号码"
            value="+6011****1QQ"
            onPress={() => navigation.navigate("EditPhone")} // navigate to EditPhone screen
          />
          <ProfileItem label="账号ID" value="123456" showArrow={false} />
          <ProfileItem
            label="QR"
            value=""
          // onPress={() => navigation.navigate('QRScreen')} // navigate to QR screen
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F5E6B3"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFD860",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: { width: 40 },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  placeholder: { width: 40 },
  content: { backgroundColor: "#fff" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: { fontSize: 15, color: "#333" },
  valueContainer: { flexDirection: "row", alignItems: "center" },
  value: { fontSize: 15, color: "#999", marginRight: 8 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
    backgroundColor: "#EEE",
  },
  avatarImage: { width: "100%", height: "100%" },
  qrIcon: { marginRight: 8 },
});

export default ProfileScreen;
