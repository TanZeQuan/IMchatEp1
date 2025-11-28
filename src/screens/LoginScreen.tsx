import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useUserStore } from "../store/userStore";
import responsive from "../utils/responsive";
import { colors, borders, typography } from "../styles";
import { AuthStackParamList } from "../navigation/AuthStack";
import { login } from "../api/UserApi";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUserToken, setUserId } = useUserStore();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // ---------------- LOGIN FUNCTION ----------------
  // 登录函数示例
  const handleLogin = async () => {
    if (!phone || !password) return Alert.alert("错误", "请输入手机号和密码");

    setIsLoading(true);
    try {
      const res = await login({ phone, password });
      console.log("后端返回数据:", res);

      // 后端返回格式: { error: false, message: "Success", response: "IM65056417" }
      if (!res || res.error !== false) {
        throw new Error(res?.message || "登录失败");
      }

      // 登录成功，使用后端返回的用户ID作为临时 token
      // 等后端实现真正的 token 后再改为 res.token
      const tempToken = res.token || res.response || phone;
      const userId = res.response; // 后端返回的用户ID (如 "IM65056417")

      console.log("设置 token:", tempToken);
      console.log("设置 userId:", userId);

      setUserToken(tempToken);
      setUserId(userId); // 保存用户ID

      console.log("Token 已设置，应该会自动跳转");
      Alert.alert("成功", "登录成功！");
    } catch (err: any) {
      console.error("登录错误:", err);
      Alert.alert("登录失败", err?.message || "服务器错误");
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !phone || !password || !isChecked;

  // ---------------- RETURN UI ----------------
  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.bgShape1} />
        <View style={styles.bgShape2} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCard}>
              <Image
                source={require("../../assets/images/sentalk-logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.title}>登录</Text>

          {/* Phone input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="请输入手机号"
              value={phone}
              onChangeText={setPhone}
              autoCapitalize="none"
              editable={!isLoading}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          {/* Password input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="请输入密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              editable={!isLoading}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={responsive.f(22)}
                color="#888"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.linkText}>注册账号</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPassword")}
            >
              <Text style={styles.linkText}>忘记密码？</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isButtonDisabled}
            style={[
              styles.loginButtonWrapper,
              isButtonDisabled && styles.disabledButton,
            ]}
          >
            <LinearGradient
              colors={colors.background.gradientWhite}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "登录中..." : "登录"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.agreementContainer}>
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)}
              style={styles.checkbox}
            >
              <Ionicons
                name={isChecked ? "checkbox" : "square-outline"}
                size={responsive.f(18)}
                color={isChecked ? "#007AFF" : "#888"}
              />
            </TouchableOpacity>
            <Text style={styles.agreementText}>
              我已阅读并同意
              <Text style={styles.agreementLink}>《隐私政策和服务协议》</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: responsive.s(25),
    paddingTop: responsive.h(40),
  },
  logoContainer: { marginBottom: responsive.h(20) },
  logoCard: {
    width: responsive.w(128),
    height: responsive.w(128),
    backgroundColor: colors.background.white,
    borderRadius: responsive.w(borders.radius24),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logoImage: { width: responsive.w(130), height: responsive.w(130) },
  bgShape1: {
    position: "absolute",
    width: responsive.w(350),
    height: responsive.w(350),
    borderRadius: responsive.w(borders.radius60),
    backgroundColor: colors.background.transparentWhite50,
    top: responsive.h(-100),
    right: responsive.w(-120),
    transform: [{ rotate: "45deg" }],
  },
  bgShape2: {
    position: "absolute",
    width: responsive.w(300),
    height: responsive.w(300),
    borderRadius: responsive.w(borders.radius60),
    backgroundColor: colors.background.transparentWhite70,
    top: responsive.h(50),
    left: responsive.w(-150),
    transform: [{ rotate: "30deg" }],
  },
  title: {
    fontSize: responsive.f(typography.fontSize28),
    fontWeight: typography.fontWeightBold,
    marginBottom: responsive.h(30),
    color: colors.text.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: responsive.h(55),
    backgroundColor: colors.background.white,
    borderRadius: responsive.w(borders.radius30),
    marginBottom: responsive.h(20),
    paddingHorizontal: responsive.s(20),
    shadowColor: colors.shadow.blue,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  inputField: {
    flex: 1,
    fontSize: responsive.f(typography.fontSize16),
    color: colors.text.blackMedium,
    height: "100%",
  },
  icon: { marginLeft: responsive.w(10) },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: responsive.h(30),
    paddingHorizontal: responsive.s(15),
  },
  linkText: {
    color: colors.text.veryDarkGray,
    fontSize: responsive.f(typography.fontSize14),
  },
  loginButtonWrapper: {
    width: "100%",
    height: responsive.h(55),
    borderRadius: responsive.w(borders.radius30),
    shadowColor: colors.shadow.blue,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: responsive.h(10),
    overflow: "hidden",
  },
  loginButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsive.w(borders.radius30),
    borderWidth: borders.width1,
    borderColor: colors.border.white,
  },
  loginButtonText: {
    color: colors.text.blackMedium,
    fontSize: responsive.f(typography.fontSize16),
    fontWeight: typography.fontWeightBold,
  },
  disabledButton: { opacity: 0.6 },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsive.h(25),
    width: "100%",
    justifyContent: "center",
  },
  checkbox: { padding: responsive.w(5) },
  agreementText: {
    marginLeft: responsive.w(8),
    color: colors.text.grayMedium,
    fontSize: responsive.f(typography.fontSize13),
  },
  agreementLink: { color: colors.functional.blue },
});
