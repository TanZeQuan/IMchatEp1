// src/api/FriendApi.ts
import axios from 'axios';

const API_BASE_URL = 'https://prelabial-lustrously-michaela.ngrok-free.dev/api';

export const addFriend = async (request_id: string, approve_id: string, message?: string) => {
  const formData = new FormData();
  const data = {
    request_id,
    approve_id,
    message,
  };
  formData.append("data", JSON.stringify(data));

  console.log('addFriend - Sending params:', data);

  try {
    const response = await axios.post(`${API_BASE_URL}/chats/friends/new`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('addFriend - Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

export const searchUser = async (search: string, userId?: string) => {
  const formData = new FormData();
  const data = userId ? { search, user_id: userId } : { search };

  formData.append("data", JSON.stringify(data));

  console.log('searchUser - Sending params:', data);

  try {
    const response = await axios.post(`${API_BASE_URL}/users/search`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('searchUser - Response:', response.data);

    if (response.data && response.data.response && response.data.response.length > 0) {
      const validUsers = response.data.response.filter((user: any) =>
        !Array.isArray(user) || user[0] !== "fail"
      );

      if (validUsers.length > 0) {
        return validUsers[0];
      }
    }
    return null;
  } catch (error) {
    console.error('Error searching for user:', error);
    throw error;
  }
};

export const getFriendRequests = async (userId: string, status: number = 1) => {
  const formData = new FormData();
  const data = {
    user_id: userId,
    request_id: userId,
    approve_id: userId,
    isstatus: status,
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

    return response.data;
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    throw error;
  }
};

export const updateFriendRequest = async (listId: string, status: number) => {
  const formData = new FormData();
  const data = {
    list_id: listId,
    isstatus: status,
  };
  formData.append("data", JSON.stringify(data));

  console.log('updateFriendRequest - Sending params:', data);

  try {
    const response = await axios.post(`${API_BASE_URL}/chats/friends/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('updateFriendRequest - Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error updating friend request:', error);
    throw error;
  }
};

// Update friend request using request_id and approve_id instead of list_id
export const updateFriendRequestByUsers = async (requestId: string, approveId: string, status: number) => {
  const formData = new FormData();
  const data = {
    request_id: requestId,
    approve_id: approveId,
    isstatus: status,
  };
  formData.append("data", JSON.stringify(data));

  console.log('updateFriendRequestByUsers - Sending params:', data);

  try {
    const response = await axios.post(`${API_BASE_URL}/chats/friends/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('updateFriendRequestByUsers - Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error updating friend request by users:', error);
    throw error;
  }
};