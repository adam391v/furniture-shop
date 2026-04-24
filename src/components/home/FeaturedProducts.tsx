'use client';

// ============================================================
// FeaturedProducts Component - API-driven
// Lấy sản phẩm nổi bật từ /api/products/featured
// ============================================================

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/lib/api/products';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/types';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts(8)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Không hiển thị section nếu không có sản phẩm
  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container-main">
        <div className="section-heading">
          <h2>Sản Phẩm Nổi Bật</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block btn-primary rounded px-10"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
