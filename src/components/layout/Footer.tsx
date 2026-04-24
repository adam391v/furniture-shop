// ============================================================
// Footer Component - Chân trang (giống MOHO)
// 4 cột thông tin + social + copyright
// ============================================================

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  about: [
    { label: 'Giới thiệu', href: '/ve-chung-toi' },
    { label: 'Tuyển dụng', href: '/tuyen-dung' },
    { label: 'Hệ thống cửa hàng', href: '/cua-hang' },
    { label: 'Liên hệ hợp tác', href: '/lien-he' },
  ],
  support: [
    { label: 'Hướng dẫn mua hàng', href: '/huong-dan-mua-hang' },
    { label: 'Hướng dẫn thanh toán', href: '/huong-dan-thanh-toan' },
    { label: 'Tra cứu đơn hàng', href: '/tra-cuu-don-hang' },
    { label: 'Hỏi đáp - FAQ', href: '/faq' },
  ],
  policy: [
    { label: 'Chính sách giao hàng', href: '/chinh-sach-giao-hang' },
    { label: 'Chính sách đổi trả', href: '/chinh-sach-doi-tra' },
    { label: 'Chính sách bảo hành', href: '/chinh-sach-bao-hanh' },
    { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-white">
      {/* === Commitment Bar === */}
      <div className="border-b border-white/10">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Giao hàng miễn phí', desc: 'Tại TP.HCM & Hà Nội' },
              { icon: '🛡️', title: 'Bảo hành 5 năm', desc: 'Bảo trì trọn đời' },
              { icon: '🔄', title: 'Đổi 1 đổi 1', desc: 'Trong 30 ngày đầu' },
              { icon: '🏭', title: 'Sản xuất nội địa', desc: 'Chất lượng quốc tế' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Main Footer === */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-extrabold tracking-tight">
                moho<span className="text-primary">.</span>
              </h2>
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-sm">
              Nội thất cao cấp thiết kế bởi các chuyên gia Đan Mạch & Hàn Quốc.
              Sản xuất tại Việt Nam với tiêu chuẩn quốc tế.
            </p>
            <div className="mt-5 space-y-3">
              <a href="tel:0901234567" className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <Phone size={16} />
                <span>0901 234 567</span>
              </a>
              <a href="mailto:info@furniture-shop.vn" className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <Mail size={16} />
                <span>info@furniture-shop.vn</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>162 HT17, P. Hiệp Thành, Q.12, TP.HCM</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Youtube" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Về chúng tôi */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Về chúng tôi</h3>
            <ul className="space-y-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Hỗ trợ</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Chính sách</h3>
            <ul className="space-y-2.5">
              {footerLinks.policy.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* === Copyright === */}
      <div className="border-t border-white/10">
        <div className="container-main py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © 2024 Furniture Shop. Thiết kế & phát triển bởi Furniture Shop Team.
          </p>
          <p className="text-xs text-white/40">
            GPĐKKD: 0123456789 - Ngày cấp: 01/01/2020
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
