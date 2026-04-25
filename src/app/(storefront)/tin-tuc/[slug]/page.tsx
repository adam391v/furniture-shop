'use client';

// ============================================================
// Trang Chi Tiết Bài Viết (Blog Detail)
// Hiển thị: tiêu đề, ảnh, nội dung HTML rich text, ngày đăng
// Responsive layout với typography đẹp
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Loader2, Share2, Facebook, FileText } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import type { BlogPost } from '@/types';

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) {
          setError('Bài viết không tồn tại hoặc đã bị xóa.');
          return;
        }
        const data = await res.json();
        setPost(data.post);
      } catch {
        setError('Có lỗi xảy ra khi tải bài viết.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadPost();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Loading
  if (loading) {
    return (
      <div className="bg-bg-primary min-h-screen">
        <div className="container-main py-20 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="ml-3 text-text-secondary">Đang tải bài viết...</span>
        </div>
      </div>
    );
  }

  // Error
  if (error || !post) {
    return (
      <div className="bg-bg-primary min-h-screen">
        <div className="container-main py-20 text-center">
          <FileText size={60} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-2xl font-bold text-navy">{error || 'Không tìm thấy bài viết'}</p>
          <Link
            href="/tin-tuc"
            className="mt-6 inline-flex items-center gap-2 btn-primary rounded-lg"
          >
            <ArrowLeft size={16} />
            Quay lại tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="container-main">
        <Breadcrumb
          items={[
            { label: 'Tin tức', href: '/tin-tuc' },
            { label: post.title },
          ]}
        />

        <article className="max-w-4xl mx-auto pb-16">
          {/* Header bài viết */}
          <header className="py-8 md:py-12 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-text-muted mb-5">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(post.createdAt)}
              </span>
              {post.authorName && (
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {post.authorName}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-navy leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Ảnh đại diện */}
          {post.thumbnailUrl && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-lg">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          )}

          {/* Nội dung bài viết - render HTML */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-navy prose-headings:font-bold
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-strong:text-navy
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
              prose-code:bg-bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-li:text-text-secondary
            "
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Chia sẻ & Quay lại */}
          <div className="mt-12 pt-8 border-t border-border-light">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/tin-tuc"
                className="flex items-center gap-2 text-sm font-medium text-navy hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                Quay lại danh sách tin tức
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm text-text-muted">Chia sẻ:</span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={16} />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Đã sao chép link!');
                  }}
                  className="w-9 h-9 rounded-full bg-bg-secondary text-navy flex items-center justify-center hover:bg-border transition-colors"
                  title="Sao chép link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage;
