import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { UserType } from "../type";

type AuthState = {
  authUser: UserType | null;
  isCheckingAuth: boolean;
  checkAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (e) {
      console.error("Error in AuthCheck", e);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
