import React, { useState } from "react";
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
import { colors, borders, typography } from "../styles";

const ResetEmailScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!currentEmail || !newEmail || !confirmEmail) {
      return Alert.alert("提示", "请填写所有邮箱信息");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail) || !emailRegex.test(newEmail)) {
      return Alert.alert("提示", "请输入有效的邮箱地址");
    }

    if (newEmail !== confirmEmail) {
      return Alert.alert("提示", "新邮箱与确认邮箱不匹配");
    }

    setLoading(true);
    try {
      // 调用最新的 changeEmail API
      await changeEmail({ email: newEmail }); // 注意后端只需要 newEmail
      Alert.alert("成功", "邮箱修改成功", [
        { text: "确定", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert("失败", error?.message || "邮箱修改失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>更改邮箱</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Current Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.text.darkGray}
              style={styles.inputIcon}
            />
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

          {/* New Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.text.darkGray}
              style={styles.inputIcon}
            />
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

          {/* Confirm Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.text.darkGray}
              style={styles.inputIcon}
            />
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

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.blackMedium} />
            ) : (
              <Text style={styles.submitButtonText}>提交</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.grayLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.yellowBright,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight600,
    color: colors.text.blackMedium,
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.white,
    borderRadius: borders.radius25,
    paddingHorizontal: 25,
    marginBottom: 25,
    height: 50,
    shadowColor: colors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize14,
    color: colors.text.blackMedium,
  },
  submitButton: {
    backgroundColor: colors.background.yellowLight,
    borderRadius: borders.radius30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 60,
    marginHorizontal: 16,
  },
  submitButtonText: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.text.blackMedium,
  },
});

export default ResetEmailScreen;
