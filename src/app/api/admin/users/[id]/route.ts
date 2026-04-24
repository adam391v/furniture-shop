// ============================================================
// Admin API - User theo ID: GET | PUT | DELETE
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { userUpdateSchema } from '@/lib/validations';

const requireAdmin = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
};

// GET /api/admin/users/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        gender: true,
        createdAt: true,
        orders: { take: 5, orderBy: { createdAt: 'desc' } },
        _count: { select: { orders: true, reviews: true } },
      },
    });

    if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = userUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: parsed.data,
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  const userId = parseInt(id);

  // Không cho xóa chính mình
  if (admin.userId === userId) {
    return NextResponse.json({ error: 'Không thể xóa tài khoản đang đăng nhập' }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: 'Đã xóa người dùng' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
