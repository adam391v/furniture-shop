// ============================================================
// Admin API - Quản lý Banner
// GET  /api/admin/banners - Danh sách
// POST /api/admin/banners - Tạo mới
// Banner chỉ gồm: imageUrl + linkUrl (không có title/subtitle)
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banners = await prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('[ADMIN BANNERS GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, linkUrl } = body;

    if (!imageUrl?.trim()) {
      return NextResponse.json({ error: 'Ảnh banner là bắt buộc' }, { status: 400 });
    }

    // Lấy sortOrder lớn nhất + 1
    const maxSort = await prisma.banner.aggregate({ _max: { sortOrder: true } });
    const nextSort = (maxSort._max.sortOrder ?? 0) + 1;

    const banner = await prisma.banner.create({
      data: {
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl?.trim() || null,
        sortOrder: nextSort,
        isActive: true,
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN BANNERS POST]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
