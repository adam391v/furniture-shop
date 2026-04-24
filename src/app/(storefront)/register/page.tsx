'use client';

// ============================================================
// Trang Đăng Ký - /register
// Form đăng ký với validation Zod + UI premium
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, UserIcon, Phone, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [formData, setFormData] = useState<RegisterInput>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    gender: 'other',
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<string, string>> = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setErrors(
            Object.fromEntries(
              Object.entries(data.details).map(([k, v]) => [k, (v as string[])[0]])
            )
          );
        }
        toast.error(data.error || 'Đăng ký thất bại');
        return;
      }

      // Tự động đăng nhập sau khi đăng ký
      setUser({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      });

      toast.success('Đăng ký thành công! Chào mừng bạn.');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Lỗi kết nối, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper render input field
  const renderField = (
    name: string,
    label: string,
    icon: React.ReactNode,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-navy mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>
        <input
          id={name}
          name={name}
          type={type}
          value={(formData as Record<string, string>)[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm outline-none transition-colors
            ${errors[name] ? 'border-red bg-red/5' : 'border-border focus:border-primary'}`}
        />
      </div>
      {errors[name] && <p className="mt-1 text-xs text-red">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-bg-secondary py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl font-extrabold text-navy">moho<span className="text-primary">.</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-navy">Tạo tài khoản</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Đăng ký để trải nghiệm mua sắm nội thất tốt nhất.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
          {/* Họ + Tên */}
          <div className="grid grid-cols-2 gap-4">
            {renderField('firstName', 'Họ', <UserIcon size={18} />, 'text', 'Nguyễn')}
            {renderField('lastName', 'Tên', <UserIcon size={18} />, 'text', 'Văn A')}
          </div>

          {/* Email */}
          {renderField('email', 'Email', <Mail size={18} />, 'email', 'your@email.com')}

          {/* Phone */}
          {renderField('phone', 'Số điện thoại (tùy chọn)', <Phone size={18} />, 'tel', '0901 234 567')}

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-navy mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                className={`w-full pl-11 pr-12 py-3 border rounded-lg text-sm outline-none transition-colors
                  ${errors.password ? 'border-red bg-red/5' : 'border-border focus:border-primary'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red">{errors.password}</p>}
          </div>

          {/* Giới tính */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-navy mb-1.5">
              Giới tính
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors bg-white"
            >
              <option value="other">Không xác định</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Tạo tài khoản
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Link login */}
          <p className="text-center text-sm text-text-secondary">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
