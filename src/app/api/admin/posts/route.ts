// ============================================================
// Admin API - CRUD Bài viết
// GET /api/admin/posts - Danh sách (bao gồm cả draft)
// POST /api/admin/posts - Tạo bài viết mới
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Tạo slug từ tiêu đề
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36);
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[ADMIN POSTS GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, thumbnailUrl, authorName, isPublished, categoryId } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Tiêu đề không được để trống' }, { status: 400 });
    }

    const slug = generateSlug(title);

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt?.trim() || null,
        content: content || null,
        thumbnailUrl: thumbnailUrl || null,
        authorName: authorName?.trim() || 'Admin',
        isPublished: isPublished ?? true,
        ...(categoryId ? { category: { connect: { id: parseInt(categoryId) } } } : {}),
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN POST CREATE]', error);
    return NextResponse.json({ error: 'Lỗi tạo bài viết' }, { status: 500 });
  }
}
