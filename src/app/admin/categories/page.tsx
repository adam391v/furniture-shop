'use client';

// ============================================================
// Admin - Quản lý Danh mục sản phẩm
// CRUD danh mục + sắp xếp thứ tự
// ============================================================

import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, FolderTree } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

const initialCategories: Category[] = [
  { id: 1, name: 'Ghế Sofa', slug: 'ghe-sofa', productCount: 24, isActive: true, sortOrder: 1 },
  { id: 2, name: 'Giường Ngủ', slug: 'giuong-ngu', productCount: 18, isActive: true, sortOrder: 2 },
  { id: 3, name: 'Tủ Quần Áo', slug: 'tu-quan-ao', productCount: 15, isActive: true, sortOrder: 3 },
  { id: 4, name: 'Bàn Làm Việc', slug: 'ban-lam-viec', productCount: 12, isActive: true, sortOrder: 4 },
  { id: 5, name: 'Kệ Tivi', slug: 'ke-tivi', productCount: 9, isActive: true, sortOrder: 5 },
  { id: 6, name: 'Bàn Ăn', slug: 'ban-an', productCount: 11, isActive: false, sortOrder: 6 },
];

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', slug: '' });

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', slug: '' });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    const slug = form.slug || form.name.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-');

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) => c.id === editingId ? { ...c, name: form.name, slug } : c)
      );
      toast.success('Cập nhật danh mục thành công');
    } else {
      const newCat: Category = {
        id: Date.now(),
        name: form.name,
        slug,
        productCount: 0,
        isActive: true,
        sortOrder: categories.length + 1,
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success('Thêm danh mục thành công');
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success('Đã xóa danh mục');
    setDeleteId(null);
  };

  const toggleActive = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
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
        <div className="divide-y divide-border-light">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-bg-secondary/50 transition-colors"
            >
              <GripVertical size={16} className="text-text-muted cursor-grab" />

              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FolderTree size={18} className="text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy">{cat.name}</p>
                <p className="text-xs text-text-muted">/{cat.slug} • {cat.productCount} sản phẩm</p>
              </div>

              <button
                onClick={() => toggleActive(cat.id)}
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
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 text-text-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeleteId(cat.id)}
                  className="p-2 text-text-muted hover:text-red rounded-lg hover:bg-red/5 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-navy mb-4">
              {editingId ? 'Sửa danh mục' : 'Thêm danh mục'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Tên danh mục *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ví dụ: Ghế Sofa"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Slug (tự động nếu để trống)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="ghe-sofa"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
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
            <p className="text-sm text-text-secondary mt-2">Bạn có chắc muốn xóa danh mục này?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors">Hủy</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red text-white rounded-lg text-sm font-semibold hover:bg-red-dark transition-colors">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
