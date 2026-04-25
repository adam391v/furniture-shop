'use client';

// ============================================================
// Admin Layout - Sidebar trái + Content phải
// Chỉ admin mới truy cập được (middleware đã kiểm tra)
// Không dùng Header/Footer của storefront
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  FolderTree, Star, Image, Settings, LogOut,
  Menu, X, ChevronDown, Bell, Search, FileText, Tag, MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

// --- Danh sách menu sidebar ---
const sidebarMenu = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Sản phẩm', href: '/admin/products', icon: Package },
  { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Người dùng', href: '/admin/users', icon: Users },
  { label: 'Danh mục', href: '/admin/categories', icon: FolderTree },
  { label: 'Đánh giá', href: '/admin/reviews', icon: Star },
  { label: 'Banner', href: '/admin/banners', icon: Image },
  { label: 'DM Tin tức', href: '/admin/post-categories', icon: Tag },
  { label: 'Tin tức', href: '/admin/posts', icon: FileText },
  { label: 'Liên hệ', href: '/admin/contacts', icon: MessageSquare },
  { label: 'Cài đặt', href: '/admin/settings', icon: Settings },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden">
      {/* ===== Sidebar Desktop ===== */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-navy-dark text-white transition-all duration-300 flex-shrink-0',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          {isSidebarOpen ? (
            <Link href="/admin" className="text-2xl font-extrabold">
              moho<span className="text-primary">.</span>
              <span className="text-xs font-normal text-white/50 ml-1">admin</span>
            </Link>
          ) : (
            <Link href="/admin" className="text-2xl font-extrabold mx-auto">m</Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info ở bottom */}
        <div className="p-3 border-t border-white/10">
          <div className={cn(
            'flex items-center gap-3 px-3 py-2',
            !isSidebarOpen && 'justify-center'
          )}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">
                {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-white/50 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-red/20 hover:text-red transition-colors mt-1',
              !isSidebarOpen && 'justify-center'
            )}
          >
            <LogOut size={18} />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ===== Mobile Sidebar Overlay ===== */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-navy-dark text-white flex flex-col animate-fade-in">
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
              <span className="text-2xl font-extrabold">
                moho<span className="text-primary">.</span>
              </span>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 text-white/70">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {sidebarMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive(item.href)
                        ? 'bg-primary text-white'
                        : 'text-white/70 hover:bg-white/10'
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-navy hover:bg-bg-secondary rounded-lg"
            >
              <Menu size={20} />
            </button>
            {/* Search admin */}
            <div className="hidden md:flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2">
              <Search size={16} className="text-text-muted" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-transparent text-sm outline-none w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-navy hover:bg-bg-secondary rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full" />
            </button>
            <Link
              href="/"
              className="text-xs text-primary font-medium hover:underline hidden sm:block"
            >
              ← Về trang chủ
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-navy">
                {user?.firstName}
              </span>
            </div>
          </div>
        </header>

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
