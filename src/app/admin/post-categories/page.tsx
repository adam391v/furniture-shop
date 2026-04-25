'use client';

// ============================================================
// Admin - Quản lý Danh mục Tin tức (Post Categories)
// CRUD: Thêm / Sửa / Xóa danh mục bài viết
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit, Trash2, Loader2, X,
  FolderOpen, FileText, GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PostCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { posts: number };
}

const AdminPostCategoriesPage = () => {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PostCategory | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    isActive: true,
    sortOrder: 0,
  });

  // Fetch danh sách danh mục
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/post-categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      toast.error('Lỗi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Mở modal tạo mới
  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', isActive: true, sortOrder: 0 });
    setShowModal(true);
  };

  // Mở modal sửa
  const openEdit = (cat: PostCategory) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description || '',
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    });
    setShowModal(true);
  };

  // Lưu danh mục
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        isActive: form.isActive,
        sortOrder: form.sortOrder,
      };

      const url = editingCategory
        ? `/api/admin/post-categories/${editingCategory.id}`
        : '/api/admin/post-categories';

      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi');
      }

      toast.success(editingCategory ? 'Cập nhật thành công' : 'Tạo danh mục thành công');
      setShowModal(false);
      fetchCategories();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi lưu danh mục');
    } finally {
      setSaving(false);
    }
  };

  // Xóa danh mục
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      const res = await fetch(`/api/admin/post-categories/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Lỗi xóa');
      }

      toast.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi xóa danh mục');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Danh mục Tin tức</h1>
          <p className="text-sm text-text-muted mt-0.5">{categories.length} danh mục</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
        >
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      {/* Danh sách */}
      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <FolderOpen size={48} className="mb-3 opacity-50" />
            <p className="text-lg font-medium">Chưa có danh mục nào</p>
            <p className="text-sm mt-1">Bắt đầu bằng cách thêm danh mục mới</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-bg-secondary/60 text-xs font-semibold text-text-muted uppercase tracking-wide">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Tên danh mục</div>
              <div className="col-span-3">Mô tả</div>
              <div className="col-span-1 text-center">Bài viết</div>
              <div className="col-span-1 text-center">Trạng thái</div>
              <div className="col-span-2 text-right">Thao tác</div>
            </div>

            {categories.map((cat, index) => (
              <div key={cat.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-bg-secondary/30 transition-colors">
                {/* Thứ tự */}
                <div className="col-span-1 flex items-center gap-2">
                  <GripVertical size={14} className="text-text-muted/40" />
                  <span className="text-sm text-text-muted">{index + 1}</span>
                </div>

                {/* Tên & slug */}
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-navy">{cat.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">/{cat.slug}</p>
                </div>

                {/* Mô tả */}
                <div className="col-span-3">
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {cat.description || '—'}
                  </p>
                </div>

                {/* Số bài viết */}
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center gap-1 text-sm text-text-secondary">
                    <FileText size={13} />
                    {cat._count.posts}
                  </span>
                </div>

                {/* Trạng thái */}
                <div className="col-span-1 text-center">
                  <span className={cn(
                    'px-2.5 py-1 rounded-full text-[10px] font-semibold',
                    cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  )}>
                    {cat.isActive ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </div>

                {/* Thao tác */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-text-muted hover:text-blue-600 transition-colors"
                    title="Sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa danh mục */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <h2 className="text-lg font-bold text-navy">
                {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-bg-secondary rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              {/* Tên danh mục */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Tên danh mục *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Xu hướng nội thất"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả ngắn về danh mục..."
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary resize-none h-20 transition-colors"
                />
              </div>

              {/* Thứ tự + Trạng thái */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">Trạng thái</label>
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={cn(
                        'w-11 h-6 rounded-full transition-colors',
                        form.isActive ? 'bg-green-500' : 'bg-gray-300'
                      )} />
                      <div className={cn(
                        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                        form.isActive && 'translate-x-5'
                      )} />
                    </div>
                    <span className="text-sm text-navy">
                      {form.isActive ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-navy hover:bg-bg-secondary transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingCategory ? 'Cập nhật' : 'Tạo danh mục'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostCategoriesPage;
