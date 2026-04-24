// ============================================================
// Admin API - Banner detail
// PUT    /api/admin/banners/[id] - Cập nhật
// DELETE /api/admin/banners/[id] - Xóa
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const bannerId = parseInt(id);
    const body = await request.json();

    const banner = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
        ...(body.linkUrl !== undefined && { linkUrl: body.linkUrl?.trim() || null }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('[ADMIN BANNERS PUT]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.banner.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: 'Đã xóa banner' });
  } catch (error) {
    console.error('[ADMIN BANNERS DELETE]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
