import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { SignUpRequest, UserType } from "../type";
import toast from "react-hot-toast";

type AuthState = {
  authUser: UserType | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  checkAuth: () => void;
  signUp: (data: SignUpRequest) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  checkAuth: async () => {
    await axiosInstance
      .get("/auth/check")
      .then((res) => {
        set({ authUser: res.data });
      })
      .catch((e) => {
        console.error("Error in authCheck", e);
        set({ authUser: null });
      })
      .finally(() => {
        set({ isCheckingAuth: false });
      });
  },
  signUp: async (data: SignUpRequest) => {
    set({ isSigningUp: true });

    await axiosInstance
      .post("/auth/signup", data)
      .then((res) => {
        set({ authUser: res.data });
        toast.success("Account created successfully");
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      })
      .finally(() => {
        set({ isSigningUp: false });
      });
  },
}));
