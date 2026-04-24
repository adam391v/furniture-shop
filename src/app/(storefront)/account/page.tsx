'use client';

// ============================================================
// Account - Thông tin cá nhân
// Xem + cập nhật profile (firstName, lastName, phone, gender)
// ============================================================

import { useState, useEffect } from 'react';
import { User, Save, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  gender: string;
  avatarUrl: string | null;
  createdAt: string;
}

const AccountPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'other',
  });

  // Fetch profile
  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setForm({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phone: data.user.phone || '',
            gender: data.user.gender || 'other',
          });
        }
      })
      .catch(() => toast.error('Lỗi tải thông tin'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('Họ và tên không được để trống');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProfile(data.user);
      toast.success('Cập nhật thành công');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border-light">
        <div className="p-6 border-b border-border-light">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <User size={20} />
            Thông tin cá nhân
          </h2>
          <p className="text-sm text-text-muted mt-1">Cập nhật thông tin tài khoản của bạn</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Email - readonly */}
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Email</label>
            <input
              value={profile?.email || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">Email không thể thay đổi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Họ *</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                placeholder="Nguyễn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Tên *</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                placeholder="Văn A"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Số điện thoại</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                placeholder="0901 234 567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Giới tính</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          {/* Ngày tạo */}
          {profile?.createdAt && (
            <div className="flex items-center gap-2 text-xs text-text-muted pt-2 border-t border-border-light">
              <CheckCircle size={14} />
              Thành viên từ {new Date(profile.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border-light bg-bg-secondary/50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
