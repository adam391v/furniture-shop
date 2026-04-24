// ============================================================
// Breadcrumb Component - Điều hướng phân cấp
// ============================================================

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="py-3 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
          >
            <Home size={14} />
            <span>Trang chủ</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-text-muted" />
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="text-text-muted hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-navy font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
