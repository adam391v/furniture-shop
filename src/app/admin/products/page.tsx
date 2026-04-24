'use client';

// ============================================================
// Admin - Quản lý Sản phẩm: API-driven
// Bảng dữ liệu + tìm kiếm + phân trang + CRUD thực
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Eye, Filter,
  ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Loader2, PackageX
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { adminGetProducts, adminDeleteProduct, adminToggleProduct } from '@/lib/api/products';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const perPage = 10;

  // Fetch sản phẩm từ API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetProducts({ page: currentPage, limit: perPage, search });
      setProducts(data.products);
      setPagination({ total: data.pagination.total, totalPages: data.pagination.totalPages });
    } catch {
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Xóa sản phẩm
  const handleDelete = async (productId: number) => {
    setDeleting(true);
    try {
      await adminDeleteProduct(productId);
      toast.success('Đã xóa sản phẩm');
      setShowDeleteModal(null);
      fetchProducts(); // Reload danh sách
    } catch {
      toast.error('Lỗi khi xóa sản phẩm');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle hiển thị
  const handleToggle = async (product: Product) => {
    try {
      await adminToggleProduct(product.id, !product.isActive);
      toast.success(product.isActive ? 'Đã ẩn sản phẩm' : 'Đã hiển thị sản phẩm');
      fetchProducts();
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Quản lý sản phẩm</h1>
          <p className="text-sm text-text-secondary mt-1">{pagination.total} sản phẩm</p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2.5">
            <Search size={16} className="text-text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-navy hover:bg-bg-secondary transition-colors">
            <Filter size={16} />
            <span className="hidden sm:inline">Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
        {loading ? (
          /* Loading skeleton */
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary" />
            <span className="ml-3 text-text-secondary text-sm">Đang tải...</span>
          </div>
        ) : products.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <PackageX size={48} className="mb-4" />
            <p className="text-base font-medium">Chưa có sản phẩm nào</p>
            <p className="text-sm mt-1">Bấm "Thêm sản phẩm" để bắt đầu</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-secondary text-left text-xs text-text-muted uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Sản phẩm</th>
                    <th className="px-5 py-3 font-medium">SKU</th>
                    <th className="px-5 py-3 font-medium">Giá bán</th>
                    <th className="px-5 py-3 font-medium">Đã bán</th>
                    <th className="px-5 py-3 font-medium">Trạng thái</th>
                    <th className="px-5 py-3 font-medium text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.images?.[0]?.imageUrl || '/images/placeholder.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-navy truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              {product.category?.name || 'Chưa phân loại'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono bg-bg-secondary px-2 py-1 rounded">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
                        {product.comparePrice > product.price && (
                          <p className="text-xs text-text-muted line-through">{formatPrice(product.comparePrice)}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy">{product.soldCount}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleToggle(product)} className="flex items-center gap-1.5 text-sm">
                          {product.isActive ? (
                            <>
                              <ToggleRight size={20} className="text-success" />
                              <span className="text-xs text-success font-medium">Hiển thị</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={20} className="text-text-muted" />
                              <span className="text-xs text-text-muted">Ẩn</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                            title="Xem"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-text-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => setShowDeleteModal(product.id)}
                            className="p-2 text-text-muted hover:text-red rounded-lg hover:bg-red/5 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-border-light">
              <p className="text-xs text-text-muted">
                Hiển thị {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, pagination.total)} / {pagination.total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => p <= 5 || Math.abs(p - currentPage) <= 1)
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                        page === currentPage ? 'bg-primary text-white' : 'hover:bg-bg-secondary text-navy'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-navy">Xác nhận xóa</h3>
            <p className="text-sm text-text-secondary mt-2">
              Bạn có chắc muốn xóa sản phẩm này? Hành động không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(null)}
                disabled={deleting}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red text-white rounded-lg text-sm font-semibold hover:bg-red-dark transition-colors disabled:opacity-50"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
