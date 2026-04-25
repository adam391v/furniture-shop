'use client';

// ============================================================
// ProductFilters Component - Bộ lọc sản phẩm
// Nhận giá trị hiện tại từ URL params (qua props)
// Gọi onFilterChange khi user chọn filter → parent cập nhật URL
// Đã loại bỏ filter màu sắc theo yêu cầu
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategories } from '@/lib/api/products';
import type { Category } from '@/types';

interface ProductFiltersProps {
  onFilterChange: (filters: Record<string, string>) => void;
  currentCategory?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentSize?: string;
}

const priceRanges = [
  { label: 'Dưới 5 triệu', min: '0', max: '5000000' },
  { label: '5 - 10 triệu', min: '5000000', max: '10000000' },
  { label: '10 - 20 triệu', min: '10000000', max: '20000000' },
  { label: '20 - 30 triệu', min: '20000000', max: '30000000' },
  { label: 'Trên 30 triệu', min: '30000000', max: '' },
];

const sizes = ['1m2', '1m4', '1m6', '1m8', '2m', '60cm', '80cm'];

type FilterType = 'category' | 'price' | 'size' | null;

const ProductFilters = ({
  onFilterChange,
  currentCategory = '',
  currentMinPrice = '',
  currentMaxPrice = '',
  currentSize = '',
}: ProductFiltersProps) => {
  const [openFilter, setOpenFilter] = useState<FilterType>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch danh mục từ API
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (filter: FilterType) => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  // Tìm label giá đang chọn
  const currentPriceLabel = priceRanges.find(
    (r) => r.min === currentMinPrice && r.max === currentMaxPrice
  )?.label;

  // Tìm label danh mục đang chọn
  const currentCategoryLabel = categories.find((c) => c.slug === currentCategory)?.name;

  const hasActiveFilters = currentCategory || currentMinPrice || currentSize;

  // Xử lý chọn danh mục
  const handleCategorySelect = (slug: string) => {
    const newValue = slug === currentCategory ? '' : slug;
    onFilterChange({ category: newValue });
    setOpenFilter(null);
  };

  // Xử lý chọn giá
  const handlePriceSelect = (min: string, max: string) => {
    const isSame = min === currentMinPrice && max === currentMaxPrice;
    onFilterChange({
      minPrice: isSame ? '' : min,
      maxPrice: isSame ? '' : max,
    });
    setOpenFilter(null);
  };

  // Xử lý chọn kích thước
  const handleSizeSelect = (size: string) => {
    const newValue = size === currentSize ? '' : size;
    onFilterChange({ size: newValue });
    setOpenFilter(null);
  };

  // Xóa tất cả filter
  const clearFilters = () => {
    onFilterChange({
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      search: '',
    });
  };

  const filterButtons: { type: FilterType; label: string; activeLabel?: string; isActive: boolean }[] = [
    { type: 'category', label: 'Danh mục', activeLabel: currentCategoryLabel, isActive: !!currentCategory },
    { type: 'price', label: 'Giá sản phẩm', activeLabel: currentPriceLabel, isActive: !!currentMinPrice },
    { type: 'size', label: 'Kích thước', activeLabel: currentSize, isActive: !!currentSize },
  ];

  return (
    <div className="relative" ref={filterRef}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Icon bộ lọc */}
        <div className="flex items-center gap-1.5 text-sm font-semibold text-navy">
          <Filter size={16} />
          <span>BỘ LỌC</span>
        </div>

        {filterButtons.map((btn) => (
          <div key={btn.type} className="relative">
            <button
              onClick={() => toggleFilter(btn.type)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 border rounded text-sm transition-all',
                openFilter === btn.type || btn.isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-border text-navy hover:border-navy-light'
              )}
            >
              <span>{btn.isActive && btn.activeLabel ? btn.activeLabel : btn.label}</span>
              <ChevronDown
                size={14}
                className={cn('transition-transform', openFilter === btn.type && 'rotate-180')}
              />
            </button>

            {/* Dropdown */}
            {openFilter === btn.type && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-border rounded-lg shadow-xl z-30 p-3 animate-fade-in">
                {btn.type === 'category' && (
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {/* Option: Tất cả */}
                    <button
                      onClick={() => handleCategorySelect('')}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm rounded hover:bg-bg-secondary transition-colors',
                        !currentCategory ? 'bg-primary/10 text-primary font-medium' : 'text-navy'
                      )}
                    >
                      Tất cả danh mục
                    </button>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.slug)}
                          className={cn(
                            'w-full text-left px-3 py-2 text-sm rounded hover:bg-bg-secondary transition-colors',
                            currentCategory === cat.slug
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-navy'
                          )}
                        >
                          {cat.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-text-muted text-center py-2">Đang tải...</p>
                    )}
                  </div>
                )}

                {btn.type === 'price' && (
                  <div className="space-y-1">
                    {priceRanges.map((range) => {
                      const isActive = range.min === currentMinPrice && range.max === currentMaxPrice;
                      return (
                        <button
                          key={`${range.min}-${range.max}`}
                          onClick={() => handlePriceSelect(range.min, range.max)}
                          className={cn(
                            'w-full text-left px-3 py-2 text-sm rounded hover:bg-bg-secondary transition-colors',
                            isActive ? 'bg-primary/10 text-primary font-medium' : 'text-navy'
                          )}
                        >
                          {range.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {btn.type === 'size' && (
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={cn(
                          'px-3 py-1.5 text-sm border rounded transition-colors',
                          currentSize === size
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-border text-navy hover:border-navy-light'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Nút xóa bộ lọc */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red hover:text-red-dark transition-colors"
          >
            <X size={14} />
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
