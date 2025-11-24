import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { sendOTP, verifyOTP, resetPassword } from "../api/UserApi";
import responsive from "../utils/responsive";

const ForgetPasswordScreen: React.FC = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("提示", "请输入邮箱地址");
      return;
    }

    try {
      await sendOTP({ email });
      Alert.alert("验证码已发送", "请检查您的邮箱");

      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      Alert.alert("发送失败", err?.message || "请稍后再试");
    }
  };

  const handleSubmit = async () => {
    if (!email || !verificationCode || !newPassword || !confirmPassword) {
      Alert.alert("提示", "请填写完整信息");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("错误", "两次密码不一致");
      return;
    }

    try {
      await verifyOTP({ email, otp: verificationCode });
      await resetPassword({ password: newPassword });

      Alert.alert("成功", "密码已重设，请返回登录", [
        { text: "确定", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert("失败", err?.message || "请稍后再试");
    }
  };

  return (
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={responsive.f(24)} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>找回密码</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* 邮箱 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="请输入邮箱地址"
              placeholderTextColor="#B8B8B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* 验证码 + 按钮 */}
          <View style={styles.verificationRow}>
            <View style={[styles.inputContainer, styles.verificationInput]}>
              <TextInput
                style={styles.input}
                placeholder="请输入验证码"
                placeholderTextColor="#B8B8B8"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendCodeButton,
                countdown > 0 && styles.sendCodeButtonDisabled,
              ]}
              disabled={countdown > 0}
              onPress={handleSendCode}
            >
              <Text style={styles.sendCodeButtonText}>
                {countdown > 0 ? `${countdown}s` : "发送验证码"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 新密码 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="请输入新密码"
              placeholderTextColor="#B8B8B8"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                size={responsive.f(22)}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* 确认密码 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="请确认密码"
              placeholderTextColor="#B8B8B8"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={responsive.f(22)}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>提交</Text>
          </TouchableOpacity>
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
    backgroundColor: "#FFD860",
    paddingHorizontal: responsive.s(16),
    paddingVertical: responsive.h(8),
  },
  backButton: {
    width: responsive.w(40),
    height: responsive.w(40),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: responsive.f(16), fontWeight: "600", color: "#333" },
  placeholder: { width: responsive.w(40) },
  content: { paddingHorizontal: responsive.s(20), paddingTop: responsive.h(32) },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: responsive.w(30),
    paddingHorizontal: responsive.s(20),
    marginBottom: responsive.h(18),
    height: responsive.h(50),
  },
  input: { flex: 1, fontSize: responsive.f(15), color: "#333" },
  eyeIcon: { padding: responsive.w(8) },
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsive.h(0),
    gap: responsive.w(12),
  },
  verificationInput: { flex: 1 },
  sendCodeButton: {
    backgroundColor: "#FCD34D",
    borderRadius: responsive.w(30),
    paddingHorizontal: responsive.s(22),
    paddingVertical: responsive.h(15),
    minWidth: responsive.w(120),
    marginBottom: responsive.h(20),
    justifyContent: "center",
    alignItems: "center",
  },
  sendCodeButtonDisabled: { backgroundColor: "#E8DCA8", opacity: 0.6 },
  sendCodeButtonText: { color: "#D32F2F", fontWeight: "600", fontSize: responsive.f(14) },
  submitButton: {
    backgroundColor: "#FCD34D",
    borderRadius: responsive.w(30),
    paddingVertical: responsive.h(15),
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsive.h(40),
    marginBottom: responsive.h(60),
    marginHorizontal: responsive.s(16),
  },
  submitButtonText: { fontSize: responsive.f(16), fontWeight: "600", color: "#333" },
});

export default ForgetPasswordScreen;
