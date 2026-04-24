// ============================================================
// User API - Chi tiết đơn hàng
// GET /api/user/orders/[id]
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id);

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: authUser.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: { take: 1, select: { imageUrl: true } },
              },
            },
            variant: {
              select: { color: true, size: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('[USER ORDER DETAIL]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
