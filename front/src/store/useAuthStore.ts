import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { SignInRequest, SignUpRequest, UserType } from "../type";
import toast from "react-hot-toast";

type AuthState = {
  authUser: UserType | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  checkAuth: () => void;
  signUp: (data: SignUpRequest) => void;
  signIn: (data: SignInRequest) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
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
  signIn: async (data: SignInRequest) => {
    set({ isLoggingIn: true });
    await axiosInstance
      .post("/auth/login", data)
      .then((res) => {
        toast.success("로그인 성공!");
        set({ authUser: res.data });
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      })
      .finally(() => {
        set({ isLoggingIn: false });
      });
  },
  logout: async () => {
    await axiosInstance
      .post("/auth/logout")
      .then(() => {
        set({ authUser: null });
        toast.success("로그아웃 성공");
      })
      .catch((e) => {
        toast.error("로그아웃 실패. 다시 시도해주세요");
        console.error(e);
      });
  },
}));
