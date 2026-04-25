// ============================================================
// Admin API - CRUD Danh mục tin tức
// GET  /api/admin/post-categories - Danh sách
// POST /api/admin/post-categories - Tạo mới
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Tạo slug từ tên danh mục
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export async function GET() {
  try {
    const categories = await prisma.postCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[ADMIN POST CATEGORIES GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, imageUrl, isActive, sortOrder } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Tên danh mục không được để trống' }, { status: 400 });
    }

    // Tạo slug và kiểm tra trùng lặp
    let slug = generateSlug(name);
    const existing = await prisma.postCategory.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const category = await prisma.postCategory.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        imageUrl: imageUrl || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN POST CATEGORY CREATE]', error);
    return NextResponse.json({ error: 'Lỗi tạo danh mục' }, { status: 500 });
  }
}
