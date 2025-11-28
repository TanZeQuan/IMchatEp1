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
import { useUserStore } from "../store/useToken";

// 导入 responsive 和样式配置
import { scaleWidth as w, scaleHeight as h, scaleFont as f } from "../utils/responsive";
import { colors, borders, typography } from "../styles";
import { createPrivateChat } from "../api/Chat";

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
  const [hasFetched, setHasFetched] = useState(false);

  const sectionListRef = React.useRef<SectionList>(null);

  // Fetch friends when screen comes into focus AND when userToken is available
  useFocusEffect(
    React.useCallback(() => {
      if (userToken && !hasFetched) {
        console.log('Fetching friends with token:', userToken);
        fetchFriends();
      }
      
      // Reset hasFetched when leaving screen to refresh on next focus
      return () => {
        setHasFetched(false);
      };
    }, [userToken, hasFetched])
  );

  const fetchFriends = async () => {
    if (!userToken) {
      console.log('No user token available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Making API call to get friends...');
      const response = await getFriendRequests(userToken, 2); // Get accepted friends (status=2)
      console.log('API Response:', response);

      if (response && !response.error && response.response) {
        const requestFriends = response.response.request || [];
        const approveFriends = response.response.approve || [];

        console.log('Request friends:', requestFriends);
        console.log('Approve friends:', approveFriends);

        // Merge both arrays and create Contact objects
        const allFriends: Contact[] = [];

        // Friends where I sent the request
        requestFriends.forEach((friend: any) => {
          allFriends.push({
            id: friend.list_id || friend.approve_id || `req_${friend.approve_id}`,
            name: friend.name || friend.approve_id || "未知用户",
            userId: friend.approve_id,
            image: friend.image,
          });
        });

        // Friends where I received the request
        approveFriends.forEach((friend: any) => {
          allFriends.push({
            id: friend.list_id || friend.request_id || `app_${friend.request_id}`,
            name: friend.name || friend.request_id || "未知用户",
            userId: friend.request_id,
            image: friend.image,
          });
        });

        console.log('All friends processed:', allFriends);
        setContacts(allFriends);
        setHasFetched(true);
      } else {
        console.log('No valid response data');
        setContacts([]);
        setHasFetched(true);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      setContacts([]);
      setHasFetched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const groupContacts = (contacts: Contact[]): Section[] => {
    if (contacts.length === 0) return [];
    
    const grouped: Record<string, Contact[]> = {};

    contacts.forEach((contact) => {
      let firstChar = contact.name[0];

      if (/[\u4e00-\u9fa5]/.test(firstChar)) {
        try {
          firstChar = pinyin(firstChar, { style: "first_letter" })[0][0];
        } catch (error) {
          console.warn('Pinyin conversion failed for:', firstChar);
          firstChar = '#';
        }
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
    console.log('Pressed letter:', letter);
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

  // Add manual refresh function for testing
  const handleManualRefresh = () => {
    setHasFetched(false);
    fetchFriends();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>通讯录</Text>
          {/* Add refresh button for debugging */}
          <TouchableOpacity onPress={handleManualRefresh} style={styles.debugButton}>
            <Text style={styles.debugButtonText}>手动刷新</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text.primary} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>通讯录</Text>
        
        {/* Add refresh button for debugging */}
        <TouchableOpacity onPress={handleManualRefresh} style={styles.debugButton}>
          <Text style={styles.debugButtonText}>刷新</Text>
        </TouchableOpacity>

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

      {/* SectionList */}
      <View style={styles.listContainer}>
        <SectionList
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂时无好友，快添加好友吧！</Text>
              <TouchableOpacity onPress={() => navigation.navigate("AddFriend")} style={styles.addFriendButton}>
                <Text style={styles.addFriendButtonText}>添加好友</Text>
              </TouchableOpacity>
            </View>
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
                  source={{ uri: item.image || "https://i.postimg.cc/34y84VvN/user.png" }}
                  style={styles.avatarImage}
                  onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactUserId}>ID: {item.userId}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Alphabet Index */}
        {sections.length > 0 && (
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
        )}
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

  loadingText: {
    marginTop: h(10),
    fontSize: f(typography.fontSize14),
    color: colors.text.grayLight,
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
    marginBottom: h(20),
  },

  addFriendButton: {
    backgroundColor: colors.background.yellow,
    paddingHorizontal: w(20),
    paddingVertical: h(10),
    borderRadius: borders.radius8,
  },
  addFriendButtonText: {
    color: colors.text.dark,
    fontSize: f(typography.fontSize14),
    fontWeight: typography.fontWeight500,
  },

  debugButton: {
    position: 'absolute',
    right: w(10),
    top: h(10),
    backgroundColor: colors.background.grayPale,
    padding: w(5),
    borderRadius: borders.radius4,
  },
  debugButtonText: {
    fontSize: f(typography.fontSize11),
    color: colors.text.gray,
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
    top: h(120),
    bottom: h(20),
    justifyContent: "center",
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