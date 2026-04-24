'use client';

// ============================================================
// Account - Đơn hàng của tôi
// Danh sách đơn hàng + xem chi tiết
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, Package, Truck, CheckCircle, Clock, XCircle, Eye, ChevronRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: { name: string; slug: string; images: { imageUrl: string }[] };
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: string;
  shippingName: string;
  paymentMethod: string;
  createdAt: string;
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
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/user/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => toast.error('Lỗi tải đơn hàng'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border-light">
        <div className="p-6 border-b border-border-light">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <ShoppingBag size={20} />
            Đơn hàng của tôi
          </h2>
          <p className="text-sm text-text-muted mt-1">{orders.length} đơn hàng</p>
        </div>

        {/* Filter tabs */}
        <div className="p-4 border-b border-border-light overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                filter === 'all' ? 'bg-primary text-white' : 'text-navy hover:bg-bg-secondary'
              )}
            >
              Tất cả ({orders.length})
            </button>
            {Object.entries(statusMap).map(([key, { label }]) => {
              const count = orders.filter((o) => o.status === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                    filter === key ? 'bg-primary text-white' : 'text-navy hover:bg-bg-secondary'
                  )}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders list */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted">Chưa có đơn hàng nào</p>
              <Link href="/products" className="inline-block mt-4 btn-primary text-sm rounded-lg">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => {
                const StatusIcon = statusMap[order.status]?.icon || Clock;
                const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <div key={order.id} className="border border-border-light rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-navy font-mono">{order.orderNumber}</span>
                        <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium', statusMap[order.status]?.className)}>
                          <StatusIcon size={12} />
                          {statusMap[order.status]?.label}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Items preview */}
                    <div className="p-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 mb-3 last:mb-0">
                          <div className="w-16 h-16 rounded-lg bg-bg-secondary overflow-hidden flex-shrink-0">
                            {item.product.images?.[0]?.imageUrl ? (
                              <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy truncate">{item.product.name}</p>
                            <p className="text-xs text-text-muted">x{item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-primary flex-shrink-0">{formatPrice(Number(item.price))}</p>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-text-muted mt-1">+ {order.items.length - 2} sản phẩm khác</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-4 border-t border-border-light">
                      <div>
                        <span className="text-xs text-text-muted">{totalItems} sản phẩm · </span>
                        <span className="text-xs text-text-muted">{paymentMap[order.paymentMethod] || order.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-text-muted">Tổng: </span>
                          <span className="text-base font-bold text-primary">{formatPrice(Number(order.total))}</span>
                        </div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary text-primary text-xs font-medium rounded-lg hover:bg-primary hover:text-white transition-all"
                        >
                          Chi tiết <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
