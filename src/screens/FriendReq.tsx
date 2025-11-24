import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../navigation/MainStack";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  background: "#F5F5F5",
  header: "#FFD860",
  white: "#FFFFFF",
  textPrimary: "#232323",
  textSecondary: "#999999",
  border: "#E5E5E5",
};

const SettingScreen: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState([
    { id: "1", userId: "user_A001", name: "Alice", avatar: "https://i.pravatar.cc/100?img=1", status: 'pending' },
    { id: "2", userId: "user_B002", name: "Ben", avatar: "https://i.pravatar.cc/100?img=2", status: 'pending' },
    { id: "3", userId: "user_C003", name: "Charlie", avatar: "https://i.pravatar.cc/100?img=3", status: 'pending' },
  ]);

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleAccept = (requestId: string, name: string, userId: string) => {
    alert(`你接受了来自 ${name} (ID: ${userId}) 的好友请求！`);
    setFriendRequests(currentRequests =>
      currentRequests.map(req =>
        req.id === requestId ? { ...req, status: 'accepted' } : req
      )
    );
    // 实际应用中，这里会发送请求到后端
  };

  const handleReject = (requestId: string, name: string, userId: string) => {
    alert(`你拒绝了来自 ${name} (ID: ${userId}) 的好友请求。`);
    setFriendRequests(currentRequests =>
      currentRequests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    );
    // 实际应用中，这里会发送请求到后端
  };

  return (
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.safeArea}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>好友请求</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.friendRequestBox}>
            <Text style={styles.friendRequestTitle}>
              朋友请求添加我为好友：
            </Text>

            {friendRequests.length === 0 ? (
              <Text style={styles.friendRequestDesc}>目前没有好友请求～</Text>
            ) : (
              friendRequests.map((req) => (
                <View key={req.id} style={styles.requestItem}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarWrapper}>
                      <Image
                        source={{ uri: req.avatar }}
                        style={styles.avatar}
                      />
                    </View>
                    <View>
                        <Text style={styles.userName}>{req.name}</Text>
                        <Text style={styles.userIdText}>ID: {req.userId}</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    {req.status === 'pending' ? (
                        <>
                            <TouchableOpacity
                                style={[styles.btn, styles.acceptBtn]}
                                onPress={() => handleAccept(req.id, req.name, req.userId)}
                            >
                                <Text style={styles.btnText}>接受</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btn, styles.rejectBtn]}
                                onPress={() => handleReject(req.id, req.name, req.userId)}
                            >
                                <Text style={styles.btnText}>拒绝</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.statusText}>
                            {req.status === 'accepted' ? '已接受' : '已拒绝'}
                        </Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.header,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  friendRequestBox: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  friendRequestTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginBottom: 12,
  },

  friendRequestDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  userIdText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
    minWidth: 60,
    textAlign: 'center',
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  acceptBtn: {
    backgroundColor: "#FFD860",
  },
  rejectBtn: {
    backgroundColor: "#E5E5E5",
  },
  btnText: {
    color: "#232323",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SettingScreen;