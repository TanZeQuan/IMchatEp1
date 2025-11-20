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
import { useUserStore } from "../store/userStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { login } from "../api/UserApi";   // ⬅️ 关键：从 API 导入 login()

// Define your navigation stack types
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUserToken } = useUserStore();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleLogin = async () => {
    if (!isChecked) {
      Alert.alert("提示", "请先阅读并同意隐私政策和服务协议");
      return;
    }
    if (!phone || !password) {
      Alert.alert("错误", "请输入手机号和密码");
      return;
    }

    setIsLoading(true);

    try {
      // 调用真实 API 但不依赖 token
      const res = await login({ phone, password });
      console.log("API response:", res);

      // 模拟 token，保持前端状态一致
      const fakeToken = "bypass-token";
      setUserToken(fakeToken);

      console.log("Login success, fake token set:", fakeToken);

      // 导航到 Home 页面
      // navigation.replace("Home");

    } catch (error: any) {
      console.log("Login error:", error);
      Alert.alert("登录失败", error?.message || "请检查手机号或密码");
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !phone || !password || !isChecked;

  return (
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.safeArea}>
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

          {/* Phone number input */}
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
                size={22}
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

          {/* Login button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isButtonDisabled}
            style={[
              styles.loginButtonWrapper,
              isButtonDisabled && styles.disabledButton,
            ]}
          >
            <LinearGradient
              colors={["#FDFDFD", "#EAEAEA"]}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "登录中..." : "登录"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Agreement */}
          <View style={styles.agreementContainer}>
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)}
              style={styles.checkbox}
            >
              <Ionicons
                name={isChecked ? "checkbox" : "square-outline"}
                size={18}
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

/* --- styles (unchanged) --- */
const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 20,
  },
  logoCard: {
    width: 128,
    height: 128,
    backgroundColor: "#fff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  safeArea: {
    flex: 1,
  },
  bgShape1: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    top: -100,
    right: -120,
    transform: [{ rotate: "45deg" }],
  },
  bgShape2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    top: 50,
    left: -150,
    transform: [{ rotate: "30deg" }],
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 25,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#B0C0E0",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  icon: {
    marginLeft: 10,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  linkText: {
    color: "#555",
    fontSize: 14,
  },
  loginButtonWrapper: {
    width: "100%",
    height: 55,
    borderRadius: 30,
    shadowColor: "#B0C0E0",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
    overflow: "hidden",
  },
  loginButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  loginButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    width: "100%",
    justifyContent: "center",
  },
  checkbox: {
    padding: 5,
  },
  agreementText: {
    marginLeft: 8,
    color: "#888",
    fontSize: 13,
  },
  agreementLink: {
    color: "#007AFF",
  },
});
