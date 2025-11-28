import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors, borders, typography } from "../styles";
import { addFriend, searchUser, updateFriendRequest, getFriendRequests } from "../api/FriendApi";
import { useUserStore } from "../store/userStore";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  navigateTo?: string;
}

const AddFriend: React.FC = () => {
  const navigation = useNavigation();
  const { userToken, userId } = useUserStore();

  const [searchId, setSearchId] = useState("");
  const [debouncedSearchId, setDebouncedSearchId] = useState("");
  const [foundUser, setFoundUser] = useState<{
    user_id: string;
    name: string;
    avatar: string;
    phone?: string;
    image?: string;
    about?: string;
    request_by?: number;  // 0=None, 1=I sent, 2=They sent
    isstatus?: number;    // 0=None, 1=Pending, 2=Accepted, 4=Blocked
    list_id?: string;     // Needed for accepting/declining requests
  } | null>(null);
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "pending" | "loading" | "sent" | "error"
  >("idle");
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "loading" | "error" | "found"
  >("idle");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchId(searchId);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchId]);

  useEffect(() => {
    if (debouncedSearchId) {
        handleSearch(debouncedSearchId);
    } else {
        setFoundUser(null);
        setSearchStatus("idle");
    }
  }, [debouncedSearchId]);

  const menuItems: MenuItem[] = [
    { icon: "scan-outline", label: "扫描名片", navigateTo: "ScanQRCode" },
    { icon: "person-add-outline", label: "好友请求", navigateTo: "FriendReq" },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.navigateTo) {
      navigation.navigate(item.navigateTo as never);
    } else {
      console.log(`Pressed: ${item.label}`);
    }
  };

  const handleSearch = async (id: string) => {
    if (!id) {
      setFoundUser(null);
      setSearchStatus("idle");
      return;
    }

    setSearchStatus("loading");
    setFoundUser(null);
    setRequestStatus("idle"); // Reset request status when searching
    try {
      const user = await searchUser(id, userToken); // Pass userToken for friend status check
      if (user) {
        console.log('Found user with status:', user);

        let listId = user.list_id;

        // If there's a pending request from them (they sent me a request), fetch list_id
        if (user.request_by === 2 && user.isstatus === 1 && !listId && userToken) {
          console.log('Found pending request, fetching list_id...');
          try {
            const friendReqRes = await getFriendRequests(userToken, 1); // Get pending requests
            console.log('getFriendRequests response:', friendReqRes);

            if (friendReqRes && !friendReqRes.error && friendReqRes.response) {
              // Look in approve list (requests I received)
              const approveList = friendReqRes.response.approve || [];
              console.log('Searching in approve list for user_id:', user.user_id);

              const matchingRequest = approveList.find(
                (req: any) => req.user_id === user.user_id
              );

              if (matchingRequest && matchingRequest.list_id) {
                listId = matchingRequest.list_id;
                console.log('✅ Found list_id:', listId);
              } else {
                console.log('❌ No matching request found in approve list');
                console.log('Approve list:', approveList);
              }
            }
          } catch (err) {
            console.error('Error fetching list_id:', err);
          }
        }

        setFoundUser({
          user_id: user.user_id,
          name: user.name,
          avatar: user.image || "https://postimg.cc/34y84VvN",
          phone: user.phone,
          image: user.image,
          about: user.about,
          request_by: user.request_by ?? 0,  // Default to 0 (no relation)
          isstatus: user.isstatus ?? 0,      // Default to 0 (no relation)
          list_id: listId,
        });
        setSearchStatus("found");
      } else {
        setFoundUser(null);
        setSearchStatus("error"); // No user found or API error flag
      }
    } catch (error) {
      setFoundUser(null);
      setSearchStatus("error");
      console.error("Error during user search:", error);
    }
  };

  const handleSendRequest = async () => {
    console.log('handleSendRequest called - userId:', userId, 'foundUser:', foundUser?.user_id);

    if (foundUser && userId) {
      setRequestStatus("loading");
      try {
        console.log('Calling addFriend with:', { request_id: userId, approve_id: foundUser.user_id });
        await addFriend(userId, foundUser.user_id, "你好，我想加你为好友");
        setRequestStatus("sent");
        Alert.alert(
          "好友请求已发送",
          `你的好友请求已发送给 ${foundUser.name}。`
        );
      } catch (error) {
        setRequestStatus("error");
        console.error('handleSendRequest error:', error);
        Alert.alert("错误", "发送好友请求失败。");
      }
    } else {
      console.log('Cannot send request - userId:', userId, 'foundUser:', foundUser);
    }
  };

  const handleAcceptRequest = async () => {
    console.log('handleAcceptRequest called - foundUser:', foundUser);

    if (!foundUser || !foundUser.list_id) {
      console.log('Cannot accept - missing foundUser or list_id');
      Alert.alert("错误", "无法获取请求信息，请重新搜索该用户。");
      return;
    }

    setRequestStatus("loading");
    try {
      console.log('Calling updateFriendRequest with list_id:', foundUser.list_id, 'status: 2 (Accept)');

      await updateFriendRequest(foundUser.list_id, 2); // 2 = Accept

      setRequestStatus("sent");
      Alert.alert(
        "已接受",
        `你已接受 ${foundUser.name} 的好友请求。`
      );
      // Update the local state to reflect the change
      setFoundUser({ ...foundUser, isstatus: 2 });
    } catch (error) {
      setRequestStatus("error");
      console.error('handleAcceptRequest error:', error);
      Alert.alert("错误", "接受好友请求失败。");
    }
  };

  const handleDeclineRequest = async () => {
    console.log('handleDeclineRequest called - foundUser:', foundUser);

    if (!foundUser || !foundUser.list_id) {
      console.log('Cannot decline - missing foundUser or list_id');
      Alert.alert("错误", "无法获取请求信息，请重新搜索该用户。");
      return;
    }

    setRequestStatus("loading");
    try {
      console.log('Calling updateFriendRequest with list_id:', foundUser.list_id, 'status: 3 (Decline)');

      await updateFriendRequest(foundUser.list_id, 3); // 3 = Decline

      setRequestStatus("sent");
      Alert.alert(
        "已拒绝",
        `你已拒绝 ${foundUser.name} 的好友请求。`
      );
      // Update the local state to reflect the change
      setFoundUser({ ...foundUser, isstatus: 3 });
    } catch (error) {
      setRequestStatus("error");
      console.error('handleDeclineRequest error:', error);
      Alert.alert("错误", "拒绝好友请求失败。");
    }
  };

  // Render action buttons based on friend status
  const renderActionButtons = () => {
    if (!foundUser) return null;

    const { request_by, isstatus } = foundUser;

    // Already friends
    if (isstatus === 2) {
      return <Text style={styles.statusText}>已是好友</Text>;
    }

    // Blocked
    if (isstatus === 4) {
      return <Text style={[styles.statusText, styles.blockedText]}>已屏蔽</Text>;
    }

    // They sent me a request (I can accept or decline)
    if (request_by === 2 && isstatus === 1) {
      return (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAcceptRequest}
            disabled={requestStatus === "loading"}
          >
            <Text style={styles.actionButtonText}>
              {requestStatus === "loading" ? "处理中..." : "接受请求"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={handleDeclineRequest}
            disabled={requestStatus === "loading"}
          >
            <Text style={styles.actionButtonText}>
              {requestStatus === "loading" ? "处理中..." : "拒绝"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // I sent them a request (waiting for response)
    if (request_by === 1 && isstatus === 1) {
      return <Text style={styles.statusText}>等待回应</Text>;
    }

    // No relation or declined - show "Add Friend" button
    return (
      <TouchableOpacity
        style={[
          styles.sendButton,
          (requestStatus === "loading" || requestStatus === "sent") &&
            styles.pendingButton,
        ]}
        onPress={handleSendRequest}
        disabled={requestStatus === "loading" || requestStatus === "sent"}
      >
        <Text style={styles.sendButtonText}>
          {requestStatus === "loading"
            ? "发送中..."
            : requestStatus === "sent"
            ? "已发送"
            : "申请好友"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={colors.background.gradientYellow}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.text.blackMedium}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>添加好友</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} style={styles.searchIcon} />
            <TextInput
              placeholder="搜索用户ID 或 手机号"
              style={styles.searchInput}
              value={searchId}
              onChangeText={setSearchId}
              returnKeyType="search"
            />
            {searchId.length > 0 && (
              <TouchableOpacity onPress={() => setSearchId("")}>
                <Ionicons name="close-circle" size={20} color={colors.text.grayLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {searchStatus === "loading" && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text.primary} />
          </View>
        )}
        {searchStatus === "error" && (
          <Text style={styles.errorText}>用户未找到。</Text>
        )}
        {foundUser && searchStatus === "found" && (
          <View style={styles.searchResult}>
            <Image source={{ uri: foundUser.avatar }} style={styles.avatar} />
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{foundUser.name}</Text>
              <Text style={styles.userId}>ID: {foundUser.user_id}</Text>
              {foundUser.phone && (
                <Text style={styles.userId}>电话: {foundUser.phone}</Text>
              )}
              {foundUser.about && (
                <Text style={styles.userAbout} numberOfLines={2}>
                  {foundUser.about}
                </Text>
              )}
            </View>
            {renderActionButtons()}
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={colors.text.dark}
                  />
                </View>
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.grayLight}
              />
            </TouchableOpacity>
          ))}
        </View>
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
    backgroundColor: colors.background.yellowBright,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeight600,
    color: colors.text.blackMedium,
  },
  placeholder: {
    width: 40,
  },
  searchSection: {
    alignItems: "center",
    marginVertical: 30,
    marginBottom: 35,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.white,
    borderRadius: borders.radius8,
    paddingHorizontal: 15,
    paddingVertical: 0,
    height: 45,
    width: 370,
  },
  searchIcon: {
    marginRight: 8,
    color: colors.text.lightGray,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize15,
    color: colors.text.blackMedium,
    padding: 0,
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  searchResult: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    marginBottom: 25,
    padding: 15,
    backgroundColor: colors.background.white,
    borderRadius: borders.radius10,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: borders.radius25,
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1,
    marginRight: 15,
  },
  userName: {
    fontSize: typography.fontSize16,
    fontWeight: typography.fontWeightBold,
    color: colors.text.blackMedium,
  },
  userId: {
    fontSize: typography.fontSize14,
    color: colors.text.darkGray,
  },
  userAbout: {
    fontSize: typography.fontSize12,
    color: colors.text.grayLight,
    marginTop: 4,
    fontStyle: "italic",
  },
  statusText: {
    fontSize: typography.fontSize14,
    color: colors.text.grayLight,
    fontWeight: typography.fontWeight600,
    textAlign: "center",
    minWidth: 80,
  },
  blockedText: {
    color: "#EF4444",
  },
  buttonGroup: {
    flexDirection: "column",
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borders.radius8,
    minWidth: 80,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: colors.background.yellowBright,
  },
  declineButton: {
    backgroundColor: colors.border.grayMedium,
  },
  actionButtonText: {
    color: colors.text.blackMedium,
    fontWeight: typography.fontWeightBold,
    fontSize: typography.fontSize14,
  },
  sendButton: {
    backgroundColor: colors.background.yellowBright,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: borders.radius8,
  },
  pendingButton: {
    backgroundColor: colors.border.grayMedium,
  },
  sendButtonText: {
    color: colors.text.blackMedium,
    fontWeight: typography.fontWeightBold,
  },
  menuContainer: { gap: 12, paddingHorizontal: 16, marginBottom: 60 },
  menuItem: {
    backgroundColor: colors.background.white,
    borderRadius: borders.radius20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 35,
    height: 35,
    backgroundColor: colors.background.yellowBright,
    borderRadius: borders.radius50,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: typography.fontSize15,
    fontWeight: typography.fontWeight400,
    color: colors.text.dark,
    marginLeft: 15,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginBottom:25,
  },
});

export default AddFriend;
