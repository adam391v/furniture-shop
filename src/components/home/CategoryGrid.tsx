// ============================================================
// CategoryGrid Component - Lưới danh mục sản phẩm trang chủ
// ============================================================

import Link from 'next/link';
import { mockCategories } from '@/lib/mock-data';

// Emoji icon cho từng danh mục
const categoryIcons: Record<string, string> = {
  'sofa': '🛋️',
  'giuong-ngu': '🛏️',
  'tu-quan-ao': '🗄️',
  'ban-lam-viec': '🖥️',
  'ghe': '💺',
  'ke-sach': '📚',
  'ban-an': '🍽️',
  'do-trang-tri': '🏺',
};

const CategoryGrid = () => {
  return (
    <section className="py-12 md:py-16 bg-bg-secondary">
      <div className="container-main">
        <div className="section-heading">
          <h2>Danh Mục Sản Phẩm</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {mockCategories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-4 md:p-5 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-bg-secondary rounded-xl flex items-center justify-center text-3xl md:text-4xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                {categoryIcons[cat.slug] || '📦'}
              </div>
              <span className="text-xs md:text-sm font-semibold text-navy text-center group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
