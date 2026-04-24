// ============================================================
// Auth Library - JWT token management + Password hashing
// Sử dụng 'jose' cho JWT (tương thích Edge Runtime)
// Sử dụng 'bcryptjs' cho hash password
// ============================================================

import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// --- Constants ---
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me'
);
const COOKIE_NAME = 'auth-token';
const TOKEN_EXPIRY = '7d'; // Token hết hạn sau 7 ngày
const BCRYPT_SALT_ROUNDS = 12;

// --- Kiểu dữ liệu payload trong JWT ---
export interface AuthPayload extends JWTPayload {
  userId: number;
  email: string;
  role: 'customer' | 'admin';
  firstName: string;
  lastName: string;
}

// ============================================================
// JWT Functions
// ============================================================

/**
 * Tạo JWT token từ thông tin user
 */
export const createToken = async (payload: Omit<AuthPayload, 'iat' | 'exp'>): Promise<string> => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
  return token;
};

/**
 * Xác thực và giải mã JWT token
 * Trả về payload nếu hợp lệ, null nếu không
 */
export const verifyToken = async (token: string): Promise<AuthPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as AuthPayload;
  } catch {
    return null;
  }
};

// ============================================================
// Cookie Functions
// ============================================================

/**
 * Lưu token vào httpOnly cookie (chỉ gọi từ Server Action/API Route)
 */
export const setAuthCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 ngày tính bằng giây
  });
};

/**
 * Xóa auth cookie (logout)
 */
export const removeAuthCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
};

/**
 * Lấy token từ cookie trong Server Component / API Route
 */
export const getTokenFromCookies = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
};

/**
 * Lấy token từ NextRequest (dùng trong middleware)
 */
export const getTokenFromRequest = (request: NextRequest): string | null => {
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
};

/**
 * Lấy thông tin user hiện tại từ cookie (tiện ích cho Server Component)
 */
export const getCurrentUser = async (): Promise<AuthPayload | null> => {
  const token = await getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
};

// ============================================================
// Password Functions
// ============================================================

/**
 * Hash password bằng bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};

/**
 * So sánh password gốc với hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
