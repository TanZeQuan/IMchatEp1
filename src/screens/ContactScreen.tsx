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

import pinyin from "pinyin";

// 导入 responsive
import { scaleWidth as w, scaleHeight as h, scaleFont as f } from "../utils/responsive";

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
      <View style={styles.contentContainer}>
        <View style={styles.listContainer}>
          <SectionList
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="chatbubbles" size={f(18)} color="#666" />
                </View>
                <Text style={styles.actionLabel}>发起群聊</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
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
        </View>

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
      </View> {/* Closes styles.contentContainer */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  contentContainer: {
    flex: 1,
    flexDirection: "row", // Arrange children horizontally
  },

  /** HEADER */
  header: {
    backgroundColor: "#F4D03F",
    paddingHorizontal: w(18),
    paddingVertical: h(18),
    paddingTop: h(16),
  },
  headerTitle: {
    fontSize: f(15),
    fontWeight: "600",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: h(12),
  },

  /** SEARCH */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    fontSize: f(17),
    marginRight: w(8),
    color: "#9CA3AF",
  },
  searchInput: {
    flex: 1,
    fontSize: f(14),
    color: "#6B7280",
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
    backgroundColor: "#F3F4F6",
    borderRadius: w(25),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: h(6),
  },
  actionLabel: {
    fontSize: f(12),
    color: "#374151",
    textAlign: "center",
  },

  /** CONTACT LIST */
  listContainer: { 
    flex: 1, // Take up all available space horizontally except for alphabet index
    backgroundColor: "#FFFFFF",
  },

  sectionHeader: {
    backgroundColor: "#FFF7D6",
    paddingHorizontal: w(16),
    paddingVertical: h(6),
  },
  sectionHeaderText: {
    fontSize: f(12),
    color: "#4B5563",
    fontWeight: "500",
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: w(18),
    paddingVertical: h(14),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  avatar: {
    width: w(42),
    height: h(42),
    backgroundColor: "#D1D5DB",
    borderRadius: w(6),
    justifyContent: "center",
    alignItems: "center",
    marginRight: w(14),
  },
  contactName: { 
    fontSize: f(16), 
    color: "#111827",
    fontWeight: "500",
  },

  /** ALPHABET LIST */
  alphabetIndex: {
    justifyContent: "center", // Center letters vertically
    paddingVertical: h(10),
    paddingHorizontal: w(5),
  },
  alphabetItem: { 
    paddingVertical: h(2), 
    paddingHorizontal: w(4) 
  },
  alphabetText: {
    fontSize: f(13),
    color: "#9CA3AF",
    fontWeight: "600",
  },
});

export default ContactsLayout;