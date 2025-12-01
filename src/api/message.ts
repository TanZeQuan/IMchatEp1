// src/api/message.ts
import { API_BASE_URL } from "../config";

export const getChatsForUser = async (userId: string) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
        user_id: userId
    }));

    const url = `${API_BASE_URL}/api/chats/read`;
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
