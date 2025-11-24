import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Platform,
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
  const [activeAlphabet, setActiveAlphabet] = React.useState<string | null>(null);

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
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sections = groupContacts(filteredContacts);

  const handleLetterPress = (letter: string) => {
    const index = sections.findIndex((s) => s.title === letter);
    if (index !== -1 && sectionListRef.current) {
      setActiveAlphabet(letter);
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
        viewPosition: 0,
      });
      setTimeout(() => setActiveAlphabet(null), 300);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>通讯录</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={f(16)} style={styles.searchIcon} />
          <TextInput
            placeholder="搜索"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="chatbubbles" size={f(20)} color="#666" />
          </View>
          <Text style={styles.actionLabel}>发起群聊</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="people" size={f(20)} color="#666" />
          </View>
          <Text style={styles.actionLabel}>加入群聊</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={AddFriend}
          activeOpacity={0.7}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="person-add" size={f(20)} color="#666" />
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
          stickySectionHeadersEnabled={true}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.contactItem}
              activeOpacity={0.6}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={f(18)} color="#fff" />
              </View>
              <Text style={styles.contactName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />

        {/* Alphabet Index */}
        <View style={styles.alphabetIndex}>
          {alphabet.map((letter) => {
            const hasSection = sections.some(s => s.title === letter);
            return (
              <TouchableOpacity
                key={letter}
                style={[
                  styles.alphabetItem,
                  !hasSection && styles.alphabetItemDisabled
                ]}
                onPress={() => hasSection && handleLetterPress(letter)}
                activeOpacity={0.5}
                disabled={!hasSection}
              >
                <Text 
                  style={[
                    styles.alphabetText,
                    !hasSection && styles.alphabetTextDisabled,
                    activeAlphabet === letter && styles.alphabetTextActive
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Letter Indicator */}
        {activeAlphabet && (
          <View style={styles.letterIndicator}>
            <Text style={styles.letterIndicatorText}>{activeAlphabet}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /** HEADER */
  header: {
    backgroundColor: "#F4D03F",
    paddingHorizontal: w(16),
    paddingBottom: h(16),
    paddingTop: h(12),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: f(20),
    fontWeight: "700",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: h(12),
    letterSpacing: 0.3,
  },

  /** SEARCH */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: w(10),
    paddingHorizontal: w(12),
    height: h(44),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchIcon: {
    marginRight: w(8),
    color: "#9CA3AF",
  },
  searchInput: {
    flex: 1,
    fontSize: f(15),
    color: "#1F2937",
    padding: 0,
    height: h(44),
  },

  /** QUICK ACTION BUTTONS */
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: w(16),
    paddingVertical: h(20),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  actionButton: { 
    alignItems: "center",
    minWidth: w(80),
  },

  actionIcon: {
    width: w(56),
    height: w(56),
    backgroundColor: "#F9FAFB",
    borderRadius: w(28),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: h(8),
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionLabel: {
    fontSize: f(13),
    color: "#4B5563",
    textAlign: "center",
    fontWeight: "500",
  },

  /** CONTACT LIST */
  listContainer: { 
    flex: 1, 
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingBottom: h(20),
  },

  sectionHeader: {
    backgroundColor: "#FFF9E6",
    paddingHorizontal: w(16),
    paddingVertical: h(8),
    borderBottomWidth: 1,
    borderBottomColor: "#FEF3C7",
  },
  sectionHeaderText: {
    fontSize: f(13),
    color: "#92400E",
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: w(16),
    paddingVertical: h(12),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    minHeight: h(64),
  },

  avatar: {
    width: w(48),
    height: w(48),
    backgroundColor: "#D1D5DB",
    borderRadius: w(8),
    justifyContent: "center",
    alignItems: "center",
    marginRight: w(12),
  },
  contactName: { 
    fontSize: f(16), 
    color: "#111827",
    fontWeight: "500",
    flex: 1,
  },

  /** ALPHABET INDEX */
  alphabetIndex: {
    position: "absolute",
    right: w(2),
    top: h(10),
    bottom: h(10),
    justifyContent: "center",
    paddingVertical: h(4),
  },
  alphabetItem: { 
    paddingVertical: h(1.5), 
    paddingHorizontal: w(8),
    minHeight: h(16),
    justifyContent: "center",
    alignItems: "center",
  },
  alphabetItemDisabled: {
    opacity: 0.3,
  },
  alphabetText: {
    fontSize: f(11),
    color: "#bebebeff",
    fontWeight: "700",
  },
  alphabetTextDisabled: {
    color: "#D1D5DB",
  },
  alphabetTextActive: {
    color: "#1D4ED8",
    fontSize: f(13),
  },

  /** LETTER INDICATOR */
  letterIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -w(40) }, { translateY: -h(40) }],
    width: w(80),
    height: w(80),
    backgroundColor: "rgba(183, 183, 184, 0.95)",
    borderRadius: w(16),
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  letterIndicatorText: {
    fontSize: f(32),
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

export default ContactsLayout;