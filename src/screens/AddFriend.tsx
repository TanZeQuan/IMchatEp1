import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
// import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  navigateTo?: string; // 可选导航路径
}

const AddFriend: React.FC = () => {
  const navigation = useNavigation(); // ✅ 导航实例

  const menuItems: MenuItem[] = [
    { icon: "scan-outline", label: "扫描名片" },
    { icon: "person-add-outline", label: "好友请求" },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.navigateTo) {
      navigation.navigate(item.navigateTo as never);
    } else {
      console.log(`Pressed: ${item.label}`);
    }
  };

  return (
    <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.safeArea}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* ✅ Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>添加好友</Text>
          <View style={styles.placeholder} />
        </View>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} style={styles.searchIcon} />
            <TextInput placeholder="搜索" style={styles.searchInput} />
          </View>
        </View>

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
    // backgroundColor: "#fff",
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
    marginVertical: 35,
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
    color: "#999999",
    padding: 0,
  },
  menuContainer: { gap: 12, paddingHorizontal: 16, marginBottom: 60 },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // iOS Shadow
    shadowColor: "#898989",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // Android Shadow
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
