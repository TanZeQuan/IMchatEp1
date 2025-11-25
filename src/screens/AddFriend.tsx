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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors, borders, typography } from "../styles";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  navigateTo?: string;
}

const AddFriend: React.FC = () => {
  const navigation = useNavigation();

    const [searchId, setSearchId] = useState("");
    const [debouncedSearchId, setDebouncedSearchId] = useState("");
    const [foundUser, setFoundUser] = useState<
      { id: string; name: string; avatar: string } | null
    >(null);
    const [requestStatus, setRequestStatus] = useState<"idle" | "pending">("idle");

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
      handleSearch(debouncedSearchId);
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

    const handleSearch = (id: string) => {
      if (id) {
        // Mock user search
        setFoundUser({
          id: id,
          name: `User ${id}`,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(
            Math.random() * 70
          )}`, // Mock avatar
        });
        setRequestStatus("idle");
      } else {
        setFoundUser(null);
      }
    };
    const handleSendRequest = () => {
      if (foundUser) {
        Alert.alert(
          "Friend Request Sent",
          `Your friend request to ${foundUser.name} has been sent.`
        );
        setRequestStatus("pending");
      }
    };

    return (
      <LinearGradient colors={colors.background.gradientYellow} style={styles.safeArea}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text.blackMedium} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>添加好友</Text>
            <View style={styles.placeholder} />
          </View>
                  <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                      <Ionicons name="search" size={18} style={styles.searchIcon} />
                      <TextInput
                        placeholder="搜索用户ID"
                        style={styles.searchInput}
                        value={searchId}
                        onChangeText={setSearchId}
                        returnKeyType="search"
                      />
                    </View>
                  </View>
          {foundUser && (
            <View style={styles.searchResult}>
              <Image source={{ uri: foundUser.avatar }} style={styles.avatar} />
              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>{foundUser.name}</Text>
                <Text style={styles.userId}>{'ID: ' + foundUser.id}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  requestStatus === "pending" && styles.pendingButton,
                ]}
                onPress={handleSendRequest}
                disabled={requestStatus === "pending"}
              >
                <Text style={styles.sendButtonText}>
                  {requestStatus === "pending" ? "Pending" : "Send Friend Request"}
                </Text>
              </TouchableOpacity>
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
                    <Ionicons name={item.icon} size={20} color={colors.text.dark} />
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.grayLight} />
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
      searchResult: {      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginVertical: 10,
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
  });

  export default AddFriend;
