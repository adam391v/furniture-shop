// ============================================================
// POST /api/auth/login - Đăng nhập
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { comparePassword, createToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Tìm user theo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Kiểm tra password
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Tạo JWT
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Lưu vào httpOnly cookie
    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
