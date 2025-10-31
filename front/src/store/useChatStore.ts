import { create } from "zustand";
import type { MessageType, SendMessageRequest, UserType } from "../type";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.ts";

type ChatState = {
  contacts: UserType[];
  chatPartners: UserType[];
  messages: MessageType[];
  activeTab: string;
  selectedUser: UserType | null;
  isContactsLoading: boolean;
  isChatPartnersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedUser: (user: UserType | null) => void;
  getContacts: () => void;
  getMyChatPartners: () => void;
  getMessagesByUserId: (userId: string) => void;
  sendMessage: (message: SendMessageRequest) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  contacts: [],
  chatPartners: [],
  messages: [], // 현재 채팅방의 채팅 내역
  activeTab: "chats",
  selectedUser: null,
  isContactsLoading: false,
  isChatPartnersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",
  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", (!get().isSoundEnabled).toString());
    set({ isSoundEnabled: !get().isSoundEnabled });
  },
  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
  },
  setSelectedUser: (user: UserType | null) => {
    set({ selectedUser: user });
  },
  getContacts: async () => {
    set({ isContactsLoading: true });
    await axiosInstance
      .get("/messages/contacts")
      .then((res) => {
        set({ contacts: res.data });
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      })
      .finally(() => {
        set({ isContactsLoading: false });
      });
  },
  getMyChatPartners: async () => {
    set({ isChatPartnersLoading: true });
    await axiosInstance
      .get("/messages/chats")
      .then((res) => {
        set({ chatPartners: res.data });
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      })
      .finally(() => {
        set({ isChatPartnersLoading: false });
      });
  },
  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true });
    await axiosInstance
      .get(`/messages/${userId}`)
      .then((res) => {
        set({ messages: res.data });
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      })
      .finally(() => {
        set({ isMessagesLoading: false });
      });
  },
  sendMessage: async (message: SendMessageRequest) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    if (!authUser || !selectedUser) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: MessageType = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: message.text,
      image: message.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    // optimistic update for UI (not persisted in DB)
    set({ messages: [...messages, optimisticMessage] });

    await axiosInstance
      .post(`/messages/send/${selectedUser._id}`, message)
      .then((res) => {
        set({ messages: messages.concat(res.data) });
      })
      .catch((e) => {
        console.error("Error in sendMessage: ", e);
        set({ messages: messages });
        toast.error("메세지 전송 실패");
      });
  },
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("newMessage", (newMessage: MessageType) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages; // 이전 채팅내역
      set({ messages: [...currentMessages, newMessage] }); // 새로온 메세지를 채팅내역에 추가

      // 소리 활성화 상태면 새로운 메세지를 알리는 소리 재생
      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => {
          console.log("Audio play failed", e);
        });
      }
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));
