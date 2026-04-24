'use client';

// ============================================================
// Admin - Quản lý Banner trang chủ
// Banner chỉ gồm: ảnh (upload file) + link URL
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

interface Banner {
  id: number;
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
  const [linkUrl, setLinkUrl] = useState('');
  const [bannerImage, setBannerImage] = useState<string[]>([]);

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
    setLinkUrl('');
    setBannerImage([]);
    setShowModal(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setLinkUrl(banner.linkUrl || '');
    setBannerImage(banner.imageUrl ? [banner.imageUrl] : []);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (bannerImage.length === 0) { toast.error('Vui lòng upload ảnh banner'); return; }

    setSaving(true);
    try {
      const payload = { imageUrl: bannerImage[0], linkUrl: linkUrl || null };

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
      if (res.ok) { toast.success('Đã xóa banner'); fetchBanners(); }
    } catch { toast.error('Lỗi xóa banner'); }
  };

  const toggleActive = async (id: number, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      fetchBanners();
    } catch { toast.error('Lỗi cập nhật trạng thái'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Quản lý Banner</h1>
          <p className="text-sm text-text-secondary mt-1">{banners.length} banner · Ảnh hiển thị trên carousel trang chủ</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
          <Plus size={18} /> Thêm banner
        </button>
      </div>

      {/* Banner list */}
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">Chưa có banner nào. Thêm banner mới để hiển thị trên trang chủ.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-md transition-shadow group">
              {/* Banner image */}
              <div className="relative aspect-[16/6] bg-bg-secondary">
                <img src={banner.imageUrl} alt={`Banner ${banner.id}`} className="w-full h-full object-cover" />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white/90 text-navy text-xs font-semibold px-3 py-1 rounded-full">Đang ẩn</span>
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(banner)} className="p-2.5 bg-white rounded-full text-navy hover:text-primary shadow-lg transition-colors" title="Sửa">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => toggleActive(banner.id, banner.isActive)} className="p-2.5 bg-white rounded-full text-navy hover:text-primary shadow-lg transition-colors" title={banner.isActive ? 'Ẩn' : 'Hiện'}>
                    {banner.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => deleteBanner(banner.id)} className="p-2.5 bg-white rounded-full text-navy hover:text-red shadow-lg transition-colors" title="Xóa">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Footer info */}
              <div className="p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-text-muted" />
                  <span className="text-text-muted">Thứ tự: {banner.sortOrder}</span>
                  <span className={cn('px-2 py-0.5 rounded-full font-medium', banner.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500')}>
                    {banner.isActive ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </div>
                {banner.linkUrl && <span className="text-primary font-mono truncate max-w-[200px]">{banner.linkUrl}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-navy">{editingId ? 'Sửa banner' : 'Thêm banner'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-text-muted hover:text-navy"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <ImageUpload
                label="Ảnh banner *"
                images={bannerImage}
                onChange={setBannerImage}
                maxFiles={1}
                multiple={false}
              />

              <div>
                <label className="block text-xs font-medium text-navy mb-1">URL liên kết (tùy chọn)</label>
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="/khuyen-mai hoặc /products?category=sofa"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary font-mono"
                />
                <p className="text-[11px] text-text-muted mt-1">Khi click banner sẽ chuyển đến link này</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors">Hủy</button>
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
