'use client';

// ============================================================
// Admin - Quản lý Người dùng
// Danh sách user + đổi role + sửa + xóa
// ============================================================

import { useState } from 'react';
import { Search, Edit, Trash2, ShieldCheck, UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Mock data users
const initialUsers = [
  { id: 1, firstName: 'Admin', lastName: 'System', email: 'admin@furniture.com', phone: '0901000001', role: 'admin' as const, gender: 'male', createdAt: '01/01/2026' },
  { id: 2, firstName: 'Nguyễn', lastName: 'Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', role: 'customer' as const, gender: 'male', createdAt: '10/03/2026' },
  { id: 3, firstName: 'Trần', lastName: 'Thị B', email: 'tranthib@gmail.com', phone: '0912345678', role: 'customer' as const, gender: 'female', createdAt: '15/03/2026' },
  { id: 4, firstName: 'Lê', lastName: 'Văn C', email: 'levanc@gmail.com', phone: '0923456789', role: 'customer' as const, gender: 'male', createdAt: '20/03/2026' },
  { id: 5, firstName: 'Phạm', lastName: 'Thị D', email: 'phamthid@gmail.com', phone: '0934567890', role: 'customer' as const, gender: 'female', createdAt: '25/03/2026' },
  { id: 6, firstName: 'Hoàng', lastName: 'Văn E', email: 'hoangvane@gmail.com', phone: '0945678901', role: 'customer' as const, gender: 'male', createdAt: '01/04/2026' },
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<typeof initialUsers[0] | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: 'customer' as 'customer' | 'admin',
  });

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (user: typeof initialUsers[0]) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? { ...u, ...editForm }
          : u
      )
    );
    toast.success('Cập nhật người dùng thành công');
    setEditingUser(null);
  };

  const handleDelete = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success('Đã xóa người dùng');
    setDeleteModal(null);
  };

  const toggleRole = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === 'admin' ? 'customer' as const : 'admin' as const }
          : u
      )
    );
    toast.success('Đã thay đổi quyền');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Quản lý người dùng</h1>
        <p className="text-sm text-text-secondary mt-1">{users.length} người dùng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-border-light">
          <p className="text-sm text-text-secondary">Tổng người dùng</p>
          <p className="text-2xl font-bold text-navy mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-border-light">
          <p className="text-sm text-text-secondary">Admin</p>
          <p className="text-2xl font-bold text-primary mt-1">{users.filter((u) => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-border-light">
          <p className="text-sm text-text-secondary">Khách hàng</p>
          <p className="text-2xl font-bold text-success mt-1">{users.filter((u) => u.role === 'customer').length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-4">
        <div className="flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2.5">
          <Search size={16} className="text-text-muted" />
          <input
            type="text"
            placeholder="Tìm theo email hoặc tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary text-left text-xs text-text-muted uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Người dùng</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">SĐT</th>
                <th className="px-5 py-3 font-medium">Quyền</th>
                <th className="px-5 py-3 font-medium">Ngày tạo</th>
                <th className="px-5 py-3 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold',
                        user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-bg-secondary text-navy'
                      )}>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-navy">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-text-secondary">{user.email}</td>
                  <td className="px-5 py-3.5 text-sm text-text-secondary">{user.phone}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleRole(user.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                        user.role === 'admin'
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'bg-bg-secondary text-text-secondary hover:bg-border'
                      )}
                    >
                      {user.role === 'admin' ? <ShieldCheck size={12} /> : <UserIcon size={12} />}
                      {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-text-muted">{user.createdAt}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-2 text-text-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteModal(user.id)}
                        className="p-2 text-text-muted hover:text-red rounded-lg hover:bg-red/5 transition-colors"
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
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-navy mb-4">Sửa người dùng</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Họ</label>
                  <input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Tên</label>
                  <input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">SĐT</label>
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Quyền</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'customer' | 'admin' })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary bg-white"
                >
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-navy">Xác nhận xóa</h3>
            <p className="text-sm text-text-secondary mt-2">
              Bạn có chắc muốn xóa người dùng này? Hành động không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-navy hover:bg-bg-secondary transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                className="px-4 py-2 bg-red text-white rounded-lg text-sm font-semibold hover:bg-red-dark transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
