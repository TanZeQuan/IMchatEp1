// ChatScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import EmojiPicker from "rn-emoji-keyboard";
import { Audio } from "expo-av";
import { sendVoiceMessageToApi } from "../api/VoiceMessageApi";
import VoiceMessage from '../components/VoiceMessage';
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../navigation/MainStack";
import { colors, borders, typography } from "../styles";

type ChatScreenNavProp = NativeStackNavigationProp<MainStackParamList, "Chat">;

interface Message {
  id: string;
  sender: "me" | "other";
  senderName: string;
  text?: string;
  type: "text" | "voice";
  uri?: string;
}

interface RouteParams {
  chatName?: string;
  userId?: string;
}

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavProp>();
  const route = useRoute();
  const params = route.params as RouteParams;

  const chatPartnerName = params?.chatName || "Alice";

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "other",
      senderName: chatPartnerName,
      text: "你好呀 4593年",
      type: "text",
    },
    { id: "2", sender: "me", senderName: "我", text: "好的内容", type: "text" },
  ]);
  const [inputText, setInputText] = useState("");
  const [showToolbar, setShowToolbar] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  useEffect(() => {
    setupAudio();
    return () => {
      if (recording) {
        recording
          .getStatusAsync()
          .then((status) => {
            if (status.isRecording)
              recording.stopAndUnloadAsync().catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      setPermissionGranted(permission.status === "granted");
      if (permission.status !== "granted") return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (err) {
      console.error(err);
      Alert.alert("错误", "音频设置失败");
    }
  };

  const startRecording = async () => {
    if (isRecording || recording) return;

    if (!permissionGranted) {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") return;
      setPermissionGranted(true);
      await setupAudio();
    }

    try {
      setIsRecording(true);
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      Alert.alert("错误", "录音启动失败，请重试");
    }
  };

  const stopRecording = async () => {
    if (!recording) return setIsRecording(false);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);
      if (uri) sendVoiceMessage(uri);
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      setRecording(null);
      Alert.alert("错误", "停止录音失败");
    }
  };

  // 链接后端 API
  const sendVoiceMessage = async (uri: string) => {
    try {
      const responseData = await sendVoiceMessageToApi(uri);
      console.log("Backend response for voice message:", responseData);

      // Assuming the API call was successful, add to local state
      const newMessage: Message = { id: Date.now().toString(), sender: "me", senderName: "我", type: "voice", uri };
      setMessages(prev => [...prev, newMessage]);
    } catch (err) {
      // The error is already logged in the API function, and an Alert is shown.
      // You could add additional component-specific error handling here if needed.
      console.log("Failed to send voice message from ChatScreen.");
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "me",
      senderName: "我",
      text: inputText,
      type: "text",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const toggleToolbar = () => {
    setShowToolbar(!showToolbar);
    if (isEmojiPickerOpen) setIsEmojiPickerOpen(false);
  };
  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
    if (showToolbar) setShowToolbar(false);
  };
  const handleEmojiSelect = (emoji: any) =>
    setInputText((prev) => prev + emoji.emoji);

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageRow,
        item.sender === "me" ? styles.messageRowRight : styles.messageRowLeft,
      ]}
    >
      {item.sender === "other" && (
        <View style={styles.avatar}>
          <Image
            source={{ uri: "https://postimg.cc/34y84VvN" }}
            style={styles.avatarImage}
          />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          item.sender === "me" ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        <Text style={styles.senderName}>{item.senderName}</Text>
        {item.type === "text" ? (
          <Text style={styles.messageText}>{item.text}</Text>
        ) : (
          <VoiceMessage uri={item.uri!} />
        )}
      </View>
      {item.sender === "me" && (
        <View style={styles.avatar}>
          <Image
            source={{ uri: "https://postimg.cc/34y84VvN" }}
            style={styles.avatarImage}
          />
        </View>
      )}
    </View>
  );

  const ToolbarButton = ({
    icon,
    label,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
  }) => (
    <TouchableOpacity style={styles.toolbarButton}>
      <View style={styles.toolbarIconContainer}>
        <Ionicons name={icon} size={24} color="#333" />
      </View>
      <Text style={styles.toolbarLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={colors.background.gradientYellow}
      style={styles.safeArea}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header with working back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.replace('Home')}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{chatPartnerName}</Text>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() =>
              navigation.navigate("UserDetail", { userId: params?.userId! })
            }
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FlatList
            data={[...messages].reverse()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            inverted
          />

          {/* Input */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  isRecording && styles.recordingButton,
                ]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
              >
                <Ionicons
                  name={isRecording ? "stop-circle" : "mic"}
                  size={22}
                  color={isRecording ? "#FF0000" : "#333"}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="输入消息..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                editable={!isRecording}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleEmojiPicker}
                disabled={isRecording}
              >
                <Ionicons
                  name={isEmojiPickerOpen ? "close-circle" : "happy-outline"}
                  size={22}
                  color={isRecording ? "#999" : "#333"}
                />
              </TouchableOpacity>
              {inputText.trim() ? (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleSend}
                  disabled={isRecording}
                >
                  <Ionicons
                    name="send"
                    size={22}
                    color={isRecording ? "#999" : "#333"}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={toggleToolbar}
                  disabled={isRecording}
                >
                  <Ionicons
                    name={
                      showToolbar
                        ? "close-circle-outline"
                        : "add-circle-outline"
                    }
                    size={22}
                    color={isRecording ? "#999" : "#333"}
                  />
                </TouchableOpacity>
              )}
            </View>

            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>正在录音...</Text>
              </View>
            )}

            {showToolbar && !isRecording && (
              <View style={styles.toolbar}>
                <View style={styles.toolbarRow}>
                  <ToolbarButton icon="image-outline" label="图片" />
                  <ToolbarButton icon="play-circle-outline" label="视频" />
                  <ToolbarButton icon="call-outline" label="通话" />
                  <ToolbarButton icon="videocam-outline" label="视频通话" />
                </View>
                <View style={styles.toolbarRow}>
                  <ToolbarButton icon="document-outline" label="文件" />
                  <ToolbarButton icon="card-outline" label="个人名片" />
                  <ToolbarButton icon="wallet-outline" label="群名片" />
                  <View style={styles.toolbarButton} />
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>

        {/* Emoji Picker */}
        <EmojiPicker
          onEmojiSelected={handleEmojiSelect}
          open={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
          categoryPosition="top"
          enableSearchBar
          enableCategoryChangeAnimation
          enableRecentlyUsed
          categoryOrder={[
            "smileys_emotion",
            "people_body",
            "animals_nature",
            "food_drink",
            "travel_places",
            "activities",
            "objects",
            "symbols",
            "flags",
          ]}
          theme={{
            backdrop: "#00000080",
            knob: "#766dfc",
            container: "#ffffff",
            header: "#ffffff",
            category: {
              icon: "#766dfc",
              iconActive: "#766dfc",
              container: "#e7e7e7",
              containerActive: "#ffffff",
            },
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

// Your styles remain exactly the same
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.yellowBright,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomColor: colors.border.medium,
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.text.primary,
    flex: 1,
    textAlign: "center",
  },
  moreButton: { padding: 4 },
  keyboardAvoidingView: { flex: 1 },
  chatList: { paddingHorizontal: 12, paddingVertical: 16 },
  messageRow: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-start",
  },
  messageRowLeft: { justifyContent: "flex-start" },
  messageRowRight: { justifyContent: "flex-end" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borders.radius4,
    backgroundColor: colors.functional.avatarGray,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    overflow: "hidden",
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  bubble: {
    maxWidth: "60%",
    borderRadius: borders.radius4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bubbleLeft: { backgroundColor: colors.background.white },
  bubbleRight: { backgroundColor: colors.functional.green },
  senderName: {
    fontWeight: typography.fontWeightBold,
    marginBottom: 2,
    fontSize: typography.fontSize14,
    color: colors.text.primary,
  },
  messageText: {
    fontSize: typography.fontSize16,
    color: colors.text.primary,
    lineHeight: typography.lineHeight22,
  },
  inputSection: { backgroundColor: colors.background.grayLight },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.yellowBright,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopColor: colors.border.medium,
  },
  iconButton: { padding: 8 },
  recordingButton: {
    backgroundColor: colors.background.redLight,
    borderRadius: borders.radius20,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: colors.background.whiteAlt,
    borderRadius: borders.radius10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.fontSize16,
    color: colors.text.primary,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: colors.background.redLight,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: borders.radius4,
    backgroundColor: colors.functional.red,
    marginRight: 8,
  },
  recordingText: {
    fontSize: typography.fontSize14,
    color: colors.functional.red,
    fontWeight: typography.fontWeight500,
  },
  toolbar: {
    backgroundColor: colors.background.grayLight,
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  toolbarRow: { flexDirection: "row", justifyContent: "space-around" },
  toolbarButton: { alignItems: "center", width: 70, margin: 10 },
  toolbarIconContainer: {
    width: 50,
    height: 50,
    borderRadius: borders.radius8,
    backgroundColor: colors.background.iconBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  toolbarLabel: { fontSize: typography.fontSize12, color: colors.text.primary },
});
