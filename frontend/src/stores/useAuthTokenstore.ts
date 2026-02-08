import { create } from "zustand";

interface AuthTokenStore {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useAuthToken = create<AuthTokenStore>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
