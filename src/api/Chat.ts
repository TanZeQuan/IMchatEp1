// src/api/Chat.ts
import axios from 'axios';

const API_BASE_URL = 'https://prelabial-lustrously-michaela.ngrok-free.dev/api';

// Create a new private chat (one-on-one conversation)
export const createPrivateChat = async (
  userId: string,
  chatWith: string,
  chatName?: string
) => {
  const formData = new FormData();
  const data = {
    name: chatName || `Chat with ${chatWith}`,
    user_id: userId,
    chat_with: chatWith,
    image: "",
    group: [
      { user_id: userId, isadmin: 2 },      // 2 = Admin (creator)
      { user_id: chatWith, isadmin: 1 }     // 1 = Regular member
    ]
  };
  formData.append("data", JSON.stringify(data));

  try {
    const response = await axios.post(`${API_BASE_URL}/chats/private/new`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Response: { response: "chat_id", error: false, message: "Chat existed." or "Chats Created." }
    return response.data;
  } catch (error) {
    console.error('Error creating private chat:', error);
    throw error;
  }
};
