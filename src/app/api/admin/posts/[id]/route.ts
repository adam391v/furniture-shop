// ============================================================
// Admin API - Chi tiết / Cập nhật / Xóa bài viết
// GET    /api/admin/posts/[id]
// PUT    /api/admin/posts/[id]
// DELETE /api/admin/posts/[id]
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

    if (!post) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('[ADMIN POST GET]', error);
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
    const { title, excerpt, content, thumbnailUrl, authorName, isPublished } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Tiêu đề không được để trống' }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title: title.trim(),
        excerpt: excerpt?.trim() || null,
        content: content || null,
        thumbnailUrl: thumbnailUrl || null,
        authorName: authorName?.trim() || 'Admin',
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('[ADMIN POST UPDATE]', error);
    return NextResponse.json({ error: 'Lỗi cập nhật bài viết' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: 'Xóa bài viết thành công' });
  } catch (error) {
    console.error('[ADMIN POST DELETE]', error);
    return NextResponse.json({ error: 'Lỗi xóa bài viết' }, { status: 500 });
  }
}
