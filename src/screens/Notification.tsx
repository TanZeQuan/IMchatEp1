import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native'; // ✅ Import navigation hook

interface NotificationItemProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  label,
  value,
  onToggle,
}) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#D1D1D1', true: '#4CD964' }}
      thumbColor="#fff"
      ios_backgroundColor="#D1D1D1"
    />
  </View>
);

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation(); // ✅ Get navigation instance

  const [messageNotification, setMessageNotification] = useState(false);
  const [voiceNotification, setVoiceNotification] = useState(true);
  const [videoNotification, setVideoNotification] = useState(false);

  const handleGoBack = () => {
    navigation.goBack(); // ✅ Navigate back
  };

  return (
        <LinearGradient colors={["#FFEFb0", "#FFF9E5"]} style={styles.container}>
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通知</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Notification Items */}
      <View style={styles.content}>
        <NotificationItem
          label="信息通知"
          value={messageNotification}
          onToggle={setMessageNotification}
        />
        <NotificationItem
          label="语音通知"
          value={voiceNotification}
          onToggle={setVoiceNotification}
        />
        <NotificationItem
          label="视频通知"
          value={videoNotification}
          onToggle={setVideoNotification}
        />
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5E6B3',
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
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
});

export default NotificationSettingsScreen;
