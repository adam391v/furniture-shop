'use client';

// ============================================================
// Admin - Quản lý Banner trang chủ (API-driven)
// CRUD đầy đủ, upload ảnh từ file, preview
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

const AdminBannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', linkUrl: '' });
  const [bannerImage, setBannerImage] = useState<string[]>([]);

  // Fetch banners từ API
  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners || []);
      }
    } catch {
      toast.error('Lỗi tải danh sách banner');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', subtitle: '', linkUrl: '' });
    setBannerImage([]);
    setShowModal(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({ title: banner.title, subtitle: banner.subtitle || '', linkUrl: banner.linkUrl || '' });
    setBannerImage(banner.imageUrl ? [banner.imageUrl] : []);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    if (bannerImage.length === 0) { toast.error('Vui lòng upload ảnh banner'); return; }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle || null,
        imageUrl: bannerImage[0],
        linkUrl: form.linkUrl || null,
      };

      const res = editingId
        ? await fetch(`/api/admin/banners/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/admin/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi');
      }

      toast.success(editingId ? 'Cập nhật banner thành công' : 'Thêm banner thành công');
      setShowModal(false);
      fetchBanners();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi lưu banner');
    } finally {
      setSaving(false);
    }
  };

  const deleteBanner = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Đã xóa banner');
        fetchBanners();
      }
    } catch {
      toast.error('Lỗi xóa banner');
    }
  };

  const toggleActive = async (id: number, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      fetchBanners();
    } catch {
      toast.error('Lỗi cập nhật trạng thái');
    }
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">Chưa có banner nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4 p-4">
                <GripVertical size={16} className="text-text-muted cursor-grab flex-shrink-0" />

                {/* Preview image */}
                <div className="w-40 h-24 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
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
                  {banner.subtitle && <p className="text-xs text-text-muted mt-0.5">{banner.subtitle}</p>}
                  {banner.linkUrl && (
                    <p className="text-xs text-primary mt-1 font-mono truncate">{banner.linkUrl}</p>
                  )}
                </div>

                {/* Status badge */}
                <span className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0',
                  banner.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                )}>
                  {banner.isActive ? 'Hiển thị' : 'Ẩn'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(banner.id, banner.isActive)}
                    className={cn('p-2 rounded-lg transition-colors', banner.isActive ? 'text-success hover:bg-green-50' : 'text-text-muted hover:bg-bg-secondary')}
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl mx-4 animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-navy">{editingId ? 'Sửa banner' : 'Thêm banner'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-text-muted hover:text-navy"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Tiêu đề *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="VD: Bộ Sưu Tập Mùa Hè 2026"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Phụ đề</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="VD: Giảm đến 40% toàn bộ sofa"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">URL liên kết</label>
                <input
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="/khuyen-mai"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary font-mono"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                label="Ảnh banner *"
                images={bannerImage}
                onChange={setBannerImage}
                maxFiles={1}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingId ? 'Lưu' : 'Tạo banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage;
