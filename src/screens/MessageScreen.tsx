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

// --- 模拟数据 ---
const messageData: ChatItemType[] = [
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
        <Ionicons name="person" size={28} color={colors.text.grayMedium} />
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
  const [searchText, setSearchText] = React.useState("");
  const [debouncedText, setDebouncedText] = React.useState("");

  // 防抖逻辑
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(searchText);
    }, 300); // 300ms 延迟
    return () => clearTimeout(handler); // 清理上一次定时器
  }, [searchText]);

  // 根据 debouncedText 过滤聊天列表
  const filteredData = React.useMemo(() => {
    if (!debouncedText.trim()) return messageData;
    return messageData.filter((item) =>
      item.name.toLowerCase().startsWith(debouncedText.toLowerCase())
    );
  }, [debouncedText]);

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
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          data={filteredData}
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
