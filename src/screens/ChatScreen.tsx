import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#EFEFEF',
  header: '#F4D03F',
  messageLeft: '#FFFFFF',
  messageRight: '#E8C66A',
  textPrimary: '#222222',
  inputBg: '#FFFFFF',
  sendButton: '#F4D03F',
};

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
}

export default function ChatScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { chatName } = route.params || { chatName: '聊天' };

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'other', text: '嗨～你好呀 👋' },
    { id: '2', sender: 'me', text: '你好呀！最近怎么样？' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'me', text: inputText }]);
    setInputText('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === 'me' ? styles.messageRight : styles.messageLeft]}>
      <View style={[styles.bubble, item.sender === 'me' ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{chatName}</Text>
        </View>

        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
        />

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="输入消息..." placeholderTextColor="#999" value={inputText} onChangeText={setInputText} />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, paddingHorizontal: 12, paddingVertical: 10, elevation: 2 },
  backButton: { marginRight: 6 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  chatList: { padding: 12, paddingBottom: 80 },
  messageContainer: { marginVertical: 4 },
  messageLeft: { alignSelf: 'flex-start' },
  messageRight: { alignSelf: 'flex-end' },
  bubble: { maxWidth: '75%', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  bubbleLeft: { backgroundColor: COLORS.messageLeft, borderTopLeftRadius: 0 },
  bubbleRight: { backgroundColor: COLORS.messageRight, borderTopRightRadius: 0 },
  messageText: { fontSize: 15, color: COLORS.textPrimary },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, paddingHorizontal: 12, paddingVertical: 6, borderTopWidth: 0.5, borderTopColor: '#ddd', position: 'absolute', bottom: 0, width: '100%' },
  input: { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, fontSize: 14 },
  sendButton: { marginLeft: 8, backgroundColor: COLORS.sendButton, borderRadius: 20, padding: 10 },
});
