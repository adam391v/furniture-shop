'use client';

// ============================================================
// Admin Dashboard - Trang tổng quan
// Dữ liệu thời gian thực từ database
// Biểu đồ: Doanh thu, Trạng thái đơn hàng
// ============================================================

import { useEffect, useState } from 'react';
import {
  DollarSign, ShoppingCart, Package, Users,
  TrendingUp, TrendingDown, ArrowUpRight, Eye, Loader2
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Link from 'next/link';

const statusMap: Record<string, { label: string; className: string; color: string }> = {
  pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800', color: '#EAB308' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800', color: '#3B82F6' },
  shipping: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800', color: '#A855F7' },
  delivered: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800', color: '#22C55E' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800', color: '#EF4444' },
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/admin/dashboard?days=${days}`);
        if (!res.ok) throw new Error('Không thể tải dữ liệu dashboard (Unauthorized hoặc Server Error)');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [days]);

  if (loading && !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="ml-3 text-text-muted">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center">
        <div className="text-red-500 font-medium text-lg mb-2">Đã xảy ra lỗi</div>
        <div className="text-text-muted">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentOrders, topProducts, chartData, statusData } = data;

  const statCards = [
    {
      label: 'Tổng Doanh Thu',
      value: formatPrice(stats.revenue),
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      label: 'Tổng Đơn Hàng',
      value: stats.orders.toString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      label: 'Sản Phẩm',
      value: stats.products.toString(),
      change: stats.productsChange,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      label: 'Khách Hàng',
      value: stats.users.toString(),
      change: stats.usersChange,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  // Helper cho PieChart Custom Label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">Tổng quan hoạt động kinh doanh thực tế</p>
        </div>
        <select 
          value={days} 
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium text-navy shadow-sm outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value={7}>7 ngày qua</option>
          <option value={30}>30 ngày qua</option>
          <option value={90}>3 tháng qua</option>
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const isPositive = stat.change >= 0;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-border-light p-5 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-navy mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-2.5 rounded-lg text-white shadow-sm', stat.color)}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4">
                <div className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", isPositive ? "bg-success/10 text-success" : "bg-red/10 text-red")}>
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{isPositive ? '+' : ''}{stat.change}%</span>
                </div>
                <span className="text-xs text-text-muted">so với kỳ trước</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart Doanh thu */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-border-light p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-navy">Doanh thu & Đơn hàng</h2>
              <p className="text-xs text-text-muted mt-1">{days} ngày qua</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()}/${d.getMonth()+1}`;
                  }}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <YAxis 
                  yAxisId="right" orientation="right" 
                  axisLine={false} tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [formatPrice(value), 'Doanh thu'];
                    return [value, 'Đơn hàng'];
                  }}
                  labelFormatter={(label) => {
                    const d = new Date(label);
                    return `Ngày ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="revenue" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="orders" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Trạng thái đơn */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-navy">Trạng thái đơn hàng</h2>
            <p className="text-xs text-text-muted mt-1">Phân bổ {days} ngày qua</p>
          </div>
          {statusData.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={statusMap[entry.name]?.color || '#CBD5E1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [value, statusMap[name]?.label || name]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(value: string) => <span className="text-xs text-text-secondary">{statusMap[value]?.label || value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">
               Chưa có dữ liệu đơn hàng
             </div>
          )}
        </div>
      </div>

      {/* 2-column layout: Đơn hàng gần đây + Sản phẩm bán chạy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Đơn hàng gần đây */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-border-light">
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <h2 className="text-base font-bold text-navy">Đơn hàng gần đây</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              Xem tất cả <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-text-muted uppercase tracking-wider bg-bg-secondary/50">
                    <th className="px-5 py-3 font-medium">Mã đơn</th>
                    <th className="px-5 py-3 font-medium">Khách hàng</th>
                    <th className="px-5 py-3 font-medium">Tổng tiền</th>
                    <th className="px-5 py-3 font-medium">Trạng thái</th>
                    <th className="px-5 py-3 font-medium">Ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-semibold text-navy">
                        <Link href={`/admin/orders/${order.id}`} className="hover:text-primary transition-colors">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-secondary">{order.customer || 'Khách vãng lai'}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-navy">{formatPrice(order.total)}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                          statusMap[order.status]?.className || 'bg-gray-100 text-gray-800'
                        )}>
                          {statusMap[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-muted">
                        {new Date(order.date).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-sm text-text-muted">Chưa có đơn hàng nào</div>
            )}
          </div>
        </div>

        {/* Sản phẩm bán chạy */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light">
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <h2 className="text-base font-bold text-navy">Top bán chạy (Mọi lúc)</h2>
            <Link href="/admin/products" className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              Xem tất cả <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {topProducts.length > 0 ? topProducts.map((product: any, i: number) => (
              <div key={product.name} className="flex items-center gap-3 group">
                <span className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110',
                  i === 0 ? 'bg-yellow-100 text-yellow-800' :
                  i === 1 ? 'bg-gray-100 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-bg-secondary text-text-muted'
                )}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate group-hover:text-primary transition-colors">{product.name}</p>
                  <p className="text-xs text-text-muted">{product.sold} đã bán</p>
                </div>
                <p className="text-xs font-semibold text-success">{formatPrice(product.revenue)}</p>
              </div>
            )) : (
               <div className="text-center text-sm text-text-muted">Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
