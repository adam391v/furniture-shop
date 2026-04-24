// ============================================================
// User API - Đơn hàng của tôi
// GET /api/user/orders - Danh sách đơn hàng
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

    const orders = await prisma.order.findMany({
      where: { userId: authUser.userId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, slug: true, images: { take: 1, select: { imageUrl: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[USER ORDERS]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
