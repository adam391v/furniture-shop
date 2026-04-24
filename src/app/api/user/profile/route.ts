// ============================================================
// User API - Profile
// GET  /api/user/profile - Lấy thông tin user
// PUT  /api/user/profile - Cập nhật thông tin
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        gender: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[USER PROFILE GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, gender, avatarUrl } = body;

    // Validate
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: 'Họ và tên không được để trống' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
        gender: gender || undefined,
        avatarUrl: avatarUrl?.trim() || null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        gender: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({ user, message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('[USER PROFILE PUT]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
