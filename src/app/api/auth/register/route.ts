// ============================================================
// POST /api/auth/register - Đăng ký tài khoản mới
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate dữ liệu đầu vào
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, phone, gender } = parsed.data;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email này đã được đăng ký' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Tạo user trong database
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        phone: phone || null,
        gender: gender || 'other',
        role: 'customer',
      },
    });

    // Tạo JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Lưu vào httpOnly cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: 'Đăng ký thành công',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
