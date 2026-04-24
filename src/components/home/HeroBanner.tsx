'use client';

// ============================================================
// HeroBanner Component - Carousel banner lớn trang chủ
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dữ liệu banner (hardcoded cho demo, sau này lấy từ DB)
const banners = [
  {
    id: 1,
    title: 'Bộ Sưu Tập\nMùa Hè 2024',
    subtitle: 'Giảm đến 40% toàn bộ Sofa & Armchair',
    cta: 'Khám phá ngay',
    href: '/products?category=sofa',
    bgColor: 'from-amber-50 to-orange-50',
    textColor: 'text-navy',
    image: '🛋️',
  },
  {
    id: 2,
    title: 'Phòng Ngủ\nHoàn Hảo',
    subtitle: 'Giường ngủ cao cấp - Thiết kế Bắc Âu',
    cta: 'Xem bộ sưu tập',
    href: '/products?category=giuong-ngu',
    bgColor: 'from-slate-100 to-blue-50',
    textColor: 'text-navy',
    image: '🛏️',
  },
  {
    id: 3,
    title: 'Thiết Kế\nNội Thất',
    subtitle: 'Dịch vụ thi công trọn gói - Tư vấn miễn phí',
    cta: 'Liên hệ ngay',
    href: '/thiet-ke-thi-cong',
    bgColor: 'from-emerald-50 to-teal-50',
    textColor: 'text-navy',
    image: '🏠',
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % banners.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + banners.length) % banners.length), [current, goTo]);

  // Auto-slide mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[560px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={cn(
              'absolute inset-0 bg-gradient-to-r transition-all duration-700 ease-in-out',
              banner.bgColor,
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <div className="container-main h-full flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full gap-8">
                {/* Text content */}
                <div className={cn(
                  'transition-all duration-700 delay-200',
                  index === current ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                )}>
                  <h2 className={cn(
                    'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight whitespace-pre-line',
                    banner.textColor
                  )}>
                    {banner.title}
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-text-secondary max-w-md">
                    {banner.subtitle}
                  </p>
                  <Link
                    href={banner.href}
                    className="inline-block mt-6 md:mt-8 btn-primary rounded"
                  >
                    {banner.cta}
                  </Link>
                </div>

                {/* Visual element */}
                <div className={cn(
                  'hidden md:flex items-center justify-center transition-all duration-700 delay-300',
                  index === current ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'
                )}>
                  <span className="text-[180px] lg:text-[220px] drop-shadow-lg">{banner.image}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-navy hover:bg-white hover:text-primary transition-all shadow-md"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-navy hover:bg-white hover:text-primary transition-all shadow-md"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === current ? 'w-8 bg-primary' : 'w-2 bg-navy/30 hover:bg-navy/50'
            )}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
