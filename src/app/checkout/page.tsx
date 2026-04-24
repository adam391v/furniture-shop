'use client';

// ============================================================
// Trang Checkout - Thanh toán đơn hàng
// Layout MOHO: 2 cột (form trái, order summary phải)
// Hỗ trợ thay đổi số lượng sản phẩm ngay tại checkout
// ============================================================

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Truck, CreditCard, Banknote, Loader2, CheckCircle, ShieldCheck, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const FREE_SHIP_THRESHOLD = 5000000;
const SHIPPING_FEE = 30000;

// InputField PHẢI nằm NGOÀI component chính (tránh re-mount → mất focus)
interface InputFieldProps {
  label: string;
  field: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (field: string, value: string) => void;
}

const InputField = ({ label, field, placeholder, type = 'text', required = true, value, error, onChange }: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-navy mb-1.5">
      {label} {required && <span className="text-red">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
        error ? 'border-red bg-red/5' : 'border-border focus:border-primary'
      }`}
    />
    {error && <p className="text-xs text-red mt-1">{error}</p>}
  </div>
);

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getSubtotal, clearCart, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [form, setForm] = useState({
    shippingName: user ? `${user.lastName} ${user.firstName}` : '',
    shippingPhone: user?.phone || '',
    shippingEmail: user?.email || '',
    shippingAddress: '',
    shippingCity: '',
    shippingDistrict: '',
    shippingWard: '',
    note: '',
    paymentMethod: 'cod' as 'cod' | 'bank_transfer',
  });

  const subtotal = useMemo(() => getSubtotal(), [items]); // eslint-disable-line react-hooks/exhaustive-deps
  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.shippingName.trim()) newErrors.shippingName = 'Vui lòng nhập họ tên';
    if (!form.shippingPhone.trim()) newErrors.shippingPhone = 'Vui lòng nhập số điện thoại';
    else if (!/^0[0-9]{9,10}$/.test(form.shippingPhone)) newErrors.shippingPhone = 'SĐT không hợp lệ';
    if (!form.shippingAddress.trim()) newErrors.shippingAddress = 'Vui lòng nhập địa chỉ';
    if (!form.shippingCity.trim()) newErrors.shippingCity = 'Vui lòng nhập tỉnh/thành phố';
    if (!form.shippingDistrict.trim()) newErrors.shippingDistrict = 'Vui lòng nhập quận/huyện';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (items.length === 0) { toast.error('Giỏ hàng trống'); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          price: item.variant?.price ?? item.product.price,
        })),
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi đặt hàng');

      clearCart();
      router.push(`/checkout/success?order=${data.order.orderNumber}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi đặt hàng');
    } finally {
      setSubmitting(false);
    }
  };

  // Giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center p-8">
          <CheckCircle size={64} className="mx-auto text-success mb-4" />
          <h1 className="text-2xl font-bold text-navy mb-2">Giỏ hàng trống</h1>
          <p className="text-text-muted mb-6">Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
          <Link href="/products" className="btn-primary rounded-lg inline-block">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header tối giản */}
      <div className="bg-white border-b border-border-light shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            Quay lại giỏ hàng
          </Link>
          <Link href="/" className="text-2xl font-bold text-navy tracking-tight">moho.</Link>
          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* === CỘT TRÁI: Form thông tin === */}
          <div className="lg:col-span-7 space-y-6">
            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-xl border border-border-light p-6">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-5">
                <Truck size={20} className="text-primary" />
                Thông tin giao hàng
              </h2>

              {!user && (
                <p className="text-sm text-text-muted mb-5 p-3 bg-bg-secondary rounded-lg">
                  Bạn đã có tài khoản?{' '}
                  <Link href="/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
                  {' '}để tự động điền thông tin.
                </p>
              )}

              <div className="space-y-4">
                <InputField label="Họ và tên" field="shippingName" placeholder="Nguyễn Văn A" value={form.shippingName} error={errors.shippingName} onChange={updateField} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Số điện thoại" field="shippingPhone" placeholder="0901234567" value={form.shippingPhone} error={errors.shippingPhone} onChange={updateField} />
                  <InputField label="Email" field="shippingEmail" placeholder="email@example.com" type="email" required={false} value={form.shippingEmail} error={errors.shippingEmail} onChange={updateField} />
                </div>

                <InputField label="Địa chỉ" field="shippingAddress" placeholder="Số nhà, tên đường" value={form.shippingAddress} error={errors.shippingAddress} onChange={updateField} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="Tỉnh/Thành phố" field="shippingCity" placeholder="TP. Hồ Chí Minh" value={form.shippingCity} error={errors.shippingCity} onChange={updateField} />
                  <InputField label="Quận/Huyện" field="shippingDistrict" placeholder="Quận 1" value={form.shippingDistrict} error={errors.shippingDistrict} onChange={updateField} />
                  <InputField label="Phường/Xã" field="shippingWard" placeholder="Phường Bến Nghé" required={false} value={form.shippingWard} onChange={updateField} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">Ghi chú</label>
                  <textarea
                    value={form.note}
                    onChange={(e) => updateField('note', e.target.value)}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hoặc hướng dẫn giao hàng chi tiết..."
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-primary resize-none h-24 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-xl border border-border-light p-6">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-5">
                <CreditCard size={20} className="text-primary" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                  form.paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/30'
                }`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={() => updateField('paymentMethod', 'cod')} className="w-5 h-5 accent-primary" />
                  <Banknote size={24} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-navy">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-xs text-text-muted mt-0.5">Thanh toán bằng tiền mặt khi nhận được hàng</p>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                  form.paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/30'
                }`}>
                  <input type="radio" name="paymentMethod" value="bank_transfer" checked={form.paymentMethod === 'bank_transfer'} onChange={() => updateField('paymentMethod', 'bank_transfer')} className="w-5 h-5 accent-primary" />
                  <CreditCard size={24} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-navy">Chuyển khoản ngân hàng</p>
                    <p className="text-xs text-text-muted mt-0.5">Chuyển khoản qua tài khoản ngân hàng hoặc QR code</p>
                  </div>
                </label>
              </div>

              {form.paymentMethod === 'bank_transfer' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm">
                  <p className="font-semibold text-navy mb-2">Thông tin chuyển khoản:</p>
                  <div className="space-y-1 text-text-secondary">
                    <p>🏦 Ngân hàng: <strong>Vietcombank</strong></p>
                    <p>📋 Số TK: <strong>1234 5678 9012</strong></p>
                    <p>👤 Chủ TK: <strong>CONG TY MOHO</strong></p>
                    <p>📝 Nội dung: <strong>Thanh toan DH [SĐT của bạn]</strong></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* === CỘT PHẢI: Order Summary + Điều chỉnh SL === */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-xl border border-border-light overflow-hidden">
                <div className="p-5 border-b border-border-light">
                  <h2 className="text-lg font-bold text-navy">
                    Đơn hàng ({totalItems} sản phẩm)
                  </h2>
                </div>

                {/* Danh sách sản phẩm - CÓ TĂNG GIẢM SỐ LƯỢNG */}
                <div className="max-h-[400px] overflow-y-auto divide-y divide-border-light">
                  {items.map((item) => {
                    const price = item.variant?.price ?? item.product.price;
                    return (
                      <div key={item.id} className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Ảnh SP */}
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
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
                            <p className="text-sm font-medium text-navy line-clamp-2 leading-snug">{item.product.name}</p>
                            {item.variant && <p className="text-xs text-text-muted mt-0.5">{item.variant.color}</p>}
                            <p className="text-sm font-semibold text-primary mt-1">{formatPrice(price)}</p>
                          </div>

                          {/* Nút xóa */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-text-muted hover:text-red transition-colors flex-shrink-0"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Tăng / Giảm số lượng */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-navy hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 1) updateQuantity(item.id, val);
                              }}
                              className="w-12 h-8 text-center text-sm font-semibold border-x border-border outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              min={1}
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-navy hover:bg-bg-secondary transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-bold text-navy text-sm">
                            {formatPrice(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tổng kết */}
                <div className="p-5 bg-bg-secondary/50 space-y-3 text-sm border-t border-border-light">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Tạm tính</span>
                    <span className="text-navy font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Phí vận chuyển</span>
                    <span className={shippingFee === 0 ? 'text-success font-medium' : 'text-navy'}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-text-muted">
                      🚚 Miễn phí ship cho đơn từ {formatPrice(FREE_SHIP_THRESHOLD)}
                    </p>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-bold text-navy text-base">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Nút đặt hàng */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 bg-primary text-white font-bold text-base rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  `ĐẶT HÀNG · ${formatPrice(total)}`
                )}
              </button>

              <div className="flex items-center justify-center gap-6 text-xs text-text-muted py-2">
                <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-success" /> Bảo mật thanh toán</span>
                <span className="flex items-center gap-1"><Truck size={14} className="text-success" /> Giao hàng 3-5 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
