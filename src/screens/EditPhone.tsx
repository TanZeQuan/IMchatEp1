import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; // ✅ import navigation
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack"; // adjust path

const EditPhoneScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("+6011****00");
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleGoBack = () => {
    navigation.goBack(); // ✅ navigate back
  };

  const handleClearPhone = () => {
    setPhoneNumber("");
  };

  const handleUploadRecord = () => {
    console.log("Upload record");
    // navigation.navigate('UploadRecord'); // add if screen exists
  };

  const handleChangePassword = () => {
    console.log("Change phone number");
    // navigation.navigate('ResetPassword'); // navigate to reset phone/password
  };

  return (
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>手机号码</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="请输入手机号码"
              placeholderTextColor="#B8B8B8"
              keyboardType="phone-pad"
              editable={true}
            />
            {phoneNumber.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearPhone}
                activeOpacity={0.6}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleUploadRecord}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>上传通讯录</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChangePassword}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>更改手机号码</Text>
          </TouchableOpacity>
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
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  placeholder: { width: 40 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 52,
    marginBottom: 100,
  },
  input: { flex: 1, fontSize: 15, color: "#333" },
  clearButton: { padding: 4, marginLeft: 8 },
  actionButton: {
    backgroundColor: "#FCD34D",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginHorizontal: 16,
  },
  actionButtonText: { fontSize: 16, fontWeight: "600", color: "#333" },
});

export default EditPhoneScreen;
