import { NextResponse } from 'next/server'; // trigger rebuild
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// --- Kiểm tra quyền admin ---
const requireAdmin = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
};

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Mốc thời gian
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);

    // 1. Thống kê tổng quan (so sánh với kỳ trước để tính change)
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    // Truy vấn tổng số lượng và doanh thu (tất cả thời gian)
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      revenueResult
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'cancelled' } }
      })
    ]);

    const revenue = Number(revenueResult._sum.total || 0);

    // Tính % thay đổi (so sánh kỳ hiện tại và kỳ trước)
    // - Kỳ hiện tại (từ startDate đến now)
    // - Kỳ trước (từ previousStartDate đến startDate)
    const [
      currentOrders, previousOrders,
      currentProducts, previousProducts,
      currentUsers, previousUsers,
      currentRevenueRes, previousRevenueRes
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.order.count({ where: { createdAt: { gte: previousStartDate, lt: startDate } } }),
      prisma.product.count({ where: { createdAt: { gte: startDate } } }),
      prisma.product.count({ where: { createdAt: { gte: previousStartDate, lt: startDate } } }),
      prisma.user.count({ where: { role: 'customer', createdAt: { gte: startDate } } }),
      prisma.user.count({ where: { role: 'customer', createdAt: { gte: previousStartDate, lt: startDate } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'cancelled' }, createdAt: { gte: startDate } }
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'cancelled' }, createdAt: { gte: previousStartDate, lt: startDate } }
      }),
    ]);

    const currentRevenue = Number(currentRevenueRes._sum.total || 0);
    const previousRevenue = Number(previousRevenueRes._sum.total || 0);

    const calcChange = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Number(((current - prev) / prev * 100).toFixed(1));
    };

    const stats = {
      revenue,
      revenueChange: calcChange(currentRevenue, previousRevenue),
      orders: totalOrders,
      ordersChange: calcChange(currentOrders, previousOrders),
      products: totalProducts,
      productsChange: calcChange(currentProducts, previousProducts),
      users: totalUsers,
      usersChange: calcChange(currentUsers, previousUsers),
    };

    // 2. Lấy đơn hàng gần đây
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
        shippingName: true,
      }
    });

    // 3. Lấy sản phẩm bán chạy
    const topProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { soldCount: 'desc' },
      select: {
        id: true,
        name: true,
        soldCount: true,
        price: true,
      }
    });

    // 4. Biểu đồ doanh thu theo ngày (trong khoảng `days` ngày)
    // SQL Server Group By date có thể phức tạp trong Prisma Prisma Client, 
    // ta query list orders trong range và group bằng JS.
    const ordersInRange = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'cancelled' }
      },
      select: {
        createdAt: true,
        total: true
      }
    });

    // Tạo mảng các ngày
    const revenueByDate: Record<string, number> = {};
    const ordersByDate: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      revenueByDate[dateStr] = 0;
      ordersByDate[dateStr] = 0;
    }

    ordersInRange.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (revenueByDate[dateStr] !== undefined) {
        revenueByDate[dateStr] += Number(order.total);
        ordersByDate[dateStr] += 1;
      }
    });

    const chartData = Object.keys(revenueByDate).map(date => ({
      date,
      revenue: revenueByDate[date],
      orders: ordersByDate[date]
    }));

    // 5. Tỉ lệ trạng thái đơn hàng (Pie chart)
    const orderStatusGroups = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { createdAt: { gte: startDate } }
    });
    
    const statusData = orderStatusGroups.map(group => ({
      name: group.status,
      value: group._count.id
    }));

    return NextResponse.json({
      stats,
      recentOrders: recentOrders.map(o => ({
        id: o.orderNumber,
        customer: o.shippingName,
        total: Number(o.total),
        status: o.status,
        date: o.createdAt.toISOString()
      })),
      topProducts: topProducts.map(p => ({
        name: p.name,
        sold: p.soldCount,
        revenue: Number(p.price) * p.soldCount // Ước tính
      })),
      chartData,
      statusData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
