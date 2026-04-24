// ============================================================
// Public API - Bộ sưu tập phòng
// GET /api/rooms - Trả về danh sách phòng + số sản phẩm
// Dữ liệu lấy từ categories nhóm theo phòng
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Mapping: phòng → danh mục sản phẩm liên quan
const roomCategoryMapping: Record<string, { name: string; slug: string; categorySlugs: string[] }> = {
  'phong-khach': {
    name: 'Phòng khách',
    slug: 'phong-khach',
    categorySlugs: ['sofa', 'ghe-sofa', 'ke-tivi', 'ban-tra', 'do-trang-tri'],
  },
  'phong-ngu': {
    name: 'Phòng ngủ',
    slug: 'phong-ngu',
    categorySlugs: ['giuong-ngu', 'tu-quan-ao', 'ban-trang-diem', 'tab-dau-giuong'],
  },
  'phong-lam-viec': {
    name: 'Phòng làm việc',
    slug: 'phong-lam-viec',
    categorySlugs: ['ban-lam-viec', 'ghe', 'ke-sach'],
  },
  'phong-an': {
    name: 'Phòng ăn',
    slug: 'phong-an',
    categorySlugs: ['ban-an', 'ghe-an'],
  },
};

export async function GET() {
  try {
    // Đếm sản phẩm cho mỗi phòng dựa trên categories mapping
    const rooms = await Promise.all(
      Object.entries(roomCategoryMapping).map(async ([key, room]) => {
        // Tìm categories phù hợp
        const matchedCategories = await prisma.category.findMany({
          where: {
            slug: { in: room.categorySlugs },
            isActive: true,
          },
          select: { id: true, imageUrl: true },
        });

        const categoryIds = matchedCategories.map((c) => c.id);

        // Đếm sản phẩm thuộc các danh mục này
        const productCount = categoryIds.length > 0
          ? await prisma.product.count({
              where: {
                categoryId: { in: categoryIds },
                isActive: true,
              },
            })
          : 0;

        // Lấy ảnh đầu tiên từ category hoặc null
        const imageUrl = matchedCategories.find((c) => c.imageUrl)?.imageUrl || null;

        return {
          id: key,
          name: room.name,
          slug: room.slug,
          imageUrl,
          productCount,
        };
      })
    );

    // Chỉ trả về phòng có sản phẩm
    const activeRooms = rooms.filter((r) => r.productCount > 0);

    return NextResponse.json({ rooms: activeRooms.length > 0 ? activeRooms : rooms });
  } catch (error) {
    console.error('[ROOMS GET]', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
