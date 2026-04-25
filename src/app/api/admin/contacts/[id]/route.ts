// ============================================================
// Admin API - Chi tiết / Cập nhật liên hệ
// GET /api/admin/contacts/[id] - Xem chi tiết
// PATCH /api/admin/contacts/[id] - Cập nhật trạng thái
// DELETE /api/admin/contacts/[id] - Xóa liên hệ
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Không tìm thấy liên hệ' },
        { status: 404 }
      );
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Lỗi lấy chi tiết liên hệ:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['new', 'processed'].includes(status)) {
      return NextResponse.json(
        { error: 'Trạng thái không hợp lệ' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Lỗi cập nhật liên hệ:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.contact.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Đã xóa liên hệ' });
  } catch (error) {
    console.error('Lỗi xóa liên hệ:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
