'use client';

// ============================================================
// Admin - Quản lý Đơn hàng (API-driven)
// Bảng đơn hàng + cập nhật trạng thái + xem chi tiết
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Loader2, X, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: { name: string; slug: string };
  variant?: { color: string; size: string } | null;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: string;
  shippingFee: string;
  discount: string;
  total: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  paymentMethod: string;
  note: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string } | null;
  items: OrderItem[];
}

const statusMap: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800', icon: Package },
  shipping: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800', icon: XCircle },
};

const paymentMap: Record<string, string> = {
  cod: 'COD',
  bank_transfer: 'Chuyển khoản',
  momo: 'MoMo',
  vnpay: 'VNPay',
};

const statusFlow = ['pending', 'confirmed', 'shipping', 'delivered'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('page', pagination.page.toString());

      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1,
        }));
      }
    } catch {
      toast.error('Lỗi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, pagination.page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Đã cập nhật: ${statusMap[newStatus]?.label}`);
        fetchOrders();
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi cập nhật');
    }
  };

  const viewDetail = async (orderId: number) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setDetailOrder(data.order);
      }
    } catch {
      toast.error('Lỗi tải chi tiết');
    }
  };

  // Lọc theo search (client-side)
  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.orderNumber.toLowerCase().includes(q) ||
      o.shippingName.toLowerCase().includes(q) ||
      (o.user && `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(q));
  });

  // Thống kê số lượng theo status
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Quản lý đơn hàng</h1>
        <p className="text-sm text-text-secondary mt-1">{pagination.total} đơn hàng</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(statusMap).map(([key, { label, className, icon: Icon }]) => (
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
            <div className="flex items-center gap-2">
              <Icon size={14} className="opacity-60" />
              <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium', className)}>
                {label}
              </span>
            </div>
            <p className="text-xl font-bold text-navy mt-1">{statusCounts[key] || 0}</p>
          </button>
        ))}
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-muted">Chưa có đơn hàng nào</p>
          </div>
        ) : (
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
                {filtered.map((order) => {
                  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  return (
                    <tr key={order.id} className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-semibold text-navy">{order.orderNumber}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-navy">{order.user ? `${order.user.lastName} ${order.user.firstName}` : order.shippingName}</p>
                        <p className="text-xs text-text-muted">{order.shippingPhone}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy">{totalItems}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-primary">{formatPrice(Number(order.total))}</td>
                      <td className="px-5 py-3.5 text-xs text-text-secondary">{paymentMap[order.paymentMethod] || order.paymentMethod}</td>
                      <td className="px-5 py-3.5">
                        {order.status !== 'cancelled' && order.status !== 'delivered' ? (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={cn('text-xs font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer', statusMap[order.status]?.className)}
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
                      <td className="px-5 py-3.5 text-sm text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => viewDetail(order.id)} className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDetailOrder(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-navy">Chi tiết đơn hàng</h3>
                <p className="text-sm text-primary font-mono">{detailOrder.orderNumber}</p>
              </div>
              <button onClick={() => setDetailOrder(null)} className="p-1 text-text-muted hover:text-navy"><X size={20} /></button>
            </div>

            {/* Thông tin đơn hàng */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="space-y-2 text-sm">
                <h4 className="font-semibold text-navy">Thông tin giao hàng</h4>
                <p><span className="text-text-muted">Người nhận:</span> {detailOrder.shippingName}</p>
                <p><span className="text-text-muted">SĐT:</span> {detailOrder.shippingPhone}</p>
                <p><span className="text-text-muted">Địa chỉ:</span> {detailOrder.shippingAddress}</p>
                <p><span className="text-text-muted">Khu vực:</span> {detailOrder.shippingDistrict}, {detailOrder.shippingCity}</p>
              </div>
              <div className="space-y-2 text-sm">
                <h4 className="font-semibold text-navy">Thông tin đơn</h4>
                <p><span className="text-text-muted">Thanh toán:</span> {paymentMap[detailOrder.paymentMethod] || detailOrder.paymentMethod}</p>
                <p><span className="text-text-muted">Ngày đặt:</span> {new Date(detailOrder.createdAt).toLocaleString('vi-VN')}</p>
                <p>
                  <span className="text-text-muted">Trạng thái:</span>{' '}
                  <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusMap[detailOrder.status]?.className)}>
                    {statusMap[detailOrder.status]?.label}
                  </span>
                </p>
                {detailOrder.note && <p><span className="text-text-muted">Ghi chú:</span> {detailOrder.note}</p>}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="border-t border-border-light pt-4">
              <h4 className="font-semibold text-navy text-sm mb-3">Sản phẩm ({detailOrder.items.length})</h4>
              <div className="space-y-3">
                {detailOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-xs text-text-muted">{item.variant.color} / {item.variant.size}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm text-navy">x{item.quantity}</p>
                      <p className="text-sm font-semibold text-primary">{formatPrice(Number(item.price))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tổng kết */}
            <div className="border-t border-border-light mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Tạm tính</span><span>{formatPrice(Number(detailOrder.subtotal))}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Phí vận chuyển</span><span>{formatPrice(Number(detailOrder.shippingFee))}</span></div>
              {Number(detailOrder.discount) > 0 && (
                <div className="flex justify-between"><span className="text-text-muted">Giảm giá</span><span className="text-red">-{formatPrice(Number(detailOrder.discount))}</span></div>
              )}
              <div className="flex justify-between pt-2 border-t border-border-light">
                <span className="font-bold text-navy">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">{formatPrice(Number(detailOrder.total))}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
