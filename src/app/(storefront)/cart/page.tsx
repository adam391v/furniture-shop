'use client';

// ============================================================
// Trang Giỏ Hàng (giống MOHO)
// Danh sách SP (trái) + Thông tin đơn hàng (phải)
// ============================================================

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/utils';

const CartPage = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-border mb-4" />
        <h1 className="text-2xl font-bold text-navy">Giỏ hàng trống</h1>
        <p className="mt-2 text-text-muted">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link href="/products" className="inline-block mt-6 btn-primary rounded">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="container-main">
        <Breadcrumb items={[{ label: `Giỏ hàng (${getItemCount()})` }]} />

        <h1 className="text-2xl md:text-3xl font-bold text-navy text-center py-6">
          Giỏ hàng của bạn
        </h1>
        <div className="w-12 h-0.5 bg-navy mx-auto mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* === Danh sách sản phẩm === */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-sm text-text-secondary">
              Có <span className="font-bold text-primary">{getItemCount()} sản phẩm</span> trong giỏ hàng
            </p>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white border border-border-light rounded-lg hover:shadow-sm transition-shadow"
              >
                {/* Ảnh */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                  <Image
                    src={item.product.images[0]?.imageUrl || '/images/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-navy text-sm md:text-base line-clamp-2">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                        <span className="price-sale text-sm">{formatPrice(item.product.price)}</span>
                        {item.product.comparePrice > item.product.price && (
                          <span className="price-original text-xs">{formatPrice(item.product.comparePrice)}</span>
                        )}
                      </div>
                      {item.variant && (
                        <p className="text-xs text-text-muted mt-1">{item.variant.color}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-text-muted hover:text-red transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Quantity + Subtotal */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-navy hover:bg-bg-secondary"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-navy hover:bg-bg-secondary"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-navy">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Ghi chú */}
            <div className="mt-6">
              <h3 className="font-semibold text-navy mb-2">Ghi chú đơn hàng</h3>
              <textarea
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                className="w-full border border-border rounded-lg p-4 text-sm resize-none h-28 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* === Thông tin đơn hàng === */}
          <div>
            <div className="sticky top-24 bg-white border border-border-light rounded-lg p-6">
              <h2 className="text-lg font-bold text-navy mb-4">Thông tin đơn hàng</h2>

              <div className="flex items-center justify-between pb-4 border-b border-border-light">
                <span className="text-text-secondary">Tổng tiền:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(getSubtotal())}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block mt-4 btn-checkout rounded text-center"
              >
                THANH TOÁN
              </Link>

              <Link
                href="/products"
                className="flex items-center justify-center gap-2 mt-3 text-sm text-navy hover:text-primary transition-colors"
              >
                <ArrowLeft size={14} />
                Tiếp tục mua hàng
              </Link>

              {/* Cam kết */}
              <div className="mt-6 space-y-3 pt-4 border-t border-border-light">
                {[
                  { icon: Truck, text: 'Giao hàng trong vòng 3 ngày' },
                  { icon: RotateCcw, text: 'Miễn phí 1 đổi 1 - Bảo hành 2 năm' },
                  { icon: Shield, text: 'Chất lượng Quốc Tế' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2 text-xs text-text-secondary">
                    <Icon size={14} className="text-success mt-0.5 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
