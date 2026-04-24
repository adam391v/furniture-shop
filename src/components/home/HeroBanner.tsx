'use client';

// ============================================================
// HeroBanner Component - Carousel banner trang chủ
// API-driven: Lấy banners từ /api/banners
// Banner chỉ gồm: ảnh full-width + link (không title/subtitle)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannerData {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
}

// Fallback banners khi DB chưa có
const defaultBanners: BannerData[] = [
  { id: 1, imageUrl: '/images/banners/banner-1.jpg', linkUrl: '/products' },
  { id: 2, imageUrl: '/images/banners/banner-2.jpg', linkUrl: '/products?category=sofa' },
];

const HeroBanner = () => {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  // Fetch banners từ API
  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        const apiBanners = data.banners || [];
        if (apiBanners.length > 0) {
          setBanners(apiBanners);
        } else {
          setBanners(defaultBanners);
          setUseFallback(true);
        }
      })
      .catch(() => {
        setBanners(defaultBanners);
        setUseFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || banners.length === 0) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, banners.length]);

  const next = useCallback(() => {
    if (banners.length === 0) return;
    goTo((current + 1) % banners.length);
  }, [current, goTo, banners.length]);

  const prev = useCallback(() => {
    if (banners.length === 0) return;
    goTo((current - 1 + banners.length) % banners.length);
  }, [current, goTo, banners.length]);

  // Auto-slide mỗi 5 giây
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (loading) {
    return (
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[560px] bg-bg-secondary flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </section>
    );
  }

  if (banners.length === 0) return null;

  // Fallback gradient banners khi không có ảnh thật
  const gradients = ['from-amber-50 to-orange-50', 'from-slate-100 to-blue-50', 'from-emerald-50 to-teal-50'];
  const fallbackTitles = ['Bộ Sưu Tập\nMùa Hè 2026', 'Phòng Ngủ\nHoàn Hảo', 'Thiết Kế\nNội Thất'];
  const fallbackSubtitles = ['Giảm đến 40% toàn bộ Sofa & Armchair', 'Giường ngủ cao cấp - Thiết kế Bắc Âu', 'Dịch vụ thi công trọn gói'];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[560px]">
        {banners.map((banner, index) => {
          const BannerContent = (
            <div
              className={cn(
                'absolute inset-0 transition-all duration-700 ease-in-out',
                index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              )}
            >
              {!useFallback ? (
                /* Banner ảnh thật từ API */
                <Image
                  src={banner.imageUrl}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized
                />
              ) : (
                /* Fallback gradient khi chưa có banner */
                <div className={cn('w-full h-full bg-gradient-to-r', gradients[index % gradients.length])}>
                  <div className="container-main h-full flex items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full gap-8">
                      <div className={cn(
                        'transition-all duration-700 delay-200',
                        index === current ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                      )}>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight whitespace-pre-line text-navy">
                          {fallbackTitles[index % fallbackTitles.length]}
                        </h2>
                        <p className="mt-4 text-base md:text-lg text-text-secondary max-w-md">
                          {fallbackSubtitles[index % fallbackSubtitles.length]}
                        </p>
                        {banner.linkUrl && (
                          <Link href={banner.linkUrl} className="inline-block mt-6 md:mt-8 btn-primary rounded">
                            Khám phá ngay
                          </Link>
                        )}
                      </div>
                      <div className={cn(
                        'hidden md:flex items-center justify-center transition-all duration-700 delay-300',
                        index === current ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'
                      )}>
                        <span className="text-[180px] lg:text-[220px] drop-shadow-lg">🛋️</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );

          // Wrap trong Link nếu có linkUrl và là ảnh thật
          if (banner.linkUrl && !useFallback) {
            return (
              <Link key={banner.id} href={banner.linkUrl} className="block">
                {BannerContent}
              </Link>
            );
          }

          return <div key={banner.id}>{BannerContent}</div>;
        })}
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-navy hover:bg-white hover:text-primary transition-all shadow-md">
            <ChevronLeft size={22} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-navy hover:bg-white hover:text-primary transition-all shadow-md">
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === current ? 'w-8 bg-primary' : 'w-2 bg-white/50 hover:bg-white/70'
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
