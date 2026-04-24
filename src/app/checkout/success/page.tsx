'use client';

// ============================================================
// Trang Checkout Success - Đặt hàng thành công
// ============================================================

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border-light p-8 md:p-12 max-w-lg w-full text-center shadow-sm">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-navy mb-3">
          Đặt hàng thành công!
        </h1>

        <p className="text-text-secondary mb-6">
          Cảm ơn bạn đã mua hàng tại MOHO. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
        </p>

        {orderNumber && (
          <div className="bg-bg-secondary rounded-xl p-5 mb-6">
            <p className="text-sm text-text-muted mb-1">Mã đơn hàng</p>
            <p className="text-2xl font-bold text-primary font-mono">{orderNumber}</p>
          </div>
        )}

        {/* Thông tin */}
        <div className="text-left space-y-3 mb-8 text-sm">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Package size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-text-secondary">
              Bạn sẽ nhận được email/SMS xác nhận đơn hàng trong vài phút tới.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
            <ShoppingBag size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-text-secondary">
              Đơn hàng sẽ được giao trong 3-5 ngày làm việc. Theo dõi trạng thái đơn hàng trong trang Tài khoản.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/account/orders"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Xem đơn hàng của tôi
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="w-full inline-block py-3 border border-border rounded-xl text-navy font-medium hover:bg-bg-secondary transition-colors text-center"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

const CheckoutSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle size={40} className="text-green-600" />
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccessPage;
