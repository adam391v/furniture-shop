'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import type { BlogPost } from '@/types';

interface RecentPostsSidebarProps {
  currentPostSlug?: string;
}

const RecentPostsSidebar = ({ currentPostSlug }: RecentPostsSidebarProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/posts?limit=6'); // Lấy 6 bài để trừ đi bài hiện tại nếu có
        if (!res.ok) throw new Error('Lỗi fetch');
        const data = await res.json();
        
        // Lọc bài viết hiện tại ra khỏi danh sách
        let recentPosts = data.data || data.posts || [];
        if (currentPostSlug) {
          recentPosts = recentPosts.filter((p: BlogPost) => p.slug !== currentPostSlug);
        }
        
        // Cắt lấy tối đa 5 bài
        setPosts(recentPosts.slice(0, 5));
      } catch (err) {
        setError('Không thể tải bài viết mới.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [currentPostSlug]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light p-6 sticky top-45">
      <h3 className="text-lg font-bold text-navy border-b border-border-light pb-4 mb-5">
        Bài viết mới nhất
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-text-muted">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 py-6 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-text-muted text-sm py-4">Chưa có bài viết nào.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/tin-tuc/${post.slug}`}
              className="group flex gap-4 items-start"
            >
              {/* Thumbnail nhỏ */}
              <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-bg-secondary">
                {post.thumbnailUrl ? (
                  <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Thông tin */}
              <div className="flex flex-col flex-1 py-1">
                <h4 className="text-sm font-semibold text-navy line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-auto">
                  <Calendar size={12} />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPostsSidebar;
