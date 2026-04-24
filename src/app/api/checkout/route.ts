// ============================================================
// Checkout API - Tạo đơn hàng mới
// POST /api/checkout
// Flow: Validate → Check FK → Tạo Order + OrderItems → Update soldCount
// ============================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { checkoutSchema } from '@/lib/validations';

// Tạo mã đơn hàng duy nhất
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DH-${timestamp}${random}`;
};

export async function POST(request: Request) {
  try {
    // Lấy user nếu đã đăng nhập (checkout cho phép guest)
    const authUser = await getCurrentUser();

    const body = await request.json();

    // Validate
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      console.error('[CHECKOUT VALIDATION]', parsed.error.flatten().fieldErrors);
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // === Pre-validate: kiểm tra products tồn tại ===
    const productIds = [...new Set(data.items.map((i) => i.productId))];
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    const validProductIds = new Set(dbProducts.map((p) => p.id));

    for (const item of data.items) {
      if (!validProductIds.has(item.productId)) {
        return NextResponse.json(
          { error: `Sản phẩm ID ${item.productId} không tồn tại hoặc đã ngừng bán` },
          { status: 400 }
        );
      }
    }

    // === Pre-validate: kiểm tra variants nếu có ===
    const variantIds = data.items
      .map((i) => i.variantId)
      .filter((id): id is number => id != null && id > 0);

    const validVariantIds = new Set<number>();
    if (variantIds.length > 0) {
      const dbVariants = await prisma.productVariant.findMany({
        where: { id: { in: [...new Set(variantIds)] } },
        select: { id: true },
      });
      dbVariants.forEach((v) => validVariantIds.add(v.id));
    }

    // === Tính toán giá tiền ===
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 5000000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    // === Tạo đơn hàng trong transaction ===
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: authUser?.userId ?? null,
          orderNumber: generateOrderNumber(),
          status: 'pending',
          subtotal,
          shippingFee,
          discount: 0,
          total,
          note: data.note || null,
          shippingName: data.shippingName,
          shippingPhone: data.shippingPhone,
          shippingAddress: data.shippingAddress,
          shippingCity: data.shippingCity,
          shippingDistrict: data.shippingDistrict,
          paymentMethod: data.paymentMethod,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              // Chỉ set variantId khi variant thực sự tồn tại trong DB
              variantId: item.variantId && validVariantIds.has(item.variantId)
                ? item.variantId
                : null,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: { select: { name: true, slug: true } },
            },
          },
        },
      });

      // Cập nhật soldCount cho từng sản phẩm
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { soldCount: { increment: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      message: 'Đặt hàng thành công',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[CHECKOUT ERROR]', error);
    return NextResponse.json(
      { error: 'Lỗi tạo đơn hàng, vui lòng thử lại' },
      { status: 500 }
    );
  }
}
