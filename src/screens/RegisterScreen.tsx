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
import { register } from "../api/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import responsive from "../utils/responsive";
import { colors, borders, typography } from "../styles";

type RegisterPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!nickname || !phone || !email || !password || !confirmPassword) return;

    try {
      const res = await register({ name: nickname, phone, email, password });
      console.log("Register success:", res);

      if (res.error) throw new Error(res.message || "注册失败");

      const userId = res.response; // backend userId
      const token = res.token || userId; // optional token

      // ✅ Save all info keyed by backend userId
      await AsyncStorage.multiSet([
        ["userId", userId], // current logged-in user
        ["userToken", token],
        [`userName_${userId}`, nickname],
        [`userEmail_${userId}`, email],
        [`userPhone_${userId}`, phone],
        [`userAvatar_${userId}`, ""], // optional empty
      ]);

      console.log("用户信息已存储到 AsyncStorage:", {
        userId,
        nickname,
        phone,
        email,
      });

      Alert.alert("成功", "注册成功！", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err: any) {
      console.error("Register error:", err);
      Alert.alert("错误", err?.message || "注册失败");
    }
  };


  const isButtonDisabled =
    isLoading ||
    !nickname ||
    !phone ||
    !email ||
    !password ||
    !confirmPassword ||
    !isChecked;

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

          <Text style={styles.title}>注册</Text>

          {/* 昵称 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="请输入昵称"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
              editable={!isLoading}
              placeholderTextColor={colors.text.lightGray}
            />
          </View>

          {/* 手机号 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="请输入手机号"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
              editable={!isLoading}
              placeholderTextColor={colors.text.lightGray}
            />
          </View>

          {/* 邮箱 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="请输入邮箱"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              placeholderTextColor={colors.text.lightGray}
            />
          </View>

          {/* 密码 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="请输入密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              editable={!isLoading}
              placeholderTextColor={colors.text.lightGray}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={responsive.f(22)}
                color={colors.text.grayMedium}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          {/* 确认密码 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!isConfirmPasswordVisible}
              editable={!isLoading}
              placeholderTextColor={colors.text.lightGray}
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <Ionicons
                name={
                  isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"
                }
                size={responsive.f(22)}
                color={colors.text.grayMedium}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          {/* 已有账户 */}
          <View style={styles.linksContainer}>
            <View />
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>已有账户</Text>
            </TouchableOpacity>
          </View>

          {/* 注册按钮 */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isButtonDisabled}
            style={[styles.loginButtonWrapper, isButtonDisabled && styles.disabledButton]}
          >
            <LinearGradient
              colors={colors.background.gradientWhite}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "注册中..." : "注册"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 同意协议 */}
          <View style={styles.agreementContainer}>
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)}
              style={styles.checkbox}
            >
              <Ionicons
                name={isChecked ? "checkbox" : "square-outline"}
                size={responsive.f(18)}
                color={isChecked ? colors.functional.blue : colors.text.grayMedium}
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
  title: { fontSize: responsive.f(typography.fontSize28), fontWeight: typography.fontWeightBold, marginBottom: responsive.h(30), color: colors.text.blackMedium },
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
  inputField: { flex: 1, fontSize: responsive.f(typography.fontSize16), color: colors.text.blackMedium, height: "100%" },
  icon: { marginLeft: responsive.w(10) },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: responsive.h(30),
    paddingHorizontal: responsive.s(15),
  },
  linkText: { color: colors.text.veryDarkGray, fontSize: responsive.f(typography.fontSize14) },
  loginButtonWrapper: {
    width: "100%",
    height: responsive.h(55),
    borderRadius: responsive.w(borders.radius30),
    shadowColor: colors.shadow.blue,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: responsive.h(-10),
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
  loginButtonText: { color: colors.text.blackMedium, fontSize: responsive.f(typography.fontSize16), fontWeight: typography.fontWeightBold },
  disabledButton: { opacity: 0.6 },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsive.h(25),
    width: "100%",
    justifyContent: "center",
  },
  checkbox: { padding: responsive.w(5) },
  agreementText: { marginLeft: responsive.w(8), color: colors.text.grayMedium, fontSize: responsive.f(typography.fontSize13) },
  agreementLink: { color: colors.functional.blue },
});

export default RegisterScreen;
