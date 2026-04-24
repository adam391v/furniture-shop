'use client';

// ============================================================
// Admin - Form Tạo/Sửa Sản phẩm
// React Hook Form + Zod + Image Upload + Rich Text Editor
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { productSchema, type ProductInput } from '@/lib/validations';
import { adminCreateProduct, adminUpdateProduct, getCategories } from '@/lib/api/products';
import type { Product, Category } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface ProductFormProps {
  product?: Product;
}

const ProductForm = ({ product }: ProductFormProps) => {
  const router = useRouter();
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map((img) => img.imageUrl) || []
  );
  const [description, setDescription] = useState(product?.description || '');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          price: product.price,
          comparePrice: product.comparePrice || 0,
          categoryId: product.categoryId || undefined,
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          material: product.material || '',
          dimensions: product.dimensions || '',
          weight: product.weight || 0,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        }
      : { isActive: true, isFeatured: false, price: 0, comparePrice: 0 },
  });

  // Load danh mục
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const onSubmit = async (data: ProductInput) => {
    setLoading(true);
    try {
      const payload = { ...data, description, images: imageUrls };

      if (isEdit && product) {
        await adminUpdateProduct(product.id, payload);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await adminCreateProduct(payload);
        toast.success('Tạo sản phẩm thành công!');
      }
      router.push('/admin/products');
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-lg hover:bg-bg-secondary text-navy transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">
              {isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {isEdit ? `Đang sửa: ${product?.name}` : 'Điền đầy đủ thông tin sản phẩm'}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === Cột trái: 2/3 === */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 space-y-4">
            <h2 className="text-base font-bold text-navy">Thông tin cơ bản</h2>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Tên sản phẩm <span className="text-red">*</span></label>
              <input {...register('name')} placeholder="Ví dụ: Ghế Sofa 1m8 MOCHI" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
              {errors.name && <p className="text-xs text-red mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Mã SKU <span className="text-red">*</span></label>
                <input {...register('sku')} placeholder="NTXSF001" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
                {errors.sku && <p className="text-xs text-red mt-1">{errors.sku.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Giá bán (VNĐ) <span className="text-red">*</span></label>
                <input {...register('price', { valueAsNumber: true })} type="number" placeholder="9990000" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
                {errors.price && <p className="text-xs text-red mt-1">{errors.price.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Giá gốc (VNĐ)</label>
                <input {...register('comparePrice', { valueAsNumber: true })} type="number" placeholder="13990000" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Danh mục <span className="text-red">*</span></label>
                <select
                  {...register('categoryId', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary bg-white"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-xs text-red mt-1">{errors.categoryId.message}</p>}
              </div>
            </div>
          </div>

          {/* Mô tả sản phẩm - Rich Text */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 space-y-4">
            <h2 className="text-base font-bold text-navy">Mô tả sản phẩm</h2>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Mô tả ngắn</label>
              <input {...register('shortDescription')} placeholder="Tóm tắt 1-2 dòng..." className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            {/* Rich Text Editor cho mô tả chi tiết */}
            <RichTextEditor
              label="Mô tả chi tiết"
              value={description}
              onChange={setDescription}
              placeholder="Nhập mô tả chi tiết sản phẩm với định dạng phong phú..."
            />
          </div>

          {/* Thông số kỹ thuật */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 space-y-4">
            <h2 className="text-base font-bold text-navy">Thông số kỹ thuật</h2>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Chất liệu</label>
              <input {...register('material')} placeholder="Vải polyester, gỗ tự nhiên..." className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Kích thước</label>
                <input {...register('dimensions')} placeholder="W179 x D79 x H73 cm" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Trọng lượng (kg)</label>
                <input {...register('weight', { valueAsNumber: true })} type="number" step="0.1" placeholder="45" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          {/* Hình ảnh - Upload file */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
            <ImageUpload
              label="Hình ảnh sản phẩm"
              images={imageUrls}
              onChange={setImageUrls}
              maxFiles={10}
              multiple
            />
          </div>
        </div>

        {/* === Cột phải: 1/3 === */}
        <div className="space-y-6">
          {/* Trạng thái */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 space-y-4">
            <h2 className="text-base font-bold text-navy">Trạng thái</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-navy">Hiển thị sản phẩm</span>
              <input type="checkbox" {...register('isActive')} className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-navy">Sản phẩm nổi bật</span>
              <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 accent-primary" />
            </label>
          </div>

          {/* Danh mục đã chọn preview */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
            <h2 className="text-base font-bold text-navy mb-3">Xem trước ảnh chính</h2>
            <div className="aspect-square rounded-lg bg-bg-secondary overflow-hidden">
              {imageUrls[0] ? (
                <img src={imageUrls[0]} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs">Chưa có ảnh</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
