'use client';

// ============================================================
// Admin - Quản lý Danh mục: API-driven + Image Upload
// CRUD đầy đủ, upload ảnh danh mục
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, GripVertical, FolderTree, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  iconUrl: string | null;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [categoryImage, setCategoryImage] = useState<string[]>([]);

  // Fetch danh mục từ API
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data.categories);
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', slug: '' });
    setCategoryImage([]);
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug });
    setCategoryImage(cat.imageUrl ? [cat.imageUrl] : []);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        imageUrl: categoryImage[0] || null,
      };

      if (editingId) {
        const res = await fetch(`/api/admin/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }
        toast.success('Cập nhật danh mục thành công');
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }
        toast.success('Thêm danh mục thành công');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success('Đã xóa danh mục');
      setDeleteId(null);
      fetchCategories();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi xóa');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      if (!res.ok) throw new Error();
      toast.success(cat.isActive ? 'Đã ẩn danh mục' : 'Đã hiển thị danh mục');
      fetchCategories();
    } catch {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Quản lý danh mục</h1>
          <p className="text-sm text-text-secondary mt-1">{categories.length} danh mục</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      {/* Danh sách danh mục */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-primary" />
            <span className="ml-3 text-text-secondary text-sm">Đang tải...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <FolderTree size={48} className="mb-3" />
            <p className="text-base font-medium">Chưa có danh mục nào</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-secondary/50 transition-colors">
                <GripVertical size={16} className="text-text-muted cursor-grab" />

                {/* Ảnh danh mục */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-bg-secondary">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderTree size={18} className="text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy">{cat.name}</p>
                  <p className="text-xs text-text-muted">/{cat.slug} • {cat.productCount} sản phẩm</p>
                </div>

                <button
                  onClick={() => toggleActive(cat)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    cat.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {cat.isActive ? 'Hiển thị' : 'Ẩn'}
                </button>

                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(cat)} className="p-2 text-text-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => setDeleteId(cat.id)} className="p-2 text-text-muted hover:text-red rounded-lg hover:bg-red/5 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy">
                {editingId ? 'Sửa danh mục' : 'Thêm danh mục'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-bg-secondary text-text-muted">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Tên danh mục <span className="text-red">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ví dụ: Ghế Sofa"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Upload ảnh danh mục */}
              <ImageUpload
                label="Ảnh danh mục"
                images={categoryImage}
                onChange={setCategoryImage}
                maxFiles={1}
                multiple={false}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingId ? 'Lưu' : 'Tạo danh mục'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-navy">Xác nhận xóa</h3>
            <p className="text-sm text-text-secondary mt-2">
              Bạn có chắc muốn xóa danh mục này? Không thể xóa nếu còn sản phẩm thuộc danh mục.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors">
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red text-white rounded-lg text-sm font-semibold hover:bg-red-dark transition-colors disabled:opacity-50"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
