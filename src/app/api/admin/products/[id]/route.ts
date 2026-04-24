// ============================================================
// Admin API - Sản phẩm theo ID: GET | PUT | DELETE
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { productSchema } from '@/lib/validations';
import { createSlug } from '@/lib/utils';

const requireAdmin = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
};

// GET /api/admin/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// PUT /api/admin/products/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        slug: createSlug(data.name),
        sku: data.sku,
        price: data.price,
        comparePrice: data.comparePrice,
        categoryId: data.categoryId,
        description: data.description,
        shortDescription: data.shortDescription,
        material: data.material,
        dimensions: data.dimensions,
        weight: data.weight,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: 'Đã xóa sản phẩm' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
