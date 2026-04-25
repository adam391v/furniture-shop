// ============================================================
// Public API - Danh sách sản phẩm
// GET /api/products - List + Search + Filter + Sort + Pagination
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const excludeId = searchParams.get('excludeId');

    const size = searchParams.get('size') || '';
    const categoryId = searchParams.get('categoryId');

    // Xây dựng where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    // Tìm kiếm theo tên
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    // Lọc theo danh mục (slug)
    if (category) {
      where.category = { slug: category };
    }

    // Lọc theo danh mục (ID) - dùng cho related products
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseInt(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseInt(maxPrice);
    }

    // Lọc theo kích thước (tìm trong tên SP hoặc variant)
    if (size) {
      where.OR = [
        ...(where.OR as Array<Record<string, unknown>> || []),
        { name: { contains: size } },
        { variants: { some: { name: { contains: size } } } },
      ];
    }

    // Loại trừ sản phẩm theo ID (cho related products)
    if (excludeId) {
      where.id = { not: parseInt(excludeId) };
    }

    // Sắp xếp
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'bestseller': orderBy = { soldCount: 'desc' }; break;
      case 'newest':
      default: orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Chuyển Decimal thành number để JSON serialize
    const serialized = products.map((p) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : 0,
      weight: p.weight ? Number(p.weight) : 0,
      variants: p.variants.map((v) => ({ ...v, price: Number(v.price) })),
    }));

    return NextResponse.json({
      data: serialized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[PRODUCTS GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
