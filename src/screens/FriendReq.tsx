import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../navigation/MainStack";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borders, typography } from "../styles";
import { getFriendRequests, updateFriendRequest } from "../api/FriendApi";
import { useUserStore } from "../store/userStore";

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

  // Received requests (收到的请求)
  const [receivedPending, setReceivedPending] = useState<FriendRequest[]>([]);
  const [receivedAccepted, setReceivedAccepted] = useState<FriendRequest[]>([]);
  const [receivedDeclined, setReceivedDeclined] = useState<FriendRequest[]>([]);

  // Sent requests (发送的请求)
  const [sentPending, setSentPending] = useState<FriendRequest[]>([]);
  const [sentAccepted, setSentAccepted] = useState<FriendRequest[]>([]);
  const [sentDeclined, setSentDeclined] = useState<FriendRequest[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // Fetch friend requests when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userToken && !hasFetched) {
        console.log('Fetching friend requests with token:', userToken);
        fetchFriendRequests();
      }
      
      // Reset when screen loses focus to refresh on next visit
      return () => {
        setHasFetched(false);
      };
    }, [userToken, hasFetched])
  );

  const fetchFriendRequests = async () => {
    if (!userToken) {
      console.log('No user token available');
      setIsLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setIsLoading(true);
      setRefreshing(true);
      console.log('Making API calls for friend requests...');

      // Fetch all 3 statuses in parallel with timeout
      const [pendingRes, acceptedRes, declinedRes] = await Promise.all([
        getFriendRequests(userToken, 1).catch(error => {
          console.error('Error fetching pending requests:', error);
          return null;
        }),
        getFriendRequests(userToken, 2).catch(error => {
          console.error('Error fetching accepted requests:', error);
          return null;
        }),
        getFriendRequests(userToken, 3).catch(error => {
          console.error('Error fetching declined requests:', error);
          return null;
        }),
      ]);

      console.log('Pending Response:', pendingRes);
      console.log('Accepted Response:', acceptedRes);
      console.log('Declined Response:', declinedRes);

      // Reset all states first
      setReceivedPending([]);
      setSentPending([]);
      setReceivedAccepted([]);
      setSentAccepted([]);
      setReceivedDeclined([]);
      setSentDeclined([]);

      // Pending (status=1)
      if (pendingRes && !pendingRes.error && pendingRes.response) {
        setReceivedPending(pendingRes.response.approve || []);
        setSentPending(pendingRes.response.request || []);
      } else {
        console.log('No valid pending response data');
      }

      // Accepted (status=2)
      if (acceptedRes && !acceptedRes.error && acceptedRes.response) {
        setReceivedAccepted(acceptedRes.response.approve || []);
        setSentAccepted(acceptedRes.response.request || []);
      } else {
        console.log('No valid accepted response data');
      }

      // Declined (status=3)
      if (declinedRes && !declinedRes.error && declinedRes.response) {
        setReceivedDeclined(declinedRes.response.approve || []);
        setSentDeclined(declinedRes.response.request || []);
      } else {
        console.log('No valid declined response data');
      }

      setHasFetched(true);

    } catch (error) {
      console.error('Error fetching friend requests:', error);
      Alert.alert("错误", "无法获取好友请求");
      
      // Reset states on error
      setReceivedPending([]);
      setSentPending([]);
      setReceivedAccepted([]);
      setSentAccepted([]);
      setReceivedDeclined([]);
      setSentDeclined([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleAccept = async (listId: string, name: string) => {
    try {
      console.log('Accepting friend request:', listId);
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
      console.log('Rejecting friend request:', listId);
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

  const renderRequestItem = (req: FriendRequest, isReceived: boolean, status: 'pending' | 'accepted' | 'declined') => {
    const displayName = req.name || req.request_id || "未知用户";
    const displayAvatar = req.image || "https://i.postimg.cc/34y84VvN/user.png";
    const userId = isReceived ? req.request_id : req.approve_id;

    return (
      <View key={req.list_id} style={styles.requestItem}>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: displayAvatar }}
              style={styles.avatar}
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
          </View>
          <View>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userIdText}>ID: {userId}</Text>
            {req.phone && <Text style={styles.userIdText}>电话: {req.phone}</Text>}
          </View>
        </View>

        <View style={styles.actionButtons}>
          {status === 'pending' && isReceived ? (
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
          ) : status === 'pending' && !isReceived ? (
            <Text style={styles.statusText}>等待回应</Text>
          ) : status === 'accepted' ? (
            <Text style={[styles.statusText, styles.acceptedText]}>已接受</Text>
          ) : (
            <Text style={[styles.statusText, styles.declinedText]}>已拒绝</Text>
          )}
        </View>
      </View>
    );
  };

  // Add manual refresh function
  const handleManualRefresh = () => {
    setHasFetched(false);
    fetchFriendRequests();
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
            <TouchableOpacity onPress={handleManualRefresh} style={styles.debugButton}>
              <Text style={styles.debugButtonText}>强制刷新</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text.primary} />
            <Text style={styles.loadingText}>加载中...</Text>
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
              setHasFetched(false);
              fetchFriendRequests();
            }}
          >
            <Ionicons name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setHasFetched(false);
                fetchFriendRequests();
              }}
              colors={[colors.text.primary]}
              tintColor={colors.text.primary}
            />
          }
        >
          {/* Debug Info */}
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              数据状态: 收到待处理({receivedPending.length}) | 收到已接受({receivedAccepted.length}) | 收到已拒绝({receivedDeclined.length})
            </Text>
            <Text style={styles.debugText}>
              发送待处理({sentPending.length}) | 发送已接受({sentAccepted.length}) | 发送已拒绝({sentDeclined.length})
            </Text>
          </View>

          {/* Received Pending Requests */}
          <View style={styles.friendRequestBox}>
            <Text style={styles.friendRequestTitle}>
              收到的待处理请求 ({receivedPending.length})
            </Text>

            {receivedPending.length === 0 ? (
              <Text style={styles.friendRequestDesc}>目前没有待处理的好友请求～</Text>
            ) : (
              receivedPending.map((req) => renderRequestItem(req, true, 'pending'))
            )}
          </View>

          {/* Received Accepted */}
          <View style={[styles.friendRequestBox, styles.historyBox]}>
            <Text style={styles.friendRequestTitle}>
              已接受的好友 ({receivedAccepted.length})
            </Text>

            {receivedAccepted.length === 0 ? (
              <Text style={styles.friendRequestDesc}>还没有接受的好友请求～</Text>
            ) : (
              receivedAccepted.map((req) => renderRequestItem(req, true, 'accepted'))
            )}
          </View>

          {/* Received Declined */}
          <View style={[styles.friendRequestBox, styles.historyBox]}>
            <Text style={styles.friendRequestTitle}>
              已拒绝的请求 ({receivedDeclined.length})
            </Text>

            {receivedDeclined.length === 0 ? (
              <Text style={styles.friendRequestDesc}>还没有拒绝的好友请求～</Text>
            ) : (
              receivedDeclined.map((req) => renderRequestItem(req, true, 'declined'))
            )}
          </View>

          {/* Sent Pending Requests */}
          <View style={[styles.friendRequestBox, styles.sentRequestsBox]}>
            <Text style={styles.friendRequestTitle}>
              发送的待处理请求 ({sentPending.length})
            </Text>

            {sentPending.length === 0 ? (
              <Text style={styles.friendRequestDesc}>你还没有发送待处理的好友请求～</Text>
            ) : (
              sentPending.map((req) => renderRequestItem(req, false, 'pending'))
            )}
          </View>

          {/* Sent Accepted */}
          <View style={[styles.friendRequestBox, styles.historyBox]}>
            <Text style={styles.friendRequestTitle}>
              对方已接受的请求 ({sentAccepted.length})
            </Text>

            {sentAccepted.length === 0 ? (
              <Text style={styles.friendRequestDesc}>还没有被接受的好友请求～</Text>
            ) : (
              sentAccepted.map((req) => renderRequestItem(req, false, 'accepted'))
            )}
          </View>

          {/* Sent Declined */}
          <View style={[styles.friendRequestBox, styles.historyBox]}>
            <Text style={styles.friendRequestTitle}>
              对方已拒绝的请求 ({sentDeclined.length})
            </Text>

            {sentDeclined.length === 0 ? (
              <Text style={styles.friendRequestDesc}>还没有被拒绝的好友请求～</Text>
            ) : (
              sentDeclined.map((req) => renderRequestItem(req, false, 'declined'))
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
  debugButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 4,
    borderRadius: 4,
  },
  debugButtonText: {
    fontSize: 10,
    color: '#666',
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
  loadingText: {
    marginTop: 10,
    fontSize: typography.fontSize14,
    color: colors.text.grayLight,
  },
  content: {
    flex: 1,
  },
  debugInfo: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 4,
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  friendRequestBox: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  historyBox: {
    backgroundColor: '#FAFAFA',
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
  acceptedText: {
    color: '#22C55E',
  },
  declinedText: {
    color: '#EF4444',
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