// ============================================================
// Admin API - Danh mục theo ID: GET | PUT | DELETE
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

// GET /api/admin/categories/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return NextResponse.json({ error: 'Không tìm thấy danh mục' }, { status: 404 });
    }

    return NextResponse.json({ category: { ...category, productCount: category._count.products } });
  } catch (error) {
    console.error('[ADMIN CATEGORY GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// PUT /api/admin/categories/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    const body = await request.json();

    // Partial update: toggle active
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: { isActive: body.isActive },
      });
      return NextResponse.json({ category });
    }

    const { name, imageUrl, iconUrl, isActive } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập tên danh mục' }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        slug: createSlug(name),
        imageUrl: imageUrl || null,
        iconUrl: iconUrl || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('[ADMIN CATEGORY PUT]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    // Kiểm tra có sản phẩm thuộc danh mục không
    const productCount = await prisma.product.count({ where: { categoryId: parseInt(id) } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Không thể xóa: còn ${productCount} sản phẩm thuộc danh mục này` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: 'Đã xóa danh mục' });
  } catch (error) {
    console.error('[ADMIN CATEGORY DELETE]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
