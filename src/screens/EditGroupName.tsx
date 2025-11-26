import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";
import { colors, borders, typography } from "../styles";

const EditGroupNameScreen: React.FC = () => {
  const [name, setName] = useState("越狱的猫");
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleClearName = () => {
    setName("");
  };

  const handleConfirm = () => {
    if (!name.trim()) {
      alert("请输入群组名称");
      return;
    }
    console.log("Group Name updated:", name);
    handleGoBack();
  };

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>群组名称</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="请输入群组名称"
              placeholderTextColor={colors.border.dark}
            />
            {name.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearName}
                activeOpacity={0.6}
              >
                <Ionicons name="close-circle" size={20} color={colors.text.lightGray} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>确认更改</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.yellowBright,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight600,
    color: colors.text.blackMedium,
  },
  placeholder: { width: 40 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.white,
    borderRadius: borders.radius30,
    paddingHorizontal: 20,
    height: 52,
    marginBottom: 24,
  },
  input: { flex: 1, fontSize: typography.fontSize15, color: colors.text.blackMedium },
  clearButton: { padding: 4, marginLeft: 8 },
  confirmButton: {
    backgroundColor: colors.background.yellowLight,
    borderRadius: borders.radius30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 60,
    marginHorizontal: 16,
  },
  confirmButtonText: { fontSize: typography.fontSize16, fontWeight: typography.fontWeight500, color: colors.text.blackMedium },
});

export default EditGroupNameScreen;
