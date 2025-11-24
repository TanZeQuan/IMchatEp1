import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  SectionListData,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";

// 中文名拼音库（可选）
import pinyin from "pinyin";

interface Contact {
  id: number;
  name: string;
}

interface Section {
  title: string;
  data: Contact[];
}

// ------------------ 联系人数据 ------------------
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

  const AddFriend = () => {
    navigation.navigate("AddFriend");
  };

  const FriendReq = () => {
    navigation.navigate("FriendReq");
  };
  const [searchText, setSearchText] = React.useState("");

  // SectionList ref
  const sectionListRef = React.useRef<SectionList>(null);

  // ------------------ 分组函数 ------------------
  const groupContacts = (contacts: Contact[]): Section[] => {
    const grouped: { [key: string]: Contact[] } = {};

    contacts.forEach((contact) => {
      let firstChar = contact.name[0];

      // 中文名转拼音首字母
      if (/[\u4e00-\u9fa5]/.test(firstChar)) {
        firstChar = pinyin(firstChar, { style: "first_letter" })[0][0];
      }

      const letter = /[A-Z]/i.test(firstChar) ? firstChar.toUpperCase() : "#";

      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(contact);
    });

    // 转成 SectionList 可用格式，并按字母排序
    const sections: Section[] = Object.keys(grouped)
      .sort()
      .map((key) => ({ title: key, data: grouped[key] }));

    return sections;
  };

  // ------------------ 搜索过滤 ------------------
  const filteredContacts = contactsData.filter((c) =>
    c.name.toLowerCase().startsWith(searchText.toLowerCase())
  );
  const sections = groupContacts(filteredContacts);

  // ------------------ 点击字母跳转 ------------------
  const handleLetterPress = (letter: string) => {
    const index = sections.findIndex((s) => s.title === letter);
    if (index !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>通讯录</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} style={styles.searchIcon} />
          <TextInput
            placeholder="搜索"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="chatbubbles" size={24} color="#666" />
          </View>
          <Text style={styles.actionLabel}>发起群聊</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="people" size={24} color="#666" />
          </View>
          <Text style={styles.actionLabel}>加入群聊</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={AddFriend}>
          <View style={styles.actionIcon}>
            <Ionicons name="person-add" size={24} color="#666" />
          </View>
          <Text style={styles.actionLabel}>添加好友</Text>
        </TouchableOpacity>
      </View>

      {/* SectionList */}
      <View style={styles.listContainer}>
        <SectionList
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.contactItem,
                index % 2 === 0
                  ? styles.contactItemYellow
                  : styles.contactItemWhite,
              ]}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <Text style={styles.contactName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Alphabet Index */}
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

// ------------------ 样式 ------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#F4D03F",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#232323",
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 8,
  },
  actionButtons: {
    backgroundColor: "#FEF3C7",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: "#374151",
  },
  searchIcon: { marginRight: 8, color: "#999999" },
  searchInput: { flex: 1, fontSize: 15, color: "#999999", padding: 0 },
  listContainer: { flex: 1, position: "relative" },
  sectionHeader: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  sectionHeaderText: { fontSize: 12, color: "#232323" },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  contactItemYellow: { backgroundColor: "#fff" },
  contactItemWhite: { backgroundColor: "#fff" },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#9CA3AF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactName: { fontSize: 16, color: "#374151" },
  alphabetIndex: {
    position: "absolute",
    right: 4,
    top: "10%",
    alignItems: "center",
  },
  alphabetItem: { paddingVertical: 2, paddingHorizontal: 4 },
  alphabetText: { fontSize: 10, color: "#9CA3AF", fontWeight: "500" },
});

export default ContactsLayout;
