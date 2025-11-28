// src/api/AddFriend.ts
import axios from 'axios';

const API_BASE_URL = 'https://prelabial-lustrously-michaela.ngrok-free.dev/api'; // Replace with your actual API base URL

export const addFriend = async (request_id: string, approve_id: string, message?: string) => {
  const formData = new FormData();
  const data = {
    request_id,
    approve_id,
    message,
  };
  formData.append("data", JSON.stringify(data));

  try {
    const response = await axios.post(`${API_BASE_URL}/chats/friends/new`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

export const searchUser = async (search: string) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ search }));

  try {
    const response = await axios.post(`${API_BASE_URL}/users/search`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Assuming the API returns a structure like: {"response":[{"user_id": "...", "name": "...", "image": "...", "phone": "..."}, ...], "error": false, "message": "..."}
    if (response.data && response.data.response && response.data.response.length > 0) {
      return response.data.response[0]; // Return the first found user object
    }
    return null; // No user found
  } catch (error) {
    console.error('Error searching for user:', error);
    throw error;
  }
};
