'use client';

// ============================================================
// Admin - Quản lý Đơn hàng
// Bảng đơn hàng + cập nhật trạng thái + xem chi tiết
// ============================================================

import { useState } from 'react';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

// Mock data đơn hàng
const mockOrders = [
  { id: 1, orderNumber: 'DH-001234', customer: 'Nguyễn Văn A', phone: '0901234567', total: 15990000, status: 'pending', paymentMethod: 'cod', items: 2, date: '23/04/2026', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
  { id: 2, orderNumber: 'DH-001233', customer: 'Trần Thị B', phone: '0912345678', total: 24980000, status: 'confirmed', paymentMethod: 'bank_transfer', items: 3, date: '23/04/2026', address: '456 Lê Lợi, Q.3, TP.HCM' },
  { id: 3, orderNumber: 'DH-001232', customer: 'Lê Văn C', phone: '0923456789', total: 9990000, status: 'shipping', paymentMethod: 'momo', items: 1, date: '22/04/2026', address: '789 Trần Hưng Đạo, Q.5, TP.HCM' },
  { id: 4, orderNumber: 'DH-001231', customer: 'Phạm Thị D', phone: '0934567890', total: 32450000, status: 'delivered', paymentMethod: 'vnpay', items: 4, date: '22/04/2026', address: '321 Hai Bà Trưng, Q.1, TP.HCM' },
  { id: 5, orderNumber: 'DH-001230', customer: 'Hoàng Văn E', phone: '0945678901', total: 18900000, status: 'delivered', paymentMethod: 'cod', items: 2, date: '21/04/2026', address: '654 Võ Văn Tần, Q.3, TP.HCM' },
  { id: 6, orderNumber: 'DH-001229', customer: 'Đỗ Thị F', phone: '0956789012', total: 12500000, status: 'cancelled', paymentMethod: 'bank_transfer', items: 1, date: '20/04/2026', address: '987 Điện Biên Phủ, Bình Thạnh, TP.HCM' },
];

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
};

const paymentMap: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
};

const statusFlow = ['pending', 'confirmed', 'shipping', 'delivered'];

const AdminOrdersPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOrder, setDetailOrder] = useState<typeof mockOrders[0] | null>(null);

  const filtered = mockOrders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    // TODO: Gọi API cập nhật trạng thái
    toast.success(`Đã cập nhật trạng thái đơn hàng: ${statusMap[newStatus]?.label}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Quản lý đơn hàng</h1>
        <p className="text-sm text-text-secondary mt-1">{mockOrders.length} đơn hàng</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(statusMap).map(([key, { label, className }]) => {
          const count = mockOrders.filter((o) => o.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
              className={cn(
                'p-3 rounded-lg border text-left transition-all',
                statusFilter === key
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border-light bg-white hover:border-primary/30'
              )}
            >
              <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium', className)}>
                {label}
              </span>
              <p className="text-xl font-bold text-navy mt-1">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-4">
        <div className="flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2.5">
          <Search size={16} className="text-text-muted" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary text-left text-xs text-text-muted uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Mã đơn</th>
                <th className="px-5 py-3 font-medium">Khách hàng</th>
                <th className="px-5 py-3 font-medium">SP</th>
                <th className="px-5 py-3 font-medium">Tổng tiền</th>
                <th className="px-5 py-3 font-medium">Thanh toán</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium">Ngày</th>
                <th className="px-5 py-3 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-navy">{order.orderNumber}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-navy">{order.customer}</p>
                    <p className="text-xs text-text-muted">{order.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-navy">{order.items}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-primary">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3.5 text-xs text-text-secondary">{paymentMap[order.paymentMethod]}</td>
                  <td className="px-5 py-3.5">
                    {order.status !== 'cancelled' && order.status !== 'delivered' ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={cn(
                          'text-xs font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer',
                          statusMap[order.status]?.className
                        )}
                      >
                        {statusFlow.map((s) => (
                          <option key={s} value={s}>{statusMap[s]?.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', statusMap[order.status]?.className)}>
                        {statusMap[order.status]?.label}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-text-muted">{order.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDetailOrder(order)}
                      className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy">Chi tiết đơn hàng</h3>
              <button
                onClick={() => setDetailOrder(null)}
                className="text-text-muted hover:text-navy"
              >✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Mã đơn:</span><span className="font-semibold text-navy">{detailOrder.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Khách hàng:</span><span className="text-navy">{detailOrder.customer}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">SĐT:</span><span className="text-navy">{detailOrder.phone}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Địa chỉ:</span><span className="text-navy text-right max-w-[60%]">{detailOrder.address}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Thanh toán:</span><span className="text-navy">{paymentMap[detailOrder.paymentMethod]}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Ngày đặt:</span><span className="text-navy">{detailOrder.date}</span></div>
              <div className="border-t border-border-light pt-3 flex justify-between">
                <span className="font-semibold text-navy">Tổng tiền:</span>
                <span className="text-xl font-bold text-primary">{formatPrice(detailOrder.total)}</span>
              </div>
            </div>
            <button
              onClick={() => setDetailOrder(null)}
              className="w-full mt-6 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
