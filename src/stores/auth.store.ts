'use client';

// ============================================================
// Auth Store - Zustand: quản lý trạng thái đăng nhập client-side
// ============================================================

import { create } from 'zustand';

interface AuthUser {
  userId: number;
  email: string;
  role: 'customer' | 'admin';
  firstName: string;
  lastName: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;

  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    set({ user: null, isLoading: false });
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false });
    }
  },
}));
