// ============================================================
// Admin API - Quản lý liên hệ
// GET /api/admin/contacts - Danh sách liên hệ
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Lọc theo trạng thái
    if (status === 'new' || status === 'processed') {
      where.status = status;
    }

    // Tìm kiếm theo tên, email, nội dung
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách liên hệ:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
