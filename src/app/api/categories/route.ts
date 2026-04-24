// ============================================================
// Public API - Danh sách danh mục
// GET /api/categories
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const serialized = categories.map((c) => ({
      ...c,
      productCount: c._count.products,
    }));

    return NextResponse.json({ categories: serialized });
  } catch (error) {
    console.error('[CATEGORIES GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
