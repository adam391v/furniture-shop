// ============================================================
// POST /api/auth/logout - Đăng xuất (xóa cookie)
// ============================================================

import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    await removeAuthCookie();
    return NextResponse.json({ message: 'Đăng xuất thành công' });
  } catch {
    return NextResponse.json(
      { error: 'Lỗi khi đăng xuất' },
      { status: 500 }
    );
  }
}
