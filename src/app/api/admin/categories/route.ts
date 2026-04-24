// ============================================================
// Admin API - CRUD Danh mục
// GET: Lấy danh sách | POST: Tạo mới
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createSlug } from '@/lib/utils';

const requireAdmin = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
};

// GET /api/admin/categories
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });

    const serialized = categories.map((c) => ({
      ...c,
      productCount: c._count.products,
    }));

    return NextResponse.json({ categories: serialized });
  } catch (error) {
    console.error('[ADMIN CATEGORIES GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// POST /api/admin/categories
export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const body = await request.json();
    const { name, imageUrl, iconUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập tên danh mục' }, { status: 400 });
    }

    const slug = createSlug(name);

    // Kiểm tra slug trùng
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Danh mục với slug này đã tồn tại' }, { status: 400 });
    }

    // Tính sortOrder mới
    const maxOrder = await prisma.category.aggregate({ _max: { sortOrder: true } });
    const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        imageUrl: imageUrl || null,
        iconUrl: iconUrl || null,
        sortOrder,
        isActive: true,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN CATEGORIES POST]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
