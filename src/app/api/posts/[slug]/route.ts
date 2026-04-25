// ============================================================
// Public API - Chi tiết bài viết theo slug
// GET /api/posts/[slug]
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findFirst({
      where: { slug, isPublished: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('[POST DETAIL]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
