// ============================================================
// Public API - Chi tiết sản phẩm theo slug
// GET /api/products/[slug]
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        reviews: {
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    // Serialize Decimal fields
    const serialized = {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : 0,
      weight: product.weight ? Number(product.weight) : 0,
      variants: product.variants.map((v) => ({ ...v, price: Number(v.price) })),
    };

    return NextResponse.json({ product: serialized });
  } catch (error) {
    console.error('[PRODUCT DETAIL]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
