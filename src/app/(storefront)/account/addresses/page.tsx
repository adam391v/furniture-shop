'use client';

// ============================================================
// Account - Sổ địa chỉ (placeholder)
// ============================================================

import { MapPin } from 'lucide-react';

const AddressesPage = () => {
  return (
    <div className="bg-white rounded-xl border border-border-light">
      <div className="p-6 border-b border-border-light">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <MapPin size={20} />
          Sổ địa chỉ
        </h2>
        <p className="text-sm text-text-muted mt-1">Quản lý địa chỉ giao hàng</p>
      </div>
      <div className="p-12 text-center">
        <MapPin size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">Tính năng đang được phát triển</p>
      </div>
    </div>
  );
};

export default AddressesPage;
