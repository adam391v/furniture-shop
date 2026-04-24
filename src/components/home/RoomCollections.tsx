'use client';

// ============================================================
// RoomCollections Component - Bộ sưu tập theo phòng
// API-driven: Lấy dữ liệu từ /api/rooms
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, Home } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  productCount: number;
}

// Emoji fallback
const roomEmoji: Record<string, string> = {
  'phong-khach': '🛋️',
  'phong-ngu': '🛏️',
  'phong-lam-viec': '💻',
  'phong-an': '🍽️',
};

// Gradient colors cho mỗi phòng
const roomGradients: Record<string, string> = {
  'phong-khach': 'from-amber-50 to-orange-50',
  'phong-ngu': 'from-blue-50 to-indigo-50',
  'phong-lam-viec': 'from-emerald-50 to-teal-50',
  'phong-an': 'from-rose-50 to-pink-50',
};

const RoomCollections = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Ẩn section nếu không có data
  if (!loading && rooms.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-bg-secondary">
      <div className="container-main">
        <div className="section-heading">
          <h2>Bộ Sưu Tập Theo Phòng</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {rooms.map((room, index) => (
              <Link
                key={room.id}
                href={`/products?room=${room.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Ảnh/Icon phòng */}
                <div className={`relative h-52 md:h-64 bg-gradient-to-br ${roomGradients[room.slug] || 'from-gray-50 to-slate-50'} flex items-center justify-center overflow-hidden`}>
                  {room.imageUrl ? (
                    <Image
                      src={room.imageUrl}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <span className="text-[100px] md:text-[120px] group-hover:scale-110 transition-transform duration-500">
                      {roomEmoji[room.slug] || '🏠'}
                    </span>
                  )}
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
        )}
      </div>
    </section>
  );
};

export default RoomCollections;
