import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
  imageUrl?: string;
}

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;

  checkAdminStatus: () => Promise<void>;
  fetchUserDetails: (userId: string) => Promise<void>;
  signOut: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,
  user: null,

  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check");
      set({ isAdmin: response.data.admin });
    } catch (error: any) {
      set({ isAdmin: false, error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserDetails: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      set({ user: response.data.user });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: () => {
    // Implement sign-out logic here
    set({ user: null, isAdmin: false });
  },

  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null, user: null });
  },
}));
