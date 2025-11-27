import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borders, typography } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";

interface Contact {
  id: number;
  name: string;
}

const contactsData: Contact[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Anna" },
  { id: 3, name: "Peter" },
  { id: 4, name: "Nick" },
  { id: 5, name: "Bob" },
  { id: 6, name: "John" },
  { id: 7, name: "Alex" },
  { id: 8, name: "Tom" },
  { id: 9, name: "Celine" },
  { id: 10, name: "Zack" },
  { id: 11, name: "David" },
  { id: 12, name: "Eve" },
  { id: 13, name: "Holly" },
  { id: 14, name: "Frank" },
  { id: 15, name: "Star" },
];

const FriendItem = ({
  item,
  isSelected,
  onToggle,
}: {
  item: Contact;
  isSelected: boolean;
  onToggle: (id: number) => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(item.id)}
      style={styles.friendItem}
    >
      <View style={styles.leftSection}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={28} color={colors.text.grayMedium} />
        </View>
        <Text style={styles.friendName}>{item.name}</Text>
      </View>

      <View style={styles.rightSection}>
        <View
          style={[
            styles.checkbox,
            isSelected && styles.checkboxSelected,
          ]}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={18} color={colors.background.white} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function AddGroup() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [searchText, setSearchText] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const toggleFriend = (id: number) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredData = contactsData.filter((contact) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>发起群聊</Text>
          <View style={styles.placeholder} />
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

        {selectedFriends.length > 0 && (
          <View style={styles.selectedCountContainer}>
            <Text style={styles.selectedCountText}>
              选择了 {selectedFriends.length} 人
            </Text>
          </View>
        )}

        {/* Friend List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FriendItem
              item={item}
              isSelected={selectedFriends.includes(item.id)}
              onToggle={toggleFriend}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {selectedFriends.length > 0 && (
          <View style={styles.createButtonContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                // 获取选中好友的名字
                const selectedNames = contactsData
                  .filter((contact) => selectedFriends.includes(contact.id))
                  .map((contact) => contact.name)
                  .slice(0, 3)
                  .join("、");

                // 生成群聊名称
                const groupName = selectedNames + (selectedFriends.length > 3 ? "..." : "");

                console.log("创建群聊，选择的好友:", selectedFriends);

                // 导航到 GroupScreen
                navigation.navigate("GroupScreen", {
                  groupName: groupName,
                  groupId: Date.now().toString(),
                });
              }}
            >
              <Text style={styles.createButtonText}>发起群聊</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight600,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
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
  selectedCountContainer: {
    backgroundColor: colors.background.yellowPale,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  selectedCountText: {
    fontSize: typography.fontSize14,
    color: colors.text.medium,
    fontWeight: typography.fontWeight500,
  },
  listContent: {
    paddingTop: 10,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borders.radius8,
    backgroundColor: colors.functional.avatarPlaceholder,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  friendName: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.text.primary,
  },
  rightSection: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borders.radius4,
    borderWidth: 2,
    borderColor: colors.border.gray,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.white,
  },
  checkboxSelected: {
    backgroundColor: colors.functional.greenSuccess,
    borderColor: colors.functional.greenSuccess,
  },
  createButtonContainer: {
    padding: 16,
    backgroundColor: colors.background.white,
    borderTopWidth: borders.width1,
    borderTopColor: colors.border.light,
  },
  createButton: {
    backgroundColor: colors.functional.greenSuccess,
    paddingVertical: 14,
    borderRadius: borders.radius8,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight600,
    color: colors.background.white,
  },
});