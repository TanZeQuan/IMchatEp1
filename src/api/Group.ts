// src/api/Group.ts
import axios from "axios";
import { API_BASE_URL } from "./config";

// ============================================
// 类型定义 - 群组相关
// ============================================

// 群组成员
export interface GroupMember {
  user_id: string;
  isadmin: number; // 1 = Regular member, 2 = Admin
}

// 添加群组参数
export interface AddGroupParams {
  name: string;
  user_id: string;
  image?: string;
  group: GroupMember[];
}

// ============================================
// API 函数 - 群组管理
// ============================================

/**
 * 创建群组聊天（多人）
 * Create a new group chat with multiple members
 * Automatically generates chat_id with "IMC" prefix
 * Groups can have 2+ members with one or more admins
 * Group chat has istype=2 and ischat=1 (Chatting) set automatically by backend
 */
export const addGroup = async (params: AddGroupParams) => {
  console.log('📞 addGroup called with:', {
    name: params.name,
    user_id: params.user_id,
    image: params.image,
    groupMembers: params.group.length
  });

  const data = {
    name: params.name,
    user_id: params.user_id,
    image: params.image || "",
    group: params.group
  };

  console.log('📦 Data object to send:', JSON.stringify(data, null, 2));

  // Try using fetch with manual FormData construction
  const formData = new FormData();
  const dataString = JSON.stringify(data);
  console.log('📝 Data string before append:', dataString);

  formData.append("data", dataString);

  console.log('✅ FormData prepared, making request...');

  try {
    console.log('🚀 Making API request to:', `${API_BASE_URL}/chats/group/new`);

    // Use fetch instead of axios for better control
    const response = await fetch(`${API_BASE_URL}/chats/group/new`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let browser/RN set it with boundary
    });

    console.log('📡 Response status:', response.status);

    const responseText = await response.text();
    console.log('📄 Raw response text:', responseText);

    let responseData;
    try {
      // Extract JSON from response (remove PHP warnings/errors before JSON)
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
    console.error('❌ Error creating group:', error);
    console.error('❌ Error message:', error.message);
    throw error;
  }
};
