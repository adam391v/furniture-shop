'use client';

// ============================================================
// Account - Chi tiết đơn hàng
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Package, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard, FileText } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: { name: string; slug: string; images: { imageUrl: string }[] };
  variant?: { color: string; size: string } | null;
}

interface OrderDetail {
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
  items: OrderItem[];
}

const statusMap: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800', icon: Package },
  shipping: { label: 'Đang giao hàng', className: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Đã giao thành công', className: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800', icon: XCircle },
};

const statusSteps = ['pending', 'confirmed', 'shipping', 'delivered'];

const paymentMap: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
};

const OrderDetailPage = () => {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/user/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else toast.error('Không tìm thấy đơn hàng');
      })
      .catch(() => toast.error('Lỗi tải đơn hàng'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">Không tìm thấy đơn hàng</p>
        <Link href="/account/orders" className="inline-block mt-4 text-primary font-medium hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const StatusIcon = statusMap[order.status]?.icon || Clock;
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center justify-between">
        <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Link>
        <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium', statusMap[order.status]?.className)}>
          <StatusIcon size={14} />
          {statusMap[order.status]?.label}
        </span>
      </div>

      {/* Order number + date */}
      <div className="bg-white rounded-xl border border-border-light p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy font-mono">{order.orderNumber}</h2>
          <span className="text-sm text-text-muted">
            {new Date(order.createdAt).toLocaleString('vi-VN')}
          </span>
        </div>

        {/* Status timeline */}
        {order.status !== 'cancelled' && (
          <div className="flex items-center gap-2 mt-4">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const StepIcon = statusMap[step]?.icon || Clock;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-all',
                    isCompleted ? 'bg-primary text-white' : 'bg-bg-secondary text-text-muted'
                  )}>
                    <StepIcon size={14} />
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={cn(
                      'flex-1 h-0.5 mx-2',
                      index < currentStep ? 'bg-primary' : 'bg-border'
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Thông tin giao hàng + thanh toán */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-border-light p-5">
          <h3 className="font-semibold text-navy text-sm flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" />
            Thông tin giao hàng
          </h3>
          <div className="space-y-2 text-sm text-text-secondary">
            <p className="font-medium text-navy">{order.shippingName}</p>
            <p>{order.shippingPhone}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.shippingDistrict}, {order.shippingCity}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border-light p-5">
          <h3 className="font-semibold text-navy text-sm flex items-center gap-2 mb-3">
            <CreditCard size={16} className="text-primary" />
            Thanh toán
          </h3>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>{paymentMap[order.paymentMethod] || order.paymentMethod}</p>
            {order.note && (
              <div className="flex items-start gap-2 mt-3 p-3 bg-bg-secondary rounded-lg">
                <FileText size={14} className="flex-shrink-0 mt-0.5 text-text-muted" />
                <p className="text-xs">{order.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        <div className="p-5 border-b border-border-light">
          <h3 className="font-semibold text-navy text-sm">Sản phẩm ({order.items.length})</h3>
        </div>
        <div className="divide-y divide-border-light">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-5">
              <div className="w-20 h-20 rounded-lg bg-bg-secondary overflow-hidden flex-shrink-0">
                {item.product.images?.[0]?.imageUrl ? (
                  <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`} className="text-sm font-medium text-navy hover:text-primary transition-colors">
                  {item.product.name}
                </Link>
                {item.variant && (
                  <p className="text-xs text-text-muted mt-1">{item.variant.color} / {item.variant.size}</p>
                )}
                <p className="text-xs text-text-muted mt-1">Số lượng: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-primary">{formatPrice(Number(item.price) * item.quantity)}</p>
                <p className="text-xs text-text-muted">{formatPrice(Number(item.price))} / sp</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng kết */}
        <div className="p-5 bg-bg-secondary/50 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-muted">Tạm tính</span><span>{formatPrice(Number(order.subtotal))}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Phí vận chuyển</span><span>{Number(order.shippingFee) === 0 ? 'Miễn phí' : formatPrice(Number(order.shippingFee))}</span></div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between"><span className="text-text-muted">Giảm giá</span><span className="text-red">-{formatPrice(Number(order.discount))}</span></div>
          )}
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-bold text-navy text-base">Tổng cộng</span>
            <span className="text-xl font-bold text-primary">{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
