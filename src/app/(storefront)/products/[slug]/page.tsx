'use client';

// ============================================================
// Trang Chi Tiết Sản Phẩm - API-driven
// Gallery bên trái | Info bên phải
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Minus, Plus, ShoppingBag, Zap, Truck, Shield, RotateCcw, Share2, Heart, Check, Loader2 } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductCard from '@/components/product/ProductCard';
import { getProductBySlug, getRelatedProducts } from '@/lib/api/products';
import { formatPrice, calcDiscount, cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import type { Product } from '@/types';

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const addItem = useCartStore((s) => s.addItem);

  // Fetch sản phẩm từ API
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProductBySlug(slug);
        if (!data) {
          setError('Sản phẩm không tồn tại hoặc đã bị xóa.');
          return;
        }
        setProduct(data);

        // Load sản phẩm liên quan
        const relatedData = await getRelatedProducts(data.id, data.categoryId, 4);
        setRelated(relatedData);
      } catch {
        setError('Có lỗi xảy ra khi tải sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="bg-bg-primary min-h-screen">
        <div className="container-main py-20 flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-primary" />
          <span className="ml-4 text-lg text-text-secondary">Đang tải sản phẩm...</span>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !product) {
    return (
      <div className="bg-bg-primary min-h-screen">
        <div className="container-main py-20 text-center">
          <p className="text-2xl font-bold text-navy">{error || 'Không tìm thấy sản phẩm'}</p>
          <a href="/products" className="mt-6 inline-block btn-primary rounded">
            ← Quay lại danh sách
          </a>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants?.[selectedVariantIndex];
  const discount = calcDiscount(product.price, product.comparePrice);

  const handleAddToCart = () => {
    addItem(product, currentVariant, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, currentVariant, quantity);
    window.location.href = '/cart';
  };

  const commitments = [
    { icon: Truck, text: 'Miễn phí giao hàng & lắp đặt tại TP.HCM, Hà Nội' },
    { icon: RotateCcw, text: 'Miễn phí 1 đổi 1 - Bảo hành 5 năm - Bảo trì trọn đời' },
    { icon: Shield, text: 'Sản phẩm được thiết kế bởi chuyên gia Đan Mạch & Hàn Quốc' },
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="container-main">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Tất cả sản phẩm', href: '/products' },
            { label: product.name },
          ]}
        />

        {/* === Main Content: Gallery + Info === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 py-6">
          {/* --- Gallery bên trái --- */}
          <div className="flex gap-3">
            {/* Thumbnail column */}
            <div className="hidden md:flex flex-col gap-2 w-20">
              {product.images?.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                    selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-border hover:border-navy-light'
                  )}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.altText || product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative aspect-square rounded-lg overflow-hidden bg-bg-secondary">
              <Image
                src={product.images?.[selectedImageIndex]?.imageUrl || '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {discount > 0 && (
                <span className="badge-discount text-sm">-{discount}%</span>
              )}
            </div>
          </div>

          {/* --- Info bên phải --- */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-navy leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 rounded-full hover:bg-bg-secondary text-text-muted hover:text-red transition-colors">
                  <Heart size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-bg-secondary text-text-muted hover:text-primary transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
              <span>SKU: {product.sku}</span>
              <span>Đã bán: {product.soldCount}</span>
            </div>

            {/* Giá */}
            <div className="flex items-baseline gap-3 mt-4 pb-4 border-b border-border-light">
              {discount > 0 && (
                <span className="px-2 py-0.5 bg-red text-white text-xs font-bold rounded">
                  -{discount}%
                </span>
              )}
              <span className="text-2xl md:text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice > product.price && (
                <span className="text-base text-text-muted line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Chọn màu sắc */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-navy mb-2">
                  Màu sắc: <span className="text-text-secondary">{currentVariant?.color}</span>
                </p>
                <div className="flex items-center gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        selectedVariantIndex === index
                          ? 'border-navy scale-110 ring-2 ring-navy/20'
                          : 'border-border hover:border-navy-light'
                      )}
                      style={{ backgroundColor: variant.colorHex }}
                      title={variant.color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Kích thước + Chất liệu */}
            <div className="mt-5 space-y-2 text-sm">
              {product.dimensions && <p><span className="font-semibold text-navy">Kích thước:</span> {product.dimensions}</p>}
              {product.material && <p><span className="font-semibold text-navy">Chất liệu:</span> {product.material}</p>}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border border-border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-navy hover:bg-bg-secondary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-navy hover:bg-bg-secondary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button onClick={handleAddToCart} className="btn-primary rounded flex items-center justify-center gap-2">
                <ShoppingBag size={18} />
                THÊM VÀO GIỎ
              </button>
              <button onClick={handleBuyNow} className="btn-buy rounded flex items-center justify-center gap-2">
                <Zap size={18} />
                MUA NGAY
              </button>
            </div>

            {/* Cam kết */}
            <div className="mt-6 space-y-3">
              {commitments.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-text-secondary">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === Tabs: Mô tả | Thông số | Đánh giá === */}
        <div className="py-8 border-t border-border-light">
          <div className="flex items-center gap-0 border-b border-border-light">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 -mb-px',
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-navy'
                )}
              >
                {tab === 'description' && 'Mô tả'}
                {tab === 'specs' && 'Thông số'}
                {tab === 'reviews' && 'Đánh giá'}
              </button>
            ))}
          </div>

          <div className="py-6 max-w-3xl">
            {activeTab === 'description' && (
              <div
                className="prose prose-sm text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: product.description || '<p>Chưa có mô tả cho sản phẩm này.</p>',
                }}
              />
            )}
            {activeTab === 'specs' && (
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Kích thước', product.dimensions],
                    ['Chất liệu', product.material],
                    ['Trọng lượng', product.weight ? `${product.weight} kg` : '—'],
                    ['SKU', product.sku],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-border-light">
                      <td className="py-3 pr-4 font-semibold text-navy w-40">{label}</td>
                      <td className="py-3 text-text-secondary">{value || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-10 text-text-muted">
                <Star size={40} className="mx-auto text-border mb-3" />
                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                <button className="mt-4 btn-primary rounded text-sm">
                  Viết đánh giá đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>

        {/* === Sản phẩm liên quan === */}
        {related.length > 0 && (
          <div className="py-8 border-t border-border-light">
            <div className="section-heading">
              <h2>Sản Phẩm Liên Quan</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
