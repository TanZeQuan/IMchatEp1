import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { sendOTP, verifyOTP, resetPassword } from "../api/UserApi";
import responsive from "../utils/responsive";
import { colors, borders, typography } from "../styles";
import Input from "../components/Input";
import Button from "../components/Button";

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
    <LinearGradient colors={colors.background.gradientYellow} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={responsive.f(typography.fontSize24)} color={colors.text.blackMedium} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>找回密码</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Input
            placeholder="请输入邮箱地址"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
          />

          {/* 验证码 + 按钮 */}
          <View style={styles.verificationRow}>
            <Input
              placeholder="请输入验证码"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              containerStyle={[styles.inputContainer, styles.verificationInput]}
            />

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

          <Input
            placeholder="请输入新密码"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            icon={showNewPassword ? "eye-outline" : "eye-off-outline"}
            iconOnPress={() => setShowNewPassword(!showNewPassword)}
            containerStyle={styles.inputContainer}
          />

          <Input
            placeholder="请确认密码"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            icon={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
            iconOnPress={() => setShowConfirmPassword(!showConfirmPassword)}
            containerStyle={styles.inputContainer}
          />

          <Button
            title="提交"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
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
    paddingHorizontal: responsive.s(16),
    paddingVertical: responsive.h(8),
  },
  backButton: {
    width: responsive.w(40),
    height: responsive.w(40),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: responsive.f(typography.fontSize16), fontWeight: typography.fontWeight600, color: colors.text.blackMedium },
  placeholder: { width: responsive.w(40) },
  content: { paddingHorizontal: responsive.s(20), paddingTop: responsive.h(32) },
  inputContainer: {
    marginBottom: responsive.h(18),
    height: responsive.h(50),
    // We keep this style to override the default component styles
  },
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsive.h(0),
    gap: responsive.w(12),
  },
  verificationInput: { flex: 1 },
  sendCodeButton: {
    backgroundColor: colors.background.yellowLight,
    borderRadius: responsive.w(borders.radius30),
    paddingHorizontal: responsive.s(22),
    paddingVertical: responsive.h(15),
    minWidth: responsive.w(120),
    marginBottom: responsive.h(20),
    justifyContent: "center",
    alignItems: "center",
  },
  sendCodeButtonDisabled: { backgroundColor: "#E8DCA8", opacity: 0.6 },
  sendCodeButtonText: { color: "#D32F2F", fontWeight: typography.fontWeight600, fontSize: responsive.f(typography.fontSize14) },
  submitButton: {
    backgroundColor: colors.background.yellowLight,
    borderRadius: responsive.w(borders.radius30),
    marginTop: responsive.h(40),
    marginBottom: responsive.h(60),
    marginHorizontal: responsive.s(16),
    shadowColor: 'transparent', // Override default shadow
    elevation: 0, // Override default shadow
  },
});

export default ForgetPasswordScreen;
