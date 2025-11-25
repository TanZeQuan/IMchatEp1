import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native"; // ✅ Import navigation hook
import { colors, borders, typography } from "../styles";

interface NotificationItemProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  label,
  value,
  onToggle,
}) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.border.darker, true: colors.functional.greenBright }}
      thumbColor={colors.background.white}
      ios_backgroundColor={colors.border.darker}
    />
  </View>
);

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation(); // ✅ Get navigation instance

  const [messageNotification, setMessageNotification] = useState(false);
  const [voiceNotification, setVoiceNotification] = useState(true);
  const [videoNotification, setVideoNotification] = useState(false);

  const handleGoBack = () => {
    navigation.goBack(); // ✅ Navigate back
  };

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>通知</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Notification Items */}
        <View style={styles.content}>
          <NotificationItem
            label="信息通知"
            value={messageNotification}
            onToggle={setMessageNotification}
          />
          <NotificationItem
            label="语音通知"
            value={voiceNotification}
            onToggle={setVoiceNotification}
          />
          <NotificationItem
            label="视频通知"
            value={videoNotification}
            onToggle={setVideoNotification}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5E6B3',
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
    alignItems: "flex-start",
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
    backgroundColor: colors.background.white,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: borders.width1,
    borderBottomColor: colors.background.gray,
  },
  label: {
    fontSize: typography.fontSize15,
    color: colors.text.blackMedium,
  },
});

export default NotificationSettingsScreen;
