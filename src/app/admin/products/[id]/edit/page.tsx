'use client';

// ============================================================
// Admin - Trang sửa sản phẩm
// Load data sản phẩm theo ID rồi truyền vào ProductForm
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { adminGetProduct } from '@/lib/api/products';
import type { Product } from '@/types';

const AdminEditProductPage = () => {
  const params = useParams();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await adminGetProduct(productId);
        setProduct(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Không tìm thấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
        <span className="ml-3 text-text-secondary">Đang tải sản phẩm...</span>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red text-lg font-semibold">{error || 'Không tìm thấy sản phẩm'}</p>
      </div>
    );
  }

  return <ProductForm product={product} />;
};

export default AdminEditProductPage;
