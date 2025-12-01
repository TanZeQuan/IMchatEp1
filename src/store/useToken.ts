import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  currentUserId: string | null;
  userToken: string | null;
  contacts: any[]; // define proper type if needed
  userName: string | null;
  userAvatar: string | null;

  // ---------- actions ----------
  setCurrentUserId: (id: string | null) => void;
  setUserToken: (token: string | null) => void;
  setContacts: (contacts: any[]) => void;
  setUserName: (name: string | null) => void;
  setUserAvatar: (uri: string | null) => void;

  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      userToken: null,
      contacts: [],
      userName: null,
      userAvatar: null,

      setCurrentUserId: (id) => set({ currentUserId: id }),
      setUserToken: (token) => set({ userToken: token }),
      setContacts: (contacts) => set({ contacts }),
      setUserName: (name) => set({ userName: name }),
      setUserAvatar: (uri) => set({ userAvatar: uri }),

      clearUserData: () => {
        const id = get().currentUserId;
        if (!id) return;
        set({
          userName: null,
          userAvatar: null,
          contacts: [],
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ------------------- Settings Store -------------------
interface SettingsState {
  showSendButton: boolean;
  setShowSendButton: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      showSendButton: true,
      setShowSendButton: (show) => set({ showSendButton: show }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
