import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borders, typography } from "../styles";

interface MeetingItemProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const MeetingItem: React.FC<MeetingItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.itemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.background.white} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.text.lightGray} />
  </TouchableOpacity>
);

const MeetingScreen: React.FC = () => {
  // ✅ Typed navigation
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleJoinMeeting = () => {
    navigation.navigate("JoinMeeting");
  };

  const handleCreateMeeting = () => {
    navigation.navigate("CreateMeeting");
  };

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>会议</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Meeting Items */}
        <View style={styles.content}>
          <MeetingItem
            icon="enter-outline"
            label="加入会议"
            onPress={handleJoinMeeting}
          />
          <MeetingItem
            icon="videocam-outline"
            label="创建会议"
            onPress={handleCreateMeeting}
          />
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
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.white,
    borderRadius: borders.radius20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 60,

    // iOS Shadow
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // Android Shadow
    elevation: 5,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borders.radius18,
    backgroundColor: colors.text.veryDarkGray,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: typography.fontSize15,
    color: colors.text.blackMedium,
    fontWeight: typography.fontWeight500,
  },
});

export default MeetingScreen;
