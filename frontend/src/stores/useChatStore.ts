import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

/* ✅ Use backend URL from env */
const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  // ---------------- USERS ----------------
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/users/FriendList/get/");
      set({ users: Array.isArray(res.data) ? res.data : [] });
    } catch (err: any) {
      set({ users: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- SOCKET ----------------
  initSocket: (userId) => {
    if (get().isConnected) return;

    socket.auth = { userId };
    socket.connect();

    socket.emit("user_connected", userId);

    socket.on("users_online", (users: string[]) => {
      set({ onlineUsers: new Set(users) });
    });

    socket.on("activities", (activities: [string, string][]) => {
      set({ userActivities: new Map(activities) });
    });

    socket.on("user_connected", (id: string) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, id]),
      }));
    });

    socket.on("user_disconnected", (id: string) => {
      set((state) => {
        const newSet = new Set(state.onlineUsers);
        newSet.delete(id);
        return { onlineUsers: newSet };
      });
    });

    socket.on("receive_message", (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("message_sent", (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("activity_updated", ({ userId, activity }) => {
      set((state) => {
        const map = new Map(state.userActivities);
        map.set(userId, activity);
        return { userActivities: map };
      });
    });

    set({ isConnected: true });
  },

  disconnectSocket: () => {
    if (!get().isConnected) return;
    socket.disconnect();
    set({ isConnected: false });
  },

  // ---------------- MESSAGES ----------------
  sendMessage: (receiverId, senderId, content) => {
    socket.emit("send_message", { receiverId, senderId, content });
  },

  fetchMessages: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: Array.isArray(res.data) ? res.data : [] });
    } catch (err: any) {
      set({ messages: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
