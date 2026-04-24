// ============================================================
// Admin API - Sản phẩm theo ID: GET | PUT | DELETE
// Hỗ trợ cập nhật images, serialize Decimal
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

// Helper: serialize Decimal
const serialize = (p: Record<string, unknown>) => ({
  ...p,
  price: Number(p.price),
  comparePrice: p.comparePrice ? Number(p.comparePrice) : 0,
  weight: p.weight ? Number(p.weight) : 0,
  variants: Array.isArray(p.variants)
    ? p.variants.map((v: Record<string, unknown>) => ({ ...v, price: Number(v.price) }))
    : [],
});

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
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({ product: serialize(product as unknown as Record<string, unknown>) });
  } catch (error) {
    console.error('[ADMIN PRODUCT GET]', error);
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
  const productId = parseInt(id);

  try {
    const body = await request.json();

    // Cho phép partial update (chỉ toggle isActive)
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { isActive: body.isActive },
      });
      return NextResponse.json({ product: serialize(product as unknown as Record<string, unknown>) });
    }

    // Full update - validate
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const images: string[] = body.images || [];

    // Cập nhật sản phẩm
    const product = await prisma.product.update({
      where: { id: productId },
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

    // Cập nhật ảnh: xóa ảnh cũ → tạo ảnh mới
    if (images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId } });
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({
          productId,
          imageUrl: url,
          altText: `${data.name} - Ảnh ${index + 1}`,
          sortOrder: index,
        })),
      });
    }

    // Reload product with images
    const updated = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({ product: serialize(updated as unknown as Record<string, unknown>) });
  } catch (error) {
    console.error('[ADMIN PRODUCT PUT]', error);
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
    // Xóa images trước (cascade xóa variants đã có trong schema)
    await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: 'Đã xóa sản phẩm' });
  } catch (error) {
    console.error('[ADMIN PRODUCT DELETE]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
