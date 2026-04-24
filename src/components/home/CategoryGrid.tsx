'use client';

// ============================================================
// CategoryGrid Component - Lưới danh mục sản phẩm trang chủ
// API-driven: Lấy danh mục từ /api/categories
// Hiển thị ảnh danh mục hoặc emoji fallback
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/api/products';
import { Loader2, FolderTree } from 'lucide-react';
import type { Category } from '@/types';

// Emoji fallback theo slug
const categoryEmoji: Record<string, string> = {
  'sofa': '🛋️',
  'ghe-sofa': '🛋️',
  'giuong-ngu': '🛏️',
  'tu-quan-ao': '🗄️',
  'ban-lam-viec': '🖥️',
  'ghe': '💺',
  'ke-sach': '📚',
  'ban-an': '🍽️',
  'do-trang-tri': '🏺',
  'ke-tivi': '📺',
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Ẩn section nếu không có data
  if (!loading && categories.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-bg-secondary">
      <div className="container-main">
        <div className="section-heading">
          <h2>Danh Mục Sản Phẩm</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-4 md:p-5 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Ảnh danh mục hoặc emoji fallback */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-all duration-300">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-xl"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-3xl md:text-4xl group-hover:bg-primary/10">
                      {categoryEmoji[cat.slug] || '📦'}
                    </div>
                  )}
                </div>
                <span className="text-xs md:text-sm font-semibold text-navy text-center group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
