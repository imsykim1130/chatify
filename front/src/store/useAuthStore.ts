import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { SignInRequest, SignUpRequest, UserType } from "../type";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

type AuthState = {
  authUser: UserType | null;
  onlineUsers: number[];
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUsersLoading: boolean;
  socket: Socket | null;
  checkAuth: () => void;
  signUp: (data: SignUpRequest) => void;
  signIn: (data: SignInRequest) => void;
  logout: () => void;
  updateProfile: (file: File) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isUsersLoading: false,
  socket: null,
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
        console.log(res.data);
        set({ authUser: res.data });
        toast.success("로그인 성공!");
        get().connectSocket();
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
  updateProfile: async (file: File) => {
    const base64Image = await imageFileToBase64(file);

    await axiosInstance
      .post("/auth/profile", {
        profilePic: base64Image,
      })
      .then((res) => {
        const updatedUser = res.data;
        set({ authUser: updatedUser });
        toast.success("프로필 변경 완료!");
      })
      .catch((e) => {
        console.log("Error in update profile: ", e);
        toast.error("Error in update profile");
      });
  },
  connectSocket: () => {
    console.log("connect socket");

    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      console.log(userIds);

      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket?.disconnect();
    }
  },
}));

function imageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string); // reader.result contains the Base64 data URL
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  });
}
