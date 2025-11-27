import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainStackParamList } from "../navigation/MainStack";
import { colors, borders, typography } from "../styles";

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
  <TouchableOpacity
    style={styles.item}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
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
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      {showArrow && onPress && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.text.lightGray}
        />
      )}
    </View>
  </TouchableOpacity>
);

const ProfileScreen: React.FC = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("未命名用户");
  const [phone, setPhone] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  useEffect(() => {
    const loadUserData = async () => {
      const currentUserId = await AsyncStorage.getItem("userId");
      if (!currentUserId) return;
      setUserId(currentUserId);

      const storedName = await AsyncStorage.getItem(`userName_${currentUserId}`);
      setNickname(storedName || "未命名用户");

      const storedPhone = await AsyncStorage.getItem(`userPhone_${currentUserId}`);
      setPhone(storedPhone || "");

      const storedAvatar = await AsyncStorage.getItem(`userAvatar_${currentUserId}`);
      setAvatarUri(storedAvatar || null);
    };

    loadUserData();
  }, []);

  return (
    <LinearGradient
      colors={colors.background.gradientYellow}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>个人资料</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Items */}
        <View style={styles.content}>
          <ProfileItem
            label="头像"
            value=""
            imageUri={avatarUri}
            showArrow={false} // no arrow, no edit
          />
          <ProfileItem
            label="名字"
            value={nickname}
            onPress={() => navigation.navigate("EditName")}
          />
          <ProfileItem
            label="手机号码"
            value={phone}
            showArrow={false} // read-only
          />
          <ProfileItem label="账号ID" value={userId} showArrow={false} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.yellowBright,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: { width: 40 },
  headerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight600,
    color: colors.text.blackMedium,
  },
  placeholder: { width: 40 },
  content: { backgroundColor: colors.background.white },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: borders.width1,
    borderBottomColor: colors.background.gray,
  },
  label: { fontSize: typography.fontSize15, color: colors.text.blackMedium },
  valueContainer: { flexDirection: "row", alignItems: "center" },
  value: { fontSize: typography.fontSize15, color: colors.text.lightGray, marginRight: 8 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borders.radius4,
    overflow: "hidden",
    marginRight: 8,
    backgroundColor: colors.background.veryLightGray,
  },
  avatarImage: { width: "100%", height: "100%" },
});

export default ProfileScreen;
