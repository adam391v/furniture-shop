// ============================================================
// Product Service - Gọi API sản phẩm từ client
// Tách biệt logic API khỏi UI components
// ============================================================

import { Product, ProductFilter, PaginatedResponse, Category } from '@/types';

const API_BASE = '/api';

// --- Helper: fetch wrapper ---
const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
};

// ============================================================
// PUBLIC API - Dùng cho storefront
// ============================================================

/** Lấy danh sách sản phẩm với filter, sort, pagination */
export const getProducts = async (
  filter?: ProductFilter
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams();

  if (filter?.search) params.set('search', filter.search);
  if (filter?.categorySlug) params.set('category', filter.categorySlug);
  if (filter?.minPrice) params.set('minPrice', filter.minPrice.toString());
  if (filter?.maxPrice) params.set('maxPrice', filter.maxPrice.toString());
  if (filter?.size) params.set('size', filter.size);
  if (filter?.sortBy) params.set('sortBy', filter.sortBy);
  if (filter?.page) params.set('page', filter.page.toString());
  if (filter?.limit) params.set('limit', filter.limit.toString());

  const query = params.toString();
  return fetcher<PaginatedResponse<Product>>(
    `${API_BASE}/products${query ? `?${query}` : ''}`
  );
};

/** Lấy chi tiết sản phẩm theo slug */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const data = await fetcher<{ product: Product }>(`${API_BASE}/products/${slug}`);
    return data.product;
  } catch {
    return null;
  }
};

/** Lấy sản phẩm nổi bật (trang chủ) */
export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  const data = await fetcher<{ products: Product[] }>(
    `${API_BASE}/products/featured?limit=${limit}`
  );
  return data.products;
};

/** Lấy sản phẩm liên quan */
export const getRelatedProducts = async (
  productId: number,
  categoryId?: number,
  limit = 4
): Promise<Product[]> => {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (categoryId) params.set('categoryId', categoryId.toString());
  params.set('excludeId', productId.toString());

  const data = await fetcher<PaginatedResponse<Product>>(
    `${API_BASE}/products?${params.toString()}`
  );
  return data.data;
};

/** Lấy danh sách danh mục */
export const getCategories = async (): Promise<Category[]> => {
  const data = await fetcher<{ categories: Category[] }>(`${API_BASE}/categories`);
  return data.categories;
};

// ============================================================
// ADMIN API - Dùng cho admin dashboard
// ============================================================

/** [Admin] Lấy danh sách sản phẩm */
export const adminGetProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ products: Product[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.search) searchParams.set('search', params.search);

  return fetcher(`${API_BASE}/admin/products?${searchParams.toString()}`);
};

/** [Admin] Lấy chi tiết sản phẩm theo ID */
export const adminGetProduct = async (id: number): Promise<Product> => {
  const data = await fetcher<{ product: Product }>(`${API_BASE}/admin/products/${id}`);
  return data.product;
};

/** [Admin] Tạo sản phẩm mới */
export const adminCreateProduct = async (data: Record<string, unknown>): Promise<Product> => {
  const res = await fetcher<{ product: Product }>(`${API_BASE}/admin/products`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.product;
};

/** [Admin] Cập nhật sản phẩm */
export const adminUpdateProduct = async (id: number, data: Record<string, unknown>): Promise<Product> => {
  const res = await fetcher<{ product: Product }>(`${API_BASE}/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.product;
};

/** [Admin] Xóa sản phẩm */
export const adminDeleteProduct = async (id: number): Promise<void> => {
  await fetcher(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' });
};

/** [Admin] Toggle active */
export const adminToggleProduct = async (id: number, isActive: boolean): Promise<void> => {
  await fetcher(`${API_BASE}/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  });
};
