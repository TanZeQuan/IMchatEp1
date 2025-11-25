import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borders, typography } from "../styles";

const JoinMeetingScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [meetingId, setMeetingId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleJoinMeeting = () => {
    console.log("Join meeting:", {
      meetingId,
      displayName,
      micEnabled,
      cameraEnabled,
    });
    // You can navigate to actual meeting screen if needed
  };

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>加入会议</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>会议号</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入会议号"
                placeholderTextColor={colors.border.dark}
                value={meetingId}
                onChangeText={setMeetingId}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>您的名字</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入您想显示的名字"
                placeholderTextColor={colors.border.dark}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>
          </View>

          <View style={styles.switchSection}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>开启麦克风</Text>
              <Switch
                value={micEnabled}
                onValueChange={setMicEnabled}
                trackColor={{ false: colors.border.darker, true: colors.functional.greenBright }}
                thumbColor={colors.background.white}
                ios_backgroundColor={colors.border.darker}
              />
            </View>

            <View style={styles.switchDivider} />

            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>开启摄像头</Text>
              <Switch
                value={cameraEnabled}
                onValueChange={setCameraEnabled}
                trackColor={{ false: colors.border.darker, true: colors.functional.greenBright }}
                thumbColor={colors.background.white}
                ios_backgroundColor={colors.border.darker}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoinMeeting}
            activeOpacity={0.8}
          >
            <Text style={styles.joinButtonText}>加入会议</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: "#F5E6B3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.yellowBright,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputSection: {
    backgroundColor: colors.background.white,
    borderRadius: borders.radius12,
    overflow: "hidden",
  },
  inputGroup: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: typography.fontSize15,
    color: colors.text.blackMedium,
    fontWeight: typography.fontWeight500,
    marginBottom: 8,
  },
  input: {
    fontSize: typography.fontSize14,
    color: colors.text.blackMedium,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background.gray,
    marginHorizontal: 16,
  },
  switchSection: {
    backgroundColor: colors.background.white,
    borderRadius: borders.radius12,
    marginTop: 12,
    overflow: "hidden",
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  switchLabel: {
    fontSize: typography.fontSize15,
    color: colors.text.blackMedium,
    fontWeight: typography.fontWeight500,
  },
  switchDivider: {
    height: 1,
    backgroundColor: colors.background.gray,
    marginHorizontal: 16,
  },
  joinButton: {
    backgroundColor: colors.background.yellowLight,
    borderRadius: borders.radius30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 60,
    marginHorizontal: 16,
  },
  joinButtonText: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.text.blackMedium,
  },
});

export default JoinMeetingScreen;
