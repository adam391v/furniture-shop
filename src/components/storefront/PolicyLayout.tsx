// ============================================================
// PolicyLayout - Layout dùng chung cho các trang nội dung tĩnh
// Hero banner + Breadcrumb + Sidebar mục lục + Nội dung
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { ChevronRight, FileText } from 'lucide-react';

interface PolicyLayoutProps {
  title: string;
  description: string;
  breadcrumbLabel: string;
  children: React.ReactNode;
  /** Danh sách mục lục bên sidebar */
  tableOfContents?: { id: string; label: string }[];
}

/** Danh sách các trang chính sách để hiện sidebar điều hướng */
const policyLinks = [
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/chinh-sach-giao-hang', label: 'Chính sách giao hàng' },
  { href: '/chinh-sach-doi-tra', label: 'Chính sách đổi trả' },
  { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
  { href: '/chinh-sach-bao-hanh', label: 'Chính sách bảo hành' },
];

const PolicyLayout = ({
  title,
  description,
  breadcrumbLabel,
  children,
  tableOfContents,
}: PolicyLayoutProps) => {
  const [activeId, setActiveId] = useState('');

  // Theo dõi scroll để highlight mục lục đang đọc
  useEffect(() => {
    if (!tableOfContents?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    tableOfContents.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy via-navy-dark to-navy relative overflow-hidden">
        {/* Hoa văn trang trí */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-10 left-10 w-72 h-72 border border-white rounded-full" />
          <div className="absolute bottom-5 right-20 w-96 h-96 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white rounded-full" />
        </div>

        <div className="container-main relative z-10 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container-main">
        <Breadcrumb items={[{ label: breadcrumbLabel }]} />
      </div>

      {/* Nội dung chính */}
      <div className="container-main pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Điều hướng chính sách */}
              <div className="bg-white rounded-xl border border-border-light p-5">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-primary" />
                  Danh mục
                </h3>
                <nav className="space-y-0.5">
                  {policyLinks.map((link) => {
                    const isActive =
                      typeof window !== 'undefined' &&
                      window.location.pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-text-secondary hover:bg-bg-secondary hover:text-navy'
                        }`}
                      >
                        <ChevronRight
                          size={14}
                          className={isActive ? 'text-primary' : 'text-text-muted'}
                        />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mục lục nội dung (nếu có) */}
              {tableOfContents && tableOfContents.length > 0 && (
                <div className="bg-white rounded-xl border border-border-light p-5 hidden lg:block">
                  <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">
                    Mục lục
                  </h3>
                  <nav className="space-y-0.5">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                          activeId === item.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-text-secondary hover:bg-bg-secondary hover:text-navy'
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Hỗ trợ nhanh */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-5">
                <h3 className="text-sm font-bold text-navy mb-2">
                  Cần hỗ trợ?
                </h3>
                <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                  Liên hệ với chúng tôi nếu bạn cần tư vấn thêm về chính sách.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-navy font-medium">
                    📞 <span>1900 0129</span>
                  </p>
                  <p className="flex items-center gap-2 text-navy font-medium">
                    ✉️ <span>cskh@noithatxinh.vn</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Nội dung bài viết */}
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-border-light p-6 md:p-10">
              {/* Nội dung JSX được truyền vào */}
              <div className="policy-content">{children}</div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;
