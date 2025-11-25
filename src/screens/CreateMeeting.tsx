import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borders, typography } from "../styles";

interface SettingItemProps {
  label: string;
  value: string;
  onPress: () => void;
  showArrow?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  label,
  value,
  onPress,
  showArrow = true,
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueContainer}>
      <Text style={styles.value}>{value}</Text>
      {showArrow && <Ionicons name="chevron-forward" size={18} color="#999" />}
    </View>
  </TouchableOpacity>
);

const CreateMeetingScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [meetingTopic, setMeetingTopic] = useState("");
  const [requirePassword, setRequirePassword] = useState(false);
  const [startTime, setStartTime] = useState("11月10日 12:10");
  const [duration, setDuration] = useState("30分钟");
  const [audioEnabled, setAudioEnabled] = useState("开启");

  const timeOptions = [
    "11月10日 12:10",
    "11月11日 09:00",
    "11月11日 14:00",
    "11月12日 10:00",
    "11月12日 15:30",
    "11月13日 12:30",
    "11月13日 14:30",
    "11月14日 10:30",
  ];

  const durationOptions = [
    "15分钟",
    "30分钟",
    "45分钟",
    "60分钟",
    "90分钟",
    "120分钟",
  ];

  const audioOptions = ["开启", "关闭"];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenTimePicker = () => {
    setShowTimeModal(true);
  };

  const handleOpenDurationPicker = () => {
    setShowDurationModal(true);
  };

  const handleOpenAudioPicker = () => {
    setShowAudioModal(true);
  };

  const handleComplete = () => {
    if (!meetingTopic.trim()) {
      alert("请输入会议主题");
      return;
    }

    const meetingData = {
      topic: meetingTopic,
      startTime,
      duration,
      audioEnabled,
      requirePassword,
    };

    console.log("Create meeting:", meetingData);
    // Navigate back or show success
    navigation.goBack();
  };

  const PickerModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    title: string;
  }> = ({ visible, onClose, options, selectedValue, onSelect, title }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.blackMedium} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  selectedValue === option && styles.optionItemSelected,
                ]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {selectedValue === option && (
                  <Ionicons name="checkmark" size={20} color={colors.functional.greenBright} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.blackMedium} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>创建会议</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="请输入会议主题"
              placeholderTextColor={colors.border.dark}
              value={meetingTopic}
              onChangeText={setMeetingTopic}
            />
          </View>

          <View style={styles.settingsSection}>
            <SettingItem
              label="开始时间"
              value={startTime}
              onPress={handleOpenTimePicker}
            />
            <View style={styles.divider} />
            <SettingItem
              label="会议时长"
              value={duration}
              onPress={handleOpenDurationPicker}
            />
            <View style={styles.divider} />
            <SettingItem
              label="成员入会开启语音"
              value={audioEnabled}
              onPress={handleOpenAudioPicker}
            />
            <View style={styles.divider} />
            <View style={styles.switchItem}>
              <Text style={styles.label}>入会密码</Text>
              <Switch
                value={requirePassword}
                onValueChange={setRequirePassword}
                trackColor={{ false: colors.border.darker, true: colors.functional.greenBright }}
                thumbColor={colors.background.white}
                ios_backgroundColor={colors.border.darker}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>完成</Text>
          </TouchableOpacity>
        </View>

        <PickerModal
          visible={showTimeModal}
          onClose={() => setShowTimeModal(false)}
          options={timeOptions}
          selectedValue={startTime}
          onSelect={setStartTime}
          title="选择开始时间"
        />

        <PickerModal
          visible={showDurationModal}
          onClose={() => setShowDurationModal(false)}
          options={durationOptions}
          selectedValue={duration}
          onSelect={setDuration}
          title="选择会议时长"
        />

        <PickerModal
          visible={showAudioModal}
          onClose={() => setShowAudioModal(false)}
          options={audioOptions}
          selectedValue={audioEnabled}
          onSelect={setAudioEnabled}
          title="成员入会开启语音"
        />
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
    // backgroundColor: "#F5E6B3"
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
  headerTitle: { fontSize: typography.fontSize16, fontWeight: typography.fontWeight600, color: colors.text.blackMedium },
  placeholder: { width: 40 },
  content: { flex: 1, paddingTop: 16 },
  inputContainer: {
    backgroundColor: colors.background.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: borders.radius12,
  },
  input: { fontSize: typography.fontSize15, color: colors.text.blackMedium, padding: 0 },
  settingsSection: {
    backgroundColor: colors.background.white,
    marginHorizontal: 16,
    borderRadius: borders.radius12,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: { fontSize: typography.fontSize15, color: colors.text.blackMedium, fontWeight: typography.fontWeight500 },
  valueContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  value: { fontSize: typography.fontSize14, color: colors.text.lightGray },
  divider: { height: 1, backgroundColor: colors.background.gray, marginHorizontal: 16 },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  completeButton: {
    backgroundColor: colors.background.yellowLight,
    borderRadius: borders.radius30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 60,
    marginHorizontal: 16,
  },
  completeButtonText: { fontSize: typography.fontSize16, fontWeight: typography.fontWeight500, color: colors.text.blackMedium },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background.transparentBlack50,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background.white,
    borderTopLeftRadius: borders.radius20,
    borderTopRightRadius: borders.radius20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: borders.width1,
    borderBottomColor: colors.background.gray,
  },
  modalTitle: {
    fontSize: typography.fontSize17,
    fontWeight: typography.fontWeight600,
    color: colors.text.blackMedium,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionItemSelected: {
    backgroundColor: colors.background.grayLight,
  },
  optionText: {
    fontSize: typography.fontSize16,
    color: colors.text.blackMedium,
  },
  optionTextSelected: {
    color: colors.functional.greenBright,
    fontWeight: typography.fontWeight600,
  },
});

export default CreateMeetingScreen;
