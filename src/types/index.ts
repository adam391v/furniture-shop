// ============================================================
// Định nghĩa Type/Interface cho toàn bộ dự án Furniture Shop
// ============================================================

// --- Sản phẩm ---
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number;
  categoryId: number;
  category?: Category;
  material: string;
  dimensions: string;
  weight: number;
  soldCount: number;
  isActive: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
  createdAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  variantId?: number;
  imageUrl: string;
  altText: string;
  sortOrder: number;
}

// --- Danh mục ---
export interface Category {
  id: number;
  name: string;
  slug: string;
  iconUrl: string;
  imageUrl: string;
  parentId?: number;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
  productCount?: number;
}

// --- Người dùng ---
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  avatarUrl?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

// --- Giỏ hàng ---
export interface CartItem {
  id: number;
  productId: number;
  variantId?: number;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

// --- Đơn hàng ---
export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  note: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  paymentMethod: PaymentMethod;
  paidAt?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay';

// --- Đánh giá ---
export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  user?: Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>;
  createdAt: string;
}

// --- Banner ---
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
}

// --- Blog ---
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  authorName: string;
  createdAt: string;
}

// --- Filter & Pagination ---
export interface ProductFilter {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'bestseller';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
