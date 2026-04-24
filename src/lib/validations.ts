// ============================================================
// Validation Schemas - Sử dụng Zod cho form validation
// Dùng chung cho cả client (react-hook-form) và server (API)
// ============================================================

import { z } from 'zod';

// --- Auth schemas ---

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Vui lòng nhập họ')
    .max(100, 'Họ không quá 100 ký tự'),
  lastName: z
    .string()
    .min(1, 'Vui lòng nhập tên')
    .max(100, 'Tên không quá 100 ký tự'),
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự')
    .max(100, 'Mật khẩu không quá 100 ký tự'),
  phone: z
    .string()
    .optional(),
  gender: z
    .enum(['male', 'female', 'other'])
    .optional()
    .default('other'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// --- Product schemas (Admin CRUD) ---

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Vui lòng nhập tên sản phẩm')
    .max(500, 'Tên sản phẩm không quá 500 ký tự'),
  sku: z
    .string()
    .min(1, 'Vui lòng nhập mã SKU'),
  price: z
    .number({ coerce: true })
    .min(0, 'Giá phải >= 0'),
  comparePrice: z
    .number({ coerce: true })
    .min(0)
    .optional(),
  categoryId: z
    .number({ coerce: true })
    .optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.number({ coerce: true }).optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;

// --- Order status update ---

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']),
});

// --- User update (Admin) ---

export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(['customer', 'admin']).optional(),
  phone: z.string().optional(),
});
