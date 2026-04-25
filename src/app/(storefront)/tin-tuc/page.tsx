'use client';

// ============================================================
// Trang Tin Tức - Danh sách bài viết (Blog)
// Layout tham khảo: MOHO Blog Media
// Card ảnh + tiêu đề + excerpt + ngày đăng
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types';

const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${page}&limit=9`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch {
      console.error('Lỗi tải bài viết');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="container-main">
        <Breadcrumb items={[{ label: 'Tin tức' }]} />

        {/* Hero banner */}
        <div className="relative py-12 md:py-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-transparent to-primary/5 rounded-2xl" />
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">
              Tin Tức & Cảm Hứng
            </h1>
            <p className="mt-3 text-text-secondary max-w-xl mx-auto">
              Khám phá xu hướng nội thất mới nhất, mẹo trang trí và câu chuyện đằng sau những sản phẩm của chúng tôi
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-muted">
              <FileText size={16} />
              <span>{total} bài viết</span>
            </div>
          </div>
        </div>

        {/* Grid bài viết */}
        <div className="pb-16">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary" />
              <span className="ml-3 text-text-secondary">Đang tải bài viết...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <FileText size={60} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">Chưa có bài viết nào</p>
              <p className="text-sm mt-1">Hãy quay lại sau nhé!</p>
            </div>
          ) : (
            <>
              {/* Layout: bài viết đầu tiên lớn, còn lại grid 3 cột */}
              <div className="space-y-8">
                {/* Bài viết nổi bật (đầu tiên) */}
                {page === 1 && posts.length > 0 && (
                  <Link
                    href={`/tin-tuc/${posts[0].slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-border-light hover:shadow-xl transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden">
                        {posts[0].thumbnailUrl ? (
                          <Image
                            src={posts[0].thumbnailUrl}
                            alt={posts[0].title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-navy/10 flex items-center justify-center">
                            <FileText size={60} className="text-text-muted/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {formatDate(posts[0].createdAt)}
                          </span>
                          {posts[0].authorName && (
                            <span className="flex items-center gap-1">
                              <User size={13} />
                              {posts[0].authorName}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-navy group-hover:text-primary transition-colors leading-tight">
                          {posts[0].title}
                        </h2>
                        {posts[0].excerpt && (
                          <p className="mt-4 text-text-secondary line-clamp-3 leading-relaxed">
                            {posts[0].excerpt}
                          </p>
                        )}
                        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline">
                          Đọc tiếp →
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid còn lại */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(page === 1 ? posts.slice(1) : posts).map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/tin-tuc/${post.slug}`}
                      className="group bg-white rounded-xl overflow-hidden border border-border-light hover:shadow-lg transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      {/* Ảnh */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {post.thumbnailUrl ? (
                          <Image
                            src={post.thumbnailUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-navy/5 flex items-center justify-center">
                            <FileText size={40} className="text-text-muted/30" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(post.createdAt)}
                          </span>
                          {post.authorName && (
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {post.authorName}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-navy group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-2 text-sm text-text-secondary line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="mt-3 inline-block text-xs font-semibold text-primary group-hover:underline">
                          Đọc tiếp →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={page <= 1}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                      page <= 1
                        ? 'text-text-muted bg-bg-secondary cursor-not-allowed'
                        : 'text-navy bg-white border border-border hover:border-primary'
                    )}
                  >
                    <ChevronLeft size={16} />
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={cn(
                        'w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                        p === page
                          ? 'bg-navy text-white'
                          : 'text-navy bg-white border border-border hover:border-primary'
                      )}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={page >= totalPages}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                      page >= totalPages
                        ? 'text-text-muted bg-bg-secondary cursor-not-allowed'
                        : 'text-navy bg-white border border-border hover:border-primary'
                    )}
                  >
                    Tiếp
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
