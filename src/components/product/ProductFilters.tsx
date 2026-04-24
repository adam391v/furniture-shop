'use client';

// ============================================================
// ProductFilters Component - Bộ lọc sản phẩm
// API-driven: Lấy danh mục từ /api/categories
// ============================================================

import { useState, useEffect } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategories } from '@/lib/api/products';
import type { Category } from '@/types';

interface ProductFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
}

const priceRanges = [
  { label: 'Dưới 5 triệu', value: '0-5000000' },
  { label: '5 - 10 triệu', value: '5000000-10000000' },
  { label: '10 - 20 triệu', value: '10000000-20000000' },
  { label: '20 - 30 triệu', value: '20000000-30000000' },
  { label: 'Trên 30 triệu', value: '30000000-999999999' },
];

const colors = [
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Be', hex: '#D4C5A9' },
  { name: 'Xám', hex: '#9E9E9E' },
  { name: 'Nâu', hex: '#5D4037' },
  { name: 'Xanh rêu', hex: '#4A7C59' },
  { name: 'Đen', hex: '#212121' },
];

const sizes = ['1m2', '1m4', '1m6', '1m8', '2m', '60cm', '80cm'];

type FilterType = 'category' | 'price' | 'color' | 'size' | null;

const ProductFilters = ({ onFilterChange }: ProductFiltersProps) => {
  const [openFilter, setOpenFilter] = useState<FilterType>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch danh mục từ API
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const toggleFilter = (filter: FilterType) => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const hasActiveFilters = selectedCategory || selectedPrice || selectedColor || selectedSize;

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedPrice('');
    setSelectedColor('');
    setSelectedSize('');
    onFilterChange?.({});
  };

  const filterButtons: { type: FilterType; label: string; value: string }[] = [
    { type: 'category', label: 'Danh mục', value: selectedCategory },
    { type: 'price', label: 'Giá sản phẩm', value: selectedPrice },
    { type: 'color', label: 'Màu sắc', value: selectedColor },
    { type: 'size', label: 'Kích thước', value: selectedSize },
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Nút bộ lọc */}
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
                openFilter === btn.type || btn.value
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-border text-navy hover:border-navy-light'
              )}
            >
              <span>{btn.label}</span>
              <ChevronDown size={14} className={cn(
                'transition-transform',
                openFilter === btn.type && 'rotate-180'
              )} />
            </button>

            {/* Dropdown */}
            {openFilter === btn.type && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-border rounded-lg shadow-xl z-30 p-3 animate-fade-in">
                {btn.type === 'category' && (
                  <div className="space-y-1">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.slug); setOpenFilter(null); }}
                          className={cn(
                            'w-full text-left px-3 py-2 text-sm rounded hover:bg-bg-secondary transition-colors',
                            selectedCategory === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'text-navy'
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
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => { setSelectedPrice(range.value); setOpenFilter(null); }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm rounded hover:bg-bg-secondary transition-colors',
                          selectedPrice === range.value ? 'bg-primary/10 text-primary font-medium' : 'text-navy'
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}

                {btn.type === 'color' && (
                  <div className="grid grid-cols-3 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => { setSelectedColor(color.name); setOpenFilter(null); }}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-2 rounded hover:bg-bg-secondary transition-colors',
                          selectedColor === color.name && 'bg-primary/10'
                        )}
                      >
                        <span
                          className="w-7 h-7 rounded-full border-2 border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[10px] text-navy">{color.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {btn.type === 'size' && (
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(size); setOpenFilter(null); }}
                        className={cn(
                          'px-3 py-1.5 text-sm border rounded transition-colors',
                          selectedSize === size
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
