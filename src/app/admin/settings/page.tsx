'use client';

// ============================================================
// Admin - Cài đặt hệ thống
// ============================================================

import { useState } from 'react';
import { Save, Store, Truck, CreditCard, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    storeName: 'Moho Furniture',
    storeEmail: 'contact@moho.vn',
    storePhone: '0901 234 567',
    storeAddress: '162 Nguyễn Thị Minh Khai, Q.3, TP.HCM',
    freeShippingThreshold: '5000000',
    shippingFee: '50000',
    enableNotifications: true,
    enableReviews: true,
  });

  const handleSave = () => {
    toast.success('Đã lưu cài đặt');
  };

  const tabs = [
    { id: 'general', label: 'Thông tin cửa hàng', icon: Store },
    { id: 'shipping', label: 'Vận chuyển', icon: Truck },
    { id: 'payment', label: 'Thanh toán', icon: CreditCard },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Cài đặt</h1>
        <p className="text-sm text-text-secondary mt-1">Cấu hình hệ thống cửa hàng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-navy hover:bg-bg-secondary'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-border-light p-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-navy">Thông tin cửa hàng</h2>
              {[
                { label: 'Tên cửa hàng', key: 'storeName' },
                { label: 'Email', key: 'storeEmail' },
                { label: 'Số điện thoại', key: 'storePhone' },
                { label: 'Địa chỉ', key: 'storeAddress' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
                  <input
                    value={settings[key as keyof typeof settings] as string}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-navy">Cài đặt vận chuyển</h2>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Phí vận chuyển mặc định (VNĐ)</label>
                <input
                  value={settings.shippingFee}
                  onChange={(e) => setSettings({ ...settings, shippingFee: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Miễn phí ship cho đơn từ (VNĐ)</label>
                <input
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-navy">Phương thức thanh toán</h2>
              {['COD (Thanh toán khi nhận hàng)', 'Chuyển khoản ngân hàng', 'Ví MoMo', 'VNPay'].map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-bg-secondary transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-navy">{method}</span>
                </label>
              ))}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-navy">Cài đặt thông báo</h2>
              {[
                { label: 'Email thông báo đơn hàng mới', key: 'enableNotifications' },
                { label: 'Cho phép đánh giá sản phẩm', key: 'enableReviews' },
              ].map(({ label, key }) => (
                <label key={key} className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-bg-secondary transition-colors">
                  <span className="text-sm text-navy">{label}</span>
                  <input
                    type="checkbox"
                    checked={settings[key as keyof typeof settings] as boolean}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                </label>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border-light">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              <Save size={16} />
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
