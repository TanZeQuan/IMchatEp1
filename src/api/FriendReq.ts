// src/api/FriendReq.ts
import axios from 'axios';

const API_BASE_URL = 'https://prelabial-lustrously-michaela.ngrok-free.dev/api';

// Read friend requests (Pending/Accepted/Declined)
export const getFriendRequests = async (userId: string, status: number = 1) => {
  const formData = new FormData();
  const data = {
    user_id: userId,
    request_id: userId,  // Get friends where this user sent request
    approve_id: userId,  // Get friends where this user received request
    isstatus: status,    // 1 = Pending, 2 = Accepted, 3 = Declined
  };

  console.log('getFriendRequests - Sending params:', data);

  formData.append("data", JSON.stringify(data));

  try {
    const response = await axios.post(`${API_BASE_URL}/chats/friends/read`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('getFriendRequests - Response:', response.data);

    // Response structure: { response: { request: [...], approve: [...] }, error: false, message: "..." }
    return response.data;
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    throw error;
  }
};

// Update friend request status (Accept or Decline)
export const updateFriendRequest = async (listId: string, status: number) => {
  const formData = new FormData();
  const data = {
    list_id: listId,
    isstatus: status,  // 2 = Accepted, 3 = Declined
  };
  formData.append("data", JSON.stringify(data));

  try {
    const response = await axios.post(`${API_BASE_URL}/chats/friends/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating friend request:', error);
    throw error;
  }
};
