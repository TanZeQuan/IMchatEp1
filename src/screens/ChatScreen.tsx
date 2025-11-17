import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import EmojiPicker from "rn-emoji-keyboard";
import { wsService } from "../api/WebSocketService";

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

interface Message {
  id: string;
  sender: "me" | "other";
  senderName: string;
  text: string;
}

interface RouteParams {
  chatName?: string;
  userId?: string;
}

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;

  // Get chat partner's name from navigation params or use default
  const chatPartnerName = params?.chatName || "Alice";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "other",
      senderName: chatPartnerName,
      text: "你好呀 4593年",
    },
    { id: "2", sender: "me", senderName: "我", text: "好的内容" },
  ]);

  const [inputText, setInputText] = useState("");
  const [showToolbar, setShowToolbar] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "me",
      senderName: "我",
      text: inputText,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
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

  const handleEmojiSelect = (emoji: any) => {
    setInputText((prev) => prev + emoji.emoji);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageRow,
        item.sender === "me" ? styles.messageRowRight : styles.messageRowLeft,
      ]}
    >
      {item.sender === "other" && (
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#666" />
        </View>
      )}

      <View
        style={[
          styles.bubble,
          item.sender === "me" ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        <Text style={styles.senderName}>{item.senderName}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>

      {item.sender === "me" && (
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#666" />
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
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.safeArea}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{chatPartnerName}</Text>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Chat Messages */}
          <FlatList
            data={[...messages].reverse()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            inverted
          />

          {/* Input Area */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="mic" size={22} color="#333" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="输入消息..."
                value={inputText}
                onChangeText={setInputText}
                multiline
              />

              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleEmojiPicker}
              >
                <Ionicons
                  name={isEmojiPickerOpen ? "close-circle" : "happy-outline"}
                  size={22}
                  color="#333"
                />
              </TouchableOpacity>

              {inputText.trim() ? (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleSend}
                >
                  <Ionicons name="send" size={22} color="#333" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={toggleToolbar}
                >
                  <Ionicons
                    name={
                      showToolbar
                        ? "close-circle-outline"
                        : "add-circle-outline"
                    }
                    size={22}
                    color="#333"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Toolbar - Collapsible */}
            {showToolbar && (
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

        {/* Emoji Picker Modal */}
        <EmojiPicker
          onEmojiSelected={handleEmojiSelect}
          open={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
          categoryPosition="top"
          enableSearchBar
          enableCategoryChangeAnimation
          enableRecentlyUsed
          categoryOrder={[
            'smileys_emotion',
            'people_body',
            'animals_nature',
            'food_drink',
            'travel_places',
            'activities',
            'objects',
            'symbols',
            'flags',
          ]}
          theme={{
            backdrop: '#00000080',
            knob: '#766dfc',
            container: '#ffffff',
            header: '#ffffff',
            category: {
              icon: '#766dfc',
              iconActive: '#766dfc',
              container: '#e7e7e7',
              containerActive: '#ffffff',
            },
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.header,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomColor: "#D0D0D0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  moreButton: {
    padding: 4,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatList: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-start",
  },
  messageRowLeft: {
    justifyContent: "flex-start",
  },
  messageRowRight: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: COLORS.avatarBg,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  bubble: {
    maxWidth: "60%",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bubbleLeft: {
    backgroundColor: COLORS.messageBubbleLeft,
  },
  bubbleRight: {
    backgroundColor: COLORS.messageBubbleRight,
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  inputSection: {
    backgroundColor: COLORS.toolbarBg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopColor: "#D0D0D0",
  },
  iconButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  toolbar: {
    backgroundColor: COLORS.toolbarBg,
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  toolbarRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  toolbarButton: {
    alignItems: "center",
    width: 70,
    margin: 10,
  },
  toolbarIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.iconBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  toolbarLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
});