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
  background: '#F7F7F7',
  header: '#FFD860',
  messageLeft: '#FFFFFF',
  messageRight: '#FFD860',
  textPrimary: '#222222',
  inputBg: '#FFFFFF',
  sendButton: '#FFD860',
  timestamp: '#999999',
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
    <View style={[styles.messageRow, item.sender === 'me' ? styles.messageRowRight : styles.messageRowLeft]}>
      <View style={[styles.bubble, item.sender === 'me' ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>

      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          inverted
        />
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="输入消息..." placeholderTextColor="#9E9E9E" value={inputText} onChangeText={setInputText} />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.header,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  keyboardAvoidingView: { flex: 1, backgroundColor: COLORS.background },
  chatList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
  },
  bubbleLeft: {
    backgroundColor: COLORS.messageLeft,
    borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: COLORS.messageRight,
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F0F0F0',
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: COLORS.sendButton,
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
