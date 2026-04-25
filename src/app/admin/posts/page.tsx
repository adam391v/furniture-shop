'use client';

// ============================================================
// Admin - Quản lý Tin tức (Blog Posts)
// CRUD: Thêm / Sửa / Xóa bài viết
// Rich text editor cho nội dung (React Quill)
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Loader2, X,
  Search, FileText, Calendar, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import dynamic from 'next/dynamic';

// Dynamic import React Quill (không hỗ trợ SSR)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  thumbnailUrl: string | null;
  authorName: string | null;
  isPublished: boolean;
  createdAt: string;
}

const AdminPostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Form state
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    authorName: '',
    isPublished: true,
  });
  const [thumbnail, setThumbnail] = useState<string[]>([]);
  const quillRef = useRef<HTMLDivElement>(null);

  // Quill modules - hỗ trợ upload ảnh
  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ align: [] }],
        ['clean'],
      ],
    },
  };

  // Fetch danh sách bài viết
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      }
    } catch {
      toast.error('Lỗi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Mở form tạo mới
  const openCreate = () => {
    setEditingPost(null);
    setForm({ title: '', excerpt: '', content: '', authorName: '', isPublished: true });
    setThumbnail([]);
    setShowEditor(true);
  };

  // Mở form sửa
  const openEdit = async (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content || '',
      authorName: post.authorName || '',
      isPublished: post.isPublished,
    });
    setThumbnail(post.thumbnailUrl ? [post.thumbnailUrl] : []);
    setShowEditor(true);
  };

  // Lưu bài viết
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        thumbnailUrl: thumbnail[0] || null,
        authorName: form.authorName || 'Admin',
        isPublished: form.isPublished,
      };

      const url = editingPost
        ? `/api/admin/posts/${editingPost.id}`
        : '/api/admin/posts';

      const res = await fetch(url, {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi');
      }

      toast.success(editingPost ? 'Cập nhật thành công' : 'Tạo bài viết thành công');
      setShowEditor(false);
      fetchPosts();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  // Xóa bài viết
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Xóa bài viết thành công');
        fetchPosts();
      } else {
        throw new Error('Lỗi xóa');
      }
    } catch {
      toast.error('Lỗi xóa bài viết');
    }
  };

  // Toggle trạng thái published
  const togglePublished = async (post: Post) => {
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          thumbnailUrl: post.thumbnailUrl,
          authorName: post.authorName,
          isPublished: !post.isPublished,
        }),
      });

      if (res.ok) {
        toast.success(post.isPublished ? 'Đã ẩn bài viết' : 'Đã hiển thị bài viết');
        fetchPosts();
      }
    } catch {
      toast.error('Lỗi cập nhật');
    }
  };

  // Format ngày
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // === EDITOR VIEW ===
  if (showEditor) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEditor(false)}
              className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-navy">
              {editingPost ? 'Sửa bài viết' : 'Tạo bài viết mới'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEditor(false)}
              className="px-4 py-2 border border-border rounded-lg text-sm text-navy hover:bg-bg-secondary transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editingPost ? 'Cập nhật' : 'Đăng bài'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Form chính */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tiêu đề */}
            <div className="bg-white rounded-xl border border-border-light p-5">
              <label className="block text-sm font-semibold text-navy mb-2">Tiêu đề *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Mô tả ngắn */}
            <div className="bg-white rounded-xl border border-border-light p-5">
              <label className="block text-sm font-semibold text-navy mb-2">Mô tả ngắn (Excerpt)</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Mô tả ngắn gọn nội dung bài viết..."
                className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-primary resize-none h-24 transition-colors"
              />
            </div>

            {/* Nội dung Rich Text */}
            <div className="bg-white rounded-xl border border-border-light p-5" ref={quillRef}>
              <label className="block text-sm font-semibold text-navy mb-2">Nội dung bài viết</label>
              <div className="prose-editor">
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(value: string) => setForm({ ...form, content: value })}
                  modules={quillModules}
                  placeholder="Viết nội dung bài viết tại đây..."
                  className="bg-white rounded-lg min-h-[400px]"
                />
              </div>
            </div>
          </div>

          {/* Cột phải: Sidebar */}
          <div className="space-y-5">
            {/* Trạng thái */}
            <div className="bg-white rounded-xl border border-border-light p-5">
              <label className="block text-sm font-semibold text-navy mb-3">Trạng thái</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-11 h-6 rounded-full transition-colors',
                    form.isPublished ? 'bg-green-500' : 'bg-gray-300'
                  )} />
                  <div className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                    form.isPublished && 'translate-x-5'
                  )} />
                </div>
                <span className="text-sm text-navy">{form.isPublished ? 'Đã xuất bản' : 'Bản nháp'}</span>
              </label>
            </div>

            {/* Ảnh đại diện */}
            <div className="bg-white rounded-xl border border-border-light p-5">
              <label className="block text-sm font-semibold text-navy mb-3">Ảnh đại diện</label>
              <ImageUpload
                images={thumbnail}
                onChange={setThumbnail}
                maxImages={1}
                label="Upload ảnh thumbnail"
              />
            </div>

            {/* Tác giả */}
            <div className="bg-white rounded-xl border border-border-light p-5">
              <label className="block text-sm font-semibold text-navy mb-2">Tác giả</label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                placeholder="Tên tác giả (mặc định: Admin)"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === LIST VIEW ===
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Quản lý Tin tức</h1>
          <p className="text-sm text-text-muted mt-0.5">{total} bài viết</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
        >
          <Plus size={18} />
          Thêm bài viết
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="bg-white rounded-xl border border-border-light p-4">
        <div className="flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2">
          <Search size={16} className="text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent text-sm outline-none flex-1"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-text-muted hover:text-navy">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Danh sách */}
      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <FileText size={48} className="mb-3 opacity-50" />
            <p className="text-lg font-medium">Chưa có bài viết nào</p>
            <p className="text-sm mt-1">Bắt đầu bằng cách thêm bài viết mới</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border-light">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-bg-secondary/50 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                    {post.thumbnailUrl ? (
                      <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={20} className="text-text-muted" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-navy truncate">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(post.createdAt)}
                      </span>
                      <span>{post.authorName || 'Admin'}</span>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium',
                        post.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      )}>
                        {post.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => togglePublished(post)}
                      className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-navy transition-colors"
                      title={post.isPublished ? 'Ẩn bài viết' : 'Xuất bản'}
                    >
                      {post.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => openEdit(post)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-text-muted hover:text-blue-600 transition-colors"
                      title="Sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border-light">
                <p className="text-xs text-text-muted">
                  Trang {page} / {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded hover:bg-bg-secondary disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded hover:bg-bg-secondary disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPostsPage;
