'use client';

// ============================================================
// Testimonials Component - Đánh giá từ khách hàng
// ============================================================

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { mockTestimonials } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % mockTestimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + mockTestimonials.length) % mockTestimonials.length);

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

            {mockTestimonials.map((item, index) => (
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
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">{item.name}</h4>
                    <p className="text-sm text-text-muted">Khách hàng</p>
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
                {current + 1} / {mockTestimonials.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
