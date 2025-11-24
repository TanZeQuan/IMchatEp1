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
      <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.safeArea}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#333" />
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
                    <Ionicons name={item.icon} size={20} color="#1F2937" />
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
      backgroundColor: "#FFD860",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    backButton: {
      width: 40,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
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
      backgroundColor: "#fff",
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 0,
      height: 45,
      width: 370,
    },
    searchIcon: {
      marginRight: 8,
      color: "#999999",
    },
      searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#333",
        padding: 0,
      },
      searchResult: {      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginVertical: 10,
      padding: 15,
      backgroundColor: "#fff",
      borderRadius: 10,
      // iOS Shadow
      shadowColor: "#898989",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      // Android Shadow
      elevation: 5,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    userInfoContainer: {
      flex: 1,
      marginRight: 15,
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    userId: {
      fontSize: 14,
      color: "#666",
    },
    sendButton: {
      backgroundColor: "#FFD860",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    pendingButton: {
      backgroundColor: "#ccc",
    },
    sendButtonText: {
      color: "#333",
      fontWeight: "bold",
    },
    menuContainer: { gap: 12, paddingHorizontal: 16, marginBottom: 60 },
    menuItem: {
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  
      shadowColor: "#898989",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
  
      elevation: 5,
    },
    menuItemLeft: { flexDirection: "row", alignItems: "center" },
    iconContainer: {
      width: 35,
      height: 35,
      backgroundColor: "#FFD860",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    menuItemText: {
      fontSize: 15,
      fontWeight: "400",
      color: "#1F2937",
      marginLeft: 15,
    },
  });
  
  export default AddFriend;