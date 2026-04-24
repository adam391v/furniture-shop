'use client';

// ============================================================
// ProductCard Component - Thẻ sản phẩm (giống MOHO)
// Badge giảm giá | Ảnh hover | Tên | Giá | Rating | Color swatches
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calcDiscount, cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const discount = calcDiscount(product.price, product.comparePrice);
  const currentVariant = product.variants[selectedVariantIndex];
  const currentImage = product.images[isImageHovered && product.images.length > 1 ? 1 : 0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, currentVariant);
  };

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="product-card">
        {/* === Ảnh sản phẩm === */}
        <div
          className="relative aspect-square overflow-hidden bg-bg-secondary"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {/* Badge giảm giá */}
          {discount > 0 && (
            <span className="badge-discount">-{discount}%</span>
          )}

          {/* Ảnh sản phẩm */}
          <div className="relative w-full h-full product-card-image transition-transform duration-500">
            <Image
              src={currentImage?.imageUrl || '/images/placeholder.jpg'}
              alt={currentImage?.altText || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized
            />
          </div>

          {/* Nút thêm vào giỏ - hiện khi hover */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300',
              isImageHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-white text-navy font-semibold py-2.5 text-sm rounded hover:bg-primary hover:text-white transition-colors"
            >
              <ShoppingBag size={16} />
              Thêm vào giỏ
            </button>
          </div>
        </div>

        {/* === Thông tin sản phẩm === */}
        <div className="p-3 md:p-4">
          {/* Tên sản phẩm */}
          <h3 className="text-sm font-semibold text-navy line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Giá */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="price-sale">{formatPrice(product.price)}</span>
            {product.comparePrice > product.price && (
              <span className="price-original">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          {/* Rating + Đã bán */}
          <div className="flex items-center justify-between mt-2">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-text-muted ml-1">({product.reviews.length})</span>
              </div>
            ) : (
              <div />
            )}
            {product.soldCount > 0 && (
              <span className="text-xs text-text-muted">Đã bán {product.soldCount}</span>
            )}
          </div>

          {/* Color Swatches */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mt-3">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantIndex(index);
                  }}
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all',
                    selectedVariantIndex === index
                      ? 'border-navy scale-110'
                      : 'border-border hover:border-navy-light'
                  )}
                  style={{ backgroundColor: variant.colorHex }}
                  title={variant.color}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
