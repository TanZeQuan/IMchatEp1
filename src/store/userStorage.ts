import AsyncStorage from '@react-native-async-storage/async-storage';

// 全局唯一的 key，用于存储当前登录用户
const CURRENT_USER_ID_KEY = 'currentUserId';
const USER_TOKEN_KEY = 'userToken';

// 给每个用户独立的 key
const getUserKey = (userId: string, key: string) => `${key}_${userId}`;

let user = {
  id: '',
  token: ''
};
AsyncStorage.setItem(CURRENT_USER_ID_KEY, JSON.stringify(user));

export const Storage = {
  // ---------- 当前登录用户 ID ----------
  setUserId: async (userId: string) => {
    // await AsyncStorage.setItem(CURRENT_USER_ID_KEY, userId);
  },
  getUserId: async (): Promise<string | null> => {
    return AsyncStorage.getItem(CURRENT_USER_ID_KEY);
  },
  removeUserId: async () => {
    await AsyncStorage.removeItem(CURRENT_USER_ID_KEY);
  },

  // ---------- Token ----------
  setUserToken: async (token: string) => {
    await AsyncStorage.setItem(USER_TOKEN_KEY, token);
  },
  getUserToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(USER_TOKEN_KEY);
  },
  removeUserToken: async () => {
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
  },

  // ---------- 用户独立信息 ----------
  setUserName: async (userId: string, name: string) => {
    await AsyncStorage.setItem(getUserKey(userId, 'userName'), name);
  },
  getUserName: async (userId: string): Promise<string | null> => {
    return AsyncStorage.getItem(getUserKey(userId, 'userName'));
  },

  setUserAvatar: async (userId: string, uri: string) => {
    await AsyncStorage.setItem(getUserKey(userId, 'userAvatar'), uri);
  },
  getUserAvatar: async (userId: string): Promise<string | null> => {
    return AsyncStorage.getItem(getUserKey(userId, 'userAvatar'));
  },

  // 清空某个用户的所有数据
  clearUserData: async (userId: string) => {
    await AsyncStorage.multiRemove([
      getUserKey(userId, 'userName'),
      getUserKey(userId, 'userAvatar'),
    ]);
  },
};

export default Storage;
