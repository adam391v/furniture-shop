// ============================================================
// Public API - Gửi liên hệ từ khách hàng
// POST /api/contact - Tạo liên hệ mới
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate dữ liệu
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập họ tên' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập email' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập nội dung' },
        { status: 400 }
      );
    }

    // Tạo liên hệ mới trong database
    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json(
      { message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.', contact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi gửi liên hệ:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
