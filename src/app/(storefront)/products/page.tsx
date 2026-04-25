'use client';

// ============================================================
// Trang Danh Sách Sản Phẩm - API-driven
// Đọc URL searchParams để filter/search
// Đồng bộ state với URL (reload giữ nguyên filter)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getProducts, getCategories } from '@/lib/api/products';
import { LayoutGrid, List, Loader2, PackageX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types';

const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá tăng dần', value: 'price_asc' },
  { label: 'Giá giảm dần', value: 'price_desc' },
  { label: 'Bán chạy', value: 'bestseller' },
];

// Component chính wrap trong Suspense vì dùng useSearchParams
const ProductsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc filter từ URL
  const categoryFromUrl = searchParams.get('category') || '';
  const searchFromUrl = searchParams.get('search') || '';
  const minPriceFromUrl = searchParams.get('minPrice') || '';
  const maxPriceFromUrl = searchParams.get('maxPrice') || '';
  const sizeFromUrl = searchParams.get('size') || '';
  const sortFromUrl = searchParams.get('sortBy') || 'newest';
  const pageFromUrl = parseInt(searchParams.get('page') || '1');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  // Lấy tên danh mục hiện tại (cho breadcrumb)
  const currentCategory = categories.find((c) => c.slug === categoryFromUrl);

  // Fetch danh mục
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Hàm cập nhật URL khi thay đổi filter
  const updateUrl = useCallback((newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Cập nhật params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page khi thay đổi filter (không phải pagination)
    if (!('page' in newParams)) {
      params.delete('page');
    }

    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Fetch sản phẩm khi URL params thay đổi
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        sortBy: sortFromUrl as 'newest' | 'price_asc' | 'price_desc' | 'bestseller',
        page: pageFromUrl,
        limit: 12,
        categorySlug: categoryFromUrl || undefined,
        search: searchFromUrl || undefined,
        minPrice: minPriceFromUrl ? parseInt(minPriceFromUrl) : undefined,
        maxPrice: maxPriceFromUrl ? parseInt(maxPriceFromUrl) : undefined,
      });
      setProducts(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      console.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [sortFromUrl, pageFromUrl, categoryFromUrl, searchFromUrl, minPriceFromUrl, maxPriceFromUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Xử lý thay đổi filter từ ProductFilters component
  const handleFilterChange = (filters: Record<string, string>) => {
    updateUrl(filters);
  };

  // Xử lý thay đổi sort
  const handleSortChange = (value: string) => {
    updateUrl({ sortBy: value, page: '' });
  };

  // Xử lý pagination
  const handlePageChange = (page: number) => {
    updateUrl({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Breadcrumb
  const breadcrumbItems = [
    ...(currentCategory ? [{ label: currentCategory.name }] : [{ label: 'Tất cả sản phẩm' }]),
  ];

  // Tiêu đề trang
  const pageTitle = searchFromUrl
    ? `Kết quả tìm kiếm "${searchFromUrl}"`
    : currentCategory
      ? currentCategory.name
      : 'Tất cả sản phẩm';

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="container-main">
        <Breadcrumb items={breadcrumbItems} />

        {/* Tiêu đề trang */}
        <div className="py-6 border-b border-border-light">
          <h1 className="text-2xl md:text-3xl font-bold text-navy">{pageTitle}</h1>
          <p className="mt-1 text-sm text-text-secondary">{total} sản phẩm</p>
        </div>

        {/* Bộ lọc + Sắp xếp */}
        <div className="py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border-light">
          <ProductFilters
            onFilterChange={handleFilterChange}
            currentCategory={categoryFromUrl}
            currentMinPrice={minPriceFromUrl}
            currentMaxPrice={maxPriceFromUrl}
            currentSize={sizeFromUrl}
          />
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
              value={sortFromUrl}
              onChange={(e) => handleSortChange(e.target.value)}
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
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        'w-10 h-10 flex items-center justify-center rounded text-sm font-medium transition-all',
                        page === pageFromUrl
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

// Wrap với Suspense vì useSearchParams cần nó
const ProductsPage = () => (
  <Suspense fallback={
    <div className="bg-bg-primary min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  }>
    <ProductsContent />
  </Suspense>
);

export default ProductsPage;
