// ============================================================
// Next.js Middleware - Bảo vệ route cần đăng nhập + phân quyền admin
// File này PHẢI nằm ở root src/ (không phải trong app/)
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// Route cần đăng nhập (user hoặc admin)
const protectedRoutes = ['/account', '/checkout'];

// Route chỉ admin mới truy cập
const adminRoutes = ['/admin'];

// Route chỉ dành cho guest (chưa đăng nhập)
const guestOnlyRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy token từ cookie
  const token = getTokenFromRequest(request);
  const user = token ? await verifyToken(token) : null;

  // --- Guest-only routes: nếu đã đăng nhập → redirect về trang chủ ---
  if (guestOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // --- Protected routes: cần đăng nhập ---
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- Admin routes: cần đăng nhập VÀ role = admin ---
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== 'admin') {
      // User thường cố truy cập admin → redirect về trang chủ
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Chỉ apply middleware cho các path cần thiết (tránh chạy cho static files)
export const config = {
  matcher: [
    '/login',
    '/register',
    '/account/:path*',
    '/checkout/:path*',
    '/admin/:path*',
  ],
};
