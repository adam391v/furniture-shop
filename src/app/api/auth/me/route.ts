// ============================================================
// GET /api/auth/me - Lấy thông tin user hiện tại từ JWT cookie
// ============================================================

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Token không hợp lệ' },
      { status: 401 }
    );
  }
}
