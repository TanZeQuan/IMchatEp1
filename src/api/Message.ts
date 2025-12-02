import axios from "axios";
import { API_BASE_URL } from "./config";
/**
 * 获取用户的聊天列表
 * Get chats for a specific user
 */
export const getChatsForUser = async (userId: string) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
        user_id: userId
    }));

    const url = `${API_BASE_URL}/chats/read`;
    console.log(`Fetching chats for user ${userId} from ${url}`); // Added logging

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            // Attempt to read the error body for more details
            const errorBody = await response.text();
            console.error("Server responded with an error:", response.status, errorBody);
            throw new Error(`Server error: ${response.status}. Body: ${errorBody}`);
        }

        const data = await response.json();
        console.log("Successfully fetched chats:", data); // Added logging
        return data;
    } catch (error) {
        console.error("An unexpected error occurred during fetch:", error);
        throw error; // Re-throw the error to be caught by the component
    }
};

/**
 * 获取特定聊天的消息
 * Retrieve messages from a specific chat
 * Returns last 50 messages ordered by newest first, plus group member info
 */
export const getChatMessages = async (chatId: string, offset: number = 0) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
        chat_id: chatId,
        offset: offset
    }));

    const url = `${API_BASE_URL}/chats/message/read`;
    console.log(`Fetching messages for chat ${chatId} with offset ${offset} from ${url}`);

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Server responded with an error:", response.status, errorBody);
            throw new Error(`Server error: ${response.status}. Body: ${errorBody}`);
        }

        const data = await response.json();
        console.log("Successfully fetched messages:", data);
        return data;
    } catch (error) {
        console.error("An unexpected error occurred during fetch:", error);
        throw error;
    }
};
