import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Switch,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/MainStack";
import { colors, borders, typography } from "../styles";

const { width } = Dimensions.get("window");

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
];

interface ListItemProps {
  label: string;
  value?: string;
  type?: "arrow" | "switch" | "button";
  isLast?: boolean;
  isDestructive?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * 通用列表行组件 (ListItem)
 * 支持三种模式：
 * 1. 普通跳转 (带箭头)
 * 2. 开关 (Switch)
 * 3. 居中红色按钮 (危险操作)
 */
const ListItem: React.FC<ListItemProps> = ({
  label,
  value,
  type = "arrow",
  isLast = false,
  isDestructive = false,
  icon = "notifications-outline",
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // 如果是危险按钮 (删除/退出)
  if (type === "button") {
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.settingItem}>
          <View style={[styles.iconContainer, styles.dangerIcon]}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.dangerTitle}>{label}</Text>
            <Text style={styles.dangerSubtitle}>确认删除并退出此群聊</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.settingItem, !isLast && styles.borderBottom]}>
      <View style={[styles.iconContainer, isDestructive && styles.dangerIcon]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[styles.settingTitle, isDestructive && styles.dangerTitle]}
        >
          {label}
        </Text>
        {value && <Text style={styles.settingSubtitle}>{value}</Text>}
      </View>
      {type === "switch" ? (
        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
          trackColor={{
            false: colors.border.gray,
            true: colors.functional.greenBright,
          }}
          thumbColor={colors.background.white}
        />
      ) : (
        type === "arrow" && (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )
      )}
    </View>
  );
};

interface Member {
  id: string;
  name: string;
}

export default function GroupScreenDetails() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // 渲染单个成员组件
  const renderMember = (item: Member) => (
    <View key={item.id} style={styles.gridItem}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <AntDesign name="user" size={24} color="#666" />
        </View>
      </View>
      <Text style={styles.memberName} numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>群详情</Text>
        </View>

        {/* --- 群成员网格卡片 --- */}
        <View style={styles.profileCard}>
          <View style={styles.gridContainer}>
            {MEMBER_DATA.map(renderMember)}
            {/* 添加按钮 */}
            <TouchableOpacity style={styles.gridItem}>
              <View style={[styles.actionBtn, styles.addBtn]}>
                <AntDesign name="plus" size={28} color="#666" />
              </View>
              <Text style={styles.memberName}>添加</Text>
            </TouchableOpacity>
            {/* 移除按钮 */}
            <TouchableOpacity style={styles.gridItem}>
              <View style={[styles.actionBtn, styles.removeBtn]}>
                <AntDesign name="minus" size={28} color="#666" />
              </View>
              <Text style={styles.memberName}>移除</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>查看全部成员 (12)</Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* --- 群基本信息 --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>群信息</Text>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('EditGroupName')}>
              <ListItem label="群名称" value="越狱的猫" icon="people" />
            </TouchableOpacity>
            <ListItem label="群二维码" type="arrow" icon="qr-code-outline" />
            <TouchableOpacity onPress={() => navigation.navigate('GroupAnnouncement')}>
              <ListItem
                label="群公告"
                value="暂无公告"
                icon="megaphone-outline"
              />
            </TouchableOpacity>
            <ListItem label="群名片" icon="card-outline" />
            <TouchableOpacity onPress={() => navigation.navigate('EditMyGroupName')}>
              <ListItem label="我的群昵称" isLast={true} icon="person-circle-outline" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- 聊天记录与功能 --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>聊天管理</Text>
          <View style={styles.card}>
            <ListItem label="查找聊天记录" icon="search-outline" />
            <ListItem label="聊天设置" isLast={true} icon="settings-outline" />
          </View>
        </View>

        {/* --- 开关设置 --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知设置</Text>
          <View style={styles.card}>
            <ListItem
              label="消息免打扰"
              type="switch"
              icon="notifications-off-outline"
            />
            <ListItem
              label="置顶聊天"
              type="switch"
              icon="chevron-up-circle-outline"
            />
            <ListItem
              label="强提醒"
              type="switch"
              isLast={true}
              icon="shield-checkmark-outline"
            />
          </View>
        </View>

        {/* --- 群主/危险区 --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他</Text>
          <View style={styles.card}>
            <ListItem label="群主" value="Mym" icon="person-circle-outline" />
            <ListItem
              label="清空聊天记录"
              isLast={true}
              isDestructive={true}
              icon="trash-outline"
            />
          </View>
        </View>

        {/* --- 底部：退出/删除按钮 --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>危险区</Text>
          <ListItem
            label="删除并退出"
            type="button"
            isDestructive={true}
            isLast={true}
          />
        </View>
        <View style={styles.sectionBottom}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.chatBg,
  },
  scrollView: {
    flex: 1,
  },

  // --- Header ---
  header: {
    backgroundColor: colors.background.yellowLight,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: typography.fontSize18,
    fontWeight: typography.fontWeight600,
    color: colors.text.black,
  },

  // --- Profile Card (群成员网格) ---
  profileCard: {
    backgroundColor: colors.background.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: borders.radius12,
    paddingTop: 15,
    paddingBottom: 0,
  },

  // --- 网格样式 ---
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  gridItem: {
    width: (width - 10) / 5,
    alignItems: "center",
    marginBottom: 15,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.functional.avatarBg,
    borderRadius: borders.radius8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  memberName: {
    fontSize: typography.fontSize11,
    color: colors.text.gray,
    textAlign: "center",
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: borders.radius8,
    borderWidth: borders.width1,
    borderColor: colors.border.light,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    borderColor: colors.border.light,
    backgroundColor: colors.background.grayPale,
  },
  removeBtn: {
    borderColor: colors.border.light,
    backgroundColor: colors.background.grayPale,
  },
  viewMoreBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: borders.width1,
    borderTopColor: colors.border.light,
  },
  viewMoreText: {
    color: colors.text.grayLight,
    fontSize: typography.fontSize14,
    marginRight: 4,
  },

  // --- Section ---
  section: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: typography.fontSize14,
    color: colors.text.gray,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sectionBottom: {
    marginTop: 100,
  },
  // --- Card ---
  card: {
    backgroundColor: colors.background.white,
    borderRadius: borders.radius12,
    overflow: "hidden",
  },

  // --- Setting Item ---
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: borders.width1,
    borderBottomColor: colors.border.light,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#FBBF24",
    borderRadius: borders.radius20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: colors.functional.redMedium,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.text.dark,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: typography.fontSize12,
    color: colors.text.grayLight,
  },
  dangerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight500,
    color: colors.functional.redMedium,
    marginBottom: 2,
  },
  dangerSubtitle: {
    fontSize: typography.fontSize12,
    color: colors.functional.redLight,
  },
});
