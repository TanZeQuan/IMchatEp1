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
              <Ionicons name="close" size={24} color="#333" />
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
                  <Ionicons name="checkmark" size={20} color="#4CD964" />
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
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.safeArea}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>创建会议</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="请输入会议主题"
              placeholderTextColor="#B8B8B8"
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
                trackColor={{ false: "#D1D1D1", true: "#4CD964" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D1D1"
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
    backgroundColor: "#FFD860",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  placeholder: { width: 40 },
  content: { flex: 1, paddingTop: 16 },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  input: { fontSize: 15, color: "#333", padding: 0 },
  settingsSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: { fontSize: 15, color: "#333", fontWeight: "500" },
  valueContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  value: { fontSize: 14, color: "#999" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginHorizontal: 16 },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  completeButton: {
    backgroundColor: "#FCD34D",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 60,
    marginHorizontal: 16,
  },
  completeButtonText: { fontSize: 16, fontWeight: "500", color: "#333" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
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
    backgroundColor: "#F5F5F5",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "#4CD964",
    fontWeight: "600",
  },
});

export default CreateMeetingScreen;
