import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  userToken: string | null;
  userId: string | null;
  contacts: any[]; // You can define a proper type for contacts
  setUserToken: (token: string | null) => void;
  setUserId: (userId: string | null) => void;
  setContacts: (contacts: any[]) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userToken: null,
      userId: null,
      contacts: [],
      setUserToken: (token) => set({ userToken: token }),
      setUserId: (userId) => set({ userId }),
      setContacts: (contacts) => set({ contacts }),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
