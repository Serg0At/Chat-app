import { create } from "zustand";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: 'chats',
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem('isSoundEnabled') === true,

    toggleSound: () => {
        localStorage.setItem('isSoundEnabled', !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

}))