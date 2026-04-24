'use client';

// ============================================================
// Admin - Quản lý Đánh giá sản phẩm
// ============================================================

import { useState } from 'react';
import { Star, Trash2, Eye, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const mockReviews = [
  { id: 1, product: 'Ghế Sofa 1m8 MOCHI', user: 'Nguyễn Văn A', rating: 5, comment: 'Sofa rất đẹp, chất lượng tốt. Giao hàng nhanh, nhân viên lắp đặt chuyên nghiệp.', date: '20/04/2026', approved: true },
  { id: 2, product: 'Giường Ngủ COMET', user: 'Trần Thị B', rating: 4, comment: 'Giường tốt, chắc chắn. Chỉ có điều giao hơi chậm.', date: '19/04/2026', approved: true },
  { id: 3, product: 'Ghế Armchair OLLY', user: 'Lê Văn C', rating: 3, comment: 'Sản phẩm OK nhưng màu hơi khác ảnh.', date: '18/04/2026', approved: false },
  { id: 4, product: 'Tủ Quần Áo ASTRO', user: 'Phạm Thị D', rating: 5, comment: 'Tuyệt vời! Tủ đẹp, rộng rãi, chất lượng gỗ rất tốt.', date: '17/04/2026', approved: true },
  { id: 5, product: 'Bàn VIENNA', user: 'Hoàng Văn E', rating: 1, comment: 'Bàn bị xước khi giao. Không hài lòng.', date: '16/04/2026', approved: false },
];

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const filtered = reviews.filter((r) => {
    if (filter === 'approved') return r.approved;
    if (filter === 'pending') return !r.approved;
    return true;
  });

  const toggleApproval = (id: number) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: !r.approved } : r));
    toast.success('Đã cập nhật trạng thái đánh giá');
  };

  const deleteReview = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success('Đã xóa đánh giá');
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Quản lý đánh giá</h1>
        <p className="text-sm text-text-secondary mt-1">{reviews.length} đánh giá</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'approved', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === f ? 'bg-navy text-white' : 'bg-white border border-border text-navy hover:bg-bg-secondary'
            )}
          >
            {f === 'all' ? 'Tất cả' : f === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
            <span className="ml-1.5 text-xs opacity-70">
              ({f === 'all' ? reviews.length : reviews.filter((r) => f === 'approved' ? r.approved : !r.approved).length})
            </span>
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-border-light p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{review.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{review.user}</p>
                    <p className="text-xs text-text-muted">{review.date} • {review.product}</p>
                  </div>
                </div>
                <div className="ml-11">
                  {renderStars(review.rating)}
                  <p className="text-sm text-text-secondary mt-2">{review.comment}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleApproval(review.id)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    review.approved
                      ? 'text-success hover:bg-green-50'
                      : 'text-text-muted hover:bg-bg-secondary'
                  )}
                  title={review.approved ? 'Ẩn đánh giá' : 'Duyệt đánh giá'}
                >
                  {review.approved ? <Check size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-2 text-text-muted hover:text-red rounded-lg hover:bg-red/5 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {!review.approved && (
              <div className="mt-3 ml-11">
                <span className="inline-flex px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Chờ duyệt
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
