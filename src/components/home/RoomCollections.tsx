// ============================================================
// RoomCollections Component - Bộ sưu tập theo phòng
// ============================================================

import Link from 'next/link';
import { mockRoomCollections } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';

// Emoji đại diện cho từng phòng
const roomEmojis: Record<string, string> = {
  'phong-khach': '🛋️',
  'phong-ngu': '🛏️',
  'phong-lam-viec': '💻',
  'phong-an': '🍽️',
};

const RoomCollections = () => {
  return (
    <section className="py-12 md:py-16 bg-bg-secondary">
      <div className="container-main">
        <div className="section-heading">
          <h2>Bộ Sưu Tập Theo Phòng</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockRoomCollections.map((room, index) => (
            <Link
              key={room.id}
              href={`/products?room=${room.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              {/* Ảnh/Icon phòng */}
              <div className="relative h-52 md:h-64 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
                <span className="text-[100px] md:text-[120px] group-hover:scale-110 transition-transform duration-500">
                  {roomEmojis[room.slug] || '🏠'}
                </span>
                {/* Overlay gradient khi hover */}
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-all duration-500" />
              </div>

              {/* Thông tin */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-text-secondary">{room.productCount} sản phẩm</span>
                  <ArrowRight
                    size={18}
                    className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomCollections;
