import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";
import { Platform } from "react-native";
import pinyin from "pinyin";
import { getFriendRequests } from "../api/FriendReq";
import { createPrivateChat } from "../api/Chat";
import { useUserStore } from "../store/userStore";

// 导入 responsive 和样式配置
import { scaleWidth as w, scaleHeight as h, scaleFont as f } from "../utils/responsive";
import { colors, borders, typography } from "../styles";

interface Contact {
  id: string;
  name: string;
  userId: string;
  image?: string;
}

interface Section {
  title: string;
  data: Contact[];
}

const alphabet: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

const ContactsLayout: React.FC = () => {
  const { userToken } = useUserStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [searchText, setSearchText] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sectionListRef = React.useRef<SectionList>(null);

  // Fetch friends when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userToken) {
        fetchFriends();
      }
    }, [userToken])
  );

  const fetchFriends = async () => {
    if (!userToken) return;

    try {
      setIsLoading(true);
      const response = await getFriendRequests(userToken, 2); // Get accepted friends (status=2)

      if (response && !response.error && response.response) {
        const requestFriends = response.response.request || [];
        const approveFriends = response.response.approve || [];

        // Merge both arrays and create Contact objects
        const allFriends: Contact[] = [];

        // Friends where I sent the request
        requestFriends.forEach((friend: any) => {
          allFriends.push({
            id: friend.list_id || friend.approve_id,
            name: friend.name || friend.approve_id || "未知用户",
            userId: friend.approve_id,
            image: friend.image,
          });
        });

        // Friends where I received the request
        approveFriends.forEach((friend: any) => {
          allFriends.push({
            id: friend.list_id || friend.request_id,
            name: friend.name || friend.request_id || "未知用户",
            userId: friend.request_id,
            image: friend.image,
          });
        });

        setContacts(allFriends);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupContacts = (contacts: Contact[]): Section[] => {
    const grouped: Record<string, Contact[]> = {};

    contacts.forEach((contact) => {
      let firstChar = contact.name[0];

      if (/[\u4e00-\u9fa5]/.test(firstChar)) {
        firstChar = pinyin(firstChar, { style: "first_letter" })[0][0];
      }

      const letter = /[A-Z]/i.test(firstChar) ? firstChar.toUpperCase() : "#";

      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(contact);
    });

    return Object.keys(grouped)
      .sort()
      .map((key) => ({ title: key, data: grouped[key] }));
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.userId.toLowerCase().includes(searchText.toLowerCase())
  );

  const sections = groupContacts(filteredContacts);

  const handleLetterPress = (letter: string) => {
    console.log('Pressed letter:', letter); // For debugging
    const index = sections.findIndex((s) => s.title === letter);
    if (index !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: Platform.OS === "android"
      });
    }
  };

  const handleContactPress = async (contact: Contact) => {
    if (!userToken) return;

    try {
      // Create or get existing private chat
      const response = await createPrivateChat(userToken, contact.userId, contact.name);

      if (response && !response.error && response.response) {
        const chatId = response.response;

        // Navigate to ChatScreen with chat_id and friend info
        navigation.navigate('ChatScreen', {
          chatId: chatId,
          chatName: contact.name,
          userId: contact.userId,
        });
      }
    } catch (error) {
      console.error('Error creating private chat:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>通讯录</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>通讯录</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={f(14)} style={styles.searchIcon} />
          <TextInput
            placeholder="搜索"
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

      {/* Action Buttons */}
      {/* Moved into SectionList's ListHeaderComponent */}

      {/* SectionList */}
      <View style={styles.listContainer}>
        <SectionList
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂时无好友，快添加好友吧！</Text>
              </View>
            )
          }
          ListHeaderComponent={
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AddGroup")}>
                <View style={styles.actionIcon}>
                  <Ionicons name="chatbubbles" size={f(18)} color="#666" />
                </View>
                <Text style={styles.actionLabel}>发起群聊</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('JoinGroup')}>
                <View style={styles.actionIcon}>
                  <Ionicons name="people" size={f(18)} color="#666" />
                </View>
                <Text style={styles.actionLabel}>加入群聊</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AddFriend")}>
                <View style={styles.actionIcon}>
                  <Ionicons name="person-add" size={f(18)} color="#666" />
                </View>
                <Text style={styles.actionLabel}>添加好友</Text>
              </TouchableOpacity>
            </View>
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleContactPress(item)}
            >
              <View style={styles.avatar}>
                <Image
                  source={{ uri: item.image || "https://postimg.cc/34y84VvN" }}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactUserId}>ID: {item.userId}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Alphabet Index - 移到 listContainer 内部 */}
        <View style={styles.alphabetIndex}>
          {alphabet.map((letter) => (
            <TouchableOpacity
              key={letter}
              style={styles.alphabetItem}
              onPress={() => handleLetterPress(letter)}
            >
              <Text style={styles.alphabetText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: h(60),
  },
  emptyText: {
    fontSize: f(typography.fontSize14),
    color: colors.text.grayLight,
    textAlign: 'center',
  },

  /** HEADER */
  header: {
    backgroundColor: colors.background.yellow,
    paddingHorizontal: w(18),
    paddingVertical: h(18),
    paddingTop: h(16),
  },
  headerTitle: {
    fontSize: f(typography.fontSize15),
    fontWeight: typography.fontWeight600,
    textAlign: "center",
    color: colors.text.dark,
    marginBottom: h(12),
  },

  /** SEARCH */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.white,
    borderRadius: borders.radius8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    fontSize: f(typography.fontSize17),
    marginRight: w(8),
    color: colors.text.grayLight,
  },
  searchInput: {
    flex: 1,
    fontSize: f(typography.fontSize14),
    color: colors.text.gray,
    padding: 0,
  },

  /** QUICK ACTION BUTTONS */
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: w(20),
    paddingVertical: h(18),
  },
  actionButton: { 
    alignItems: "center",
    width: w(70),
  },

  actionIcon: {
    width: w(50),
    height: h(50),
    backgroundColor: colors.background.grayPale,
    borderRadius: w(borders.radius25),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: h(6),
  },
  actionLabel: {
    fontSize: f(typography.fontSize12),
    color: colors.text.medium,
    textAlign: "center",
  },

  /** CONTACT LIST */
  listContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.background.white,
  },

  sectionHeader: {
    backgroundColor: colors.background.yellowPale,
    paddingHorizontal: w(16),
    paddingVertical: h(6),
  },
  sectionHeaderText: {
    fontSize: f(typography.fontSize12),
    color: colors.text.grayDark,
    fontWeight: typography.fontWeight500,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: w(18),
    paddingVertical: h(14),
    borderBottomWidth: borders.width1,
    borderBottomColor: colors.border.light,
  },

  avatar: {
    width: w(42),
    height: h(42),
    backgroundColor: colors.functional.avatarBg,
    borderRadius: w(borders.radius6),
    justifyContent: "center",
    alignItems: "center",
    marginRight: w(14),
    overflow: "hidden",
  },
  avatarImage: {
    width: w(42),
    height: h(42),
  },
  contactInfo: {
    flex: 1,
    justifyContent: "center",
  },
  contactName: {
    fontSize: f(typography.fontSize16),
    color: colors.text.darker,
    fontWeight: typography.fontWeight500,
    marginBottom: h(2),
  },
  contactUserId: {
    fontSize: f(typography.fontSize12),
    color: colors.text.grayLight,
  },

  /** ALPHABET LIST */
  alphabetIndex: {
    position: "absolute",
    right: w(8),
    top: h(130), // 从 action buttons 之后开始
    bottom: h(20), // 留一点底部空间
    justifyContent: "center", // 自动垂直居中字母列表
    alignItems: "center",
    zIndex: 1,
  },
  alphabetItem: {
    paddingVertical: h(2),
    paddingHorizontal: w(4)
  },
  alphabetText: {
    fontSize: f(typography.fontSize12),
    color: colors.text.grayLight,
    fontWeight: typography.fontWeight600,
  },
});

export default ContactsLayout;