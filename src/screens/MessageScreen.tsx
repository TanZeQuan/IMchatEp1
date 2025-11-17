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

const COLORS = {
  background: "#F5F5F5",
  header: "#F4D03F",
  card: "#FFFFFF",
  textPrimary: "#222222",
  textSecondary: "#999999",
  badge: "#FF6B6B",
  avatarPlaceholder: "#D3D3D3",
  searchBg: "#FFFFFF",
};

// --- 模拟数据 ---
const DUMMY_DATA: ChatItemType[] = [
  {
    id: "1",
    name: "妈妈",
    lastMessage: "好的,去吧",
    time: "2:44 PM",
    type: "single",
    unreadCount: 0,
    avatars: [],
  },
  {
    id: "2",
    name: "闺蜜",
    lastMessage: "对啊 哈哈",
    time: "2:44 PM",
    type: "single",
    unreadCount: 0,
    avatars: [],
  },
  {
    id: "3",
    name: "姐姐",
    lastMessage: "OK",
    time: "2:44 PM",
    type: "single",
    unreadCount: 0,
    avatars: [],
  },
  {
    id: "4",
    name: "疯子群",
    lastMessage: "哈哈哈哈哈",
    time: "2:44 PM",
    type: "group",
    unreadCount: 0,
    avatars: [
      "https://i.pravatar.cc/150?img=11",
      "https://i.pravatar.cc/150?img=12",
      "https://i.pravatar.cc/150?img=13",
      "https://i.pravatar.cc/150?img=14",
    ],
  },
  {
    id: "5",
    name: "Leo",
    lastMessage: "Noooooo",
    time: "2:44 PM",
    type: "single",
    unreadCount: 0,
    avatars: [],
  },
  {
    id: "6",
    name: "家长群",
    lastMessage: "周末了！",
    time: "2:44 PM",
    type: "group",
    unreadCount: 0,
    avatars: [
      "https://i.pravatar.cc/150?img=15",
      "https://i.pravatar.cc/150?img=16",
      "https://i.pravatar.cc/150?img=17",
      "https://i.pravatar.cc/150?img=18",
    ],
  },
  {
    id: "7",
    name: "销售部",
    lastMessage: "欢迎们,各个都回归...",
    time: "2:44 PM",
    type: "group",
    unreadCount: 0,
    avatars: [
      "https://i.pravatar.cc/150?img=19",
      "https://i.pravatar.cc/150?img=20",
      "https://i.pravatar.cc/150?img=21",
      "https://i.pravatar.cc/150?img=22",
    ],
  },
  {
    id: "8",
    name: "Leo",
    lastMessage: "Noooooo",
    time: "2:44 PM",
    type: "single",
    unreadCount: 0,
    avatars: [],
  },
];

// --- TypeScript Interfaces ---
interface ChatItemType {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  type: "single" | "group";
  unreadCount: number;
  avatars: string[];
}

import { useNavigation } from "@react-navigation/native";

// --- 聊天项组件 ---
const ChatItem = ({
  item,
  navigation,
}: {
  item: ChatItemType;
  navigation: any;
}) => {
  const renderAvatar = () => {
    if (item.type === "group") {
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
    }
    return (
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={28} color="#888" />
      </View>
    );
  };

  const renderBadge = () => {
    if (item.unreadCount === 0) return null;
    return (
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{item.unreadCount}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate("Chat", { chatName: item.name })}
    >
      <View style={styles.chatItemContainer}>
        <View style={styles.avatarWrapper}>
          {renderAvatar()}
          {renderBadge()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- 页面主组件 ---
export default function ChatListScreen() {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.safeArea}>
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
              color={COLORS.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="搜索"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          data={DUMMY_DATA}
          keyExtractor={(item) => item.id}
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
    // backgroundColor: COLORS.background
  },
  header: {
    backgroundColor: COLORS.header,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  searchSection: {
    backgroundColor: COLORS.header,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.searchBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  listContent: {
    paddingTop: 10,
  },
  chatItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 8,
    borderRadius: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#fff",

    // iOS Shadow
    shadowColor: "#898989",
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
    borderRadius: 8,
    backgroundColor: COLORS.avatarPlaceholder,
    justifyContent: "center",
    alignItems: "center",
  },
  groupAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    backgroundColor: COLORS.avatarPlaceholder,
  },
  groupAvatarImage: {
    width: "50%",
    height: "50%",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: COLORS.badge,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  badgeText: {
    color: COLORS.card,
    fontSize: 11,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  metaContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingBottom: 20,
    // marginLeft: 8,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
