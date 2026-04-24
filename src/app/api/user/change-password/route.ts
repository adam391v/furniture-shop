// ============================================================
// User API - Đổi mật khẩu
// PUT /api/user/change-password
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, comparePassword, hashPassword } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Mật khẩu xác nhận không khớp' }, { status: 400 });
    }

    // Lấy user hiện tại
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { passwordHash: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy tài khoản' }, { status: 404 });
    }

    // Kiểm tra mật khẩu hiện tại
    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 });
    }

    // Hash mật khẩu mới và cập nhật
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: authUser.userId },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('[CHANGE PASSWORD]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
