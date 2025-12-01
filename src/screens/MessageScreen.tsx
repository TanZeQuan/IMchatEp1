import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borders, typography } from "../styles";

import { getChatsForUser } from "../api/message";

// --- TypeScript Interfaces ---
interface ChatItemType {
  chat_id: string;
  name: string;
  image: string;
  isdelete: number;
  istype: number; // 1 for single, 2 for group
  // Making these optional or providing default values for now as they are not directly from the API response
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  avatars?: string[];
}

import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../store/userStore";

// --- 聊天项组件 ---
const ChatItem = ({
  item,
  navigation,
}: {
  item: ChatItemType;
  navigation: any;
}) => {
  // Use item.istype for type check: 1 for single, 2 for group
  const isGroupChat = item.istype === 2;

  const renderAvatar = () => {
    if (isGroupChat) {
      if (item.avatars && item.avatars.length > 0) {
        return (
          <View style={styles.groupAvatarContainer}>
            {item.avatars.slice(0, 4).map((url: string, index: number) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.groupAvatarImage}
              />
            ))}
          </View>
        );
      } else {
        return (
          <View style={styles.avatarPlaceholder}>
            <Image
              source={{ uri: item.image || "https://postimg.cc/34y84VvN" }}
              style={styles.avatarImage}
            />
          </View>
        );
      }
    }
    return (
      <View style={styles.avatarPlaceholder}>
        <Image
          source={{ uri: item.image || "https://postimg.cc/34y84VvN" }}
          style={styles.avatarImage}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate("Chat", { chatName: item.name, chatId: item.chat_id })}
    >
      <View style={styles.chatItemContainer}>
        <View style={styles.avatarWrapper}>
          {renderAvatar()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          {/* Temporarily removed lastMessage, time, and badge for debugging */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- 页面主组件 ---
export default function ChatListScreen() {
  const navigation = useNavigation();
  const { userId } = useUserStore(); // Changed from userToken to userId
  const [searchText, setSearchText] = React.useState("");
  const [debouncedText, setDebouncedText] = React.useState("");
  const [chatData, setChatData] = React.useState<ChatItemType[]>([]);

  // Fetch chat data
  React.useEffect(() => {
    if (userId) { // Check for userId
      getChatsForUser(userId) // Pass userId
        .then(data => {
          // Assuming the API returns an array, otherwise we might need to adapt
          if (data && Array.isArray(data.response)) {
            setChatData(data.response); // Set chatData to data.response
          } else {
            console.error("Fetched data.response is not an array or data is null/undefined:", data);
            // Handle cases where API might return a different structure on error or no-data
            setChatData([]);
          }
        })
        .catch(error => {
          console.error("Failed to fetch chats:", error);
          // Optionally, show an error message to the user
          setChatData([]); // Clear data on error
        });
    }
  }, [userId]); // Depend on userId

  // 防抖逻辑
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(searchText);
    }, 300); // 300ms 延迟
    return () => clearTimeout(handler); // 清理上一次定时器
  }, [searchText]);

  // 根据 debouncedText 过滤聊天列表
  const filteredData = React.useMemo(() => {
    if (!debouncedText.trim()) return chatData;
    return chatData.filter((item) =>
      item.name.toLowerCase().startsWith(debouncedText.toLowerCase())
    );
  }, [debouncedText, chatData]);

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>森通</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarContainer}>
            <Ionicons
              name="search"
              size={18}
              color={colors.text.lightGray}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="搜索"
              placeholderTextColor={colors.text.lightGray}
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={20} color={colors.text.grayLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.chat_id}
          renderItem={({ item }) => (
            <ChatItem item={item} navigation={navigation} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- 样式 ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.background.yellow,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight600,
    color: colors.text.primary,
  },
  searchSection: {
    backgroundColor: colors.background.yellow,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.white,
    borderRadius: borders.radius8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize15,
    color: colors.text.primary,
    padding: 0,
  },
  listContent: {
    paddingTop: 10,
  },
  chatItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.white,
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 8,
    borderRadius: borders.radius10,
    borderBottomWidth: borders.width05,
    borderBottomColor: colors.border.whiteAlt,

    // iOS Shadow
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // Android Shadow
    elevation: 5,
  },
  avatarWrapper: {
    marginRight: 12,
    position: "relative",
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borders.radius8,
    backgroundColor: colors.functional.avatarPlaceholder,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
  groupAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: borders.radius8,
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    backgroundColor: colors.functional.avatarPlaceholder,
  },
  groupAvatarImage: {
    width: "50%",
    height: "50%",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.functional.redPale,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: borders.width2,
    borderColor: colors.background.white,
  },
  badgeText: {
    color: colors.background.white,
    fontSize: typography.fontSize11,
    fontWeight: typography.fontWeightBold,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.text.primary,
    marginBottom: 8,
  },
  messageText: {
    fontSize: typography.fontSize14,
    color: colors.text.lightGray,
    lineHeight: typography.lineHeight18,
  },
  metaContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingBottom: 20,
  },
  timeText: {
    fontSize: typography.fontSize12,
    color: colors.text.lightGray,
  },
});
