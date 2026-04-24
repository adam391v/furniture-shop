// ============================================================
// Public API - Testimonials / Đánh giá nổi bật
// GET /api/reviews/featured - Lấy đánh giá tốt nhất
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Lấy reviews 4-5 sao mới nhất
    const reviews = await prisma.review.findMany({
      where: { rating: { gte: 4 } },
      include: {
        user: { select: { firstName: true, lastName: true, avatarUrl: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    const testimonials = reviews.map((r) => ({
      id: r.id,
      name: `${r.user.firstName} ${r.user.lastName}`,
      content: r.comment || '',
      rating: r.rating,
      avatarUrl: r.user.avatarUrl,
      productName: r.product.name,
    }));

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('[REVIEWS FEATURED]', error);
    return NextResponse.json({ testimonials: [] });
  }
}
