// src/api/Chat.ts
import axios from "axios";
import { API_BASE_URL } from "./config";

// ============================================
// API 函数 - 私聊管理
// ============================================

/**
 * 创建私聊（一对一对话）
 * Create a new private chat (one-on-one conversation)
 */
export const createPrivateChat = async (
  userId: string,
  chatWith: string,
  chatName?: string
) => {
  console.log('📞 createPrivateChat called with:', {
    userId,
    chatWith,
    chatName
  });

  const data = {
    name: chatName || `Chat with ${chatWith}`,
    user_id: userId,
    chat_with: chatWith,
    // image: "",
    group: [
      { user_id: userId, isadmin: 2 },      // 2 = Admin (creator)
      { user_id: chatWith, isadmin: 1 }     // 1 = Regular member
    ]
  };

  console.log('📦 Data object to send:', JSON.stringify(data, null, 2));

  // Try using fetch with manual FormData construction
  const formData = new FormData();
  const dataString = JSON.stringify(data);
  console.log('📝 Data string before append:', dataString);

  formData.append("data", dataString);

  console.log('✅ FormData prepared, making request...');

  try {
    console.log('🚀 Making API request to:', `${API_BASE_URL}/chats/private/new`);

    // Use fetch instead of axios for better control
    const response = await fetch(`${API_BASE_URL}/chats/private/new`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let browser/RN set it with boundary
    });

    console.log('📡 Response status:', response.status);

    const responseText = await response.text();
    console.log('📄 Raw response text:', responseText);

    let responseData;
    try {
      // Extract JSON from response (remove PHP this is new for text warnings/errors before JSON)
      const jsonMatch = responseText.match(/\{[\s\S]*\}$/);
      const cleanJson = jsonMatch ? jsonMatch[0] : responseText;

      responseData = JSON.parse(cleanJson);
      console.log('✅ Parsed response data:', responseData);
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON');
      console.error('Response was:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    console.log('   - response.response:', responseData.response);
    console.log('   - response.error:', responseData.error);
    console.log('   - response.message:', responseData.message);

    return responseData;
  } catch (error: any) {
    console.error('❌ Error creating private chat:', error);
    console.error('❌ Error message:', error.message);
    throw error;
  }
};
