// ============================================================
// Public API - Sản phẩm nổi bật (trang chủ)
// GET /api/products/featured
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { take: 2, orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
      orderBy: { soldCount: 'desc' },
      take: limit,
    });

    const serialized = products.map((p) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : 0,
      weight: p.weight ? Number(p.weight) : 0,
      variants: p.variants.map((v) => ({ ...v, price: Number(v.price) })),
    }));

    return NextResponse.json({ products: serialized });
  } catch (error) {
    console.error('[FEATURED PRODUCTS]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
