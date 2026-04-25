// ============================================================
// Trang Liên hệ - /lien-he
// Form gửi liên hệ + Thông tin liên hệ công ty
// ============================================================

'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!form.message.trim()) newErrors.message = 'Vui lòng nhập nội dung';
    if (form.phone && !/^(0|\+84)[0-9]{9,10}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSubmitted(true);
      toast.success('Gửi liên hệ thành công!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi user bắt đầu gõ
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy via-navy-dark to-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-10 left-10 w-72 h-72 border border-white rounded-full" />
          <div className="absolute bottom-5 right-20 w-96 h-96 border border-white rounded-full" />
        </div>
        <div className="container-main relative z-10 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn cho bạn trong thời gian sớm nhất
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container-main">
        <Breadcrumb items={[{ label: 'Liên hệ' }]} />
      </div>

      {/* Nội dung chính */}
      <div className="container-main pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Thông tin liên hệ - Bên trái */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card thông tin */}
            <div className="bg-white rounded-xl border border-border-light p-6 space-y-6">
              <h2 className="text-lg font-bold text-navy">Thông tin liên hệ</h2>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy mb-0.5">Showroom chính</p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      162 Nguyễn Văn Trỗi, Phường 8,<br />
                      Quận Phú Nhuận, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy mb-0.5">Hotline</p>
                    <a href="tel:19000129" className="text-sm text-primary font-medium hover:underline">
                      1900 0129
                    </a>
                    <p className="text-xs text-text-muted mt-0.5">Miễn phí cuộc gọi</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy mb-0.5">Email</p>
                    <a href="mailto:cskh@noithatxinh.vn" className="text-sm text-primary font-medium hover:underline">
                      cskh@noithatxinh.vn
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy mb-0.5">Giờ làm việc</p>
                    <p className="text-sm text-text-secondary">
                      Thứ 2 – Chủ nhật: 8:00 – 21:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mạng xã hội */}
            <div className="bg-white rounded-xl border border-border-light p-6">
              <h3 className="text-sm font-bold text-navy mb-4">Kết nối với chúng tôi</h3>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-[#1877F2]/10 rounded-lg flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"
                >
                  <span className="text-base font-bold">f</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-[#25D366]/10 rounded-lg flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                >
                  <MessageCircle size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Bản đồ (iframe Google Maps giả lập) */}
            <div className="bg-white rounded-xl border border-border-light overflow-hidden">
              <div className="aspect-[4/3] bg-bg-secondary flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3!2d106.68!3d10.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzQ4LjAiTiAxMDbCsDQwJzQ4LjAiRQ!5e0!3m2!1svi!2svn!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '250px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nội Thất Xinh - Showroom"
                />
              </div>
            </div>
          </div>

          {/* Form liên hệ - Bên phải */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-border-light p-6 md:p-8">
              {submitted ? (
                /* Trạng thái gửi thành công */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-success" />
                  </div>
                  <h2 className="text-xl font-bold text-navy mb-2">
                    Cảm ơn bạn đã liên hệ!
                  </h2>
                  <p className="text-sm text-text-secondary max-w-md mb-6">
                    Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong vòng 24 giờ 
                    qua email hoặc số điện thoại bạn cung cấp.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Gửi liên hệ khác
                  </button>
                </div>
              ) : (
                /* Form gửi liên hệ */
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-navy mb-1">Gửi tin nhắn cho chúng tôi</h2>
                    <p className="text-sm text-text-muted">
                      Điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất có thể
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Họ tên */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-navy mb-1.5">
                        Họ và tên <span className="text-red">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
                          errors.name
                            ? 'border-red bg-red/5 focus:border-red'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red">{errors.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
                          Email <span className="text-red">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
                            errors.email
                              ? 'border-red bg-red/5 focus:border-red'
                              : 'border-border focus:border-primary'
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red">{errors.email}</p>
                        )}
                      </div>

                      {/* Số điện thoại */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1.5">
                          Số điện thoại
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="0901 234 567"
                          className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
                            errors.phone
                              ? 'border-red bg-red/5 focus:border-red'
                              : 'border-border focus:border-primary'
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Nội dung */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-navy mb-1.5">
                        Nội dung <span className="text-red">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Nhập nội dung bạn muốn gửi đến Nội Thất Xinh..."
                        className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors resize-none ${
                          errors.message
                            ? 'border-red bg-red/5 focus:border-red'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-red">{errors.message}</p>
                      )}
                    </div>

                    {/* Nút gửi */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
