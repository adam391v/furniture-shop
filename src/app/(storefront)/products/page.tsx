'use client';

// ============================================================
// Trang Danh Sách Sản Phẩm - API-driven
// Grid 4 cột + Bộ lọc + Sort + Pagination thực
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getProducts } from '@/lib/api/products';
import { LayoutGrid, List, Loader2, PackageX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá tăng dần', value: 'price_asc' },
  { label: 'Giá giảm dần', value: 'price_desc' },
  { label: 'Bán chạy', value: 'bestseller' },
];

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        sortBy: sortBy as 'newest' | 'price_asc' | 'price_desc' | 'bestseller',
        page: currentPage,
        limit: 12,
      });
      setProducts(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      console.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [sortBy, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="container-main">
        <Breadcrumb items={[{ label: 'Tất cả sản phẩm' }]} />

        {/* Tiêu đề trang */}
        <div className="py-6 border-b border-border-light">
          <h1 className="text-2xl md:text-3xl font-bold text-navy">
            Tất cả sản phẩm
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {total} sản phẩm
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
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-border rounded text-sm text-navy bg-white outline-none focus:border-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid sản phẩm */}
        <div className="py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary" />
              <span className="ml-3 text-text-secondary">Đang tải sản phẩm...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <PackageX size={60} className="mb-4" />
              <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
              <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  'grid gap-4 md:gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1 md:grid-cols-2'
                )}
              >
                {products.map((product, index) => (
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
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={cn(
                        'w-10 h-10 flex items-center justify-center rounded text-sm font-medium transition-all',
                        page === currentPage
                          ? 'bg-navy text-white'
                          : 'text-navy hover:bg-bg-secondary border border-border'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
