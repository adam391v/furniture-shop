// ============================================================
// Admin API - Order theo ID: GET chi tiết | PATCH cập nhật status
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { orderStatusSchema } from '@/lib/validations';

const requireAdmin = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
};

// GET /api/admin/orders/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { name: true, slug: true } },
            variant: { select: { color: true, size: true } },
          },
        },
      },
    });

    if (!order) return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// PATCH /api/admin/orders/[id] - Cập nhật trạng thái
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: parsed.data.status,
        paidAt: parsed.data.status === 'delivered' ? new Date() : undefined,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
