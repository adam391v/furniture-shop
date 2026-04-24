'use client';

// ============================================================
// Account - Đổi mật khẩu
// ============================================================

import { useState } from 'react';
import { Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ChangePasswordPage = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const toggleShow = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Đổi mật khẩu thành công');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi đổi mật khẩu');
    } finally {
      setSaving(false);
    }
  };

  const PasswordInput = ({
    label,
    value,
    field,
    placeholder,
  }: {
    label: string;
    value: string;
    field: 'current' | 'new' | 'confirm';
    placeholder: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={showPasswords[field] ? 'text' : 'password'}
          value={value}
          onChange={(e) => setForm({ ...form, [`${field === 'current' ? 'currentPassword' : field === 'new' ? 'newPassword' : 'confirmPassword'}`]: e.target.value })}
          className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors pr-10"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => toggleShow(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy"
        >
          {showPasswords[field] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-border-light">
      <div className="p-6 border-b border-border-light">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <Lock size={20} />
          Đổi mật khẩu
        </h2>
        <p className="text-sm text-text-muted mt-1">Cập nhật mật khẩu để bảo vệ tài khoản</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 max-w-md">
        <PasswordInput label="Mật khẩu hiện tại *" value={form.currentPassword} field="current" placeholder="Nhập mật khẩu hiện tại" />
        <PasswordInput label="Mật khẩu mới *" value={form.newPassword} field="new" placeholder="Tối thiểu 6 ký tự" />
        <PasswordInput label="Xác nhận mật khẩu mới *" value={form.confirmPassword} field="confirm" placeholder="Nhập lại mật khẩu mới" />

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
