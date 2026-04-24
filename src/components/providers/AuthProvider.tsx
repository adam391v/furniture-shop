'use client';

// ============================================================
// AuthProvider - Tự động fetch user khi app load
// Wrap trong root layout để có auth state toàn cục
// ============================================================

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <>{children}</>;
};

export default AuthProvider;
