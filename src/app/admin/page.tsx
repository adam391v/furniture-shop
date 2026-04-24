'use client';

// ============================================================
// Admin Dashboard - Trang tổng quan
// Thống kê: Doanh thu, Đơn hàng, Sản phẩm, Người dùng
// Biểu đồ đơn hàng gần đây + Sản phẩm bán chạy
// ============================================================

import { useEffect, useState } from 'react';
import {
  DollarSign, ShoppingCart, Package, Users,
  TrendingUp, TrendingDown, ArrowUpRight, Eye
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

// Dữ liệu mock cho dashboard
const mockStats = {
  revenue: 284500000,
  revenueChange: 12.5,
  orders: 156,
  ordersChange: 8.2,
  products: 245,
  productsChange: 3.1,
  users: 1024,
  usersChange: 15.8,
};

const mockRecentOrders = [
  { id: 'DH-001234', customer: 'Nguyễn Văn A', total: 15990000, status: 'pending', date: '23/04/2026' },
  { id: 'DH-001233', customer: 'Trần Thị B', total: 24980000, status: 'confirmed', date: '23/04/2026' },
  { id: 'DH-001232', customer: 'Lê Văn C', total: 9990000, status: 'shipping', date: '22/04/2026' },
  { id: 'DH-001231', customer: 'Phạm Thị D', total: 32450000, status: 'delivered', date: '22/04/2026' },
  { id: 'DH-001230', customer: 'Hoàng Văn E', total: 18900000, status: 'delivered', date: '21/04/2026' },
];

const mockTopProducts = [
  { name: 'Ghế Sofa 1m8 MOCHI', sold: 56, revenue: 559440000 },
  { name: 'Giường Ngủ COMET', sold: 42, revenue: 608580000 },
  { name: 'Ghế Armchair OLLY', sold: 38, revenue: 417620000 },
  { name: 'Tủ Quần Áo ASTRO', sold: 31, revenue: 403690000 },
  { name: 'Bàn Làm Việc VIENNA', sold: 28, revenue: 223720000 },
];

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
};

const AdminDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    {
      label: 'Doanh thu tháng',
      value: formatPrice(mockStats.revenue),
      change: mockStats.revenueChange,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      label: 'Đơn hàng',
      value: mockStats.orders.toString(),
      change: mockStats.ordersChange,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      label: 'Sản phẩm',
      value: mockStats.products.toString(),
      change: mockStats.productsChange,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      label: 'Người dùng',
      value: mockStats.users.toString(),
      change: mockStats.usersChange,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div
              key={stat.label}
              className={cn(
                'bg-white rounded-xl p-5 shadow-sm border border-border-light transition-all hover:shadow-md',
                isLoaded && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-navy mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-2.5 rounded-lg text-white', stat.color)}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {isPositive ? (
                  <TrendingUp size={14} className="text-success" />
                ) : (
                  <TrendingDown size={14} className="text-red" />
                )}
                <span className={cn('text-xs font-semibold', isPositive ? 'text-success' : 'text-red')}>
                  {isPositive ? '+' : ''}{stat.change}%
                </span>
                <span className="text-xs text-text-muted ml-1">so với tháng trước</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-column layout: Đơn hàng gần đây + Sản phẩm bán chạy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Đơn hàng gần đây */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-border-light">
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <h2 className="text-base font-bold text-navy">Đơn hàng gần đây</h2>
            <a href="/admin/orders" className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              Xem tất cả <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Mã đơn</th>
                  <th className="px-5 py-3 font-medium">Khách hàng</th>
                  <th className="px-5 py-3 font-medium">Tổng tiền</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium">Ngày</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {mockRecentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-bg-secondary/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-navy">{order.id}</td>
                    <td className="px-5 py-3.5 text-sm text-text-secondary">{order.customer}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-navy">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                        statusMap[order.status]?.className
                      )}>
                        {statusMap[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-text-muted">{order.date}</td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 text-text-muted hover:text-primary rounded transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sản phẩm bán chạy */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light">
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <h2 className="text-base font-bold text-navy">Top bán chạy</h2>
            <a href="/admin/products" className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              Xem tất cả <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="p-5 space-y-4">
            {mockTopProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                  i === 0 ? 'bg-yellow-100 text-yellow-800' :
                  i === 1 ? 'bg-gray-100 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-bg-secondary text-text-muted'
                )}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{product.name}</p>
                  <p className="text-xs text-text-muted">{product.sold} đã bán</p>
                </div>
                <p className="text-xs font-semibold text-success">{formatPrice(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
