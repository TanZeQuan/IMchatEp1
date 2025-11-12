import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userToken: null,
      setUserToken: (token) => set({ userToken: token }),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
