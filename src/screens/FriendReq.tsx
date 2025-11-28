import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../navigation/MainStack";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borders, typography } from "../styles";
import { getFriendRequests, updateFriendRequest } from "../api/FriendReq";
import { useUserStore } from "../store/useToken";

const COLORS = {
  background: "#F5F5F5",
  header: "#FFD860",
  white: "#FFFFFF",
  textPrimary: "#232323",
  textSecondary: "#999999",
  border: "#E5E5E5",
};

interface FriendRequest {
  list_id: string;
  request_id: string;
  approve_id: string;
  name?: string;
  image?: string;
  phone?: string;
  isstatus: number;
  created_at?: string;
}

const FriendReqScreen: React.FC = () => {
  const { userToken } = useUserStore();
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  useEffect(() => {
    if (userToken) {
      fetchFriendRequests();
    }
  }, [userToken]);

  const fetchFriendRequests = async () => {
    if (!userToken) return;

    try {
      setIsLoading(true);
      const response = await getFriendRequests(userToken, 1); // Get pending requests

      if (response && !response.error && response.response) {
        // approve: requests I received
        setReceivedRequests(response.response.approve || []);
        // request: requests I sent
        setSentRequests(response.response.request || []);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      Alert.alert("错误", "无法获取好友请求");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleAccept = async (listId: string, name: string) => {
    try {
      const response = await updateFriendRequest(listId, 2); // 2 = Accept

      if (response && !response.error) {
        Alert.alert("成功", `你已接受 ${name} 的好友请求`);
        // Refresh the list
        fetchFriendRequests();
      } else {
        Alert.alert("错误", "无法接受好友请求");
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert("错误", "无法接受好友请求");
    }
  };

  const handleReject = async (listId: string, name: string) => {
    try {
      const response = await updateFriendRequest(listId, 3); // 3 = Decline

      if (response && !response.error) {
        Alert.alert("已拒绝", `你已拒绝 ${name} 的好友请求`);
        // Refresh the list
        fetchFriendRequests();
      } else {
        Alert.alert("错误", "无法拒绝好友请求");
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert("错误", "无法拒绝好友请求");
    }
  };

  const renderRequestItem = (req: FriendRequest, isReceived: boolean) => {
    const displayName = req.name || req.request_id || "未知用户";
    const displayAvatar = req.image || "https://postimg.cc/34y84VvN";
    const userId = isReceived ? req.request_id : req.approve_id;

    return (
      <View key={req.list_id} style={styles.requestItem}>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: displayAvatar }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userIdText}>ID: {userId}</Text>
            {req.phone && <Text style={styles.userIdText}>电话: {req.phone}</Text>}
          </View>
        </View>

        <View style={styles.actionButtons}>
          {isReceived ? (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.acceptBtn]}
                onPress={() => handleAccept(req.list_id, displayName)}
              >
                <Text style={styles.btnText}>接受</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.rejectBtn]}
                onPress={() => handleReject(req.list_id, displayName)}
              >
                <Text style={styles.btnText}>拒绝</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.statusText}>等待回应</Text>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
        <SafeAreaView style={styles.safeArea}>
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text.primary} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
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
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              setRefreshing(true);
              fetchFriendRequests();
            }}
          >
            <Ionicons name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Received Requests */}
          <View style={styles.friendRequestBox}>
            <Text style={styles.friendRequestTitle}>
              收到的好友请求 ({receivedRequests.length})
            </Text>

            {receivedRequests.length === 0 ? (
              <Text style={styles.friendRequestDesc}>目前没有待处理的好友请求～</Text>
            ) : (
              receivedRequests.map((req) => renderRequestItem(req, true))
            )}
          </View>

          {/* Sent Requests */}
          <View style={[styles.friendRequestBox, styles.sentRequestsBox]}>
            <Text style={styles.friendRequestTitle}>
              发送的好友请求 ({sentRequests.length})
            </Text>

            {sentRequests.length === 0 ? (
              <Text style={styles.friendRequestDesc}>你还没有发送好友请求～</Text>
            ) : (
              sentRequests.map((req) => renderRequestItem(req, false))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.header,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: colors.border.grayLight,
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  refreshButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight600,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  friendRequestBox: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  sentRequestsBox: {
    marginTop: 8,
  },
  friendRequestTitle: {
    fontSize: typography.fontSize16,
    color: COLORS.textPrimary,
    fontWeight: typography.fontWeight600,
    marginBottom: 12,
  },
  friendRequestDesc: {
    fontSize: typography.fontSize14,
    color: COLORS.textSecondary,
    paddingVertical: 20,
    textAlign: 'center',
  },
  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: borders.width1,
    borderColor: COLORS.border,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: borders.radius20,
    overflow: "hidden",
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: typography.fontSize15,
    color: COLORS.textPrimary,
    fontWeight: typography.fontWeight500,
  },
  userIdText: {
    fontSize: typography.fontSize12,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: typography.fontSize14,
    color: COLORS.textSecondary,
    fontWeight: typography.fontWeight500,
    minWidth: 60,
    textAlign: 'center',
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borders.radius6,
  },
  acceptBtn: {
    backgroundColor: colors.background.yellowBright,
  },
  rejectBtn: {
    backgroundColor: COLORS.border,
  },
  btnText: {
    color: colors.text.primary,
    fontSize: typography.fontSize14,
    fontWeight: typography.fontWeight500,
  },
});

export default FriendReqScreen;
