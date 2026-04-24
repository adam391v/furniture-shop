// ============================================================
// PromoBanner Component - Banner khuyến mãi giữa trang
// ============================================================

import Link from 'next/link';

const PromoBanner = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container-main">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-dark via-navy to-navy-dark">
          {/* Hiệu ứng nền */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-14 gap-6">
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Khuyến mãi đặc biệt
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                Giảm đến <span className="text-primary">40%</span>
                <br />
                toàn bộ sản phẩm
              </h2>
              <p className="mt-3 text-white/60 text-sm md:text-base max-w-md">
                Ưu đãi có hạn! Miễn phí giao hàng & lắp đặt tại TP.HCM và Hà Nội.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="text-7xl md:text-8xl">🎉</div>
              <Link
                href="/khuyen-mai"
                className="btn-buy rounded-lg px-10 text-base"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
