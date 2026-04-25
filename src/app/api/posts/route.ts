// ============================================================
// Public API - Danh sách bài viết
// GET /api/posts - List + Search + Pagination + Filter by category
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isPublished: true };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    // Filter theo danh mục (bằng slug)
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const [posts, total, categories] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnailUrl: true,
          authorName: true,
          createdAt: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
      // Lấy danh sách danh mục active (cho filter phía client)
      prisma.postCategory.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { posts: { where: { isPublished: true } } } },
        },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    return NextResponse.json({
      data: posts,
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[POSTS GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
