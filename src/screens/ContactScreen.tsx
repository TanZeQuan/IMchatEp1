import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";
import { Platform } from "react-native";
import pinyin from "pinyin";

// 导入 responsive 和样式配置
import { scaleWidth as w, scaleHeight as h, scaleFont as f } from "../utils/responsive";
import { colors, borders, typography } from "../styles";

interface Contact {
  id: number;
  name: string;
}

interface Section {
  title: string;
  data: Contact[];
}

const contactsData: Contact[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Anna" },
  { id: 3, name: "张三" },
  { id: 4, name: "李四" },
  { id: 5, name: "Bob" },
  { id: 6, name: "王五" },
  { id: 7, name: "😊A" },
  { id: 8, name: "Anna" },
  { id: 9, name: "Celine" },
  { id: 10, name: "Zack" },
  { id: 11, name: "David" },
  { id: 12, name: "Eve" },
  { id: 13, name: "陈六" },
  { id: 14, name: "Frank" },
  { id: 15, name: "🌟Star" },
];

const alphabet: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

const ContactsLayout: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const AddFriend = () => navigation.navigate("AddFriend");
  const FriendReq = () => navigation.navigate("FriendReq");
  const AddGroupNav = () => navigation.navigate("AddGroup");

  const [searchText, setSearchText] = React.useState("");

  const sectionListRef = React.useRef<SectionList>(null);

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

  const filteredContacts = contactsData.filter((c) =>
    c.name.toLowerCase().startsWith(searchText.toLowerCase())
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
          ListHeaderComponent={
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={AddGroupNav}>
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

              <TouchableOpacity style={styles.actionButton} onPress={AddFriend}>
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
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={f(16)} color="#fff" />
              </View>
              <Text style={styles.contactName}>{item.name}</Text>
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
  },
  contactName: {
    fontSize: f(typography.fontSize16),
    color: colors.text.darker,
    fontWeight: typography.fontWeight500,
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