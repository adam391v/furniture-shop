'use client';

// ============================================================
// Admin - Quản lý Banner trang chủ
// ============================================================

import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
}

const initialBanners: Banner[] = [
  { id: 1, title: 'Bộ Sưu Tập Mùa Hè 2026', subtitle: 'Giảm đến 40% toàn bộ sofa', imageUrl: '/images/products/sofa-mochi-1.jpg', linkUrl: '/khuyen-mai', isActive: true, sortOrder: 1 },
  { id: 2, title: 'Phòng Ngủ Hiện Đại', subtitle: 'Thiết kế Bắc Âu sang trọng', imageUrl: '/images/products/bed-comet-1.jpg', linkUrl: '/products?category=giuong-ngu', isActive: true, sortOrder: 2 },
  { id: 3, title: 'Không Gian Làm Việc', subtitle: 'Tối ưu năng suất mỗi ngày', imageUrl: '/images/products/desk-vienna-1.jpg', linkUrl: '/products?category=ban-lam-viec', isActive: false, sortOrder: 3 },
];

const AdminBannersPage = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', linkUrl: '' });

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', subtitle: '', imageUrl: '', linkUrl: '' });
    setShowModal(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({ title: banner.title, subtitle: banner.subtitle, imageUrl: banner.imageUrl, linkUrl: banner.linkUrl });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    if (editingId) {
      setBanners((prev) => prev.map((b) => b.id === editingId ? { ...b, ...form } : b));
      toast.success('Cập nhật banner thành công');
    } else {
      setBanners((prev) => [...prev, { id: Date.now(), ...form, isActive: true, sortOrder: prev.length + 1 }]);
      toast.success('Thêm banner thành công');
    }
    setShowModal(false);
  };

  const deleteBanner = (id: number) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success('Đã xóa banner');
  };

  const toggleActive = (id: number) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Quản lý Banner</h1>
          <p className="text-sm text-text-secondary mt-1">{banners.length} banner</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
          <Plus size={18} /> Thêm banner
        </button>
      </div>

      {/* Banner list */}
      <div className="space-y-3">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4 p-4">
              <GripVertical size={16} className="text-text-muted cursor-grab flex-shrink-0" />

              {/* Preview image */}
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-text-muted" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy">{banner.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{banner.subtitle}</p>
                {banner.linkUrl && (
                  <p className="text-xs text-primary mt-1 font-mono truncate">{banner.linkUrl}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(banner.id)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    banner.isActive ? 'text-success hover:bg-green-50' : 'text-text-muted hover:bg-bg-secondary'
                  )}
                  title={banner.isActive ? 'Ẩn' : 'Hiển thị'}
                >
                  {banner.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => openEdit(banner)} className="p-2 text-text-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteBanner(banner.id)} className="p-2 text-text-muted hover:text-red rounded-lg hover:bg-red/5 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-navy mb-4">{editingId ? 'Sửa banner' : 'Thêm banner'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Tiêu đề *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Phụ đề</label>
                <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">URL hình ảnh</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/images/banner.jpg" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary font-mono" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">URL liên kết</label>
                <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="/khuyen-mai" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary font-mono" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">{editingId ? 'Lưu' : 'Tạo banner'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage;
