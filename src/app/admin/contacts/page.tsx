'use client';

// ============================================================
// Admin - Quản lý Liên hệ (Contacts)
// Hiển thị danh sách, xem chi tiết, đánh dấu đã xử lý, xóa
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  Mail, Phone, User, Loader2, Search, Eye, Trash2,
  CheckCircle, Clock, ChevronLeft, ChevronRight, MessageSquare, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'processed';
  createdAt: string;
}

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Fetch danh sách liên hệ
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
      });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/contacts?${params.toString()}`);
      if (!res.ok) throw new Error('Lỗi tải dữ liệu');
      const data = await res.json();
      setContacts(data.contacts || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      toast.error('Không thể tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Cập nhật trạng thái
  const handleUpdateStatus = async (id: number, status: 'new' | 'processed') => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();

      toast.success(status === 'processed' ? 'Đã đánh dấu xử lý' : 'Đã đánh dấu mới');
      fetchContacts();

      // Cập nhật luôn detail nếu đang mở
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  // Xóa liên hệ
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa liên hệ này?')) return;

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();

      toast.success('Đã xóa liên hệ');
      if (selectedContact?.id === id) {
        setShowDetail(false);
        setSelectedContact(null);
      }
      fetchContacts();
    } catch {
      toast.error('Lỗi xóa liên hệ');
    }
  };

  // Format thời gian
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Đếm số liên hệ mới
  const newCount = contacts.filter((c) => c.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-3">
            <MessageSquare size={24} className="text-primary" />
            Quản lý Liên hệ
            {newCount > 0 && (
              <span className="bg-red text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {newCount} mới
              </span>
            )}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Tổng cộng {total} liên hệ từ khách hàng
          </p>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, email, nội dung..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Lọc trạng thái */}
        <div className="flex items-center gap-2">
          {[
            { value: '', label: 'Tất cả' },
            { value: 'new', label: 'Mới' },
            { value: 'processed', label: 'Đã xử lý' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1);
              }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                statusFilter === opt.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-secondary border-border hover:bg-bg-secondary'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="ml-3 text-text-muted">Đang tải...</span>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <MessageSquare size={48} className="mb-3 opacity-30" />
            <p className="text-sm">Chưa có liên hệ nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-secondary border-b border-border-light">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-navy">Khách hàng</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy hidden md:table-cell">Nội dung</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy hidden sm:table-cell">Thời gian</th>
                  <th className="text-center py-3 px-4 font-semibold text-navy">Trạng thái</th>
                  <th className="text-center py-3 px-4 font-semibold text-navy">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={cn(
                      'hover:bg-bg-secondary/50 transition-colors cursor-pointer',
                      contact.status === 'new' && 'bg-primary/[0.02]'
                    )}
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowDetail(true);
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                            contact.status === 'new' ? 'bg-primary' : 'bg-text-muted'
                          )}
                        >
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-navy truncate">{contact.name}</p>
                          <p className="text-xs text-text-muted truncate flex items-center gap-1">
                            <Mail size={11} />
                            {contact.email}
                          </p>
                          {contact.phone && (
                            <p className="text-xs text-text-muted truncate flex items-center gap-1">
                              <Phone size={11} />
                              {contact.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="text-text-secondary line-clamp-2 max-w-md">
                        {contact.message}
                      </p>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-text-muted text-xs whitespace-nowrap">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
                          contact.status === 'new'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-success/10 text-success'
                        )}
                      >
                        {contact.status === 'new' ? (
                          <>
                            <Clock size={12} /> Mới
                          </>
                        ) : (
                          <>
                            <CheckCircle size={12} /> Đã xử lý
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowDetail(true);
                          }}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        {contact.status === 'new' ? (
                          <button
                            onClick={() => handleUpdateStatus(contact.id, 'processed')}
                            className="p-2 text-text-muted hover:text-success hover:bg-success/5 rounded-lg transition-colors"
                            title="Đánh dấu đã xử lý"
                          >
                            <CheckCircle size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(contact.id, 'new')}
                            className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="Đánh dấu mới"
                          >
                            <Clock size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="p-2 text-text-muted hover:text-red hover:bg-red/5 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border-light">
            <p className="text-xs text-text-muted">
              Trang {page} / {totalPages} ({total} liên hệ)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal chi tiết liên hệ */}
      {showDetail && selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h2 className="text-lg font-bold text-navy">Chi tiết liên hệ</h2>
              <button
                onClick={() => setShowDetail(false)}
                className="p-1 hover:bg-bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Avatar + Tên */}
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold',
                    selectedContact.status === 'new' ? 'bg-primary' : 'bg-success'
                  )}
                >
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-navy text-lg">{selectedContact.name}</p>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full',
                      selectedContact.status === 'new'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-success/10 text-success'
                    )}
                  >
                    {selectedContact.status === 'new' ? '🟠 Chưa xử lý' : '✅ Đã xử lý'}
                  </span>
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="space-y-3 bg-bg-secondary rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Email</p>
                    <a href={`mailto:${selectedContact.email}`} className="text-sm text-navy font-medium hover:text-primary">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-text-muted">Số điện thoại</p>
                      <a href={`tel:${selectedContact.phone}`} className="text-sm text-navy font-medium hover:text-primary">
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Thời gian gửi</p>
                    <p className="text-sm text-navy font-medium">{formatDate(selectedContact.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Nội dung tin nhắn */}
              <div>
                <p className="text-sm font-semibold text-navy mb-2 flex items-center gap-2">
                  <User size={14} />
                  Nội dung tin nhắn
                </p>
                <div className="bg-bg-secondary rounded-xl p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border-light bg-bg-secondary/50 rounded-b-2xl">
              <button
                onClick={() => handleDelete(selectedContact.id)}
                className="inline-flex items-center gap-2 text-sm text-red hover:bg-red/5 px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Xóa
              </button>
              <div className="flex items-center gap-2">
                {selectedContact.status === 'new' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'processed')}
                    className="inline-flex items-center gap-2 bg-success text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-success/90 transition-colors"
                  >
                    <CheckCircle size={14} />
                    Đánh dấu đã xử lý
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'new')}
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <Clock size={14} />
                    Đánh dấu mới
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactsPage;
