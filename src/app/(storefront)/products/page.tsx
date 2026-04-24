'use client';

// ============================================================
// Trang Danh Sách Sản Phẩm - Grid 4 cột + Bộ lọc (giống MOHO)
// ============================================================

import { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { mockProducts } from '@/lib/mock-data';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá tăng dần', value: 'price_asc' },
  { label: 'Giá giảm dần', value: 'price_desc' },
  { label: 'Bán chạy', value: 'bestseller' },
];

const ProductsPage = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sắp xếp sản phẩm theo lựa chọn
  const sortedProducts = [...mockProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'bestseller': return b.soldCount - a.soldCount;
      default: return 0;
    }
  });

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="container-main">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Tất cả sản phẩm' }]} />

        {/* Tiêu đề trang */}
        <div className="py-6 border-b border-border-light">
          <h1 className="text-2xl md:text-3xl font-bold text-navy">
            Tất cả sản phẩm
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {mockProducts.length} sản phẩm
          </p>
        </div>

        {/* Bộ lọc + Sắp xếp */}
        <div className="py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border-light">
          <ProductFilters />

          <div className="flex items-center gap-3">
            {/* Chế độ hiển thị */}
            <div className="flex items-center border border-border rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid' ? 'bg-navy text-white' : 'text-navy hover:bg-bg-secondary'
                )}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list' ? 'bg-navy text-white' : 'text-navy hover:bg-bg-secondary'
                )}
              >
                <List size={16} />
              </button>
            </div>

            {/* Dropdown sắp xếp */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded text-sm text-navy bg-white outline-none focus:border-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid sản phẩm */}
        <div className="py-8">
          <div
            className={cn(
              'grid gap-4 md:gap-6',
              viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2'
            )}
          >
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded text-sm font-medium transition-all',
                  page === 1
                    ? 'bg-navy text-white'
                    : 'text-navy hover:bg-bg-secondary border border-border'
                )}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
