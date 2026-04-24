// ============================================================
// API Upload File - Lưu ảnh vào /public/uploads/
// POST /api/upload - multipart/form-data
// Trả về URL để hiển thị trên client
// ============================================================

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';

// Giới hạn kích thước file: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
  // Kiểm tra đăng nhập
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Không có file nào được upload' }, { status: 400 });
    }

    // Tạo thư mục upload nếu chưa có
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File "${file.name}" không hợp lệ. Chỉ chấp nhận: JPG, PNG, WebP, GIF` },
          { status: 400 }
        );
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" quá lớn. Tối đa 5MB` },
          { status: 400 }
        );
      }

      // Tạo tên file unique
      const ext = path.extname(file.name) || '.jpg';
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      // Ghi file
      const bytes = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(bytes));

      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({
      urls: uploadedUrls,
      message: `Đã upload ${uploadedUrls.length} file`,
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: 'Lỗi khi upload file' }, { status: 500 });
  }
}
