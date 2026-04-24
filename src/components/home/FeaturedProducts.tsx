'use client';

// ============================================================
// FeaturedProducts Component - Section sản phẩm nổi bật
// ============================================================

import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mock-data';
import Link from 'next/link';

const FeaturedProducts = () => {
  const featured = mockProducts.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="py-12 md:py-16">
      <div className="container-main">
        <div className="section-heading">
          <h2>Sản Phẩm Nổi Bật</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

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
