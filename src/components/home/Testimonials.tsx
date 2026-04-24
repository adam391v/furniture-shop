'use client';

// ============================================================
// Testimonials Component - Đánh giá từ khách hàng
// API-driven: Lấy từ /api/reviews/featured
// Fallback dữ liệu mặc định nếu DB trống
// ============================================================

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  rating: number;
  avatarUrl?: string | null;
  productName?: string;
}

// Dữ liệu mặc định khi DB chưa có reviews
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Nguyễn Thị Mai',
    content: 'Mình rất hài lòng với bộ sofa MOCHI. Chất vải đẹp, ngồi rất êm. Giao hàng nhanh, nhân viên lắp đặt rất nhiệt tình.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Trần Văn Hùng',
    content: 'Giường COMET chất lượng xuất sắc. Thiết kế đẹp, chắc chắn. Rất đáng đồng tiền!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Lê Thị Hương',
    content: 'Tủ quần áo ASTRO rộng rãi, chứa được rất nhiều đồ. Kính cường lực sáng bóng, nhìn rất sang trọng.',
    rating: 4,
  },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/reviews/featured')
      .then((res) => res.json())
      .then((data) => {
        // Nếu API trả về rỗng → dùng data mặc định
        setTestimonials(data.testimonials?.length > 0 ? data.testimonials : defaultTestimonials);
      })
      .catch(() => setTestimonials(defaultTestimonials))
      .finally(() => setLoading(false));
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container-main flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container-main">
        <div className="section-heading">
          <h2>Khách Hàng Nói Gì</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Testimonial Card */}
          <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <Quote size={40} className="text-primary/20 mb-4" />

            {testimonials.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'transition-all duration-500',
                  index === current ? 'block opacity-100' : 'hidden opacity-0'
                )}
              >
                {/* Nội dung đánh giá */}
                <p className="text-lg md:text-xl text-navy leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mt-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={cn(
                        star <= item.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      )}
                    />
                  ))}
                </div>

                {/* Thông tin khách hàng */}
                <div className="flex items-center gap-4 mt-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary overflow-hidden">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">{item.name}</h4>
                    <p className="text-sm text-text-muted">
                      {item.productName ? `Đã mua: ${item.productName}` : 'Khách hàng'}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation */}
            <div className="flex items-center gap-2 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-navy hover:bg-navy hover:text-white hover:border-navy transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-navy hover:bg-navy hover:text-white hover:border-navy transition-all"
              >
                <ChevronRight size={18} />
              </button>
              <span className="ml-auto text-sm text-text-muted">
                {current + 1} / {testimonials.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
