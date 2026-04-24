'use client';

// ============================================================
// Trang Đăng Nhập - /login
// Form UI premium với TailwindCSS, validate bằng Zod
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { loginSchema, type LoginInput } from '@/lib/validations';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const setUser = useAuthStore((s) => s.setUser);

  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name as keyof LoginInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate phía client
    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Đăng nhập thất bại');
        return;
      }

      // Cập nhật auth store
      setUser({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      });

      toast.success('Đăng nhập thành công!');
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error('Lỗi kết nối, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-bg-secondary py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl font-extrabold text-navy">moho<span className="text-primary">.</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-navy">Đăng nhập</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Chào mừng bạn quay lại! Vui lòng đăng nhập để tiếp tục.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm outline-none transition-colors
                  ${errors.email ? 'border-red bg-red/5' : 'border-border focus:border-primary'}`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red">{errors.email}</p>}
          </div>

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
                placeholder="Nhập mật khẩu"
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

          {/* Quên mật khẩu */}
          <div className="flex items-center justify-end">
            <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Đăng nhập
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-text-muted">hoặc</span>
            </div>
          </div>

          {/* Link đăng ký */}
          <p className="text-center text-sm text-text-secondary">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
