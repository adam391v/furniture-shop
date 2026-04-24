'use client';

// ============================================================
// Account Layout - Sidebar + Content cho trang tài khoản
// ============================================================

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, ShoppingBag, MapPin, Lock, ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const accountMenuItems = [
  { label: 'Thông tin cá nhân', href: '/account', icon: User },
  { label: 'Đơn hàng của tôi', href: '/account/orders', icon: ShoppingBag },
  { label: 'Sổ địa chỉ', href: '/account/addresses', icon: MapPin },
  { label: 'Đổi mật khẩu', href: '/account/change-password', icon: Lock },
];

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuthStore();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-bg-secondary min-h-screen">
      <div className="container-main py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight size={14} />
          <span className="text-navy font-medium">Tài khoản</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border-light overflow-hidden">
              {/* User info header */}
              <div className="p-5 border-b border-border-light bg-gradient-to-r from-navy to-navy/90">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-white/70">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <nav className="p-2">
                {accountMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href ||
                    (item.href !== '/account' && pathname.startsWith(item.href));
                  const isExactAccount = item.href === '/account' && pathname === '/account';

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                        (isActive || isExactAccount)
                          ? 'bg-primary/10 text-primary'
                          : 'text-navy hover:bg-bg-secondary'
                      )}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}

                <div className="border-t border-border-light mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red hover:bg-red/5 transition-all"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
