import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
  likedSongs: Song[];
  searchResults: Song[];

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  fetchLikedSongs: (userId: string) => Promise<void>;
  searchSongs: (query: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  songs: [],
  albums: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  likedSongs: [],
  searchResults: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  // ---------------- FETCH ALL SONGS ----------------
  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/songs");
      set({ songs: Array.isArray(res.data) ? res.data : [] });
    } catch (err: any) {
      set({ songs: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- FETCH ALBUMS ----------------
  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/albums");
      set({ albums: Array.isArray(res.data) ? res.data : [] });
    } catch (err: any) {
      set({ albums: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- FETCH SINGLE ALBUM ----------------
  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: res.data || null });
    } catch (err: any) {
      set({ currentAlbum: null, error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- FEATURED ----------------
  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: Array.isArray(res.data) ? res.data : [] });
    } catch (err: any) {
      set({ featuredSongs: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- MADE FOR YOU ----------------
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: Array.isArray(res.data) ? res.data : [] });
    } catch (err: any) {
      set({ madeForYouSongs: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- TRENDING ----------------
  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: Array.isArray(res.data) ? res.data : [] });
    } catch (err: any) {
      set({ trendingSongs: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- LIKED SONGS ----------------
  fetchLikedSongs: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/liked-songs/${userId}`);
      set({
        likedSongs: Array.isArray(res.data?.songs) ? res.data.songs : [],
      });
    } catch (err: any) {
      set({ likedSongs: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- SEARCH ----------------
  searchSongs: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/songs/search?title=${query}`);
      set({ searchResults: Array.isArray(res.data) ? res.data : [] });
    } catch (err: any) {
      set({ searchResults: [], error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- STATS ----------------
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/stats");
      set({ stats: res.data || {} });
    } catch (err: any) {
      set({
        stats: {
          totalSongs: 0,
          totalAlbums: 0,
          totalUsers: 0,
          totalArtists: 0,
        },
        error: err.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- DELETE SONG ----------------
  deleteSong: async (id) => {
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((s) => s._id !== id),
      }));
      toast.success("Song deleted");
    } catch {
      toast.error("Delete failed");
    }
  },

  // ---------------- DELETE ALBUM ----------------
  deleteAlbum: async (id) => {
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((a) => a._id !== id),
      }));
      toast.success("Album deleted");
    } catch {
      toast.error("Delete failed");
    }
  },
}));
