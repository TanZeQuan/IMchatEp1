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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import EmojiPicker from "rn-emoji-keyboard";
import { Audio } from "expo-av";
import VoiceMessage from '../components/VoiceMessage';
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../navigation/MainStack";

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

const COLORS = {
  background: "#FEF3C7",
  header: "#FFD860",
  messageBubbleLeft: "#FFFFFF",
  messageBubbleRight: "#95EC69",
  textPrimary: "#000000",
  inputBg: "#FFD860",
  toolbarBg: "#F7F7F7",
  avatarBg: "#B0B0B0",
  iconBg: "#E8E8E8",
  white: "#fff",
};

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavProp>();
  const route = useRoute();
  const params = route.params as RouteParams;

  const chatPartnerName = params?.chatName || "Alice";

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "other", senderName: chatPartnerName, text: "你好呀 4593年", type: "text" },
    { id: "2", sender: "me", senderName: "我", text: "好的内容", type: "text" },
  ]);
  const [inputText, setInputText] = useState("");
  const [showToolbar, setShowToolbar] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  useEffect(() => {
    setupAudio();
    return () => {
      if (recording) {
        recording.getStatusAsync().then(status => {
          if (status.isRecording) recording.stopAndUnloadAsync().catch(err => console.error(err));
        }).catch(err => console.error(err));
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
      const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
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

  const sendVoiceMessage = (uri: string) => {
    const newMessage: Message = { id: Date.now().toString(), sender: "me", senderName: "我", type: "voice", uri };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = { id: Date.now().toString(), sender: "me", senderName: "我", text: inputText, type: "text" };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
  };

  const toggleToolbar = () => { setShowToolbar(!showToolbar); if (isEmojiPickerOpen) setIsEmojiPickerOpen(false); };
  const toggleEmojiPicker = () => { setIsEmojiPickerOpen(!isEmojiPickerOpen); if (showToolbar) setShowToolbar(false); };
  const handleEmojiSelect = (emoji: any) => setInputText(prev => prev + emoji.emoji);

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.sender === "me" ? styles.messageRowRight : styles.messageRowLeft]}>
      {item.sender === "other" && <View style={styles.avatar}><Ionicons name="person" size={20} color="#666" /></View>}
      <View style={[styles.bubble, item.sender === "me" ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={styles.senderName}>{item.senderName}</Text>
        {item.type === "text" ? <Text style={styles.messageText}>{item.text}</Text> : <VoiceMessage uri={item.uri!} />}
      </View>
      {item.sender === "me" && <View style={styles.avatar}><Ionicons name="person" size={20} color="#666" /></View>}
    </View>
  );

  const ToolbarButton = ({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) => (
    <TouchableOpacity style={styles.toolbarButton}>
      <View style={styles.toolbarIconContainer}><Ionicons name={icon} size={24} color="#333" /></View>
      <Text style={styles.toolbarLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.safeArea}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header with working back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{chatPartnerName}</Text>
          <TouchableOpacity style={styles.moreButton} onPress={() => navigation.navigate("UserDetail", { userId: params?.userId! })}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <FlatList
            data={[...messages].reverse()}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatList}
            inverted
          />

          {/* Input */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={[styles.iconButton, isRecording && styles.recordingButton]} onPressIn={startRecording} onPressOut={stopRecording}>
                <Ionicons name={isRecording ? "stop-circle" : "mic"} size={22} color={isRecording ? "#FF0000" : "#333"} />
              </TouchableOpacity>
              <TextInput style={styles.input} placeholder="输入消息..." value={inputText} onChangeText={setInputText} multiline editable={!isRecording} />
              <TouchableOpacity style={styles.iconButton} onPress={toggleEmojiPicker} disabled={isRecording}>
                <Ionicons name={isEmojiPickerOpen ? "close-circle" : "happy-outline"} size={22} color={isRecording ? "#999" : "#333"} />
              </TouchableOpacity>
              {inputText.trim() ? (
                <TouchableOpacity style={styles.iconButton} onPress={handleSend} disabled={isRecording}>
                  <Ionicons name="send" size={22} color={isRecording ? "#999" : "#333"} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.iconButton} onPress={toggleToolbar} disabled={isRecording}>
                  <Ionicons name={showToolbar ? "close-circle-outline" : "add-circle-outline"} size={22} color={isRecording ? "#999" : "#333"} />
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
          categoryOrder={["smileys_emotion", "people_body", "animals_nature", "food_drink", "travel_places", "activities", "objects", "symbols", "flags"]}
          theme={{ backdrop: "#00000080", knob: "#766dfc", container: "#ffffff", header: "#ffffff", category: { icon: "#766dfc", iconActive: "#766dfc", container: "#e7e7e7", containerActive: "#ffffff" } }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

// Your styles remain exactly the same
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.header, paddingHorizontal: 12, paddingVertical: 10, borderBottomColor: "#D0D0D0" },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: COLORS.textPrimary, flex: 1, textAlign: "center" },
  moreButton: { padding: 4 },
  keyboardAvoidingView: { flex: 1 },
  chatList: { paddingHorizontal: 12, paddingVertical: 16 },
  messageRow: { flexDirection: "row", marginVertical: 6, alignItems: "flex-start" },
  messageRowLeft: { justifyContent: "flex-start" },
  messageRowRight: { justifyContent: "flex-end" },
  avatar: { width: 40, height: 40, borderRadius: 4, backgroundColor: COLORS.avatarBg, justifyContent: "center", alignItems: "center", marginHorizontal: 8 },
  bubble: { maxWidth: "60%", borderRadius: 4, paddingHorizontal: 12, paddingVertical: 10 },
  bubbleLeft: { backgroundColor: COLORS.messageBubbleLeft },
  bubbleRight: { backgroundColor: COLORS.messageBubbleRight },
  senderName: { fontWeight: "bold", marginBottom: 2, fontSize: 14, color: COLORS.textPrimary },
  messageText: { fontSize: 16, color: COLORS.textPrimary, lineHeight: 22 },
  inputSection: { backgroundColor: COLORS.toolbarBg },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.inputBg, paddingHorizontal: 10, paddingVertical: 12, borderTopColor: "#D0D0D0" },
  iconButton: { padding: 8 },
  recordingButton: { backgroundColor: "#FFE5E5", borderRadius: 20 },
  input: { flex: 1, minHeight: 36, maxHeight: 100, backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, color: COLORS.textPrimary },
  recordingIndicator: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, backgroundColor: "#FFE5E5" },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF0000", marginRight: 8 },
  recordingText: { fontSize: 14, color: "#FF0000", fontWeight: "500" },
  toolbar: { backgroundColor: COLORS.toolbarBg, paddingVertical: 25, paddingHorizontal: 15 },
  toolbarRow: { flexDirection: "row", justifyContent: "space-around" },
  toolbarButton: { alignItems: "center", width: 70, margin: 10 },
  toolbarIconContainer: { width: 50, height: 50, borderRadius: 8, backgroundColor: COLORS.iconBg, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  toolbarLabel: { fontSize: 12, color: COLORS.textPrimary },
});
