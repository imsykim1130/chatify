import { create } from "zustand";
import type { Message, UserType } from "../type";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

type ChatState = {
  contacts: UserType[];
  chatPartners: UserType[];
  messages: Message[];
  activeTab: string;
  selectedUser: UserType | null;
  isContactsLoading: boolean;
  isChatPartnersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedUser: (user: UserType) => void;
  getContacts: () => void;
  getMyChatPartners: () => void;
  getMessagesByUserId: (userId: number) => void;
  sendMessage: (message: Message) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  contacts: [],
  chatPartners: [],
  messages: [],
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
  setSelectedUser: (user: UserType) => {
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
  getMessagesByUserId: async (userId: number) => {
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
  sendMessage: async (message: Message) => {},
}));
