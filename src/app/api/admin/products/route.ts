// ============================================================
// Admin API - CRUD Sản phẩm
// GET: Lấy danh sách | POST: Tạo mới
// Chỉ admin mới truy cập được
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { productSchema } from '@/lib/validations';
import { createSlug } from '@/lib/utils';

// --- Kiểm tra quyền admin ---
const requireAdmin = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
};

// --- Helper: Serialize Decimal fields ---
const serializeProduct = (p: Record<string, unknown>) => ({
  ...p,
  price: Number(p.price),
  comparePrice: p.comparePrice ? Number(p.comparePrice) : 0,
  weight: p.weight ? Number(p.weight) : 0,
  variants: Array.isArray(p.variants)
    ? p.variants.map((v: Record<string, unknown>) => ({ ...v, price: Number(v.price) }))
    : [],
});

// GET /api/admin/products - Lấy danh sách sản phẩm
export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { sku: { contains: search } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
          variants: true,
          _count: { select: { reviews: true, orderItems: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products: products.map(serializeProduct),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[ADMIN PRODUCTS GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// POST /api/admin/products - Tạo sản phẩm mới
export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

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
    const slug = createSlug(data.name);
    const images: string[] = body.images || [];

    // Tạo sản phẩm + ảnh trong transaction
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku: data.sku,
        price: data.price,
        comparePrice: data.comparePrice,
        categoryId: data.categoryId,
        description: data.description,
        shortDescription: data.shortDescription,
        material: data.material,
        dimensions: data.dimensions,
        weight: data.weight,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        seoTitle: data.name,
        seoDescription: data.shortDescription,
        images: {
          create: images.map((url: string, index: number) => ({
            imageUrl: url,
            altText: `${data.name} - Ảnh ${index + 1}`,
            sortOrder: index,
          })),
        },
      },
      include: {
        images: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({ product: serializeProduct(product as unknown as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN PRODUCTS POST]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
