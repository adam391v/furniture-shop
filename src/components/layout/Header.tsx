'use client';

// ============================================================
// Header Component - Thanh điều hướng chính (giống MOHO)
// Logo trái | Search giữa | Account + Cart phải
// Danh mục lấy từ API /api/categories
// ============================================================

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, Menu, X, ChevronDown, Phone, Heart, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { getCategories } from '@/lib/api/products';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

const navItems = [
  { label: 'Sản phẩm', href: '/products', hasDropdown: true },
  { label: 'Thiết kế - Thi công', href: '/thiet-ke-thi-cong', hasDropdown: false },
  { label: 'Khuyến mãi', href: '/khuyen-mai', hasDropdown: true },
  { label: 'Tin tức', href: '/tin-tuc', hasDropdown: false },
  { label: 'Về chúng tôi', href: '/ve-chung-toi', hasDropdown: false },
  { label: 'Cửa hàng', href: '/cua-hang', hasDropdown: false },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const getItemCount = useCartStore((s) => s.getItemCount);
  const { user, logout } = useAuthStore();
  const accountRef = useRef<HTMLDivElement>(null);

  // Fetch danh mục từ API
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Theo dõi scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
  }, [pathname]);

  // Đóng dropdown account khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
    router.push('/');
  };

  // Xử lý tìm kiếm: navigate sang /products?search=xxx
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white shadow-sm'
      )}
    >
      {/* === Top bar === */}
      <div className="hidden md:block bg-navy text-white">
        <div className="container-main flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <a href="tel:0901234567" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone size={12} />
              <span>Hotline: 0901 234 567</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>Miễn phí giao hàng & lắp đặt tại TP.HCM, Hà Nội</span>
            <span>|</span>
            <span>Bảo hành 5 năm</span>
          </div>
        </div>
      </div>

      {/* === Main header === */}
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">
              moho<span className="text-primary">.</span>
            </h1>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form
              onSubmit={handleSearch}
              className={cn(
                'flex w-full rounded-sm border transition-all duration-200',
                isSearchFocused ? 'border-primary shadow-sm' : 'border-border'
              )}
            >
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none text-text-primary placeholder:text-text-muted"
              />
              <button type="submit" className="px-4 bg-primary text-white hover:bg-primary-dark transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search icon mobile - mở menu mobile */}
            <button
              className="md:hidden p-2 text-navy hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Search size={22} />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden md:flex items-center gap-1 text-navy hover:text-primary transition-colors"
            >
              <Heart size={22} />
            </Link>

            {/* Account - hiển thị tùy theo trạng thái đăng nhập */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="flex items-center gap-2 text-navy hover:text-primary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:block text-xs text-left">
                      <span className="block text-text-muted">Xin chào</span>
                      <span className="font-semibold">{user.firstName} {user.lastName}</span>
                    </span>
                    <ChevronDown size={14} className="hidden lg:block" />
                  </button>

                  {/* Dropdown menu tài khoản */}
                  {isAccountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-border-light rounded-lg shadow-xl z-50 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-border-light">
                        <p className="text-sm font-semibold text-navy">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-bg-secondary transition-colors"
                      >
                        <User size={16} />
                        Tài khoản của tôi
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-bg-secondary transition-colors"
                      >
                        <ShoppingBag size={16} />
                        Đơn hàng
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition-colors"
                        >
                          <ShieldCheck size={16} />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-border-light mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red hover:bg-red/5 transition-colors"
                        >
                          <LogOut size={16} />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-navy hover:text-primary transition-colors"
                >
                  <User size={22} />
                  <span className="hidden lg:block text-xs">
                    <span className="block text-text-muted">Tài khoản</span>
                    <span className="font-semibold">Đăng nhập</span>
                  </span>
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-navy hover:text-primary transition-colors"
            >
              <div className="relative">
                <ShoppingBag size={22} />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                    {getItemCount()}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-medium">Giỏ hàng</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-navy"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* === Desktop Navigation === */}
      <nav className="hidden md:block border-t border-border-light">
        <div className="container-main">
          <ul className="flex items-center gap-0">
            {navItems.map((item) => (
              <li
                key={item.href}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-5 py-3.5 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-navy hover:text-primary'
                  )}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown size={14} />}
                </Link>

                {/* Mega dropdown "Sản phẩm" - từ API */}
                {item.label === 'Sản phẩm' && activeDropdown === 'Sản phẩm' && (
                  <div className="absolute top-full left-0 w-[600px] bg-white shadow-xl border border-border-light rounded-b-lg p-6 z-50 animate-fade-in">
                    {categories.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                          >
                            {/* Ảnh danh mục hoặc icon */}
                            <div className="w-10 h-10 bg-bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                              {cat.imageUrl ? (
                                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span className="text-lg">🪑</span>
                              )}
                            </div>
                            <span className="text-sm font-medium text-navy">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-muted text-center py-4">Đang tải danh mục...</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-border-light">
                      <Link
                        href="/products"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Xem tất cả sản phẩm →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* === Mobile Navigation === */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white animate-fade-in overflow-y-auto">
          <div className="p-4 border-b border-border-light">
            <form onSubmit={handleSearch} className="flex rounded-sm border border-border">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none"
                autoFocus
              />
              <button type="submit" className="px-4 bg-primary text-white hover:bg-primary-dark transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>

          <nav className="p-4">
            {/* Auth section mobile */}
            {user ? (
              <div className="mb-4 p-4 bg-bg-secondary rounded-lg">
                <p className="text-sm font-semibold text-navy">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-text-muted">{user.email}</p>
                <div className="flex gap-2 mt-3">
                  <Link href="/account" className="text-xs text-primary font-medium">Tài khoản</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-xs text-primary font-medium">• Admin</Link>
                  )}
                  <button onClick={handleLogout} className="text-xs text-red font-medium ml-auto">Đăng xuất</button>
                </div>
              </div>
            ) : (
              <div className="mb-4 flex gap-2">
                <Link href="/login" className="flex-1 text-center py-2.5 bg-navy text-white text-sm font-semibold rounded-lg">
                  Đăng nhập
                </Link>
                <Link href="/register" className="flex-1 text-center py-2.5 border border-navy text-navy text-sm font-semibold rounded-lg">
                  Đăng ký
                </Link>
              </div>
            )}

            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                      pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-navy hover:bg-bg-secondary'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Danh mục từ API */}
            <div className="mt-6 pt-6 border-t border-border-light">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-4">
                Danh mục
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.length > 0 ? (
                  categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <span>🪑</span>
                      )}
                      <span className="text-sm text-navy">{cat.name}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-text-muted col-span-2 px-4">Đang tải...</p>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
