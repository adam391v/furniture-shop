// ============================================================
// Admin API - Chi tiết / Cập nhật / Xóa danh mục tin tức
// GET    /api/admin/post-categories/[id]
// PUT    /api/admin/post-categories/[id]
// DELETE /api/admin/post-categories/[id]
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.postCategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: { select: { posts: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Danh mục không tồn tại' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('[ADMIN POST CATEGORY GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, imageUrl, isActive, sortOrder } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Tên danh mục không được để trống' }, { status: 400 });
    }

    const category = await prisma.postCategory.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('[ADMIN POST CATEGORY UPDATE]', error);
    return NextResponse.json({ error: 'Lỗi cập nhật danh mục' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    // Kiểm tra xem có bài viết nào đang dùng danh mục này không
    const postCount = await prisma.post.count({ where: { categoryId } });
    if (postCount > 0) {
      return NextResponse.json(
        { error: `Không thể xóa. Danh mục đang có ${postCount} bài viết liên kết.` },
        { status: 400 }
      );
    }

    await prisma.postCategory.delete({ where: { id: categoryId } });

    return NextResponse.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    console.error('[ADMIN POST CATEGORY DELETE]', error);
    return NextResponse.json({ error: 'Lỗi xóa danh mục' }, { status: 500 });
  }
}
