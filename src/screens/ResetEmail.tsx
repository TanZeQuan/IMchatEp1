import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { changeEmail } from "../api/UserApi"; // axios 函数
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, borders, typography } from "../styles";

const ResetEmailScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userStoredEmail, setUserStoredEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Load user's current email from storage
  useEffect(() => {
    const loadUserEmail = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (!id) return;
        setUserId(id);

        const storedEmail = await AsyncStorage.getItem(`userEmail_${id}`);
        if (storedEmail) setUserStoredEmail(storedEmail);
      } catch (error) {
        console.log("Error loading user email:", error);
      }
    };
    loadUserEmail();
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!currentEmail || !newEmail || !confirmEmail) {
      return Alert.alert("提示", "请填写所有邮箱信息");
    }

    if (!validateEmail(currentEmail) || !validateEmail(newEmail)) {
      return Alert.alert("提示", "请输入有效的邮箱地址");
    }

    if (!userStoredEmail || currentEmail.toLowerCase() !== userStoredEmail.toLowerCase()) {
      return Alert.alert("错误", "当前邮箱不正确，请输入正确的当前邮箱", [
        { text: "重新输入", onPress: () => setCurrentEmail("") },
      ]);
    }

    if (newEmail !== confirmEmail) {
      return Alert.alert("提示", "新邮箱与确认邮箱不匹配");
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      return Alert.alert("提示", "新邮箱不能与当前邮箱相同，请输入不同的邮箱地址");
    }

    setLoading(true);

    try {
      if (!userId) {
        Alert.alert("错误", "未找到用户信息，请重新登录");
        setLoading(false);
        return;
      }

      const payload = { user_id: userId, email: newEmail };
      console.log("🟢 Sending Payload:", payload);

      const res = await changeEmail(payload);
      console.log("🔵 Backend Response:", res);

      // Update stored email locally
      await AsyncStorage.setItem(`userEmail_${userId}`, newEmail);

      Alert.alert("成功", "邮箱修改成功", [
        { text: "确定", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.log("🔴 Backend Error:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "邮箱修改失败";

      if (errorMessage.includes("已注册") || errorMessage.includes("already exists") || errorMessage.includes("already registered") || error?.response?.status === 409) {
        Alert.alert("失败", "该邮箱已被注册，请使用其他邮箱", [
          {
            text: "重新输入",
            onPress: () => {
              setNewEmail("");
              setConfirmEmail("");
            },
          },
        ]);
      } else {
        Alert.alert("失败", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>更改邮箱</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.text.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="请输入当前邮箱"
              placeholderTextColor={colors.border.grayMedium}
              value={currentEmail}
              onChangeText={setCurrentEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.text.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="请输入新邮箱"
              placeholderTextColor={colors.border.grayMedium}
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.text.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="请确认新邮箱"
              placeholderTextColor={colors.border.grayMedium}
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.text.blackMedium} /> : <Text style={styles.submitButtonText}>提交</Text>}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.grayLight },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.background.yellowBright, paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { width: 40 },
  headerTitle: { fontSize: typography.fontSize16, fontWeight: typography.fontWeight600, color: colors.text.blackMedium },
  placeholder: { width: 40 },
  content: { paddingHorizontal: 16, paddingTop: 24 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.background.white, borderRadius: borders.radius25, paddingHorizontal: 25, marginBottom: 25, height: 50, shadowColor: colors.shadow.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: typography.fontSize14, color: colors.text.blackMedium },
  submitButton: { backgroundColor: colors.background.yellowLight, borderRadius: borders.radius30, paddingVertical: 15, alignItems: "center", justifyContent: "center", marginTop: 100, marginBottom: 60, marginHorizontal: 16 },
  submitButtonText: { fontSize: typography.fontSize16, fontWeight: typography.fontWeight500, color: colors.text.blackMedium },
});

export default ResetEmailScreen;
