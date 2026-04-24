// ============================================================
// Public API - Banners
// GET /api/banners - Lấy danh sách banner active
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('[BANNERS GET]', error);
    return NextResponse.json({ banners: [] });
  }
}
