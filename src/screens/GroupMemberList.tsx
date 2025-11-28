import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";
import { colors, borders, typography } from "../styles";

// 模拟数据：群成员
const MEMBER_DATA = [
  { id: "1", name: "妈妈" },
  { id: "2", name: "名字" },
  { id: "3", name: "名字" },
  { id: "4", name: "名字" },
  { id: "5", name: "名字" },
  { id: "6", name: "名字" },
  { id: "7", name: "名字" },
  { id: "8", name: "名字" },
  { id: "9", name: "名字" },
  { id: "10", name: "名字" },
  { id: "11", name: "名字" },
  { id: "12", name: "名字" },
];

interface Member {
  id: string;
  name: string;
}

export default function GroupMemberList() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleRemoveMember = (memberId: string, memberName: string) => {
    console.log("Remove member:", memberId, memberName);
    // TODO: 添加移除成员的逻辑
  };

  const handleAddMember = () => {
    console.log("Add member");
    // TODO: 添加添加成员的逻辑
  };

  const renderMemberItem = ({ item }: { item: Member }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://postimg.cc/34y84VvN" }}
            style={styles.avatarImage}
          />
        </View>
        <Text style={styles.memberName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveMember(item.id, item.name)}
      >
        <Text style={styles.removeButtonText}>移除</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>群成员</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Add Member Button */}
      <View style={styles.addMemberSection}>
        <TouchableOpacity style={styles.addMemberButton} onPress={handleAddMember}>
          <Ionicons name="person-add-outline" size={20} color={colors.functional.blueLight} />
          <Text style={styles.addMemberText}>添加成员</Text>
        </TouchableOpacity>
      </View>

      {/* Member List */}
      <FlatList
        data={MEMBER_DATA}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.chatBg,
  },

  // Header
  header: {
    backgroundColor: colors.background.yellowLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: typography.fontSize18,
    fontWeight: typography.fontWeight600,
    color: colors.text.dark,
    flex: 1,
    textAlign: "center",
    marginRight: 28,
  },
  placeholder: {
    width: 28,
  },

  // Add Member Section
  addMemberSection: {
    backgroundColor: colors.background.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: borders.radius12,
    overflow: "hidden",
  },
  addMemberButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  addMemberText: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.functional.blueLight,
  },

  // Member List
  list: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: borders.radius12,
    marginBottom: 8,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.grayPale,
    borderRadius: borders.radius24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
  memberName: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.text.dark,
  },
  removeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.functional.redLight,
    borderRadius: borders.radius6,
  },
  removeButtonText: {
    fontSize: typography.fontSize14,
    fontWeight: typography.fontWeight500,
    color: colors.background.white,
  },
});
